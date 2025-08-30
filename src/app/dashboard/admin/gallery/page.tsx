"use client"

import { EditDialog } from '@/components/template/EditDialog';
import { RHFInput } from '@/components/template/RHFInput';
import { Button } from '@/components/ui/button';
import { imageLoader } from '@/components/ui/imageLoader';
import Loading from '@/components/ui/loading';
import { Separator } from '@/components/ui/separator';
import { useCrud } from '@/hooks/use-crud';
import { Gallery } from '@/lib/types';
import { Pen, Plus, Trash2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react'
import { toast } from 'sonner';

export type GalleryRecord = Partial<Record<string, unknown>> & Gallery;

const AdminGalleryPage = () => {
    const { items: galleries, loading: galleriesLoading, update: updateGallery, remove: removeBlog } = useCrud<Gallery>("galleries");

    const [openEdit, setOpenEdit] = useState(false);
    const [editingGallery, setEditingGallery] = useState<Gallery | null>(null);
    const [newThumbnail, setNewThumbnail] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string>("");


    const hadleEdit = (data: Gallery) => {
        setEditingGallery(data);
        setThumbnailPreview(data.image_url || "");
        setNewThumbnail(null);
        setOpenEdit(true);
    };

    const handleEditSave = async () => {
        if (!editingGallery) return;

        try {
            let thumbnailUrl = editingGallery.image_url;

            // 🚀 kalau ada file baru → upload dulu
            if (newThumbnail) {
                const formData = new FormData();
                formData.append("file", newThumbnail);

                const res = await fetch("/api/upload", {
                    method: "POST",
                    body: formData,
                });

                if (!res.ok) throw new Error("Upload gagal");
                const uploadRes = await res.json();

                thumbnailUrl = uploadRes.secure_url;
            }

            const response = await updateGallery(editingGallery.id, {
                ...editingGallery,
                image_url: thumbnailUrl,
            });

            if (response) {
                toast.success("Gallery berhasil diubah");
                setEditingGallery(null);
                setOpenEdit(false);
            } else {
                toast.error("Gagal mengubah Gallery");
            }
        } catch (error) {
            console.error("handleEditSave error:", error);
            toast.error("Gagal mengubah Gallery");
        }
    };

    const handleDelete = async (id: Gallery["id"]) => {
        const confirmed = confirm("Apakah yakin ingin menghapus Gallery ini?");
        if (!confirmed) return;
        await removeBlog(id);
        toast.success("Blog berhasil dihapus");
    };


    if (galleriesLoading) {
        return <Loading />
    }
    return (
        <div className='w-full flex flex-col space-y-4'>
            <div className="flex justify-between items-center w-full">
                <h1 className="text-3xl font-bold">Galeri {process.env.NEXT_PUBLIC_APP_NAME}</h1>
                <Button asChild>
                    <Link href="/dashboard/admin/gallery/new"><Plus />Tambah Galeri</Link>
                </Button>
            </div>
            <Separator />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {galleries?.map((gallery) => (
                    <div key={gallery.id} className="border rounded-lg overflow-hidden shadow-md">
                        <Image loader={imageLoader} priority src={gallery.image_url} alt={gallery.title} width={500} height={500} className="w-full aspect-video object-cover" />
                        <div className="p-4">
                            <h3 className="text-lg font-semibold">{gallery.title}</h3>
                            <p className="text-gray-600">{gallery.description}</p>
                        </div>
                        <Separator />
                        <div className="flex justify-end p-2">
                            <Button className="mr-2" variant="outline" onClick={() => hadleEdit(gallery)}><Pen />Edit</Button>
                            <Button className="mr-2" variant="destructive" onClick={() => handleDelete(gallery.id)}><Trash2 />Hapus</Button>
                        </div>
                    </div>
                ))}
            </div>

            <EditDialog<GalleryRecord>
                open={openEdit}
                title="Edit Galeri"
                onSave={handleEditSave}
                onClose={() => {
                    setOpenEdit(false);
                    setEditingGallery(null);
                    setThumbnailPreview("");
                }}
                defaultValues={{
                    title: editingGallery?.title || "",
                    description: editingGallery?.description || "",
                    image_url: editingGallery?.image_url || "",

                }}
            >
                {/* Upload Thumbnail */}
                <div className="space-y-2 max-w-[300px]">
                    <label className="block font-medium text-gray-700">Image</label>

                    <div
                        className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-6 cursor-pointer transition
                                        ${newThumbnail ? "border-blue-400 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-blue-50"}`}
                        onClick={() => document.getElementById("editThumbnailInput")?.click()}
                    >
                        <input
                            id="editThumbnailInput"
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    setNewThumbnail(file);
                                    setThumbnailPreview(URL.createObjectURL(file));
                                }
                            }}
                        />

                        {!thumbnailPreview ? (
                            <div className="flex flex-col items-center space-y-2 text-gray-500">
                                <svg
                                    className="w-12 h-12 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6.1a5 5 0 01-.88 9.9H7z"
                                    />
                                </svg>
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
                                        setNewThumbnail(null);
                                        setThumbnailPreview(editingGallery?.image_url || "");
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <RHFInput name="title" label="Judul" />
                <RHFInput name="description" label="Deskripsi" />
            </EditDialog>
        </div>
    )
}

export default AdminGalleryPage