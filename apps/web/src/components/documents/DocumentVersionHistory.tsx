'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    History,
    User,
    Clock,
    FileText,
    Download,
    RotateCcw,
    Eye,
    GitBranch,
    ChevronDown,
    ChevronUp,
    ArrowRight,
    Check,
    X,
    Plus,
    Minus,
    AlertTriangle
} from 'lucide-react';

interface DocumentVersionHistoryProps {
    className?: string;
    documentId?: string;
    documentName?: string;
}

interface Version {
    id: string;
    versionNumber: number;
    createdAt: string;
    createdBy: string;
    size: number;
    changesSummary: string;
    isCurrentVersion: boolean;
    additions?: number;
    deletions?: number;
    status: 'current' | 'previous' | 'archived';
}

const mockVersions: Version[] = [
    {
        id: 'v5',
        versionNumber: 5,
        createdAt: '2026-01-28 14:32',
        createdBy: 'Sarah Chen',
        size: 2450000,
        changesSummary: 'Updated employee census with Q1 new hires',
        isCurrentVersion: true,
        additions: 142,
        deletions: 8,
        status: 'current'
    },
    {
        id: 'v4',
        versionNumber: 4,
        createdAt: '2026-01-25 09:15',
        createdBy: 'Mike Johnson',
        size: 2380000,
        changesSummary: 'Corrected FTE calculations for part-time employees',
        isCurrentVersion: false,
        additions: 23,
        deletions: 23,
        status: 'previous'
    },
    {
        id: 'v3',
        versionNumber: 3,
        createdAt: '2026-01-20 16:48',
        createdBy: 'Sarah Chen',
        size: 2350000,
        changesSummary: 'Added new coverage codes for 2026 plan year',
        isCurrentVersion: false,
        additions: 56,
        deletions: 0,
        status: 'previous'
    },
    {
        id: 'v2',
        versionNumber: 2,
        createdAt: '2026-01-15 11:22',
        createdBy: 'Emily Davis',
        size: 2290000,
        changesSummary: 'Fixed missing SSN for terminated employees',
        isCurrentVersion: false,
        additions: 0,
        deletions: 12,
        status: 'archived'
    },
    {
        id: 'v1',
        versionNumber: 1,
        createdAt: '2026-01-10 08:00',
        createdBy: 'System Import',
        size: 2300000,
        changesSummary: 'Initial import from HRIS system',
        isCurrentVersion: false,
        additions: 4256,
        deletions: 0,
        status: 'archived'
    }
];

function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getStatusColor(status: string) {
    switch (status) {
        case 'current': return 'bg-[var(--color-success)] text-black';
        case 'previous': return 'bg-[var(--color-synapse-teal-muted)] text-[var(--color-synapse-teal)]';
        case 'archived': return 'bg-[rgba(255,255,255,0.05)] text-[var(--color-steel)]';
        default: return 'bg-[rgba(255,255,255,0.05)] text-[var(--color-steel)]';
    }
}

export function DocumentVersionHistory({ className = '', documentName = 'employee_census_jan2026.csv' }: DocumentVersionHistoryProps) {
    const [expandedVersion, setExpandedVersion] = useState<string | null>(null);
    const [compareMode, setCompareMode] = useState(false);
    const [selectedVersions, setSelectedVersions] = useState<string[]>([]);
    const [showRestoreConfirm, setShowRestoreConfirm] = useState<string | null>(null);

    const toggleExpand = (id: string) => {
        setExpandedVersion(prev => prev === id ? null : id);
    };

    const toggleVersionSelect = (id: string) => {
        setSelectedVersions(prev => {
            if (prev.includes(id)) {
                return prev.filter(v => v !== id);
            }
            if (prev.length < 2) {
                return [...prev, id];
            }
            return [prev[1], id];
        });
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
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--color-synapse-cyan)] to-[var(--color-synapse-teal)] flex items-center justify-center">
                            <History className="w-5 h-5 text-black" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">Version History</h2>
                            <p className="text-xs text-[var(--color-steel)]">{documentName}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setCompareMode(!compareMode);
                            setSelectedVersions([]);
                        }}
                        className={`flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${compareMode
                            ? 'bg-[var(--color-synapse-teal)] text-black'
                            : 'bg-[rgba(255,255,255,0.05)] text-[var(--color-silver)] hover:bg-[rgba(255,255,255,0.1)]'
                            }`}
                    >
                        <GitBranch className="w-4 h-4" />
                        {compareMode ? 'Exit Compare' : 'Compare Versions'}
                    </button>
                </div>

                {/* Compare Mode Info */}
                <AnimatePresence>
                    {compareMode && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="p-3 bg-[var(--color-synapse-teal-muted)] rounded-lg border border-[rgba(6,182,212,0.2)]">
                                <p className="text-sm text-[var(--color-synapse-teal)]">
                                    Select 2 versions to compare • {selectedVersions.length}/2 selected
                                </p>
                                {selectedVersions.length === 2 && (
                                    <button className="mt-2 btn-primary text-sm py-1.5">
                                        <Eye className="w-4 h-4 mr-1.5" />
                                        View Comparison
                                    </button>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Version Timeline */}
            <div className="p-5">
                <div className="relative">
                    {/* Timeline Line */}
                    <div className="absolute left-[19px] top-6 bottom-6 w-0.5 bg-[var(--glass-border)]" />

                    {/* Version Items */}
                    <div className="space-y-4">
                        {mockVersions.map((version, index) => (
                            <motion.div
                                key={version.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className="relative"
                            >
                                {/* Timeline Dot */}
                                <div className={`absolute left-0 top-4 w-10 h-10 rounded-full flex items-center justify-center z-10 ${version.isCurrentVersion
                                    ? 'bg-[var(--color-synapse-teal)]'
                                    : 'bg-[var(--color-obsidian-surface)] border border-[var(--glass-border)]'
                                    }`}>
                                    {compareMode ? (
                                        <input
                                            type="checkbox"
                                            checked={selectedVersions.includes(version.id)}
                                            onChange={() => toggleVersionSelect(version.id)}
                                            className="w-4 h-4 rounded border-[var(--glass-border)] bg-transparent cursor-pointer"
                                        />
                                    ) : (
                                        <span className={`text-xs font-bold ${version.isCurrentVersion ? 'text-black' : 'text-[var(--color-steel)]'}`}>
                                            v{version.versionNumber}
                                        </span>
                                    )}
                                </div>

                                {/* Version Card */}
                                <div className="ml-14">
                                    <div
                                        className={`p-4 rounded-lg border transition-all cursor-pointer ${expandedVersion === version.id
                                            ? 'bg-[rgba(255,255,255,0.05)] border-[var(--color-synapse-teal)]'
                                            : 'bg-[rgba(255,255,255,0.02)] border-[var(--glass-border)] hover:bg-[rgba(255,255,255,0.04)]'
                                            }`}
                                        onClick={() => toggleExpand(version.id)}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${getStatusColor(version.status)}`}>
                                                        {version.status === 'current' ? 'Current' : version.status === 'previous' ? 'Previous' : 'Archived'}
                                                    </span>
                                                    <span className="text-xs text-[var(--color-steel)]">
                                                        {formatFileSize(version.size)}
                                                    </span>
                                                </div>
                                                <p className="text-sm font-medium text-white mb-2">
                                                    {version.changesSummary}
                                                </p>
                                                <div className="flex items-center gap-4 text-xs text-[var(--color-steel)]">
                                                    <span className="flex items-center gap-1">
                                                        <User className="w-3.5 h-3.5" />
                                                        {version.createdBy}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-3.5 h-3.5" />
                                                        {version.createdAt}
                                                    </span>
                                                    {version.additions !== undefined && version.additions > 0 && (
                                                        <span className="flex items-center gap-1 text-[var(--color-success)]">
                                                            <Plus className="w-3.5 h-3.5" />
                                                            {version.additions}
                                                        </span>
                                                    )}
                                                    {version.deletions !== undefined && version.deletions > 0 && (
                                                        <span className="flex items-center gap-1 text-[var(--color-critical)]">
                                                            <Minus className="w-3.5 h-3.5" />
                                                            {version.deletions}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <button className="p-1 text-[var(--color-steel)]">
                                                {expandedVersion === version.id ? (
                                                    <ChevronUp className="w-4 h-4" />
                                                ) : (
                                                    <ChevronDown className="w-4 h-4" />
                                                )}
                                            </button>
                                        </div>

                                        {/* Expanded Actions */}
                                        <AnimatePresence>
                                            {expandedVersion === version.id && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="mt-4 pt-4 border-t border-[var(--glass-border)] flex items-center gap-2">
                                                        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[rgba(255,255,255,0.05)] rounded-lg hover:bg-[rgba(255,255,255,0.1)] transition-colors">
                                                            <Eye className="w-3.5 h-3.5" />
                                                            Preview
                                                        </button>
                                                        <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-[rgba(255,255,255,0.05)] rounded-lg hover:bg-[rgba(255,255,255,0.1)] transition-colors">
                                                            <Download className="w-3.5 h-3.5" />
                                                            Download
                                                        </button>
                                                        {!version.isCurrentVersion && (
                                                            <>
                                                                {showRestoreConfirm === version.id ? (
                                                                    <div className="flex items-center gap-2 ml-2">
                                                                        <span className="text-xs text-[var(--color-synapse-amber)]">
                                                                            <AlertTriangle className="w-3.5 h-3.5 inline mr-1" />
                                                                            Restore this version?
                                                                        </span>
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                setShowRestoreConfirm(null);
                                                                            }}
                                                                            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-[var(--color-success)] bg-[rgba(16,185,129,0.1)] rounded hover:bg-[rgba(16,185,129,0.2)] transition-colors"
                                                                        >
                                                                            <Check className="w-3 h-3" />
                                                                            Confirm
                                                                        </button>
                                                                        <button
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                setShowRestoreConfirm(null);
                                                                            }}
                                                                            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-[var(--color-steel)] hover:text-white transition-colors"
                                                                        >
                                                                            <X className="w-3 h-3" />
                                                                            Cancel
                                                                        </button>
                                                                    </div>
                                                                ) : (
                                                                    <button
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            setShowRestoreConfirm(version.id);
                                                                        }}
                                                                        className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[var(--color-synapse-amber)] bg-[rgba(245,158,11,0.1)] rounded-lg hover:bg-[rgba(245,158,11,0.15)] transition-colors"
                                                                    >
                                                                        <RotateCcw className="w-3.5 h-3.5" />
                                                                        Restore
                                                                    </button>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-[var(--glass-border)] flex items-center justify-between text-xs text-[var(--color-steel)]">
                <span>{mockVersions.length} versions total</span>
                <span>Retention: 7 years</span>
            </div>
        </motion.div>
    );
}

export default DocumentVersionHistory;
