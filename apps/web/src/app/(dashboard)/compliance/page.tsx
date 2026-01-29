'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FileCheck,
    AlertTriangle,
    CheckCircle2,
    Clock,
    Download,
    Eye,
    Filter,
    Search,
    ChevronRight,
    ChevronDown,
    FileText,
    Users,
    DollarSign,
    Calendar,
    AlertCircle,
    ThumbsUp,
    ThumbsDown,
    MessageSquare,
    Brain
} from 'lucide-react';
import Link from 'next/link';

// Sample compliance data
const complianceSummary = {
    totalEmployees: 12847,
    compliant: 12398,
    atRisk: 327,
    nonCompliant: 89,
    pendingReview: 33
};

const formStats = {
    forms1095C: { total: 12847, generated: 12650, pending: 197 },
    form1094C: { total: 24, generated: 22, pending: 2 }
};

const exceptionQueue = [
    {
        id: 'EXC-001',
        employee: 'Michael Rodriguez',
        employeeId: 'EMP-4521',
        client: 'Horizon Healthcare',
        issue: 'FTE status unclear - variable hours employee',
        aiConfidence: 72,
        aiRecommendation: 'Classify as full-time based on 12-month look-back average of 32.5 hours/week',
        severity: 'medium',
        createdAt: '2 hours ago'
    },
    {
        id: 'EXC-002',
        employee: 'Sarah Thompson',
        employeeId: 'EMP-3892',
        client: 'Apex Manufacturing',
        issue: 'Affordability calculation exceeds 9.12% threshold',
        aiConfidence: 95,
        aiRecommendation: 'Flag for employer review - premium contribution may trigger 4980H(b) penalty',
        severity: 'high',
        createdAt: '4 hours ago'
    },
    {
        id: 'EXC-003',
        employee: 'James Wilson',
        employeeId: 'EMP-7234',
        client: 'Summit Logistics',
        issue: 'Missing dependent SSN for coverage validation',
        aiConfidence: 88,
        aiRecommendation: 'Request SSN from employee or use DOB for 1095-C Part III',
        severity: 'low',
        createdAt: '1 day ago'
    },
];

const recentForms = [
    { id: '1095C-001', type: '1095-C', employee: 'John Smith', client: 'Apex Manufacturing', status: 'approved', date: 'Jan 25, 2026' },
    { id: '1095C-002', type: '1095-C', employee: 'Emily Chen', client: 'Apex Manufacturing', status: 'pending', date: 'Jan 25, 2026' },
    { id: '1094C-001', type: '1094-C', client: 'Horizon Healthcare', status: 'approved', date: 'Jan 24, 2026' },
    { id: '1095C-003', type: '1095-C', employee: 'Robert Davis', client: 'Summit Logistics', status: 'approved', date: 'Jan 24, 2026' },
];

function ComplianceGauge({ percentage, label, color }: { percentage: number; label: string; color: string }) {
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - (percentage / 100) * circumference;

    return (
        <div className="radial-gauge">
            <svg viewBox="0 0 180 180" className="w-full h-full">
                <circle
                    cx="90"
                    cy="90"
                    r={radius}
                    className="radial-gauge-bg"
                />
                <circle
                    cx="90"
                    cy="90"
                    r={radius}
                    className="radial-gauge-value"
                    style={{
                        stroke: color,
                        strokeDasharray: circumference,
                        strokeDashoffset: offset
                    }}
                />
            </svg>
            <div className="radial-gauge-label">
                <div className="text-3xl font-bold text-white font-mono">{percentage}%</div>
                <div className="text-xs text-[var(--color-steel)]">{label}</div>
            </div>
        </div>
    );
}

function SeverityBadge({ severity }: { severity: string }) {
    const config: Record<string, { className: string; label: string }> = {
        high: { className: 'badge--critical', label: 'High Priority' },
        medium: { className: 'badge--warning', label: 'Medium' },
        low: { className: 'badge--info', label: 'Low' },
    };
    const { className, label } = config[severity] || config.low;
    return <span className={`badge ${className}`}>{label}</span>;
}

export default function CompliancePage() {
    const [selectedTab, setSelectedTab] = useState<'overview' | 'forms' | 'exceptions'>('overview');
    const [expandedException, setExpandedException] = useState<string | null>(null);

    const complianceRate = Math.round((complianceSummary.compliant / complianceSummary.totalEmployees) * 100 * 10) / 10;

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white flex items-center gap-3">
                        <FileCheck className="w-7 h-7 text-[var(--color-synapse-teal)]" />
                        Compliance Center
                    </h1>
                    <p className="text-[var(--color-steel)] mt-1">Review ACA status, manage exceptions, and generate forms</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn-secondary">
                        <Download className="w-4 h-4" />
                        Export Report
                    </button>
                    <button className="btn-primary">
                        <FileText className="w-4 h-4" />
                        Generate All Forms
                    </button>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="flex gap-1 p-1 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)] w-fit">
                {[
                    { id: 'overview', label: 'Overview' },
                    { id: 'forms', label: 'Form Review' },
                    { id: 'exceptions', label: 'Exception Queue' }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setSelectedTab(tab.id as 'overview' | 'forms' | 'exceptions')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${selectedTab === tab.id
                            ? 'bg-[var(--color-synapse-teal-muted)] text-[var(--color-synapse-teal)]'
                            : 'text-[var(--color-silver)] hover:text-white'
                            }`}
                    >
                        {tab.label}
                        {tab.id === 'exceptions' && exceptionQueue.length > 0 && (
                            <span className="ml-2 px-1.5 py-0.5 text-xs rounded-full bg-[var(--color-warning)] text-[var(--color-void)]">
                                {exceptionQueue.length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            {/* Overview Tab */}
            {selectedTab === 'overview' && (
                <div className="space-y-6">
                    {/* Compliance Score & Stats */}
                    <div className="grid lg:grid-cols-4 gap-6">
                        {/* Gauge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="glass-card p-6 flex flex-col items-center justify-center"
                        >
                            <ComplianceGauge
                                percentage={complianceRate}
                                label="Overall Compliance"
                                color="var(--color-synapse-teal)"
                            />
                        </motion.div>

                        {/* Stats Grid */}
                        <div className="lg:col-span-3 grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {[
                                { label: 'Total Employees', value: complianceSummary.totalEmployees, icon: Users, color: 'var(--color-synapse-teal)' },
                                { label: 'Compliant', value: complianceSummary.compliant, icon: CheckCircle2, color: 'var(--color-success)' },
                                { label: 'At Risk', value: complianceSummary.atRisk, icon: AlertTriangle, color: 'var(--color-warning)' },
                                { label: 'Non-Compliant', value: complianceSummary.nonCompliant, icon: AlertCircle, color: 'var(--color-critical)' },
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="metric-card"
                                >
                                    <div className="flex items-center gap-2 mb-4">
                                        <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                                        <span className="text-xs text-[var(--color-steel)]">{stat.label}</span>
                                    </div>
                                    <div className="text-3xl font-bold text-white font-mono">{stat.value.toLocaleString()}</div>
                                </motion.div>
                            ))}
                        </div>
                    </div>

                    {/* Form Generation Status */}
                    <div className="grid lg:grid-cols-2 gap-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="glass-card p-6"
                        >
                            <h2 className="text-lg font-semibold text-white mb-6">Form 1095-C Status</h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[var(--color-silver)]">Generated</span>
                                    <span className="font-mono text-white">{formStats.forms1095C.generated.toLocaleString()}</span>
                                </div>
                                <div className="h-2 bg-[var(--glass-border)] rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[var(--color-synapse-teal)] rounded-full"
                                        style={{ width: `${(formStats.forms1095C.generated / formStats.forms1095C.total) * 100}%` }}
                                    />
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-[var(--color-steel)]">{formStats.forms1095C.pending} pending</span>
                                    <span className="text-[var(--color-steel)]">{formStats.forms1095C.total.toLocaleString()} total</span>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="glass-card p-6"
                        >
                            <h2 className="text-lg font-semibold text-white mb-6">Form 1094-C Status</h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-[var(--color-silver)]">Generated</span>
                                    <span className="font-mono text-white">{formStats.form1094C.generated}</span>
                                </div>
                                <div className="h-2 bg-[var(--glass-border)] rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-[var(--color-success)] rounded-full"
                                        style={{ width: `${(formStats.form1094C.generated / formStats.form1094C.total) * 100}%` }}
                                    />
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-[var(--color-steel)]">{formStats.form1094C.pending} pending</span>
                                    <span className="text-[var(--color-steel)]">{formStats.form1094C.total} total clients</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            )}

            {/* Exception Queue Tab */}
            {selectedTab === 'exceptions' && (
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <p className="text-[var(--color-silver)]">
                            <span className="font-mono text-white">{exceptionQueue.length}</span> items require human review
                        </p>
                        <div className="flex items-center gap-2">
                            <button className="btn-secondary text-sm">
                                <Filter className="w-4 h-4" />
                                Filter
                            </button>
                        </div>
                    </div>

                    {exceptionQueue.map((exception) => (
                        <motion.div
                            key={exception.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="glass-card overflow-hidden"
                        >
                            {/* Exception Header */}
                            <div
                                className="p-6 cursor-pointer"
                                onClick={() => setExpandedException(expandedException === exception.id ? null : exception.id)}
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-[var(--color-warning)]/15 border border-[var(--color-warning)]/30 flex items-center justify-center">
                                            <AlertTriangle className="w-5 h-5 text-[var(--color-warning)]" />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <span className="font-semibold text-white">{exception.employee}</span>
                                                <span className="text-xs font-mono text-[var(--color-steel)]">{exception.employeeId}</span>
                                                <SeverityBadge severity={exception.severity} />
                                            </div>
                                            <p className="text-sm text-[var(--color-silver)]">{exception.issue}</p>
                                            <p className="text-xs text-[var(--color-steel)] mt-1">{exception.client} • {exception.createdAt}</p>
                                        </div>
                                    </div>
                                    <ChevronDown className={`w-5 h-5 text-[var(--color-steel)] transition-transform ${expandedException === exception.id ? 'rotate-180' : ''}`} />
                                </div>
                            </div>

                            {/* Exception Details */}
                            {expandedException === exception.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    className="border-t border-[var(--glass-border)] p-6 bg-[var(--glass-bg-light)]"
                                >
                                    <div className="mb-4">
                                        <div className="flex items-center gap-2 mb-2">
                                            <Brain className="w-4 h-4 text-[var(--color-synapse-teal)]" />
                                            <span className="text-sm font-medium text-white">AI Recommendation</span>
                                            <span className="text-xs text-[var(--color-steel)]">({exception.aiConfidence}% confidence)</span>
                                        </div>
                                        <p className="text-sm text-[var(--color-silver)] bg-[var(--glass-bg)] p-3 rounded-lg border border-[var(--glass-border)]">
                                            {exception.aiRecommendation}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button className="btn-primary text-sm py-2">
                                            <ThumbsUp className="w-4 h-4" />
                                            Accept
                                        </button>
                                        <button className="btn-secondary text-sm py-2">
                                            <ThumbsDown className="w-4 h-4" />
                                            Reject
                                        </button>
                                        <button className="btn-secondary text-sm py-2">
                                            <MessageSquare className="w-4 h-4" />
                                            Add Note
                                        </button>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Forms Tab */}
            {selectedTab === 'forms' && (
                <div className="glass-card overflow-hidden">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Form ID</th>
                                <th>Type</th>
                                <th>Employee/Client</th>
                                <th>Status</th>
                                <th>Date</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentForms.map((form) => (
                                <tr key={form.id}>
                                    <td className="font-mono">{form.id}</td>
                                    <td>
                                        <span className="badge badge--info">{form.type}</span>
                                    </td>
                                    <td>
                                        <div className="text-white">{form.employee || form.client}</div>
                                        {form.employee && <div className="text-xs text-[var(--color-steel)]">{form.client}</div>}
                                    </td>
                                    <td>
                                        <span className={`badge ${form.status === 'approved' ? 'badge--success' : 'badge--warning'}`}>
                                            {form.status === 'approved' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                                            {form.status.charAt(0).toUpperCase() + form.status.slice(1)}
                                        </span>
                                    </td>
                                    <td className="text-[var(--color-steel)]">{form.date}</td>
                                    <td>
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 rounded-lg hover:bg-[var(--glass-bg-light)] text-[var(--color-steel)] hover:text-white transition-colors">
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 rounded-lg hover:bg-[var(--glass-bg-light)] text-[var(--color-steel)] hover:text-white transition-colors">
                                                <Download className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
