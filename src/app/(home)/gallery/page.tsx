"use client"

import { imageLoader } from '@/components/ui/imageLoader';
import Loading from '@/components/ui/loading';
import { useCrud } from '@/hooks/use-crud';
import { Gallery } from '@/lib/types';
import Image from 'next/image';
import React from 'react'

const GalleryPage = () => {
    const { items: galleries, loading: galleriesLoading } = useCrud<Gallery>("galleries");

    if (galleriesLoading) {
        return <Loading />
    }
    if (!galleries) {
        return <div className="text-center text-gray-600">Galeri tidak ditemukan</div>
    }
    return (
        <div className='w-full p-10 py-20 flex flex-col items-center space-y-4'>
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">Galeri <span className="text-primary">{process.env.NEXT_PUBLIC_APP_NAME}</span></h1>
                <p className="text-gray-600">Galeri foto dan video dari kegiatan sekolah kami</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {galleries?.map((gallery) => (
                    <div key={gallery.id} className="border rounded-lg overflow-hidden shadow-md">
                        <Image loader={imageLoader} priority src={gallery.image_url} alt={gallery.title} width={200} height={200} className="w-full aspect-video object-cover" />
                        <div className="p-4">
                            <h3 className="text-lg font-semibold">{gallery.title}</h3>
                            <p className="text-gray-600">{gallery.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default GalleryPage