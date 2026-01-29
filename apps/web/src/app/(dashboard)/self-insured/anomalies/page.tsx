'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    AlertTriangle,
    TrendingUp,
    DollarSign,
    Users,
    Calendar,
    Filter,
    Download,
    Eye,
    CheckCircle2,
    XCircle,
    ChevronRight,
    Zap,
    Brain,
    ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const stagger = {
    visible: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

// AI-detected anomalies
const anomalies = [
    {
        id: 'ANM-001',
        type: 'high_cost_claimant',
        severity: 'critical',
        title: 'High-Cost Claimant Detected',
        description: 'Member ID 4521 has accumulated $145,000 in claims YTD, representing 18% of total plan spend.',
        predictedImpact: '+$85,000 projected through year-end',
        aiRecommendation: 'Review for stop-loss attachment. Consider care management intervention.',
        detectedAt: '2 hours ago',
        category: 'Medical',
        status: 'new'
    },
    {
        id: 'ANM-002',
        type: 'trend_deviation',
        severity: 'high',
        title: 'Pharmacy Trend Spike',
        description: 'Pharmacy PMPM increased 23% month-over-month, significantly above 9% annual trend assumption.',
        predictedImpact: '+$12,400/month if sustained',
        aiRecommendation: 'Investigate GLP-1 utilization. Review formulary tier placement.',
        detectedAt: '1 day ago',
        category: 'Pharmacy',
        status: 'investigating'
    },
    {
        id: 'ANM-003',
        type: 'utilization_pattern',
        severity: 'medium',
        title: 'ER Utilization Pattern',
        description: 'Emergency room visits up 15% vs. prior period with lower acuity codes.',
        predictedImpact: '+$8,200 projected quarterly',
        aiRecommendation: 'Consider telemedicine promotion to redirect non-emergency visits.',
        detectedAt: '3 days ago',
        category: 'Medical',
        status: 'acknowledged'
    },
    {
        id: 'ANM-004',
        type: 'enrollment_mismatch',
        severity: 'low',
        title: 'Enrollment Count Variance',
        description: 'Claims enrollment (412) differs from HR census (418) by 6 members.',
        predictedImpact: 'Potential $2,400 PEPM calculation error',
        aiRecommendation: 'Reconcile enrollment files with carrier. Check late adds/terms.',
        detectedAt: '5 days ago',
        category: 'Data Quality',
        status: 'resolved'
    },
];

const anomalyStats = {
    total: 12,
    critical: 2,
    high: 4,
    medium: 4,
    low: 2,
    resolved: 8
};

function SeverityBadge({ severity }: { severity: string }) {
    const config = {
        critical: { label: 'Critical', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
        high: { label: 'High', className: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
        medium: { label: 'Medium', className: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' },
        low: { label: 'Low', className: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
    }[severity] || { label: severity, className: 'bg-gray-500/20 text-gray-400' };

    return (
        <span className={`text-xs px-2 py-1 rounded border ${config.className}`}>
            {config.label}
        </span>
    );
}

function StatusBadge({ status }: { status: string }) {
    const config = {
        new: { label: 'New', className: 'badge--critical', icon: AlertTriangle },
        investigating: { label: 'Investigating', className: 'badge--warning', icon: Eye },
        acknowledged: { label: 'Acknowledged', className: 'badge--info', icon: CheckCircle2 },
        resolved: { label: 'Resolved', className: 'badge--success', icon: CheckCircle2 },
    }[status] || { label: status, className: 'badge--info', icon: Eye };

    return (
        <span className={`badge ${config.className}`}>
            {config.label}
        </span>
    );
}

export default function AnomaliesPage() {
    const [selectedSeverity, setSelectedSeverity] = useState('all');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const filteredAnomalies = selectedSeverity === 'all'
        ? anomalies
        : anomalies.filter(a => a.severity === selectedSeverity);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <Link href="/self-insured" className="text-sm text-[var(--color-steel)] hover:text-white mb-2 inline-flex items-center gap-1">
                        <ArrowLeft className="w-4 h-4" /> Back to Self-Insured
                    </Link>
                    <h1 className="text-2xl font-bold text-white mt-2 flex items-center gap-3">
                        <Brain className="w-7 h-7 text-[var(--color-synapse-teal)]" />
                        AI Anomaly Detection
                    </h1>
                    <p className="text-[var(--color-steel)] mt-1">AI-powered claims analysis and trend monitoring</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="btn-secondary">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                    <button className="btn-primary">
                        <Zap className="w-4 h-4" />
                        Run Analysis
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <motion.div
                variants={stagger}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 md:grid-cols-6 gap-4"
            >
                {[
                    { label: 'Total Anomalies', value: anomalyStats.total, color: 'var(--color-synapse-teal)' },
                    { label: 'Critical', value: anomalyStats.critical, color: '#ef4444' },
                    { label: 'High', value: anomalyStats.high, color: '#f97316' },
                    { label: 'Medium', value: anomalyStats.medium, color: '#eab308' },
                    { label: 'Low', value: anomalyStats.low, color: '#3b82f6' },
                    { label: 'Resolved', value: anomalyStats.resolved, color: 'var(--color-success)' },
                ].map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        variants={fadeInUp}
                        className="glass-card p-4 text-center"
                    >
                        <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
                        <div className="text-xs text-[var(--color-steel)] mt-1">{stat.label}</div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Filters */}
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4 text-[var(--color-steel)]" />
                    <span className="text-sm text-[var(--color-steel)]">Filter by:</span>
                </div>
                {['all', 'critical', 'high', 'medium', 'low'].map((severity) => (
                    <button
                        key={severity}
                        onClick={() => setSelectedSeverity(severity)}
                        className={`text-sm px-3 py-1.5 rounded-lg transition-colors ${selectedSeverity === severity
                                ? 'bg-[var(--color-synapse-teal)] text-black'
                                : 'bg-[var(--glass-bg-light)] text-[var(--color-silver)] hover:text-white'
                            }`}
                    >
                        {severity.charAt(0).toUpperCase() + severity.slice(1)}
                    </button>
                ))}
            </div>

            {/* Anomalies List */}
            <motion.div
                variants={stagger}
                initial="hidden"
                animate="visible"
                className="space-y-4"
            >
                {filteredAnomalies.map((anomaly) => (
                    <motion.div
                        key={anomaly.id}
                        variants={fadeInUp}
                        className="glass-card overflow-hidden"
                    >
                        <button
                            onClick={() => setExpandedId(expandedId === anomaly.id ? null : anomaly.id)}
                            className="w-full p-5 text-left"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-4">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${anomaly.severity === 'critical' ? 'bg-red-500/20' :
                                            anomaly.severity === 'high' ? 'bg-orange-500/20' :
                                                anomaly.severity === 'medium' ? 'bg-yellow-500/20' : 'bg-blue-500/20'
                                        }`}>
                                        <AlertTriangle className={`w-5 h-5 ${anomaly.severity === 'critical' ? 'text-red-400' :
                                                anomaly.severity === 'high' ? 'text-orange-400' :
                                                    anomaly.severity === 'medium' ? 'text-yellow-400' : 'text-blue-400'
                                            }`} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3 mb-1">
                                            <span className="font-semibold text-white">{anomaly.title}</span>
                                            <SeverityBadge severity={anomaly.severity} />
                                            <StatusBadge status={anomaly.status} />
                                        </div>
                                        <p className="text-sm text-[var(--color-steel)]">{anomaly.description}</p>
                                        <div className="flex items-center gap-4 mt-2 text-xs text-[var(--color-steel)]">
                                            <span className="flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {anomaly.detectedAt}
                                            </span>
                                            <span className="px-2 py-0.5 rounded bg-[var(--glass-bg)] border border-[var(--glass-border)]">
                                                {anomaly.category}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <ChevronRight className={`w-5 h-5 text-[var(--color-steel)] transition-transform ${expandedId === anomaly.id ? 'rotate-90' : ''
                                    }`} />
                            </div>
                        </button>

                        {/* Expanded Details */}
                        {expandedId === anomaly.id && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="border-t border-[var(--glass-border)] p-5 bg-[var(--glass-bg-light)]"
                            >
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="text-sm font-semibold text-[var(--color-synapse-teal)] mb-2 flex items-center gap-2">
                                            <TrendingUp className="w-4 h-4" />
                                            Predicted Impact
                                        </h4>
                                        <p className="text-sm text-white">{anomaly.predictedImpact}</p>
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-[var(--color-synapse-teal)] mb-2 flex items-center gap-2">
                                            <Brain className="w-4 h-4" />
                                            AI Recommendation
                                        </h4>
                                        <p className="text-sm text-white">{anomaly.aiRecommendation}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-[var(--glass-border)]">
                                    <button className="btn-primary text-sm">
                                        <CheckCircle2 className="w-4 h-4" />
                                        Acknowledge
                                    </button>
                                    <button className="btn-secondary text-sm">
                                        <Eye className="w-4 h-4" />
                                        View Details
                                    </button>
                                    {anomaly.status !== 'resolved' && (
                                        <button className="btn-secondary text-sm">
                                            <XCircle className="w-4 h-4" />
                                            Dismiss
                                        </button>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
}
