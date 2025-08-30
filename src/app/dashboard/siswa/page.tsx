"use client";

import { imageLoader } from '@/components/ui/imageLoader';
import Loading from '@/components/ui/loading';
import { useSiswa } from '@/hooks/use-siswa';
import Image from 'next/image';
import React from 'react'

const SiswaDashboardPage = () => {
  const { user, siswa, kelas, jadwals, loading, mapels } = useSiswa();

  const jadwalHariIni = jadwals.filter((jadwal) => jadwal.hari === new Date().toLocaleDateString('id-ID', { weekday: 'long' }));

  if (loading) return <Loading />
  return (
    <div className='min-h-screen'>
      <div className=" grid grid-cols-6 gap-6">
        <div className="sm:col-span-4 col-span-6 border rounded-xl p-6 shadow-md">
          <h2 className='text-xl font-bold text-gray-600'>Hello, {siswa?.nama}</h2>
          <h1 className='text-2xl font-bold mb-2'>Selamat Datang di <span className='text-blue-600'>Dashboard Siswa</span></h1>
          <p>Anda dapat mengakses informasi dan fitur khusus untuk siswa di sini.</p>
        </div>
        <div className="sm:col-span-2 col-span-6 p-6 rounded-xl border shadow-md flex sm:flex-col flex-row items-center justify-center space-x-4">
          <Image loader={imageLoader} src={user?.image || ""} alt="Avatar" width={100} height={100} className="rounded-full mb-4" />
          <div className="flex flex-col text-left sm:text-center">
            <p className='text-lg font-semibold'><span>{siswa?.nama}</span></p>
            <p><span>{siswa?.nisn}</span></p>
            <p><span>{kelas?.nama_kelas}</span></p>
          </div>
        </div>

        <div className="col-span-6 rounded-lg border p-4 shadow-md">
          <h1 className='text-xl font-bold'>Jadwal Hari Ini</h1>
          <p>{new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <div className="w-full grid grid-cols-3 gap-4">
            {jadwalHariIni.length > 0 ? jadwalHariIni.map((jadwal) => (
              <div key={jadwal.id} className="mb-2 rounded-lg p-2 bg-gray-200">
                <p className="text-lg">{jadwal.hari}</p>
                <p className="text-gray-600">{mapels.find((mapel) => mapel.id === jadwal.mapel_id)?.nama_mapel} | {jadwal.jam}</p>
              </div>
            )) : <p className='text-gray-600'>Tidak ada jadwal hari ini.</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SiswaDashboardPage