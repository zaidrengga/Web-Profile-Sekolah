"use client"

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Loading from '@/components/ui/loading';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useCrud } from '@/hooks/use-crud';
import { Guru, JadwalKelasMapel, Kelas, Mapel } from '@/lib/types';
import { Pen, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'

const hariOptions = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"]


const AdminJawalsMapelsPage = () => {
    const { items: jadwals, remove: removeJadwal, update: updateJadwalData, loading: jawalsLoading } = useCrud<JadwalKelasMapel>("jadwal_kelas_mapel");
    const { items: mapels, add: addNewMapel, remove: removeMapel, update: updateMapelData, loading: mapelsLoading } = useCrud<Mapel>("mapels");
    const { items: gurus, loading: gurusLoading } = useCrud<Guru>("gurus");
    const { items: kelas, loading: kelasLoading } = useCrud<Kelas>("kelas");

    const [filterOpen, setFilterOpen] = useState(false);
    const [jadwalFilter, setJadwalFilter] = useState<JadwalKelasMapel[]>([]);
    const [filterHari, setFilterHari] = useState<JadwalKelasMapel["hari"] | "Semua Hari">("Semua Hari");
    const [filterKelas, setFilterKelas] = useState<Kelas | null>(null);
    const [editJadwal, setEditJadwal] = useState<JadwalKelasMapel | null>(null);
    const [editMapel, setEditMapel] = useState<Mapel | null>(null);

    const [addMapel, setAddMapel] = useState<Mapel>({ id: "", nama_mapel: "", kode_mapel: "" });

    const handleEditSaveJadwal = async () => {
        if (!editJadwal) return;
        await updateJadwalData(editJadwal.id, {
            id: editJadwal.id,
            mapel_id: editJadwal.mapel_id,
            guru_id: editJadwal.guru_id,
            kelas_id: editJadwal.kelas_id,
            hari: editJadwal.hari,
            jam: editJadwal.jam,
        });
        setEditJadwal(null);
        window.location.reload();
    };

    const handleDeleteJadwal = async (id: JadwalKelasMapel["id"]) => {
        const confirmed = confirm("Apakah yakin ingin menghapus jadwal ini?")
        if (!confirmed) return;
        await removeJadwal(id);
    };

    const handleEditSaveMapel = async () => {
        if (!editMapel) return;
        await updateMapelData(editMapel.id, {
            id: editMapel.id,
            nama_mapel: editMapel.nama_mapel,
            kode_mapel: editMapel.kode_mapel,
        });
        setEditMapel(null);
        window.location.reload();
    };

    const handleDeleteMapel = async (id: Mapel["id"]) => {
        const confirmed = confirm("Apakah yakin ingin menghapus mapel ini?")
        if (!confirmed) return;
        await removeMapel(id);
    };

    const handleAddMapel = async () => {
        if (!addMapel) return;
        await addNewMapel({
            id: crypto.randomUUID(),
            nama_mapel: addMapel.nama_mapel,
            kode_mapel: addMapel.kode_mapel,
        });
        setAddMapel({ id: "", nama_mapel: "", kode_mapel: "" });
        window.location.reload();
    };

    useEffect(() => {
        if (filterHari !== "Semua Hari") {
            setJadwalFilter(jadwals.filter((jadwal) => jadwal.hari === filterHari));
        } else if (filterKelas) {
            setJadwalFilter(jadwals.filter((jadwal) => jadwal.kelas_id === filterKelas.id));
        } else {
            setJadwalFilter(jadwals);
        }

    }, [filterHari, filterKelas, jadwals]);

    if (jawalsLoading || gurusLoading || mapelsLoading || kelasLoading) return <Loading />;
    return (
        <div className="w-full space-y-4">
            <Tabs defaultValue="jadwal" className="w-full">
                <TabsList className='w-full'>
                    <TabsTrigger value="jadwal" className='text-lg'>Jadwal</TabsTrigger>
                    <TabsTrigger value="mapel" className='text-lg'>Mapel</TabsTrigger>
                </TabsList>
                <TabsContent value="jadwal">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold">Jadwal</h1>
                        <div className="flex gap-2">
                            <Button onClick={() => setFilterOpen(!filterOpen)} variant={filterOpen ? "outline" : "default"}>
                                {filterOpen ? "Tutup Filter" : "Buka Filter"}
                            </Button>
                            <Button asChild>
                                <Link href="/dashboard/admin/jadwal&mapel/new">Tambah Jadwal <Plus /></Link>
                            </Button>
                        </div>
                    </div>

                    {filterOpen && (
                        <div className="space-y-4 mb-4">
                            <div className="flex gap-2 mb-4">
                                {["Semua Hari", "Senin", "Selasa", "Rabu", "Kamis", "Jumat"].map((hari) => (
                                    <Button
                                        key={hari}
                                        variant={filterHari === hari ? "default" : "outline"}
                                        onClick={() => setFilterHari(hari as JadwalKelasMapel["hari"])}
                                    >
                                        {hari}
                                    </Button>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Button variant={!filterKelas ? "default" : "outline"} onClick={() => setFilterKelas(null)}>Semua Kelas</Button>
                                {kelas.map((kelas) => (
                                    <Button
                                        key={kelas.id}
                                        variant={filterKelas?.id === kelas.id ? "default" : "outline"}
                                        onClick={() => setFilterKelas(kelas)}
                                    >
                                        {kelas.nama_kelas}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="w-full overflow-x-auto rounded-lg border shadow-lg">
                        <Table>
                            <TableHeader className='bg-gray-200'>
                                <TableRow>
                                    <TableHead>Mapel</TableHead>
                                    <TableHead>Guru</TableHead>
                                    <TableHead>Kelas</TableHead>
                                    <TableHead>Hari</TableHead>
                                    <TableHead>Jam</TableHead>
                                    <TableHead className="text-right">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {jadwalFilter.length > 0 ? (
                                    jadwalFilter.map((jadwal) => (
                                        <TableRow key={jadwal.id}>
                                            <TableCell>{mapels.find((mapel) => mapel.id === jadwal.mapel_id)?.nama_mapel}</TableCell>
                                            <TableCell>{gurus.find((guru) => guru.id === jadwal.guru_id)?.nama}</TableCell>
                                            <TableCell>{kelas.find((kelas) => kelas.id === jadwal.kelas_id)?.nama_kelas}</TableCell>
                                            <TableCell>{jadwal.hari}</TableCell>
                                            <TableCell>{jadwal.jam}</TableCell>
                                            <TableCell className="text-right space-x-2">
                                                <Button size={"icon"} variant="outline" onClick={() => setEditJadwal(jadwal)}>
                                                    <Pen />
                                                </Button>
                                                <Button size={"icon"} variant="destructive" onClick={() => handleDeleteJadwal(jadwal.id)}>
                                                    <Trash2 />
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center">Tidak ada jadwal</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </TabsContent>

                <TabsContent value="mapel">
                    <div className="flex justify-between items-center mb-4">
                        <h1 className="text-2xl font-bold">Mapel</h1>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button>Tambah Mapel <Plus /></Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Tampah Mapel</AlertDialogTitle>
                                </AlertDialogHeader>
                                <div className="space-y-4 p-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="nama_mapel">Nama Mapel</Label>
                                        <Input id="nama_mapel" value={addMapel?.nama_mapel || ""} onChange={(e) => setAddMapel({ ...addMapel, nama_mapel: e.target.value || "" })} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="kode_mapel">Kode Mapel</Label>
                                        <Input id="kode_mapel" value={addMapel?.kode_mapel || ""} onChange={(e) => setAddMapel({ ...addMapel, kode_mapel: e.target.value || "" })} />
                                    </div>
                                </div>
                                <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction onClick={() => handleAddMapel()}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                    <div className="rounded-lg border shadow-lg overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow className='bg-muted'>
                                    <TableHead>Mapel</TableHead>
                                    <TableHead>Kode Mapel</TableHead>
                                    <TableHead></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {mapels.map((mapel) => (
                                    <TableRow key={mapel.id}>
                                        <TableCell>{mapel.nama_mapel}</TableCell>
                                        <TableCell>{mapel.kode_mapel}</TableCell>
                                        <TableCell className='text-right space-x-2'>
                                            <Button size={"icon"} variant='outline' onClick={() => setEditMapel(mapel)}>
                                                <Pen />
                                            </Button>
                                            <Button size={"icon"} variant='destructive' onClick={() => handleDeleteMapel(mapel.id)}>
                                                <Trash2 />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TableHead colSpan={2}>Total Mapel: {mapels.length}</TableHead>
                                    <TableHead className='text-right py-2'>

                                    </TableHead>
                                </TableRow>
                            </TableFooter>
                        </Table>
                    </div>
                </TabsContent>
            </Tabs>

            {editMapel && (
                <AlertDialog open={editMapel !== null}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Edit Mapel</AlertDialogTitle>
                        </AlertDialogHeader>
                        <div className="w-full space-y-2">
                            <Label>Nama Mapel</Label>
                            <Input value={editMapel.nama_mapel} onChange={(e) => setEditMapel({ ...editMapel, nama_mapel: e.target.value })} />
                        </div>
                        <div className="w-full space-y-2">
                            <Label>Kode Mapel</Label>
                            <Input value={editMapel.kode_mapel} onChange={(e) => setEditMapel({ ...editMapel, kode_mapel: e.target.value })} />
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setEditMapel(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleEditSaveMapel()}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}

            {editJadwal && (
                <AlertDialog open={editJadwal !== null}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Edit Jadwal</AlertDialogTitle>
                        </AlertDialogHeader>
                        <div className="w-full space-y-2">
                            <Label>Mapel</Label>
                            <Select
                                value={editJadwal.mapel_id}
                                onValueChange={(value) => {
                                    setEditJadwal({
                                        ...editJadwal,
                                        mapel_id: value,
                                    });
                                }}
                            >
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder="Pilih Mapel" />
                                </SelectTrigger>
                                <SelectContent>
                                    {mapels.map((mapel) => (
                                        <SelectItem key={mapel.id} value={mapel.id}>
                                            {mapel.nama_mapel}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-full space-y-2">
                            <Label>Guru</Label>
                            <Select
                                value={editJadwal.guru_id}
                                onValueChange={(value) => {
                                    setEditJadwal({ ...editJadwal, guru_id: value });
                                }}
                            >
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder="Pilih Guru" />
                                </SelectTrigger>
                                <SelectContent>
                                    {gurus.map((guru) => (
                                        <SelectItem key={guru.id} value={guru.id}>
                                            {guru.nama}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-full space-y-2">
                            <Label>Kelas</Label>
                            <Select
                                value={editJadwal.kelas_id}
                                onValueChange={(value) => {
                                    setEditJadwal({ ...editJadwal, kelas_id: value });
                                }}
                            >
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder="Pilih Kelas" />
                                </SelectTrigger>
                                <SelectContent>
                                    {kelas.map((kelas) => (
                                        <SelectItem key={kelas.id} value={kelas.id}>
                                            {kelas.nama_kelas}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-full space-y-2">
                            <Label>Hari</Label>
                            <Select
                                value={editJadwal.hari}
                                onValueChange={(value) => {
                                    setEditJadwal({ ...editJadwal, hari: value as JadwalKelasMapel["hari"] });
                                }}
                            >
                                <SelectTrigger className='w-full'>
                                    <SelectValue placeholder="Pilih Hari" />
                                </SelectTrigger>
                                <SelectContent>
                                    {hariOptions.map((hari) => (
                                        <SelectItem key={hari} value={hari}>
                                            {hari}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="w-full space-y-2">
                            <Label>Jam</Label>
                            <Input
                                className="w-full"
                                type="text"
                                value={editJadwal?.jam}
                                onChange={(e) => setEditJadwal({ ...editJadwal, jam: e.target.value })}
                            />
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setEditJadwal(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleEditSaveJadwal()}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </div>
    )
}

export default AdminJawalsMapelsPage