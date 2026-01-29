'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Folder,
    FolderOpen,
    Download,
    Trash2,
    MoreVertical,
    Search,
    Grid,
    List,
    Filter,
    ChevronRight,
    File,
    FileSpreadsheet,
    FilePlus,
    Clock,
    User
} from 'lucide-react';

interface FileItem {
    id: string;
    name: string;
    type: 'file' | 'folder';
    fileType?: string;
    size?: number;
    modifiedAt: string;
    modifiedBy: string;
    children?: FileItem[];
}

interface FileBrowserProps {
    className?: string;
}

const mockFiles: FileItem[] = [
    {
        id: 'folder-1',
        name: '2025 Tax Year',
        type: 'folder',
        modifiedAt: 'Jan 15, 2026',
        modifiedBy: 'System',
        children: [
            { id: 'file-1', name: '1095-C_Batch_Jan2025.pdf', type: 'file', fileType: 'pdf', size: 45600000, modifiedAt: 'Jan 15, 2026', modifiedBy: 'System' },
            { id: 'file-2', name: '1094-C_Transmittal.pdf', type: 'file', fileType: 'pdf', size: 156000, modifiedAt: 'Jan 15, 2026', modifiedBy: 'System' },
        ]
    },
    {
        id: 'folder-2',
        name: 'Employee Imports',
        type: 'folder',
        modifiedAt: 'Jan 20, 2026',
        modifiedBy: 'Admin',
        children: []
    },
    {
        id: 'folder-3',
        name: 'Reports',
        type: 'folder',
        modifiedAt: 'Jan 22, 2026',
        modifiedBy: 'Admin',
        children: []
    },
    { id: 'file-3', name: 'compliance_summary_q4.xlsx', type: 'file', fileType: 'xlsx', size: 2450000, modifiedAt: 'Jan 18, 2026', modifiedBy: 'Admin' },
    { id: 'file-4', name: 'fte_analysis_2025.csv', type: 'file', fileType: 'csv', size: 890000, modifiedAt: 'Jan 12, 2026', modifiedBy: 'System' },
    { id: 'file-5', name: 'safe_harbor_audit.pdf', type: 'file', fileType: 'pdf', size: 1250000, modifiedAt: 'Jan 10, 2026', modifiedBy: 'Admin' },
];

export function FileBrowser({ className = '' }: FileBrowserProps) {
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPath, setCurrentPath] = useState<string[]>(['Documents']);
    const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
    const [selectedFile, setSelectedFile] = useState<string | null>(null);

    const toggleFolder = (id: string) => {
        setExpandedFolders(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const formatFileSize = (bytes?: number) => {
        if (!bytes) return '--';
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    };

    const getFileIcon = (fileType?: string) => {
        switch (fileType) {
            case 'xlsx':
            case 'xls':
            case 'csv':
                return FileSpreadsheet;
            case 'pdf':
                return FileText;
            default:
                return File;
        }
    };

    const filteredFiles = mockFiles.filter(file =>
        !searchQuery || file.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const renderFileItem = (file: FileItem, depth = 0) => {
        const isExpanded = expandedFolders.has(file.id);
        const isSelected = selectedFile === file.id;
        const FileIcon = file.type === 'folder'
            ? (isExpanded ? FolderOpen : Folder)
            : getFileIcon(file.fileType);

        return (
            <div key={file.id}>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    onClick={() => {
                        if (file.type === 'folder') {
                            toggleFolder(file.id);
                        } else {
                            setSelectedFile(file.id);
                        }
                    }}
                    className={`flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors ${isSelected
                            ? 'bg-[rgba(6,182,212,0.1)] border-l-2 border-[var(--color-synapse-cyan)]'
                            : 'hover:bg-[var(--glass-bg-light)]'
                        }`}
                    style={{ paddingLeft: `${16 + depth * 24}px` }}
                >
                    {file.type === 'folder' && (
                        <ChevronRight className={`w-4 h-4 text-[var(--color-steel)] transition-transform ${isExpanded ? 'rotate-90' : ''
                            }`} />
                    )}
                    {file.type === 'file' && <div className="w-4" />}

                    <FileIcon className={`w-5 h-5 ${file.type === 'folder'
                            ? 'text-[var(--color-synapse-gold)]'
                            : file.fileType === 'pdf'
                                ? 'text-[var(--color-critical)]'
                                : 'text-[var(--color-synapse-teal)]'
                        }`} />

                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-white truncate">{file.name}</p>
                    </div>

                    {viewMode === 'list' && (
                        <>
                            <span className="text-xs text-[var(--color-steel)] w-20 text-right">
                                {formatFileSize(file.size)}
                            </span>
                            <span className="text-xs text-[var(--color-steel)] w-28 text-right">
                                {file.modifiedAt}
                            </span>
                            <span className="text-xs text-[var(--color-steel)] w-20 text-right">
                                {file.modifiedBy}
                            </span>
                            <button className="p-1 rounded hover:bg-[var(--glass-bg)] opacity-0 group-hover:opacity-100">
                                <MoreVertical className="w-4 h-4 text-[var(--color-steel)]" />
                            </button>
                        </>
                    )}
                </motion.div>

                {file.type === 'folder' && isExpanded && file.children && (
                    <AnimatePresence>
                        {file.children.map(child => renderFileItem(child, depth + 1))}
                    </AnimatePresence>
                )}
            </div>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card overflow-hidden ${className}`}
        >
            {/* Header */}
            <div className="p-4 border-b border-[var(--glass-border)]">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-sm">
                        {currentPath.map((segment, i) => (
                            <div key={i} className="flex items-center gap-2">
                                {i > 0 && <ChevronRight className="w-4 h-4 text-[var(--color-steel)]" />}
                                <button className={`hover:text-white transition-colors ${i === currentPath.length - 1 ? 'text-white' : 'text-[var(--color-steel)]'
                                    }`}>
                                    {segment}
                                </button>
                            </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded ${viewMode === 'list' ? 'bg-[var(--glass-bg)]' : ''}`}
                        >
                            <List className={`w-4 h-4 ${viewMode === 'list' ? 'text-white' : 'text-[var(--color-steel)]'}`} />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded ${viewMode === 'grid' ? 'bg-[var(--glass-bg)]' : ''}`}
                        >
                            <Grid className={`w-4 h-4 ${viewMode === 'grid' ? 'text-white' : 'text-[var(--color-steel)]'}`} />
                        </button>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-steel)]" />
                        <input
                            type="text"
                            placeholder="Search files..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm text-white placeholder:text-[var(--color-steel)] focus:border-[var(--color-synapse-teal)] focus:outline-none"
                        />
                    </div>
                    <button className="btn-secondary">
                        <Filter className="w-4 h-4" />
                        Filter
                    </button>
                    <button className="btn-primary">
                        <FilePlus className="w-4 h-4" />
                        Upload
                    </button>
                </div>
            </div>

            {/* Table Header */}
            {viewMode === 'list' && (
                <div className="flex items-center gap-3 px-4 py-2 bg-[var(--glass-bg-light)] border-b border-[var(--glass-border)] text-xs font-medium text-[var(--color-steel)]">
                    <div className="w-4" />
                    <div className="w-5" />
                    <div className="flex-1">Name</div>
                    <div className="w-20 text-right">Size</div>
                    <div className="w-28 text-right">Modified</div>
                    <div className="w-20 text-right">By</div>
                    <div className="w-8" />
                </div>
            )}

            {/* File List */}
            <div className="max-h-[400px] overflow-y-auto">
                {viewMode === 'list' ? (
                    <div className="divide-y divide-[var(--glass-border)]">
                        {filteredFiles.map(file => renderFileItem(file))}
                    </div>
                ) : (
                    <div className="p-4 grid grid-cols-4 gap-4">
                        {filteredFiles.map(file => {
                            const FileIcon = file.type === 'folder' ? Folder : getFileIcon(file.fileType);
                            return (
                                <motion.div
                                    key={file.id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)] cursor-pointer hover:border-[var(--color-synapse-teal)] transition-colors text-center"
                                >
                                    <FileIcon className={`w-8 h-8 mx-auto mb-2 ${file.type === 'folder' ? 'text-[var(--color-synapse-gold)]' : 'text-[var(--color-synapse-teal)]'
                                        }`} />
                                    <p className="text-sm text-white truncate">{file.name}</p>
                                    <p className="text-xs text-[var(--color-steel)]">{file.modifiedAt}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-[var(--glass-border)] bg-[var(--glass-bg-light)] flex items-center justify-between text-xs text-[var(--color-steel)]">
                <span>{filteredFiles.length} items</span>
                {selectedFile && (
                    <div className="flex items-center gap-2">
                        <button className="flex items-center gap-1 hover:text-white">
                            <Download className="w-3 h-3" />
                            Download
                        </button>
                        <button className="flex items-center gap-1 hover:text-[var(--color-critical)]">
                            <Trash2 className="w-3 h-3" />
                            Delete
                        </button>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

export default FileBrowser;
