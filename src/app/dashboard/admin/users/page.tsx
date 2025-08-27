"use client"

import { Button } from '@/components/ui/button';
import Loading from '@/components/ui/loading';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCrud } from '@/hooks/use-crud';
import { User } from '@/lib/types';
import { Pen, Plus, Trash } from 'lucide-react';
import Link from 'next/link';
import React, { useState } from 'react';

const AdminUsersPage = () => {
    const [filter, setFilter] = useState<string>("all");
    const [usersFilter, setUsersFilter] = useState<User[]>([]);
    const { items: users, loading, remove: removeUser, update: editUser } = useCrud<User>("users");

    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [editUsername, setEditUsername] = useState("");
    const [editRole, setEditRole] = useState<User['role']>('siswa');

    React.useEffect(() => {
        if (filter === "all") setUsersFilter(users);
        if (filter === "admin") setUsersFilter(users.filter((user) => user.role === "admin"));
        if (filter === "guru") setUsersFilter(users.filter((user) => user.role === "guru"));
        if (filter === "siswa") setUsersFilter(users.filter((user) => user.role === "siswa"));
    }, [filter, users]);

    const handleDelete = async (id: User["id"]) => {
        const confirmed = confirm("Apakah yakin ingin menghapus user ini?");
        if (!confirmed) return;

        await removeUser(id);
    };

    const handleEditSave = async () => {
        if (!editingUser) return;
        await editUser(editingUser.id!, { username: editUsername, role: editRole });
        setEditingUser(null);
    };

    if (loading) return <Loading />

    return (
        <div className="w-full p-4 space-y-4 ">
            <div className="w-full flex justify-between">
                <h1 className='text-2xl font-bold'>Kelola User</h1>
                <p>Total User : {users.length}</p>
            </div>

            <div className="w-full flex justify-between">
                <div className="flex items-center gap-2">
                    <Button variant={filter === "all" ? "default" : "outline"} onClick={() => setFilter("all")}>All</Button>
                    <Button variant={filter === "admin" ? "default" : "outline"} onClick={() => setFilter("admin")}>Admin</Button>
                    <Button variant={filter === "guru" ? "default" : "outline"} onClick={() => setFilter("guru")}>Guru</Button>
                    <Button variant={filter === "siswa" ? "default" : "outline"} onClick={() => setFilter("siswa")}>Siswa</Button>
                </div>

                <Button asChild >
                    <Link href="/dashboard/admin/users/new">Tambah User <Plus /></Link>
                </Button>
            </div>

            <div className='border rounded-lg overflow-hidden overflow-x-auto shadow-md'>
                <Table>
                    <TableHeader>
                        <TableRow className='bg-gray-200'>
                            <TableHead className="w-[100px]">No</TableHead>
                            <TableHead>Username</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead className='text-right'>Action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {usersFilter.map((user, index) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">{index + 1}</TableCell>
                                <TableCell className="font-medium">{user.username}</TableCell>
                                <TableCell className="font-medium">{user.email}</TableCell>
                                <TableCell className="font-medium">{user.role}</TableCell>
                                <TableCell className="font-medium text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={() => {
                                                setEditingUser(user);
                                                setEditUsername(user.username);
                                                setEditRole(user.role);
                                            }}
                                        >
                                            <Pen />
                                        </Button>
                                        <Button
                                            variant="destructive"
                                            size="icon"
                                            onClick={() => handleDelete(user.id!)}
                                        >
                                            <Trash />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* Modal Edit sederhana */}
            {editingUser && (
                <div className="fixed inset-0 bg-foreground/20 bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-background p-6 rounded-lg w-96 shadow-lg space-y-4">
                        <h2 className="text-lg font-bold">Edit User</h2>
                        <input
                            type="text"
                            value={editUsername}
                            onChange={(e) => setEditUsername(e.target.value)}
                            className="w-full p-2 border rounded"
                            placeholder="Username"
                        />
                        <select
                            value={editRole}
                            onChange={(e) => setEditRole(e.target.value as User['role'])}
                            className="w-full p-2 border rounded"
                        >
                            <option value="admin">Admin</option>
                            <option value="guru">Guru</option>
                            <option value="siswa">Siswa</option>
                        </select>
                        <div className="flex justify-end gap-2">
                            <Button onClick={() => setEditingUser(null)} variant="outline">Cancel</Button>
                            <Button onClick={handleEditSave}>Save</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdminUsersPage