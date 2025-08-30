"use client";

import React, { useState } from "react";
import { DataTable } from "@/components/template/DataTable";
import Loading from "@/components/ui/loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useCrud } from "@/hooks/use-crud";
import { Guru, JadwalKelasMapel, Kelas, Mapel } from "@/lib/types";
import { useParams } from "next/navigation";
import { EditDialog } from "@/components/template/EditDialog";
import { RHFInput } from "@/components/template/RHFInput";
import { RHFSelectSearchable } from "@/components/template/RHFSelectSearchable";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";


export type JadwalRecods = Partial<Record<string, unknown>> & JadwalKelasMapel
export type MapelRecods = Partial<Record<string, unknown>> & Mapel

const AdminKelasIdPage = () => {
    const { id } = useParams();

    const { items: kelase, loading: kelasLoading } = useCrud<Kelas>("kelas");
    const { items: gurus, loading: gurusLoading } = useCrud<Guru>("gurus");
    const { items: mapelse, loading: mapelsLoading, remove: removeMapel, update: updateMapel } = useCrud<Mapel>("mapels");
    const { items: jadwalsKelas, loading: jadwalsLoading, remove: removeJadwal, update: updateJadwal } = useCrud<JadwalKelasMapel>("jadwal_kelas_mapel");

    const kelasById = kelase.find((kelas) => kelas.id === id);
    const jadwals = jadwalsKelas.filter((jadwal) => jadwal.kelas_id === id);
    const mapels = mapelse.filter((mapel) => jadwals.map((jadwal) => jadwal.mapel_id).includes(mapel.id));

    const [openEditJadwal, setOpenEditJadwal] = useState(false);
    const [editingJadwal, setEditingJadwal] = useState<JadwalKelasMapel | null>(null);

    const [openEditMapel, setOpenEditMapel] = useState(false)
    const [editingMapel, setEditingMapel] = useState<Mapel | null>(null)

    const methodsJadwal = useForm<JadwalRecods>();

    const handleEditJadwal = (jadwal: JadwalKelasMapel) => {
        setEditingJadwal(jadwal)
        setOpenEditJadwal(true)
    }

    const onEditSaveJadwal = async (data: JadwalKelasMapel) => {
        if (!editingJadwal) return;
        await updateJadwal(editingJadwal.id, data);
        setEditingJadwal(null);
        setOpenEditJadwal(false)
    };

    const onDeleteJadwal = async (jadwalId: string) => {
        const confirmed = confirm("Apakah yakin ingin menghapus jadwal ini?");
        if (!confirmed) return;
        await removeJadwal(jadwalId);
    };

    const handleEditMapel = (mapel: Mapel) => {
        setEditingMapel(mapel)
        setOpenEditMapel(true)
    }

    const onEditSaveMapel = async (data: Mapel) => {
        if (!editingMapel) return
        await updateMapel(editingMapel.id, data)
        setEditingMapel(null)
        setOpenEditMapel(false)
    }

    const onDeleteMapel = async (mapelId: string) => {
        const confirmed = confirm("Apakah yakin ingin menghapus jadwal ini")
        if (!confirmed) return;
        await removeMapel(mapelId)
    }

    if (kelasLoading || gurusLoading || jadwalsLoading || mapelsLoading) return <Loading />;

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
                <h1 className="text-2xl font-semibold">Kelas {kelasById?.nama_kelas}</h1>
                <p className="text-gray-600">
                    {kelasById?.tahun_ajaran} - {gurus.find((guru) => guru.id === kelasById?.wali_kelas_id)?.nama}
                </p>
            </div>

            <Tabs defaultValue="jadwal" className="w-full">
                <TabsList className="w-full">
                    <TabsTrigger value="jadwal" className="text-lg">
                        Jadwal
                    </TabsTrigger>
                    <TabsTrigger value="mapel" className="text-lg">
                        Mapel
                    </TabsTrigger>
                </TabsList>

                {/* TAB JADWAL */}
                <TabsContent value="jadwal" className="w-full">
                    <div className="flex justify-between items-center my-2">
                        <h1 className="text-xl font-semibold">Jadwal Kelas {kelasById?.nama_kelas}</h1>
                        <Button asChild>
                            <Link href={`/dashboard/admin/kelas/${id}/new-jadwal`}>Tambah Jadwal <Plus /></Link>
                        </Button>
                    </div>
                    <DataTable
                        data={jadwals}
                        columns={[
                            { header: "Hari", accessorKey: "hari" },
                            { header: "Jam", accessorKey: "jam" },
                            {
                                header: "Mapel",
                                accessorKey: "mapel_id",
                                cell: (props) => mapelse.find((mapel) => mapel.id === props.row.original.mapel_id)?.nama_mapel,
                            },
                            {
                                header: "Guru",
                                accessorKey: "guru_id",
                                cell: (props) => gurus.find((guru) => guru.id === props.row.original.guru_id)?.nama,
                            },
                        ]}
                        onEdit={handleEditJadwal}
                        onDelete={(id) => onDeleteJadwal(id as string)}
                        searchKeys={["hari", "jam"]}
                        filterKey={{ label: "Hari", value: "hari" }}
                        filterOptions={[
                            { label: "Senin", value: "Senin" },
                            { label: "Selasa", value: "Selasa" },
                            { label: "Rabu", value: "Rabu" },
                            { label: "Kamis", value: "Kamis" },
                            { label: "Jumat", value: "Jumat" },
                            { label: "Sabtu", value: "Sabtu" },
                        ]}
                    />
                    <EditDialog<JadwalRecods>
                        open={openEditJadwal}
                        onClose={() => setOpenEditJadwal(false)}
                        onSave={onEditSaveJadwal}
                        title="Edit Jadwal"
                        defaultValues={{
                            hari: editingJadwal?.hari,
                            jam: editingJadwal?.jam,
                            mapel_id: editingJadwal?.mapel_id,
                            guru_id: editingJadwal?.guru_id,
                        }}
                    >
                        <RHFSelectSearchable<JadwalRecods>
                            name="hari"
                            label="Hari"
                            placeholder="Pilih Hari"
                            options={[
                                { label: "Senin", value: "Senin" },
                                { label: "Selasa", value: "Selasa" },
                                { label: "Rabu", value: "Rabu" },
                                { label: "Kamis", value: "Kamis" },
                                { label: "Jumat", value: "Jumat" },
                                { label: "Sabtu", value: "Sabtu" },
                            ]}
                            control={methodsJadwal.control}
                        />
                        <RHFInput name="jam" label="Jam" placeholder="Contoh: 07:00-08:30" />
                        <RHFSelectSearchable<JadwalRecods>
                            name="mapel_id"
                            label="Mapel"
                            placeholder="Pilih Mapel"
                            options={mapelse.map((m) => ({ label: m.nama_mapel, value: m.id }))}
                            control={methodsJadwal.control}
                        />
                        <RHFSelectSearchable<JadwalRecods>
                            name="guru_id"
                            label="Guru"
                            placeholder="Pilih Guru"
                            options={gurus.map((g) => ({ label: g.nama, value: g.id }))}
                            control={methodsJadwal.control}
                        />
                    </EditDialog>
                </TabsContent>

                {/* TAB MAPEL */}
                <TabsContent value="mapel" className="w-full">
                    <div className="flex justify-between items-center my-2">
                        <h1 className="text-xl font-semibold">Mapel Kelas {kelasById?.nama_kelas}</h1>
                        <Button asChild>
                            <Link href={`/dashboard/admin/kelas/${id}/new-mapel`}>Tambah Mapel <Plus /></Link>
                        </Button>
                    </div>
                    <DataTable
                        data={mapels}
                        columns={[
                            { header: "Mapel", accessorKey: "nama_mapel" },
                            { header: "Kode", accessorKey: "kode_mapel" },
                        ]}
                        searchKeys={["nama_mapel", "kode_mapel"]}
                        onEdit={handleEditMapel}
                        onDelete={(id) => onDeleteMapel(id as string)}
                    />

                    <EditDialog<MapelRecods>
                        open={openEditMapel}
                        onClose={() => {
                            setOpenEditMapel(false)
                            setEditingMapel(null)
                        }}
                        onSave={onEditSaveMapel}
                        defaultValues={{
                            nama_mapel: editingMapel?.nama_mapel,
                            kode_mapel: editingMapel?.kode_mapel
                        }}
                    >
                        <RHFInput name="nama_mapel" label="Nama Mapel" placeholder="Contoh: Matematika" />
                        <RHFInput name="kode_mapel" label="Kode Mapel" placeholder="Contoh: MTK" />
                    </EditDialog>
                </TabsContent>
            </Tabs>
        </div >
    );
};

export default AdminKelasIdPage;