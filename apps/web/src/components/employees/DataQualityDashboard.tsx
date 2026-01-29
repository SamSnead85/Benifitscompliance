'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Database,
    CheckCircle2,
    AlertTriangle,
    XCircle,
    Info,
    Search,
    RefreshCw,
    Download,
    Zap,
    TrendingUp,
    Shield
} from 'lucide-react';

interface DataQualityMetric {
    category: string;
    score: number;
    issues: number;
    total: number;
    status: 'excellent' | 'good' | 'warning' | 'critical';
}

interface DataIssue {
    id: string;
    severity: 'error' | 'warning' | 'info';
    category: string;
    message: string;
    affectedRecords: number;
    autoFixable: boolean;
}

interface DataQualityDashboardProps {
    className?: string;
}

const defaultMetrics: DataQualityMetric[] = [
    { category: 'Employee Demographics', score: 98.5, issues: 12, total: 4521, status: 'excellent' },
    { category: 'Hours & Compensation', score: 94.2, issues: 45, total: 4521, status: 'good' },
    { category: 'Coverage Information', score: 96.8, issues: 28, total: 4521, status: 'excellent' },
    { category: 'SSN Validation', score: 99.8, issues: 3, total: 4521, status: 'excellent' },
    { category: 'Date Consistency', score: 87.5, issues: 89, total: 4521, status: 'warning' },
    { category: 'Dependent Data', score: 92.1, issues: 156, total: 2345, status: 'good' },
];

const defaultIssues: DataIssue[] = [
    { id: 'dq-001', severity: 'error', category: 'SSN Validation', message: 'Invalid SSN format detected', affectedRecords: 3, autoFixable: false },
    { id: 'dq-002', severity: 'warning', category: 'Date Consistency', message: 'Hire date is after coverage start date', affectedRecords: 45, autoFixable: true },
    { id: 'dq-003', severity: 'warning', category: 'Hours', message: 'Missing hours data for measurement period', affectedRecords: 28, autoFixable: false },
    { id: 'dq-004', severity: 'info', category: 'Demographics', message: 'Email format inconsistent', affectedRecords: 89, autoFixable: true },
    { id: 'dq-005', severity: 'error', category: 'Coverage', message: 'Coverage code missing for full-time employees', affectedRecords: 12, autoFixable: false },
];

const statusConfig = {
    excellent: { color: 'var(--color-success)', label: 'Excellent' },
    good: { color: 'var(--color-synapse-teal)', label: 'Good' },
    warning: { color: 'var(--color-warning)', label: 'Needs Attention' },
    critical: { color: 'var(--color-critical)', label: 'Critical' }
};

const severityConfig = {
    error: { icon: XCircle, color: 'var(--color-critical)' },
    warning: { icon: AlertTriangle, color: 'var(--color-warning)' },
    info: { icon: Info, color: 'var(--color-synapse-cyan)' }
};

export function DataQualityDashboard({ className = '' }: DataQualityDashboardProps) {
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [filterSeverity, setFilterSeverity] = useState<string>('all');

    const overallScore = defaultMetrics.reduce((sum, m) => sum + m.score, 0) / defaultMetrics.length;
    const totalIssues = defaultMetrics.reduce((sum, m) => sum + m.issues, 0);
    const autoFixable = defaultIssues.filter(i => i.autoFixable).length;

    const filteredIssues = filterSeverity === 'all'
        ? defaultIssues
        : defaultIssues.filter(i => i.severity === filterSeverity);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await new Promise(r => setTimeout(r, 2000));
        setIsRefreshing(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`space-y-6 ${className}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-synapse-teal)] to-[var(--color-synapse-cyan)] flex items-center justify-center">
                        <Database className="w-5 h-5 text-black" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-white">Data Quality Monitor</h2>
                        <p className="text-xs text-[var(--color-steel)]">Last scan: 15 minutes ago</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button onClick={handleRefresh} className="btn-secondary">
                        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        Rescan
                    </button>
                    <button className="btn-secondary">
                        <Download className="w-4 h-4" />
                        Export Report
                    </button>
                </div>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-4 gap-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="glass-card p-5"
                >
                    <div className="flex items-center justify-between mb-3">
                        <Shield className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                        <span className="text-xs text-[var(--color-success)]">+1.2%</span>
                    </div>
                    <p className="text-3xl font-bold text-white font-mono mb-1">{overallScore.toFixed(1)}%</p>
                    <p className="text-sm text-[var(--color-steel)]">Overall Score</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.05 }}
                    className="glass-card p-5"
                >
                    <div className="flex items-center justify-between mb-3">
                        <AlertTriangle className="w-5 h-5 text-[var(--color-warning)]" />
                        <span className="text-xs text-[var(--color-success)]">-15</span>
                    </div>
                    <p className="text-3xl font-bold text-white font-mono mb-1">{totalIssues}</p>
                    <p className="text-sm text-[var(--color-steel)]">Total Issues</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="glass-card p-5"
                >
                    <div className="flex items-center justify-between mb-3">
                        <Zap className="w-5 h-5 text-[var(--color-synapse-gold)]" />
                    </div>
                    <p className="text-3xl font-bold text-white font-mono mb-1">{autoFixable}</p>
                    <p className="text-sm text-[var(--color-steel)]">Auto-Fixable</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15 }}
                    className="glass-card p-5"
                >
                    <div className="flex items-center justify-between mb-3">
                        <TrendingUp className="w-5 h-5 text-[var(--color-success)]" />
                    </div>
                    <p className="text-3xl font-bold text-white font-mono mb-1">4,521</p>
                    <p className="text-sm text-[var(--color-steel)]">Records Scanned</p>
                </motion.div>
            </div>

            {/* Metrics by Category */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6"
            >
                <h3 className="font-semibold text-white mb-4">Quality by Category</h3>
                <div className="space-y-4">
                    {defaultMetrics.map((metric, i) => {
                        const status = statusConfig[metric.status];
                        return (
                            <motion.div
                                key={metric.category}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.05 }}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-[var(--color-silver)]">{metric.category}</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-xs text-[var(--color-steel)]">
                                            {metric.issues} issues / {metric.total} records
                                        </span>
                                        <span
                                            className="px-2 py-0.5 rounded text-xs font-medium"
                                            style={{ backgroundColor: `${status.color}20`, color: status.color }}
                                        >
                                            {metric.score}%
                                        </span>
                                    </div>
                                </div>
                                <div className="h-2 bg-[var(--glass-bg)] rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${metric.score}%` }}
                                        transition={{ duration: 0.8, delay: i * 0.1 }}
                                        className="h-full rounded-full"
                                        style={{ backgroundColor: status.color }}
                                    />
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>

            {/* Issues List */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-6"
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-white">Active Issues</h3>
                    <div className="flex items-center gap-2">
                        {['all', 'error', 'warning', 'info'].map((sev) => (
                            <button
                                key={sev}
                                onClick={() => setFilterSeverity(sev)}
                                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${filterSeverity === sev
                                        ? 'bg-[var(--color-synapse-teal)] text-black'
                                        : 'bg-[var(--glass-bg)] text-[var(--color-steel)] hover:text-white'
                                    }`}
                            >
                                {sev.charAt(0).toUpperCase() + sev.slice(1)}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="space-y-3">
                    {filteredIssues.map((issue, i) => {
                        const severity = severityConfig[issue.severity];
                        const SeverityIcon = severity.icon;

                        return (
                            <motion.div
                                key={issue.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.03 }}
                                className="p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)] flex items-center gap-4"
                            >
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                                    style={{ backgroundColor: `${severity.color}20` }}
                                >
                                    <SeverityIcon className="w-5 h-5" style={{ color: severity.color }} />
                                </div>
                                <div className="flex-1">
                                    <p className="text-sm text-white">{issue.message}</p>
                                    <p className="text-xs text-[var(--color-steel)]">
                                        {issue.category} • {issue.affectedRecords} records affected
                                    </p>
                                </div>
                                <div className="flex items-center gap-2">
                                    {issue.autoFixable && (
                                        <button className="px-3 py-1 rounded text-xs bg-[var(--color-synapse-teal)] text-black font-medium flex items-center gap-1">
                                            <Zap className="w-3 h-3" />
                                            Auto-Fix
                                        </button>
                                    )}
                                    <button className="btn-secondary text-xs">Review</button>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>
        </motion.div>
    );
}

export default DataQualityDashboard;
