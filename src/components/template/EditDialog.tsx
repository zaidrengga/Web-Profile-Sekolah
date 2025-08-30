"use client";

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import React, { ReactNode, useEffect } from "react";
import { useForm, FormProvider, SubmitHandler, DefaultValues } from "react-hook-form";

interface EditDialogProps<TFormValues extends Record<string, unknown>> {
    open: boolean;
    onClose: () => void;
    onSave: (data: TFormValues) => void;
    title?: string;
    defaultValues: DefaultValues<TFormValues>; // ⏺️ gunakan DefaultValues
    children: ReactNode;
}

export function EditDialog<TFormValues extends Record<string, unknown>>({
    open,
    onClose,
    onSave,
    title = "Edit Data",
    defaultValues,
    children,
}: EditDialogProps<TFormValues>) {
    const methods = useForm<TFormValues>({ defaultValues });
    const { handleSubmit, reset } = methods;

    // ⏺️ Reset form setiap kali modal dibuka atau defaultValues berubah
    useEffect(() => {
        if (open) reset(defaultValues);
    }, [open, defaultValues, reset]);

    const handleSave: SubmitHandler<TFormValues> = async (data) => {
        await onSave(data);
        onClose();
    };

    return (
        <Dialog
            open={open}
            onOpenChange={(isOpen) => {
                if (!isOpen) onClose();
            }}
        >
            <DialogContent className="sm:max-w-lg max-h-screen overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                </DialogHeader>

                <FormProvider {...methods}>
                    <form onSubmit={handleSubmit(handleSave)} className="space-y-3">
                        {children}

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={onClose}>
                                Cancel
                            </Button>
                            <Button type="submit">Save</Button>
                        </DialogFooter>
                    </form>
                </FormProvider>
            </DialogContent>
        </Dialog>
    );
}
