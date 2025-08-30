"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { Eye, EyeClosed } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [openPassword, setOpenPassword] = useState<boolean>(false);

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
          className="bg-white p-6 rounded-xl shadow-md w-80 space-y-4"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">
            <span>Login</span>
            <br />
            <span className="text-primary">{process.env.NEXT_PUBLIC_APP_NAME}</span>
          </h2>

          {error && <p className="text-red-500 mb-2 text-center">{error}</p>}

          <Input
            type="email"
            placeholder="Email"
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
          />

          <div className="relative">
            <Input
              type={openPassword ? "text" : "password"}
              placeholder="Password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError("");
              }}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              onClick={() => setOpenPassword(!openPassword)}
            >
              {openPassword ? <Eye /> : <EyeClosed />}
            </button>
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Loading..." : "Login"}
          </Button>
        </form>
      )}
    </div>
  );
}