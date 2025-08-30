"use client";

import * as React from "react";
import { Controller, type Control, type FieldValues, type Path } from "react-hook-form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option {
  label: string;
  value: string;
}

interface RHFSelectSearchableProps<TFieldValues extends FieldValues> {
  name: Path<TFieldValues>;
  label?: string;
  placeholder?: string;
  options: Option[];
  control: Control<TFieldValues>;
}

export function RHFSelectSearchable<TFieldValues extends FieldValues>({
  name,
  label,
  placeholder = "Pilih opsi",
  options,
  control,
}: RHFSelectSearchableProps<TFieldValues>) {
  const [open, setOpen] = React.useState(false);

  return (
    <div className="space-y-1">
      {label && <label className="text-sm font-normal">{label}</label>}

      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          const selected = options.find((opt) => opt.value === field.value);

          return (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between">
                  {selected ? selected.label : placeholder}
                  <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                <Command>
                  <CommandInput placeholder={`Cari ${label || ""}...`} />
                  <CommandList>
                    <CommandEmpty>Tidak ditemukan</CommandEmpty>
                    <CommandGroup>
                      {options.map((opt) => (
                        <CommandItem
                          key={opt.value}
                          onSelect={() => {
                            field.onChange(opt.value);
                            field.onBlur(); // wajib biar react-hook-form tahu field sudah diubah
                            setOpen(false);
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              field.value === opt.value ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {opt.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          );
        }}
      />
    </div>
  );
}