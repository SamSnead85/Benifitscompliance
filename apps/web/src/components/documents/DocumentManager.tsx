'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback } from 'react';
import {
    FileText,
    Upload,
    X,
    CheckCircle2,
    AlertCircle,
    Eye,
    Download,
    Trash2,
    Search,
    Filter,
    Calendar,
    Clock,
    User,
    Tag,
    ChevronRight,
    FolderOpen,
    FileSpreadsheet,
    Image,
} from 'lucide-react';

interface Document {
    id: string;
    name: string;
    type: 'pdf' | 'excel' | 'image' | 'other';
    category: 'aca_filing' | 'carrier_document' | 'employee_record' | 'audit' | 'other';
    uploadedAt: string;
    uploadedBy: string;
    size: string;
    status: 'processing' | 'classified' | 'verified' | 'error';
    tags?: string[];
}

interface DocumentUploaderProps {
    onUpload?: (files: File[]) => void;
    maxFiles?: number;
    acceptedTypes?: string[];
    className?: string;
}

/**
 * Document Uploader
 * Drag-and-drop file upload with progress
 */
export function DocumentUploader({
    onUpload,
    maxFiles = 10,
    acceptedTypes = ['.pdf', '.xlsx', '.xls', '.csv', '.png', '.jpg'],
    className = '',
}: DocumentUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [files, setFiles] = useState<{ file: File; progress: number; status: 'uploading' | 'complete' | 'error' }[]>([]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const droppedFiles = Array.from(e.dataTransfer.files).slice(0, maxFiles);
        processFiles(droppedFiles);
    }, [maxFiles]);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []).slice(0, maxFiles);
        processFiles(selectedFiles);
    }, [maxFiles]);

    const processFiles = async (newFiles: File[]) => {
        const fileEntries = newFiles.map(file => ({ file, progress: 0, status: 'uploading' as const }));
        setFiles(prev => [...prev, ...fileEntries]);

        // Simulate upload progress
        for (let i = 0; i < newFiles.length; i++) {
            const fileIndex = files.length + i;
            for (let p = 0; p <= 100; p += Math.random() * 30) {
                await new Promise(r => setTimeout(r, 100));
                setFiles(prev => prev.map((f, idx) =>
                    idx === fileIndex ? { ...f, progress: Math.min(100, p) } : f
                ));
            }
            setFiles(prev => prev.map((f, idx) =>
                idx === fileIndex ? { ...f, progress: 100, status: 'complete' } : f
            ));
        }

        onUpload?.(newFiles);
    };

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card overflow-hidden ${className}`}
        >
            {/* Drop Zone */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
          relative p-8 border-2 border-dashed rounded-xl m-5 transition-all cursor-pointer
          ${isDragging
                        ? 'border-cyan-500 bg-cyan-500/10'
                        : 'border-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.2)]'
                    }
        `}
            >
                <input
                    type="file"
                    multiple
                    accept={acceptedTypes.join(',')}
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className="text-center">
                    <div className={`w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center transition-colors ${isDragging ? 'bg-cyan-500/20 text-cyan-400' : 'bg-[rgba(255,255,255,0.04)] text-[#64748B]'
                        }`}>
                        <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-medium text-white mb-1">
                        Drop files here or click to upload
                    </p>
                    <p className="text-xs text-[#64748B]">
                        Supports: PDF, Excel, CSV, Images (max {maxFiles} files)
                    </p>
                </div>
            </div>

            {/* File List */}
            {files.length > 0 && (
                <div className="px-5 pb-5 space-y-2">
                    <AnimatePresence>
                        {files.map((fileEntry, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="flex items-center gap-3 p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]"
                            >
                                <div className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.04)] flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-cyan-400" />
                                </div>

                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-white truncate">{fileEntry.file.name}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-[10px] text-[#64748B]">
                                            {(fileEntry.file.size / 1024).toFixed(1)} KB
                                        </p>
                                        {fileEntry.status === 'uploading' && (
                                            <div className="flex-1 h-1 rounded-full bg-[rgba(255,255,255,0.1)] overflow-hidden max-w-[100px]">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${fileEntry.progress}%` }}
                                                    className="h-full bg-cyan-400 rounded-full"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center gap-1">
                                    {fileEntry.status === 'complete' && (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                    )}
                                    {fileEntry.status === 'error' && (
                                        <AlertCircle className="w-4 h-4 text-red-400" />
                                    )}
                                    <button
                                        onClick={() => removeFile(index)}
                                        className="p-1 rounded-md hover:bg-[rgba(255,255,255,0.06)] text-[#64748B] hover:text-white transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </motion.div>
    );
}

/**
 * Document Library
 * Browse and manage uploaded documents
 */
interface DocumentLibraryProps {
    documents: Document[];
    onView?: (doc: Document) => void;
    onDownload?: (doc: Document) => void;
    onDelete?: (doc: Document) => void;
    className?: string;
}

export function DocumentLibrary({
    documents,
    onView,
    onDownload,
    onDelete,
    className = '',
}: DocumentLibraryProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState<string>('all');

    const categories = [
        { id: 'all', label: 'All' },
        { id: 'aca_filing', label: 'ACA Filings' },
        { id: 'carrier_document', label: 'Carrier Docs' },
        { id: 'employee_record', label: 'Employee Records' },
        { id: 'audit', label: 'Audit' },
    ];

    const getTypeIcon = (type: Document['type']) => {
        switch (type) {
            case 'pdf': return <FileText className="w-5 h-5 text-red-400" />;
            case 'excel': return <FileSpreadsheet className="w-5 h-5 text-emerald-400" />;
            case 'image': return <Image className="w-5 h-5 text-purple-400" />;
            default: return <FileText className="w-5 h-5 text-[#64748B]" />;
        }
    };

    const getStatusBadge = (status: Document['status']) => {
        const configs = {
            processing: { bg: 'bg-amber-500/10', text: 'text-amber-400', label: 'Processing' },
            classified: { bg: 'bg-cyan-500/10', text: 'text-cyan-400', label: 'Classified' },
            verified: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', label: 'Verified' },
            error: { bg: 'bg-red-500/10', text: 'text-red-400', label: 'Error' },
        };
        const config = configs[status];
        return (
            <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase rounded ${config.bg} ${config.text}`}>
                {config.label}
            </span>
        );
    };

    const filteredDocs = documents.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === 'all' || doc.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card overflow-hidden ${className}`}
        >
            {/* Header */}
            <div className="p-5 border-b border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-violet-500/20 flex items-center justify-center">
                            <FolderOpen className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                                Document Library
                            </h2>
                            <p className="text-xs text-[#64748B]">{documents.length} documents</p>
                        </div>
                    </div>
                </div>

                {/* Search & Filter */}
                <div className="flex gap-3">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search documents..."
                            className="w-full pl-10 pr-4 py-2 text-sm text-white bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-lg focus:outline-none focus:border-cyan-500/50"
                        />
                    </div>
                    <div className="flex gap-1">
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setFilterCategory(cat.id)}
                                className={`px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${filterCategory === cat.id
                                        ? 'bg-cyan-500/20 text-cyan-400'
                                        : 'text-[#94A3B8] hover:bg-[rgba(255,255,255,0.04)] hover:text-white'
                                    }`}
                            >
                                {cat.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Document List */}
            <div className="divide-y divide-[rgba(255,255,255,0.04)]">
                {filteredDocs.map((doc, index) => (
                    <motion.div
                        key={doc.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.02 }}
                        className="p-4 hover:bg-[rgba(255,255,255,0.02)] transition-colors group"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.04)] flex items-center justify-center">
                                {getTypeIcon(doc.type)}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <p className="text-sm font-medium text-white truncate">{doc.name}</p>
                                    {getStatusBadge(doc.status)}
                                </div>
                                <div className="flex items-center gap-3 text-[10px] text-[#64748B]">
                                    <span className="flex items-center gap-1">
                                        <User className="w-3 h-3" />
                                        {doc.uploadedBy}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {doc.uploadedAt}
                                    </span>
                                    <span>{doc.size}</span>
                                </div>
                                {doc.tags && doc.tags.length > 0 && (
                                    <div className="flex gap-1 mt-1">
                                        {doc.tags.map(tag => (
                                            <span key={tag} className="px-1.5 py-0.5 text-[9px] bg-[rgba(255,255,255,0.04)] text-[#94A3B8] rounded">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => onView?.(doc)}
                                    className="p-2 rounded-md hover:bg-[rgba(255,255,255,0.06)] text-[#64748B] hover:text-white transition-colors"
                                >
                                    <Eye className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => onDownload?.(doc)}
                                    className="p-2 rounded-md hover:bg-[rgba(255,255,255,0.06)] text-[#64748B] hover:text-white transition-colors"
                                >
                                    <Download className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => onDelete?.(doc)}
                                    className="p-2 rounded-md hover:bg-red-500/10 text-[#64748B] hover:text-red-400 transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}

                {filteredDocs.length === 0 && (
                    <div className="p-12 text-center">
                        <FolderOpen className="w-12 h-12 text-[#64748B] mx-auto mb-4" />
                        <p className="text-sm text-[#94A3B8]">No documents found</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

export default DocumentUploader;
