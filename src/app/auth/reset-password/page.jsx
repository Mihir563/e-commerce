"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ResetPasswordPage() {
    const [step, setStep] = useState(1); // Step 1: Request reset, Step 2: Enter new password
    const [email, setEmail] = useState("");
    const [resetToken, setResetToken] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        // Check if email was passed from login page
        const savedEmail = localStorage.getItem("resetEmail");
        if (savedEmail) {
            setEmail(savedEmail);
            // Clear it after using
            localStorage.removeItem("resetEmail");
        }

        // If there's a token in the URL, move to step 2
        const urlParams = new URLSearchParams(window.location.search);
        const token = urlParams.get("token");
        if (token) {
            setResetToken(token);
            setStep(2);
        }
    }, []);

    const requestReset = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await axios.post("/api/auth/request-reset", { email });
            toast.success("Password reset link sent to your email", { theme: "dark" });
            // No need to change step here as the user will receive an email with a link
        } catch (err) {
            setError(err.response?.data?.error || "Failed to send reset link");
            toast.error("Failed to send reset link. Please try again.", { theme: "dark" });
        } finally {
            setLoading(false);
        }
    };

    const resetPassword = async (e) => {
        e.preventDefault();
        setError("");

        // Validate passwords
        if (newPassword !== confirmPassword) {
            setError("Passwords do not match");
            toast.error("Passwords do not match", { theme: "dark" });
            return;
        }

        if (newPassword.length < 6) {
            setError("Password must be at least 6 characters long");
            toast.error("Password must be at least 6 characters long", { theme: "dark" });
            return;
        }

        setLoading(true);

        try {
            await axios.post("/api/auth/reset-password", {
                token: resetToken,
                newPassword,
            });

            toast.success("Password has been reset successfully!", { theme: "dark", autoClose: 1500 });
            setTimeout(() => router.push("/auth/login"), 2000);
        } catch (err) {
            setError(err.response?.data?.error || "Failed to reset password");
            toast.error("Failed to reset password. Please try again.", { theme: "dark" });
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
            </div>

            <div className="max-w-md w-full bg-white/0 p-8 rounded-2xl shadow-lg border border-gray-700">
                <h2 className="text-3xl font-bold text-white text-center">
                    {step === 1 ? "Reset your password" : "Create new password"}
                </h2>

                {error && <p className="mt-3 text-center text-red-500">{error}</p>}

                {step === 1 ? (
                    // Step 1: Email form to request password reset
                    <form className="mt-6 space-y-6" onSubmit={requestReset}>
                        <div>
                            <label htmlFor="email" className="text-gray-300 block mb-1">
                                Email address
                            </label>
                            <input
                                id="email"
                                type="email"
                                required
                                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your account email"
                            />
                        </div>

                        <p className="text-gray-400 text-sm">
                            We'll send you a link to reset your password. Please check your email after submitting.
                        </p>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg transition-all disabled:opacity-50"
                        >
                            {loading ? "Sending..." : "Send reset link"}
                        </button>
                    </form>
                ) : (
                    // Step 2: Form to enter new password
                    <form className="mt-6 space-y-6" onSubmit={resetPassword}>
                        <div>
                            <label htmlFor="newPassword" className="text-gray-300 block mb-1">
                                New Password
                            </label>
                            <input
                                id="newPassword"
                                type="password"
                                required
                                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                                minLength={6}
                            />
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="text-gray-300 block mb-1">
                                Confirm New Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                required
                                className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Confirm your new password"
                                minLength={6}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-lg transition-all disabled:opacity-50"
                        >
                            {loading ? "Updating..." : "Reset Password"}
                        </button>
                    </form>
                )}

                <div className="mt-6 text-center">
                    <Link href="/auth/login" className="text-indigo-400 hover:text-indigo-300">
                        Back to login
                    </Link>
                </div>
            </div>

            <ToastContainer />
        </div>
    );
}