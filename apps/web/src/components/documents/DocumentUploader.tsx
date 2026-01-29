'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Upload,
    FileText,
    X,
    CheckCircle2,
    AlertTriangle,
    Loader2,
    File,
    FileSpreadsheet,
    FilePlus
} from 'lucide-react';

interface UploadedFile {
    id: string;
    name: string;
    size: number;
    type: string;
    status: 'uploading' | 'processing' | 'success' | 'error';
    progress: number;
    error?: string;
    recordsFound?: number;
}

interface DocumentUploaderProps {
    className?: string;
    acceptedTypes?: string[];
    maxSizeMB?: number;
    onUploadComplete?: (files: UploadedFile[]) => void;
}

const defaultAcceptedTypes = ['.csv', '.xlsx', '.xls', '.txt'];

export function DocumentUploader({
    className = '',
    acceptedTypes = defaultAcceptedTypes,
    maxSizeMB = 50,
    onUploadComplete
}: DocumentUploaderProps) {
    const [files, setFiles] = useState<UploadedFile[]>([]);
    const [isDragging, setIsDragging] = useState(false);

    const simulateUpload = useCallback(async (file: File) => {
        const uploadedFile: UploadedFile = {
            id: `file-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: file.name,
            size: file.size,
            type: file.type,
            status: 'uploading',
            progress: 0
        };

        setFiles(prev => [...prev, uploadedFile]);

        // Simulate upload progress
        for (let i = 0; i <= 100; i += 10) {
            await new Promise(r => setTimeout(r, 100));
            setFiles(prev => prev.map(f =>
                f.id === uploadedFile.id ? { ...f, progress: i } : f
            ));
        }

        // Simulate processing
        setFiles(prev => prev.map(f =>
            f.id === uploadedFile.id ? { ...f, status: 'processing' } : f
        ));
        await new Promise(r => setTimeout(r, 1500));

        // Complete
        const recordsFound = Math.floor(Math.random() * 5000) + 500;
        setFiles(prev => prev.map(f =>
            f.id === uploadedFile.id
                ? { ...f, status: 'success', recordsFound }
                : f
        ));
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);

        const droppedFiles = Array.from(e.dataTransfer.files);
        droppedFiles.forEach(file => {
            if (file.size <= maxSizeMB * 1024 * 1024) {
                simulateUpload(file);
            }
        });
    }, [maxSizeMB, simulateUpload]);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = Array.from(e.target.files || []);
        selectedFiles.forEach(file => {
            if (file.size <= maxSizeMB * 1024 * 1024) {
                simulateUpload(file);
            }
        });
    }, [maxSizeMB, simulateUpload]);

    const removeFile = (id: string) => {
        setFiles(prev => prev.filter(f => f.id !== id));
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const getFileIcon = (name: string) => {
        if (name.endsWith('.csv') || name.endsWith('.xlsx') || name.endsWith('.xls')) {
            return FileSpreadsheet;
        }
        return FileText;
    };

    const successCount = files.filter(f => f.status === 'success').length;
    const totalRecords = files.filter(f => f.status === 'success').reduce((sum, f) => sum + (f.recordsFound || 0), 0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card overflow-hidden ${className}`}
        >
            {/* Header */}
            <div className="p-6 border-b border-[var(--glass-border)]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-synapse-teal)] to-[var(--color-synapse-cyan)] flex items-center justify-center">
                        <Upload className="w-5 h-5 text-black" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-white">Document Uploader</h2>
                        <p className="text-sm text-[var(--color-steel)]">Upload employee data, hours, or benefits files</p>
                    </div>
                </div>
            </div>

            <div className="p-6">
                {/* Drop Zone */}
                <div
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${isDragging
                            ? 'border-[var(--color-synapse-teal)] bg-[rgba(20,184,166,0.1)]'
                            : 'border-[var(--glass-border)] bg-[var(--glass-bg-light)]'
                        }`}
                >
                    <input
                        type="file"
                        multiple
                        accept={acceptedTypes.join(',')}
                        onChange={handleFileSelect}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <FilePlus className={`w-12 h-12 mx-auto mb-4 ${isDragging ? 'text-[var(--color-synapse-teal)]' : 'text-[var(--color-steel)]'
                        }`} />
                    <p className="text-white mb-2">
                        {isDragging ? 'Drop files here' : 'Drag and drop files here'}
                    </p>
                    <p className="text-sm text-[var(--color-steel)]">
                        or click to browse • {acceptedTypes.join(', ')} • Max {maxSizeMB}MB
                    </p>
                </div>

                {/* Uploaded Files */}
                {files.length > 0 && (
                    <div className="mt-6 space-y-3">
                        <div className="flex items-center justify-between">
                            <h3 className="font-medium text-white">Uploaded Files</h3>
                            {successCount > 0 && (
                                <span className="text-sm text-[var(--color-success)]">
                                    {successCount} files • {totalRecords.toLocaleString()} records
                                </span>
                            )}
                        </div>

                        <AnimatePresence>
                            {files.map((file) => {
                                const FileIcon = getFileIcon(file.name);
                                return (
                                    <motion.div
                                        key={file.id}
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${file.status === 'success'
                                                    ? 'bg-[rgba(34,197,94,0.2)]'
                                                    : file.status === 'error'
                                                        ? 'bg-[rgba(239,68,68,0.2)]'
                                                        : 'bg-[var(--glass-bg)]'
                                                }`}>
                                                {file.status === 'uploading' || file.status === 'processing' ? (
                                                    <Loader2 className="w-5 h-5 text-[var(--color-synapse-cyan)] animate-spin" />
                                                ) : file.status === 'success' ? (
                                                    <CheckCircle2 className="w-5 h-5 text-[var(--color-success)]" />
                                                ) : file.status === 'error' ? (
                                                    <AlertTriangle className="w-5 h-5 text-[var(--color-critical)]" />
                                                ) : (
                                                    <FileIcon className="w-5 h-5 text-[var(--color-steel)]" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm text-white truncate">{file.name}</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xs text-[var(--color-steel)]">
                                                        {formatFileSize(file.size)}
                                                    </span>
                                                    {file.status === 'uploading' && (
                                                        <span className="text-xs text-[var(--color-synapse-cyan)]">
                                                            Uploading {file.progress}%
                                                        </span>
                                                    )}
                                                    {file.status === 'processing' && (
                                                        <span className="text-xs text-[var(--color-synapse-gold)]">
                                                            Processing...
                                                        </span>
                                                    )}
                                                    {file.status === 'success' && file.recordsFound && (
                                                        <span className="text-xs text-[var(--color-success)]">
                                                            {file.recordsFound.toLocaleString()} records found
                                                        </span>
                                                    )}
                                                    {file.status === 'error' && (
                                                        <span className="text-xs text-[var(--color-critical)]">
                                                            {file.error || 'Upload failed'}
                                                        </span>
                                                    )}
                                                </div>
                                                {file.status === 'uploading' && (
                                                    <div className="mt-2 h-1 bg-[var(--glass-bg)] rounded-full overflow-hidden">
                                                        <motion.div
                                                            className="h-full bg-[var(--color-synapse-teal)]"
                                                            initial={{ width: 0 }}
                                                            animate={{ width: `${file.progress}%` }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => removeFile(file.id)}
                                                className="p-1 rounded hover:bg-[var(--glass-bg)] transition-colors"
                                            >
                                                <X className="w-4 h-4 text-[var(--color-steel)]" />
                                            </button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}

                {successCount > 0 && (
                    <div className="mt-6 flex items-center justify-end gap-3">
                        <button className="btn-secondary">
                            Preview Data
                        </button>
                        <button
                            onClick={() => onUploadComplete?.(files.filter(f => f.status === 'success'))}
                            className="btn-primary"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            Process {totalRecords.toLocaleString()} Records
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

export default DocumentUploader;
