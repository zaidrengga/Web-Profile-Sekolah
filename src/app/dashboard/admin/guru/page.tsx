"use client";

import React, { useState } from "react";
import Loading from "@/components/ui/loading";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Guru } from "@/lib/types";
import { Pen, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCrud } from "@/hooks/use-crud";

const AdminGurusPage = () => {
    const { items: gurus, loading, remove: removeGuru, update: editGuru } = useCrud<Guru>("gurus");
    const [editingGuru, setEditingGuru] = useState<Guru | null>(null);
    const [editNama, setEditNama] = useState("");
    const [editNip, setEditNip] = useState("");
    const [editAlamat, setEditAlamat] = useState("");
    const [editTelepon, setEditTelepon] = useState("");

    const handleDelete = async (id: Guru["id"]) => {
        const confirmed = confirm("Apakah yakin ingin menghapus guru ini?");
        if (!confirmed) return;
        await removeGuru(id);
    };

    const handleEditSave = async () => {
        if (!editingGuru) return;
        await editGuru(editingGuru.id!, { nama: editNama, nip: editNip, alamat: editAlamat, telepon: editTelepon });
        setEditingGuru(null);
    };

    if (loading) return <Loading />;

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Admin Guru</h1>
                <Button asChild>
                    <Link href="/dashboard/admin/guru/new">Tambah Guru <Plus /></Link>
                </Button>
            </div>

            <div className="rounded-lg border shadow-md overflow-hidden">
                <Table>
                    <TableHeader className="bg-foreground/10">
                        <TableRow>
                            <TableHead>No</TableHead>
                            <TableHead>Nama</TableHead>
                            <TableHead>NIP</TableHead>
                            <TableHead>Alamat</TableHead>
                            <TableHead>Telepon</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {gurus.map((guru, index) => (
                            <TableRow key={guru.id}>
                                <TableCell>{index + 1}</TableCell>
                                <TableCell>{guru.nama}</TableCell>
                                <TableCell>{guru.nip}</TableCell>
                                <TableCell>{guru.alamat}</TableCell>
                                <TableCell>{guru.telepon}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => {
                                                setEditingGuru(guru);
                                                setEditNama(guru.nama);
                                                setEditNip(guru.nip || "");
                                                setEditAlamat(guru.alamat || "");
                                                setEditTelepon(guru.telepon || "");
                                            }}
                                        >
                                            <Pen />
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => handleDelete(guru.id!)}
                                        >
                                            <Trash2 />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Modal Edit Guru */}
            {editingGuru && (
                <div className="fixed inset-0 bg-foreground/20 flex items-center justify-center z-50">
                    <div className="bg-background p-6 rounded-lg w-96 shadow-lg space-y-4">
                        <h2 className="text-lg font-bold">Edit Guru</h2>
                        <input
                            type="text"
                            value={editNama}
                            onChange={(e) => setEditNama(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Nama"
                        />
                        <input
                            type="text"
                            value={editNip}
                            onChange={(e) => setEditNip(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="NIP"
                        />
                        <input
                            type="text"
                            value={editAlamat}
                            onChange={(e) => setEditAlamat(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Alamat"
                        />
                        <input
                            type="text"
                            value={editTelepon}
                            onChange={(e) => setEditTelepon(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Telepon"
                        />
                        <div className="flex justify-end gap-2">
                            <Button onClick={() => setEditingGuru(null)} variant="outline">
                                Cancel
                            </Button>
                            <Button onClick={handleEditSave}>Save</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminGurusPage;