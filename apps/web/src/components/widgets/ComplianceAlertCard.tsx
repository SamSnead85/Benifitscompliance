'use client';

import { motion } from 'framer-motion';
import {
    AlertTriangle,
    CheckCircle2,
    Clock,
    ChevronRight,
    Shield,
    Users,
    FileText,
    Calendar
} from 'lucide-react';

interface ComplianceAlertCardProps {
    className?: string;
}

interface Alert {
    id: string;
    severity: 'critical' | 'warning' | 'info';
    title: string;
    description: string;
    affectedCount?: number;
    deadline?: string;
    category: string;
    icon: React.ElementType;
}

const alerts: Alert[] = [
    {
        id: '1',
        severity: 'critical',
        title: '3 Employees Missing Offer Codes',
        description: 'Offer codes required before form generation',
        affectedCount: 3,
        deadline: 'Jan 31, 2026',
        category: 'Compliance',
        icon: Shield,
    },
    {
        id: '2',
        severity: 'warning',
        title: 'FTE Review Needed',
        description: '12 employees approaching variable hour determination',
        affectedCount: 12,
        deadline: 'Feb 15, 2026',
        category: 'Employees',
        icon: Users,
    },
    {
        id: '3',
        severity: 'warning',
        title: 'Forms Pending Review',
        description: '45 forms awaiting supervisor approval',
        affectedCount: 45,
        category: 'Forms',
        icon: FileText,
    },
    {
        id: '4',
        severity: 'info',
        title: 'Upcoming Filing Deadline',
        description: 'Electronic IRS filing deadline approaching',
        deadline: 'Mar 31, 2026',
        category: 'Deadlines',
        icon: Calendar,
    },
];

const severityConfig = {
    critical: {
        color: 'var(--color-critical)',
        bg: 'rgba(239,68,68,0.1)',
        icon: AlertTriangle
    },
    warning: {
        color: 'var(--color-warning)',
        bg: 'rgba(245,158,11,0.1)',
        icon: Clock
    },
    info: {
        color: 'var(--color-synapse-cyan)',
        bg: 'rgba(20,184,166,0.1)',
        icon: CheckCircle2
    },
};

export function ComplianceAlertCard({ className = '' }: ComplianceAlertCardProps) {
    const criticalCount = alerts.filter(a => a.severity === 'critical').length;
    const warningCount = alerts.filter(a => a.severity === 'warning').length;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card overflow-hidden ${className}`}
        >
            {/* Header */}
            <div className="p-4 border-b border-[var(--glass-border)]">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--color-warning)] to-[var(--color-critical)] flex items-center justify-center">
                            <AlertTriangle className="w-4 h-4 text-black" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Compliance Alerts</h3>
                            <p className="text-xs text-[var(--color-steel)]">
                                {criticalCount} critical, {warningCount} warnings
                            </p>
                        </div>
                    </div>
                    <button className="text-xs text-[var(--color-synapse-teal)] hover:underline">
                        View All
                    </button>
                </div>
            </div>

            {/* Alerts List */}
            <div className="divide-y divide-[var(--glass-border)]">
                {alerts.map((alert, i) => {
                    const config = severityConfig[alert.severity];
                    const CategoryIcon = alert.icon;

                    return (
                        <motion.button
                            key={alert.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="w-full p-4 hover:bg-[var(--glass-bg-light)] transition-colors text-left"
                        >
                            <div className="flex gap-3">
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: config.bg }}
                                >
                                    <CategoryIcon className="w-5 h-5" style={{ color: config.color }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span
                                            className="px-1.5 py-0.5 rounded text-xs uppercase font-medium"
                                            style={{ backgroundColor: config.bg, color: config.color }}
                                        >
                                            {alert.severity}
                                        </span>
                                        <span className="text-xs text-[var(--color-steel)]">{alert.category}</span>
                                    </div>
                                    <p className="font-medium text-white text-sm">{alert.title}</p>
                                    <p className="text-xs text-[var(--color-steel)] truncate">{alert.description}</p>
                                    <div className="flex items-center gap-3 mt-2">
                                        {alert.affectedCount && (
                                            <span className="text-xs text-[var(--color-steel)]">
                                                {alert.affectedCount} affected
                                            </span>
                                        )}
                                        {alert.deadline && (
                                            <span className="text-xs text-[var(--color-warning)]">
                                                Due: {alert.deadline}
                                            </span>
                                        )}
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-[var(--color-steel)] shrink-0" />
                            </div>
                        </motion.button>
                    );
                })}
            </div>
        </motion.div>
    );
}

export default ComplianceAlertCard;
