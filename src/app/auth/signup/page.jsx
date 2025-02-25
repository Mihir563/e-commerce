"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function SignupPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
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

        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match");
            toast.error("Passwords do not match!", { theme: "dark" });
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/auth/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                }),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Something went wrong");

            localStorage.setItem("user", JSON.stringify(formData));

            toast.success("Account created successfully!", { theme: "dark", autoClose: 1500 });
            setTimeout(() => router.push("/auth/login"), 1500);
        } catch (err) {
            setError(err.message);
            toast.error(err.message, { theme: "dark" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black relative z-10">
            <div className="absolute inset-0 overflow-hidden -z-10">
                <div className="absolute top-1/4 left-1/4 w-40 h-40 rounded-full bg-blue-500/20 animate-float-slow"></div>
                <div className="absolute top-3/4 left-1/2 w-60 h-60 rounded-full bg-purple-500/20 animate-float-medium"></div>
                <div className="absolute top-1/2 left-3/4 w-32 h-32 rounded-full bg-blue-600/20 animate-float-fast"></div>
                <div className="absolute top-1/4 right-1/4 w-48 h-48 rounded-full bg-indigo-500/20 animate-float-reverse"></div>
                <div className="absolute top-1/6 right-1/6 w-36 h-36 rounded-full bg-red-500/20 animate-float-zigzag"></div>
                <div className="absolute bottom-1/4 left-1/6 w-44 h-44 rounded-full bg-green-500/20 animate-float-wavy"></div>
                <div className="absolute top-1/5 right-1/5 w-38 h-38 rounded-full bg-yellow-500/20 animate-float-circular"></div>
                <div className="absolute bottom-1/5 right-1/4 w-50 h-50 rounded-full bg-teal-500/20 animate-float-expand-contract"></div>  
            </div>
            <div className="relative  max-w-md w-full bg-white/0 p-8 rounded-2xl shadow-lg border border-gray-700">
                <h2 className="text-3xl font-bold text-white text-center">Create Your Account</h2>

                {error && <p className="mt-3 text-center text-red-500">{error}</p>}

                <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
                    {/* Name Input */}
                    <div>
                        <label htmlFor="name" className="text-gray-300 block mb-1">
                            Name
                        </label>
                        <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={formData.name}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Email Input */}
                    <div>
                        <label htmlFor="email" className="text-gray-300 block mb-1">
                            Email Address
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

                    {/* Confirm Password Input */}
                    <div>
                        <label htmlFor="confirmPassword" className="text-gray-300 block mb-1">
                            Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            required
                            className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>

                    {/* Sign Up Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg transition-all disabled:opacity-50"
                    >
                        {loading ? "Creating Account..." : "Sign Up"}
                    </button>
                </form>

                {/* Login Link */}
                <p className="mt-4 text-gray-400 text-center">
                    Already have an account?{" "}
                    <Link href="/auth/login" className="text-indigo-400 hover:text-indigo-300 font-semibold">
                        Sign in
                    </Link>
                </p>
            </div>

            <ToastContainer />
        </div>
    );
}
    