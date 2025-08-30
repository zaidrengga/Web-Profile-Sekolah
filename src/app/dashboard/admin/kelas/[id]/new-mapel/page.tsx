"use client";

import { FormCard } from "@/components/template/FormCard";
import Loading from "@/components/ui/loading";
import { useCrud } from "@/hooks/use-crud";
import { Mapel } from "@/lib/types";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";
import { MapelRecods } from "../page";
import { RHFInput } from "@/components/template/RHFInput";
import { useForm } from "react-hook-form";


const AdminMapelNewPage = () => {
  const router = useRouter();
  const { id } = useParams();

  const { items: mapels, add: addMapel, loading: mapelLoading } = useCrud<Mapel>("mapels");

  const methods = useForm<MapelRecods>();

  const onSubmit = async (data: Mapel) => {
    if (!data.nama_mapel || !data.kode_mapel) {
      toast.error("Semua field wajib diisi");
      return;
    } else if (mapels.some((mapel) => mapel.nama_mapel === data.nama_mapel)) {
      toast.error("Mapel sudah ada");
      return;
    }

    try {
      await addMapel(data);
      toast.success("Mapel berhasil ditambahkan");
      router.push(`/dashboard/admin/kelas/${id}`);
    } catch (error) {
      console.log(error);
    }
  }

  if (mapelLoading) return <Loading />
  return (
    <FormCard<MapelRecods>
      onSave={onSubmit}
      title="Tambah Mapel"
      methods={methods}
      loading={mapelLoading}
    >
      <RHFInput name="nama_mapel" label="Nama Mapel" placeholder="contoh: Matematika" />
      <RHFInput name="kode_mapel" label="Kode Mapel" placeholder="contoh: MTK" />
    </FormCard>

  )
}

export default AdminMapelNewPage