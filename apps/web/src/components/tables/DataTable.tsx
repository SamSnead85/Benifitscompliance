'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    ChevronUp,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Search,
    Filter,
    Download,
    MoreHorizontal
} from 'lucide-react';

interface Column<T> {
    key: keyof T | string;
    header: string;
    width?: string;
    sortable?: boolean;
    render?: (value: unknown, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    searchable?: boolean;
    searchPlaceholder?: string;
    pageSize?: number;
    onRowClick?: (row: T) => void;
    className?: string;
}

export function DataTable<T extends { id: string | number }>({
    data,
    columns,
    searchable = true,
    searchPlaceholder = 'Search...',
    pageSize = 10,
    onRowClick,
    className = ''
}: DataTableProps<T>) {
    const [searchQuery, setSearchQuery] = useState('');
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [currentPage, setCurrentPage] = useState(1);

    // Filter data
    const filteredData = data.filter(row => {
        if (!searchQuery) return true;
        return Object.values(row as Record<string, unknown>).some(val =>
            String(val).toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    // Sort data
    const sortedData = [...filteredData].sort((a, b) => {
        if (!sortKey) return 0;
        const aVal = (a as Record<string, unknown>)[sortKey];
        const bVal = (b as Record<string, unknown>)[sortKey];
        const comparison = String(aVal).localeCompare(String(bVal));
        return sortDirection === 'asc' ? comparison : -comparison;
    });

    // Paginate
    const totalPages = Math.ceil(sortedData.length / pageSize);
    const paginatedData = sortedData.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const handleSort = (key: string) => {
        if (sortKey === key) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };

    const getValue = (row: T, key: string): unknown => {
        return (row as Record<string, unknown>)[key];
    };

    return (
        <div className={`glass-card overflow-hidden ${className}`}>
            {/* Toolbar */}
            <div className="p-4 border-b border-[var(--glass-border)] flex items-center justify-between gap-4">
                {searchable && (
                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-steel)]" />
                        <input
                            type="text"
                            placeholder={searchPlaceholder}
                            value={searchQuery}
                            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-white placeholder:text-[var(--color-steel)] outline-none focus:border-[var(--color-synapse-teal)] transition-colors text-sm"
                        />
                    </div>
                )}
                <div className="flex items-center gap-2">
                    <button className="p-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:border-[var(--color-synapse-teal)] transition-colors">
                        <Filter className="w-4 h-4 text-[var(--color-steel)]" />
                    </button>
                    <button className="p-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:border-[var(--color-synapse-teal)] transition-colors">
                        <Download className="w-4 h-4 text-[var(--color-steel)]" />
                    </button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-[var(--glass-border)]">
                            {columns.map((col) => (
                                <th
                                    key={String(col.key)}
                                    style={{ width: col.width }}
                                    className={`px-4 py-3 text-left text-xs font-medium text-[var(--color-steel)] uppercase tracking-wider ${col.sortable ? 'cursor-pointer hover:text-white' : ''
                                        }`}
                                    onClick={() => col.sortable && handleSort(String(col.key))}
                                >
                                    <div className="flex items-center gap-1">
                                        {col.header}
                                        {col.sortable && sortKey === col.key && (
                                            sortDirection === 'asc'
                                                ? <ChevronUp className="w-3 h-3" />
                                                : <ChevronDown className="w-3 h-3" />
                                        )}
                                    </div>
                                </th>
                            ))}
                            <th className="px-4 py-3 w-10"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((row, i) => (
                            <motion.tr
                                key={row.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.02 }}
                                onClick={() => onRowClick?.(row)}
                                className={`border-b border-[var(--glass-border)] hover:bg-[var(--glass-bg-light)] transition-colors ${onRowClick ? 'cursor-pointer' : ''
                                    }`}
                            >
                                {columns.map((col) => (
                                    <td key={String(col.key)} className="px-4 py-3 text-sm text-white">
                                        {col.render
                                            ? col.render(getValue(row, String(col.key)), row)
                                            : String(getValue(row, String(col.key)) ?? '')
                                        }
                                    </td>
                                ))}
                                <td className="px-4 py-3">
                                    <button className="p-1 rounded hover:bg-[var(--glass-bg)]">
                                        <MoreHorizontal className="w-4 h-4 text-[var(--color-steel)]" />
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="p-4 border-t border-[var(--glass-border)] flex items-center justify-between">
                <p className="text-sm text-[var(--color-steel)]">
                    Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} results
                </p>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="p-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] disabled:opacity-50 hover:border-[var(--color-synapse-teal)] transition-colors"
                    >
                        <ChevronLeft className="w-4 h-4 text-[var(--color-steel)]" />
                    </button>
                    <span className="text-sm text-white px-3">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="p-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] disabled:opacity-50 hover:border-[var(--color-synapse-teal)] transition-colors"
                    >
                        <ChevronRight className="w-4 h-4 text-[var(--color-steel)]" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DataTable;
