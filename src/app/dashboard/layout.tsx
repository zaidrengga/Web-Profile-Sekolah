"use client";

import React from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/SidebarDashboard";
import { useAuth } from "@/hooks/use-auth";
import { redirect, usePathname } from "next/navigation";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import Loading from "@/components/ui/loading";

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, loading } = useAuth();
    const pathname = usePathname(); // misal: /dashboard/admin/users
    const segments = pathname.split("/").filter(Boolean); // ['dashboard', 'admin', 'users']

    const buildPath = (index: number) =>
        "/" + segments.slice(0, index + 1).join("/");

    const formatLabel = (segment: string) =>
        segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

    if (loading) return <Loading />
    if (!isAuthenticated) return redirect("/login")
    return (
        <SidebarProvider >
            {/* Sidebar */}
            <AppSidebar />

            {/* Content */}
            <div className="flex-1 relative max-w-full">
                <div className="bg-background w-full sticky top-14 z-40 p-2 flex items-center gap-4 border-b">
                    <SidebarTrigger />
                    <Breadcrumb>
                        <BreadcrumbList>
                            {segments.map((segment, index) => (
                                <slot key={index}>
                                    <BreadcrumbItem>
                                        {index === segments.length - 1 ? (
                                            <BreadcrumbPage>{formatLabel(segment)}</BreadcrumbPage>
                                        ) : (
                                            <BreadcrumbLink href={buildPath(index)}>
                                                {formatLabel(segment)}
                                            </BreadcrumbLink>
                                        )}
                                    </BreadcrumbItem>
                                    {index !== segments.length - 1 && <BreadcrumbSeparator />}
                                </slot>
                            ))}
                        </BreadcrumbList>
                    </Breadcrumb>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </SidebarProvider>
    );
};

export default DashboardLayout;
