"use client"

import { imageLoader } from '@/components/ui/imageLoader';
import Loading from '@/components/ui/loading';
import { useCrud } from '@/hooks/use-crud';
import { Guru, User } from '@/lib/types';
import Image from 'next/image';
import React from 'react'

const Teachers = () => {
    const { items: gurus, loading: gurusLoading } = useCrud<Guru>("gurus");
    const { items: users, loading: usersLoading } = useCrud<User>("users");

    if (gurusLoading || usersLoading) return <Loading />

    const kepalaSekolah = gurus.filter(guru => guru.jabatan === "Kepala Sekolah");
    const wakilKepalaSekolah = gurus.filter(guru => guru.jabatan === "Wakil Kepala Sekolah");
    const guruLain = gurus.filter(guru => !["Kepala Sekolah", "Wakil Kepala Sekolah"].includes(guru.jabatan || ""));

    const renderGuruCard = (guru: Guru) => {
        const user = users.find(u => u.id === guru.user_id);
        return (
            <div key={guru.id} className="bg-background hover:bg-gray-100 hover:-translate-y-1 hover:scale-105 hover:shadow-xl transition-all duration-300 shadow-md rounded-lg overflow-hidden w-full max-w-xs mx-auto">
                <Image
                    loader={imageLoader}
                    src={user?.image || ""}
                    alt="Avatar"
                    priority
                    width={200}
                    height={200}
                    className="aspect-square w-full object-cover"
                />
                <div className="p-4 text-center">
                    <h3 className="text-lg font-semibold text-gray-800">{guru.nama}</h3>
                    <p className="text-gray-600">{guru.jabatan}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="section section-hidden">
            <div className="py-20 bg-gradient-to-br from-gray-50 to-indigo-50">
                <div className="px-4 sm:px-6 lg:px-8 flex flex-col items-center">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-6">Jajaran Guru</h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">Pendidik yang bersemangat tentang keberhasilan siswa</p>
                    </div>

                    <div className="flex sm:flex-row flex-col items-center gap-4">
                        {/* Kepala Sekolah */}
                        {kepalaSekolah.length > 0 && (
                            <div className="mb-12 w-full flex flex-col items-center">
                                <h3 className="text-2xl font-bold mb-6 text-center">Kepala Sekolah</h3>
                                <div className="flex flex-wrap justify-center gap-8">
                                    {kepalaSekolah.map(renderGuruCard)}
                                </div>
                            </div>
                        )}

                        {/* Wakil Kepala Sekolah */}
                        {wakilKepalaSekolah.length > 0 && (
                            <div className="mb-12 w-full flex flex-col items-center">
                                <h3 className="text-2xl font-bold mb-6 text-center">Wakil Kepala Sekolah</h3>
                                <div className="flex flex-wrap justify-center gap-8">
                                    {wakilKepalaSekolah.map(renderGuruCard)}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Guru Lain */}
                    {guruLain.length > 0 && (
                        <div className="w-full">
                            <h3 className="text-2xl font-bold mb-6 text-center">Guru Lainnya</h3>
                            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                                {guruLain.map(renderGuruCard)}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Teachers;