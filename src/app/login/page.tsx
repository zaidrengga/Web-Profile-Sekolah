"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { redirect } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");


    const { isAuthenticated, loading, login, error, setError } = useAuth();

    if (isAuthenticated && !loading) {
        return redirect("/dashboard");
    }

    async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (!email || !password) {
            setError("Email & password wajib diisi");
            return;
        }
        try {
            await login(email, password);
            if (error) {
                console.error("Error login:", error);
                setError(error);
            }
            else {
                redirect("/dashboard");
            }
        } catch (err) {
            setError("Error login");
            console.error("Error login:", err);
        }
    }

    return (
        <div className="flex h-screen items-center justify-center bg-gray-100">
            <form
                onSubmit={handleLogin}
                className="bg-white p-6 rounded-xl shadow-md w-80"
            >
                <h2 className="text-xl font-bold mb-4 text-center">Login</h2>
                {error && <p className="text-red-500 mb-2 text-center">{error}</p>}
                <input
                    type="email"
                    placeholder="Email"
                    autoComplete="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setError(""); }}
                    className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <input
                    type="password"
                    placeholder="Password"
                    autoComplete="current-password"
                    value={password}
                    onChange={e => { setPassword(e.target.value); setError(""); }}
                    className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Loading..." : "Login"}
                </Button>
            </form>
        </div>
    );
}
