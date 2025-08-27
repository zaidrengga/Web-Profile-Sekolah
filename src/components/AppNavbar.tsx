"use client"

import { AlignRight, GraduationCap } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "./ui/button"
import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"

const links = [
    { label: "Home", href: "/" },
    { label: "About Us", href: "/about" },
    { label: "Teachers", href: "/teachers" },
    { label: "gallery", href: "/gallery" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" }
]

const AppNavbar = () => {
    const [open, setOpen] = useState(false)
    const pathname = usePathname()

    const { isAuthenticated } = useAuth();

    return (
        <header className="sticky top-0 z-50 h-14 w-full p-2 bg-white shadow-lg">
            <nav className="w-full flex justify-between items-center px-4 sm:px-6 lg:px-10 gap-2">
                {/* Logo */}
                <Link href="/" className="flex items-center text-nowrap">
                    <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg sm:flex hidden items-center justify-center mr-3">
                        <GraduationCap className="text-white w-6 h-6" />
                    </div>
                    <div className="flex flex-col">
                        <span className="xs:text-xl text-lg font-bold text-primary">{process.env.NEXT_PUBLIC_APP_NAME}</span>
                        <div className="text-xs text-gray-400 -mt-1">Sekoah Keunggulan</div>
                    </div>
                </Link>

                {/* Menu */}
                <div className="flex items-center gap-6">
                    <ul className="md:flex hidden items-center gap-6">
                        {links.map((link, idx) => {
                            const isActive = pathname === link.href
                            return (
                                <li key={idx}>
                                    <Link
                                        href={link.href}
                                        className={`relative text-gray-600 transition duration-300 after:content-[''] after:absolute after:left-1/2 after:bottom-[-4px]  after:h-[2px] after:w-0 after:bg-indigo-500 after:transition-all after:duration-300 after:origin-center hover:after:w-full hover:after:left-0
                                    ${isActive ? "text-indigo-600 font-semibold hover:cursor-default" : "hover:text-gray-800"}`}
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            )
                        })}
                    </ul>

                    {isAuthenticated ? (
                        <>
                            <Button
                                asChild={!pathname.startsWith("/dashboard")} // supaya <Link> tidak aktif
                                variant={pathname.startsWith("/dashboard") ? "default" : "outline"}
                                size="sm"
                                disabled={pathname.startsWith("/dashboard")}
                            >
                                {pathname.startsWith("/dashboard") ? (
                                    <span>Dashboard</span> // tampilkan span agar tidak jadi link
                                ) : (
                                    <Link href="/dashboard">Dashboard</Link>
                                )}
                            </Button>

                        </>
                    ) : (
                        <Button asChild size="sm">
                            <Link href="/login">Login</Link>
                        </Button>
                    )}

                    <Button size={"icon"} variant="outline" className="md:hidden flex" onClick={() => setOpen(!open)}>
                        <AlignRight />
                    </Button>

                    <ul
                        className={`absolute  top-14 left-0 w-full border-t bg-white shadow-md p-4 md:hidden flex flex-col gap-2 transform transition-all duration-300 ease-in-out
                             ${open ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-full pointer-events-none"}`}
                    >
                        {links.map((link, idx) => {
                            const isActive = pathname === link.href
                            return (
                                <li key={idx} className="w-full">
                                    <Button
                                        asChild
                                        variant={isActive ? "secondary" : "outline"}
                                        className="w-full flex justify-start"
                                    >
                                        <Link href={link.href} onClick={() => setOpen(false)}>{link.label}</Link>
                                    </Button>
                                </li>
                            )
                        })}
                    </ul>
                </div>
            </nav>
        </header>
    )
}

export default AppNavbar