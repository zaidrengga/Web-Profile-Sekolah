"use client"

import Loading from '@/components/ui/loading';
import { useGuru } from '@/hooks/use-guru';
import React from 'react'

const GuruJadwalPage = () => {
    const { jadwals, kelas, mapels, loading } = useGuru();

    if (loading) return <Loading />
    return (
        <div className='w-full space-y-2'>
            <h1 className='text-2xl font-bold'>Jadwal</h1>
            <div className='w-full h-1 bg-gray-200 rounded-full' />
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
                <div className="w-full bg-gray-200 rounded-lg p-4">
                    <h2 className="text-xl font-semibold mb-2">Senin</h2>
                    {jadwals.filter((jadwal) => jadwal.hari === "Senin").map((jadwal) => (
                        <div key={jadwal.id} className="mb-2 rounded-lg p-2 bg-background">
                            <p className="text-lg">{mapels.find((mapel) => mapel.id === jadwal.mapel_id)?.nama_mapel}</p>
                            <p className="text-gray-600">{kelas.find((kelas) => kelas.id === jadwal.kelas_id)?.nama_kelas} | {jadwal.jam}</p>
                        </div>
                    ))}
                </div>
                <div className="w-full bg-gray-200 rounded-lg p-4">
                    <h2 className="text-xl font-semibold mb-2">Selasa</h2>
                    {jadwals.filter((jadwal) => jadwal.hari === "Selasa").map((jadwal) => (
                        <div key={jadwal.id} className="mb-2 rounded-lg p-2 bg-background">
                            <p className="text-lg">{mapels.find((mapel) => mapel.id === jadwal.mapel_id)?.nama_mapel}</p>
                            <p className="text-gray-600">{kelas.find((kelas) => kelas.id === jadwal.kelas_id)?.nama_kelas} | {jadwal.jam}</p>
                        </div>
                    ))}
                </div>
                <div className="w-full bg-gray-200 rounded-lg p-4">
                    <h2 className="text-xl font-semibold mb-2">Rabu</h2>
                    {jadwals.filter((jadwal) => jadwal.hari === "Rabu").map((jadwal) => (
                        <div key={jadwal.id} className="mb-2 rounded-lg p-2 bg-background">
                            <p className="text-lg">{mapels.find((mapel) => mapel.id === jadwal.mapel_id)?.nama_mapel}</p>
                            <p className="text-gray-600">{kelas.find((kelas) => kelas.id === jadwal.kelas_id)?.nama_kelas} | {jadwal.jam}</p>
                        </div>
                    ))}
                </div>
                <div className="w-full bg-gray-200 rounded-lg p-4">
                    <h2 className="text-xl font-semibold mb-2">Kamis</h2>
                    {jadwals.filter((jadwal) => jadwal.hari === "Kamis").map((jadwal) => (
                        <div key={jadwal.id} className="mb-2 rounded-lg p-2 bg-background">
                            <p className="text-lg">{mapels.find((mapel) => mapel.id === jadwal.mapel_id)?.nama_mapel}</p>
                            <p className="text-gray-600">{kelas.find((kelas) => kelas.id === jadwal.kelas_id)?.nama_kelas} | {jadwal.jam}</p>
                        </div>
                    ))}
                </div>
                <div className="w-full bg-gray-200 rounded-lg p-4">
                    <h2 className="text-xl font-semibold mb-2">Jumat</h2>
                    {jadwals.filter((jadwal) => jadwal.hari === "Jumat").map((jadwal) => (
                        <div key={jadwal.id} className="mb-2 rounded-lg p-2 bg-background">
                            <p className="text-lg">{mapels.find((mapel) => mapel.id === jadwal.mapel_id)?.nama_mapel}</p>
                            <p className="text-gray-600">{kelas.find((kelas) => kelas.id === jadwal.kelas_id)?.nama_kelas} | {jadwal.jam}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default GuruJadwalPage