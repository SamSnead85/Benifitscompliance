'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileEdit,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    Search,
    Filter,
    ChevronDown,
    ChevronUp,
    ArrowRight,
    Save,
    Send,
    History,
    Eye,
    RefreshCw,
    User,
    Building2,
    Calendar,
    FileText,
    Zap,
    HelpCircle
} from 'lucide-react';

interface CorrectionWorkflowProps {
    className?: string;
}

interface CorrectionItem {
    id: string;
    employeeId: string;
    employeeName: string;
    ssn: string;
    originalCode: string;
    suggestedCode: string;
    field: string;
    reason: string;
    status: 'pending' | 'approved' | 'rejected' | 'submitted';
    month: number;
    severity: 'critical' | 'warning' | 'info';
}

const mockCorrections: CorrectionItem[] = [
    { id: 'c1', employeeId: 'E001', employeeName: 'John Smith', ssn: '***-**-1234', originalCode: '1H', suggestedCode: '1E', field: 'Line 14', reason: 'Employee was offered coverage but coded as no offer', month: 1, status: 'pending', severity: 'critical' },
    { id: 'c2', employeeId: 'E002', employeeName: 'Sarah Johnson', ssn: '***-**-5678', originalCode: '2C', suggestedCode: '2B', field: 'Line 16', reason: 'Incorrect safe harbor code applied', month: 1, status: 'pending', severity: 'warning' },
    { id: 'c3', employeeId: 'E003', employeeName: 'Michael Chen', ssn: '***-**-9012', originalCode: '1A', suggestedCode: '1B', field: 'Line 14', reason: 'Coverage MV/affordable but not offered to dependents', month: 3, status: 'approved', severity: 'info' },
    { id: 'c4', employeeId: 'E004', employeeName: 'Emily Davis', ssn: '***-**-3456', originalCode: '2G', suggestedCode: '2D', field: 'Line 16', reason: 'FPL safe harbor incorrectly applied', month: 2, status: 'pending', severity: 'critical' },
    { id: 'c5', employeeId: 'E005', employeeName: 'Robert Wilson', ssn: '***-**-7890', originalCode: '1H', suggestedCode: '1C', field: 'Line 14', reason: 'Terminated employee was offered COBRA', month: 6, status: 'submitted', severity: 'warning' },
];

const correctionCodes = {
    '1A': 'Qualifying Offer: MEC MV affordable to employee only',
    '1B': 'MEC MV affordable to employee; not offered to spouse/dependents',
    '1C': 'MEC MV affordable to employee; offered to dependents only',
    '1D': 'MEC MV not offered to employee; offered to spouse/dependents',
    '1E': 'MEC MV affordable to employee and dependents',
    '1F': 'MEC not MV offered to employee',
    '1G': 'Offer conditional upon employee coverage',
    '1H': 'No offer of coverage',
    '1I': 'Reserved',
    '2A': 'Employee not employed during the month',
    '2B': 'Employee not a FT employee',
    '2C': 'Employee enrolled in coverage offered',
    '2D': 'Employee in limited non-assessment period',
    '2F': 'W-2 safe harbor',
    '2G': 'FPL safe harbor',
    '2H': 'Rate of pay safe harbor',
};

function getSeverityStyle(severity: string) {
    switch (severity) {
        case 'critical': return { bg: 'bg-[rgba(239,68,68,0.1)]', text: 'text-[var(--color-critical)]', border: 'border-[rgba(239,68,68,0.3)]' };
        case 'warning': return { bg: 'bg-[rgba(245,158,11,0.1)]', text: 'text-[var(--color-warning)]', border: 'border-[rgba(245,158,11,0.3)]' };
        case 'info': return { bg: 'bg-[rgba(6,182,212,0.1)]', text: 'text-[var(--color-synapse-teal)]', border: 'border-[rgba(6,182,212,0.3)]' };
        default: return { bg: 'bg-[rgba(255,255,255,0.05)]', text: 'text-[var(--color-steel)]', border: 'border-[var(--glass-border)]' };
    }
}

function getStatusStyle(status: string) {
    switch (status) {
        case 'approved': return { bg: 'bg-[var(--color-success)]', text: 'text-black' };
        case 'rejected': return { bg: 'bg-[var(--color-critical)]', text: 'text-white' };
        case 'submitted': return { bg: 'bg-[var(--color-synapse-teal)]', text: 'text-black' };
        default: return { bg: 'bg-[rgba(255,255,255,0.1)]', text: 'text-[var(--color-silver)]' };
    }
}

export function CorrectionWorkflow({ className = '' }: CorrectionWorkflowProps) {
    const [corrections, setCorrections] = useState<CorrectionItem[]>(mockCorrections);
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [expandedItem, setExpandedItem] = useState<string | null>(null);
    const [showCodeHelp, setShowCodeHelp] = useState(false);

    const stats = {
        total: corrections.length,
        pending: corrections.filter(c => c.status === 'pending').length,
        approved: corrections.filter(c => c.status === 'approved').length,
        submitted: corrections.filter(c => c.status === 'submitted').length,
        critical: corrections.filter(c => c.severity === 'critical' && c.status === 'pending').length,
    };

    const filteredCorrections = corrections.filter(c => {
        const matchesSearch = c.employeeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const handleApprove = (id: string) => {
        setCorrections(prev => prev.map(c =>
            c.id === id ? { ...c, status: 'approved' } : c
        ));
    };

    const handleReject = (id: string) => {
        setCorrections(prev => prev.map(c =>
            c.id === id ? { ...c, status: 'rejected' } : c
        ));
    };

    const handleApproveAll = () => {
        setCorrections(prev => prev.map(c =>
            c.status === 'pending' ? { ...c, status: 'approved' } : c
        ));
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
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--color-synapse-amber)] to-[var(--color-synapse-coral)] flex items-center justify-center">
                            <FileEdit className="w-5 h-5 text-black" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">1095-C Correction Workflow</h2>
                            <p className="text-xs text-[var(--color-steel)]">Review and submit form corrections</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowCodeHelp(!showCodeHelp)}
                            className="btn-secondary flex items-center gap-2"
                        >
                            <HelpCircle className="w-4 h-4" />
                            Code Reference
                        </button>
                        {stats.pending > 0 && (
                            <button onClick={handleApproveAll} className="btn-primary flex items-center gap-2">
                                <CheckCircle2 className="w-4 h-4" />
                                Approve All ({stats.pending})
                            </button>
                        )}
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-5 gap-4">
                    <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)]">
                        <p className="text-xs text-[var(--color-steel)]">Total Corrections</p>
                        <p className="text-xl font-bold text-white">{stats.total}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[rgba(245,158,11,0.05)] border border-[rgba(245,158,11,0.2)]">
                        <p className="text-xs text-[var(--color-warning)]">Pending Review</p>
                        <p className="text-xl font-bold text-[var(--color-warning)]">{stats.pending}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[rgba(16,185,129,0.05)] border border-[rgba(16,185,129,0.2)]">
                        <p className="text-xs text-[var(--color-success)]">Approved</p>
                        <p className="text-xl font-bold text-[var(--color-success)]">{stats.approved}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[rgba(6,182,212,0.05)] border border-[rgba(6,182,212,0.2)]">
                        <p className="text-xs text-[var(--color-synapse-teal)]">Submitted to IRS</p>
                        <p className="text-xl font-bold text-[var(--color-synapse-teal)]">{stats.submitted}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[rgba(239,68,68,0.05)] border border-[rgba(239,68,68,0.2)]">
                        <p className="text-xs text-[var(--color-critical)]">Critical</p>
                        <p className="text-xl font-bold text-[var(--color-critical)]">{stats.critical}</p>
                    </div>
                </div>
            </div>

            {/* Code Reference Panel */}
            <AnimatePresence>
                {showCodeHelp && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-b border-[var(--glass-border)]"
                    >
                        <div className="p-5 bg-[rgba(6,182,212,0.02)]">
                            <h4 className="font-medium text-white mb-3">1095-C Code Reference</h4>
                            <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-xs">
                                {Object.entries(correctionCodes).map(([code, desc]) => (
                                    <div key={code} className="flex items-start gap-2">
                                        <span className="px-2 py-0.5 rounded bg-[var(--color-synapse-teal-muted)] text-[var(--color-synapse-teal)] font-mono font-bold">
                                            {code}
                                        </span>
                                        <span className="text-[var(--color-silver)]">{desc}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Filters */}
            <div className="p-4 border-b border-[var(--glass-border)] flex items-center gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-steel)]" />
                    <input
                        type="text"
                        placeholder="Search by employee name or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-sm text-white placeholder:text-[var(--color-steel)] focus:outline-none focus:border-[var(--color-synapse-teal)]"
                    />
                </div>
                <div className="flex items-center gap-2">
                    {['all', 'pending', 'approved', 'submitted'].map(status => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg capitalize transition-colors ${statusFilter === status
                                ? 'bg-[var(--color-synapse-teal)] text-black'
                                : 'bg-[rgba(255,255,255,0.03)] text-[var(--color-silver)] hover:bg-[rgba(255,255,255,0.08)]'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Correction List */}
            <div className="divide-y divide-[var(--glass-border)]">
                {filteredCorrections.map((item, index) => {
                    const severityStyle = getSeverityStyle(item.severity);
                    const statusStyle = getStatusStyle(item.status);

                    return (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.03 }}
                        >
                            <div
                                className={`p-4 cursor-pointer transition-colors ${expandedItem === item.id ? 'bg-[rgba(255,255,255,0.03)]' : 'hover:bg-[rgba(255,255,255,0.02)]'}`}
                                onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${severityStyle.bg}`}>
                                        {item.severity === 'critical' ? (
                                            <AlertTriangle className={`w-5 h-5 ${severityStyle.text}`} />
                                        ) : item.severity === 'warning' ? (
                                            <AlertTriangle className={`w-5 h-5 ${severityStyle.text}`} />
                                        ) : (
                                            <FileText className={`w-5 h-5 ${severityStyle.text}`} />
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="font-medium text-white">{item.employeeName}</span>
                                            <span className="text-xs text-[var(--color-steel)]">{item.employeeId}</span>
                                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${statusStyle.bg} ${statusStyle.text}`}>
                                                {item.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-[var(--color-silver)] truncate">{item.reason}</p>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="text-center">
                                            <p className="text-xs text-[var(--color-steel)] mb-0.5">Month</p>
                                            <p className="font-medium text-white">{item.month}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className="text-center">
                                                <p className="text-xs text-[var(--color-steel)] mb-0.5">{item.field}</p>
                                                <span className="px-2 py-1 text-xs font-mono font-bold rounded bg-[rgba(239,68,68,0.1)] text-[var(--color-critical)]">
                                                    {item.originalCode}
                                                </span>
                                            </div>
                                            <ArrowRight className="w-4 h-4 text-[var(--color-steel)]" />
                                            <div className="text-center">
                                                <p className="text-xs text-[var(--color-steel)] mb-0.5">Suggested</p>
                                                <span className="px-2 py-1 text-xs font-mono font-bold rounded bg-[rgba(16,185,129,0.1)] text-[var(--color-success)]">
                                                    {item.suggestedCode}
                                                </span>
                                            </div>
                                        </div>
                                        {expandedItem === item.id ? (
                                            <ChevronUp className="w-5 h-5 text-[var(--color-steel)]" />
                                        ) : (
                                            <ChevronDown className="w-5 h-5 text-[var(--color-steel)]" />
                                        )}
                                    </div>
                                </div>
                            </div>

                            <AnimatePresence>
                                {expandedItem === item.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="px-4 pb-4">
                                            <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)]">
                                                <div className="grid grid-cols-2 gap-4 mb-4">
                                                    <div>
                                                        <p className="text-xs text-[var(--color-steel)] mb-1">SSN (Masked)</p>
                                                        <p className="text-sm font-mono text-white">{item.ssn}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-[var(--color-steel)] mb-1">Tax Year Month</p>
                                                        <p className="text-sm text-white">2025 - Month {item.month}</p>
                                                    </div>
                                                </div>

                                                <div className="mb-4">
                                                    <p className="text-xs text-[var(--color-steel)] mb-2">Original Code Description</p>
                                                    <div className="p-3 rounded bg-[rgba(239,68,68,0.05)] border border-[rgba(239,68,68,0.2)]">
                                                        <p className="text-sm text-[var(--color-critical)]">
                                                            <span className="font-mono font-bold">{item.originalCode}:</span> {correctionCodes[item.originalCode as keyof typeof correctionCodes] || 'Unknown code'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="mb-4">
                                                    <p className="text-xs text-[var(--color-steel)] mb-2">Suggested Code Description</p>
                                                    <div className="p-3 rounded bg-[rgba(16,185,129,0.05)] border border-[rgba(16,185,129,0.2)]">
                                                        <p className="text-sm text-[var(--color-success)]">
                                                            <span className="font-mono font-bold">{item.suggestedCode}:</span> {correctionCodes[item.suggestedCode as keyof typeof correctionCodes] || 'Unknown code'}
                                                        </p>
                                                    </div>
                                                </div>

                                                {item.status === 'pending' && (
                                                    <div className="flex items-center justify-end gap-3 pt-3 border-t border-[var(--glass-border)]">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleReject(item.id);
                                                            }}
                                                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[var(--color-critical)] bg-[rgba(239,68,68,0.1)] rounded-lg hover:bg-[rgba(239,68,68,0.15)] transition-colors"
                                                        >
                                                            <XCircle className="w-4 h-4" />
                                                            Reject
                                                        </button>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleApprove(item.id);
                                                            }}
                                                            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-black bg-[var(--color-success)] rounded-lg hover:opacity-90 transition-opacity"
                                                        >
                                                            <CheckCircle2 className="w-4 h-4" />
                                                            Approve Correction
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[var(--glass-border)] flex items-center justify-between">
                <span className="text-xs text-[var(--color-steel)]">
                    {filteredCorrections.length} corrections shown
                </span>
                {stats.approved > 0 && (
                    <button className="btn-primary flex items-center gap-2">
                        <Send className="w-4 h-4" />
                        Submit {stats.approved} to IRS
                    </button>
                )}
            </div>
        </motion.div>
    );
}

export default CorrectionWorkflow;
