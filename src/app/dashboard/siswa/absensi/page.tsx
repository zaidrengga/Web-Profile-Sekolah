"use client"

import Loading from '@/components/ui/loading';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useSiswa } from '@/hooks/use-siswa';

const SiswaAbsensiPage = () => {
    const { jadwals, mapels, absensis, loading } = useSiswa();

    if (loading) return <Loading />
    return (
        <div className="w-full">
            <h1 className='text-2xl font-bold'>Absensi</h1>
            <div className="w-full h-1 bg-gray-200 my-4 rounded-full" />
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Mapel</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Keterangan</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {absensis.map((absensi) => (
                        <TableRow key={absensi.id}>
                            <TableCell>{absensi.tanggal}</TableCell>
                            <TableCell>{mapels.find((mapel) => mapel.id === jadwals.find((jadwal) => jadwal.id === absensi.jadwal_kelas_mapel_id)?.mapel_id)?.nama_mapel}</TableCell>
                            <TableCell>{absensi.status}</TableCell>
                            <TableCell>{absensi.keterangan}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

export default SiswaAbsensiPage