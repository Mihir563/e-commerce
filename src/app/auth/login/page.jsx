"use client";

import { useState, useEffect } from "react";
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
    const [failedAttempts, setFailedAttempts] = useState(0);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const router = useRouter();

    // Check if we should show the forgot password button based on failed attempts
    useEffect(() => {
        if (failedAttempts >= 2) {
            setShowForgotPassword(true);
        }
    }, [failedAttempts]);

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
            setFailedAttempts(prevAttempts => prevAttempts + 1);
            setError("Invalid email or password");
            toast.error("Login failed. Please check your credentials.", { theme: "dark" });
        } finally {
            setLoading(false);
        }
    };

    const handleForgotPassword = () => {
        // Store the email for the password reset page
        if (formData.email) {
            localStorage.setItem("resetEmail", formData.email);
        }
        router.push("/auth/reset-password");
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black relative z-10">
            <div className="absolute inset-0 overflow-hidden -z-10">
                <div className="absolute top-1/4 left-1/4 w-40 h-40 rounded-full bg-blue-500/20 animate-float-slow"></div>
                <div className="absolute top-3/4 left-1/2 w-60 h-60 rounded-full bg-purple-500/20 animate-float-medium"></div>
                <div className="absolute top-1/2 left-3/4 w-32 h-32 rounded-full bg-blue-600/20 animate-float-fast"></div>
                <div className="absolute top-1/4 right-1/4 w-48 h-48 rounded-full bg-indigo-500/20 animate-float-reverse"></div>

                {/* New Floating Elements */}
                <div className="absolute top-1/6 right-1/6 w-36 h-36 rounded-full bg-red-500/20 animate-float-zigzag"></div>
                <div className="absolute bottom-1/4 left-1/6 w-44 h-44 rounded-full bg-green-500/20 animate-float-wavy"></div>
                <div className="absolute top-1/5 right-1/5 w-38 h-38 rounded-full bg-yellow-500/20 animate-float-circular"></div>
                <div className="absolute bottom-1/5 right-1/4 w-50 h-50 rounded-full bg-teal-500/20 animate-float-expand-contract"></div>
            </div>
            <div className="max-w-md w-full bg-white/0 p-8 rounded-2xl shadow-lg border border-gray-700">
                <h2 className="text-3xl font-bold text-white text-center">Sign in to your account</h2>

                {error && <p className="mt-3 text-center text-red-500">{error}</p>}
                {failedAttempts > 0 && (
                    <p className="mt-2 text-center text-yellow-400 text-sm">
                        Failed attempts: {failedAttempts}
                    </p>
                )}

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

                    {/* Forgot Password Button - Only shows after 2 failed attempts */}
                    {showForgotPassword && (
                        <button
                            type="button"
                            onClick={handleForgotPassword}
                            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-lg transition-all mt-2"
                        >
                            Forgot Password?
                        </button>
                    )}
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