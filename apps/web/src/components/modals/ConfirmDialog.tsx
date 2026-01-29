'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'warning' | 'info' | 'success';
    isLoading?: boolean;
}

const variantConfig = {
    danger: {
        icon: XCircle,
        color: 'var(--color-critical)',
        buttonClass: 'bg-[var(--color-critical)] hover:bg-[#dc2626] text-white'
    },
    warning: {
        icon: AlertTriangle,
        color: 'var(--color-warning)',
        buttonClass: 'bg-[var(--color-warning)] hover:bg-[#d97706] text-black'
    },
    info: {
        icon: Info,
        color: 'var(--color-synapse-cyan)',
        buttonClass: 'bg-[var(--color-synapse-cyan)] hover:opacity-90 text-black'
    },
    success: {
        icon: CheckCircle2,
        color: 'var(--color-success)',
        buttonClass: 'bg-[var(--color-success)] hover:bg-[#16a34a] text-white'
    },
};

export function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'warning',
    isLoading = false
}: ConfirmDialogProps) {
    const config = variantConfig[variant];
    const Icon = config.icon;

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />

                    {/* Dialog */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50"
                    >
                        <div className="glass-card overflow-hidden">
                            {/* Header */}
                            <div className="p-6 pb-4">
                                <div className="flex items-start gap-4">
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                                        style={{ backgroundColor: `${config.color}20` }}
                                    >
                                        <Icon className="w-6 h-6" style={{ color: config.color }} />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-white mb-1">{title}</h3>
                                        <p className="text-sm text-[var(--color-steel)]">{message}</p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-1 rounded hover:bg-[var(--glass-bg)] transition-colors"
                                    >
                                        <X className="w-5 h-5 text-[var(--color-steel)]" />
                                    </button>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="p-4 pt-2 flex justify-end gap-3">
                                <button
                                    onClick={onClose}
                                    disabled={isLoading}
                                    className="px-4 py-2 rounded-lg border border-[var(--glass-border)] text-sm text-white hover:bg-[var(--glass-bg)] transition-colors disabled:opacity-50"
                                >
                                    {cancelLabel}
                                </button>
                                <button
                                    onClick={onConfirm}
                                    disabled={isLoading}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-opacity disabled:opacity-50 ${config.buttonClass}`}
                                >
                                    {isLoading ? (
                                        <motion.div
                                            animate={{ rotate: 360 }}
                                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full mx-4"
                                        />
                                    ) : confirmLabel}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}


interface AlertBannerProps {
    type: 'info' | 'warning' | 'error' | 'success';
    title: string;
    message?: string;
    action?: {
        label: string;
        onClick: () => void;
    };
    onDismiss?: () => void;
    className?: string;
}

const bannerConfig = {
    info: { icon: Info, color: 'var(--color-synapse-cyan)', bg: 'rgba(20,184,166,0.1)' },
    warning: { icon: AlertTriangle, color: 'var(--color-warning)', bg: 'rgba(245,158,11,0.1)' },
    error: { icon: XCircle, color: 'var(--color-critical)', bg: 'rgba(239,68,68,0.1)' },
    success: { icon: CheckCircle2, color: 'var(--color-success)', bg: 'rgba(34,197,94,0.1)' },
};

export function AlertBanner({ type, title, message, action, onDismiss, className = '' }: AlertBannerProps) {
    const config = bannerConfig[type];
    const Icon = config.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-xl border ${className}`}
            style={{
                backgroundColor: config.bg,
                borderColor: `${config.color}40`
            }}
        >
            <div className="flex items-start gap-3">
                <Icon className="w-5 h-5 shrink-0 mt-0.5" style={{ color: config.color }} />
                <div className="flex-1">
                    <p className="font-medium text-white text-sm">{title}</p>
                    {message && <p className="text-sm text-[var(--color-steel)] mt-0.5">{message}</p>}
                </div>
                {action && (
                    <button
                        onClick={action.onClick}
                        className="text-sm font-medium px-3 py-1 rounded-lg transition-colors"
                        style={{ color: config.color }}
                    >
                        {action.label}
                    </button>
                )}
                {onDismiss && (
                    <button onClick={onDismiss} className="p-1 rounded hover:bg-[var(--glass-bg)]">
                        <X className="w-4 h-4 text-[var(--color-steel)]" />
                    </button>
                )}
            </div>
        </motion.div>
    );
}

export default ConfirmDialog;
