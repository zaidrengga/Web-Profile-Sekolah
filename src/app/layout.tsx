import type { Metadata } from "next";
import "./globals.css";
import AppNavbar from "@/components/AppNavbar";
import AppFooter from "@/components/AppFooter";
import { AuthProvider } from "@/hooks/use-auth";
import LoadingLayout from "@/components/LoadingLayout";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
  title: process.env.NEXT_PUBLIC_APP_NAME,
  description: "Website sekolah sederhana untuk kebutuhan sekolah",
  icons: {
    icon: "/scholl.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <LoadingLayout>
            <AppNavbar />
            <main className="min-h-[calc(100vh-56px)]">
              <Toaster />
              {children}
            </main>
            <AppFooter />
          </LoadingLayout>
        </AuthProvider>
      </body>
    </html>
  );
}
