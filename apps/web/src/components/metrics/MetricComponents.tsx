'use client';

import { motion } from 'framer-motion';
import { FileText, Users, Shield, Clock, TrendingUp, AlertCircle } from 'lucide-react';

interface MetricCardGridProps {
    className?: string;
}

interface Metric {
    id: string;
    label: string;
    value: string | number;
    change?: { value: number; direction: 'up' | 'down' };
    icon: React.ElementType;
    color: string;
}

const metrics: Metric[] = [
    { id: 'employees', label: 'Total Employees', value: '4,256', change: { value: 12, direction: 'up' }, icon: Users, color: 'var(--color-synapse-cyan)' },
    { id: 'fte', label: 'Full-Time Employees', value: '3,892', change: { value: 5, direction: 'up' }, icon: Users, color: 'var(--color-synapse-teal)' },
    { id: 'forms', label: 'Forms Generated', value: '3,847', icon: FileText, color: 'var(--color-synapse-gold)' },
    { id: 'compliance', label: 'Compliance Rate', value: '98.2%', change: { value: 1.2, direction: 'up' }, icon: Shield, color: 'var(--color-success)' },
    { id: 'pending', label: 'Pending Review', value: '45', icon: Clock, color: 'var(--color-warning)' },
    { id: 'issues', label: 'Open Issues', value: '8', change: { value: 3, direction: 'down' }, icon: AlertCircle, color: 'var(--color-critical)' },
];

export function MetricCardGrid({ className = '' }: MetricCardGridProps) {
    return (
        <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 ${className}`}>
            {metrics.map((metric, i) => {
                const Icon = metric.icon;

                return (
                    <motion.div
                        key={metric.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        whileHover={{ y: -2 }}
                        className="glass-card p-4"
                    >
                        <div
                            className="w-9 h-9 rounded-lg flex items-center justify-center mb-3"
                            style={{ backgroundColor: `${metric.color}20` }}
                        >
                            <Icon className="w-4 h-4" style={{ color: metric.color }} />
                        </div>
                        <p className="text-2xl font-bold text-white font-mono">{metric.value}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs text-[var(--color-steel)]">{metric.label}</p>
                            {metric.change && (
                                <span className={`text-xs ${metric.change.direction === 'up' ? 'text-[var(--color-success)]' : 'text-[var(--color-critical)]'
                                    }`}>
                                    {metric.change.direction === 'up' ? '↑' : '↓'} {metric.change.value}%
                                </span>
                            )}
                        </div>
                    </motion.div>
                );
            })}
        </div>
    );
}


// Compact stat row for sidebars
interface StatRowProps {
    label: string;
    value: string | number;
    icon?: React.ElementType;
    color?: string;
    className?: string;
}

export function StatRow({ label, value, icon: Icon, color, className = '' }: StatRowProps) {
    return (
        <div className={`flex items-center justify-between py-2 ${className}`}>
            <div className="flex items-center gap-2">
                {Icon && (
                    <Icon
                        className="w-4 h-4"
                        style={{ color: color || 'var(--color-steel)' }}
                    />
                )}
                <span className="text-sm text-[var(--color-steel)]">{label}</span>
            </div>
            <span className="text-sm font-medium text-white">{value}</span>
        </div>
    );
}


// Comparison stat component
interface ComparisonStatProps {
    label: string;
    current: number;
    previous: number;
    format?: (val: number) => string;
    positiveDirection?: 'up' | 'down';
    className?: string;
}

export function ComparisonStat({
    label,
    current,
    previous,
    format = (v) => v.toString(),
    positiveDirection = 'up',
    className = ''
}: ComparisonStatProps) {
    const change = ((current - previous) / previous) * 100;
    const isPositive = positiveDirection === 'up' ? change > 0 : change < 0;

    return (
        <div className={className}>
            <p className="text-xs text-[var(--color-steel)] mb-1">{label}</p>
            <div className="flex items-baseline gap-2">
                <span className="text-xl font-bold text-white">{format(current)}</span>
                <span className={`text-sm flex items-center gap-1 ${isPositive ? 'text-[var(--color-success)]' : 'text-[var(--color-critical)]'
                    }`}>
                    <TrendingUp className={`w-3 h-3 ${change < 0 ? 'rotate-180' : ''}`} />
                    {Math.abs(change).toFixed(1)}%
                </span>
            </div>
            <p className="text-xs text-[var(--color-steel)] mt-0.5">
                vs. {format(previous)} previous
            </p>
        </div>
    );
}

export default MetricCardGrid;
