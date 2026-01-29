'use client';

import { motion } from 'framer-motion';

type StatusType = 'compliant' | 'at_risk' | 'non_compliant' | 'pending_review' | 'success' | 'warning' | 'error' | 'info';

interface StatusBadgeProps {
    status: StatusType | string;
    label?: string;
    size?: 'sm' | 'md';
    animated?: boolean;
}

const statusConfig: Record<string, { label: string; className: string }> = {
    // Compliance statuses
    compliant: { label: 'Compliant', className: 'badge--success' },
    at_risk: { label: 'At Risk', className: 'badge--warning' },
    non_compliant: { label: 'Non-Compliant', className: 'badge--critical' },
    pending_review: { label: 'Pending Review', className: 'badge--info' },
    // Generic statuses
    success: { label: 'Success', className: 'badge--success' },
    warning: { label: 'Warning', className: 'badge--warning' },
    error: { label: 'Error', className: 'badge--critical' },
    info: { label: 'Info', className: 'badge--info' },
    // Severity levels
    high: { label: 'High', className: 'badge--critical' },
    medium: { label: 'Medium', className: 'badge--warning' },
    low: { label: 'Low', className: 'badge--info' },
    // Report statuses
    completed: { label: 'Completed', className: 'badge--success' },
    processing: { label: 'Processing', className: 'badge--info' },
    failed: { label: 'Failed', className: 'badge--critical' },
    queued: { label: 'Queued', className: 'badge--warning' },
    // User statuses
    active: { label: 'Active', className: 'badge--success' },
    pending: { label: 'Pending', className: 'badge--warning' },
    inactive: { label: 'Inactive', className: 'badge--secondary' },
};

export function StatusBadge({ status, label, size = 'md', animated = false }: StatusBadgeProps) {
    const config = statusConfig[status] || { label: status, className: 'badge--info' };
    const displayLabel = label || config.label;
    const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : '';

    const badge = (
        <span className={`badge ${config.className} ${sizeClass}`}>
            {displayLabel}
        </span>
    );

    if (animated) {
        return (
            <motion.span
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="inline-block"
            >
                {badge}
            </motion.span>
        );
    }

    return badge;
}

export default StatusBadge;
