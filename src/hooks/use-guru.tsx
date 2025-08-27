"use client";

import { Absensi, Guru, JadwalKelasMapel, Kelas, Mapel } from "@/lib/types";
import { useAuth } from "./use-auth";
import { useCrud } from "./use-crud";

export const useGuru = () => {
    const { user, loading: userLoading } = useAuth();
    const { items: gurus, loading: gurusLoading } = useCrud<Guru>("gurus");
    const { items: kelas, loading: kelasLoading } = useCrud<Kelas>("kelas");
    const { items: jadwalsKelas, loading: jadwalsLoading } = useCrud<JadwalKelasMapel>("jadwal_kelas_mapel");
    const { items: mapels, loading: mapelsLoading } = useCrud<Mapel>("mapels");
    const { items: absensis } = useCrud<Absensi>("absensis");

    const guru = gurus.find((guru) => guru.user_id === user?.id);
    const waliKelas = kelas.find((kelas) => kelas.wali_kelas_id === guru?.id);

    const tanggalSekarang = new Date();
    const formatter = new Intl.DateTimeFormat('id-ID', { weekday: 'long' });
    const hariIni = formatter.format(tanggalSekarang);

    const jadwals = jadwalsKelas.filter((jadwal) => jadwal.guru_id === guru?.id);
    const jadwalHariIni = jadwals.filter((jadwal) => jadwal.hari === hariIni);

    const absensiById = (jadwalId: string) => absensis.filter((absensi) => absensi.jadwal_kelas_mapel_id === jadwalId);

    const mapelGuru = jadwals.map((jadwal) => mapels.find((mapel) => mapel.id === jadwal.mapel_id)).filter((mapel, index, self) => mapel && index === self.indexOf(mapel));

    return {
        user,
        guru,
        loading: userLoading || gurusLoading || kelasLoading || jadwalsLoading || mapelsLoading,
        jadwals,
        absensiById,
        kelas,
        mapels,
        jadwalHariIni,
        mapelGuru,
        waliKelas
    };
};