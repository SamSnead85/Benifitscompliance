'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Calendar,
    Clock,
    Bell,
    Mail,
    Slack,
    Plus,
    Trash2,
    Settings,
    Check,
    X,
    ChevronDown
} from 'lucide-react';

interface DeadlineReminder {
    id: string;
    title: string;
    dueDate: string;
    daysUntil: number;
    reminderDays: number[];
    notificationChannels: ('email' | 'slack' | 'inApp')[];
    assignee: string;
    enabled: boolean;
}

interface DeadlineReminderManagerProps {
    reminders?: DeadlineReminder[];
    className?: string;
}

const defaultReminders: DeadlineReminder[] = [
    {
        id: '1',
        title: '1095-C Employee Distribution',
        dueDate: 'Jan 31, 2026',
        daysUntil: 3,
        reminderDays: [30, 14, 7, 3, 1],
        notificationChannels: ['email', 'slack', 'inApp'],
        assignee: 'Compliance Team',
        enabled: true
    },
    {
        id: '2',
        title: 'IRS Electronic Filing',
        dueDate: 'Feb 28, 2026',
        daysUntil: 31,
        reminderDays: [30, 14, 7],
        notificationChannels: ['email', 'inApp'],
        assignee: 'Compliance Team',
        enabled: true
    },
    {
        id: '3',
        title: 'Q1 Measurement Review',
        dueDate: 'Apr 15, 2026',
        daysUntil: 77,
        reminderDays: [14, 7],
        notificationChannels: ['inApp'],
        assignee: 'HR Team',
        enabled: true
    },
    {
        id: '4',
        title: 'Paper Filing Deadline',
        dueDate: 'Mar 31, 2026',
        daysUntil: 62,
        reminderDays: [14, 7, 3],
        notificationChannels: ['email'],
        assignee: 'Admin Team',
        enabled: false
    }
];

const channelIcons = {
    email: Mail,
    slack: Slack,
    inApp: Bell
};

export function DeadlineReminderManager({
    reminders = defaultReminders,
    className = ''
}: DeadlineReminderManagerProps) {
    const [localReminders, setLocalReminders] = useState(reminders);
    const [expandedReminder, setExpandedReminder] = useState<string | null>(null);

    const toggleEnabled = (id: string) => {
        setLocalReminders(prev => prev.map(r =>
            r.id === id ? { ...r, enabled: !r.enabled } : r
        ));
    };

    const getUrgencyColor = (days: number) => {
        if (days <= 3) return 'var(--color-critical)';
        if (days <= 7) return 'var(--color-warning)';
        if (days <= 14) return 'var(--color-synapse-teal)';
        return 'var(--color-steel)';
    };

    const upcomingCount = localReminders.filter(r => r.enabled && r.daysUntil <= 14).length;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-6 ${className}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                    <h3 className="font-semibold text-white">Deadline Reminders</h3>
                    {upcomingCount > 0 && (
                        <span className="px-2 py-0.5 rounded text-xs bg-[var(--color-warning)] text-black font-medium">
                            {upcomingCount} Upcoming
                        </span>
                    )}
                </div>
                <button className="btn-secondary text-sm">
                    <Plus className="w-4 h-4" />
                    Add Deadline
                </button>
            </div>

            {/* Reminders List */}
            <div className="space-y-3">
                {localReminders.map((reminder, i) => {
                    const isExpanded = expandedReminder === reminder.id;
                    const urgencyColor = getUrgencyColor(reminder.daysUntil);

                    return (
                        <motion.div
                            key={reminder.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className={`rounded-lg border transition-colors ${reminder.enabled
                                    ? 'bg-[var(--glass-bg-light)] border-[var(--glass-border)]'
                                    : 'bg-[var(--glass-bg)] border-[var(--glass-border)] opacity-60'
                                }`}
                        >
                            {/* Main Row */}
                            <div className="p-4 flex items-center gap-4">
                                {/* Toggle */}
                                <button
                                    onClick={() => toggleEnabled(reminder.id)}
                                    className={`w-10 h-6 rounded-full relative transition-colors ${reminder.enabled
                                            ? 'bg-[var(--color-synapse-teal)]'
                                            : 'bg-[var(--glass-border)]'
                                        }`}
                                >
                                    <motion.div
                                        className="absolute top-1 w-4 h-4 rounded-full bg-white"
                                        animate={{ left: reminder.enabled ? '1.25rem' : '0.25rem' }}
                                    />
                                </button>

                                {/* Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-white">{reminder.title}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-[var(--color-steel)] mt-1">
                                        <Calendar className="w-3 h-3" />
                                        <span>{reminder.dueDate}</span>
                                        <span>•</span>
                                        <span>{reminder.assignee}</span>
                                    </div>
                                </div>

                                {/* Days Until */}
                                <div
                                    className="px-3 py-1 rounded text-sm font-bold font-mono"
                                    style={{
                                        backgroundColor: `${urgencyColor}20`,
                                        color: urgencyColor
                                    }}
                                >
                                    {reminder.daysUntil}d
                                </div>

                                {/* Channels */}
                                <div className="flex items-center gap-1">
                                    {reminder.notificationChannels.map(channel => {
                                        const Icon = channelIcons[channel];
                                        return (
                                            <div
                                                key={channel}
                                                className="w-7 h-7 rounded bg-[var(--glass-bg)] flex items-center justify-center"
                                            >
                                                <Icon className="w-3.5 h-3.5 text-[var(--color-steel)]" />
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Expand */}
                                <button
                                    onClick={() => setExpandedReminder(isExpanded ? null : reminder.id)}
                                    className="p-2 rounded-lg hover:bg-[var(--glass-bg)] text-[var(--color-steel)]"
                                >
                                    <motion.div
                                        animate={{ rotate: isExpanded ? 180 : 0 }}
                                    >
                                        <ChevronDown className="w-4 h-4" />
                                    </motion.div>
                                </button>
                            </div>

                            {/* Expanded Details */}
                            {isExpanded && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="px-4 pb-4 border-t border-[var(--glass-border)]"
                                >
                                    <div className="pt-4">
                                        <p className="text-xs text-[var(--color-steel)] mb-2">Reminder Schedule:</p>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {reminder.reminderDays.map(days => (
                                                <span
                                                    key={days}
                                                    className="px-2 py-1 rounded text-xs bg-[var(--glass-bg)] text-[var(--color-silver)]"
                                                >
                                                    {days} days before
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="btn-secondary text-xs">
                                                <Settings className="w-3 h-3" />
                                                Edit
                                            </button>
                                            <button className="text-xs text-[var(--color-critical)] hover:underline flex items-center gap-1">
                                                <Trash2 className="w-3 h-3" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}

export default DeadlineReminderManager;
