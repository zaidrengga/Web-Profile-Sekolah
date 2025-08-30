"use client";

import { User } from "@/lib/types";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface AuthContextProps {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    error: string | null;
    setError: (error: string | null) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const router = useRouter(); // ⬅️ aman, dipanggil selalu di level atas
    const isAuthenticated = !!user;

    // Ambil user dari /api/auth/me
    const loadUser = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/auth/me");
            if (!res.ok) {
                setUser(null);
                return;
            }
            const u = await res.json();
            setUser(u.user as User);
        } catch (err) {
            console.error("Error loadUser:", err);
            setUser(null);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUser();
    }, [loadUser]);

    // Login
    const login = async (email: string, password: string): Promise<boolean> => {
        if (!email || !password) {
            setError("Email & password wajib diisi");
            toast.error("Email & password wajib diisi");
            return false;
        }
        setLoading(true);
        try {
            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            if (!res.ok) {
                setError("Email atau password salah");
                toast.error("Email atau password salah");
                return false;
            }

            const u = await res.json();
            setUser(u.user as User);
            toast.success("Berhasil login");

            // ⬅️ gunakan router.push, jangan redirect()
            router.push("/dashboard");
            return true;
        } catch (err) {
            console.error("login error:", err);
            setError("Error login");
            toast.error("Error login");
            return false;
        } finally {
            setLoading(false);
        }
    };

    // Logout
    const logout = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/auth/logout", { method: "POST" });
            if (!res.ok) throw new Error("Error logout");
            window.location.href = "/";
            setUser(null);
            toast.success("Berhasil logout");
        } catch (err) {
            console.error("logout error:", err);
            toast.error("Error logout");
        } finally {
            setLoading(false);
        }
    };



    return (
        <AuthContext.Provider
            value={{ user, isAuthenticated, loading, login, logout, error, setError }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return ctx;
}