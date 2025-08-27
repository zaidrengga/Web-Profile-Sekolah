"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/LoadingLayout";
import { useAuth } from "@/hooks/use-auth";

export default function DashboardPage() {
  const router = useRouter();

  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) { // tunggu user selesai load
      if (!user) {
        router.push("/login");
      } else {
        if (user.role === "admin") router.push("/dashboard/admin");
        if (user.role === "guru") router.push("/dashboard/guru");
        if (user.role === "siswa") router.push("/dashboard/siswa");
      }
    }
  }, [user, loading, router]);

  return <Loading>.</Loading>;
}
