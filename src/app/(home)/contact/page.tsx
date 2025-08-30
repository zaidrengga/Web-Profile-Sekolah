"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Mail, MapPin, Phone } from "lucide-react";

export default function ContactForm() {
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({ nama: "", email: "", subject: "", message: "" });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Gagal mengirim pesan");
            }

            toast.success("Pesan berhasil dikirim!");
            setForm({ nama: "", email: "", subject: "", message: "" });
        } catch (err) {
            console.error("handleSubmit error:", err);
            toast.error("Gagal mengirim pesan");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="flex flex-col justify-center p-10">
                <h1 className="text-3xl font-bold mb-4 text-primary">Hubungi Kami</h1>
                <p className="text-gray-600 text-lg">Anda dapat menghubungi kami melalui email atau nomor telepon kami di sini atau melalui formulir di halaman ini atau langsung berkunjung ke alamat kami.</p>
                <ul className="space-y-2 mt-4">
                    <li className="flex items-center">
                        <Mail className="w-5 text-gray-600 h-5 mr-2" />
                        <span>gDk3o@example.com</span>
                    </li>
                    <li className="flex items-center">
                        <Phone className="w-5 text-gray-600 h-5 mr-2" />
                        <span>08123456789</span>
                    </li>
                    <li className="flex items-center">
                        <MapPin className="w-5 text-gray-600 h-5 mr-2" />
                        <span>Jl. Contoh, Kota Contoh</span>
                    </li>
                </ul>
            </div>

            <div className="flex flex-col items-center justify-center py-20">
                <h1 className="text-3xl font-bold mb-4">Formulir Kontak</h1>
                <div className="w-full max-w-md">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <Input name="nama" placeholder="Nama" value={form.nama} onChange={handleChange} required />
                        <Input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} required />
                        <Input name="subject" placeholder="Subject" value={form.subject} onChange={handleChange} />
                        <Textarea name="message" placeholder="Message" value={form.message} onChange={handleChange} required />
                        <Button type="submit" disabled={loading} className="w-full">
                            {loading ? "Mengirim..." : "Kirim Pesan"}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}