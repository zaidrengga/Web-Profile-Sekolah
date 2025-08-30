"use client";

import { Input } from '@/components/ui/input';
import Loading from '@/components/ui/loading';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCrud } from '@/hooks/use-crud';
import { useGuru } from '@/hooks/use-guru';
import { Absensi, Siswa } from '@/lib/types';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';

const GuruAbsensiByIdPage = () => {
  const { id: jadwalId } = useParams();
  const { jadwals, mapels, kelas, loading } = useGuru();
  const { items: siswas, loading: siswasLoading } = useCrud<Siswa>("siswas");
  const { items: absensis, add: addAbsensi, update: updateAbsensi, loading: absensisLoading } = useCrud<Absensi>("absensis");

  const [tanggal, setTanggal] = useState(new Date().toISOString().split("T")[0]);
  const [loadingSave, setLoadingSave] = useState(false);

  const jadwal = jadwals.find((j) => j.id === jadwalId);
  const siswaList = siswas.filter((s) => s.kelas_id === jadwal?.kelas_id);
  const absensiHariIni = absensis.filter((a) => a.tanggal === tanggal).filter((a) => a.jadwal_kelas_mapel_id === jadwalId);

  const handleSave = (siswaId: string, data: Partial<Absensi>) => {
    const existing = absensiHariIni.find((a) => a.siswa_id === siswaId)
    setLoadingSave(true);
    if (existing) {
      updateAbsensi(existing.id, { ...existing, ...data });
      setLoadingSave(false);
      window.location.reload();
    } else {
      const status = data.status || "hadir";
      if (!["hadir", "izin", "sakit", "alpha"].includes(status)) {
        console.error("Invalid status value:", status);
        return;
      }
      addAbsensi({
        id: crypto.randomUUID(),
        siswa_id: siswaId,
        jadwal_kelas_mapel_id: jadwalId as string,
        tanggal,
        status,
        keterangan: data.keterangan || "-",
      });
      setLoadingSave(false);
      window.location.reload();
    }
  };
  if (loading || siswasLoading || absensisLoading || loadingSave) return <Loading />;


  return (
    <div>
      <h1 className="text-2xl font-bold">
        {mapels.find((m) => m.id === jadwal?.mapel_id)?.nama_mapel} |{" "}
        {kelas.find((k) => k.id === jadwal?.kelas_id)?.nama_kelas}
      </h1>
      <p className="mb-4">
        {jadwal?.hari} | {jadwal?.jam}
      </p>

      <div className="w-full flex justify-end items-center mb-4">
        <label className="mr-2">Tanggal:</label>
        <Input type="date" className="w-fit" value={tanggal} onChange={(e) => setTanggal(e.target.value)} />
      </div>

      <Table>
        <TableHeader>
          <TableRow className="bg-gray-200">
            <TableHead>No</TableHead>
            <TableHead>Nama Siswa</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Keterangan</TableHead>
            <TableHead>Waktu</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {siswaList.map((siswa, index) => {
            const absensi = absensiHariIni.find((a) => a.siswa_id === siswa.id);
            return (
              <TableRow key={siswa.id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{siswa.nama}</TableCell>

                {/* Status langsung pakai Select */}
                <TableCell>
                  <Select
                    value={absensi?.status || ""}
                    onValueChange={(value) =>
                      handleSave(siswa.id, { status: value as Absensi["status"] })
                    }
                  >
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Pilih absen" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="sakit">Sakit</SelectItem>
                        <SelectItem value="izin">Izin</SelectItem>
                        <SelectItem value="hadir">Hadir</SelectItem>
                        <SelectItem value="alpha">Alpha</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </TableCell>

                {/* Keterangan langsung pakai input */}
                <TableCell>
                  <Input
                    className="w-[200px]"
                    defaultValue={absensi?.keterangan || ""}
                    onBlur={(e) => handleSave(siswa.id, { keterangan: e.target.value })}
                  />
                </TableCell>

                <TableCell>{tanggal}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default GuruAbsensiByIdPage;