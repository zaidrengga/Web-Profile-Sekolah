"use client";

import { Button } from "@/components/ui/button";
import React, { ReactNode } from "react";
import { FormProvider, SubmitHandler, UseFormReturn } from "react-hook-form";

interface FormCardProps<TFormValues extends Record<string, unknown>> {
  onSave: (data: TFormValues) => void | Promise<void>;
  title?: string;
  children: ReactNode;
  methods: UseFormReturn<TFormValues>;
  loading?: boolean;
  error?: string;
}

export function FormCard<TFormValues extends Record<string, unknown>>({
  onSave,
  title = "Form",
  children,
  methods,
  loading,
  error,
}: FormCardProps<TFormValues>) {
  const { handleSubmit } = methods;

  const handleSave: SubmitHandler<TFormValues> = async (data) => {
    await onSave(data);
    // tidak reset otomatis, biar user bisa lihat pilihannya
  };

  return (
    <div className="p-6 max-w-md mx-auto bg-white rounded-lg shadow-md border">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>
      {error && <p className="text-red-500 mb-2">{error}</p>}

      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(handleSave)} className="space-y-4">
          {children}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? "Loading..." : "Save"}
          </Button>
        </form>
      </FormProvider>
    </div>
  );
}