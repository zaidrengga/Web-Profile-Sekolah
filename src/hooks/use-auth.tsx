"use client";

import { User } from "@/lib/types";
import { createContext, useContext, useState, useEffect } from "react";
import { getUser, postLogin, logoutCookie } from "@/lib/auth-actions";
import { redirect } from "next/navigation";

interface AuthContextProps {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    error: string | null;
    setError: (error: string | null) => void;
}

const defaultValue: AuthContextProps = {
    user: null,
    isAuthenticated: false,
    loading: true,
    login: async () => false,
    logout: async () => { },
    error: null,
    setError: () => { },
};

export const AuthContext = createContext<AuthContextProps>(defaultValue);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const isAuthenticated = !!user;

    useEffect(() => {

        async function loadUser() {
            setLoading(true);
            try {
                const u = await getUser();
                if (u) setUser(u as User);
            } catch (err) {
                console.error("Error loading user:", err);
            } finally {
                setLoading(false);
            }
        }
        loadUser();
    }, []);

    const login = async (email: string, password: string) => {
        if (!email || !password) {
            setError("Email & password wajib diisi");
            return false;
        }
        setLoading(true);
        try {
            const res = await postLogin(email, password);
            if (!res) return false;
            setUser(res as User);
            return true;
        } catch (err) {
            setError("Error login");
            console.error("Error login:", err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        setLoading(true);
        try {
            await logoutCookie();
            setUser(null);
            redirect("/login");
        } catch (err) {
            console.error("Error logout:", err);
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
    return useContext(AuthContext);
}
