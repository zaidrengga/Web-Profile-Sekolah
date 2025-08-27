"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import Loading from "@/components/ui/loading";
import { useRouter } from "next/navigation";
import { Kelas, Siswa, User } from "@/lib/types";
import { useCrud } from "@/hooks/use-crud";

const AdminSiswaNewPage = () => {
    const { add: createSiswa, loading: siswasLoading } = useCrud<Siswa>("siswas");
    const { items: users, loading: usersLoading } = useCrud<User>("users");
    const { items: kelas, loading: kelasLoading } = useCrud<Kelas>("kelas");
    const [userId, setUserId] = useState("");
    const [nama, setNama] = useState("");
    const [nisn, setNisn] = useState("");
    const [alamat, setAlamat] = useState("");
    const [telepon, setTelepon] = useState("");
    const [kelasId, setKelasId] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!userId || !nama || !nisn || !kelasId) {
            setError("User, Nama, NISN, dan Kelas wajib diisi");
            return;
        }

        setLoading(true);
        try {
            // 1. buat siswa
            const siswa = await createSiswa({
                id: crypto.randomUUID(),
                user_id: userId,
                nama,
                nisn,
                alamat,
                kelas_id: kelasId,
                telepon_wali: telepon,
            });

            if (siswa) {
                router.push("/dashboard/admin/siswas");
            } else {
                setError("Gagal menambahkan siswa");
            }
        } catch (err) {
            console.error(err);
            setError("Terjadi kesalahan");
        } finally {
            setLoading(false);
        }
    };

    if (siswasLoading || usersLoading || kelasLoading) return <Loading />;

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-4">
            <h1 className="text-2xl font-bold">Tambah Siswa Baru</h1>
            {error && <p className="text-red-500">{error}</p>}

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Pilih User */}
                <div>
                    <label className="block mb-1 font-medium">User</label>
                    <select
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">-- Pilih User --</option>
                        {users.map((u) => (
                            <option key={u.id} value={u.id}>
                                {u.email}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Nama */}
                <div>
                    <label className="block mb-1 font-medium">Nama</label>
                    <input
                        type="text"
                        value={nama}
                        onChange={(e) => setNama(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Masukkan nama siswa"
                    />
                </div>

                {/* NISN */}
                <div>
                    <label className="block mb-1 font-medium">NISN</label>
                    <input
                        type="text"
                        value={nisn}
                        onChange={(e) => setNisn(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Masukkan NISN"
                    />
                </div>

                {/* Alamat */}
                <div>
                    <label className="block mb-1 font-medium">Alamat</label>
                    <input
                        type="text"
                        value={alamat ?? ""}
                        onChange={(e) => setAlamat(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Masukkan alamat"
                    />
                </div>

                {/* Telepon */}
                <div>
                    <label className="block mb-1 font-medium">Telepon Wali</label>
                    <input
                        type="text"
                        value={telepon ?? ""}
                        onChange={(e) => setTelepon(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Masukkan nomor telepon wali"
                    />
                </div>

                {/* Pilih Kelas */}
                <div>
                    <label className="block mb-1 font-medium">Kelas</label>
                    <select
                        value={kelasId}
                        onChange={(e) => setKelasId(e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">-- Pilih Kelas --</option>
                        {kelas.map((k: Kelas) => (
                            <option key={k.id} value={k.id}>
                                {k.nama_kelas}
                            </option>
                        ))}
                    </select>
                </div>

                <Button type="submit" disabled={loading}>
                    {loading ? "Menyimpan..." : "Tambah Siswa"}
                </Button>
            </form>
        </div>
    );
};

export default AdminSiswaNewPage;