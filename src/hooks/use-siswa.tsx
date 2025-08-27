"use client";

import { Absensi, Siswa, JadwalKelasMapel, Kelas, Mapel } from "@/lib/types";
import { useAuth } from "./use-auth";
import { useCrud } from "./use-crud";

export const useSiswa = () => {
    const { user, loading: userLoading } = useAuth();
    const { items: siswas, loading: siswasLoading } = useCrud<Siswa>("siswas");
    const { items: kelase, loading: kelasLoading } = useCrud<Kelas>("kelas");
    const { items: jadwalsKelas, loading: jadwalsLoading } = useCrud<JadwalKelasMapel>("jadwal_kelas_mapel");
    const { items: mapels, loading: mapelsLoading } = useCrud<Mapel>("mapels");
    const { items: absensise } = useCrud<Absensi>("absensis");

    const siswa = siswas.find((siswa) => siswa.user_id === user?.id);
    const kelas = kelase.find((kelas) => kelas.id === siswa?.kelas_id);

    const jadwals = jadwalsKelas.filter((jadwal) => jadwal.kelas_id === kelas?.id);
    const absensis = absensise.filter((absensi) => absensi.siswa_id === siswa?.id);


    return {
        user,
        siswa,
        kelas,
        jadwals,
        loading: userLoading || siswasLoading || kelasLoading || jadwalsLoading || mapelsLoading,
        mapels,
        absensis
    }
}