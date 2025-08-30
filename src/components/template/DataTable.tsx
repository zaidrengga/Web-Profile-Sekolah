"use client";

import * as React from "react";
import * as XLSX from "xlsx";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
    SortingState,
    ColumnFiltersState,
    VisibilityState,
    Row,
    FilterFn,
} from "@tanstack/react-table";

import { ChevronDown, Pen, Trash, ArrowRight, FileDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[];
    data: TData[];
    searchKeys?: (keyof TData)[];
    filterKey?: { label: string; value: string };
    filterOptions?: { label: string; value: string }[];
    onEdit?: (row: TData) => void;
    onDelete?: (id: string | number) => void;
    onDetails?: (id: string | number) => string;
    relationMap?: Record<string, { id: string; label: string }[]>;
    columnHeaderMap?: { [key: string]: string };
}

export function DataTable<TData extends { id?: string | number }, TValue>({
    columns,
    data,
    searchKeys,
    filterKey,
    filterOptions,
    onEdit,
    onDelete,
    onDetails,
    relationMap,
    columnHeaderMap
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([]);
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
    const [rowSelection, setRowSelection] = React.useState({});
    const [globalFilter, setGlobalFilter] = React.useState("");
    const [filterSearch, setFilterSearch] = React.useState("");

    const actionColumn: ColumnDef<TData, TValue>[] =
        onEdit || onDelete || onDetails
            ? [
                {
                    id: "actions",
                    header: () => <div className="text-right">Actions</div>,
                    cell: ({ row }) => {
                        const rowData = row.original;
                        return (
                            <div className="flex items-center space-x-2 justify-end">
                                {onDetails && rowData.id && (
                                    <Button size="sm" asChild>
                                        <Link href={onDetails(rowData.id)}>
                                            <ArrowRight className="mr-1 h-4 w-4" /> Details
                                        </Link>
                                    </Button>
                                )}
                                {onEdit && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => onEdit(rowData)}
                                    >
                                        <Pen className="mr-1 h-4 w-4" /> Edit
                                    </Button>
                                )}
                                {onDelete && (
                                    <Button
                                        variant="destructive"
                                        size="sm"
                                        onClick={() => rowData.id && onDelete(rowData.id)}
                                    >
                                        <Trash className="mr-1 h-4 w-4" /> Delete
                                    </Button>
                                )}
                            </div>
                        );
                    },
                    enableSorting: false,
                    enableHiding: false,
                },
            ]
            : [];

    function createGlobalFilter<TData>(searchKeys?: (keyof TData)[]): FilterFn<TData> {
        return (row: Row<TData>, columnId: string, filterValue: string) => {
            if (!filterValue) return true;

            const lower = filterValue.toLowerCase();
            if (searchKeys && searchKeys.length > 0) {
                return searchKeys.some((key) => {
                    const value = row.getValue(key as string);
                    return String(value ?? "").toLowerCase().includes(lower);
                });
            }

            const value = row.getValue(columnId);
            return String(value ?? "").toLowerCase().includes(lower);
        };
    }

    const table = useReactTable({
        data,
        columns: [...columns, ...actionColumn],
        state: { sorting, columnFilters, columnVisibility, rowSelection, globalFilter },
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        globalFilterFn: createGlobalFilter<TData>(searchKeys),
    });

    return (
        <div className="w-full">
            {/* Search + Filter + Export */}
            <div className="flex items-center gap-2 py-2 flex-wrap">
                {searchKeys && (
                    <Input
                        placeholder={`Cari ${searchKeys.join("/")} ...`}
                        value={globalFilter ?? ""}
                        onChange={(e) => setGlobalFilter(e.target.value)}
                        className="max-w-sm"
                    />
                )}

                {filterKey && filterOptions && (
                    <Select
                        value={(table.getColumn(filterKey.value)?.getFilterValue() as string) ?? ""}
                        onValueChange={(value) =>
                            value === "all"
                                ? table.getColumn(filterKey.value)?.setFilterValue(undefined)
                                : table.getColumn(filterKey.value)?.setFilterValue(value)
                        }
                    >
                        <SelectTrigger className="max-w-sm">
                            <SelectValue placeholder={`Filter ${filterKey.label}`} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <div className="p-2">
                                    <Input
                                        placeholder={`Cari ${filterKey.label}`}
                                        value={filterSearch}
                                        onChange={(e) => setFilterSearch(e.target.value)}
                                        className="h-8"
                                    />
                                </div>
                                <SelectItem value="all">Semua</SelectItem>
                                {filterOptions
                                    .filter((option) =>
                                        option.label.toLowerCase().includes(filterSearch.toLowerCase())
                                    )
                                    .map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                )}

                {filterKey?.value === "created_at" && (
                    <Select
                        value={
                            sorting.length && sorting[0].id === filterKey.value
                                ? sorting[0].desc
                                    ? "desc"
                                    : "asc"
                                : ""
                        }
                        onValueChange={(value) => {
                            if (!value) return table.resetSorting();
                            setSorting([{ id: filterKey.value, desc: value === "desc" }]);
                        }}
                    >
                        <SelectTrigger className="max-w-sm">
                            <SelectValue placeholder={`Filter ${filterKey.label}`} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectItem value="desc">Terbaru</SelectItem>
                                <SelectItem value="asc">Terlama</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                )}

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="ml-auto">
                            Columns <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        {table
                            .getAllColumns()
                            .filter((col) => col.getCanHide())
                            .map((col) => (
                                <DropdownMenuCheckboxItem
                                    key={col.id}
                                    className="capitalize"
                                    checked={col.getIsVisible()}
                                    onCheckedChange={(value) => col.toggleVisibility(!!value)}
                                >
                                    {col.id}
                                </DropdownMenuCheckboxItem>
                            ))}
                    </DropdownMenuContent>
                </DropdownMenu>

                {/* Export Excel */}
                <Button
                    variant="outline"
                    onClick={() => {
                        const exportData = table.getRowModel().rows.map((row) => {
                            const obj: Record<string, unknown> = {};
                            row.getVisibleCells().forEach((cell) => {
                                if (cell.column.id === "actions") return; // skip actions

                                let value: unknown;
                                if (relationMap && relationMap[cell.column.id]) {
                                    const reference = relationMap[cell.column.id].find(
                                        (r) => r.id === cell.getValue()
                                    );
                                    value = reference ? reference.label : "-";
                                } else {
                                    value = cell.getValue();
                                }

                                // gunakan header map jika ada, default ke column id
                                const header = columnHeaderMap?.[cell.column.id] || cell.column.id;
                                obj[header] = value;
                            });
                            return obj;
                        });

                        const worksheet = XLSX.utils.json_to_sheet(exportData);
                        const workbook = XLSX.utils.book_new();
                        XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
                        XLSX.writeFile(workbook, "data_export.xlsx");
                    }}
                >
                    Export Excel <FileDown />
                </Button>

            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader className="bg-accent">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id} className="max-w-[200px]">
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(header.column.columnDef.header, header.getContext())}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id} className="max-w-[200px] truncate">
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length + actionColumn.length} className="h-24 text-center">
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <div className="flex items-center justify-end space-x-2 p-2 bg-accent">
                    <div className="text-muted-foreground flex-1 text-sm">
                        {table.getFilteredRowModel().rows.length} total
                    </div>
                    <div className="space-x-2">
                        <span className="text-sm text-gray-500">{table.getState().pagination.pageIndex + 1} of {table.getPageCount()} pages</span>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                        >
                            Previous
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}