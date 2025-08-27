"use client"

import { imageLoader } from '@/components/ui/imageLoader';
import Loading from '@/components/ui/loading';
import { useCrud } from '@/hooks/use-crud';
import { Guru, User } from '@/lib/types';;
import Image from 'next/image';
import React from 'react'

const Teachers = () => {
    const { items: gurus, loading: gurusLoading } = useCrud<Guru>("gurus");
    const { items: users, loading: usersLoading } = useCrud<User>("users");

    const guruJabatan = gurus.filter((guru) => guru.jabatan !== null);

    if (gurusLoading || usersLoading) return <Loading />
    return (
        <div className="section section-hidden">
            <div className="py-20 bg-gradient-to-br from-gray-50 to-indigo-50">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">Jajaran Guru</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">Pendidik yang bersemangat tentang keberhasilan siswa</p>
                    </div>
                    <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-8">
                        {guruJabatan.map((guru) => (
                            <div key={guru.id} className="bg-white shadow-md rounded-lg overflow-hidden">
                                <Image loader={imageLoader} src={users.find((user) => user.id === guru.user_id)?.image || ""} alt="Avatar" priority width={200} height={200} className="aspect-square w-full object-cover" />
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-800">{guru.nama}</h3>
                                    <p className="text-gray-600">{guru.jabatan}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Teachers