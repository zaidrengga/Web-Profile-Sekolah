"use client"

import { DataTable } from '@/components/template/DataTable';
import { EditDialog } from '@/components/template/EditDialog';
import { RHFInput } from '@/components/template/RHFInput';
import { RHFSelect } from '@/components/template/RHFSelect';
import { Button } from '@/components/ui/button';
import Loading from '@/components/ui/loading';
import { useCrud } from '@/hooks/use-crud';
import { User } from '@/lib/types';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';
import { toast } from 'sonner';

export type UserRecord = Partial<Record<string, unknown>> & User;

const AdminUsersPage = () => {
    const { items: users, loading, remove: removeUser, update: editUser } = useCrud<User>("users");

    const [editOpen, setEditOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    const handleDelete = async (id: User["id"]) => {
        const confirmed = confirm("Apakah yakin ingin menghapus user ini?");
        if (!confirmed) return;
        await removeUser(id);
        toast.success("User berhasil dihapus");
    };

    const handleEdit = (user: User) => {
        setEditingUser(user);
        setEditOpen(true);
    };

    const handleEditSave = async (data: UserRecord) => {
        if (!editingUser) return;
        try {
            const response = await editUser(editingUser.id, {
                username: data.username,
                email: data.email,
                password: data.password,
                role: data.role,
            });
            if (response) {
                window.location.reload();
                setEditingUser(null);
                toast.success("User berhasil diubah");
                setEditOpen(false);
            } else {
                toast.error("Gagal mengubah user");
            }
        } catch (error) {
            console.error("handleEditSave error:", error);
            toast.error("Gagal mengubah user");
        }
    };

    if (loading) return <Loading />
    return (
        <div className="w-full p-4 space-y-4 ">
            <div className="w-full flex justify-between">
                <h1 className='text-2xl font-bold'>Kelola User</h1>
                <div className="flex items-center space-x-2">
                    <Button asChild>
                        <Link href="/dashboard/admin/users/new">
                            <Plus />
                            <span>Tambah User</span>
                        </Link>
                    </Button>
                </div>
            </div>

            <div>
                <DataTable
                    data={users}
                    columns={[
                        { accessorKey: "username", header: "Username" },
                        { accessorKey: "email", header: "Email" },
                        { accessorKey: "role", header: "Role" },
                    ]}
                    onEdit={handleEdit}
                    onDelete={(id) => handleDelete(id.toString())}
                    searchKeys={["username", "email"]}
                    filterKey={{ label: "Role", value: "role" }}
                    filterOptions={[
                        { label: "Admin", value: "admin" },
                        { label: "Guru", value: "guru" },
                        { label: "Siswa", value: "siswa" },
                    ]}
                    columnHeaderMap={{
                        username: "Username",
                        email: "Email",
                        password: "Password",
                        role: "Role",
                    }}
                />
            </div>

            <EditDialog<UserRecord>
                open={editOpen}
                onClose={() => {
                    setEditOpen(false);
                    setEditingUser(null);
                }}
                onSave={handleEditSave}
                title="Edit User"
                defaultValues={{
                    username: editingUser?.username,
                    email: editingUser?.email,
                    password: editingUser?.password,
                    role: editingUser?.role
                }}
            >
                <RHFInput name="username" label="Username" placeholder="Masukkan username" />
                <RHFInput name="email" type="email" label="Email" placeholder="Masukkan email" />
                <RHFInput name="password" type="password" label="Password" placeholder="Masukkan password" />
                <RHFSelect
                    name="role"
                    label="Role"
                    options={[
                        { label: "Admin", value: "admin" },
                        { label: "Guru", value: "guru" },
                        { label: "Siswa", value: "siswa" },
                    ]}
                />
            </EditDialog>
        </div>
    )
}

export default AdminUsersPage