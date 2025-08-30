"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useCrud } from "@/hooks/use-crud";
import { User } from "@/lib/types";
import { FormCard } from "@/components/template/FormCard";
import { RHFInput } from "@/components/template/RHFInput";
import { RHFSelect } from "@/components/template/RHFSelect";
import { UserRecord } from "../page";
import { toast } from "sonner";
import { useForm } from "react-hook-form";

const AdminUserNewPage = () => {
  const { items: users, add: addNewUser, loading } = useCrud<User>("users");
  const router = useRouter();

  const methods = useForm<UserRecord>();

  const handleSave = async (data: User) => {
    if (!data.username || !data.email || !data.password || !data.role) {
      toast.error("Semua field harus diisi");
      throw new Error("Semua field harus diisi");
    } else if (
      users.some((user) => user.username === data.username) ||
      users.some((user) => user.email === data.email)
    ) {
      toast.error("Username atau email sudah ada");
      throw new Error("Username atau email sudah ada");
    }

    const success = await addNewUser({
      ...data,
      image: null,
      created_at: new Date().toISOString(),
    });

    if (success) {
      toast.success("User berhasil ditambahkan");
      router.push("/dashboard/admin/users");
    } else {
      toast.error("Gagal menambahkan user");
      throw new Error("Gagal menambahkan user");
    }
  };

  return (
    <div>
      <FormCard<UserRecord>
        title="Tambah User"
        onSave={handleSave}
        methods={methods}
        loading={loading}
      >
        <RHFInput name="username" label="Username" placeholder="Username" />
        <RHFInput name="email" label="Email" type="email" placeholder="Email" />
        <RHFInput
          name="password"
          label="Password"
          type="password"
          placeholder="Password"
        />
        <RHFSelect
          name="role"
          label="Role"
          options={[
            { label: "Admin", value: "admin" },
            { label: "Guru", value: "guru" },
            { label: "Siswa", value: "siswa" },
          ]}
          placeholder="Pilih Role"
        />
      </FormCard>
    </div>
  );
};

export default AdminUserNewPage;
