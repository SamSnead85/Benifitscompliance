'use client';

import { motion } from 'framer-motion';
import { LucideIcon, FileText, FolderOpen, Search, AlertCircle, Plus } from 'lucide-react';
import { ReactNode } from 'react';

interface EmptyStateProps {
    icon?: LucideIcon;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick?: () => void;
        href?: string;
    };
    variant?: 'default' | 'search' | 'error';
}

const variantConfig = {
    default: {
        icon: FolderOpen,
        iconColor: 'var(--color-steel)',
    },
    search: {
        icon: Search,
        iconColor: 'var(--color-synapse-teal)',
    },
    error: {
        icon: AlertCircle,
        iconColor: 'var(--color-warning)',
    },
};

export function EmptyState({
    icon: CustomIcon,
    title,
    description,
    action,
    variant = 'default'
}: EmptyStateProps) {
    const config = variantConfig[variant];
    const Icon = CustomIcon || config.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
        >
            <div
                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                style={{ background: `${config.iconColor}15` }}
            >
                <Icon
                    className="w-8 h-8"
                    style={{ color: config.iconColor }}
                />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
            {description && (
                <p className="text-sm text-[var(--color-steel)] max-w-md mx-auto mb-6">
                    {description}
                </p>
            )}
            {action && (
                action.href ? (
                    <a href={action.href} className="btn-primary inline-flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        {action.label}
                    </a>
                ) : (
                    <button onClick={action.onClick} className="btn-primary inline-flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        {action.label}
                    </button>
                )
            )}
        </motion.div>
    );
}

export default EmptyState;
