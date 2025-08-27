"use client"

import { Button } from '@/components/ui/button';
import Loading from '@/components/ui/loading';
import { useGuru } from '@/hooks/use-guru';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

const GuruAbsensiPage = () => {
    const { jadwals, jadwalHariIni, kelas, mapels, loading } = useGuru();

    if (loading) return <Loading />
    return (
        <div className="w-full space-y-4">
            <h1 className="text-2xl font-bold">Absensi</h1>
            <div className="w-full h-1 bg-gray-200 rounded-full"></div>
            <div className="w-full bg-gray-200 rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-2">Hari ini</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                    {jadwalHariIni?.map((jadwal) => (
                        <div key={jadwal.id} className="mb-2 rounded-lg p-2 bg-background">
                            <p className="text-lg">{mapels.find((mapel) => mapel.id === jadwal.mapel_id)?.nama_mapel}</p>
                            <p className="text-gray-600">{kelas.find((kelas) => kelas.id === jadwal.kelas_id)?.nama_kelas} | {jadwal.jam}</p>
                            <Button className="mt-4 w-full" asChild><Link href={`/dashboard/guru/absensi/${jadwal.id}`}>Absensi <ArrowRight /></Link></Button>
                        </div>
                    ))}
                </div>

                <div className="w-full h-1 mt-4 bg-background rounded-full"></div>

                <h2 className="text-xl font-semibold mt-4 mb-2">Semua jadwal</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {days.map((day) => (
                        <div key={day} className="w-full bg-gray-200 rounded-lg p-4">
                            <h2 className="text-xl font-semibold mb-2">{day}</h2>
                            {jadwals
                                .filter((jadwal) => jadwal.hari === day)
                                .map((jadwal) => (
                                    <div key={jadwal.id} className="mb-2 rounded-lg p-2 bg-background">
                                        <p className="text-lg">
                                            {mapels.find((mapel) => mapel.id === jadwal.mapel_id)?.nama_mapel}
                                        </p>
                                        <p className="text-gray-600">
                                            {kelas.find((kelas) => kelas.id === jadwal.kelas_id)?.nama_kelas} | {jadwal.jam}
                                        </p>
                                        <Button className="mt-4 w-full" asChild><Link href={`/dashboard/guru/absensi/${jadwal.id}`}>Absensi <ArrowRight /></Link></Button>
                                    </div>
                                ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default GuruAbsensiPage