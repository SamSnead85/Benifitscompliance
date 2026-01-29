'use client';

import { motion } from 'framer-motion';
import {
    AlertCircle,
    Users,
    Shield,
    ChevronRight,
    Calendar,
    Clock
} from 'lucide-react';

interface CoverageGap {
    id: string;
    type: 'no_offer' | 'waiting_period' | 'affordability' | 'dependent_gap';
    employeeCount: number;
    severity: 'critical' | 'warning' | 'info';
    description: string;
    recommendation: string;
    deadline?: string;
}

interface CoverageGapDetectorProps {
    gaps?: CoverageGap[];
    totalEmployees?: number;
    className?: string;
}

const defaultGaps: CoverageGap[] = [
    {
        id: '1',
        type: 'waiting_period',
        employeeCount: 45,
        severity: 'warning',
        description: 'Employees in 90-day waiting period approaching eligibility',
        recommendation: 'Review offer timing to ensure coverage begins by eligibility date',
        deadline: 'Feb 15, 2026'
    },
    {
        id: '2',
        type: 'affordability',
        employeeCount: 23,
        severity: 'critical',
        description: 'Premium contributions exceed 9.12% affordability threshold',
        recommendation: 'Adjust employee contribution rates or verify safe harbor compliance',
        deadline: 'Jan 31, 2026'
    },
    {
        id: '3',
        type: 'no_offer',
        employeeCount: 12,
        severity: 'warning',
        description: 'Full-time employees without documented coverage offer',
        recommendation: 'Generate offer letters and document in system',
        deadline: 'Feb 1, 2026'
    },
    {
        id: '4',
        type: 'dependent_gap',
        employeeCount: 8,
        severity: 'info',
        description: 'Dependents added mid-year without qualifying event documentation',
        recommendation: 'Request QLE documentation for affected enrollments'
    }
];

const gapTypeConfig = {
    no_offer: { label: 'No Coverage Offer', color: 'var(--color-critical)' },
    waiting_period: { label: 'Waiting Period', color: 'var(--color-warning)' },
    affordability: { label: 'Affordability Issue', color: 'var(--color-critical)' },
    dependent_gap: { label: 'Dependent Coverage', color: 'var(--color-synapse-teal)' }
};

const severityConfig = {
    critical: { bgColor: 'rgba(239,68,68,0.15)', borderColor: 'rgba(239,68,68,0.3)', textColor: 'var(--color-critical)' },
    warning: { bgColor: 'rgba(245,158,11,0.15)', borderColor: 'rgba(245,158,11,0.3)', textColor: 'var(--color-warning)' },
    info: { bgColor: 'rgba(6,182,212,0.15)', borderColor: 'rgba(6,182,212,0.3)', textColor: 'var(--color-synapse-teal)' }
};

export function CoverageGapDetector({
    gaps = defaultGaps,
    totalEmployees = 12847,
    className = ''
}: CoverageGapDetectorProps) {
    const totalAffected = gaps.reduce((sum, g) => sum + g.employeeCount, 0);
    const criticalCount = gaps.filter(g => g.severity === 'critical').length;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-6 ${className}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-[var(--color-warning)]" />
                    <h3 className="font-semibold text-white">Coverage Gap Detection</h3>
                </div>
                {criticalCount > 0 && (
                    <span className="px-2 py-1 rounded text-xs font-medium bg-[var(--color-critical)] text-white">
                        {criticalCount} Critical
                    </span>
                )}
            </div>

            {/* Summary */}
            <div className="flex items-center gap-6 mb-6 p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]">
                <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-[var(--color-steel)]" />
                    <div>
                        <p className="text-xl font-bold text-white font-mono">{totalAffected}</p>
                        <p className="text-xs text-[var(--color-steel)]">Employees Affected</p>
                    </div>
                </div>
                <div className="h-10 w-px bg-[var(--glass-border)]" />
                <div>
                    <p className="text-xl font-bold text-[var(--color-synapse-teal)] font-mono">
                        {((1 - totalAffected / totalEmployees) * 100).toFixed(1)}%
                    </p>
                    <p className="text-xs text-[var(--color-steel)]">Gap-Free Coverage</p>
                </div>
                <div className="h-10 w-px bg-[var(--glass-border)]" />
                <div>
                    <p className="text-xl font-bold text-white font-mono">{gaps.length}</p>
                    <p className="text-xs text-[var(--color-steel)]">Issues Detected</p>
                </div>
            </div>

            {/* Gap List */}
            <div className="space-y-3">
                {gaps.map((gap, i) => {
                    const typeConfig = gapTypeConfig[gap.type];
                    const severity = severityConfig[gap.severity];

                    return (
                        <motion.div
                            key={gap.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="p-4 rounded-lg border cursor-pointer hover:border-[var(--glass-border-hover)] transition-colors"
                            style={{
                                backgroundColor: severity.bgColor,
                                borderColor: severity.borderColor
                            }}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span
                                        className="px-2 py-0.5 rounded text-xs font-medium"
                                        style={{
                                            backgroundColor: severity.bgColor,
                                            color: typeConfig.color,
                                            border: `1px solid ${severity.borderColor}`
                                        }}
                                    >
                                        {typeConfig.label}
                                    </span>
                                    <span className="text-sm font-medium text-white">
                                        {gap.employeeCount} employees
                                    </span>
                                </div>
                                {gap.deadline && (
                                    <div className="flex items-center gap-1 text-xs" style={{ color: severity.textColor }}>
                                        <Clock className="w-3 h-3" />
                                        {gap.deadline}
                                    </div>
                                )}
                            </div>
                            <p className="text-sm text-[var(--color-silver)] mb-2">{gap.description}</p>
                            <div className="flex items-center justify-between">
                                <p className="text-xs text-[var(--color-steel)]">
                                    <strong>Recommendation:</strong> {gap.recommendation}
                                </p>
                                <ChevronRight className="w-4 h-4 text-[var(--color-steel)]" />
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}

export default CoverageGapDetector;
