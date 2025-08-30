"use client";

import React from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/ui/loading";
import { useCrud } from "@/hooks/use-crud";
import { Kelas, Siswa, User } from "@/lib/types";
import { FormCard } from "@/components/template/FormCard";
import { RHFSelect } from "@/components/template/RHFSelect";
import { RHFInput } from "@/components/template/RHFInput";
import { RHFSelectSearchable } from "@/components/template/RHFSelectSearchable";
import { useForm } from "react-hook-form";
import { SiswaRecord } from "../page";
import { toast } from "sonner";

const AdminSiswaNewPage = () => {
    const { items: siswas, add: createSiswa, loading: siswasLoading } = useCrud<Siswa>("siswas");
    const { items: users, loading: usersLoading } = useCrud<User>("users");
    const { items: kelas, loading: kelasLoading } = useCrud<Kelas>("kelas");
    const router = useRouter();

    const methods = useForm<SiswaRecord>();

    const handleSave = async (data: Siswa) => {
        if (!data.user_id || !data.nama || !data.nisn || !data.kelas_id) {
            toast.error("Semua field wajib diisi");
            return;
        } else if (siswas.some((s) => s.nisn === data.nisn)) {
            toast.error("NISN sudah ada");
            return;
        } else if (siswas.some((s) => s.user_id === data.user_id)) {
            toast.error("User sudah ada");
            return;
        } 

        const siswa = await createSiswa({
            ...data,
            id: crypto.randomUUID(),
            alamat: data.alamat ?? null,
            telepon_wali: data.telepon_wali ?? null,
        });

        if (siswa) {
            router.push("/dashboard/admin/siswa");
            toast.success("Siswa berhasil ditambahkan");
        } else {
            toast.error("Gagal menambahkan siswa");
            throw new Error("Gagal menambahkan siswa");
        }
    };

    if (siswasLoading || usersLoading || kelasLoading) return <Loading />;

    return (
        <div>
            <FormCard<SiswaRecord>
                title="Tambah Siswa Baru"
                onSave={handleSave}
                methods={methods}
                loading={siswasLoading}
            >
                <RHFSelectSearchable<SiswaRecord>
                    name="user_id"
                    label="User"
                    placeholder="-- Pilih User --"
                    options={users.map((u) => ({
                        label: u.username || "",
                        value: u.id,
                    }))}
                    control={methods.control}
                />

                <RHFInput name="nama" label="Nama" placeholder="Masukkan nama siswa" />
                <RHFInput name="nisn" label="NISN" placeholder="Masukkan NISN" />
                <RHFInput name="alamat" label="Alamat" placeholder="Masukkan alamat" />
                <RHFInput
                    name="telepon_wali"
                    label="Telepon Wali"
                    placeholder="Masukkan nomor telepon wali"
                />

                <RHFSelect
                    name="kelas_id"
                    label="Kelas"
                    placeholder="-- Pilih Kelas --"
                    options={kelas.map((k) => ({
                        label: k.nama_kelas,
                        value: k.id,
                    }))}
                />
            </FormCard>
        </div>
    );
};

export default AdminSiswaNewPage;
