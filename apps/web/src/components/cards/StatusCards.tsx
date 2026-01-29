'use client';

import { motion } from 'framer-motion';
import {
    TrendingUp,
    TrendingDown,
    ArrowRight,
    Users,
    FileText,
    Shield,
    DollarSign,
    Clock,
    CheckCircle2,
    AlertTriangle
} from 'lucide-react';

interface StatusCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: React.ElementType;
    trend?: {
        value: number;
        direction: 'up' | 'down';
        isPositive?: boolean;
    };
    status?: 'success' | 'warning' | 'critical' | 'neutral';
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

const statusColors = {
    success: 'var(--color-success)',
    warning: 'var(--color-warning)',
    critical: 'var(--color-critical)',
    neutral: 'var(--color-synapse-teal)',
};

export function StatusCard({
    title,
    value,
    subtitle,
    icon: Icon,
    trend,
    status = 'neutral',
    action,
    className = ''
}: StatusCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -2 }}
            className={`glass-card p-5 ${className}`}
        >
            <div className="flex items-start justify-between mb-3">
                <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: `${statusColors[status]}20` }}
                >
                    <Icon className="w-5 h-5" style={{ color: statusColors[status] }} />
                </div>
                {trend && (
                    <div className={`flex items-center gap-1 text-xs ${trend.isPositive !== false
                            ? trend.direction === 'up'
                                ? 'text-[var(--color-success)]'
                                : 'text-[var(--color-critical)]'
                            : trend.direction === 'up'
                                ? 'text-[var(--color-critical)]'
                                : 'text-[var(--color-success)]'
                        }`}>
                        {trend.direction === 'up'
                            ? <TrendingUp className="w-3 h-3" />
                            : <TrendingDown className="w-3 h-3" />
                        }
                        {trend.value}%
                    </div>
                )}
            </div>

            <div className="mb-1">
                <p className="text-3xl font-bold text-white font-mono">{value}</p>
            </div>

            <p className="text-sm text-[var(--color-steel)] mb-1">{title}</p>
            {subtitle && (
                <p className="text-xs text-[var(--color-steel)] opacity-70">{subtitle}</p>
            )}

            {action && (
                <button
                    onClick={action.onClick}
                    className="mt-3 flex items-center gap-1 text-xs font-medium text-[var(--color-synapse-teal)] hover:underline"
                >
                    {action.label}
                    <ArrowRight className="w-3 h-3" />
                </button>
            )}
        </motion.div>
    );
}


// Pre-built status card variants
export function EmployeeCountCard({ count, change }: { count: number; change: number }) {
    return (
        <StatusCard
            title="Total Employees"
            value={count.toLocaleString()}
            subtitle="Active in current period"
            icon={Users}
            trend={{ value: Math.abs(change), direction: change >= 0 ? 'up' : 'down' }}
            status="neutral"
        />
    );
}

export function FTECountCard({ count, threshold = 50 }: { count: number; threshold?: number }) {
    return (
        <StatusCard
            title="Full-Time Equivalent"
            value={count}
            subtitle={count >= threshold ? 'ACA reporting required' : `Below ${threshold} threshold`}
            icon={Users}
            status={count >= threshold ? 'success' : 'warning'}
        />
    );
}

export function FormsReadyCard({ ready, total }: { ready: number; total: number }) {
    const percent = Math.round((ready / total) * 100);
    return (
        <StatusCard
            title="Forms Ready"
            value={`${ready.toLocaleString()} / ${total.toLocaleString()}`}
            subtitle={`${percent}% complete`}
            icon={FileText}
            status={percent === 100 ? 'success' : percent >= 90 ? 'neutral' : 'warning'}
            action={{ label: 'View forms', onClick: () => { } }}
        />
    );
}

export function ComplianceScoreCard({ score, previousScore }: { score: number; previousScore: number }) {
    const change = score - previousScore;
    return (
        <StatusCard
            title="Compliance Score"
            value={`${score.toFixed(1)}%`}
            icon={Shield}
            trend={{ value: Math.abs(change), direction: change >= 0 ? 'up' : 'down' }}
            status={score >= 98 ? 'success' : score >= 95 ? 'neutral' : 'warning'}
        />
    );
}

export function PenaltyExposureCard({ amount }: { amount: number }) {
    return (
        <StatusCard
            title="Estimated Penalty Exposure"
            value={`$${amount.toLocaleString()}`}
            subtitle="Based on current data"
            icon={DollarSign}
            status={amount === 0 ? 'success' : amount < 10000 ? 'warning' : 'critical'}
        />
    );
}

export function DeadlineCard({ daysRemaining, deadline }: { daysRemaining: number; deadline: string }) {
    return (
        <StatusCard
            title="Next Deadline"
            value={`${daysRemaining} days`}
            subtitle={deadline}
            icon={Clock}
            status={daysRemaining <= 7 ? 'critical' : daysRemaining <= 30 ? 'warning' : 'neutral'}
            action={{ label: 'View calendar', onClick: () => { } }}
        />
    );
}

export function IssuesCard({ critical, warnings }: { critical: number; warnings: number }) {
    const total = critical + warnings;
    return (
        <StatusCard
            title="Issues Requiring Attention"
            value={total}
            subtitle={`${critical} critical, ${warnings} warnings`}
            icon={total === 0 ? CheckCircle2 : AlertTriangle}
            status={critical > 0 ? 'critical' : warnings > 0 ? 'warning' : 'success'}
            action={total > 0 ? { label: 'Review issues', onClick: () => { } } : undefined}
        />
    );
}

export default StatusCard;
