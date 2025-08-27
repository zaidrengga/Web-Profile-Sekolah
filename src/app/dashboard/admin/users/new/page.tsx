"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useCrud } from "@/hooks/use-crud";
import { User } from "@/lib/types";

const AdminUserNewPage = () => {
  const { add: addNewUser } = useCrud<User>("users");
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"admin" | "guru" | "siswa">("siswa");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!username || !email || !password) {
      setError("Semua field wajib diisi");
      return;
    }

    setLoading(true);

    const success = await addNewUser({
      id: crypto.randomUUID(),
      username,
      email,
      password,
      role,
      image: null,
      created_at: new Date().toISOString(),
    });
    setLoading(false);

    if (success) {
      router.push("/dashboard/admin/users"); // redirect ke halaman user
    } else {
      setError("Gagal menambahkan user");
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md mt-8">
      <h1 className="text-2xl font-bold mb-4">Tambah User Baru</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 border rounded"
        />
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as "admin" | "guru" | "siswa")}
          className="w-full p-2 border rounded"
        >
          <option value="admin">Admin</option>
          <option value="guru">Guru</option>
          <option value="siswa">Siswa</option>
        </select>
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Loading..." : "Tambah User"}
        </Button>
      </form>
    </div>
  );
};

export default AdminUserNewPage;
