"use client";

import React, { useState } from "react";
import Loading from "@/components/ui/loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Siswa, Kelas } from "@/lib/types";
import { Pen, Plus, Trash2 } from "lucide-react";
import Link from "next/link";
import { useCrud } from "@/hooks/use-crud";

const AdminSiswasPage = () => {
  const { items: siswas, loading, remove: removeSiswa, update: editSiswa } = useCrud<Siswa>("siswas");
  const { items: kelas, loading: kelasLoading } = useCrud<Kelas>("kelas");

  const [editingSiswa, setEditingSiswa] = useState<Siswa | null>(null);
  const [editNama, setEditNama] = useState("");
  const [editNisn, setEditNisn] = useState("");
  const [editAlamat, setEditAlamat] = useState("");
  const [editTelepon, setEditTelepon] = useState("");
  const [editKelas, setEditKelas] = useState("");

  const handleDelete = async (id: Siswa["id"]) => {
    const confirmed = confirm("Apakah yakin ingin menghapus siswa ini?");
    if (!confirmed) return;
    await removeSiswa(id);
  };

  const handleEditSave = async () => {
    if (!editingSiswa) return;
    await editSiswa(editingSiswa.id!, {
      nama: editNama,
      nisn: editNisn,
      alamat: editAlamat,
      telepon_wali: editTelepon,
      kelas_id: editKelas,
    });
    setEditingSiswa(null);
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

      <div className="rounded-lg border shadow-md overflow-hidden">
        <Table>
          <TableHeader className="bg-foreground/10">
            <TableRow>
              <TableHead>No</TableHead>
              <TableHead>Nama</TableHead>
              <TableHead>NISN</TableHead>
              <TableHead>Alamat</TableHead>
              <TableHead>Telepon</TableHead>
              <TableHead>Kelas</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {siswas.map((siswa, index) => (
              <TableRow key={siswa.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{siswa.nama}</TableCell>
                <TableCell>{siswa.nisn}</TableCell>
                <TableCell>{siswa.alamat}</TableCell>
                <TableCell>{siswa.telepon_wali}</TableCell>
                <TableCell>{getNamaKelas(siswa.kelas_id)}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setEditingSiswa(siswa);
                        setEditNama(siswa.nama);
                        setEditNisn(siswa.nisn || "");
                        setEditAlamat(siswa.alamat || "");
                        setEditTelepon(siswa.telepon_wali || "");
                        setEditKelas(siswa.kelas_id || "");
                      }}
                    >
                      <Pen />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDelete(siswa.id!)}
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

      {/* Modal Edit Siswa */}
      {editingSiswa && (
        <div className="fixed inset-0 bg-foreground/20 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg w-96 shadow-lg space-y-4">
            <h2 className="text-lg font-bold">Edit Siswa</h2>
            <input
              type="text"
              value={editNama}
              onChange={(e) => setEditNama(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Nama"
            />
            <input
              type="text"
              value={editNisn}
              onChange={(e) => setEditNisn(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="NIS"
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
            {/* Dropdown kelas */}
            <select
              value={editKelas}
              onChange={(e) => setEditKelas(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Pilih Kelas</option>
              {kelas.map((k: Kelas) => (
                <option key={k.id} value={k.id}>
                  {k.nama_kelas}
                </option>
              ))}
            </select>
            <div className="flex justify-end gap-2">
              <Button onClick={() => setEditingSiswa(null)} variant="outline">
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

export default AdminSiswasPage;