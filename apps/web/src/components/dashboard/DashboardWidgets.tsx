'use client';

import { motion } from 'framer-motion';
import {
    TrendingUp,
    TrendingDown,
    Users,
    FileText,
    Shield,
    Clock,
    AlertTriangle,
    ArrowRight,
    CheckCircle2
} from 'lucide-react';

interface ComplianceScoreWidgetProps {
    className?: string;
    score?: number;
    previousScore?: number;
}

export function ComplianceScoreWidget({
    className = '',
    score = 98.2,
    previousScore = 96.1
}: ComplianceScoreWidgetProps) {
    const change = score - previousScore;
    const segments = [
        { label: 'Offer Coverage', value: 99.5, color: 'var(--color-success)' },
        { label: 'Safe Harbor', value: 97.8, color: 'var(--color-synapse-teal)' },
        { label: 'Data Quality', value: 97.2, color: 'var(--color-synapse-cyan)' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-5 ${className}`}
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                    Compliance Score
                </h3>
                <span className={`text-xs flex items-center gap-1 ${change >= 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-critical)]'
                    }`}>
                    {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {change >= 0 ? '+' : ''}{change.toFixed(1)}%
                </span>
            </div>

            {/* Main Score */}
            <div className="flex items-center gap-4 mb-6">
                <div className="relative w-24 h-24">
                    <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
                        <circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="var(--glass-bg)"
                            strokeWidth="8"
                        />
                        <motion.circle
                            cx="50"
                            cy="50"
                            r="45"
                            fill="none"
                            stroke="url(#scoreGradient)"
                            strokeWidth="8"
                            strokeLinecap="round"
                            strokeDasharray={`${(score / 100) * 283} 283`}
                            initial={{ strokeDasharray: '0 283' }}
                            animate={{ strokeDasharray: `${(score / 100) * 283} 283` }}
                            transition={{ duration: 1.5, ease: 'easeOut' }}
                        />
                        <defs>
                            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="var(--color-synapse-teal)" />
                                <stop offset="100%" stopColor="var(--color-success)" />
                            </linearGradient>
                        </defs>
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">{score.toFixed(1)}%</span>
                    </div>
                </div>
                <div className="flex-1">
                    <p className="text-sm text-[var(--color-steel)] mb-2">Overall ACA compliance health</p>
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[var(--color-success)]" />
                        <span className="text-sm text-[var(--color-success)]">Excellent standing</span>
                    </div>
                </div>
            </div>

            {/* Score Breakdown */}
            <div className="space-y-3">
                {segments.map((segment) => (
                    <div key={segment.label}>
                        <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-[var(--color-steel)]">{segment.label}</span>
                            <span className="text-white font-mono">{segment.value}%</span>
                        </div>
                        <div className="h-1.5 rounded-full bg-[var(--glass-bg)] overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${segment.value}%` }}
                                transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
                                className="h-full rounded-full"
                                style={{ backgroundColor: segment.color }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}


interface DeadlineCountdownWidgetProps {
    className?: string;
}

export function DeadlineCountdownWidget({ className = '' }: DeadlineCountdownWidgetProps) {
    const deadlines = [
        { label: '1095-C Distribution', date: new Date(2026, 2, 2), daysLeft: 33 },
        { label: 'IRS Electronic Filing', date: new Date(2026, 2, 31), daysLeft: 62 },
        { label: 'Paper Filing (if applicable)', date: new Date(2026, 1, 28), daysLeft: 31 },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-5 ${className}`}
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[var(--color-synapse-gold)]" />
                    Key Deadlines
                </h3>
            </div>

            <div className="space-y-3">
                {deadlines.map((deadline, i) => (
                    <motion.div
                        key={deadline.label}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-3 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]"
                    >
                        <div className="flex items-center justify-between mb-1">
                            <span className="text-sm text-white">{deadline.label}</span>
                            <span className={`text-xs font-bold ${deadline.daysLeft <= 14
                                    ? 'text-[var(--color-critical)]'
                                    : deadline.daysLeft <= 30
                                        ? 'text-[var(--color-warning)]'
                                        : 'text-[var(--color-steel)]'
                                }`}>
                                {deadline.daysLeft} days
                            </span>
                        </div>
                        <p className="text-xs text-[var(--color-steel)]">
                            {deadline.date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </p>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}


interface QuickStatsWidgetProps {
    className?: string;
}

export function QuickStatsWidget({ className = '' }: QuickStatsWidgetProps) {
    const stats = [
        { label: 'Total Employees', value: '4,521', icon: Users, color: 'var(--color-synapse-teal)' },
        { label: 'FTEs', value: '412', icon: Users, color: 'var(--color-synapse-cyan)' },
        { label: 'Forms Ready', value: '4,498', icon: FileText, color: 'var(--color-synapse-gold)' },
        { label: 'Pending Review', value: '23', icon: AlertTriangle, color: 'var(--color-warning)' },
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-5 ${className}`}
        >
            <h3 className="font-semibold text-white mb-4">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-3">
                {stats.map((stat, i) => {
                    const Icon = stat.icon;
                    return (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-3 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]"
                        >
                            <div className="flex items-center gap-2 mb-2">
                                <Icon className="w-4 h-4" style={{ color: stat.color }} />
                                <span className="text-xs text-[var(--color-steel)]">{stat.label}</span>
                            </div>
                            <p className="text-xl font-bold text-white font-mono">{stat.value}</p>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}

export { ComplianceScoreWidget as default };
