"use client"

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import Loading from '@/components/ui/loading';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCrud } from '@/hooks/use-crud';
import { Guru, JadwalKelasMapel, Kelas, Mapel } from '@/lib/types';
import { redirect } from 'next/navigation';
import React, { useState } from 'react'

const AdminJawalsMapelNewPage = () => {
    const { add: addNewJadwal } = useCrud<JadwalKelasMapel>("jadwal_kelas_mapel");
    const { items: mapels, loading: mapelsLoading } = useCrud<Mapel>("mapels");
    const { items: gurus, loading: gurusLoading } = useCrud<Guru>("gurus");
    const { items: kelas, loading: kelasLoading } = useCrud<Kelas>("kelas");

    const [addHari, setAddHari] = useState<JadwalKelasMapel["hari"]>("Senin");
    const [addJam, setAddJam] = useState<JadwalKelasMapel["jam"]>("08:00");
    const [addMapel, setAddMapel] = useState<Mapel | null>(null);
    const [addGuru, setAddGuru] = useState<Guru | null>(null);
    const [addKelas, setAddKelas] = useState<Kelas | null>(null);

    const handleAddJadwal = async () => {
        if (!addHari || !addJam || !addMapel || !addGuru || !addKelas) return;
        await addNewJadwal({
            id: crypto.randomUUID(),
            hari: addHari,
            jam: addJam,
            mapel_id: addMapel.id,
            guru_id: addGuru.id,
            kelas_id: addKelas.id,
        })
        redirect("/dashboard/admin/jadwal&mapel")
    };

    if (mapelsLoading || gurusLoading || kelasLoading) return <Loading />
    return (
        <div className="w-full flex flex-col gap-4 max-w-lg mx-auto">
            <h1 className="text-2xl font-bold">Tambah Jadwal Baru</h1>
            <div className="flex flex-col gap-2">
                <Label htmlFor="hari">Hari</Label>
                <Select onValueChange={(e) => setAddHari(e as JadwalKelasMapel["hari"])}>
                    <SelectTrigger className='w-full'>
                        <SelectValue placeholder="Pilih Hari" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="Senin">Senin</SelectItem>
                        <SelectItem value="Selasa">Selasa</SelectItem>
                        <SelectItem value="Rabu">Rabu</SelectItem>
                        <SelectItem value="Kamis">Kamis</SelectItem>
                        <SelectItem value="Jumat">Jumat</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="jam">Jam</label>
                <input type="text" name="jam" id="jam" onChange={(e) => setAddJam(e.target.value)} className="p-2 border border-gray-300 rounded-md" />
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="mapel">Mapel</label>
                <Select onValueChange={(e) => setAddMapel(mapels.find((mapel) => mapel.id === e) || null)}>
                    <SelectTrigger className='w-full'>
                        <SelectValue placeholder="Pilih Mapel" />
                    </SelectTrigger>
                    <SelectContent>
                        {mapels.map((mapel) => (
                            <SelectItem key={mapel.id} value={mapel.id}>{mapel.nama_mapel}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="guru">Guru</label>
                <Select onValueChange={(e) => setAddGuru(gurus.find((guru) => guru.id === e) || null)}>
                    <SelectTrigger className='w-full'>
                        <SelectValue placeholder="Pilih Guru" />
                    </SelectTrigger>
                    <SelectContent>
                        {gurus.map((guru) => (
                            <SelectItem key={guru.id} value={guru.id}>{guru.nama}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="kelas">Kelas</label>
                <Select onValueChange={(e) => setAddKelas(kelas.find((kelas) => kelas.id === e) || null)}>
                    <SelectTrigger className='w-full'>
                        <SelectValue placeholder="Pilih Kelas" />
                    </SelectTrigger>
                    <SelectContent>
                        {kelas.map((kelas) => (
                            <SelectItem key={kelas.id} value={kelas.id}>{kelas.nama_kelas}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <Button onClick={handleAddJadwal}>Tambah Jadwal</Button>
        </div>
    )
}

export default AdminJawalsMapelNewPage