'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock,
    Calendar,
    Mail,
    Plus,
    Play,
    Pause,
    Trash2,
    Edit2,
    CheckCircle2,
    AlertTriangle,
    XCircle,
    FileText,
    Users,
    Download,
    Settings,
    ChevronRight,
    RefreshCw,
    Send,
    Loader2,
    X
} from 'lucide-react';

interface ScheduledReportsManagerProps {
    className?: string;
}

interface ScheduledReport {
    id: string;
    name: string;
    reportType: string;
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    nextRun: string;
    lastRun: string;
    status: 'active' | 'paused' | 'failed';
    recipients: string[];
    format: 'pdf' | 'xlsx' | 'csv';
    lastResult?: 'success' | 'failed' | 'warning';
}

interface ReportHistory {
    id: string;
    reportId: string;
    executedAt: string;
    status: 'success' | 'failed' | 'warning';
    duration: string;
    fileSize: string;
    recipients: number;
}

const mockReports: ScheduledReport[] = [
    { id: 'sr1', name: 'Weekly Compliance Summary', reportType: 'Compliance Overview', frequency: 'weekly', nextRun: 'Mon, Feb 3 at 8:00 AM', lastRun: 'Jan 27, 2026', status: 'active', recipients: ['compliance@company.com', 'hr@company.com'], format: 'pdf', lastResult: 'success' },
    { id: 'sr2', name: 'Monthly FT Status Report', reportType: 'Eligibility Analysis', frequency: 'monthly', nextRun: 'Mar 1 at 6:00 AM', lastRun: 'Feb 1, 2026', status: 'active', recipients: ['benefits@company.com'], format: 'xlsx', lastResult: 'success' },
    { id: 'sr3', name: 'Daily Penalty Exposure Alert', reportType: 'Penalty Assessment', frequency: 'daily', nextRun: 'Tomorrow at 7:00 AM', lastRun: 'Today', status: 'active', recipients: ['cfo@company.com', 'compliance@company.com'], format: 'pdf', lastResult: 'warning' },
    { id: 'sr4', name: 'Quarterly Filing Audit', reportType: 'Filing Status', frequency: 'quarterly', nextRun: 'Apr 1 at 9:00 AM', lastRun: 'Jan 1, 2026', status: 'paused', recipients: ['audit@company.com'], format: 'pdf', lastResult: 'success' },
    { id: 'sr5', name: 'Employee Data Export', reportType: 'Data Export', frequency: 'weekly', nextRun: 'Fri, Jan 31 at 11:00 PM', lastRun: 'Jan 24, 2026', status: 'failed', recipients: ['hris@company.com'], format: 'csv', lastResult: 'failed' },
];

const mockHistory: ReportHistory[] = [
    { id: 'h1', reportId: 'sr1', executedAt: 'Jan 27, 2026 8:00 AM', status: 'success', duration: '2m 34s', fileSize: '1.2 MB', recipients: 2 },
    { id: 'h2', reportId: 'sr3', executedAt: 'Jan 28, 2026 7:00 AM', status: 'warning', duration: '1m 12s', fileSize: '456 KB', recipients: 2 },
    { id: 'h3', reportId: 'sr2', executedAt: 'Feb 1, 2026 6:00 AM', status: 'success', duration: '4m 56s', fileSize: '3.8 MB', recipients: 1 },
    { id: 'h4', reportId: 'sr5', executedAt: 'Jan 24, 2026 11:00 PM', status: 'failed', duration: '0m 23s', fileSize: '-', recipients: 0 },
];

const reportTypes = [
    'Compliance Overview',
    'Eligibility Analysis',
    'Penalty Assessment',
    'Filing Status',
    'Coverage Summary',
    'Data Export',
];

export function ScheduledReportsManager({ className = '' }: ScheduledReportsManagerProps) {
    const [reports, setReports] = useState<ScheduledReport[]>(mockReports);
    const [selectedReport, setSelectedReport] = useState<string | null>(null);
    const [showNewModal, setShowNewModal] = useState(false);
    const [activeTab, setActiveTab] = useState<'scheduled' | 'history'>('scheduled');

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'active': return { bg: 'bg-[rgba(16,185,129,0.1)]', text: 'text-[var(--color-success)]', label: 'Active' };
            case 'paused': return { bg: 'bg-[rgba(245,158,11,0.1)]', text: 'text-[var(--color-warning)]', label: 'Paused' };
            case 'failed': return { bg: 'bg-[rgba(239,68,68,0.1)]', text: 'text-[var(--color-critical)]', label: 'Failed' };
            default: return { bg: 'bg-[rgba(255,255,255,0.05)]', text: 'text-[var(--color-steel)]', label: status };
        }
    };

    const getResultIcon = (result?: string) => {
        switch (result) {
            case 'success': return <CheckCircle2 className="w-4 h-4 text-[var(--color-success)]" />;
            case 'warning': return <AlertTriangle className="w-4 h-4 text-[var(--color-warning)]" />;
            case 'failed': return <XCircle className="w-4 h-4 text-[var(--color-critical)]" />;
            default: return null;
        }
    };

    const toggleStatus = (id: string) => {
        setReports(prev => prev.map(r => {
            if (r.id === id) {
                return { ...r, status: r.status === 'active' ? 'paused' : 'active' };
            }
            return r;
        }));
    };

    const deleteReport = (id: string) => {
        setReports(prev => prev.filter(r => r.id !== id));
    };

    const stats = {
        total: reports.length,
        active: reports.filter(r => r.status === 'active').length,
        paused: reports.filter(r => r.status === 'paused').length,
        failed: reports.filter(r => r.status === 'failed').length,
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
                            <Clock className="w-5 h-5 text-black" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">Scheduled Reports</h2>
                            <p className="text-xs text-[var(--color-steel)]">Automated report generation and distribution</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowNewModal(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Plus className="w-4 h-4" />
                        New Schedule
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4">
                    <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)]">
                        <p className="text-xs text-[var(--color-steel)]">Total Schedules</p>
                        <p className="text-xl font-bold text-white">{stats.total}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[rgba(16,185,129,0.05)] border border-[rgba(16,185,129,0.2)]">
                        <p className="text-xs text-[var(--color-steel)]">Active</p>
                        <p className="text-xl font-bold text-[var(--color-success)]">{stats.active}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[rgba(245,158,11,0.05)] border border-[rgba(245,158,11,0.2)]">
                        <p className="text-xs text-[var(--color-steel)]">Paused</p>
                        <p className="text-xl font-bold text-[var(--color-warning)]">{stats.paused}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[rgba(239,68,68,0.05)] border border-[rgba(239,68,68,0.2)]">
                        <p className="text-xs text-[var(--color-steel)]">Failed</p>
                        <p className="text-xl font-bold text-[var(--color-critical)]">{stats.failed}</p>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="px-5 py-3 border-b border-[var(--glass-border)] flex items-center gap-4">
                <button
                    onClick={() => setActiveTab('scheduled')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'scheduled'
                        ? 'bg-[var(--color-synapse-teal)] text-black'
                        : 'text-[var(--color-silver)] hover:bg-[rgba(255,255,255,0.05)]'
                        }`}
                >
                    Scheduled Reports
                </button>
                <button
                    onClick={() => setActiveTab('history')}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === 'history'
                        ? 'bg-[var(--color-synapse-teal)] text-black'
                        : 'text-[var(--color-silver)] hover:bg-[rgba(255,255,255,0.05)]'
                        }`}
                >
                    Execution History
                </button>
            </div>

            {/* Content */}
            <div className="divide-y divide-[var(--glass-border)]">
                {activeTab === 'scheduled' ? (
                    reports.map((report, index) => {
                        const statusStyle = getStatusStyle(report.status);

                        return (
                            <motion.div
                                key={report.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.03 }}
                                className="p-4 hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-[rgba(255,255,255,0.05)] flex items-center justify-center">
                                        <FileText className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-medium text-white">{report.name}</h4>
                                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${statusStyle.bg} ${statusStyle.text}`}>
                                                {statusStyle.label}
                                            </span>
                                            {report.lastResult && getResultIcon(report.lastResult)}
                                        </div>
                                        <div className="flex items-center gap-4 text-xs text-[var(--color-steel)]">
                                            <span>{report.reportType}</span>
                                            <span>•</span>
                                            <span className="capitalize">{report.frequency}</span>
                                            <span>•</span>
                                            <span className="uppercase">{report.format}</span>
                                        </div>
                                    </div>

                                    <div className="text-right min-w-[140px]">
                                        <p className="text-sm text-white">{report.nextRun}</p>
                                        <p className="text-xs text-[var(--color-steel)]">Next run</p>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm text-[var(--color-steel)]">
                                        <Mail className="w-4 h-4" />
                                        <span>{report.recipients.length}</span>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => toggleStatus(report.id)}
                                            className={`p-2 rounded-lg transition-colors ${report.status === 'active'
                                                ? 'text-[var(--color-warning)] hover:bg-[rgba(245,158,11,0.1)]'
                                                : 'text-[var(--color-success)] hover:bg-[rgba(16,185,129,0.1)]'
                                                }`}
                                            title={report.status === 'active' ? 'Pause' : 'Resume'}
                                        >
                                            {report.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                        </button>
                                        <button
                                            className="p-2 rounded-lg text-[var(--color-steel)] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                                            title="Run Now"
                                        >
                                            <RefreshCw className="w-4 h-4" />
                                        </button>
                                        <button
                                            className="p-2 rounded-lg text-[var(--color-steel)] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                                            title="Edit"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => deleteReport(report.id)}
                                            className="p-2 rounded-lg text-[var(--color-steel)] hover:bg-[rgba(239,68,68,0.1)] hover:text-[var(--color-critical)] transition-colors"
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })
                ) : (
                    mockHistory.map((entry, index) => {
                        const report = reports.find(r => r.id === entry.reportId);
                        const statusStyle = getStatusStyle(entry.status);

                        return (
                            <motion.div
                                key={entry.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: index * 0.03 }}
                                className="p-4 hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${statusStyle.bg}`}>
                                        {getResultIcon(entry.status)}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium text-white">{report?.name || 'Unknown Report'}</h4>
                                        <p className="text-xs text-[var(--color-steel)]">{entry.executedAt}</p>
                                    </div>

                                    <div className="flex items-center gap-6 text-sm">
                                        <div className="text-center">
                                            <p className="text-white">{entry.duration}</p>
                                            <p className="text-xs text-[var(--color-steel)]">Duration</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-white">{entry.fileSize}</p>
                                            <p className="text-xs text-[var(--color-steel)]">Size</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-white">{entry.recipients}</p>
                                            <p className="text-xs text-[var(--color-steel)]">Sent</p>
                                        </div>
                                    </div>

                                    {entry.status === 'success' && (
                                        <button className="btn-secondary flex items-center gap-2 text-sm">
                                            <Download className="w-4 h-4" />
                                            Download
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })
                )}
            </div>

            {/* New Schedule Modal */}
            <AnimatePresence>
                {showNewModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowNewModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="glass-card w-full max-w-lg"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-5 border-b border-[var(--glass-border)] flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-white">New Scheduled Report</h3>
                                <button
                                    onClick={() => setShowNewModal(false)}
                                    className="p-2 rounded-lg text-[var(--color-steel)] hover:bg-[rgba(255,255,255,0.05)]"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-5 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">Report Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter report name"
                                        className="w-full px-4 py-2.5 bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white placeholder:text-[var(--color-steel)] focus:outline-none focus:border-[var(--color-synapse-teal)]"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">Report Type</label>
                                    <select className="w-full px-4 py-2.5 bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white focus:outline-none focus:border-[var(--color-synapse-teal)]">
                                        {reportTypes.map(type => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">Frequency</label>
                                        <select className="w-full px-4 py-2.5 bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white focus:outline-none focus:border-[var(--color-synapse-teal)]">
                                            <option value="daily">Daily</option>
                                            <option value="weekly">Weekly</option>
                                            <option value="monthly">Monthly</option>
                                            <option value="quarterly">Quarterly</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">Format</label>
                                        <select className="w-full px-4 py-2.5 bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white focus:outline-none focus:border-[var(--color-synapse-teal)]">
                                            <option value="pdf">PDF</option>
                                            <option value="xlsx">Excel</option>
                                            <option value="csv">CSV</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">Recipients</label>
                                    <input
                                        type="text"
                                        placeholder="Enter email addresses, comma separated"
                                        className="w-full px-4 py-2.5 bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white placeholder:text-[var(--color-steel)] focus:outline-none focus:border-[var(--color-synapse-teal)]"
                                    />
                                </div>
                            </div>

                            <div className="p-5 border-t border-[var(--glass-border)] flex justify-end gap-3">
                                <button
                                    onClick={() => setShowNewModal(false)}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button className="btn-primary flex items-center gap-2">
                                    <Calendar className="w-4 h-4" />
                                    Create Schedule
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default ScheduledReportsManager;
