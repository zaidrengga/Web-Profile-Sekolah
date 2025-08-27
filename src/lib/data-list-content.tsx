import { useCrud } from '@/hooks/use-crud';
import {
  Award,
  Trophy,
  Users,
  Telescope,
  Compass,
  Microscope,
  Code,
  BookOpen,
  Dumbbell,
  Theater,
  Utensils,
  Medal,
  Star,
} from 'lucide-react';
import React from 'react'
import { Siswa } from './types';

export const DataListContent = () => {
  const { items: siswas } = useCrud<Siswa>("siswas");

  const stats = [
    {
      icon: <Users size={32} />,
      value: `${siswas.length}+`,
      label: "Siswa",
    },
    {
      icon: <Award size={32} />,
      value: "150+",
      label: "Pendidik",
    },
    {
      icon: <Trophy size={32} />,
      value: "30+",
      label: "Prestasi",
    },
  ];

  const purposes = [
    {
      title: "Misi Kami",
      icon: <Telescope size={32} className="text-white" />,
      bg: "from-indigo-50 to-purple-50",
      iconBg: "from-indigo-500 to-purple-600",
      desc: "Menjadi mercusuar pendidikan transformatif, mendidik warga dunia yang memimpin dengan integritas, berinovasi dengan tujuan, dan menginspirasi perubahan positif di dunia yang saling terhubung.",
    },
    {
      title: "Visi Kami",
      icon: <Compass size={32} className="text-white" />,
      bg: "from-purple-50 to-pink-50",
      iconBg: "from-purple-500 to-pink-600",
      desc: "Memberikan pendidikan luar biasa melalui pedagogi inovatif, menumbuhkan pemikiran kritis, kreativitas, dan karakter dalam lingkungan yang mendukung, merayakan keberagaman, serta memberdayakan setiap siswa untuk mencapai potensi tertinggi mereka.",
    },
  ];

  const facilities = [
    {
      title: "Laboratorium Canggih",
      icon: <Microscope size={28} className="text-white" />,
      bg: "from-blue-500 to-cyan-500",
      desc: "Laboratorium sains mutakhir dengan peralatan terbaru untuk pembelajaran dan penelitian langsung",
    },
    {
      title: "Pusat Inovasi",
      icon: <Code size={28} className="text-white" />,
      bg: "from-green-500 to-emerald-500",
      desc: "Laboratorium komputer modern dengan alat AI, robotika, dan lingkungan pemrograman",
    },
    {
      title: "Perpustakaan Digital",
      icon: <BookOpen size={28} className="text-white" />,
      bg: "from-purple-500 to-violet-500",
      desc: "Koleksi besar buku, sumber daya digital, dan ruang belajar tenang untuk pembelajaran fokus",
    },
    {
      title: "Pusat Olahraga",
      icon: <Dumbbell size={28} className="text-white" />,
      bg: "from-orange-500 to-red-500",
      desc: "Fasilitas standar Olimpiade termasuk kolam renang, lapangan, dan pusat kebugaran",
    },
    {
      title: "Kompleks Seni",
      icon: <Theater size={28} className="text-white" />,
      bg: "from-pink-500 to-rose-500",
      desc: "Studio profesional untuk musik, drama, seni rupa, dan ekspresi kreatif",
    },
    {
      title: "Ruang Makan",
      icon: <Utensils size={28} className="text-white" />,
      bg: "from-teal-500 to-cyan-500",
      desc: "Makanan bergizi disiapkan segar setiap hari di fasilitas kuliner modern kami",
    },
  ];

  const achievements = [
    {
      title: "Pameran Sains Internasional",
      icon: <Medal size={40} className="mb-6" />,
      gradient: "from-yellow-400 to-orange-500",
      subtitle: "Pemenang Medali Emas 2024",
      student: "Emma Rodriguez - Kelas 12",
    },
    {
      title: "Kejuaraan Robotika",
      icon: <Trophy size={40} className="mb-6" />,
      gradient: "from-green-400 to-emerald-500",
      subtitle: "Juara Nasional",
      student: "Tim Teknologi Alpha - 8 Siswa",
    },
    {
      title: "Prestasi Sastra",
      icon: <Star size={40} className="mb-6" />,
      gradient: "from-purple-400 to-indigo-500",
      subtitle: "Penghargaan Penulis Muda",
      student: "Alex Chen - Kelas 10",
    },
  ];

  return {
    stats,
    purposes,
    facilities,
    achievements,
  };
}

interface UserType {
  name: string;
  role: string;
  avatar: string;
}

export const dataUser = () => {
  const user: UserType = {
    name: "Budi Santoso",
    role: "Siswa",
    avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
  }

  const users = [
    {
      name: "Budi Santoso",
      role: "Siswa",
      avatar: "https://randomuser.me/api/portraits/lego/1.jpg",
    },
    {
      name: "Siti Aminah",
      role: "Guru",
      avatar: "https://randomuser.me/api/portraits/lego/2.jpg",
    },
    {
      name: "Andi Wijaya",
      role: "Orang Tua",
      avatar: "https://randomuser.me/api/portraits/lego/3.jpg",
    },
  ];
  return {
    user,
    users,
  };
};
