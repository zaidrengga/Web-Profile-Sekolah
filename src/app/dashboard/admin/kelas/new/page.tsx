"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Loading from "@/components/ui/loading";
import { useRouter } from "next/navigation";
import { useCrud } from "@/hooks/use-crud";
import { Guru, Kelas } from "@/lib/types";

const AdminKelasNewPage = () => {
    const { add: addNewKelas } = useCrud<Kelas>("kelas");
    const { items: gurus, loading: loadingGurus } = useCrud<Guru>("gurus");
    const [namaKelas, setNamaKelas] = useState("");
    const [waliKelas, setWaliKelas] = useState("");
    const [tahunAjaran, setTahunAjaran] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!namaKelas || !waliKelas) {
            setError("Nama Kelas & Wali Kelas wajib diisi");
            return;
        }

        setLoading(true);
        try {
            const success = await addNewKelas({
                id: crypto.randomUUID(),
                nama_kelas: namaKelas,
                wali_kelas_id: waliKelas,
                tahun_ajaran: tahunAjaran,
            });
            if (success) {
                router.push("/dashboard/admin/kelas"); // redirect ke halaman kelas
            } else {
                setError("Gagal menambahkan kelas");
            }
        } catch (err) {
            console.error(err);
            setError("Terjadi kesalahan");
        } finally {
            setLoading(false);
        }
    };

    if (loadingGurus) return <Loading />;

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-4">
            <h1 className="text-2xl font-bold">Tambah Kelas Baru</h1>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">Nama Kelas</label>
                    <input
                        type="text"
                        value={namaKelas}
                        onChange={(e) => setNamaKelas(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Contoh: 10 IPA 1"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Tahun Ajaran</label>
                    <input
                        type="text"
                        value={tahunAjaran}
                        onChange={(e) => setTahunAjaran(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Contoh: 2023/2024"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Wali Kelas</label>
                    <select
                        value={waliKelas}
                        onChange={(e) => setWaliKelas(e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">Pilih Wali Kelas</option>
                        {gurus.map((guru) => (
                            <option key={guru.id} value={guru.id}>
                                {guru.nama}
                            </option>
                        ))}
                    </select>
                </div>
                <Button type="submit" disabled={loading}>
                    {loading ? "Menyimpan..." : "Tambah Kelas"}
                </Button>
            </form>
        </div>
    );
};

export default AdminKelasNewPage;