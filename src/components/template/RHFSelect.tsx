"use client";

import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectGroup,
    SelectItem,
} from "@/components/ui/select";
import { Controller, useFormContext } from "react-hook-form";

interface Option {
    label: string;
    value: string;
}

interface RHFSelectProps {
    name: string;
    label?: string;
    placeholder?: string;
    options: Option[];
    rules?: Record<string, unknown>;
}

export function RHFSelect({ name, label, placeholder, options, rules }: RHFSelectProps) {
    const { control } = useFormContext();

    return (
        <div className="space-y-1">
            {label && <label className="text-sm font-normal mb-2">{label}</label>}
            <Controller
                rules={rules}
                name={name}
                control={control}
                render={({ field }) => (
                    <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                            <SelectValue placeholder={placeholder || "Pilih..."} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                {options.map((opt) => (
                                    <SelectItem key={opt.value} value={opt.value}>
                                        {opt.label}
                                    </SelectItem>
                                ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                )}
            />
        </div>
    );
}
