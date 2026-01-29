'use client';

import { motion } from 'framer-motion';
import {
    Zap,
    FileText,
    Users,
    Shield,
    Download,
    Upload,
    Plus,
    ArrowRight,
    RefreshCw,
    Send
} from 'lucide-react';

interface QuickActionsGridProps {
    className?: string;
    onAction?: (actionId: string) => void;
}

interface QuickAction {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    color: string;
    category: 'forms' | 'employees' | 'compliance' | 'data';
}

const actions: QuickAction[] = [
    {
        id: 'generate-forms',
        title: 'Generate Forms',
        description: 'Create 1095-C forms',
        icon: FileText,
        color: 'var(--color-synapse-gold)',
        category: 'forms'
    },
    {
        id: 'distribute-forms',
        title: 'Distribute Forms',
        description: 'Send to employees',
        icon: Send,
        color: 'var(--color-synapse-cyan)',
        category: 'forms'
    },
    {
        id: 'add-employee',
        title: 'Add Employee',
        description: 'Create new record',
        icon: Plus,
        color: 'var(--color-success)',
        category: 'employees'
    },
    {
        id: 'sync-hris',
        title: 'Sync HRIS',
        description: 'Pull latest data',
        icon: RefreshCw,
        color: 'var(--color-synapse-teal)',
        category: 'data'
    },
    {
        id: 'import-data',
        title: 'Import Data',
        description: 'Upload CSV/Excel',
        icon: Upload,
        color: 'var(--color-synapse-violet)',
        category: 'data'
    },
    {
        id: 'export-report',
        title: 'Export Report',
        description: 'Download analytics',
        icon: Download,
        color: 'var(--color-steel)',
        category: 'data'
    },
    {
        id: 'run-compliance',
        title: 'Compliance Check',
        description: 'Validate all data',
        icon: Shield,
        color: 'var(--color-warning)',
        category: 'compliance'
    },
    {
        id: 'bulk-update',
        title: 'Bulk Update',
        description: 'Mass edit codes',
        icon: Users,
        color: 'var(--color-synapse-teal)',
        category: 'compliance'
    },
];

export function QuickActionsGrid({ className = '', onAction }: QuickActionsGridProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-5 ${className}`}
        >
            <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-synapse-teal)] to-[var(--color-synapse-cyan)] flex items-center justify-center">
                    <Zap className="w-4 h-4 text-black" />
                </div>
                <h3 className="font-semibold text-white">Quick Actions</h3>
            </div>

            <div className="grid grid-cols-4 gap-3">
                {actions.map((action, i) => {
                    const Icon = action.icon;
                    return (
                        <motion.button
                            key={action.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            whileHover={{ y: -2 }}
                            onClick={() => onAction?.(action.id)}
                            className="p-3 rounded-xl bg-[var(--glass-bg-light)] border border-[var(--glass-border)] hover:border-[var(--color-synapse-teal)] transition-all text-left group"
                        >
                            <div
                                className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
                                style={{ backgroundColor: `${action.color}20` }}
                            >
                                <Icon className="w-4 h-4" style={{ color: action.color }} />
                            </div>
                            <p className="text-sm font-medium text-white mb-0.5">{action.title}</p>
                            <p className="text-xs text-[var(--color-steel)]">{action.description}</p>
                        </motion.button>
                    );
                })}
            </div>
        </motion.div>
    );
}


// Compact version for sidebars
interface QuickActionsCompactProps {
    className?: string;
    onAction?: (actionId: string) => void;
}

export function QuickActionsCompact({ className = '', onAction }: QuickActionsCompactProps) {
    const topActions = actions.slice(0, 4);

    return (
        <div className={`space-y-2 ${className}`}>
            <p className="text-xs font-medium text-[var(--color-steel)] mb-2">Quick Actions</p>
            {topActions.map((action) => {
                const Icon = action.icon;
                return (
                    <button
                        key={action.id}
                        onClick={() => onAction?.(action.id)}
                        className="w-full flex items-center gap-3 p-2.5 rounded-lg bg-[var(--glass-bg)] hover:bg-[var(--glass-bg-light)] border border-[var(--glass-border)] hover:border-[var(--color-synapse-teal)] transition-colors"
                    >
                        <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: `${action.color}20` }}
                        >
                            <Icon className="w-3.5 h-3.5" style={{ color: action.color }} />
                        </div>
                        <span className="text-sm text-white flex-1 text-left">{action.title}</span>
                        <ArrowRight className="w-3 h-3 text-[var(--color-steel)]" />
                    </button>
                );
            })}
        </div>
    );
}

export default QuickActionsGrid;
