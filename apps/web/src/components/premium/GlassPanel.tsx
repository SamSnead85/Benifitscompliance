'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';
import { X } from 'lucide-react';

interface GlassPanelProps {
    children: ReactNode;
    variant?: 'default' | 'elevated' | 'strong';
    padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

/**
 * Glass Panel - Heavy Frosted Premium Surface
 */
export function GlassPanel({
    children,
    variant = 'default',
    padding = 'md',
    className = '',
}: GlassPanelProps) {
    const variants = {
        default: `
      bg-[rgba(10,10,15,0.7)]
      backdrop-blur-xl
      border border-[rgba(255,255,255,0.06)]
    `,
        elevated: `
      bg-[rgba(10,10,15,0.85)]
      backdrop-blur-2xl
      border border-[rgba(255,255,255,0.08)]
      shadow-[0_8px_32px_rgba(0,0,0,0.4)]
    `,
        strong: `
      bg-[rgba(10,10,15,0.95)]
      backdrop-blur-3xl
      border border-[rgba(255,255,255,0.1)]
      shadow-[0_20px_60px_rgba(0,0,0,0.5)]
    `,
    };

    const paddings = {
        none: '',
        sm: 'p-3',
        md: 'p-5',
        lg: 'p-6',
        xl: 'p-8',
    };

    return (
        <div
            className={`
        rounded-lg
        ${variants[variant]}
        ${paddings[padding]}
        ${className}
      `}
        >
            {children}
        </div>
    );
}

/**
 * Glass Card - Interactive Premium Card with Hover Effects
 */
interface GlassCardProps {
    children: ReactNode;
    onClick?: () => void;
    interactive?: boolean;
    accentTop?: boolean;
    accentColor?: 'teal' | 'emerald' | 'amber' | 'coral' | 'indigo';
    padding?: 'none' | 'sm' | 'md' | 'lg';
    className?: string;
}

export function GlassCard({
    children,
    onClick,
    interactive = true,
    accentTop = false,
    accentColor = 'teal',
    padding = 'md',
    className = '',
}: GlassCardProps) {
    const accentGradients = {
        teal: 'from-cyan-500 to-teal-500',
        emerald: 'from-emerald-500 to-green-500',
        amber: 'from-amber-500 to-orange-500',
        coral: 'from-red-500 to-rose-500',
        indigo: 'from-indigo-500 to-purple-500',
    };

    const paddings = {
        none: '',
        sm: 'p-3',
        md: 'p-5',
        lg: 'p-6',
    };

    return (
        <motion.div
            onClick={onClick}
            whileHover={interactive ? { y: -2 } : undefined}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className={`
        relative overflow-hidden rounded-lg
        bg-[rgba(255,255,255,0.03)]
        backdrop-blur-xl
        border border-[rgba(255,255,255,0.06)]
        ${interactive ? `
          cursor-pointer
          hover:bg-[rgba(255,255,255,0.05)]
          hover:border-[rgba(255,255,255,0.12)]
          hover:shadow-[0_8px_32px_rgba(0,0,0,0.3),0_0_0_1px_rgba(255,255,255,0.03)_inset]
        ` : ''}
        transition-all duration-300
        ${paddings[padding]}
        ${className}
      `}
        >
            {accentTop && (
                <div
                    className={`absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r ${accentGradients[accentColor]} opacity-70`}
                />
            )}
            {children}
        </motion.div>
    );
}

/**
 * Glass Modal - Premium Overlay with Backdrop Blur
 */
interface GlassModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children: ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    showCloseButton?: boolean;
    className?: string;
}

export function GlassModal({
    isOpen,
    onClose,
    title,
    description,
    children,
    size = 'md',
    showCloseButton = true,
    className = '',
}: GlassModalProps) {
    const sizes = {
        sm: 'max-w-md',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-[90vw]',
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className={`
              fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
              w-full ${sizes[size]}
              bg-[#0A0A0F]
              border border-[rgba(255,255,255,0.08)]
              rounded-xl
              shadow-[0_20px_60px_rgba(0,0,0,0.5),0_0_40px_rgba(6,182,212,0.1)]
              overflow-hidden
              ${className}
            `}
                    >
                        {/* Header */}
                        {(title || showCloseButton) && (
                            <div className="flex items-center justify-between px-6 py-4 border-b border-[rgba(255,255,255,0.06)]">
                                <div>
                                    {title && (
                                        <h2
                                            className="text-lg font-semibold text-white"
                                            style={{ fontFamily: 'var(--font-display)' }}
                                        >
                                            {title}
                                        </h2>
                                    )}
                                    {description && (
                                        <p className="text-sm text-[#64748B] mt-0.5">{description}</p>
                                    )}
                                </div>
                                {showCloseButton && (
                                    <motion.button
                                        onClick={onClose}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="w-8 h-8 flex items-center justify-center rounded-lg text-[#64748B] hover:text-white hover:bg-[rgba(255,255,255,0.06)] transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </motion.button>
                                )}
                            </div>
                        )}

                        {/* Content */}
                        <div className="p-6">
                            {children}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default GlassPanel;
