'use client';

import { motion } from 'framer-motion';
import {
    Calendar,
    CheckCircle2,
    Clock,
    AlertTriangle,
    FileText,
    Upload,
    Send,
    Flag
} from 'lucide-react';

interface TimelineEvent {
    id: string;
    date: string;
    title: string;
    description: string;
    status: 'completed' | 'current' | 'upcoming' | 'warning';
    type: 'deadline' | 'milestone' | 'submission' | 'review';
}

interface ComplianceTimelineProps {
    events?: TimelineEvent[];
    className?: string;
}

const defaultEvents: TimelineEvent[] = [
    {
        id: '1',
        date: 'Jan 1, 2026',
        title: 'Tax Year Begins',
        description: '2026 ACA compliance measurement period starts',
        status: 'completed',
        type: 'milestone'
    },
    {
        id: '2',
        date: 'Jan 15, 2026',
        title: 'Q4 Data Import',
        description: 'All Q4 2025 payroll data imported and validated',
        status: 'completed',
        type: 'milestone'
    },
    {
        id: '3',
        date: 'Jan 31, 2026',
        title: '1095-C Employee Deadline',
        description: 'Distribute 1095-C forms to all full-time employees',
        status: 'current',
        type: 'deadline'
    },
    {
        id: '4',
        date: 'Feb 28, 2026',
        title: 'IRS Electronic Filing',
        description: 'Submit 1094-C and 1095-C forms to IRS',
        status: 'upcoming',
        type: 'submission'
    },
    {
        id: '5',
        date: 'Mar 31, 2026',
        title: 'Paper Filing Deadline',
        description: 'Final deadline for paper submissions (if applicable)',
        status: 'upcoming',
        type: 'deadline'
    },
    {
        id: '6',
        date: 'Apr 15, 2026',
        title: 'Q1 Compliance Review',
        description: 'Review new hire ACA eligibility determinations',
        status: 'upcoming',
        type: 'review'
    },
];

const statusConfig = {
    completed: { icon: CheckCircle2, color: 'var(--color-success)', bgColor: 'rgba(16,185,129,0.15)' },
    current: { icon: Clock, color: 'var(--color-synapse-teal)', bgColor: 'rgba(6,182,212,0.15)' },
    upcoming: { icon: Calendar, color: 'var(--color-steel)', bgColor: 'var(--glass-bg-light)' },
    warning: { icon: AlertTriangle, color: 'var(--color-warning)', bgColor: 'rgba(245,158,11,0.15)' },
};

const typeIcon = {
    deadline: Flag,
    milestone: CheckCircle2,
    submission: Send,
    review: FileText,
};

export function ComplianceTimeline({ events = defaultEvents, className = '' }: ComplianceTimelineProps) {
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
                    <h3 className="font-semibold text-white">Compliance Timeline</h3>
                </div>
                <span className="text-xs text-[var(--color-steel)]">Tax Year 2026</span>
            </div>

            {/* Timeline */}
            <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-4 top-0 bottom-0 w-px bg-[var(--glass-border)]" />

                <div className="space-y-4">
                    {events.map((event, index) => {
                        const config = statusConfig[event.status];
                        const StatusIcon = config.icon;
                        const TypeIcon = typeIcon[event.type];

                        return (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                className={`relative pl-12 ${event.status === 'current' ? 'py-3' : 'py-2'
                                    }`}
                            >
                                {/* Status indicator */}
                                <div
                                    className="absolute left-0 w-8 h-8 rounded-full flex items-center justify-center border-2"
                                    style={{
                                        background: config.bgColor,
                                        borderColor: config.color
                                    }}
                                >
                                    <StatusIcon className="w-4 h-4" style={{ color: config.color }} />
                                </div>

                                {/* Content */}
                                <div className={`p-3 rounded-lg ${event.status === 'current'
                                        ? 'bg-[rgba(6,182,212,0.1)] border border-[var(--color-synapse-teal)]'
                                        : 'hover:bg-[var(--glass-bg-light)]'
                                    } transition-colors`}>
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <TypeIcon className="w-3 h-3" style={{ color: config.color }} />
                                            <span className="text-sm font-medium text-white">{event.title}</span>
                                        </div>
                                        <span className="text-xs" style={{ color: config.color }}>
                                            {event.date}
                                        </span>
                                    </div>
                                    <p className="text-xs text-[var(--color-steel)]">{event.description}</p>

                                    {event.status === 'current' && (
                                        <div className="mt-2 flex items-center gap-2">
                                            <span className="px-2 py-0.5 text-xs rounded bg-[var(--color-synapse-teal)] text-black font-medium">
                                                In Progress
                                            </span>
                                            <span className="text-xs text-[var(--color-synapse-teal)]">
                                                3 days remaining
                                            </span>
                                        </div>
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

export default ComplianceTimeline;
