'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Folder,
    FileText,
    FileSpreadsheet,
    File,
    Grid,
    List,
    Search,
    Filter,
    Download,
    Trash2,
    Move,
    Upload,
    MoreVertical,
    ChevronRight,
    FolderOpen,
    Clock,
    User,
    CheckCircle2,
    X,
    Plus,
    Archive,
    Lock
} from 'lucide-react';

interface DocumentVaultProps {
    className?: string;
}

interface VaultDocument {
    id: string;
    name: string;
    type: 'csv' | 'xlsx' | 'pdf' | 'txt' | 'folder';
    size?: number;
    modifiedAt: string;
    modifiedBy: string;
    versions?: number;
    isLocked?: boolean;
    parentId?: string;
}

const mockDocuments: VaultDocument[] = [
    { id: 'f1', name: 'Tax Year 2025', type: 'folder', modifiedAt: '2026-01-28', modifiedBy: 'System', versions: 0 },
    { id: 'f2', name: 'Tax Year 2024', type: 'folder', modifiedAt: '2025-12-15', modifiedBy: 'System', versions: 0 },
    { id: 'f3', name: 'Employee Census', type: 'folder', modifiedAt: '2026-01-25', modifiedBy: 'Admin', versions: 0 },
    { id: 'd1', name: 'employee_census_jan2026.csv', type: 'csv', size: 2450000, modifiedAt: '2026-01-28', modifiedBy: 'Sarah Chen', versions: 3, parentId: 'f3' },
    { id: 'd2', name: 'coverage_elections_2026.xlsx', type: 'xlsx', size: 1820000, modifiedAt: '2026-01-27', modifiedBy: 'Mike Johnson', versions: 5 },
    { id: 'd3', name: '1095C_batch_transmission.pdf', type: 'pdf', size: 4200000, modifiedAt: '2026-01-26', modifiedBy: 'System', versions: 1, isLocked: true },
    { id: 'd4', name: 'aca_compliance_report_q4.pdf', type: 'pdf', size: 3100000, modifiedAt: '2026-01-25', modifiedBy: 'Emily Davis', versions: 2 },
    { id: 'd5', name: 'hourly_wage_data.csv', type: 'csv', size: 890000, modifiedAt: '2026-01-24', modifiedBy: 'HR System', versions: 8 },
    { id: 'd6', name: 'safe_harbor_calculations.xlsx', type: 'xlsx', size: 1540000, modifiedAt: '2026-01-23', modifiedBy: 'Sarah Chen', versions: 4 },
];

const breadcrumbs = [
    { id: 'root', name: 'Document Vault' },
];

function formatFileSize(bytes?: number): string {
    if (!bytes) return '-';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(type: string) {
    switch (type) {
        case 'folder': return <Folder className="w-5 h-5" />;
        case 'csv': return <FileSpreadsheet className="w-5 h-5" />;
        case 'xlsx': return <FileSpreadsheet className="w-5 h-5" />;
        case 'pdf': return <FileText className="w-5 h-5" />;
        default: return <File className="w-5 h-5" />;
    }
}

function getFileColor(type: string) {
    switch (type) {
        case 'folder': return 'text-[var(--color-synapse-amber)]';
        case 'csv': return 'text-[var(--color-synapse-emerald)]';
        case 'xlsx': return 'text-[var(--color-synapse-emerald)]';
        case 'pdf': return 'text-[var(--color-synapse-coral)]';
        default: return 'text-[var(--color-steel)]';
    }
}

export function DocumentVault({ className = '' }: DocumentVaultProps) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
    const [filterType, setFilterType] = useState<string>('all');
    const [showFilters, setShowFilters] = useState(false);

    const filterOptions = [
        { value: 'all', label: 'All Files' },
        { value: 'folder', label: 'Folders' },
        { value: 'csv', label: 'CSV Files' },
        { value: 'xlsx', label: 'Excel Files' },
        { value: 'pdf', label: 'PDF Files' },
    ];

    const filteredDocs = mockDocuments.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'all' || doc.type === filterType;
        return matchesSearch && matchesType;
    });

    const toggleSelection = (id: string) => {
        setSelectedDocs(prev =>
            prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
        );
    };

    const selectAll = () => {
        if (selectedDocs.length === filteredDocs.length) {
            setSelectedDocs([]);
        } else {
            setSelectedDocs(filteredDocs.map(d => d.id));
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card ${className}`}
        >
            {/* Header */}
            <div className="p-5 border-b border-[var(--glass-border)]">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--color-synapse-teal)] to-[var(--color-synapse-cyan)] flex items-center justify-center">
                            <Archive className="w-5 h-5 text-black" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">Document Vault</h2>
                            <p className="text-xs text-[var(--color-steel)]">Secure file storage with versioning</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="btn-primary flex items-center gap-2">
                            <Upload className="w-4 h-4" />
                            Upload Files
                        </button>
                        <button className="btn-secondary flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            New Folder
                        </button>
                    </div>
                </div>

                {/* Breadcrumbs */}
                <div className="flex items-center gap-2 mb-4">
                    {breadcrumbs.map((crumb, index) => (
                        <div key={crumb.id} className="flex items-center gap-2">
                            {index > 0 && <ChevronRight className="w-4 h-4 text-[var(--color-steel)]" />}
                            <button className="text-sm text-[var(--color-synapse-teal)] hover:underline">
                                {crumb.name}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Search & Toolbar */}
                <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-steel)]" />
                        <input
                            type="text"
                            placeholder="Search documents..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-sm text-white placeholder:text-[var(--color-steel)] focus:outline-none focus:border-[var(--color-synapse-teal)]"
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`p-2 rounded-lg border transition-colors ${showFilters
                            ? 'bg-[var(--color-synapse-teal-muted)] border-[var(--color-synapse-teal)] text-[var(--color-synapse-teal)]'
                            : 'bg-[rgba(255,255,255,0.03)] border-[var(--glass-border)] text-[var(--color-steel)] hover:text-white'
                            }`}
                    >
                        <Filter className="w-4 h-4" />
                    </button>
                    <div className="flex items-center border border-[var(--glass-border)] rounded-lg overflow-hidden">
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-[var(--color-synapse-teal-muted)] text-[var(--color-synapse-teal)]' : 'text-[var(--color-steel)] hover:text-white'}`}
                        >
                            <Grid className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-[var(--color-synapse-teal-muted)] text-[var(--color-synapse-teal)]' : 'text-[var(--color-steel)] hover:text-white'}`}
                        >
                            <List className="w-4 h-4" />
                        </button>
                    </div>
                </div>

                {/* Filter Pills */}
                <AnimatePresence>
                    {showFilters && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[var(--glass-border)]">
                                {filterOptions.map(option => (
                                    <button
                                        key={option.value}
                                        onClick={() => setFilterType(option.value)}
                                        className={`px-3 py-1.5 text-xs font-medium rounded-full transition-colors ${filterType === option.value
                                            ? 'bg-[var(--color-synapse-teal)] text-black'
                                            : 'bg-[rgba(255,255,255,0.05)] text-[var(--color-silver)] hover:bg-[rgba(255,255,255,0.1)]'
                                            }`}
                                    >
                                        {option.label}
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Bulk Actions Bar */}
            <AnimatePresence>
                {selectedDocs.length > 0 && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden bg-[var(--color-synapse-teal-muted)] border-b border-[var(--color-synapse-teal)]"
                    >
                        <div className="flex items-center justify-between px-5 py-3">
                            <div className="flex items-center gap-3">
                                <span className="text-sm font-medium text-[var(--color-synapse-teal)]">
                                    {selectedDocs.length} selected
                                </span>
                                <button
                                    onClick={() => setSelectedDocs([])}
                                    className="text-xs text-[var(--color-steel)] hover:text-white"
                                >
                                    Clear selection
                                </button>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[rgba(255,255,255,0.1)] rounded-lg hover:bg-[rgba(255,255,255,0.15)] transition-colors">
                                    <Download className="w-3.5 h-3.5" />
                                    Download
                                </button>
                                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[rgba(255,255,255,0.1)] rounded-lg hover:bg-[rgba(255,255,255,0.15)] transition-colors">
                                    <Move className="w-3.5 h-3.5" />
                                    Move
                                </button>
                                <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[var(--color-critical)] bg-[rgba(239,68,68,0.1)] rounded-lg hover:bg-[rgba(239,68,68,0.2)] transition-colors">
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Delete
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Content */}
            <div className="p-5">
                {viewMode === 'list' ? (
                    <div className="overflow-x-auto">
                        <table className="data-table w-full">
                            <thead>
                                <tr>
                                    <th className="w-10">
                                        <input
                                            type="checkbox"
                                            checked={selectedDocs.length === filteredDocs.length && filteredDocs.length > 0}
                                            onChange={selectAll}
                                            className="rounded border-[var(--glass-border)] bg-transparent"
                                        />
                                    </th>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Size</th>
                                    <th>Modified</th>
                                    <th>Modified By</th>
                                    <th>Versions</th>
                                    <th className="w-10"></th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDocs.map((doc, index) => (
                                    <motion.tr
                                        key={doc.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.03 }}
                                        className={`group cursor-pointer ${selectedDocs.includes(doc.id) ? 'bg-[var(--color-synapse-teal-muted)]' : ''}`}
                                        onClick={() => doc.type === 'folder' ? null : toggleSelection(doc.id)}
                                    >
                                        <td onClick={(e) => e.stopPropagation()}>
                                            <input
                                                type="checkbox"
                                                checked={selectedDocs.includes(doc.id)}
                                                onChange={() => toggleSelection(doc.id)}
                                                className="rounded border-[var(--glass-border)] bg-transparent"
                                            />
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                <span className={getFileColor(doc.type)}>
                                                    {getFileIcon(doc.type)}
                                                </span>
                                                <span className="font-medium text-white group-hover:text-[var(--color-synapse-teal)] transition-colors">
                                                    {doc.name}
                                                </span>
                                                {doc.isLocked && (
                                                    <Lock className="w-3.5 h-3.5 text-[var(--color-synapse-amber)]" />
                                                )}
                                            </div>
                                        </td>
                                        <td>
                                            <span className="text-[var(--color-steel)] uppercase text-xs">
                                                {doc.type}
                                            </span>
                                        </td>
                                        <td className="text-[var(--color-silver)]">
                                            {formatFileSize(doc.size)}
                                        </td>
                                        <td className="text-[var(--color-silver)]">
                                            {doc.modifiedAt}
                                        </td>
                                        <td className="text-[var(--color-silver)]">
                                            {doc.modifiedBy}
                                        </td>
                                        <td>
                                            {doc.versions ? (
                                                <span className="px-2 py-0.5 text-xs font-medium bg-[rgba(255,255,255,0.05)] rounded-full text-[var(--color-synapse-cyan)]">
                                                    v{doc.versions}
                                                </span>
                                            ) : '-'}
                                        </td>
                                        <td onClick={(e) => e.stopPropagation()}>
                                            <button className="p-1 rounded hover:bg-[rgba(255,255,255,0.05)] opacity-0 group-hover:opacity-100 transition-opacity">
                                                <MoreVertical className="w-4 h-4 text-[var(--color-steel)]" />
                                            </button>
                                        </td>
                                    </motion.tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {filteredDocs.map((doc, index) => (
                            <motion.div
                                key={doc.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: index * 0.03 }}
                                onClick={() => doc.type === 'folder' ? null : toggleSelection(doc.id)}
                                className={`group relative p-4 rounded-lg border cursor-pointer transition-all ${selectedDocs.includes(doc.id)
                                    ? 'bg-[var(--color-synapse-teal-muted)] border-[var(--color-synapse-teal)]'
                                    : 'bg-[rgba(255,255,255,0.02)] border-[var(--glass-border)] hover:bg-[rgba(255,255,255,0.05)] hover:border-[var(--glass-border-hover)]'
                                    }`}
                            >
                                <div className="flex flex-col items-center text-center">
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${doc.type === 'folder' ? 'bg-[rgba(245,158,11,0.1)]' : 'bg-[rgba(255,255,255,0.05)]'
                                        }`}>
                                        <span className={getFileColor(doc.type)}>
                                            {doc.type === 'folder'
                                                ? <FolderOpen className="w-7 h-7" />
                                                : getFileIcon(doc.type)
                                            }
                                        </span>
                                    </div>
                                    <p className="text-sm font-medium text-white truncate w-full mb-1">
                                        {doc.name}
                                    </p>
                                    <p className="text-xs text-[var(--color-steel)]">
                                        {doc.type === 'folder' ? 'Folder' : formatFileSize(doc.size)}
                                    </p>
                                </div>
                                {selectedDocs.includes(doc.id) && (
                                    <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-[var(--color-synapse-teal)] flex items-center justify-center">
                                        <CheckCircle2 className="w-3.5 h-3.5 text-black" />
                                    </div>
                                )}
                                {doc.isLocked && (
                                    <div className="absolute top-2 left-2">
                                        <Lock className="w-3.5 h-3.5 text-[var(--color-synapse-amber)]" />
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer Stats */}
            <div className="px-5 py-3 border-t border-[var(--glass-border)] flex items-center justify-between text-xs text-[var(--color-steel)]">
                <span>
                    {filteredDocs.length} items • {filteredDocs.filter(d => d.type !== 'folder').reduce((acc, d) => acc + (d.size || 0), 0) / (1024 * 1024) | 0} MB total
                </span>
                <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    Last synced 2 minutes ago
                </span>
            </div>
        </motion.div>
    );
}

export default DocumentVault;
