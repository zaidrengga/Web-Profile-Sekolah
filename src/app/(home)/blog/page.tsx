"use client"

import { imageLoader } from '@/components/ui/imageLoader';
import Loading from '@/components/ui/loading';
import { useCrud } from '@/hooks/use-crud';
import { Blog } from '@/lib/types';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

const BlogPage = () => {
    const { items: blogs, loading } = useCrud<Blog>("blogs");

    if (loading) {
        return <Loading />
    }
    if (!blogs) {
        return <div className="text-center text-gray-600">Blog tidak ditemukan</div>
    }
    return (
        <div className='w-full p-10 py-20 flex flex-col items-center space-y-4'>
            <div className="space-y-2 text-center">
                <h1 className="text-3xl font-bold">Blog {process.env.NEXT_PUBLIC_APP_NAME}</h1>
                <p className="text-gray-600">Blog tentang kegiatan sekolah kami</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {blogs?.map((blog) => (
                    <div key={blog.id} className="border rounded-lg overflow-hidden shadow-md">
                        <Image loader={imageLoader} priority src={blog.thumbnail || ""} alt={blog.title} width={200} height={200} className="w-full aspect-video object-cover" />
                        <div className="p-4">
                            <h3 className="text-lg font-semibold">{blog.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                                oleh {blog.author} • {new Date(blog.created_at).toLocaleDateString()}
                            </p>
                            <p>
                                <span className="line-clamp-2">{blog.content}</span>
                                <Link className="text-blue-600 hover:underline" href={`/blog/${blog.slug}`}> Selengkapnya...</Link>
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default BlogPage