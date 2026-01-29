'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import {
    X,
    AlertTriangle,
    CheckCircle2,
    Info,
    HelpCircle,
    ChevronRight,
    ChevronLeft,
    Loader2,
} from 'lucide-react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
    showCloseButton?: boolean;
    closeOnBackdrop?: boolean;
    children: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
}

/**
 * Professional Modal
 * Premium modal dialog with elegant animations
 */
export function ProfessionalModal({
    isOpen,
    onClose,
    title,
    description,
    size = 'md',
    showCloseButton = true,
    closeOnBackdrop = true,
    children,
    footer,
    className = '',
}: ModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const sizeStyles = {
        sm: 'max-w-sm',
        md: 'max-w-lg',
        lg: 'max-w-2xl',
        xl: 'max-w-4xl',
        full: 'max-w-[calc(100vw-4rem)] max-h-[calc(100vh-4rem)]',
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
                        onClick={() => closeOnBackdrop && onClose()}
                        className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                        className={`
              fixed z-50 left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2
              w-full ${sizeStyles[size]}
              bg-[#0A0A0F] border border-[rgba(255,255,255,0.08)] rounded-xl
              shadow-[0_20px_60px_rgba(0,0,0,0.5)]
              overflow-hidden
              ${className}
            `}
                    >
                        {/* Header */}
                        {(title || showCloseButton) && (
                            <div className="flex items-start justify-between p-5 border-b border-[rgba(255,255,255,0.06)]">
                                {title && (
                                    <div>
                                        <h2 className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                                            {title}
                                        </h2>
                                        {description && (
                                            <p className="text-sm text-[#64748B] mt-1">{description}</p>
                                        )}
                                    </div>
                                )}
                                {showCloseButton && (
                                    <button
                                        onClick={onClose}
                                        className="p-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.06)] text-[#64748B] hover:text-white transition-colors"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        )}

                        {/* Content */}
                        <div className="p-5 max-h-[60vh] overflow-y-auto">
                            {children}
                        </div>

                        {/* Footer */}
                        {footer && (
                            <div className="flex items-center justify-end gap-3 p-5 border-t border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.01)]">
                                {footer}
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

/**
 * Confirmation Dialog
 * Elegant confirmation with action context
 */
interface ConfirmationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'default' | 'danger' | 'warning';
    loading?: boolean;
}

export function ConfirmationDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    variant = 'default',
    loading = false,
}: ConfirmationDialogProps) {
    const variantStyles = {
        default: {
            icon: <CheckCircle2 className="w-6 h-6 text-cyan-400" />,
            iconBg: 'bg-cyan-500/10',
            buttonBg: 'bg-gradient-to-b from-cyan-500 to-teal-600',
        },
        danger: {
            icon: <AlertTriangle className="w-6 h-6 text-red-400" />,
            iconBg: 'bg-red-500/10',
            buttonBg: 'bg-gradient-to-b from-red-500 to-red-600',
        },
        warning: {
            icon: <AlertTriangle className="w-6 h-6 text-amber-400" />,
            iconBg: 'bg-amber-500/10',
            buttonBg: 'bg-gradient-to-b from-amber-500 to-amber-600',
        },
    };

    const { icon, iconBg, buttonBg } = variantStyles[variant];

    return (
        <ProfessionalModal
            isOpen={isOpen}
            onClose={onClose}
            size="sm"
            showCloseButton={false}
        >
            <div className="text-center">
                <div className={`w-14 h-14 rounded-full ${iconBg} flex items-center justify-center mx-auto mb-4`}>
                    {icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-sm text-[#94A3B8]">{message}</p>
            </div>

            <div className="flex gap-3 mt-6">
                <button
                    onClick={onClose}
                    disabled={loading}
                    className="flex-1 px-4 py-2.5 text-sm font-medium text-[#94A3B8] bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] rounded-lg hover:bg-[rgba(255,255,255,0.08)] hover:text-white transition-colors disabled:opacity-50"
                >
                    {cancelLabel}
                </button>
                <button
                    onClick={onConfirm}
                    disabled={loading}
                    className={`flex-1 px-4 py-2.5 text-sm font-semibold text-[#030712] ${buttonBg} rounded-lg transition-opacity disabled:opacity-50 flex items-center justify-center gap-2`}
                >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {confirmLabel}
                </button>
            </div>
        </ProfessionalModal>
    );
}

/**
 * Wizard/Stepper Modal
 * Multi-step workflow with progress
 */
interface WizardStep {
    id: string;
    title: string;
    description?: string;
    content: React.ReactNode;
    isValid?: boolean;
}

interface WizardModalProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: () => void;
    title: string;
    steps: WizardStep[];
    initialStep?: number;
}

export function WizardModal({
    isOpen,
    onClose,
    onComplete,
    title,
    steps,
    initialStep = 0,
}: WizardModalProps) {
    const [currentStep, setCurrentStep] = useState(initialStep);
    const step = steps[currentStep];
    const isLastStep = currentStep === steps.length - 1;
    const isFirstStep = currentStep === 0;

    const handleNext = () => {
        if (isLastStep) {
            onComplete();
        } else {
            setCurrentStep(s => s + 1);
        }
    };

    const handleBack = () => {
        if (!isFirstStep) {
            setCurrentStep(s => s - 1);
        }
    };

    return (
        <ProfessionalModal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            size="lg"
            footer={
                <>
                    {!isFirstStep && (
                        <button
                            onClick={handleBack}
                            className="px-4 py-2.5 text-sm font-medium text-[#94A3B8] hover:text-white transition-colors flex items-center gap-2"
                        >
                            <ChevronLeft className="w-4 h-4" />
                            Back
                        </button>
                    )}
                    <button
                        onClick={handleNext}
                        disabled={step.isValid === false}
                        className="px-6 py-2.5 text-sm font-semibold text-[#030712] bg-gradient-to-b from-cyan-500 to-teal-600 rounded-lg disabled:opacity-50 flex items-center gap-2"
                    >
                        {isLastStep ? 'Complete' : 'Continue'}
                        {!isLastStep && <ChevronRight className="w-4 h-4" />}
                    </button>
                </>
            }
        >
            {/* Step Indicator */}
            <div className="flex items-center gap-2 mb-6">
                {steps.map((s, i) => (
                    <div key={s.id} className="flex items-center">
                        <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
              ${i < currentStep
                                ? 'bg-emerald-500/20 text-emerald-400'
                                : i === currentStep
                                    ? 'bg-cyan-500/20 text-cyan-400'
                                    : 'bg-[rgba(255,255,255,0.04)] text-[#64748B]'
                            }
            `}>
                            {i < currentStep ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                        </div>
                        {i < steps.length - 1 && (
                            <div className={`w-12 h-0.5 mx-2 ${i < currentStep ? 'bg-emerald-500/50' : 'bg-[rgba(255,255,255,0.1)]'
                                }`} />
                        )}
                    </div>
                ))}
            </div>

            {/* Step Content */}
            <div>
                <h3 className="text-base font-semibold text-white mb-1">{step.title}</h3>
                {step.description && (
                    <p className="text-sm text-[#64748B] mb-4">{step.description}</p>
                )}
                <div className="mt-4">
                    {step.content}
                </div>
            </div>
        </ProfessionalModal>
    );
}

/**
 * Side Panel
 * Slide-in panel for detailed views
 */
interface SidePanelProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    description?: string;
    width?: 'sm' | 'md' | 'lg' | 'xl';
    children: React.ReactNode;
    footer?: React.ReactNode;
}

export function SidePanel({
    isOpen,
    onClose,
    title,
    description,
    width = 'md',
    children,
    footer,
}: SidePanelProps) {
    const widthStyles = {
        sm: 'w-[360px]',
        md: 'w-[480px]',
        lg: 'w-[600px]',
        xl: 'w-[800px]',
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
                        className="fixed inset-0 z-50 bg-black/60"
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className={`
              fixed z-50 right-0 top-0 bottom-0
              ${widthStyles[width]}
              bg-[#0A0A0F] border-l border-[rgba(255,255,255,0.08)]
              flex flex-col
            `}
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between p-5 border-b border-[rgba(255,255,255,0.06)]">
                            <div>
                                <h2 className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                                    {title}
                                </h2>
                                {description && (
                                    <p className="text-sm text-[#64748B] mt-1">{description}</p>
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                className="p-1.5 rounded-lg hover:bg-[rgba(255,255,255,0.06)] text-[#64748B] hover:text-white transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-5">
                            {children}
                        </div>

                        {/* Footer */}
                        {footer && (
                            <div className="flex items-center justify-end gap-3 p-5 border-t border-[rgba(255,255,255,0.06)]">
                                {footer}
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default ProfessionalModal;
