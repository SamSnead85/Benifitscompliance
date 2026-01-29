'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar,
    Clock,
    Users,
    ChevronRight,
    Play,
    Pause,
    Settings,
    AlertCircle,
    CheckCircle2,
    BarChart3
} from 'lucide-react';

interface MeasurementPeriod {
    id: string;
    name: string;
    type: 'initial' | 'standard' | 'monthly';
    startDate: string;
    endDate: string;
    employeeCount: number;
    status: 'active' | 'completed' | 'upcoming';
    stabilityPeriod?: {
        startDate: string;
        endDate: string;
    };
    avgHours?: number;
    fteThreshold?: boolean;
}

interface MeasurementPeriodTrackerProps {
    periods?: MeasurementPeriod[];
    className?: string;
}

const defaultPeriods: MeasurementPeriod[] = [
    {
        id: '1',
        name: 'Standard 2026',
        type: 'standard',
        startDate: 'Jan 1, 2025',
        endDate: 'Dec 31, 2025',
        employeeCount: 11450,
        status: 'completed',
        stabilityPeriod: { startDate: 'Jan 1, 2026', endDate: 'Dec 31, 2026' },
        avgHours: 34.2,
        fteThreshold: true
    },
    {
        id: '2',
        name: 'Initial - Q4 2025 Hires',
        type: 'initial',
        startDate: 'Oct 1, 2025',
        endDate: 'Mar 31, 2026',
        employeeCount: 287,
        status: 'active',
        avgHours: 38.5,
        fteThreshold: true
    },
    {
        id: '3',
        name: 'Standard 2027',
        type: 'standard',
        startDate: 'Jan 1, 2026',
        endDate: 'Dec 31, 2026',
        employeeCount: 12100,
        status: 'active',
        avgHours: 35.1
    },
    {
        id: '4',
        name: 'Initial - Q1 2026 Hires',
        type: 'initial',
        startDate: 'Jan 1, 2026',
        endDate: 'Jun 30, 2026',
        employeeCount: 142,
        status: 'active'
    }
];

const typeConfig = {
    initial: { label: 'Initial', color: 'var(--color-synapse-cyan)' },
    standard: { label: 'Standard', color: 'var(--color-synapse-teal)' },
    monthly: { label: 'Monthly', color: 'var(--color-warning)' }
};

const statusConfig = {
    active: { icon: Play, color: 'var(--color-success)', label: 'Active' },
    completed: { icon: CheckCircle2, color: 'var(--color-synapse-teal)', label: 'Completed' },
    upcoming: { icon: Clock, color: 'var(--color-steel)', label: 'Upcoming' }
};

export function MeasurementPeriodTracker({
    periods = defaultPeriods,
    className = ''
}: MeasurementPeriodTrackerProps) {
    const [expandedPeriod, setExpandedPeriod] = useState<string | null>(null);

    const activePeriods = periods.filter(p => p.status === 'active').length;
    const totalEmployees = periods.filter(p => p.status === 'active').reduce((sum, p) => sum + p.employeeCount, 0);

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
                    <h3 className="font-semibold text-white">Measurement Period Tracker</h3>
                </div>
                <div className="flex items-center gap-4 text-sm">
                    <span className="text-[var(--color-success)]">{activePeriods} Active</span>
                    <span className="text-[var(--color-steel)]">{totalEmployees.toLocaleString()} Employees</span>
                </div>
            </div>

            {/* Timeline View */}
            <div className="relative mb-6">
                <div className="absolute left-8 top-0 bottom-0 w-px bg-[var(--glass-border)]" />

                <div className="space-y-4">
                    {periods.map((period, i) => {
                        const typeInfo = typeConfig[period.type];
                        const statusInfo = statusConfig[period.status];
                        const StatusIcon = statusInfo.icon;
                        const isExpanded = expandedPeriod === period.id;

                        return (
                            <motion.div
                                key={period.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="relative pl-16"
                            >
                                {/* Timeline Node */}
                                <div
                                    className="absolute left-4 w-8 h-8 rounded-full flex items-center justify-center border-2"
                                    style={{
                                        backgroundColor: `${statusInfo.color}20`,
                                        borderColor: statusInfo.color
                                    }}
                                >
                                    <StatusIcon className="w-4 h-4" style={{ color: statusInfo.color }} />
                                </div>

                                {/* Period Card */}
                                <div
                                    onClick={() => setExpandedPeriod(isExpanded ? null : period.id)}
                                    className="p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)] cursor-pointer hover:border-[var(--glass-border-hover)] transition-colors"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-white">{period.name}</span>
                                            <span
                                                className="px-2 py-0.5 rounded text-xs font-medium"
                                                style={{
                                                    backgroundColor: `${typeInfo.color}20`,
                                                    color: typeInfo.color
                                                }}
                                            >
                                                {typeInfo.label}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-[var(--color-steel)]" />
                                            <span className="text-sm text-[var(--color-silver)]">
                                                {period.employeeCount.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-xs text-[var(--color-steel)]">
                                        <span>{period.startDate} - {period.endDate}</span>
                                        {period.avgHours && (
                                            <>
                                                <span>•</span>
                                                <span>Avg: {period.avgHours} hrs/week</span>
                                            </>
                                        )}
                                        {period.fteThreshold !== undefined && (
                                            <>
                                                <span>•</span>
                                                <span className={period.fteThreshold ? 'text-[var(--color-success)]' : 'text-[var(--color-warning)]'}>
                                                    {period.fteThreshold ? 'FTE Eligible' : 'Below Threshold'}
                                                </span>
                                            </>
                                        )}
                                    </div>

                                    {/* Stability Period */}
                                    {isExpanded && period.stabilityPeriod && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            className="mt-3 pt-3 border-t border-[var(--glass-border)]"
                                        >
                                            <div className="flex items-center gap-2 text-sm">
                                                <Clock className="w-4 h-4 text-[var(--color-synapse-teal)]" />
                                                <span className="text-white">Stability Period:</span>
                                                <span className="text-[var(--color-silver)]">
                                                    {period.stabilityPeriod.startDate} - {period.stabilityPeriod.endDate}
                                                </span>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
}

export default MeasurementPeriodTracker;
