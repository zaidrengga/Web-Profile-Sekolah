"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const { isAuthenticated, loading, login, error, setError } = useAuth();

  // 🔑 Redirect dilakukan di useEffect, bukan di return
  useEffect(() => {
    if (isAuthenticated && !loading) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, loading, router]);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!email || !password) {
      setError("Email & password wajib diisi");
      toast.error("Email & password wajib diisi");
      return;
    }

    try {
      const success = await login(email, password);
      if (success) {
        router.push("/dashboard");
      } else {
        toast.error(error || "Login gagal");
      }
    } catch (err) {
      console.error("Error login:", err);
      setError("Error login");
      toast.error("Error login");
    }
  }

  return (
    <div className="flex h-[calc(100vh-56px)] items-center justify-center bg-gray-100">
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <form
          onSubmit={handleLogin}
          className="bg-white p-6 rounded-xl shadow-md w-80"
        >
          <h2 className="text-xl font-bold mb-4 text-center">
            Login Menggunakan Email Sekolah
          </h2>

          {error && <p className="text-red-500 mb-2 text-center">{error}</p>}

          <input
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              setError("");
            }}
            className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Loading..." : "Login"}
          </Button>
        </form>
      )}
    </div>
  );
}