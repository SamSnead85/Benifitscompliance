'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FileText,
    Check,
    X,
    Clock,
    AlertTriangle,
    ArrowRight,
    MessageSquare,
    Download,
    Eye
} from 'lucide-react';

interface ApprovalItem {
    id: string;
    type: 'form' | 'exception' | 'data_change';
    title: string;
    description: string;
    submittedBy: string;
    submittedAt: string;
    priority: 'low' | 'medium' | 'high';
    status: 'pending' | 'approved' | 'rejected';
    metadata?: Record<string, string>;
}

interface ApprovalQueueProps {
    items?: ApprovalItem[];
    className?: string;
    onApprove?: (id: string) => void;
    onReject?: (id: string, reason: string) => void;
}

const defaultItems: ApprovalItem[] = [
    {
        id: 'appr-001',
        type: 'form',
        title: 'Batch 1095-C Approval',
        description: '156 forms ready for distribution',
        submittedBy: 'Compliance Engine',
        submittedAt: '2 hours ago',
        priority: 'high',
        status: 'pending',
        metadata: { forms: '156', total_employees: '4,521' }
    },
    {
        id: 'appr-002',
        type: 'exception',
        title: 'Affordability Exception Request',
        description: 'Employee John Smith - Premium exceeds 9.12% threshold',
        submittedBy: 'Sarah M.',
        submittedAt: '4 hours ago',
        priority: 'medium',
        status: 'pending',
        metadata: { employee_id: 'EMP-001', premium_rate: '9.8%' }
    },
    {
        id: 'appr-003',
        type: 'data_change',
        title: 'Bulk Hours Update',
        description: 'Retroactive hours correction for 12 employees',
        submittedBy: 'Mike R.',
        submittedAt: '1 day ago',
        priority: 'low',
        status: 'pending',
        metadata: { affected_employees: '12', period: 'Q4 2025' }
    }
];

const typeConfig = {
    form: { icon: FileText, color: 'var(--color-synapse-cyan)' },
    exception: { icon: AlertTriangle, color: 'var(--color-warning)' },
    data_change: { icon: Clock, color: 'var(--color-steel)' }
};

const priorityConfig = {
    high: { color: 'var(--color-critical)', label: 'Urgent' },
    medium: { color: 'var(--color-warning)', label: 'Standard' },
    low: { color: 'var(--color-steel)', label: 'Low' }
};

export function ApprovalQueue({
    items = defaultItems,
    className = '',
    onApprove,
    onReject
}: ApprovalQueueProps) {
    const [expandedItem, setExpandedItem] = useState<string | null>(null);
    const [rejectingItem, setRejectingItem] = useState<string | null>(null);
    const [rejectReason, setRejectReason] = useState('');

    const pendingItems = items.filter(i => i.status === 'pending');
    const highPriority = pendingItems.filter(i => i.priority === 'high').length;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-6 ${className}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                    <h3 className="font-semibold text-white">Approval Queue</h3>
                    <span className="px-2 py-0.5 rounded text-xs bg-[var(--glass-bg)] text-[var(--color-steel)]">
                        {pendingItems.length} pending
                    </span>
                    {highPriority > 0 && (
                        <span className="px-2 py-0.5 rounded text-xs bg-[rgba(239,68,68,0.2)] text-[var(--color-critical)]">
                            {highPriority} urgent
                        </span>
                    )}
                </div>
                <button className="btn-secondary text-sm">View All</button>
            </div>

            {/* Queue */}
            <div className="space-y-3">
                {pendingItems.map((item, i) => {
                    const type = typeConfig[item.type];
                    const priority = priorityConfig[item.priority];
                    const TypeIcon = type.icon;

                    return (
                        <motion.div
                            key={item.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]"
                        >
                            <div className="flex items-start gap-4">
                                {/* Type Icon */}
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: `${type.color}20` }}
                                >
                                    <TypeIcon className="w-5 h-5" style={{ color: type.color }} />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-white">{item.title}</span>
                                        <span
                                            className="px-2 py-0.5 rounded text-xs"
                                            style={{ backgroundColor: `${priority.color}20`, color: priority.color }}
                                        >
                                            {priority.label}
                                        </span>
                                    </div>
                                    <p className="text-sm text-[var(--color-steel)] mb-2">{item.description}</p>
                                    <div className="flex items-center gap-4 text-xs text-[var(--color-steel)]">
                                        <span>By {item.submittedBy}</span>
                                        <span>•</span>
                                        <span>{item.submittedAt}</span>
                                    </div>

                                    {/* Metadata */}
                                    {item.metadata && expandedItem === item.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            className="mt-3 pt-3 border-t border-[var(--glass-border)]"
                                        >
                                            <div className="flex flex-wrap gap-4">
                                                {Object.entries(item.metadata).map(([key, value]) => (
                                                    <div key={key}>
                                                        <span className="text-xs text-[var(--color-steel)] capitalize">
                                                            {key.replace('_', ' ')}:
                                                        </span>
                                                        <span className="ml-1 text-xs text-[var(--color-silver)]">{value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    {/* Reject Reason */}
                                    {rejectingItem === item.id && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            className="mt-3"
                                        >
                                            <textarea
                                                value={rejectReason}
                                                onChange={(e) => setRejectReason(e.target.value)}
                                                placeholder="Reason for rejection..."
                                                className="w-full p-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm text-white placeholder:text-[var(--color-steel)] focus:border-[var(--color-synapse-teal)] focus:outline-none resize-none"
                                                rows={2}
                                            />
                                            <div className="flex justify-end gap-2 mt-2">
                                                <button
                                                    onClick={() => {
                                                        setRejectingItem(null);
                                                        setRejectReason('');
                                                    }}
                                                    className="btn-secondary text-xs"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => {
                                                        onReject?.(item.id, rejectReason);
                                                        setRejectingItem(null);
                                                        setRejectReason('');
                                                    }}
                                                    className="px-3 py-1 rounded text-xs bg-[var(--color-critical)] text-white"
                                                >
                                                    Confirm Rejection
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2 shrink-0">
                                    <button
                                        onClick={() => setExpandedItem(expandedItem === item.id ? null : item.id)}
                                        className="p-2 rounded-lg hover:bg-[var(--glass-bg)] text-[var(--color-steel)] hover:text-white transition-colors"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => setRejectingItem(item.id)}
                                        disabled={rejectingItem === item.id}
                                        className="p-2 rounded-lg hover:bg-[rgba(239,68,68,0.2)] text-[var(--color-critical)] transition-colors disabled:opacity-50"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => onApprove?.(item.id)}
                                        className="p-2 rounded-lg hover:bg-[rgba(34,197,94,0.2)] text-[var(--color-success)] transition-colors"
                                    >
                                        <Check className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}

                {pendingItems.length === 0 && (
                    <div className="p-8 text-center text-[var(--color-steel)]">
                        <Check className="w-8 h-8 mx-auto mb-2 text-[var(--color-success)]" />
                        <p>No items pending approval</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

export default ApprovalQueue;
