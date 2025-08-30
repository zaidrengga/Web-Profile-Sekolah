"use client"

import { DataTable } from '@/components/template/DataTable';
import Loading from '@/components/ui/loading';
import { Separator } from '@/components/ui/separator';
import { useCrud } from '@/hooks/use-crud';
import { Contact } from '@/lib/types';
import React from 'react'

const AdminContactPage = () => {
    const { items: contacts, loading: contactLoading, remove: removeContact } = useCrud<Contact>("contacts");

    if (contactLoading) return <Loading />;
    return (
        <div className='space-y-4'>
            <h1 className='text-2xl font-bold'>Kontak</h1>
            <Separator />
            <DataTable
                data={contacts}
                columns={[
                    { header: "Nama", accessorKey: "nama", },
                    { header: "Email", accessorKey: "email", },
                    { header: "Pesan", accessorKey: "message", },
                    {
                        header: "Tanggal", accessorKey: "created_at", cell: (row) => {
                            const createdAt = row.getValue();
                            if (typeof createdAt === "string" || typeof createdAt === "number") {
                                return new Date(createdAt).toLocaleDateString();
                            } else {
                                // Handle the case where the value is not a string or number
                                return "Invalid date";
                            }
                        },
                    },
                ]}
                onDelete={(id) => removeContact(id as string)}
                onDetails={(id) => `/dashboard/admin/contact/${id}`}
                searchKeys={["nama", "email", "message"]}
                filterKey={{ label: "Tanggal", value: "created_at" }}
            />
        </div>
    )
}

export default AdminContactPage