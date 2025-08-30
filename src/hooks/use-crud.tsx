"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

export function useCrud<T extends { id: string }>(table: string) {
    const [items, setItems] = useState<T[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    // --- FETCH ALL ---
    useEffect(() => {
        const fetchAll = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/crud/${table}`);
                if (!res.ok) throw new Error("Gagal fetch data");
                const data = await res.json();
                setItems(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("fetchAll error:", err);
                setError("Gagal mengambil data");
                toast.error("Gagal mengambil data");
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [table]);

    // --- ADD ---
    const add = async (item: T): Promise<boolean> => {
        try {
            const res = await fetch(`/api/crud/${table}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(item),
            });
            if (!res.ok) throw new Error("Gagal menambahkan data");
            const data = await res.json();
            if (Array.isArray(data)) {
                setItems(prev => [...prev, ...data]);
            } else {
                setItems(prev => [...prev, item]); // fallback
            }
            return true;
        } catch (err) {
            console.error("add error:", err);
            setError("Gagal menambahkan data");
            toast.error("Gagal menambahkan data");
            return false;
        }
    };

    // --- UPDATE ---
    const update = async (id: string, item: Partial<T>): Promise<boolean> => {
        try {
            const res = await fetch(`/api/crud/${table}/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(item),
            });
            if (!res.ok) throw new Error("Gagal mengedit data");
            const data = await res.json();
            setItems(prev =>
                prev.map(el => (el.id === id ? { ...el, ...(Array.isArray(data) ? data[0] : data) } : el))
            );
            return true;
        } catch (err) {
            console.error("update error:", err);
            setError("Gagal mengedit data");
            toast.error("Gagal mengedit data");
            return false;
        }
    };

    // --- DELETE ---
    const remove = async (id: string): Promise<boolean> => {
        try {
            const res = await fetch(`/api/crud/${table}/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Gagal menghapus data");
            setItems(prev => prev.filter(el => el.id !== id));
            return true;
        } catch (err) {
            console.error("remove error:", err);
            setError("Gagal menghapus data");
            toast.error("Gagal menghapus data");
            return false;
        }
    };

    return { items, loading, error, add, update, remove, setError, setLoading, setItems };
}