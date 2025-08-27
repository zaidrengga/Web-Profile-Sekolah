"use client";

import { imageLoader } from "@/components/ui/imageLoader";
import Loading from "@/components/ui/loading";
import { useCrud } from "@/hooks/use-crud";
import { Blog } from "@/lib/types";
import Image from "next/image";
import { useParams } from "next/navigation";

export default function BlogDetailPage() {
    const { slug } = useParams()
    const { items: blogs, loading } = useCrud<Blog>("blogs");

    const blog = blogs?.find((blog) => blog.slug === slug);

    if (loading) {
        return <Loading />
    }

    return (
        <article className="container mx-auto px-4 py-10 max-w-3xl">
            {blog?.thumbnail && (
                <div className="relative w-full aspect-video mb-6">
                    <Image
                        loader={imageLoader}
                        src={blog.thumbnail}
                        priority
                        alt={blog.title}
                        fill
                        className="object-cover rounded-xl"
                    />
                </div>
            )}
            <h1 className="text-4xl font-bold mb-2">{blog?.title}</h1>
            <p className="text-muted-foreground mb-6">
                Oleh {blog?.author} • {new Date(blog?.created_at || new Date()).toLocaleDateString()}
            </p>
            <div className="prose max-w-none">{blog?.content}</div>
        </article>
    );
}
