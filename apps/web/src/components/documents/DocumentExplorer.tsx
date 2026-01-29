'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Upload,
    FolderOpen,
    Search,
    Filter,
    Grid,
    List,
    Download,
    Trash2,
    MoreVertical,
    Star,
    Clock,
    CheckCircle2
} from 'lucide-react';

interface Document {
    id: string;
    name: string;
    type: 'pdf' | 'csv' | 'xlsx' | 'doc' | 'image';
    size: number;
    uploadedAt: string;
    uploadedBy: string;
    tags: string[];
    status: 'processing' | 'ready' | 'error';
    starred?: boolean;
}

interface DocumentExplorerProps {
    documents?: Document[];
    onUpload?: (files: File[]) => void;
    onDownload?: (doc: Document) => void;
    onDelete?: (doc: Document) => void;
    className?: string;
}

const defaultDocuments: Document[] = [
    {
        id: '1',
        name: 'Employee_Census_2025.csv',
        type: 'csv',
        size: 245000,
        uploadedAt: '2026-01-15T10:30:00',
        uploadedBy: 'John Smith',
        tags: ['census', '2025'],
        status: 'ready',
        starred: true
    },
    {
        id: '2',
        name: '1095-C_Forms_Batch.pdf',
        type: 'pdf',
        size: 1250000,
        uploadedAt: '2026-01-20T14:15:00',
        uploadedBy: 'Sarah Johnson',
        tags: ['1095-C', 'forms'],
        status: 'ready'
    },
    {
        id: '3',
        name: 'Coverage_Import_Jan.xlsx',
        type: 'xlsx',
        size: 567000,
        uploadedAt: '2026-01-25T09:00:00',
        uploadedBy: 'Mike Wilson',
        tags: ['coverage', 'import'],
        status: 'processing'
    },
];

const typeIcons = {
    pdf: { color: '#ef4444', label: 'PDF' },
    csv: { color: '#22c55e', label: 'CSV' },
    xlsx: { color: '#22c55e', label: 'XLS' },
    doc: { color: '#3b82f6', label: 'DOC' },
    image: { color: '#8b5cf6', label: 'IMG' },
};

export function DocumentExplorer({
    documents = defaultDocuments,
    onUpload,
    onDownload,
    onDelete,
    className = ''
}: DocumentExplorerProps) {
    const [view, setView] = useState<'grid' | 'list'>('list');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDocs, setSelectedDocs] = useState<string[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    const filteredDocs = documents.filter(doc =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    const formatSize = (bytes: number) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = Array.from(e.dataTransfer.files);
        onUpload?.(files);
    }, [onUpload]);

    const toggleSelect = (id: string) => {
        setSelectedDocs(prev =>
            prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]
        );
    };

    return (
        <div className={`glass-card ${className}`}>
            {/* Header */}
            <div className="p-4 border-b border-[var(--glass-border)]">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-synapse-gold)] to-[var(--color-warning)] flex items-center justify-center">
                            <FolderOpen className="w-5 h-5 text-black" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Documents</h3>
                            <p className="text-xs text-[var(--color-steel)]">{documents.length} files</p>
                        </div>
                    </div>
                    <button className="btn-primary text-sm">
                        <Upload className="w-4 h-4" />
                        Upload
                    </button>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-steel)]" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search documents..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm text-white placeholder:text-[var(--color-steel)]"
                        />
                    </div>
                    <button className="p-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)]">
                        <Filter className="w-4 h-4 text-[var(--color-steel)]" />
                    </button>
                    <div className="flex rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)]">
                        <button
                            onClick={() => setView('list')}
                            className={`p-2 ${view === 'list' ? 'bg-[var(--glass-bg-light)]' : ''}`}
                        >
                            <List className="w-4 h-4 text-[var(--color-steel)]" />
                        </button>
                        <button
                            onClick={() => setView('grid')}
                            className={`p-2 ${view === 'grid' ? 'bg-[var(--glass-bg-light)]' : ''}`}
                        >
                            <Grid className="w-4 h-4 text-[var(--color-steel)]" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Drop zone */}
            <div
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`relative ${isDragging ? 'bg-[rgba(20,184,166,0.1)]' : ''}`}
            >
                {isDragging && (
                    <div className="absolute inset-0 border-2 border-dashed border-[var(--color-synapse-teal)] bg-[rgba(20,184,166,0.1)] flex items-center justify-center z-10">
                        <p className="text-[var(--color-synapse-teal)]">Drop files here</p>
                    </div>
                )}

                {/* Document list */}
                {view === 'list' ? (
                    <div className="divide-y divide-[var(--glass-border)]">
                        {filteredDocs.map((doc, i) => (
                            <motion.div
                                key={doc.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.03 }}
                                className="p-4 flex items-center gap-4 hover:bg-[var(--glass-bg)] transition-colors cursor-pointer"
                                onClick={() => toggleSelect(doc.id)}
                            >
                                {/* Checkbox */}
                                <div className={`w-5 h-5 rounded border ${selectedDocs.includes(doc.id)
                                        ? 'bg-[var(--color-synapse-teal)] border-[var(--color-synapse-teal)]'
                                        : 'border-[var(--glass-border)]'
                                    } flex items-center justify-center`}>
                                    {selectedDocs.includes(doc.id) && (
                                        <CheckCircle2 className="w-3 h-3 text-black" />
                                    )}
                                </div>

                                {/* Icon */}
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold"
                                    style={{
                                        backgroundColor: `${typeIcons[doc.type].color}20`,
                                        color: typeIcons[doc.type].color
                                    }}
                                >
                                    {typeIcons[doc.type].label}
                                </div>

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="font-medium text-white truncate">{doc.name}</p>
                                        {doc.starred && <Star className="w-4 h-4 text-[var(--color-synapse-gold)] fill-current" />}
                                    </div>
                                    <div className="flex items-center gap-3 text-xs text-[var(--color-steel)]">
                                        <span>{formatSize(doc.size)}</span>
                                        <span>•</span>
                                        <span>{doc.uploadedBy}</span>
                                        <span>•</span>
                                        <span>{formatDate(doc.uploadedAt)}</span>
                                    </div>
                                </div>

                                {/* Status */}
                                {doc.status === 'processing' ? (
                                    <span className="px-2 py-1 rounded text-xs bg-[rgba(245,158,11,0.1)] text-[var(--color-warning)]">
                                        Processing
                                    </span>
                                ) : doc.status === 'error' ? (
                                    <span className="px-2 py-1 rounded text-xs bg-[rgba(239,68,68,0.1)] text-[var(--color-critical)]">
                                        Error
                                    </span>
                                ) : null}

                                {/* Actions */}
                                <div className="flex items-center gap-1">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onDownload?.(doc); }}
                                        className="p-2 rounded-lg hover:bg-[var(--glass-bg-light)] transition-colors"
                                    >
                                        <Download className="w-4 h-4 text-[var(--color-steel)]" />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); onDelete?.(doc); }}
                                        className="p-2 rounded-lg hover:bg-[var(--glass-bg-light)] transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4 text-[var(--color-steel)]" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="p-4 grid grid-cols-4 gap-4">
                        {filteredDocs.map((doc, i) => (
                            <motion.div
                                key={doc.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.03 }}
                                onClick={() => toggleSelect(doc.id)}
                                className={`p-4 rounded-xl bg-[var(--glass-bg)] border ${selectedDocs.includes(doc.id)
                                        ? 'border-[var(--color-synapse-teal)]'
                                        : 'border-[var(--glass-border)]'
                                    } hover:border-[var(--glass-border-hover)] transition-colors cursor-pointer`}
                            >
                                <div
                                    className="w-12 h-12 rounded-lg flex items-center justify-center text-sm font-bold mx-auto mb-3"
                                    style={{
                                        backgroundColor: `${typeIcons[doc.type].color}20`,
                                        color: typeIcons[doc.type].color
                                    }}
                                >
                                    {typeIcons[doc.type].label}
                                </div>
                                <p className="font-medium text-white text-center text-sm truncate">{doc.name}</p>
                                <p className="text-xs text-[var(--color-steel)] text-center">{formatSize(doc.size)}</p>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default DocumentExplorer;
