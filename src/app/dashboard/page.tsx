"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/LoadingLayout";
import { useAuth } from "@/hooks/use-auth";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [navigating, setNavigating] = useState(false);

  useEffect(() => {
    if (!loading && !navigating) {
      if (!user) {
        setNavigating(true);
        router.replace("/login");
      } else {
        setNavigating(true);
        switch (user.role) {
          case "admin":
            router.replace("/dashboard/admin");
            break;
          case "guru":
            router.replace("/dashboard/guru");
            break;
          case "siswa":
            router.replace("/dashboard/siswa");
            break;
          default:
            router.replace("/login"); // fallback
        }
      }
    }
  }, [user, loading, router, navigating]);

  // Tampilkan loader selama cek auth / redirect
  return <Loading>Loading...</Loading>;
}
