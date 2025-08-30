"use client";

import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { Label } from "../ui/label";
import { Eye, EyeClosed } from "lucide-react";

interface RHFInputProps {
    name: string;
    label?: string;
    type?: string;
    placeholder?: string;
}

export function RHFInput({ name, label, type = "text", placeholder }: RHFInputProps) {
    const [openPassword, setOpenPassword] = useState(false);
    const { register } = useFormContext();

    return (
        <div className="space-y-1 relative">
            {label && <Label className="font-normal">{label}</Label>}
            <Input required {...register(name)} type={openPassword ? "text" : type} placeholder={placeholder} />

            {type === "password" && (
                <div className="absolute top-6 right-3">
                    {openPassword ? (
                        <Eye
                            className="cursor-pointer text-gray-500"
                            onClick={() => setOpenPassword(false)}
                        />
                    ) : (
                        <EyeClosed
                            className="cursor-pointer text-gray-500"
                            onClick={() => setOpenPassword(true)}
                        />
                    )}
                </div>
            )}
        </div>
    );
}
