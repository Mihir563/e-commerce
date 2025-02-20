"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoginPage() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const result = await signIn("credentials", {
                redirect: false,
                email: formData.email,
                password: formData.password,
            });

            if (result.error) throw new Error(result.error);

            const response = await axios.post("/api/auth/login", formData);
            localStorage.setItem("user", JSON.stringify(response.data));

            toast.success("Login successful!", { theme: "dark", autoClose: 1500 });
            setTimeout(() => router.push("/"), 1500);
        } catch (err) {
            setError("Invalid email or password");
            toast.error("Login failed. Please check your credentials.", { theme: "dark" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black">
            <div className="max-w-md w-full bg-gray-900 p-8 rounded-2xl shadow-lg border border-gray-700">
                <h2 className="text-3xl font-bold text-white text-center">Sign in to your account</h2>

                {error && <p className="mt-3 text-center text-red-500">{error}</p>}

                <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
                    {/* Email Input */}
                    <div>
                        <label htmlFor="email" className="text-gray-300 block mb-1">
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Password Input */}
                    <div>
                        <label htmlFor="password" className="text-gray-300 block mb-1">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Sign In Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg transition-all disabled:opacity-50"
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                {/* Sign Up Link */}
                <p className="mt-4 text-gray-400 text-center">
                    Don't have an account?{" "}
                    <Link href="/auth/signup" className="text-indigo-400 hover:text-indigo-300 font-semibold">
                        Sign up
                    </Link>
                </p>
            </div>

            <ToastContainer />
        </div>
    );
}
