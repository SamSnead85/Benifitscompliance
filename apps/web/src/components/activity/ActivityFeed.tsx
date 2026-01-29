'use client';

import { motion } from 'framer-motion';
import {
    Activity,
    FileText,
    Users,
    Shield,
    Upload,
    Download,
    CheckCircle2,
    AlertCircle,
    Clock,
    UserPlus
} from 'lucide-react';

interface ActivityFeedProps {
    className?: string;
    limit?: number;
}

interface ActivityItem {
    id: string;
    type: 'form' | 'employee' | 'compliance' | 'import' | 'export' | 'user';
    action: string;
    description: string;
    user: string;
    timestamp: string;
    status?: 'success' | 'warning' | 'pending';
}

const mockActivities: ActivityItem[] = [
    {
        id: '1',
        type: 'form',
        action: 'Forms Generated',
        description: 'Generated 245 1095-C forms for Q4 2025',
        user: 'System',
        timestamp: '2 minutes ago',
        status: 'success'
    },
    {
        id: '2',
        type: 'employee',
        action: 'Employee Synced',
        description: 'Synced 12 new employees from Gusto',
        user: 'HRIS Integration',
        timestamp: '15 minutes ago',
        status: 'success'
    },
    {
        id: '3',
        type: 'compliance',
        action: 'Compliance Alert',
        description: '3 employees require offer code review',
        user: 'Compliance Engine',
        timestamp: '1 hour ago',
        status: 'warning'
    },
    {
        id: '4',
        type: 'import',
        action: 'Data Import',
        description: 'Imported hours data for December 2025',
        user: 'Admin User',
        timestamp: '3 hours ago',
        status: 'success'
    },
    {
        id: '5',
        type: 'export',
        action: 'Report Exported',
        description: 'FTE Analysis Report downloaded by admin',
        user: 'Admin User',
        timestamp: '5 hours ago',
        status: 'success'
    },
    {
        id: '6',
        type: 'user',
        action: 'User Added',
        description: 'New team member granted access',
        user: 'Admin User',
        timestamp: '1 day ago',
        status: 'success'
    },
    {
        id: '7',
        type: 'compliance',
        action: 'Code Update',
        description: 'Bulk updated safe harbor codes for 150 employees',
        user: 'Compliance Team',
        timestamp: '1 day ago',
        status: 'success'
    },
    {
        id: '8',
        type: 'form',
        action: 'Forms Pending',
        description: '45 forms awaiting supervisor review',
        user: 'System',
        timestamp: '2 days ago',
        status: 'pending'
    },
];

const typeConfig: Record<string, { icon: React.ElementType; color: string }> = {
    form: { icon: FileText, color: 'var(--color-synapse-gold)' },
    employee: { icon: Users, color: 'var(--color-synapse-cyan)' },
    compliance: { icon: Shield, color: 'var(--color-synapse-teal)' },
    import: { icon: Upload, color: 'var(--color-success)' },
    export: { icon: Download, color: 'var(--color-steel)' },
    user: { icon: UserPlus, color: 'var(--color-synapse-violet)' },
};

const statusConfig = {
    success: { icon: CheckCircle2, color: 'var(--color-success)' },
    warning: { icon: AlertCircle, color: 'var(--color-warning)' },
    pending: { icon: Clock, color: 'var(--color-steel)' },
};

export function ActivityFeed({ className = '', limit = 8 }: ActivityFeedProps) {
    const activities = mockActivities.slice(0, limit);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card overflow-hidden ${className}`}
        >
            {/* Header */}
            <div className="p-4 border-b border-[var(--glass-border)] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-synapse-teal)] to-[var(--color-synapse-cyan)] flex items-center justify-center">
                        <Activity className="w-4 h-4 text-black" />
                    </div>
                    <h3 className="font-semibold text-white">Activity Feed</h3>
                </div>
                <button className="text-xs text-[var(--color-synapse-teal)] hover:underline">
                    View All
                </button>
            </div>

            {/* Activity List */}
            <div className="max-h-[400px] overflow-y-auto">
                {activities.map((activity, i) => {
                    const typeInfo = typeConfig[activity.type];
                    const TypeIcon = typeInfo.icon;
                    const statusInfo = activity.status ? statusConfig[activity.status] : null;

                    return (
                        <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="p-4 border-b border-[var(--glass-border)] hover:bg-[var(--glass-bg-light)] transition-colors"
                        >
                            <div className="flex gap-3">
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                                    style={{ backgroundColor: `${typeInfo.color}20` }}
                                >
                                    <TypeIcon className="w-5 h-5" style={{ color: typeInfo.color }} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-0.5">
                                        <p className="text-sm font-medium text-white">{activity.action}</p>
                                        {statusInfo && (
                                            <statusInfo.icon
                                                className="w-3.5 h-3.5"
                                                style={{ color: statusInfo.color }}
                                            />
                                        )}
                                    </div>
                                    <p className="text-xs text-[var(--color-steel)] truncate">{activity.description}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-[var(--color-steel)]">{activity.user}</span>
                                        <span className="text-xs text-[var(--color-steel)]">•</span>
                                        <span className="text-xs text-[var(--color-steel)]">{activity.timestamp}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}

export default ActivityFeed;
