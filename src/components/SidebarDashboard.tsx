import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

import { useAuth } from "../hooks/use-auth";
import Link from "next/link";
import { CalendarCheck, Clipboard, Home, School, User, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";

interface SidebarItem {
    label: string;
    href: string;
    icon?: React.ReactNode;
}

export function AppSidebar() {
    const { user, logout } = useAuth();
    const pathname = usePathname();


    let menu: SidebarItem[] = [];
    if (user?.role === "admin") {
        menu = [
            { label: "Overview", href: "/dashboard/admin", icon: <Home size={20} /> },
            { label: "Users", href: "/dashboard/admin/users", icon: <Users size={20} /> },
            { label: "Siswa", href: "/dashboard/admin/siswa", icon: <User size={20} /> },
            { label: "Guru", href: "/dashboard/admin/guru", icon: <User size={20} /> },
            { label: "Kelas", href: "/dashboard/admin/kelas", icon: <School size={20} /> },
            { label: "Jadwal & Mapel", href: "/dashboard/admin/jadwal&mapel", icon: <CalendarCheck size={20} /> },
            { label: "Absensi", href: "/dashboard/admin/absensi", icon: <Clipboard size={20} /> },
        ];
    } else if (user?.role === "guru") {
        menu = [
            { label: "Overview", href: "/dashboard/guru", icon: <Home size={20} /> },
            { label: "Jadwal Mengajar", href: "/dashboard/guru/jadwal", icon: <CalendarCheck size={20} /> },
            { label: "Input Absensi", href: "/dashboard/guru/absensi", icon: <Clipboard size={20} /> },
        ];
    } else if (user?.role === "siswa") {
        menu = [
            { label: "Overview", href: "/dashboard/siswa", icon: <Home size={20} /> },
            { label: "Jadwal Pelajaran", href: "/dashboard/siswa/jadwal", icon: <CalendarCheck size={20} /> },
            { label: "Absensi", href: "/dashboard/siswa/absensi", icon: <Clipboard size={20} /> },
        ];
    }

    return (
        <Sidebar collapsible="icon" className="h-[calc(100vh-56px)] top-14 ">
            <SidebarHeader>
                <SidebarGroup>
                    <SidebarGroupLabel>
                        <div className="flex flex-col">
                            <span className="text-lg font-medium leading-none">
                                {user?.username}
                            </span>
                            <span className="text-xs leading-none text-muted-foreground">
                                {user?.email}
                            </span>
                        </div>
                    </SidebarGroupLabel>
                </SidebarGroup>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {menu.map((item) => (
                                <SidebarMenuItem key={item.label}>
                                    <SidebarMenuButton asChild size={"lg"} variant={pathname === item.href ? "primary" : "default"}>
                                        <Link href={item.href}>
                                            {item.icon}
                                            <span>{item.label}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarGroup>
                    <SidebarGroupLabel>Account</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild >
                                    <Button variant={"destructive"} onClick={logout}>Logout</Button>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarFooter>
        </Sidebar>
    )
}