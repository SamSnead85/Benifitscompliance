'use client';

import { motion } from 'framer-motion';
import {
    FileText,
    Users,
    Search,
    Plus,
    Upload,
    FolderOpen,
    InboxIcon,
    Sparkles
} from 'lucide-react';

type EmptyStateVariant = 'no-data' | 'no-results' | 'no-employees' | 'no-documents' | 'error';

interface EmptyStateProps {
    variant?: EmptyStateVariant;
    title?: string;
    description?: string;
    actionLabel?: string;
    onAction?: () => void;
    className?: string;
}

const variantConfig = {
    'no-data': {
        icon: InboxIcon,
        title: 'No Data Available',
        description: 'There is no data to display yet. Start by adding some records.',
        actionLabel: 'Add Data',
    },
    'no-results': {
        icon: Search,
        title: 'No Results Found',
        description: 'Try adjusting your search or filter criteria to find what you\'re looking for.',
        actionLabel: 'Clear Filters',
    },
    'no-employees': {
        icon: Users,
        title: 'No Employees',
        description: 'Import employee data from your HRIS or add employees manually.',
        actionLabel: 'Import Employees',
    },
    'no-documents': {
        icon: FolderOpen,
        title: 'No Documents',
        description: 'Upload documents or generate forms to see them here.',
        actionLabel: 'Upload Document',
    },
    'error': {
        icon: FileText,
        title: 'Something Went Wrong',
        description: 'An error occurred while loading this content. Please try again.',
        actionLabel: 'Retry',
    },
};

export function EmptyState({
    variant = 'no-data',
    title,
    description,
    actionLabel,
    onAction,
    className = ''
}: EmptyStateProps) {
    const config = variantConfig[variant];
    const Icon = config.icon;
    const finalTitle = title || config.title;
    const finalDescription = description || config.description;
    const finalActionLabel = actionLabel || config.actionLabel;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col items-center justify-center py-16 px-8 text-center ${className}`}
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring' }}
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--glass-bg)] to-[var(--glass-bg-light)] border border-[var(--glass-border)] flex items-center justify-center mb-6"
            >
                <Icon className="w-10 h-10 text-[var(--color-steel)]" />
            </motion.div>

            <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-xl font-semibold text-white mb-2"
            >
                {finalTitle}
            </motion.h3>

            <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-sm text-[var(--color-steel)] max-w-md mb-6"
            >
                {finalDescription}
            </motion.p>

            {onAction && (
                <motion.button
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    onClick={onAction}
                    className="btn-primary"
                >
                    <Plus className="w-4 h-4" />
                    {finalActionLabel}
                </motion.button>
            )}
        </motion.div>
    );
}


interface LoadingStateProps {
    message?: string;
    className?: string;
}

export function LoadingState({ message = 'Loading...', className = '' }: LoadingStateProps) {
    return (
        <div className={`flex flex-col items-center justify-center py-16 ${className}`}>
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                className="w-12 h-12 rounded-full border-2 border-[var(--glass-border)] border-t-[var(--color-synapse-teal)] mb-4"
            />
            <p className="text-sm text-[var(--color-steel)]">{message}</p>
        </div>
    );
}


interface FeaturePlaceholderProps {
    title: string;
    description?: string;
    comingSoon?: boolean;
    className?: string;
}

export function FeaturePlaceholder({
    title,
    description,
    comingSoon = true,
    className = ''
}: FeaturePlaceholderProps) {
    return (
        <div className={`glass-card p-8 text-center ${className}`}>
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-synapse-teal)]/10 to-[var(--color-synapse-cyan)]/10 border border-[var(--color-synapse-teal)]/30 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-8 h-8 text-[var(--color-synapse-teal)]" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
            {description && (
                <p className="text-sm text-[var(--color-steel)] mb-4">{description}</p>
            )}
            {comingSoon && (
                <span className="inline-block px-3 py-1 rounded-full bg-[var(--glass-bg)] border border-[var(--glass-border)] text-xs text-[var(--color-synapse-teal)]">
                    Coming Soon
                </span>
            )}
        </div>
    );
}

export default EmptyState;
