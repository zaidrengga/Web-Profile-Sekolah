"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import Loading from "@/components/ui/loading";

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

  return <Loading />
}
