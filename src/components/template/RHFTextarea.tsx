"use client";

import { useFormContext } from "react-hook-form";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

interface RHFInputProps {
    name: string;
    label?: string;
    type?: string;
    placeholder?: string;
}

export function RHFTextarea({ name, label, placeholder }: RHFInputProps) {
    const { register } = useFormContext();

    return (
        <div className="space-y-1 relative">
            {label && <Label className="font-normal">{label}</Label>}
            <Textarea required {...register(name)}  placeholder={placeholder} />
        </div>
    );
}
