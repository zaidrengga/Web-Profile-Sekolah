"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useCrud } from "@/hooks/use-crud";
import { Guru, Kelas } from "@/lib/types";
import Loading from "@/components/ui/loading";
import { RHFSelectSearchable } from "@/components/template/RHFSelectSearchable";
import { RHFInput } from "@/components/template/RHFInput";
import { FormCard } from "@/components/template/FormCard";
import { useForm } from "react-hook-form";
import { KelasRecord } from "../../kelas/page";

const AdminKelasNewPage = () => {
  const { add: addNewKelas, loading: kelasLoading } = useCrud<Kelas>("kelas");
  const { items: gurus, loading: gurusLoading } = useCrud<Guru>("gurus");
  const router = useRouter();

  const onSubmit = async (data: Kelas) => {
    if (!data.nama_kelas || !data.tahun_ajaran || !data.wali_kelas_id) {
      alert("Semua field wajib diisi");
      return;
    } else if (gurus.some((g) => g.id === data.wali_kelas_id)) {
      alert("Guru sudah ada");
      return;
    } else if (gurus.some((g) => g.nama === data.nama_kelas)) {
      alert("Kelas sudah ada");
      return;
    }
    try {
      const success = await addNewKelas({
        id: crypto.randomUUID(),
        nama_kelas: data.nama_kelas,
        tahun_ajaran: data.tahun_ajaran,
        wali_kelas_id: data.wali_kelas_id,
      });

      if (success) {
        router.push("/dashboard/admin/kelas");
      } else {
        alert("Gagal menambahkan kelas");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan");
    }
  };

  const methods = useForm<KelasRecord>();

  if (kelasLoading || gurusLoading) return <Loading />;

  return (
    <FormCard<KelasRecord>
      onSave={onSubmit}
      loading={false} // FormCard handle submit state
      methods={methods}
      title="Tambah Kelas Baru"
    >

      <RHFInput
        name="nama_kelas"
        label="Nama Kelas"
        placeholder="Contoh: 10 IPA 1"
      />

      <RHFInput
        name="tahun_ajaran"
        label="Tahun Ajaran"
        placeholder="Contoh: 2023/2024"
      />

      <RHFSelectSearchable<KelasRecord>
        name="wali_kelas_id"
        label="Wali Kelas"
        placeholder="-- Pilih Wali Kelas --"
        options={gurus.map((g) => ({
          label: g.nama,
          value: g.id,
        }))}
        control={methods.control}
      />
    </FormCard>
  );
};

export default AdminKelasNewPage;