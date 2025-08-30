"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useCrud } from "@/hooks/use-crud";
import { Guru, User } from "@/lib/types";
import Loading from "@/components/ui/loading";
import { RHFSelectSearchable } from "@/components/template/RHFSelectSearchable";
import { RHFInput } from "@/components/template/RHFInput";
import { FormCard } from "@/components/template/FormCard";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

type GuruFormValues = {
    user_id: string;
    nama: string;
    nip?: string;
    alamat?: string;
    telepon?: string;
    jabatan?: string;
};

const AdminGuruNewPage = () => {
    const { items: gurus, add: addGuru, loading: gurusLoading } = useCrud<Guru>("gurus");
    const { items: users, loading: usersLoading } = useCrud<User>("users");
    const router = useRouter();

    const onSubmit = async (data: GuruFormValues) => {
        if (!data.user_id || !data.nama) {
            toast.error("Semua field wajib diisi");
            return;
        } else if (gurus.some((guru) => guru.user_id === data.user_id)) {
            toast.error("User sudah ada");
            return;
        } else if (gurus.some((guru) => guru.nip === data.nip)) {
            toast.error("NIP sudah ada");
            return;
        }

        try {
            const success = await addGuru({
                id: crypto.randomUUID(),
                user_id: data.user_id,
                nama: data.nama,
                nip: data.nip || null,
                alamat: data.alamat || null,
                telepon: data.telepon || null,
                jabatan: data.jabatan || null,
            } as Guru);

            if (success) {
                toast.success("Guru berhasil ditambahkan");
                router.push("/dashboard/admin/guru");
            } else {
                toast.error("Gagal menambahkan guru");
            }
        } catch (err) {
            console.error(err);
            toast.error("Terjadi kesalahan");
        }
    };

    const methods = useForm<GuruFormValues>();

    if (gurusLoading || usersLoading) return <Loading />;

    return (
        <FormCard<GuruFormValues>
            onSave={onSubmit}
            loading={false} // biarkan FormCard handle submit state
            methods={methods}
            title="Tambah Guru Baru"
        >
            <RHFSelectSearchable<GuruFormValues>
                name="user_id"
                label="Pilih User"
                placeholder="-- Pilih User --"
                options={users.map((user) => ({
                    label: `${user.username} (${user.email})`,
                    value: user.id,
                }))}
                control={methods.control}
            />

            <RHFInput name="nama" label="Nama" placeholder="Nama guru" />
            <RHFInput name="nip" label="NIP" placeholder="NIP" />
            <RHFInput name="alamat" label="Alamat" placeholder="Alamat" />
            <RHFInput name="telepon" label="Telepon" placeholder="Telepon" />
            <RHFInput name="jabatan" label="Jabatan" placeholder="Jabatan" />
        </FormCard>
    );
};

export default AdminGuruNewPage;
