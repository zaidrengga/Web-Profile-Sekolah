"use client"

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { imageLoader } from '@/components/ui/imageLoader';
import Loading from '@/components/ui/loading';
import { useGuru } from '@/hooks/use-guru';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

const TeachersDashboardPage = () => {
  const { user, guru, loading, kelas, mapels, jadwalHariIni, mapelGuru, waliKelas } = useGuru();

  if (loading) return <Loading />
  return (
    <div className="w-full grid grid-cols-6 gap-4">
      <div className="col-span-6 sm:col-span-4 rounded-lg border p-6 shadow-md">
        <h1 className="text-xl font-bold">Hello, {guru?.nama}</h1>
        <p className="text-gray-600 text-2xl font-bold">Selamat datang di <span className="text-blue-600">Dashboard Guru</span>.</p>
        <p>Anda dapat mengakses informasi dan fitur khusus untuk guru di sini.</p>
        {mapelGuru.length > 0 &&
          <div className="flex flex-col gap-2 mt-4">
            <h2 className="font-semibold">Mapel yang diampu:</h2>
            <div className="flex items-center flex-wrap">
              {mapelGuru.map((mapel) => (
                <Badge key={mapel?.id} className="mr-2 mb-2 text-lg">{mapel?.nama_mapel} | {mapel?.kode_mapel}</Badge>
              ))}
            </div>
          </div>
        }
      </div>

      <div className="col-span-6 sm:col-span-2 p-6 rounded-xl border shadow-md flex flex-col items-center">
        <Image loader={imageLoader} src={user?.image || ""} alt="Avatar" width={100} height={100} className="rounded-full mb-4" />
        <h2 className="text-lg font-semibold text-center">{guru?.nama}</h2>
        <p className="text-gray-600">{guru?.nip}</p>
        {waliKelas && <p className='text-gray-600'>Wali Kelas {waliKelas.nama_kelas}</p>}
        {guru?.jabatan && <p className='text-gray-600'>{guru?.jabatan}</p>}
      </div>

      {jadwalHariIni && jadwalHariIni.length > 0 &&
        <div className="col-span-6 rounded-lg border p-6 shadow-md">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-semibold">Jadwal Mengajar <br /><span className="text-foreground text-xl font-normal">Hari Ini  {jadwalHariIni[0].hari}</span></h2>
            <Button asChild><Link href="/dashboard/guru/jadwal">Lihat Semua <ArrowRight /></Link></Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {jadwalHariIni.map((jadwal) => (
              <div key={jadwal.id} className="rounded-lg border p-4 shadow-md">
                <h3 className="text-lg font-semibold">{mapels?.find((mapel) => mapel?.id === jadwal.mapel_id)?.nama_mapel}</h3>
                <p className="text-gray-600">{kelas?.find((kelas) => kelas?.id === jadwal.kelas_id)?.nama_kelas}</p>
                <p className="text-gray-600">{jadwal.jam}</p>
                <Button className="mt-4 w-full" asChild><Link href={`/dashboard/guru/absensi/${jadwal.id}`}>Absensi <ArrowRight /></Link></Button>
              </div>
            ))}
          </div>
        </div>
      }
    </div>
  )
}

export default TeachersDashboardPage