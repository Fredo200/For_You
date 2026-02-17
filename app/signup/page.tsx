"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const { signup, signInWithGoogle } = useAuth();
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            return setError("Passwords do not match");
        }

        try {
            await signup(email, password);
            router.push("/");
        } catch (err: any) {
            setError(err.message || "Failed to create account");
        }
    };

    const handleGoogleSignIn = async () => {
        setError("");
        try {
            await signInWithGoogle();
            router.push("/");
        } catch (err: any) {
            setError(err.message || "Failed to sign in with Google");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-900 to-indigo-900 p-4 font-sans text-white">
            <div className="w-full max-w-md rounded-3xl bg-white/10 p-8 backdrop-blur-md border border-white/10 shadow-2xl">
                <h1 className="mb-2 text-center text-3xl font-bold">Create Account</h1>
                <p className="mb-8 text-center text-blue-200">Join For You today</p>

                {error && (
                    <div className="mb-4 rounded-lg bg-red-500/20 p-3 text-center text-sm text-red-200 border border-red-500/20">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-blue-200">Email</label>
                        <input
                            type="email"
                            required
                            className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-blue-200">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="mb-2 block text-sm font-medium text-blue-200">Confirm Password</label>
                        <input
                            type="password"
                            required
                            className="w-full rounded-xl bg-white/5 border border-white/10 p-3 text-white placeholder-blue-300/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full rounded-xl bg-blue-600 py-3.5 font-bold text-white shadow-lg shadow-blue-600/30 hover:bg-blue-500 transition-all active:scale-[0.98]"
                    >
                        Sign Up
                    </button>
                </form>

                <div className="my-6 flex items-center gap-4">
                    <div className="h-px flex-1 bg-white/20"></div>
                    <span className="text-sm text-blue-200">OR</span>
                    <div className="h-px flex-1 bg-white/20"></div>
                </div>

                <button
                    onClick={handleGoogleSignIn}
                    className="w-full rounded-xl bg-white py-3.5 font-bold text-slate-800 shadow-lg hover:bg-gray-100 transition-all active:scale-[0.98] flex items-center justify-center gap-3"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continue with Google
                </button>

                <p className="mt-8 text-center text-sm text-blue-200">
                    Already have an account?{" "}
                    <Link href="/login" className="font-semibold text-white hover:underline">
                        Log In
                    </Link>
                </p>
            </div>
        </div>
    );
}
