"use client";

import {
  Home,
  Info,
  Users,
  GraduationCap,
  CalendarCheck,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Contact,
  GalleryHorizontal,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const quickLinks = [
  { label: "Home", icon: Home, href: "/" },
  { label: "About Us", icon: Info, href: "/about" },
  { label: "Teachers", icon: Users, href: "/teachers" },
];

const services = [
  { label: "Blog", icon: CalendarCheck, href: "/blog" },
  { label: "Gallery", icon: GalleryHorizontal, href: "/gallery" },
  { label: "Contact", icon: Contact, href: "/contact" },
];

const socials = [
  { icon: Facebook, href: "#", color: "from-blue-500 to-blue-600" },
  { icon: Twitter, href: "#", color: "from-blue-400 to-blue-500" },
  { icon: Instagram, href: "#", color: "from-pink-500 to-pink-600" },
  { icon: Linkedin, href: "#", color: "from-blue-600 to-blue-700" },
];

export default function AppFooter() {
  const pathname = usePathname();

  // Jika berada di halaman dashboard, jangan tampilkan footer
  if (pathname.startsWith("/dashboard")) return null;

  return (
    <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & About */}
          <div>
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center mr-3">
                <GraduationCap className="text-white w-6 h-6" />
              </div>
              <div>
                <span className="text-xl font-bold">{process.env.NEXT_PUBLIC_APP_NAME}</span>
                <div className="text-xs text-gray-400 -mt-1">
                  Sekolah Keunggulan
                </div>
              </div>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Inspiring excellence and nurturing future leaders since 1994.
              Where dreams take flight.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 gradient-text">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              {quickLinks.map(({ label, icon: Icon, href }, idx) => (
                <li key={idx}>
                  <Link
                    href={href}
                    className="text-gray-300 hover:text-white transition duration-300 flex items-center"
                  >
                    <Icon className="w-4 h-4 mr-2" /> {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-bold mb-6 gradient-text">Services</h4>
            <ul className="space-y-3 text-sm">
              {services.map(({ label, icon: Icon, href }, idx) => (
                <li key={idx}>
                  <Link
                    href={href}
                    className="text-gray-300 hover:text-white transition duration-300 flex items-center"
                  >
                    <Icon className="w-4 h-4 mr-2" /> {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 className="text-lg font-bold mb-6 gradient-text">Follow Us</h4>
            <div className="flex space-x-4 mb-6">
              {socials.map(({ icon: Icon, href, color }, idx) => (
                <Link
                  key={idx}
                  href={href}
                  className={`w-10 h-10 bg-gradient-to-br ${color} rounded-lg flex items-center justify-center text-white hover:scale-110 transition duration-300`}
                >
                  <Icon className="w-5 h-5" />
                </Link>
              ))}
            </div>
            <p className="text-gray-400 text-xs">
              Stay connected with our community
            </p>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-gray-700 mt-12 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            &copy; 2024 Harmony Heights School. All rights reserved. | Designed
            with ❤️ for education
          </p>
        </div>
      </div>
    </footer>
  );
}
