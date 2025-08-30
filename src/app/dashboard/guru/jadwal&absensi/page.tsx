"use client";

import { Button } from "@/components/ui/button";
import Loading from "@/components/ui/loading";
import { useGuru } from "@/hooks/use-guru";
import { JadwalKelasMapel } from "@/lib/types";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat"];

const GuruAbsensiPage = () => {
    const { jadwals, jadwalHariIni, kelas, mapels, loading } = useGuru();

    if (loading) return <Loading />;

    const renderJadwalCard = (jadwal: JadwalKelasMapel) => (
        <div key={jadwal.id} className="mb-2 rounded-lg p-2 bg-background">
            <p className="text-lg">{mapels.find((m) => m.id === jadwal.mapel_id)?.nama_mapel}</p>
            <p className="text-gray-600">
                {kelas.find((k) => k.id === jadwal.kelas_id)?.nama_kelas} | {jadwal.jam}
            </p>
            <Button className="mt-4 w-full" asChild>
                <Link href={`/dashboard/guru/jadwal&absensi/${jadwal.id}`}>
                    Absensi <ArrowRight />
                </Link>
            </Button>
        </div>
    );

    return (
        <div className="w-full space-y-4">
            <h1 className="text-2xl font-bold">Absensi</h1>
            <div className="w-full h-1 bg-gray-200 rounded-full" />

            {/* Jadwal Hari Ini */}
            <div className="w-full bg-gray-200 rounded-lg p-4">
                <h2 className="text-xl font-semibold mb-2">Hari ini</h2>
                {jadwalHariIni && jadwalHariIni.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                        {jadwalHariIni.map(renderJadwalCard)}
                    </div>
                ) : (
                    <p className="text-gray-500 p-2">Tidak ada jadwal hari ini</p>
                )}
            </div>

            <div className="w-full h-1 bg-background rounded-full" />

            {/* Semua Jadwal */}
            <div>
                <h2 className="text-xl font-semibold mb-2">Semua jadwal</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {days.map((day) => {
                        const dayJadwals = jadwals.filter((j) => j.hari === day);
                        return (
                            <div key={day} className="w-full bg-gray-200 rounded-lg p-4">
                                <h3 className="text-xl font-semibold mb-2">{day}</h3>
                                {dayJadwals.length > 0 ? dayJadwals.map(renderJadwalCard) : <p className="text-gray-500">Tidak ada jadwal</p>}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default GuruAbsensiPage;
