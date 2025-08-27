"use client";

import { useEffect, useState } from "react";
import { crudActions } from "@/lib/crud-actions";

export function useCrud<T extends { id: string }>(table: string) {
    const [items, setItems] = useState<T[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // --- FETCH ALL ---
        const fetchAll = async () => {
            setLoading(true);
            try {
                const data = await crudActions.getAll<T>(table);
                if (data) setItems(data);
            } catch (err) {
                console.error("fetchAll error:", err);
                setError("Gagal mengambil data");
            } finally {
                setLoading(false);
            }
        };
        fetchAll();
    }, [table]);

    // --- ADD ---
    const add = async (item: T) => {
        setLoading(true);
        try {
            const data = await crudActions.add<T>(table, item);
            if (data) setItems((prev) => [...prev, ...data]);
            return true;
        } catch (err) {
            setError("Gagal menambahkan data");
            console.error("add error:", err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // --- UPDATE ---
    const update = async (id: string, item: Partial<T>) => {
        setLoading(true);
        try {
            const data = await crudActions.update<T>(table, id, item);
            if (data) {
                setItems((prev) => prev.map((el) => (el as T).id === id ? { ...el, ...data[0] } : el));
            }
            return true;
        } catch (err) {
            setError("Gagal mengedit data");
            console.error("update error:", err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    // --- DELETE ---
    const remove = async (id: string) => {
        setLoading(true);
        try {
            const success = await crudActions.remove(table, id);
            if (success) setItems((prev) => prev.filter((el) => (el as T).id !== id));
            return success;
        } catch (err) {
            setError("Gagal menghapus data");
            console.error("remove error:", err);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return { items, loading, error, add, update, remove, setError };
}