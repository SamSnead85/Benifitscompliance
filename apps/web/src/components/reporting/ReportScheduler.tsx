'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Download,
    Calendar,
    Clock,
    Play,
    Pause,
    Trash2,
    Edit2,
    Plus,
    CheckCircle2,
    AlertCircle,
    RefreshCw,
    Mail,
    Slack,
    ChevronDown,
    Filter
} from 'lucide-react';

interface ScheduledReport {
    id: string;
    name: string;
    type: 'compliance' | 'forms' | 'analytics' | 'audit' | 'custom';
    schedule: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    nextRun: string;
    lastRun?: string;
    status: 'active' | 'paused' | 'error';
    recipients: string[];
    format: 'pdf' | 'excel' | 'csv';
    filters?: Record<string, string>;
}

interface ReportSchedulerProps {
    reports?: ScheduledReport[];
    className?: string;
    onCreateReport?: () => void;
}

const defaultReports: ScheduledReport[] = [
    {
        id: 'rpt-001',
        name: 'Monthly Compliance Summary',
        type: 'compliance',
        schedule: 'monthly',
        nextRun: 'Feb 1, 2026 9:00 AM',
        lastRun: 'Jan 1, 2026 9:00 AM',
        status: 'active',
        recipients: ['hr@company.com', 'compliance@company.com'],
        format: 'pdf'
    },
    {
        id: 'rpt-002',
        name: 'Weekly FTE Status Report',
        type: 'analytics',
        schedule: 'weekly',
        nextRun: 'Feb 3, 2026 8:00 AM',
        lastRun: 'Jan 27, 2026 8:00 AM',
        status: 'active',
        recipients: ['manager@company.com'],
        format: 'excel'
    },
    {
        id: 'rpt-003',
        name: 'Quarterly Audit Trail Export',
        type: 'audit',
        schedule: 'quarterly',
        nextRun: 'Apr 1, 2026 6:00 AM',
        lastRun: 'Jan 1, 2026 6:00 AM',
        status: 'active',
        recipients: ['auditor@company.com'],
        format: 'csv'
    },
    {
        id: 'rpt-004',
        name: 'Daily Exception Alerts',
        type: 'compliance',
        schedule: 'daily',
        nextRun: 'Jan 29, 2026 7:00 AM',
        status: 'error',
        recipients: ['alerts@company.com'],
        format: 'pdf'
    }
];

const typeConfig = {
    compliance: { color: 'var(--color-synapse-teal)', label: 'Compliance' },
    forms: { color: 'var(--color-synapse-cyan)', label: 'Forms' },
    analytics: { color: 'var(--color-synapse-gold)', label: 'Analytics' },
    audit: { color: 'var(--color-steel)', label: 'Audit' },
    custom: { color: 'var(--color-silver)', label: 'Custom' }
};

const scheduleConfig = {
    daily: { icon: Clock, label: 'Daily' },
    weekly: { icon: Calendar, label: 'Weekly' },
    monthly: { icon: Calendar, label: 'Monthly' },
    quarterly: { icon: Calendar, label: 'Quarterly' }
};

export function ReportScheduler({
    reports = defaultReports,
    className = '',
    onCreateReport
}: ReportSchedulerProps) {
    const [expandedReport, setExpandedReport] = useState<string | null>(null);
    const [filterType, setFilterType] = useState<string>('all');

    const filteredReports = filterType === 'all'
        ? reports
        : reports.filter(r => r.type === filterType);

    const activeCount = reports.filter(r => r.status === 'active').length;
    const errorCount = reports.filter(r => r.status === 'error').length;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-6 ${className}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                    <h3 className="font-semibold text-white">Scheduled Reports</h3>
                    <span className="px-2 py-0.5 rounded text-xs bg-[var(--glass-bg)] text-[var(--color-steel)]">
                        {activeCount} active
                    </span>
                    {errorCount > 0 && (
                        <span className="px-2 py-0.5 rounded text-xs bg-[rgba(239,68,68,0.2)] text-[var(--color-critical)]">
                            {errorCount} failed
                        </span>
                    )}
                </div>
                <button onClick={onCreateReport} className="btn-primary text-sm">
                    <Plus className="w-4 h-4" />
                    Schedule Report
                </button>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-2 mb-4">
                <Filter className="w-4 h-4 text-[var(--color-steel)]" />
                {['all', 'compliance', 'forms', 'analytics', 'audit', 'custom'].map((type) => (
                    <button
                        key={type}
                        onClick={() => setFilterType(type)}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${filterType === type
                                ? 'bg-[var(--color-synapse-teal)] text-black'
                                : 'bg-[var(--glass-bg)] text-[var(--color-steel)] hover:text-white'
                            }`}
                    >
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                ))}
            </div>

            {/* Reports List */}
            <div className="space-y-3">
                {filteredReports.map((report, i) => {
                    const type = typeConfig[report.type];
                    const schedule = scheduleConfig[report.schedule];
                    const ScheduleIcon = schedule.icon;
                    const isExpanded = expandedReport === report.id;

                    return (
                        <motion.div
                            key={report.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.03 }}
                            className="rounded-lg border border-[var(--glass-border)] overflow-hidden"
                        >
                            <div
                                onClick={() => setExpandedReport(isExpanded ? null : report.id)}
                                className="p-4 bg-[var(--glass-bg-light)] flex items-center gap-4 cursor-pointer hover:bg-[var(--glass-bg)] transition-colors"
                            >
                                {/* Status */}
                                <div className={`w-2 h-10 rounded-full ${report.status === 'active' ? 'bg-[var(--color-success)]' :
                                        report.status === 'error' ? 'bg-[var(--color-critical)]' :
                                            'bg-[var(--color-steel)]'
                                    }`} />

                                {/* Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-white">{report.name}</span>
                                        <span
                                            className="px-2 py-0.5 rounded text-xs"
                                            style={{ backgroundColor: `${type.color}20`, color: type.color }}
                                        >
                                            {type.label}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-4 text-xs text-[var(--color-steel)]">
                                        <span className="flex items-center gap-1">
                                            <ScheduleIcon className="w-3 h-3" />
                                            {schedule.label}
                                        </span>
                                        <span>Next: {report.nextRun}</span>
                                        <span className="uppercase">{report.format}</span>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    <button className="p-2 rounded-lg hover:bg-[var(--glass-bg)] text-[var(--color-steel)] hover:text-white">
                                        <Play className="w-4 h-4" />
                                    </button>
                                    <button className="p-2 rounded-lg hover:bg-[var(--glass-bg)] text-[var(--color-steel)] hover:text-white">
                                        {report.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                                    </button>
                                    <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                                        <ChevronDown className="w-5 h-5 text-[var(--color-steel)]" />
                                    </motion.div>
                                </div>
                            </div>

                            {/* Expanded */}
                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="border-t border-[var(--glass-border)]"
                                    >
                                        <div className="p-4 space-y-4">
                                            {/* Recipients */}
                                            <div>
                                                <span className="text-xs text-[var(--color-steel)] block mb-2">Recipients</span>
                                                <div className="flex flex-wrap gap-2">
                                                    {report.recipients.map(email => (
                                                        <span
                                                            key={email}
                                                            className="px-2 py-1 rounded text-xs bg-[var(--glass-bg)] text-[var(--color-silver)] flex items-center gap-1"
                                                        >
                                                            <Mail className="w-3 h-3" />
                                                            {email}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Last Run */}
                                            {report.lastRun && (
                                                <div className="flex items-center gap-4 text-sm">
                                                    <span className="text-[var(--color-steel)]">Last run:</span>
                                                    <span className="text-white">{report.lastRun}</span>
                                                    <span className="flex items-center gap-1 text-[var(--color-success)]">
                                                        <CheckCircle2 className="w-3 h-3" />
                                                        Success
                                                    </span>
                                                </div>
                                            )}

                                            {/* Actions */}
                                            <div className="flex items-center gap-2 pt-2 border-t border-[var(--glass-border)]">
                                                <button className="btn-secondary text-xs">
                                                    <Edit2 className="w-3 h-3" />
                                                    Edit
                                                </button>
                                                <button className="btn-secondary text-xs">
                                                    <RefreshCw className="w-3 h-3" />
                                                    Run Now
                                                </button>
                                                <button className="btn-secondary text-xs">
                                                    <Download className="w-3 h-3" />
                                                    Download Last
                                                </button>
                                                <button className="text-xs text-[var(--color-critical)] hover:underline flex items-center gap-1 ml-auto">
                                                    <Trash2 className="w-3 h-3" />
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}

export default ReportScheduler;
