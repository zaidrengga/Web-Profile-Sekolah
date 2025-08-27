"use client"

import { Button } from "@/components/ui/button";
import { imageLoader } from "@/components/ui/imageLoader";
import Loading from "@/components/ui/loading";
import { useAuth } from "@/hooks/use-auth";
import { useCrud } from "@/hooks/use-crud";
import { User } from "@/lib/types";
import { ArrowRight, User2, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";


const AdminPage = () => {
  const { user, loading } = useAuth();
  const { items: users, loading: usersLoading } = useCrud<User>("users");

  const siswa = users.filter((user) => user.role === "siswa");
  const guru = users.filter((user) => user.role === "guru");

  const list = [
    {
      icon: <User2 />,
      title: "Users",
      value: users.length,
      link: "/dashboard/admin/users",
    },
    {
      icon: <User2 />,
      title: "Siswa",
      value: siswa.length,
      link: "/dashboard/admin/siswa",
    },
    {
      icon: <Users />,
      title: "Guru",
      value: guru.length,
      link: "/dashboard/admin/guru",
    },
  ];

  if (loading || usersLoading) return <Loading />
  return (
    <div className="w-full min-h-screen p-4">
      <div className="w-full grid grid-cols-6 gap-4">
        <div className="col-span-4 rounded-xl border shadow-md p-6">
          <h1 className="text-2xl font-bold">Hello, {user?.username}</h1>
          <p className="text-gray-600">Selamat datang di dashboard admin.</p>
          <p>Anda dapat mengakses informasi dan fitur khusus untuk admin di sini.</p>
        </div>

        <div className="col-span-2 rounded-xl border shadow-md p-6 flex flex-col items-center justify-center">
          <Image
            loader={imageLoader}
            src={user?.image || ""}
            alt={user?.username || ""}
            width={100}
            height={100}
            className="w-32 h-32 rounded-full"
          />
          <h1 className="text-2xl font-bold mt-4">{user?.username}</h1>
          <p className="text-gray-600">{user?.email}</p>
        </div>

        <div className="col-span-6">
          <div className="grid grid-cols-4 gap-4">
            {list.map((item, index) => (
              <div key={index} className="p-4 rounded-xl border shadow-md">
                <div className="flex items-center mb-2">
                  {item.icon}
                  <span className="ml-2 text-lg font-semibold">{item.title}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">{item.value}</span>
                  <Button asChild variant={"link"}>
                    <Link href={item.link}>Lihat <ArrowRight /></Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPage