"use client"

import { Button } from "@/components/ui/button";
import { imageLoader } from "@/components/ui/imageLoader";
import Loading from "@/components/ui/loading";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { useCrud } from "@/hooks/use-crud";
import { Blog, Gallery, User } from "@/lib/types";
import { ArrowRight, UserCog, UserPen, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const AdminPage = () => {
  const { user, loading } = useAuth();
  const { items: users, loading: usersLoading } = useCrud<User>("users");
  const { items: blogs, loading: blogsLoading } = useCrud<Blog>("blogs");
  const { items: galeris, loading: galerisLoading } = useCrud<Gallery>("galleries");

  const siswa = users.filter((user) => user.role === "siswa");
  const guru = users.filter((user) => user.role === "guru");

  const list = [
    {
      icon: Users,
      color: "text-blue-600 bg-blue-100",
      title: "Pengguna",
      value: users.length,
      link: "/dashboard/admin/users",
    },
    {
      icon: UserPen,
      color: "text-green-600 bg-green-100",
      title: "Siswa",
      value: siswa.length,
      link: "/dashboard/admin/siswa",
    },
    {
      icon: UserCog,
      color: "text-yellow-600 bg-yellow-100",
      title: "Guru",
      value: guru.length,
      link: "/dashboard/admin/guru",
    },
  ];

  if (loading || usersLoading || blogsLoading || galerisLoading) return <Loading />;

  return (
    <div className="w-full min-h-screen">
      <div className="w-full grid grid-cols-6 gap-6">

        {/* Konten Utama */}
        <div className="sm:col-span-4 col-span-6 md:col-span-6 lg:col-span-4">
          <div className="rounded-xl border bg-white shadow-md p-6">
            <h1 className="text-3xl font-bold">Selamat datang di <span className="text-blue-600">Dashboard Admin</span></h1>
            <p className="text-gray-600 mt-1">
              Ini adalah pusat kendali admin. Anda dapat mengelola data pengguna, siswa, dan guru dari sini.
            </p>

            {/* Statistik */}
            <h2 className="text-lg font-semibold mt-6 mb-3">Statistik Pengguna</h2>
            <div className="grid grid-cols-3 gap-4">
              {list.map((item, index) => (
                <div
                  key={index}
                  className="lg:p-6 md:p-4 sm:p-6 p-2  rounded-xl border bg-white shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-center lg:flex-row md:flex-col sm:flex-row flex-col mb-3">
                    <div className={`p-2 rounded-lg ${item.color}`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="ml-3 text-lg font-medium">{item.title}</span>
                  </div>
                  <div className="flex items-center justify-between lg:flex-row md:flex-col sm:flex-row flex-col">
                    <span className="text-2xl font-bold">{item.value}</span>
                    <Button asChild variant="outline" size="sm">
                      <Link href={item.link}>
                        Lihat <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Profil Admin */}
        <div className="col-span-6 sm:col-span-2 md:col-span-6 lg:col-span-2">
          <div className="rounded-xl border h-full bg-white shadow-md p-6 flex lg:flex-col md:flex-row sm:flex-col flex-row items-center space-x-4">
            <Image
              loader={imageLoader}
              src={user?.image || ""}
              alt={user?.username || ""}
              width={120}
              height={120}
              className="w-32 h-32 rounded-full border-2 border-gray-200 shadow-sm"
            />
            <div className="flex flex-col lg:items-center md:items-start sm:items-center items-start">
              <h2 className="text-xl font-semibold mt-4">{user?.username}</h2>
              <p className="text-gray-500">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="col-span-6 p-6 rounded-xl border shadow-md">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Berita Terbaru</h1>
            <Button asChild size="sm">
              <Link href="/dashboard/admin/blog">Lihat Semua <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
          <Separator className="my-2"/>
          <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
            {blogs
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) // 🔑 sort terbaru dulu
              .slice(0, 3)
              .map((blog) => (
                <div key={blog.id} className="border rounded-lg overflow-hidden shadow-md">
                  <Image
                    loader={imageLoader}
                    priority
                    src={blog.thumbnail || ""}
                    alt={blog.title}
                    width={200}
                    height={200}
                    className="w-full aspect-video object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{blog.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      oleh {blog.author} • {new Date(blog.created_at).toLocaleDateString()}
                    </p>
                    <p>
                      <span className="line-clamp-2">{blog.content}</span>
                      <Link
                        className="text-blue-600 hover:underline"
                        href={`/blog/${blog.slug}`}
                      >
                        {" "}
                        Selengkapnya...
                      </Link>
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>

        <div className="col-span-6 p-6 rounded-xl border shadow-md">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Galeri Terbaru</h1>
            <Button asChild size="sm">
              <Link href="/dashboard/admin/blog">Lihat Semua <ArrowRight className="ml-1 h-4 w-4" /></Link>
            </Button>
          </div>
          <Separator className="my-2"/>
          <div className="grid lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
            {galeris
              .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) // 🔑 sort terbaru dulu
              .slice(0, 3)
              .map((galleri) => (
                <div key={galleri.id} className="border rounded-lg overflow-hidden shadow-md">
                  <Image
                    loader={imageLoader}
                    priority
                    src={galleri.image_url || ""}
                    alt={galleri.title}
                    width={200}
                    height={200}
                    className="w-full aspect-video object-cover"
                  />
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{galleri.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{galleri.description}</p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;