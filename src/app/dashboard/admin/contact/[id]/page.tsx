"use client"

import Loading from "@/components/ui/loading";
import { Separator } from "@/components/ui/separator";
import { useCrud } from "@/hooks/use-crud";
import { Contact } from "@/lib/types";
import { useParams } from "next/navigation";

const AdminContactDetailPage = () => {
    const { id } = useParams();

    const { items: contacts, loading } = useCrud<Contact>("contacts");
    const contact = contacts.find((contact) => contact.id === id);

    if (loading) return <Loading />;
    return (
        <div>
            <h1 className="text-2xl font-bold">Pesan Dari {contact?.nama}</h1>
            <p className="text-gray-600">{contact?.email}</p>

            <Separator className="my-4" />

            <div className="rounded-lg border shadow-md p-4 bg-muted">
                <div className="flex items-center gap-2 rounded-lg bg-background p-2 w-fit">
                    <span>{contact?.subject}</span>
                    ~
                    <span className="text-gray-600 text-sm">{new Date(contact?.created_at || "").toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="mt-4 rounded-lg bg-background p-2">{contact?.message}</div>
            </div>
        </div>
    )
}

export default AdminContactDetailPage