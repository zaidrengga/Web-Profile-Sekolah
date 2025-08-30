"use client";

import Loading from '@/components/ui/loading';
import { Button } from '@/components/ui/button';
import { Guru, Kelas } from '@/lib/types';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { useCrud } from '@/hooks/use-crud';
import { DataTable } from '@/components/template/DataTable';
import React, { useState } from 'react';
import { EditDialog } from '@/components/template/EditDialog';
import { RHFInput } from '@/components/template/RHFInput';
import { RHFSelect } from '@/components/template/RHFSelect';
import { toast } from 'sonner';

export type KelasRecord = Partial<Record<string, unknown>> & Kelas;

const AdminKelasPage = () => {
    const { items: kelas, loading, remove: removeKelas, update: editKelas } = useCrud<Kelas>("kelas");
    const { items: gurus, loading: loadingGurus } = useCrud<Guru>("gurus");

    const [openEdit, setOpenEdit] = useState(false);
    const [editingKelas, setEditingKelas] = useState<Kelas | null>(null);

    const handleDelete = async (id: Kelas["id"]) => {
        const confirmed = confirm("Apakah yakin ingin menghapus kelas ini?");
        if (!confirmed) return;
        await removeKelas(id);
    };

    // dipanggil saat klik Edit
    const handleEdit = (kelas: Kelas) => {
        setEditingKelas(kelas);
        setOpenEdit(true);
    };

    const handleEditSave = async (data: KelasRecord) => {
        if (!editingKelas) return;
        if (!data.nama_kelas || !data.tahun_ajaran || !data.wali_kelas_id) {
            toast.error("Semua field wajib diisi");
            return;
        } else if (gurus.some((g) => g.id === data.wali_kelas_id)) {
            toast.error("Guru sudah ada");
            return;
        }
        try {
            const response = await editKelas(editingKelas.id, {
                nama_kelas: data.nama_kelas,
                tahun_ajaran: data.tahun_ajaran,
                wali_kelas_id: data.wali_kelas_id,
            });
            if (response) {
                window.location.reload();
                setEditingKelas(null);
                toast.success("Kelas berhasil diubah");
                setOpenEdit(false);
            } else {
                toast.error("Gagal mengubah kelas");
            }
        } catch (error) {
            console.error("handleEditSave error:", error);
            toast.error("Gagal mengubah kelas");
        }
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

            <div>
                <DataTable
                    data={kelas}
                    columns={[
                        { header: "Kelas", accessorKey: "nama_kelas" },
                        { header: "Tahun Ajaran", accessorKey: "tahun_ajaran" },
                        {
                            header: "Wali Kelas",
                            accessorKey: "wali_kelas_id",
                            cell: ({ row }) => {
                                const waliKelasId = row.original.wali_kelas_id;
                                return gurus.find(e => e.id === waliKelasId)?.nama ?? "-";
                            },
                        },
                    ]}
                    onEdit={handleEdit}
                    onDelete={(id) => handleDelete(id as string)}
                    onDetails={(id) => `/dashboard/admin/kelas/${id}`}
                    searchKeys={['nama_kelas']}
                    filterKey={{ label: "Tahun Ajaran", value: "tahun_ajaran" }}
                    filterOptions={
                        Array.from(new Set(kelas.map(k => k.tahun_ajaran)))
                            .map(tahun => ({ label: tahun, value: tahun }))
                    }
                    relationMap={{
                        wali_kelas_id: gurus.map(g => ({ label: g.nama, id: g.id })),
                    }}
                    columnHeaderMap={{
                        nama_kelas: "Nama Kelas",
                        tahun_ajaran: "Tahun Ajaran",
                        wali_kelas_id: "Wali Kelas"
                    }}
                />
            </div>

            {/* Modal Edit */}
            <EditDialog<KelasRecord>
                open={openEdit}
                onClose={() => setOpenEdit(false)}
                onSave={handleEditSave}
                title="Edit Kelas"
                defaultValues={{
                    nama_kelas: editingKelas?.nama_kelas,
                    tahun_ajaran: editingKelas?.tahun_ajaran,
                    wali_kelas_id: editingKelas?.wali_kelas_id
                }}
            >
                <RHFInput name="nama_kelas" label="Nama Kelas" placeholder="Nama Kelas" />
                <RHFInput name="tahun_ajaran" label="Tahun Ajaran" placeholder="Tahun Ajaran" />
                <RHFSelect
                    name="wali_kelas_id"
                    label="Wali Kelas"
                    placeholder="Wali Kelas"
                    options={gurus.map((g) => ({ label: g.nama, value: g.id }))}
                />
            </EditDialog>
        </div>
    );
};

export default AdminKelasPage;
