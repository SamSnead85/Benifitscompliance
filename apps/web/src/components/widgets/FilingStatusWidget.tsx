'use client';

import { motion } from 'framer-motion';
import {
    FileText,
    CheckCircle2,
    Clock,
    AlertCircle,
    Upload,
    Calendar,
    ChevronRight
} from 'lucide-react';

interface FilingStatusWidgetProps {
    className?: string;
    taxYear?: number;
}

interface FilingStep {
    id: string;
    title: string;
    description: string;
    status: 'complete' | 'current' | 'upcoming';
    date?: string;
    icon: React.ElementType;
}

const generateSteps = (taxYear: number): FilingStep[] => [
    {
        id: 'generate',
        title: 'Generate Forms',
        description: 'Create 1095-C forms',
        status: 'complete',
        date: 'Jan 15, 2026',
        icon: FileText
    },
    {
        id: 'review',
        title: 'Supervisor Review',
        description: 'Validate form accuracy',
        status: 'complete',
        date: 'Jan 20, 2026',
        icon: CheckCircle2
    },
    {
        id: 'distribute',
        title: 'Employee Distribution',
        description: 'Furnish forms to employees',
        status: 'current',
        date: 'Jan 31, 2026',
        icon: Upload
    },
    {
        id: 'file',
        title: 'IRS Filing',
        description: 'Submit to IRS electronically',
        status: 'upcoming',
        date: 'Mar 31, 2026',
        icon: Calendar
    },
];

const statusConfig = {
    complete: { color: 'var(--color-success)', icon: CheckCircle2 },
    current: { color: 'var(--color-synapse-teal)', icon: Clock },
    upcoming: { color: 'var(--color-steel)', icon: Clock },
};

export function FilingStatusWidget({ className = '', taxYear = 2025 }: FilingStatusWidgetProps) {
    const steps = generateSteps(taxYear);
    const currentStep = steps.findIndex(s => s.status === 'current');
    const completedSteps = steps.filter(s => s.status === 'complete').length;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card overflow-hidden ${className}`}
        >
            {/* Header */}
            <div className="p-4 border-b border-[var(--glass-border)]">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--color-synapse-gold)] to-[var(--color-synapse-teal)] flex items-center justify-center">
                            <FileText className="w-4 h-4 text-black" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Filing Status</h3>
                            <p className="text-xs text-[var(--color-steel)]">Tax Year {taxYear}</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-sm font-medium text-white">{completedSteps}/{steps.length}</p>
                        <p className="text-xs text-[var(--color-steel)]">steps complete</p>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 h-2 rounded-full bg-[var(--glass-bg)] overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentStep + 0.5) / steps.length) * 100}%` }}
                        className="h-full rounded-full bg-gradient-to-r from-[var(--color-success)] to-[var(--color-synapse-teal)]"
                    />
                </div>
            </div>

            {/* Steps */}
            <div className="p-4">
                <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-[14px] top-4 bottom-4 w-0.5 bg-[var(--glass-border)]" />

                    {steps.map((step, i) => {
                        const config = statusConfig[step.status];
                        const StepIcon = step.icon;

                        return (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="relative pl-10 pb-4 last:pb-0"
                            >
                                {/* Node */}
                                <div
                                    className="absolute left-0 w-7 h-7 rounded-full flex items-center justify-center border-2"
                                    style={{
                                        backgroundColor: step.status === 'complete' ? config.color : 'var(--color-obsidian)',
                                        borderColor: config.color
                                    }}
                                >
                                    {step.status === 'complete' ? (
                                        <CheckCircle2 className="w-4 h-4 text-white" />
                                    ) : step.status === 'current' ? (
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ repeat: Infinity, duration: 2 }}
                                            className="w-2 h-2 rounded-full"
                                            style={{ backgroundColor: config.color }}
                                        />
                                    ) : (
                                        <div className="w-2 h-2 rounded-full bg-[var(--color-steel)]" />
                                    )}
                                </div>

                                {/* Content */}
                                <div className={`p-3 rounded-lg ${step.status === 'current'
                                        ? 'bg-[rgba(20,184,166,0.1)] border border-[var(--color-synapse-teal)]'
                                        : 'bg-[var(--glass-bg)]'
                                    }`}>
                                    <div className="flex items-center justify-between mb-1">
                                        <p className={`font-medium text-sm ${step.status === 'upcoming' ? 'text-[var(--color-steel)]' : 'text-white'
                                            }`}>
                                            {step.title}
                                        </p>
                                        {step.date && (
                                            <span className={`text-xs ${step.status === 'current' ? 'text-[var(--color-synapse-teal)]' : 'text-[var(--color-steel)]'
                                                }`}>
                                                {step.date}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-[var(--color-steel)]">{step.description}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
}

export default FilingStatusWidget;
