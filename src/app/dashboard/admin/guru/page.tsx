"use client";

import React, { useState } from "react";
import Loading from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import { Guru } from "@/lib/types";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useCrud } from "@/hooks/use-crud";
import { DataTable } from "@/components/template/DataTable";
import { EditDialog } from "@/components/template/EditDialog";
import { RHFInput } from "@/components/template/RHFInput";
import { toast } from "sonner";

type GuruRecord = Partial<Record<string, unknown>> & Guru;

const AdminGurusPage = () => {
    const { items: gurus, loading, remove: removeGuru, update: editGuru } = useCrud<Guru>("gurus");

    const [openEdit, setOpenEdit] = useState(false);
    const [editingGuru, setEditingGuru] = useState<Guru | null>(null);

    const handleDelete = async (id: Guru["id"]) => {
        const confirmed = confirm("Apakah yakin ingin menghapus guru ini?");
        if (!confirmed) return;
        await removeGuru(id);
    };

    const handleEdit = (guru: Guru) => {
        setEditingGuru(guru);
        setOpenEdit(true);
    };

    const handleEditSave = async (data: GuruRecord) => {
        if (!editingGuru) return;

        try {
            const response = await editGuru(editingGuru.id, {
                ...data,
                alamat: data.alamat ?? null,
                telepon: data.telepon ?? null,
            });
            if (response) {
                window.location.reload();
                setEditingGuru(null);
                toast.success("Guru berhasil diubah");
                setOpenEdit(false);
            } else {
                toast.error("Gagal mengubah guru");
            }
        } catch (error) {
            console.error("handleEditSave error:", error);
            toast.error("Gagal mengubah guru");
        }
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

            <div>
                <DataTable
                    columns={[
                        { header: "Nama", accessorKey: "nama", },
                        { header: "NIP", accessorKey: "nip", },
                        { header: "Telepon", accessorKey: "telepon", },
                        { header: "Jabatan", accessorKey: "jabatan", },
                    ]}
                    data={gurus}
                    onEdit={handleEdit}
                    onDelete={(id) => handleDelete(id as string)}
                    searchKeys={["nama", "nip"]}
                    filterKey={{ label: "Jabatan", value: "jabatan" }}
                    filterOptions={gurus.map((guru) => ({ label: guru.jabatan!, value: guru.jabatan! }))}
                    columnHeaderMap={{
                        nama: "Nama",
                        nip: "NIP",
                        alamat: "Alamat",
                        telepon: "Telepon",
                        jabatan: "Jabatan",
                    }}
                />

            </div>

            <EditDialog<GuruRecord>
                open={openEdit}
                onClose={() => setOpenEdit(false)}
                onSave={handleEditSave}
                title="Edit Guru"
                defaultValues={{
                    id: editingGuru?.id,
                    nama: editingGuru?.nama,
                    nip: editingGuru?.nip,
                    alamat: editingGuru?.alamat,
                    telepon: editingGuru?.telepon,
                    jabatan: editingGuru?.jabatan,
                }}
            >
                <RHFInput name="nama" label="Nama" placeholder="Nama Guru" />
                <RHFInput name="nip" label="NIP" placeholder="NIP Guru" />
                <RHFInput name="alamat" label="Alamat" placeholder="Alamat Guru" />
                <RHFInput name="telepon" label="Telepon" placeholder="Telepon Guru" />
            </EditDialog>
        </div>
    );
};

export default AdminGurusPage;