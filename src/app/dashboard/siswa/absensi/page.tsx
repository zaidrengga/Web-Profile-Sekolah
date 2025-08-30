"use client"

import { DataTable } from '@/components/template/DataTable';
import Loading from '@/components/ui/loading';
import { Separator } from '@/components/ui/separator';
import { useSiswa } from '@/hooks/use-siswa';

const SiswaAbsensiPage = () => {
    const { jadwals, mapels, absensis, loading } = useSiswa();

    if (loading) return <Loading />
    return (
        <div className="w-full">
            <h1 className='text-2xl font-bold'>Absensi</h1>
            <Separator className='my-2' />
            <DataTable
                data={absensis}
                columns={[
                    {
                        accessorKey: "tanggal",
                        header: "Tanggal",
                    },
                    {
                        accessorKey: "mapel",
                        header: "Mapel",
                        cell: ({ row }) => mapels.find((mapel) => mapel.id === jadwals.find((jadwal) => jadwal.id === row.original.jadwal_kelas_mapel_id)?.mapel_id)?.nama_mapel ?? "-",
                    },
                    {
                        accessorKey: "status",
                        header: "Status",
                    },
                    {
                        accessorKey: "keterangan",
                        header: "Keterangan",
                    },
                ]}
                searchKeys={["tanggal", "keterangan"]}
                filterKey={{ label: "Status", value: "status" }}
                filterOptions={[
                    { label: "Hadir", value: "hadir" },
                    { label: "Izin", value: "izin" },
                    { label: "Sakit", value: "sakit" },
                    { label: "Alpha", value: "alpha" },
                ]}
            />
        </div>
    )
}

export default SiswaAbsensiPage