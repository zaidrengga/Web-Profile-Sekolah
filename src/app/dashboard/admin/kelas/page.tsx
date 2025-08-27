"use client";

import Loading from '@/components/ui/loading';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Guru, Kelas } from '@/lib/types';
import { Pen, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useCrud } from '@/hooks/use-crud';

const AdminKelasPage = () => {
    const { items: kelas, loading, remove: removeKelas, update: editKelas } = useCrud<Kelas>("kelas");
    const { items: gurus, loading: loadingGurus } = useCrud<Guru>("gurus");
    const [editingKelas, setEditingKelas] = useState<Kelas | null>(null);
    const [editNamaKelas, setEditNamaKelas] = useState("");
    const [editWaliKelas, setEditWaliKelas] = useState("");

    const handleDelete = async (id: Kelas["id"]) => {
        const confirmed = confirm("Apakah yakin ingin menghapus kelas ini?");
        if (!confirmed) return;
        await removeKelas(id);
    };

    const handleEditSave = async () => {
        if (!editingKelas) return;
        await editKelas(editingKelas.id, { nama_kelas: editNamaKelas, wali_kelas_id: editWaliKelas });
        setEditingKelas(null);
    };

    if (loading || loadingGurus) return <Loading />;

    return (
        <div className='space-y-4'>
            <div className="flex justify-between items-center">
                <h1 className='text-2xl font-bold'>Admin Kelas</h1>
                <Button asChild>
                    <Link href="/dashboard/admin/kelas/new">Tambah Kelas <Plus /></Link>
                </Button>
            </div>

            <div className='rounded-lg border shadow-md overflow-hidden'>
                <Table>
                    <TableHeader className='bg-foreground/10'>
                        <TableRow>
                            <TableHead>Nama Kelas</TableHead>
                            <TableHead>Tahun Ajaran</TableHead>
                            <TableHead>Wali Kelas</TableHead>
                            <TableHead className="text-right">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {kelas.map((k) => (
                            <TableRow key={k.id}>
                                <TableCell>{k.nama_kelas}</TableCell>
                                <TableCell>{k.tahun_ajaran}</TableCell>
                                <TableCell>{gurus.find((g) => g.id === k.wali_kelas_id)?.nama}</TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => {
                                                setEditingKelas(k);
                                                setEditNamaKelas(k.nama_kelas);
                                                setEditWaliKelas(k.wali_kelas_id || "");
                                            }}
                                        >
                                            <Pen />
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => handleDelete(k.id!)}
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

            {/* Modal Edit */}
            {editingKelas && (
                <div className="fixed inset-0 bg-foreground/30  flex items-center justify-center z-50">
                    <div className="bg-background p-6 rounded-lg w-96 shadow-lg space-y-4">
                        <h2 className="text-lg font-bold">Edit Kelas</h2>
                        <input
                            type="text"
                            value={editNamaKelas}
                            onChange={(e) => setEditNamaKelas(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Nama Kelas"
                        />
                        <select
                            value={editWaliKelas}
                            onChange={(e) => setEditWaliKelas(e.target.value)}
                            className="w-full p-2 border rounded"
                        >
                            <option value="">Pilih Wali Kelas</option>
                            {gurus.map(u => (
                                <option key={u.id} value={u.id}>{u.nama}</option>
                            ))}
                        </select>
                        <div className="flex justify-end gap-2">
                            <Button onClick={() => setEditingKelas(null)} variant="outline">Cancel</Button>
                            <Button onClick={handleEditSave}>Save</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminKelasPage;
