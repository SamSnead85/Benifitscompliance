'use client';

import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Loader2 } from 'lucide-react';

interface StepProgressProps {
    steps: string[];
    currentStep: number;
    className?: string;
}

export function StepProgress({ steps, currentStep, className = '' }: StepProgressProps) {
    return (
        <div className={`flex items-center ${className}`}>
            {steps.map((step, i) => {
                const isComplete = i < currentStep;
                const isCurrent = i === currentStep;
                const isUpcoming = i > currentStep;

                return (
                    <div key={step} className="flex items-center">
                        {/* Step indicator */}
                        <div className="flex flex-col items-center">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${isComplete
                                        ? 'bg-[var(--color-success)] border-[var(--color-success)]'
                                        : isCurrent
                                            ? 'bg-transparent border-[var(--color-synapse-teal)]'
                                            : 'bg-transparent border-[var(--glass-border)]'
                                    }`}
                            >
                                {isComplete ? (
                                    <CheckCircle2 className="w-4 h-4 text-white" />
                                ) : isCurrent ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
                                    >
                                        <Loader2 className="w-4 h-4 text-[var(--color-synapse-teal)]" />
                                    </motion.div>
                                ) : (
                                    <Circle className="w-4 h-4 text-[var(--color-steel)]" />
                                )}
                            </motion.div>
                            <span className={`text-xs mt-2 text-center max-w-[80px] ${isComplete || isCurrent ? 'text-white' : 'text-[var(--color-steel)]'
                                }`}>
                                {step}
                            </span>
                        </div>

                        {/* Connector line */}
                        {i < steps.length - 1 && (
                            <div className="w-12 h-0.5 mx-2 mt-[-20px]">
                                <div className={`h-full ${isComplete ? 'bg-[var(--color-success)]' : 'bg-[var(--glass-border)]'
                                    }`} />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}


interface CircularProgressProps {
    value: number;
    max?: number;
    size?: number;
    strokeWidth?: number;
    color?: string;
    showLabel?: boolean;
    label?: string;
    className?: string;
}

export function CircularProgress({
    value,
    max = 100,
    size = 120,
    strokeWidth = 8,
    color = 'var(--color-synapse-teal)',
    showLabel = true,
    label,
    className = ''
}: CircularProgressProps) {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const percent = Math.min(value / max, 1);
    const offset = circumference - (percent * circumference);

    return (
        <div className={`relative inline-flex items-center justify-center ${className}`}>
            <svg width={size} height={size} className="-rotate-90">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke="var(--glass-border)"
                    strokeWidth={strokeWidth}
                />
                {/* Progress circle */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    fill="none"
                    stroke={color}
                    strokeWidth={strokeWidth}
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                />
            </svg>
            {showLabel && (
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-white">{Math.round(percent * 100)}%</span>
                    {label && <span className="text-xs text-[var(--color-steel)]">{label}</span>}
                </div>
            )}
        </div>
    );
}


interface LinearProgressProps {
    value: number;
    max?: number;
    showLabel?: boolean;
    color?: string;
    height?: number;
    className?: string;
}

export function LinearProgress({
    value,
    max = 100,
    showLabel = false,
    color = 'var(--color-synapse-teal)',
    height = 8,
    className = ''
}: LinearProgressProps) {
    const percent = Math.min((value / max) * 100, 100);

    return (
        <div className={className}>
            {showLabel && (
                <div className="flex justify-between text-xs text-[var(--color-steel)] mb-1">
                    <span>{value} / {max}</span>
                    <span>{Math.round(percent)}%</span>
                </div>
            )}
            <div
                className="rounded-full overflow-hidden bg-[var(--glass-bg)]"
                style={{ height }}
            >
                <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${percent}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                />
            </div>
        </div>
    );
}


interface ProgressStepsProps {
    total: number;
    current: number;
    color?: string;
    className?: string;
}

export function ProgressSteps({ total, current, color = 'var(--color-synapse-teal)', className = '' }: ProgressStepsProps) {
    return (
        <div className={`flex gap-1.5 ${className}`}>
            {Array.from({ length: total }).map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className={`h-1.5 flex-1 rounded-full ${i < current ? '' : 'bg-[var(--glass-border)]'
                        }`}
                    style={i < current ? { backgroundColor: color } : undefined}
                />
            ))}
        </div>
    );
}

export default StepProgress;
