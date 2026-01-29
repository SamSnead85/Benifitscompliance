'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Package,
    Download,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    FileText,
    Users,
    Clock,
    Eye,
    Send,
    RefreshCw,
    ChevronDown,
    ChevronUp,
    Filter,
    Search,
    BarChart3,
    PieChart,
    ArrowDown
} from 'lucide-react';

interface BulkUploadReviewProps {
    className?: string;
}

interface UploadBatch {
    id: string;
    fileName: string;
    uploadedAt: string;
    status: 'pending_review' | 'approved' | 'processing' | 'completed' | 'rejected';
    totalRecords: number;
    validRecords: number;
    warningRecords: number;
    errorRecords: number;
    uploadedBy: string;
}

interface ValidationIssue {
    row: number;
    field: string;
    value: string;
    issue: string;
    severity: 'error' | 'warning';
    suggestion: string;
}

const mockBatches: UploadBatch[] = [
    {
        id: 'ub1',
        fileName: 'employee_census_january_2026.csv',
        uploadedAt: '2026-01-29 11:45 AM',
        status: 'pending_review',
        totalRecords: 892,
        validRecords: 865,
        warningRecords: 19,
        errorRecords: 8,
        uploadedBy: 'HR System Integration'
    },
    {
        id: 'ub2',
        fileName: 'coverage_updates_batch_042.xlsx',
        uploadedAt: '2026-01-28 04:30 PM',
        status: 'approved',
        totalRecords: 156,
        validRecords: 156,
        warningRecords: 0,
        errorRecords: 0,
        uploadedBy: 'Sarah Johnson'
    },
    {
        id: 'ub3',
        fileName: 'terminations_q1_2026.csv',
        uploadedAt: '2026-01-28 09:15 AM',
        status: 'completed',
        totalRecords: 45,
        validRecords: 45,
        warningRecords: 0,
        errorRecords: 0,
        uploadedBy: 'Michael Chen'
    },
];

const mockIssues: ValidationIssue[] = [
    { row: 45, field: 'SSN', value: '123-45', issue: 'Invalid SSN format', severity: 'error', suggestion: 'Format: XXX-XX-XXXX' },
    { row: 89, field: 'HireDate', value: '2026-13-01', issue: 'Invalid date', severity: 'error', suggestion: 'Month must be 01-12' },
    { row: 156, field: 'Email', value: 'john.smith@', issue: 'Incomplete email', severity: 'error', suggestion: 'Add domain (e.g., @company.com)' },
    { row: 234, field: 'DOB', value: '1985-06-15', issue: 'Employee may be under-age dependent', severity: 'warning', suggestion: 'Verify employment eligibility' },
    { row: 312, field: 'Zip', value: '1234', issue: 'Zip code should be 5 digits', severity: 'warning', suggestion: 'Add leading zero: 01234' },
    { row: 445, field: 'State', value: 'California', issue: 'Use 2-letter state code', severity: 'warning', suggestion: 'Use: CA' },
    { row: 567, field: 'Phone', value: '555-1234', issue: 'Phone missing area code', severity: 'warning', suggestion: 'Format: XXX-XXX-XXXX' },
    { row: 702, field: 'SSN', value: '000-00-0000', issue: 'Invalid SSN (all zeros)', severity: 'error', suggestion: 'SSN cannot be all zeros' },
];

export function BulkUploadReview({ className = '' }: BulkUploadReviewProps) {
    const [selectedBatch, setSelectedBatch] = useState<string | null>('ub1');
    const [expandedRows, setExpandedRows] = useState<number[]>([]);
    const [issueFilter, setIssueFilter] = useState<'all' | 'error' | 'warning'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const activeBatch = mockBatches.find(b => b.id === selectedBatch);
    const filteredIssues = mockIssues.filter(issue => {
        const matchesFilter = issueFilter === 'all' || issue.severity === issueFilter;
        const matchesSearch = issue.field.toLowerCase().includes(searchQuery.toLowerCase()) ||
            issue.issue.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const toggleRow = (row: number) => {
        setExpandedRows(prev =>
            prev.includes(row) ? prev.filter(r => r !== row) : [...prev, row]
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`space-y-6 ${className}`}
        >
            {/* Header */}
            <div className="glass-card p-5">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--color-synapse-emerald)] to-[var(--color-success)] flex items-center justify-center">
                            <Package className="w-5 h-5 text-black" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">Bulk Upload Review</h2>
                            <p className="text-xs text-[var(--color-steel)]">Validate and approve batch data imports</p>
                        </div>
                    </div>
                    <button className="btn-secondary flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download Template
                    </button>
                </div>

                {/* Batch Selector */}
                <div className="flex gap-3 overflow-x-auto pb-2">
                    {mockBatches.map(batch => (
                        <button
                            key={batch.id}
                            onClick={() => setSelectedBatch(batch.id)}
                            className={`flex-none p-4 rounded-lg border transition-all min-w-[280px] text-left ${selectedBatch === batch.id
                                ? 'bg-[var(--color-synapse-teal-muted)] border-[var(--color-synapse-teal)]'
                                : 'bg-[rgba(255,255,255,0.02)] border-[var(--glass-border)] hover:border-[var(--glass-border-hover)]'
                                }`}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-[var(--color-synapse-teal)]" />
                                    <span className="text-sm font-medium text-white truncate max-w-[180px]">{batch.fileName}</span>
                                </div>
                                <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${batch.status === 'pending_review'
                                    ? 'bg-[rgba(245,158,11,0.1)] text-[var(--color-warning)]'
                                    : batch.status === 'approved'
                                        ? 'bg-[rgba(6,182,212,0.1)] text-[var(--color-synapse-teal)]'
                                        : batch.status === 'completed'
                                            ? 'bg-[rgba(16,185,129,0.1)] text-[var(--color-success)]'
                                            : 'bg-[rgba(255,255,255,0.05)] text-[var(--color-steel)]'
                                    }`}>
                                    {batch.status.replace('_', ' ')}
                                </span>
                            </div>
                            <div className="flex items-center gap-4 text-xs text-[var(--color-steel)]">
                                <span>{batch.totalRecords} records</span>
                                {batch.errorRecords > 0 && (
                                    <span className="text-[var(--color-critical)]">{batch.errorRecords} errors</span>
                                )}
                                {batch.warningRecords > 0 && (
                                    <span className="text-[var(--color-warning)]">{batch.warningRecords} warnings</span>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            {activeBatch && (
                <div className="grid grid-cols-3 gap-6">
                    {/* Stats Panel */}
                    <div className="space-y-4">
                        <div className="glass-card p-5">
                            <h3 className="font-semibold text-white mb-4">Validation Summary</h3>

                            {/* Doughnut-style summary */}
                            <div className="relative w-32 h-32 mx-auto mb-4">
                                <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                                    <path
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="rgba(255,255,255,0.1)"
                                        strokeWidth="2"
                                    />
                                    <path
                                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                        fill="none"
                                        stroke="var(--color-success)"
                                        strokeWidth="2"
                                        strokeDasharray={`${(activeBatch.validRecords / activeBatch.totalRecords) * 100}, 100`}
                                    />
                                </svg>
                                <div className="absolute inset-0 flex flex-col items-center justify-center">
                                    <span className="text-2xl font-bold text-white">
                                        {Math.round((activeBatch.validRecords / activeBatch.totalRecords) * 100)}%
                                    </span>
                                    <span className="text-xs text-[var(--color-steel)]">Valid</span>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center justify-between p-2 rounded bg-[rgba(16,185,129,0.05)]">
                                    <div className="flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-[var(--color-success)]" />
                                        <span className="text-sm text-[var(--color-silver)]">Valid Records</span>
                                    </div>
                                    <span className="font-bold text-[var(--color-success)]">{activeBatch.validRecords}</span>
                                </div>
                                <div className="flex items-center justify-between p-2 rounded bg-[rgba(245,158,11,0.05)]">
                                    <div className="flex items-center gap-2">
                                        <AlertTriangle className="w-4 h-4 text-[var(--color-warning)]" />
                                        <span className="text-sm text-[var(--color-silver)]">Warnings</span>
                                    </div>
                                    <span className="font-bold text-[var(--color-warning)]">{activeBatch.warningRecords}</span>
                                </div>
                                <div className="flex items-center justify-between p-2 rounded bg-[rgba(239,68,68,0.05)]">
                                    <div className="flex items-center gap-2">
                                        <XCircle className="w-4 h-4 text-[var(--color-critical)]" />
                                        <span className="text-sm text-[var(--color-silver)]">Errors</span>
                                    </div>
                                    <span className="font-bold text-[var(--color-critical)]">{activeBatch.errorRecords}</span>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="glass-card p-5">
                            <h3 className="font-semibold text-white mb-4">Actions</h3>
                            <div className="space-y-2">
                                <button className="w-full btn-primary flex items-center justify-center gap-2">
                                    <CheckCircle2 className="w-4 h-4" />
                                    Approve & Process
                                </button>
                                <button className="w-full btn-secondary flex items-center justify-center gap-2">
                                    <Eye className="w-4 h-4" />
                                    Preview All Data
                                </button>
                                <button className="w-full px-4 py-2 text-sm font-medium text-[var(--color-critical)] bg-[rgba(239,68,68,0.1)] rounded-lg hover:bg-[rgba(239,68,68,0.15)] transition-colors flex items-center justify-center gap-2">
                                    <XCircle className="w-4 h-4" />
                                    Reject Batch
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Issues Panel */}
                    <div className="col-span-2 glass-card">
                        <div className="p-4 border-b border-[var(--glass-border)]">
                            <div className="flex items-center justify-between">
                                <h3 className="font-semibold text-white">Validation Issues</h3>
                                <div className="flex items-center gap-3">
                                    <div className="relative">
                                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-steel)]" />
                                        <input
                                            type="text"
                                            placeholder="Search issues..."
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            className="pl-9 pr-4 py-1.5 bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-xs text-white placeholder:text-[var(--color-steel)] focus:outline-none focus:border-[var(--color-synapse-teal)] w-48"
                                        />
                                    </div>
                                    <div className="flex items-center gap-1">
                                        {(['all', 'error', 'warning'] as const).map(filter => (
                                            <button
                                                key={filter}
                                                onClick={() => setIssueFilter(filter)}
                                                className={`px-3 py-1.5 text-xs font-medium rounded capitalize transition-colors ${issueFilter === filter
                                                    ? 'bg-[var(--color-synapse-teal)] text-black'
                                                    : 'bg-[rgba(255,255,255,0.03)] text-[var(--color-silver)] hover:bg-[rgba(255,255,255,0.08)]'
                                                    }`}
                                            >
                                                {filter}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="max-h-[500px] overflow-y-auto">
                            {filteredIssues.map((issue, index) => (
                                <div
                                    key={index}
                                    className="border-b border-[var(--glass-border)] last:border-b-0"
                                >
                                    <button
                                        onClick={() => toggleRow(issue.row)}
                                        className="w-full p-4 flex items-center gap-4 hover:bg-[rgba(255,255,255,0.02)] transition-colors text-left"
                                    >
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${issue.severity === 'error'
                                            ? 'bg-[rgba(239,68,68,0.1)] text-[var(--color-critical)]'
                                            : 'bg-[rgba(245,158,11,0.1)] text-[var(--color-warning)]'
                                            }`}>
                                            {issue.severity === 'error' ? <XCircle className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs text-[var(--color-steel)]">Row {issue.row}</span>
                                                <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded bg-[var(--color-synapse-teal-muted)] text-[var(--color-synapse-teal)]">
                                                    {issue.field}
                                                </span>
                                            </div>
                                            <p className="text-sm font-medium text-white">{issue.issue}</p>
                                        </div>
                                        <div className="text-right mr-2">
                                            <p className="text-xs text-[var(--color-steel)]">Current Value</p>
                                            <p className="text-sm font-mono text-[var(--color-silver)]">{issue.value}</p>
                                        </div>
                                        {expandedRows.includes(issue.row) ? (
                                            <ChevronUp className="w-4 h-4 text-[var(--color-steel)]" />
                                        ) : (
                                            <ChevronDown className="w-4 h-4 text-[var(--color-steel)]" />
                                        )}
                                    </button>

                                    <AnimatePresence>
                                        {expandedRows.includes(issue.row) && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden"
                                            >
                                                <div className="px-4 pb-4">
                                                    <div className="p-4 rounded-lg bg-[rgba(6,182,212,0.05)] border border-[rgba(6,182,212,0.2)]">
                                                        <p className="text-xs text-[var(--color-synapse-teal)] mb-2">Suggestion</p>
                                                        <p className="text-sm text-[var(--color-silver)]">{issue.suggestion}</p>
                                                        <div className="mt-3 flex gap-2">
                                                            <button className="text-xs px-3 py-1.5 rounded bg-[var(--color-synapse-teal)] text-black font-medium hover:opacity-90 transition-opacity">
                                                                Apply Fix
                                                            </button>
                                                            <button className="text-xs px-3 py-1.5 rounded bg-[rgba(255,255,255,0.05)] text-[var(--color-silver)] font-medium hover:bg-[rgba(255,255,255,0.1)] transition-colors">
                                                                Ignore
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>

                        {filteredIssues.length === 0 && (
                            <div className="p-12 text-center">
                                <CheckCircle2 className="w-12 h-12 mx-auto mb-4 text-[var(--color-success)]" />
                                <p className="text-[var(--color-silver)]">No issues found matching your criteria</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </motion.div>
    );
}

export default BulkUploadReview;
