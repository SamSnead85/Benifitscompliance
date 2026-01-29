'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Rocket,
    CheckCircle2,
    Circle,
    ArrowRight,
    Building2,
    Users,
    Link2,
    FileText,
    Shield,
    Sparkles
} from 'lucide-react';

interface OnboardingWizardProps {
    className?: string;
    onComplete?: () => void;
}

interface OnboardingStep {
    id: string;
    title: string;
    description: string;
    icon: React.ElementType;
    status: 'complete' | 'current' | 'upcoming';
}

const steps: OnboardingStep[] = [
    { id: 'org', title: 'Organization Setup', description: 'Configure company details and ACA settings', icon: Building2, status: 'complete' },
    { id: 'hris', title: 'HRIS Integration', description: 'Connect your payroll or HR system', icon: Link2, status: 'complete' },
    { id: 'employees', title: 'Import Employees', description: 'Sync or upload employee data', icon: Users, status: 'current' },
    { id: 'codes', title: 'Configure Codes', description: 'Set up offer and safe harbor codes', icon: Shield, status: 'upcoming' },
    { id: 'forms', title: 'Generate Forms', description: 'Create 1095-C forms for filing', icon: FileText, status: 'upcoming' },
];

export function OnboardingWizard({ className = '', onComplete }: OnboardingWizardProps) {
    const [currentStep, setCurrentStep] = useState(2); // 0-indexed, current is "Import Employees"
    const [isImporting, setIsImporting] = useState(false);

    const handleContinue = async () => {
        if (currentStep === 2) {
            // Simulate import
            setIsImporting(true);
            await new Promise(r => setTimeout(r, 2000));
            setIsImporting(false);
        }

        if (currentStep < steps.length - 1) {
            setCurrentStep(prev => prev + 1);
        } else {
            onComplete?.();
        }
    };

    const progress = ((currentStep + 1) / steps.length) * 100;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card overflow-hidden ${className}`}
        >
            {/* Header */}
            <div className="p-6 border-b border-[var(--glass-border)]">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-synapse-teal)] to-[var(--color-synapse-cyan)] flex items-center justify-center">
                        <Rocket className="w-5 h-5 text-black" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-white">Welcome to Synapse</h2>
                        <p className="text-sm text-[var(--color-steel)]">Let&apos;s get your compliance platform ready</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="relative">
                    <div className="h-2 rounded-full bg-[var(--glass-bg)] overflow-hidden">
                        <motion.div
                            className="h-full bg-gradient-to-r from-[var(--color-synapse-teal)] to-[var(--color-synapse-cyan)]"
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                    <p className="text-xs text-[var(--color-steel)] mt-2">
                        Step {currentStep + 1} of {steps.length}
                    </p>
                </div>
            </div>

            {/* Steps */}
            <div className="p-6 flex gap-6">
                {/* Step List */}
                <div className="w-64 space-y-2">
                    {steps.map((step, i) => {
                        const Icon = step.icon;
                        const isComplete = i < currentStep;
                        const isCurrent = i === currentStep;

                        return (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isCurrent
                                        ? 'bg-[var(--glass-bg-light)] border border-[var(--color-synapse-teal)]'
                                        : 'border border-transparent'
                                    }`}
                            >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${isComplete
                                        ? 'bg-[rgba(34,197,94,0.2)]'
                                        : isCurrent
                                            ? 'bg-[rgba(20,184,166,0.2)]'
                                            : 'bg-[var(--glass-bg)]'
                                    }`}>
                                    {isComplete ? (
                                        <CheckCircle2 className="w-4 h-4 text-[var(--color-success)]" />
                                    ) : (
                                        <Icon className={`w-4 h-4 ${isCurrent ? 'text-[var(--color-synapse-teal)]' : 'text-[var(--color-steel)]'}`} />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <p className={`text-sm font-medium ${isCurrent ? 'text-white' : isComplete ? 'text-[var(--color-success)]' : 'text-[var(--color-steel)]'
                                        }`}>
                                        {step.title}
                                    </p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Step Content */}
                <div className="flex-1 p-6 rounded-xl bg-[var(--glass-bg-light)] border border-[var(--glass-border)]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-6"
                        >
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-1">
                                    {steps[currentStep].title}
                                </h3>
                                <p className="text-sm text-[var(--color-steel)]">
                                    {steps[currentStep].description}
                                </p>
                            </div>

                            {/* Step-specific content */}
                            {currentStep === 2 && (
                                <div className="space-y-4">
                                    <div className="p-4 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)]">
                                        <p className="text-sm text-white mb-2">Connected Integration</p>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-[#f45d48] flex items-center justify-center text-white font-bold">
                                                G
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white">Gusto Payroll</p>
                                                <p className="text-xs text-[var(--color-success)]">Ready to sync</p>
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-sm text-[var(--color-steel)]">
                                        We found <span className="text-white font-medium">4,521 employees</span> in your Gusto account.
                                        Click continue to import their data.
                                    </p>
                                </div>
                            )}

                            {currentStep === 3 && (
                                <div className="space-y-4">
                                    <p className="text-sm text-[var(--color-steel)]">
                                        Our AI will analyze your employee data and suggest optimal offer and safe harbor codes
                                        based on coverage eligibility and affordability.
                                    </p>
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-[rgba(20,184,166,0.1)] border border-[rgba(20,184,166,0.3)]">
                                        <Sparkles className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                                        <span className="text-sm text-white">AI-powered code suggestions enabled</span>
                                    </div>
                                </div>
                            )}

                            {currentStep === 4 && (
                                <div className="space-y-4">
                                    <p className="text-sm text-[var(--color-steel)]">
                                        Generate 1095-C forms for all eligible employees. Forms will be ready for distribution
                                        and IRS electronic filing.
                                    </p>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-3 rounded-lg bg-[var(--glass-bg)]">
                                            <p className="text-2xl font-bold text-white">4,498</p>
                                            <p className="text-xs text-[var(--color-steel)]">Forms to generate</p>
                                        </div>
                                        <div className="p-3 rounded-lg bg-[var(--glass-bg)]">
                                            <p className="text-2xl font-bold text-[var(--color-success)]">62</p>
                                            <p className="text-xs text-[var(--color-steel)]">Days until deadline</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    {/* Actions */}
                    <div className="flex justify-end mt-6 pt-4 border-t border-[var(--glass-border)]">
                        <button
                            onClick={handleContinue}
                            disabled={isImporting}
                            className="btn-primary"
                        >
                            {isImporting ? (
                                <>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                        className="w-4 h-4 border-2 border-black border-t-transparent rounded-full"
                                    />
                                    Importing...
                                </>
                            ) : currentStep === steps.length - 1 ? (
                                <>
                                    Complete Setup
                                    <CheckCircle2 className="w-4 h-4" />
                                </>
                            ) : (
                                <>
                                    Continue
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default OnboardingWizard;
