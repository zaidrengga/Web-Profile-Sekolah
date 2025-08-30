"use client";

import { FormCard } from "@/components/template/FormCard";
import { useCrud } from "@/hooks/use-crud";
import { JadwalKelasMapel, Mapel, Guru } from "@/lib/types";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { RHFInput } from "@/components/template/RHFInput";
import { RHFSelectSearchable } from "@/components/template/RHFSelectSearchable";
import { useForm } from "react-hook-form";
import Loading from "@/components/ui/loading";

type JadwalFormValues = {
  mapel_id: string;
  guru_id: string;
  hari: "Senin" | "Selasa" | "Rabu" | "Kamis" | "Jumat" | undefined;
  jam: string;
};

const AdminJadwalNewPage = () => {
  const router = useRouter();
  const { id } = useParams(); // kelas_id

  const { items: jadwals, add: addJadwal, loading: jadwalLoading } = useCrud<JadwalKelasMapel>("jadwal_kelas_mapel");
  const { items: mapels, loading: mapelLoading } = useCrud<Mapel>("mapels");
  const { items: gurus, loading: guruLoading } = useCrud<Guru>("gurus");

  const methods = useForm<JadwalFormValues>();

  const onSubmit = async (data: JadwalFormValues) => {
    if (!data.mapel_id || !data.guru_id || !id || !data.hari || !data.jam) {
      toast.error("Semua field wajib diisi");
      return;
    } else if (jadwals.some((jadwal) => jadwal.mapel_id === data.mapel_id && jadwal.guru_id === data.guru_id && jadwal.hari === data.hari && jadwal.jam === data.jam)) {
      toast.error("Jadwal sudah ada");
      return;
    }

    try {
      const response = await addJadwal({
        id: crypto.randomUUID().toString(),
        mapel_id: data.mapel_id,
        kelas_id: id as string,
        guru_id: data.guru_id,
        hari: data.hari,
        jam: data.jam,
      });

      if (response) {
        toast.success("Jadwal berhasil ditambahkan");
        router.push(`/dashboard/admin/kelas/${id}`);
      } else {
        toast.error("Gagal menambahkan jadwal");
      }
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan");
    }
  };

  if (jadwalLoading || mapelLoading || guruLoading) return <Loading />;

  return (
    <FormCard<JadwalFormValues>
      onSave={onSubmit}
      title="Tambah Jadwal"
      methods={methods}
      loading={jadwalLoading || mapelLoading || guruLoading}
    >
      <RHFSelectSearchable
        control={methods.control}
        name="mapel_id"
        label="Mapel"
        placeholder="Pilih Mapel"
        options={mapels.map((mapel) => ({ value: mapel.id, label: mapel.nama_mapel }))}
      />

      <RHFSelectSearchable
        control={methods.control}
        name="guru_id"
        label="Guru"
        placeholder="Pilih Guru"
        options={gurus.map((guru) => ({ value: guru.id, label: guru.nama }))}
      />

      <RHFSelectSearchable
        control={methods.control}
        name="hari"
        label="Hari"
        placeholder="Pilih Hari"
        options={[
          { value: "Senin", label: "Senin" },
          { value: "Selasa", label: "Selasa" },
          { value: "Rabu", label: "Rabu" },
          { value: "Kamis", label: "Kamis" },
          { value: "Jumat", label: "Jumat" },
        ]}
      />

      <RHFInput name="jam" label="Jam" placeholder="contoh: 08:00-09:00" />
    </FormCard>
  );
};

export default AdminJadwalNewPage;