'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    Clock,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    ChevronRight,
    Bell,
    Filter
} from 'lucide-react';

interface Deadline {
    id: string;
    title: string;
    description: string;
    dueDate: string;
    type: 'filing' | 'distribution' | 'correction' | 'review';
    status: 'upcoming' | 'due-soon' | 'overdue' | 'completed';
    priority: 'high' | 'medium' | 'low';
    taxYear?: number;
}

interface DeadlineManagerProps {
    deadlines?: Deadline[];
    onDeadlineClick?: (deadline: Deadline) => void;
    onSetReminder?: (deadline: Deadline) => void;
    className?: string;
}

const defaultDeadlines: Deadline[] = [
    {
        id: '1',
        title: 'Employee Form Distribution',
        description: 'Furnish 1095-C forms to all full-time employees',
        dueDate: '2026-01-31',
        type: 'distribution',
        status: 'due-soon',
        priority: 'high',
        taxYear: 2025
    },
    {
        id: '2',
        title: 'IRS Electronic Filing',
        description: 'Submit 1094-C and 1095-C forms to IRS',
        dueDate: '2026-03-31',
        type: 'filing',
        status: 'upcoming',
        priority: 'high',
        taxYear: 2025
    },
    {
        id: '3',
        title: 'Correction Window Closes',
        description: 'Last day to submit corrections for 2024 forms',
        dueDate: '2026-04-15',
        type: 'correction',
        status: 'upcoming',
        priority: 'medium',
        taxYear: 2024
    },
];

const statusConfig = {
    'upcoming': { color: 'var(--color-synapse-cyan)', label: 'Upcoming', icon: Clock },
    'due-soon': { color: 'var(--color-warning)', label: 'Due Soon', icon: AlertTriangle },
    'overdue': { color: 'var(--color-critical)', label: 'Overdue', icon: XCircle },
    'completed': { color: 'var(--color-success)', label: 'Completed', icon: CheckCircle2 },
};

const priorityColors = {
    high: 'var(--color-critical)',
    medium: 'var(--color-warning)',
    low: 'var(--color-steel)',
};

export function DeadlineManager({
    deadlines = defaultDeadlines,
    onDeadlineClick,
    onSetReminder,
    className = ''
}: DeadlineManagerProps) {
    const [filter, setFilter] = useState<string>('all');
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const filteredDeadlines = deadlines.filter(d =>
        filter === 'all' || d.status === filter || d.type === filter
    );

    const getDaysRemaining = (dueDate: string) => {
        const due = new Date(dueDate);
        const today = new Date();
        const diff = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return diff;
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <div className={`glass-card ${className}`}>
            {/* Header */}
            <div className="p-4 border-b border-[var(--glass-border)]">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-warning)] to-[var(--color-synapse-gold)] flex items-center justify-center">
                            <Calendar className="w-5 h-5 text-black" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Compliance Deadlines</h3>
                            <p className="text-xs text-[var(--color-steel)]">{filteredDeadlines.length} deadlines</p>
                        </div>
                    </div>
                    <button className="p-2 rounded-lg hover:bg-[var(--glass-bg)] transition-colors">
                        <Filter className="w-4 h-4 text-[var(--color-steel)]" />
                    </button>
                </div>

                {/* Filter tabs */}
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {['all', 'due-soon', 'upcoming', 'filing', 'distribution'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${filter === f
                                    ? 'bg-[var(--color-synapse-teal)] text-black'
                                    : 'bg-[var(--glass-bg)] text-[var(--color-steel)] hover:text-white'
                                }`}
                        >
                            {f.charAt(0).toUpperCase() + f.slice(1).replace('-', ' ')}
                        </button>
                    ))}
                </div>
            </div>

            {/* Deadline list */}
            <div className="divide-y divide-[var(--glass-border)]">
                {filteredDeadlines.map((deadline, i) => {
                    const config = statusConfig[deadline.status];
                    const StatusIcon = config.icon;
                    const daysRemaining = getDaysRemaining(deadline.dueDate);
                    const isExpanded = expandedId === deadline.id;

                    return (
                        <motion.div
                            key={deadline.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                        >
                            <div
                                onClick={() => setExpandedId(isExpanded ? null : deadline.id)}
                                className="p-4 cursor-pointer hover:bg-[var(--glass-bg)] transition-colors"
                            >
                                <div className="flex items-start gap-3">
                                    {/* Priority indicator */}
                                    <div
                                        className="w-1 h-12 rounded-full"
                                        style={{ backgroundColor: priorityColors[deadline.priority] }}
                                    />

                                    {/* Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-medium text-white truncate">{deadline.title}</h4>
                                            <span
                                                className="px-2 py-0.5 rounded text-xs"
                                                style={{
                                                    backgroundColor: `${config.color}20`,
                                                    color: config.color
                                                }}
                                            >
                                                {config.label}
                                            </span>
                                        </div>
                                        <p className="text-xs text-[var(--color-steel)] mb-2 line-clamp-1">
                                            {deadline.description}
                                        </p>
                                        <div className="flex items-center gap-4 text-xs">
                                            <span className="flex items-center gap-1 text-[var(--color-steel)]">
                                                <Calendar className="w-3 h-3" />
                                                {formatDate(deadline.dueDate)}
                                            </span>
                                            <span className={`font-medium ${daysRemaining < 0 ? 'text-[var(--color-critical)]' :
                                                    daysRemaining <= 7 ? 'text-[var(--color-warning)]' :
                                                        'text-[var(--color-steel)]'
                                                }`}>
                                                {daysRemaining < 0
                                                    ? `${Math.abs(daysRemaining)} days overdue`
                                                    : daysRemaining === 0
                                                        ? 'Due today'
                                                        : `${daysRemaining} days remaining`
                                                }
                                            </span>
                                        </div>
                                    </div>

                                    <ChevronRight className={`w-5 h-5 text-[var(--color-steel)] transition-transform ${isExpanded ? 'rotate-90' : ''
                                        }`} />
                                </div>
                            </div>

                            {/* Expanded content */}
                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="px-4 pb-4 overflow-hidden"
                                    >
                                        <div className="pl-4 ml-0.5 border-l border-[var(--glass-border)]">
                                            <p className="text-sm text-[var(--color-steel)] mb-4">
                                                {deadline.description}
                                            </p>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onDeadlineClick?.(deadline); }}
                                                    className="btn-primary text-xs"
                                                >
                                                    View Details
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onSetReminder?.(deadline); }}
                                                    className="btn-secondary text-xs"
                                                >
                                                    <Bell className="w-3 h-3" />
                                                    Set Reminder
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

export default DeadlineManager;
