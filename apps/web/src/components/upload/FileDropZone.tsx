'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

interface FileDropZoneProps {
    onFiles: (files: File[]) => Promise<void> | void;
    accept?: string[];
    maxSize?: number; // bytes
    maxFiles?: number;
    className?: string;
}

interface FileWithStatus {
    file: File;
    status: 'pending' | 'uploading' | 'success' | 'error';
    progress?: number;
    error?: string;
}

export function FileDropZone({
    onFiles,
    accept = ['*'],
    maxSize = 10 * 1024 * 1024, // 10MB default
    maxFiles = 10,
    className = ''
}: FileDropZoneProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [files, setFiles] = useState<FileWithStatus[]>([]);
    const inputRef = useRef<HTMLInputElement>(null);

    const validateFile = (file: File): string | null => {
        if (file.size > maxSize) {
            return `File too large (max ${(maxSize / 1024 / 1024).toFixed(0)}MB)`;
        }
        if (accept[0] !== '*') {
            const ext = file.name.split('.').pop()?.toLowerCase();
            if (!ext || !accept.some(a => a.replace('.', '').toLowerCase() === ext)) {
                return `Invalid file type (accepted: ${accept.join(', ')})`;
            }
        }
        return null;
    };

    const handleFiles = useCallback(async (newFiles: FileList | File[]) => {
        const fileArray = Array.from(newFiles).slice(0, maxFiles);

        const filesWithStatus: FileWithStatus[] = fileArray.map(file => {
            const error = validateFile(file);
            return {
                file,
                status: error ? 'error' : 'pending',
                error,
            } as FileWithStatus;
        });

        setFiles(prev => [...prev, ...filesWithStatus]);

        const validFiles = filesWithStatus.filter(f => f.status === 'pending').map(f => f.file);
        if (validFiles.length > 0) {
            await onFiles(validFiles);
            setFiles(prev => prev.map(f =>
                f.status === 'pending' ? { ...f, status: 'success' } : f
            ));
        }
    }, [maxFiles, onFiles]);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files.length > 0) {
            handleFiles(e.dataTransfer.files);
        }
    }, [handleFiles]);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback(() => {
        setIsDragging(false);
    }, []);

    const removeFile = (index: number) => {
        setFiles(prev => prev.filter((_, i) => i !== index));
    };

    const formatFileSize = (bytes: number) => {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / 1024 / 1024).toFixed(1)} MB`;
    };

    return (
        <div className={className}>
            {/* Drop Zone */}
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => inputRef.current?.click()}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${isDragging
                        ? 'border-[var(--color-synapse-teal)] bg-[rgba(20,184,166,0.1)]'
                        : 'border-[var(--glass-border)] hover:border-[var(--glass-border-hover)] bg-[var(--glass-bg)]'
                    }`}
            >
                <input
                    ref={inputRef}
                    type="file"
                    multiple
                    accept={accept.join(',')}
                    onChange={(e) => e.target.files && handleFiles(e.target.files)}
                    className="hidden"
                />

                <motion.div
                    animate={{ scale: isDragging ? 1.1 : 1 }}
                    className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-synapse-teal)]/20 to-[var(--color-synapse-cyan)]/20 flex items-center justify-center mx-auto mb-4"
                >
                    <Upload className={`w-6 h-6 ${isDragging ? 'text-[var(--color-synapse-teal)]' : 'text-[var(--color-steel)]'}`} />
                </motion.div>

                <p className="text-sm font-medium text-white mb-1">
                    {isDragging ? 'Drop files here' : 'Drag & drop files or click to browse'}
                </p>
                <p className="text-xs text-[var(--color-steel)]">
                    {accept[0] === '*' ? 'All file types' : accept.join(', ')} • Max {(maxSize / 1024 / 1024).toFixed(0)}MB
                </p>
            </div>

            {/* File List */}
            <AnimatePresence>
                {files.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-4 space-y-2"
                    >
                        {files.map((f, i) => (
                            <motion.div
                                key={`${f.file.name}-${i}`}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                className="flex items-center gap-3 p-3 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)]"
                            >
                                <FileText className="w-5 h-5 text-[var(--color-steel)]" />
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm text-white truncate">{f.file.name}</p>
                                    <p className="text-xs text-[var(--color-steel)]">{formatFileSize(f.file.size)}</p>
                                </div>
                                {f.status === 'uploading' && (
                                    <Loader2 className="w-4 h-4 text-[var(--color-synapse-teal)] animate-spin" />
                                )}
                                {f.status === 'success' && (
                                    <CheckCircle2 className="w-4 h-4 text-[var(--color-success)]" />
                                )}
                                {f.status === 'error' && (
                                    <div className="flex items-center gap-2">
                                        <AlertCircle className="w-4 h-4 text-[var(--color-critical)]" />
                                        <span className="text-xs text-[var(--color-critical)]">{f.error}</span>
                                    </div>
                                )}
                                <button
                                    onClick={(e) => { e.stopPropagation(); removeFile(i); }}
                                    className="p-1 rounded hover:bg-[var(--glass-bg-light)]"
                                >
                                    <X className="w-4 h-4 text-[var(--color-steel)]" />
                                </button>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default FileDropZone;
