"use client";

import { EditDialog } from "@/components/template/EditDialog";
import { RHFInput } from "@/components/template/RHFInput";
import { RHFTextarea } from "@/components/template/RHFTextarea";
import { Button } from "@/components/ui/button";
import { imageLoader } from "@/components/ui/imageLoader";
import Loading from "@/components/ui/loading";
import { Separator } from "@/components/ui/separator";
import { useCrud } from "@/hooks/use-crud";
import { Blog } from "@/lib/types";
import { Pen, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

export type BlogRecord = Partial<Record<string, unknown>> & Blog;

const AdminBlogPage = () => {
    const { items: blogs, update: updateBlog, remove: removeBlog, loading } =
        useCrud<Blog>("blogs");

    const [openEdit, setOpenEdit] = useState(false);
    const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
    const [newThumbnail, setNewThumbnail] = useState<File | null>(null);
    const [thumbnailPreview, setThumbnailPreview] = useState<string>("");

    const hadleEdit = (blog: Blog) => {
        setEditingBlog(blog);
        setThumbnailPreview(blog.thumbnail || "");
        setNewThumbnail(null);
        setOpenEdit(true);
    };

    const handleEditSave = async () => {
        if (!editingBlog) return;

        try {
            let thumbnailUrl = editingBlog.thumbnail;

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

            const response = await updateBlog(editingBlog.id, {
                ...editingBlog,
                thumbnail: thumbnailUrl,
            });

            if (response) {
                toast.success("Blog berhasil diubah");
                setEditingBlog(null);
                setOpenEdit(false);
            } else {
                toast.error("Gagal mengubah blog");
            }
        } catch (error) {
            console.error("handleEditSave error:", error);
            toast.error("Gagal mengubah blog");
        }
    };

    const handleDelete = async (id: Blog["id"]) => {
        const confirmed = confirm("Apakah yakin ingin menghapus blog ini?");
        if (!confirmed) return;
        await removeBlog(id);
        toast.success("Blog berhasil dihapus");
    };

    if (loading) return <Loading />;
    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Blog</h1>
                <Button asChild>
                    <Link href="/dashboard/admin/blog/new">
                        Tambah Blog <Plus />
                    </Link>
                </Button>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {blogs?.map((blog) => (
                    <div
                        key={blog.id}
                        className="border rounded-lg overflow-hidden shadow-md"
                    >
                        <Image
                            loader={imageLoader}
                            priority
                            src={blog.thumbnail || ""}
                            alt={blog.title}
                            width={200}
                            height={200}
                            className="w-full aspect-video object-cover"
                        />
                        <div className="p-4">
                            <h3 className="text-lg font-semibold">{blog.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2">
                                oleh {blog.author} •{" "}
                                {new Date(blog.created_at).toLocaleDateString()}
                            </p>
                            <p>
                                <span className="line-clamp-2">{blog.content}</span>
                                <Link
                                    className="text-blue-600 hover:underline"
                                    href={`/blog/${blog.slug}`}
                                >
                                    {" "}
                                    Selengkapnya...
                                </Link>
                            </p>
                            <div className="flex justify-end mt-2 items-center gap-2">
                                <Button variant="outline" onClick={() => hadleEdit(blog)}>
                                    <Pen /> Edit
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => handleDelete(blog.id)}
                                >
                                    <Trash2 /> Hapus
                                </Button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <EditDialog<BlogRecord>
                open={openEdit}
                onClose={() => setOpenEdit(false)}
                title="Edit Blog"
                onSave={handleEditSave}
                defaultValues={{
                    thumbnail: editingBlog?.thumbnail,
                    title: editingBlog?.title,
                    author: editingBlog?.author,
                    content: editingBlog?.content,
                }}
            >
                {/* Upload Thumbnail */}
                <div className="space-y-2 max-w-[300px]">
                    <label className="block font-medium text-gray-700">Thumbnail</label>

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
                                        setThumbnailPreview(editingBlog?.thumbnail || "");
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                <RHFInput name="title" label="Judul" placeholder="Judul blog" />
                <RHFInput name="author" label="Penulis" placeholder="Penulis blog" />
                <RHFTextarea name="content" label="Content" placeholder="Content blog" />
            </EditDialog>
        </div>
    );
};

export default AdminBlogPage;