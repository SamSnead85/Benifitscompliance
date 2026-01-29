'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useMemo } from 'react';
import {
    ChevronUp,
    ChevronDown,
    MoreHorizontal,
    Edit3,
    Trash2,
    Eye,
    Download,
    Filter,
    Search,
    CheckSquare,
    Square,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react';

interface Column<T> {
    key: keyof T | string;
    header: string;
    width?: string;
    align?: 'left' | 'center' | 'right';
    sortable?: boolean;
    render?: (value: unknown, row: T, index: number) => React.ReactNode;
}

interface ProfessionalDataGridProps<T> {
    columns: Column<T>[];
    data: T[];
    keyField: keyof T;
    selectable?: boolean;
    onSelectionChange?: (selectedIds: string[]) => void;
    onRowClick?: (row: T) => void;
    onEdit?: (row: T) => void;
    onDelete?: (row: T) => void;
    onView?: (row: T) => void;
    pageSize?: number;
    showPagination?: boolean;
    loading?: boolean;
    emptyMessage?: string;
    className?: string;
}

/**
 * Professional Data Grid
 * Enterprise-grade table with sorting, selection, and actions
 */
export function ProfessionalDataGrid<T extends Record<string, unknown>>({
    columns,
    data,
    keyField,
    selectable = false,
    onSelectionChange,
    onRowClick,
    onEdit,
    onDelete,
    onView,
    pageSize = 10,
    showPagination = true,
    loading = false,
    emptyMessage = 'No data available',
    className = '',
}: ProfessionalDataGridProps<T>) {
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
    const [currentPage, setCurrentPage] = useState(1);
    const [expandedActions, setExpandedActions] = useState<string | null>(null);

    const sortedData = useMemo(() => {
        if (!sortKey) return data;

        return [...data].sort((a, b) => {
            const aVal = a[sortKey as keyof T];
            const bVal = b[sortKey as keyof T];

            if (aVal === bVal) return 0;

            const comparison = aVal < bVal ? -1 : 1;
            return sortDirection === 'asc' ? comparison : -comparison;
        });
    }, [data, sortKey, sortDirection]);

    const paginatedData = useMemo(() => {
        if (!showPagination) return sortedData;
        const start = (currentPage - 1) * pageSize;
        return sortedData.slice(start, start + pageSize);
    }, [sortedData, currentPage, pageSize, showPagination]);

    const totalPages = Math.ceil(data.length / pageSize);

    const handleSort = (key: string) => {
        if (sortKey === key) {
            setSortDirection(d => d === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };

    const handleSelectAll = () => {
        if (selectedIds.size === data.length) {
            setSelectedIds(new Set());
            onSelectionChange?.([]);
        } else {
            const allIds = data.map(row => String(row[keyField]));
            setSelectedIds(new Set(allIds));
            onSelectionChange?.(allIds);
        }
    };

    const handleSelectRow = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
        onSelectionChange?.(Array.from(newSelected));
    };

    return (
        <div className={`glass-card overflow-hidden ${className}`}>
            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-[rgba(255,255,255,0.02)] border-b border-[rgba(255,255,255,0.06)]">
                            {selectable && (
                                <th className="w-12 px-4 py-3">
                                    <button
                                        onClick={handleSelectAll}
                                        className="text-[#64748B] hover:text-white transition-colors"
                                    >
                                        {selectedIds.size === data.length && data.length > 0 ? (
                                            <CheckSquare className="w-4 h-4" />
                                        ) : (
                                            <Square className="w-4 h-4" />
                                        )}
                                    </button>
                                </th>
                            )}
                            {columns.map(column => (
                                <th
                                    key={String(column.key)}
                                    className={`
                    px-4 py-3 text-xs font-semibold uppercase tracking-wider text-[#64748B]
                    ${column.sortable !== false ? 'cursor-pointer select-none hover:text-white' : ''}
                    ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'}
                  `}
                                    style={{ width: column.width }}
                                    onClick={() => column.sortable !== false && handleSort(String(column.key))}
                                >
                                    <div className="flex items-center gap-1">
                                        {column.header}
                                        {column.sortable !== false && sortKey === column.key && (
                                            sortDirection === 'asc'
                                                ? <ChevronUp className="w-3 h-3 text-cyan-400" />
                                                : <ChevronDown className="w-3 h-3 text-cyan-400" />
                                        )}
                                    </div>
                                </th>
                            ))}
                            {(onEdit || onDelete || onView) && (
                                <th className="w-16 px-4 py-3"></th>
                            )}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[rgba(255,255,255,0.04)]">
                        {loading ? (
                            // Loading skeleton
                            Array.from({ length: 5 }).map((_, i) => (
                                <tr key={i}>
                                    {selectable && <td className="px-4 py-4"><div className="w-4 h-4 rounded bg-[rgba(255,255,255,0.06)] animate-pulse" /></td>}
                                    {columns.map((_, j) => (
                                        <td key={j} className="px-4 py-4">
                                            <div className="h-4 rounded bg-[rgba(255,255,255,0.06)] animate-pulse" style={{ width: `${60 + Math.random() * 40}%` }} />
                                        </td>
                                    ))}
                                    {(onEdit || onDelete || onView) && <td className="px-4 py-4"></td>}
                                </tr>
                            ))
                        ) : paginatedData.length === 0 ? (
                            <tr>
                                <td colSpan={columns.length + (selectable ? 1 : 0) + (onEdit || onDelete || onView ? 1 : 0)} className="px-4 py-12 text-center">
                                    <p className="text-sm text-[#64748B]">{emptyMessage}</p>
                                </td>
                            </tr>
                        ) : (
                            paginatedData.map((row, rowIndex) => {
                                const rowId = String(row[keyField]);
                                const isSelected = selectedIds.has(rowId);

                                return (
                                    <motion.tr
                                        key={rowId}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: rowIndex * 0.02 }}
                                        onClick={() => onRowClick?.(row)}
                                        className={`
                      transition-colors group
                      ${isSelected ? 'bg-cyan-500/10' : 'hover:bg-[rgba(255,255,255,0.02)]'}
                      ${onRowClick ? 'cursor-pointer' : ''}
                    `}
                                    >
                                        {selectable && (
                                            <td className="px-4 py-4" onClick={e => e.stopPropagation()}>
                                                <button
                                                    onClick={() => handleSelectRow(rowId)}
                                                    className="text-[#64748B] hover:text-white transition-colors"
                                                >
                                                    {isSelected ? (
                                                        <CheckSquare className="w-4 h-4 text-cyan-400" />
                                                    ) : (
                                                        <Square className="w-4 h-4" />
                                                    )}
                                                </button>
                                            </td>
                                        )}
                                        {columns.map(column => {
                                            const value = row[column.key as keyof T];

                                            return (
                                                <td
                                                    key={String(column.key)}
                                                    className={`
                            px-4 py-4 text-sm
                            ${column.align === 'center' ? 'text-center' : column.align === 'right' ? 'text-right' : 'text-left'}
                          `}
                                                >
                                                    {column.render ? column.render(value, row, rowIndex) : (
                                                        <span className="text-white">{String(value ?? '')}</span>
                                                    )}
                                                </td>
                                            );
                                        })}
                                        {(onEdit || onDelete || onView) && (
                                            <td className="px-4 py-4 text-right relative" onClick={e => e.stopPropagation()}>
                                                <button
                                                    onClick={() => setExpandedActions(expandedActions === rowId ? null : rowId)}
                                                    className="p-1.5 rounded-md opacity-0 group-hover:opacity-100 hover:bg-[rgba(255,255,255,0.06)] text-[#64748B] hover:text-white transition-all"
                                                >
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </button>

                                                <AnimatePresence>
                                                    {expandedActions === rowId && (
                                                        <motion.div
                                                            initial={{ opacity: 0, scale: 0.95 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            exit={{ opacity: 0, scale: 0.95 }}
                                                            className="absolute right-4 top-full z-20 mt-1 py-1 min-w-[120px] bg-[#15151F] border border-[rgba(255,255,255,0.1)] rounded-lg shadow-xl"
                                                        >
                                                            {onView && (
                                                                <button
                                                                    onClick={() => { onView(row); setExpandedActions(null); }}
                                                                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[#94A3B8] hover:bg-[rgba(255,255,255,0.04)] hover:text-white"
                                                                >
                                                                    <Eye className="w-4 h-4" /> View
                                                                </button>
                                                            )}
                                                            {onEdit && (
                                                                <button
                                                                    onClick={() => { onEdit(row); setExpandedActions(null); }}
                                                                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[#94A3B8] hover:bg-[rgba(255,255,255,0.04)] hover:text-white"
                                                                >
                                                                    <Edit3 className="w-4 h-4" /> Edit
                                                                </button>
                                                            )}
                                                            {onDelete && (
                                                                <button
                                                                    onClick={() => { onDelete(row); setExpandedActions(null); }}
                                                                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-400 hover:bg-red-500/10"
                                                                >
                                                                    <Trash2 className="w-4 h-4" /> Delete
                                                                </button>
                                                            )}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </td>
                                        )}
                                    </motion.tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {showPagination && totalPages > 1 && (
                <div className="flex items-center justify-between px-4 py-3 border-t border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.01)]">
                    <p className="text-xs text-[#64748B]">
                        Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, data.length)} of {data.length}
                    </p>

                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-1.5 rounded-md hover:bg-[rgba(255,255,255,0.06)] text-[#64748B] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </button>

                        {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
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
                                    className={`
                    w-8 h-8 text-xs font-medium rounded-md
                    ${currentPage === pageNum
                                            ? 'bg-cyan-500/20 text-cyan-400'
                                            : 'text-[#94A3B8] hover:bg-[rgba(255,255,255,0.06)] hover:text-white'
                                        }
                  `}
                                >
                                    {pageNum}
                                </button>
                            );
                        })}

                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-1.5 rounded-md hover:bg-[rgba(255,255,255,0.06)] text-[#64748B] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ProfessionalDataGrid;
