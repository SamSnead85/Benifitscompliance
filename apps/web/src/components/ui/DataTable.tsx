'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    ChevronUp,
    ChevronDown,
    Search,
    Filter,
    Download,
    MoreHorizontal,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

interface Column<T> {
    key: keyof T;
    header: string;
    sortable?: boolean;
    width?: string;
    render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    pageSize?: number;
    searchable?: boolean;
    searchKeys?: (keyof T)[];
    onRowClick?: (row: T) => void;
    className?: string;
}

export function DataTable<T extends Record<string, unknown>>({
    data,
    columns,
    pageSize = 10,
    searchable = true,
    searchKeys,
    onRowClick,
    className = ''
}: DataTableProps<T>) {
    const [sortColumn, setSortColumn] = useState<keyof T | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    const handleSort = (column: Column<T>) => {
        if (!column.sortable) return;

        if (sortColumn === column.key) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column.key);
            setSortDirection('asc');
        }
    };

    const filteredData = useMemo(() => {
        if (!searchQuery) return data;

        const keys = searchKeys || columns.map(c => c.key);
        return data.filter(row =>
            keys.some(key => {
                const value = row[key];
                return String(value).toLowerCase().includes(searchQuery.toLowerCase());
            })
        );
    }, [data, searchQuery, searchKeys, columns]);

    const sortedData = useMemo(() => {
        if (!sortColumn) return filteredData;

        return [...filteredData].sort((a, b) => {
            const aVal = a[sortColumn];
            const bVal = b[sortColumn];

            if (aVal === bVal) return 0;

            const comparison = aVal < bVal ? -1 : 1;
            return sortDirection === 'asc' ? comparison : -comparison;
        });
    }, [filteredData, sortColumn, sortDirection]);

    const totalPages = Math.ceil(sortedData.length / pageSize);
    const paginatedData = sortedData.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    return (
        <div className={`glass-card overflow-hidden ${className}`}>
            {/* Toolbar */}
            {searchable && (
                <div className="p-4 border-b border-[var(--glass-border)] flex items-center justify-between">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-steel)]" />
                        <input
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm text-white placeholder:text-[var(--color-steel)] focus:border-[var(--color-synapse-teal)] focus:outline-none"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="btn-secondary text-sm">
                            <Filter className="w-4 h-4" />
                            Filter
                        </button>
                        <button className="btn-secondary text-sm">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-[var(--glass-border)]">
                            {columns.map((column) => (
                                <th
                                    key={String(column.key)}
                                    onClick={() => handleSort(column)}
                                    className={`px-4 py-3 text-left text-xs font-medium text-[var(--color-steel)] uppercase tracking-wider ${column.sortable ? 'cursor-pointer hover:text-white select-none' : ''
                                        }`}
                                    style={{ width: column.width }}
                                >
                                    <div className="flex items-center gap-1">
                                        {column.header}
                                        {column.sortable && sortColumn === column.key && (
                                            sortDirection === 'asc'
                                                ? <ChevronUp className="w-3 h-3" />
                                                : <ChevronDown className="w-3 h-3" />
                                        )}
                                    </div>
                                </th>
                            ))}
                            <th className="w-10" />
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedData.map((row, i) => (
                            <motion.tr
                                key={i}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.02 }}
                                onClick={() => onRowClick?.(row)}
                                className={`border-b border-[var(--glass-border)] ${onRowClick ? 'cursor-pointer hover:bg-[var(--glass-bg-light)]' : ''
                                    }`}
                            >
                                {columns.map((column) => (
                                    <td
                                        key={String(column.key)}
                                        className="px-4 py-3 text-sm text-[var(--color-silver)]"
                                    >
                                        {column.render
                                            ? column.render(row[column.key], row)
                                            : String(row[column.key])}
                                    </td>
                                ))}
                                <td className="px-2">
                                    <button className="p-1 rounded hover:bg-[var(--glass-bg)] text-[var(--color-steel)]">
                                        <MoreHorizontal className="w-4 h-4" />
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="p-4 border-t border-[var(--glass-border)] flex items-center justify-between">
                    <span className="text-sm text-[var(--color-steel)]">
                        Showing {(currentPage - 1) * pageSize + 1} to{' '}
                        {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length}
                    </span>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                            disabled={currentPage === 1}
                            className="p-2 rounded-lg hover:bg-[var(--glass-bg-light)] text-[var(--color-steel)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>
                        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            let pageNum: number;
                            if (totalPages <= 5) {
                                pageNum = i + 1;
                            } else if (currentPage <= 3) {
                                pageNum = i + 1;
                            } else if (currentPage >= totalPages - 2) {
                                pageNum = totalPages - 4 + i;
                            } else {
                                pageNum = currentPage - 2 + i;
                            }

                            return (
                                <button
                                    key={pageNum}
                                    onClick={() => setCurrentPage(pageNum)}
                                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${currentPage === pageNum
                                            ? 'bg-[var(--color-synapse-teal)] text-black'
                                            : 'hover:bg-[var(--glass-bg-light)] text-[var(--color-steel)]'
                                        }`}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}
                        <button
                            onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                            disabled={currentPage === totalPages}
                            className="p-2 rounded-lg hover:bg-[var(--glass-bg-light)] text-[var(--color-steel)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {paginatedData.length === 0 && (
                <div className="p-8 text-center text-[var(--color-steel)]">
                    <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No results found</p>
                </div>
            )}
        </div>
    );
}

export default DataTable;
