"use client";

import React, { useState } from "react"
import { Button } from "@/components/ui/button";
import Loading from "@/components/ui/loading";
import { useRouter } from "next/navigation";
import { Guru, User } from "@/lib/types";
import { useCrud } from "@/hooks/use-crud";
const AdminGuruNewPage = () => {
    const { add: addGuru, loading: gurusLoading } = useCrud<Guru>("gurus");
    const { items: users, loading: usersLoading } = useCrud<User>("users");
    const [selectedUserId, setSelectedUserId] = useState<string>("");
    const [nama, setNama] = useState("");
    const [nip, setNip] = useState("");
    const [alamat, setAlamat] = useState("");
    const [telepon, setTelepon] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedUserId || !nama) {
            setError("User dan Nama wajib diisi");
            return;
        }

        setLoading(true);
        try {
            const success = await addGuru({
                user_id: selectedUserId,
                nama,
                nip: nip || null,
                alamat: alamat || null,
                telepon: telepon || null,
            } as Guru);

            if (success) router.push("/dashboard/admin/guru");
            else setError("Gagal menambahkan guru");
        } catch (err) {
            console.error(err);
            setError("Terjadi kesalahan");
        } finally {
            setLoading(false);
        }
    };

    if (gurusLoading || usersLoading) return <Loading />;

    return (
        <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md space-y-4">
            <h1 className="text-2xl font-bold">Tambah Guru Baru</h1>
            {error && <p className="text-red-500">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block mb-1 font-medium">Pilih User</label>
                    <select
                        value={selectedUserId}
                        onChange={(e) => setSelectedUserId(e.target.value)}
                        className="w-full p-2 border rounded"
                    >
                        <option value="">-- Pilih User --</option>
                        {users.map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.username} ({user.email})
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block mb-1 font-medium">Nama</label>
                    <input
                        type="text"
                        value={nama}
                        onChange={(e) => setNama(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Nama guru"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">NIP</label>
                    <input
                        type="text"
                        value={nip}
                        onChange={(e) => setNip(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="NIP (opsional)"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Alamat</label>
                    <input
                        type="text"
                        value={alamat}
                        onChange={(e) => setAlamat(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Alamat (opsional)"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium">Telepon</label>
                    <input
                        type="text"
                        value={telepon}
                        onChange={(e) => setTelepon(e.target.value)}
                        className="w-full p-2 border rounded"
                        placeholder="Telepon (opsional)"
                    />
                </div>
                <Button type="submit" disabled={loading}>
                    {loading ? "Menyimpan..." : "Tambah Guru"}
                </Button>
            </form>
        </div>
    );
};

export default AdminGuruNewPage;