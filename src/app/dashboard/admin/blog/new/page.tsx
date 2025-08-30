"use client";

import Loading from "@/components/ui/loading";
import { useCrud } from "@/hooks/use-crud";
import { Blog } from "@/lib/types";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { BlogRecord } from "../page";
import { FormCard } from "@/components/template/FormCard";
import { RHFInput } from "@/components/template/RHFInput";
import { RHFTextarea } from "@/components/template/RHFTextarea";
import Image from "next/image";
import { imageLoader } from "@/components/ui/imageLoader";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { UploadCloud } from "lucide-react";

const AdminBlogNewPage = () => {
    const { add: addBlog, loading: blogLoading } = useCrud<Blog>("blogs");
    const router = useRouter();

    const [uploading, setUploading] = useState(false);
    const [thumbnailFile, setThumbnailFile] = useState<File | null>(null); // simpan file dulu
    const [thumbnailPreview, setThumbnailPreview] = useState<string>(""); // preview lokal

    const methods = useForm<BlogRecord>();

    // simpan file ke state, generate preview saja
    const handleSelectImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setThumbnailFile(file);
        setThumbnailPreview(URL.createObjectURL(file));
    };

    const handleAddBlog = async (data: Blog) => {
        if (!data) return;

        try {
            setUploading(true);

            let thumbnailUrl = data.thumbnail;

            // 🚀 upload file saat submit, bukan saat pilih
            if (thumbnailFile) {
                const formData = new FormData();
                formData.append("file", thumbnailFile);

                const res = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!res.ok) throw new Error("Upload gagal");

                const uploadRes = await res.json();
                thumbnailUrl = uploadRes.secure_url;
            }

            const response = await addBlog({
                id: crypto.randomUUID(),
                title: data.title,
                slug: data.title?.toLowerCase().replace(/\s+/g, "-"),
                thumbnail: thumbnailUrl,
                author: data.author,
                content: data.content,
                created_at: new Date(),
                updated_at: new Date(),
            });

            if (response) {
                toast.success("Blog berhasil ditambahkan");
                router.push("/dashboard/admin/blog");
            } else {
                toast.error("Gagal menambahkan blog");
            }
        } catch (error) {
            console.error("handleAddBlog error:", error);
            toast.error("Gagal menambahkan blog");
        } finally {
            setUploading(false);
        }
    };

    if (blogLoading) return <Loading />;

    return (
        <FormCard<BlogRecord>
            title="Tambah Blog"
            onSave={handleAddBlog}
            methods={methods}
            loading={blogLoading || uploading}
        >
            <div className="space-y-2">
                <label className="block font-medium text-gray-700">Thumbnail</label>

                <div
                    className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer transition
            ${uploading ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"}`}
                    onClick={() => document.getElementById("thumbnailInput")?.click()}
                >
                    <input
                        id="thumbnailInput"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleSelectImage}
                    />

                    {!thumbnailPreview ? (
                        <div className="flex flex-col items-center space-y-2 text-gray-500">
                            <UploadCloud className="w-10 h-10" />
                            <p className="text-sm">
                                <span className="font-medium text-blue-600">Upload thumbnail</span> atau drag & drop
                            </p>
                            <p className="text-xs text-gray-400">PNG, JPG, JPEG (max 5MB)</p>
                        </div>
                    ) : (
                        <div className="relative w-full max-w-sm">
                            <Image
                                loader={imageLoader}
                                src={thumbnailPreview}
                                alt="Thumbnail preview"
                                width={400}
                                height={200}
                                className="object-cover rounded-lg border shadow-sm"
                            />
                            <button
                                type="button"
                                className="absolute top-2 right-2 bg-white border rounded-full p-1 shadow hover:bg-gray-100"
                                onClick={() => {
                                    setThumbnailFile(null);
                                    setThumbnailPreview("");
                                }}
                            >
                                ✕
                            </button>
                        </div>
                    )}
                </div>
            </div>
            <RHFInput name="title" label="Judul" />
            <RHFInput name="author" label="Penulis" />
            <RHFTextarea name="content" label="Konten" />
        </FormCard>
    );
};

export default AdminBlogNewPage;