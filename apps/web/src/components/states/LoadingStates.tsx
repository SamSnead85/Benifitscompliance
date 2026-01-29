'use client';

import { motion } from 'framer-motion';
import { FileText, Users, Search, AlertCircle, CheckCircle2, FolderOpen } from 'lucide-react';

/**
 * Skeleton Loader
 * Elegant content placeholder during loading
 */
interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
    return (
        <div
            className={`animate-pulse bg-gradient-to-r from-[rgba(255,255,255,0.04)] via-[rgba(255,255,255,0.08)] to-[rgba(255,255,255,0.04)] bg-[length:200%_100%] rounded ${className}`}
            style={{ animationDuration: '1.5s' }}
        />
    );
}

/**
 * Card Skeleton
 * Loading placeholder for card components
 */
export function CardSkeleton({ className = '' }: SkeletonProps) {
    return (
        <div className={`glass-card p-5 ${className}`}>
            <div className="flex items-center gap-4 mb-4">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            </div>
            <div className="space-y-3">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
                <Skeleton className="h-3 w-4/6" />
            </div>
        </div>
    );
}

/**
 * Table Skeleton
 * Loading placeholder for data tables
 */
interface TableSkeletonProps extends SkeletonProps {
    rows?: number;
    columns?: number;
}

export function TableSkeleton({ rows = 5, columns = 5, className = '' }: TableSkeletonProps) {
    return (
        <div className={`glass-card overflow-hidden ${className}`}>
            {/* Header */}
            <div className="flex gap-4 p-4 border-b border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)]">
                {Array.from({ length: columns }).map((_, i) => (
                    <Skeleton key={i} className="h-4 flex-1" />
                ))}
            </div>

            {/* Rows */}
            {Array.from({ length: rows }).map((_, rowIndex) => (
                <div key={rowIndex} className="flex gap-4 p-4 border-b border-[rgba(255,255,255,0.04)]">
                    {Array.from({ length: columns }).map((_, colIndex) => (
                        <Skeleton
                            key={colIndex}
                            className={`h-4 flex-1 ${colIndex === 0 ? 'w-32' : ''}`}
                        />
                    ))}
                </div>
            ))}
        </div>
    );
}

/**
 * Empty State
 * Elegant empty state with contextual messaging
 */
interface EmptyStateProps {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export function EmptyState({
    icon,
    title,
    description,
    action,
    size = 'md',
    className = '',
}: EmptyStateProps) {
    const sizeStyles = {
        sm: { container: 'py-8', icon: 'w-10 h-10', title: 'text-sm', desc: 'text-xs' },
        md: { container: 'py-12', icon: 'w-14 h-14', title: 'text-base', desc: 'text-sm' },
        lg: { container: 'py-16', icon: 'w-20 h-20', title: 'text-lg', desc: 'text-base' },
    };

    const styles = sizeStyles[size];

    return (
        <div className={`text-center ${styles.container} ${className}`}>
            <div className={`${styles.icon} mx-auto mb-4 rounded-full bg-[rgba(255,255,255,0.04)] flex items-center justify-center text-[#64748B]`}>
                {icon || <FolderOpen className="w-1/2 h-1/2" />}
            </div>
            <h3 className={`${styles.title} font-semibold text-white mb-2`}>{title}</h3>
            {description && (
                <p className={`${styles.desc} text-[#64748B] max-w-sm mx-auto mb-4`}>{description}</p>
            )}
            {action && (
                <motion.button
                    onClick={action.onClick}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 text-sm font-medium text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/20 transition-colors"
                >
                    {action.label}
                </motion.button>
            )}
        </div>
    );
}

/**
 * Preset Empty States for Common Scenarios
 */
export function NoResultsState({ searchTerm, onClear }: { searchTerm?: string; onClear?: () => void }) {
    return (
        <EmptyState
            icon={<Search className="w-6 h-6" />}
            title="No results found"
            description={searchTerm ? `No matches for "${searchTerm}". Try adjusting your search.` : 'Try adjusting your filters or search criteria.'}
            action={onClear ? { label: 'Clear search', onClick: onClear } : undefined}
        />
    );
}

export function NoEmployeesState({ onAdd }: { onAdd?: () => void }) {
    return (
        <EmptyState
            icon={<Users className="w-6 h-6" />}
            title="No employees found"
            description="Add employees to start tracking ACA eligibility and compliance."
            action={onAdd ? { label: 'Add Employee', onClick: onAdd } : undefined}
        />
    );
}

export function NoDocumentsState({ onUpload }: { onUpload?: () => void }) {
    return (
        <EmptyState
            icon={<FileText className="w-6 h-6" />}
            title="No documents"
            description="Upload compliance documents to get started."
            action={onUpload ? { label: 'Upload Document', onClick: onUpload } : undefined}
        />
    );
}

/**
 * Error State
 * Elegant error display with recovery options
 */
interface ErrorStateProps {
    title?: string;
    message?: string;
    onRetry?: () => void;
    className?: string;
}

export function ErrorState({
    title = 'Something went wrong',
    message = 'An error occurred while loading this content. Please try again.',
    onRetry,
    className = '',
}: ErrorStateProps) {
    return (
        <div className={`text-center py-12 ${className}`}>
            <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-500/10 flex items-center justify-center">
                <AlertCircle className="w-7 h-7 text-red-400" />
            </div>
            <h3 className="text-base font-semibold text-white mb-2">{title}</h3>
            <p className="text-sm text-[#64748B] max-w-sm mx-auto mb-4">{message}</p>
            {onRetry && (
                <motion.button
                    onClick={onRetry}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-2 text-sm font-medium text-white bg-[rgba(255,255,255,0.06)] border border-[rgba(255,255,255,0.1)] rounded-lg hover:bg-[rgba(255,255,255,0.1)] transition-colors"
                >
                    Try Again
                </motion.button>
            )}
        </div>
    );
}

/**
 * Success State
 * Confirmation of completed action
 */
interface SuccessStateProps {
    title: string;
    message?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    className?: string;
}

export function SuccessState({
    title,
    message,
    action,
    className = '',
}: SuccessStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`text-center py-12 ${className}`}
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.1 }}
                className="w-16 h-16 mx-auto mb-4 rounded-full bg-emerald-500/10 flex items-center justify-center"
            >
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
            </motion.div>
            <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
            {message && (
                <p className="text-sm text-[#94A3B8] max-w-sm mx-auto mb-4">{message}</p>
            )}
            {action && (
                <motion.button
                    onClick={action.onClick}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-2.5 text-sm font-semibold text-[#030712] bg-gradient-to-b from-cyan-500 to-teal-600 rounded-lg"
                >
                    {action.label}
                </motion.button>
            )}
        </motion.div>
    );
}

/**
 * Progress Indicator
 * Determinate progress visualization
 */
interface ProgressIndicatorProps {
    progress: number;
    label?: string;
    showPercentage?: boolean;
    size?: 'sm' | 'md' | 'lg';
    variant?: 'default' | 'success' | 'warning' | 'danger';
    className?: string;
}

export function ProgressIndicator({
    progress,
    label,
    showPercentage = true,
    size = 'md',
    variant = 'default',
    className = '',
}: ProgressIndicatorProps) {
    const clamped = Math.min(100, Math.max(0, progress));

    const sizeStyles = {
        sm: 'h-1',
        md: 'h-1.5',
        lg: 'h-2',
    };

    const variantColors = {
        default: 'bg-cyan-400',
        success: 'bg-emerald-400',
        warning: 'bg-amber-400',
        danger: 'bg-red-400',
    };

    return (
        <div className={className}>
            {(label || showPercentage) && (
                <div className="flex items-center justify-between mb-1.5">
                    {label && <span className="text-xs text-[#94A3B8]">{label}</span>}
                    {showPercentage && <span className="text-xs font-mono text-white">{Math.round(clamped)}%</span>}
                </div>
            )}
            <div className={`rounded-full bg-[rgba(255,255,255,0.1)] overflow-hidden ${sizeStyles[size]}`}>
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${clamped}%` }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className={`h-full rounded-full ${variantColors[variant]}`}
                />
            </div>
        </div>
    );
}

export default Skeleton;
