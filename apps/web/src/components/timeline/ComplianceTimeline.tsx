'use client';

import { motion } from 'framer-motion';
import {
    Calendar,
    CheckCircle2,
    Clock,
    AlertCircle,
    FileText,
    Users,
    Shield,
    Upload,
    ChevronRight
} from 'lucide-react';

interface ComplianceTimelineProps {
    className?: string;
    year?: number;
}

interface TimelineEvent {
    id: string;
    date: string;
    title: string;
    description: string;
    status: 'complete' | 'current' | 'upcoming' | 'overdue';
    icon: React.ElementType;
    category: 'filing' | 'deadline' | 'action' | 'milestone';
}

const generateEvents = (year: number): TimelineEvent[] => [
    {
        id: '1',
        date: `Jan 31, ${year}`,
        title: '1095-C Employee Distribution',
        description: 'Furnish forms to all FT employees',
        status: 'complete',
        icon: FileText,
        category: 'deadline'
    },
    {
        id: '2',
        date: `Feb 28, ${year}`,
        title: 'Corrections Window Opens',
        description: '30-day correction period begins',
        status: 'complete',
        icon: Clock,
        category: 'milestone'
    },
    {
        id: '3',
        date: `Mar 31, ${year}`,
        title: 'Electronic IRS Filing',
        description: 'Submit 1094-C and 1095-C to IRS',
        status: 'current',
        icon: Upload,
        category: 'filing'
    },
    {
        id: '4',
        date: `Apr 15, ${year}`,
        title: 'Paper Filing Deadline',
        description: 'For organizations filing paper forms',
        status: 'upcoming',
        icon: FileText,
        category: 'deadline'
    },
    {
        id: '5',
        date: `Jun 30, ${year}`,
        title: 'Mid-Year FTE Review',
        description: 'Review FTE status for new hires',
        status: 'upcoming',
        icon: Users,
        category: 'action'
    },
    {
        id: '6',
        date: `Sep 30, ${year}`,
        title: 'Q3 Compliance Audit',
        description: 'Internal compliance review',
        status: 'upcoming',
        icon: Shield,
        category: 'action'
    },
    {
        id: '7',
        date: `Dec 31, ${year}`,
        title: 'Year-End Data Freeze',
        description: 'Finalize all employee records',
        status: 'upcoming',
        icon: Calendar,
        category: 'milestone'
    },
];

const statusColors = {
    complete: 'var(--color-success)',
    current: 'var(--color-synapse-teal)',
    upcoming: 'var(--color-steel)',
    overdue: 'var(--color-critical)',
};

const categoryColors = {
    filing: 'var(--color-synapse-gold)',
    deadline: 'var(--color-critical)',
    action: 'var(--color-synapse-cyan)',
    milestone: 'var(--color-synapse-violet)',
};

export function ComplianceTimeline({ className = '', year = 2026 }: ComplianceTimelineProps) {
    const events = generateEvents(year);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card overflow-hidden ${className}`}
        >
            {/* Header */}
            <div className="p-5 border-b border-[var(--glass-border)]">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--color-synapse-teal)] to-[var(--color-synapse-cyan)] flex items-center justify-center">
                            <Calendar className="w-4 h-4 text-black" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Compliance Timeline</h3>
                            <p className="text-xs text-[var(--color-steel)]">Tax Year {year}</p>
                        </div>
                    </div>
                    <button className="text-xs text-[var(--color-synapse-teal)] hover:underline flex items-center gap-1">
                        Full Calendar <ChevronRight className="w-3 h-3" />
                    </button>
                </div>
            </div>

            {/* Timeline */}
            <div className="p-5">
                <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-[18px] top-0 bottom-0 w-0.5 bg-[var(--glass-border)]" />

                    {events.map((event, i) => {
                        const Icon = event.icon;
                        const statusColor = statusColors[event.status];

                        return (
                            <motion.div
                                key={event.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="relative pl-12 pb-6 last:pb-0"
                            >
                                {/* Node */}
                                <div
                                    className="absolute left-0 w-9 h-9 rounded-lg flex items-center justify-center"
                                    style={{ backgroundColor: `${statusColor}20` }}
                                >
                                    {event.status === 'complete' ? (
                                        <CheckCircle2 className="w-4 h-4" style={{ color: statusColor }} />
                                    ) : event.status === 'current' ? (
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                        >
                                            <Icon className="w-4 h-4" style={{ color: statusColor }} />
                                        </motion.div>
                                    ) : (
                                        <Icon className="w-4 h-4" style={{ color: statusColor }} />
                                    )}
                                </div>

                                {/* Content */}
                                <div className={`p-3 rounded-lg border transition-colors ${event.status === 'current'
                                        ? 'bg-[rgba(20,184,166,0.1)] border-[var(--color-synapse-teal)]'
                                        : 'bg-[var(--glass-bg-light)] border-[var(--glass-border)] hover:border-[var(--glass-border-hover)]'
                                    }`}>
                                    <div className="flex items-center justify-between mb-1">
                                        <span
                                            className="text-xs px-2 py-0.5 rounded"
                                            style={{
                                                backgroundColor: `${categoryColors[event.category]}20`,
                                                color: categoryColors[event.category]
                                            }}
                                        >
                                            {event.category}
                                        </span>
                                        <span className="text-xs text-[var(--color-steel)]">{event.date}</span>
                                    </div>
                                    <p className="font-medium text-white text-sm">{event.title}</p>
                                    <p className="text-xs text-[var(--color-steel)]">{event.description}</p>
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
