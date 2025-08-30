"use client";

import React, { useState } from "react";
import Loading from "@/components/ui/loading";
import { Button } from "@/components/ui/button";
import { Siswa, Kelas } from "@/lib/types";
import { Plus } from "lucide-react";
import Link from "next/link";
import { useCrud } from "@/hooks/use-crud";
import { DataTable } from "@/components/template/DataTable";
import { EditDialog } from "@/components/template/EditDialog";
import { RHFInput } from "@/components/template/RHFInput";
import { RHFSelect } from "@/components/template/RHFSelect";
import { toast } from "sonner";

export type SiswaRecord = Partial<Record<string, unknown>> & Siswa;

const AdminSiswasPage = () => {
  const {
    items: siswas,
    loading,
    remove: removeSiswa,
    update: editSiswa,
  } = useCrud<Siswa>("siswas");
  const { items: kelas, loading: kelasLoading } = useCrud<Kelas>("kelas");

  const [openEdit, setOpenEdit] = useState(false);
  const [editingSiswa, setEditingSiswa] = useState<Siswa | null>(null);

  const handleDelete = async (id: Siswa["id"]) => {
    const confirmed = confirm("Apakah yakin ingin menghapus siswa ini?");
    if (!confirmed) return;
    await removeSiswa(id);
    toast.success("Siswa berhasil dihapus");
  };

  const handleEdit = (siswa: Siswa) => {
    setEditingSiswa(siswa);
    setOpenEdit(true);
  };

  const handleEditSave = async (data: SiswaRecord) => {
    if (!editingSiswa) return;
    try {
      const response = await editSiswa(editingSiswa.id, {
        ...data,
        alamat: data.alamat ?? null,
        telepon_wali: data.telepon_wali ?? null,
      });
      if (response) {
        window.location.reload();
        setEditingSiswa(null);
        toast.success("Siswa berhasil diubah");
        setOpenEdit(false);
      } else {
        toast.error("Gagal mengubah siswa");
      }
    } catch (error) {
      console.error("handleEditSave error:", error);
      toast.error("Gagal mengubah siswa");
    }
  };

  if (loading || kelasLoading) return <Loading />;

  // helper untuk cari nama kelas dari kelas_id
  const getNamaKelas = (kelasId: string | null) => {
    const k = kelas.find((k: Kelas) => k.id === kelasId);
    return k ? k.nama_kelas : "-";
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Admin Siswa</h1>
        <Button asChild>
          <Link href="/dashboard/admin/siswa/new">
            Tambah Siswa <Plus />
          </Link>
        </Button>
      </div>

      <div>
        <DataTable
          data={siswas}
          columns={[
            { accessorKey: "nisn", header: "NISN" },
            { accessorKey: "nama", header: "Nama" },
            { accessorKey: "alamat", header: "Alamat" },
            { accessorKey: "telepon_wali", header: "Telepon" },
            {
              accessorKey: "kelas_id",
              header: "Kelas",
              cell: ({ row }) => getNamaKelas(row.original.kelas_id),
            },
          ]}
          searchKeys={["nisn", "nama"]}
          filterKey={{ label: "Kelas", value: "kelas_id" }}
          filterOptions={kelas.map((k) => ({
            label: k.nama_kelas,
            value: k.id,
          }))}
          onEdit={handleEdit} // ✅ buka modal edit
          onDelete={(id) => handleDelete(id as string)}
          relationMap={{
            kelas_id: kelas.map(k => ({ id: k.id, label: k.nama_kelas })),
          }}
          columnHeaderMap={{
            nisn: "NISN",
            nama: "Nama",
            alamat: "Alamat",
            telepon_wali: "Telepon",
            kelas_id: "Kelas",
          }}
        />
      </div>

      {/* Modal Edit Siswa */}
      <EditDialog<SiswaRecord>
        open={openEdit}
        onClose={() => setOpenEdit(false)}
        onSave={handleEditSave}
        title="Edit Siswa"
        defaultValues={{
          nisn: editingSiswa?.nisn ?? "",
          nama: editingSiswa?.nama ?? "",
          alamat: editingSiswa?.alamat ?? "",
          telepon_wali: editingSiswa?.telepon_wali ?? "",
          kelas_id: editingSiswa?.kelas_id ?? "",
        }}
      >
        <RHFInput name="nama" label="Nama" placeholder="Nama Siswa" />
        <RHFInput name="nisn" label="NISN" placeholder="NISN Siswa" />
        <RHFInput name="alamat" label="Alamat" placeholder="Alamat Siswa" />
        <RHFInput
          name="telepon_wali"
          label="Telepon"
          placeholder="Telepon Siswa"
        />
        <RHFSelect
          name="kelas_id"
          label="Kelas"
          options={kelas.map((k) => ({
            label: k.nama_kelas,
            value: k.id,
          }))}
        />
      </EditDialog>
    </div>
  );
};

export default AdminSiswasPage;