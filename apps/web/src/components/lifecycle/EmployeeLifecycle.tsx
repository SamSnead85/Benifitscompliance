'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
    User,
    Calendar,
    Clock,
    CheckCircle2,
    AlertCircle,
    ChevronRight,
    ChevronLeft,
    Building2,
    Briefcase,
    Heart,
    Shield,
    FileText,
    Mail,
    Phone,
    MapPin,
} from 'lucide-react';

interface OnboardingStep {
    id: string;
    title: string;
    description: string;
    isComplete: boolean;
    isRequired: boolean;
    fields?: React.ReactNode;
}

interface EmployeeOnboardingWizardProps {
    steps: OnboardingStep[];
    currentStep: number;
    onStepChange: (step: number) => void;
    onComplete: () => void;
    className?: string;
}

/**
 * Employee Onboarding Wizard
 * Multi-step new hire enrollment process
 */
export function EmployeeOnboardingWizard({
    steps,
    currentStep,
    onStepChange,
    onComplete,
    className = '',
}: EmployeeOnboardingWizardProps) {
    const step = steps[currentStep];
    const isLastStep = currentStep === steps.length - 1;
    const isFirstStep = currentStep === 0;
    const completedSteps = steps.filter(s => s.isComplete).length;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card overflow-hidden ${className}`}
        >
            {/* Header */}
            <div className="p-5 border-b border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                            New Employee Onboarding
                        </h2>
                        <p className="text-xs text-[#64748B] mt-0.5">
                            Step {currentStep + 1} of {steps.length} • {completedSteps} completed
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        {steps.map((s, i) => (
                            <button
                                key={s.id}
                                onClick={() => onStepChange(i)}
                                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium
                  ${i === currentStep
                                        ? 'bg-cyan-500/20 text-cyan-400 ring-2 ring-cyan-500/50'
                                        : s.isComplete
                                            ? 'bg-emerald-500/20 text-emerald-400'
                                            : 'bg-[rgba(255,255,255,0.04)] text-[#64748B]'
                                    }
                `}
                            >
                                {s.isComplete ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="h-1 rounded-full bg-[rgba(255,255,255,0.1)] overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                        className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full"
                    />
                </div>
            </div>

            {/* Step Content */}
            <div className="p-6">
                <div className="mb-6">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-base font-semibold text-white">{step.title}</h3>
                        {step.isRequired && (
                            <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase bg-red-500/10 text-red-400 rounded">
                                Required
                            </span>
                        )}
                    </div>
                    <p className="text-sm text-[#94A3B8]">{step.description}</p>
                </div>

                <div className="min-h-[300px]">
                    {step.fields}
                </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between p-5 border-t border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.01)]">
                <button
                    onClick={() => onStepChange(currentStep - 1)}
                    disabled={isFirstStep}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#94A3B8] hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                </button>

                <motion.button
                    onClick={() => isLastStep ? onComplete() : onStepChange(currentStep + 1)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-6 py-2.5 text-sm font-semibold text-[#030712] bg-gradient-to-b from-cyan-500 to-teal-600 rounded-lg flex items-center gap-2"
                >
                    {isLastStep ? 'Complete Onboarding' : 'Continue'}
                    {!isLastStep && <ChevronRight className="w-4 h-4" />}
                </motion.button>
            </div>
        </motion.div>
    );
}

/**
 * Employee Status Timeline
 * Visual history of employment status changes
 */
interface StatusEvent {
    id: string;
    date: string;
    type: 'hired' | 'eligibility_change' | 'coverage_change' | 'termination' | 'status_change' | 'other';
    title: string;
    description: string;
    metadata?: Record<string, string>;
}

interface EmployeeStatusTimelineProps {
    events: StatusEvent[];
    className?: string;
}

export function EmployeeStatusTimeline({
    events,
    className = '',
}: EmployeeStatusTimelineProps) {
    const getEventConfig = (type: StatusEvent['type']) => {
        switch (type) {
            case 'hired': return {
                icon: <User className="w-4 h-4" />,
                color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/50'
            };
            case 'eligibility_change': return {
                icon: <Clock className="w-4 h-4" />,
                color: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/50'
            };
            case 'coverage_change': return {
                icon: <Heart className="w-4 h-4" />,
                color: 'bg-pink-500/20 text-pink-400 border-pink-500/50'
            };
            case 'termination': return {
                icon: <AlertCircle className="w-4 h-4" />,
                color: 'bg-red-500/20 text-red-400 border-red-500/50'
            };
            case 'status_change': return {
                icon: <Briefcase className="w-4 h-4" />,
                color: 'bg-amber-500/20 text-amber-400 border-amber-500/50'
            };
            default: return {
                icon: <FileText className="w-4 h-4" />,
                color: 'bg-[rgba(255,255,255,0.06)] text-[#94A3B8] border-[rgba(255,255,255,0.1)]'
            };
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-5 ${className}`}
        >
            <h3 className="text-base font-semibold text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>
                Employment Timeline
            </h3>

            <div className="space-y-0">
                {events.map((event, index) => {
                    const config = getEventConfig(event.type);

                    return (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="relative flex gap-4 pb-6 last:pb-0"
                        >
                            {/* Timeline Line & Dot */}
                            <div className="flex flex-col items-center">
                                <div className={`relative z-10 w-8 h-8 rounded-full ${config.color} border flex items-center justify-center`}>
                                    {config.icon}
                                </div>
                                {index < events.length - 1 && (
                                    <div className="w-0.5 flex-1 mt-2 bg-[rgba(255,255,255,0.08)]" />
                                )}
                            </div>

                            {/* Content */}
                            <div className="flex-1 pb-2">
                                <div className="flex items-center gap-2 mb-1">
                                    <p className="text-xs font-medium text-[#64748B]">{event.date}</p>
                                </div>
                                <h4 className="text-sm font-medium text-white mb-1">{event.title}</h4>
                                <p className="text-xs text-[#94A3B8]">{event.description}</p>

                                {event.metadata && Object.keys(event.metadata).length > 0 && (
                                    <div className="flex gap-3 mt-2">
                                        {Object.entries(event.metadata).map(([key, value]) => (
                                            <span key={key} className="text-[10px] text-[#64748B]">
                                                <span className="text-[#94A3B8]">{key}:</span> {value}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}

/**
 * Termination Workflow
 * Manage employee termination process
 */
interface TerminationWorkflowProps {
    employee: {
        name: string;
        id: string;
        department: string;
        hireDate: string;
        coverageEndDate?: string;
    };
    onSubmit?: (data: { reason: string; lastDay: string; cobraEligible: boolean }) => void;
    className?: string;
}

export function TerminationWorkflow({
    employee,
    onSubmit,
    className = '',
}: TerminationWorkflowProps) {
    const [reason, setReason] = useState('');
    const [lastDay, setLastDay] = useState('');
    const [cobraEligible, setCobraEligible] = useState(true);
    const [sendNotification, setSendNotification] = useState(true);

    const reasons = [
        'Voluntary Resignation',
        'Retirement',
        'Position Eliminated',
        'Performance',
        'Misconduct',
        'End of Contract',
        'Other',
    ];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card overflow-hidden ${className}`}
        >
            <div className="p-5 border-b border-[rgba(255,255,255,0.06)] bg-red-500/5">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                        <AlertCircle className="w-5 h-5 text-red-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                            Termination Workflow
                        </h2>
                        <p className="text-xs text-[#64748B]">Process employee separation</p>
                    </div>
                </div>
            </div>

            <div className="p-5 space-y-4">
                {/* Employee Info */}
                <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)]">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center text-lg font-semibold text-red-400">
                            {employee.name.charAt(0)}
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white">{employee.name}</p>
                            <p className="text-xs text-[#64748B]">{employee.id} • {employee.department}</p>
                            <p className="text-[10px] text-[#64748B]">Hired: {employee.hireDate}</p>
                        </div>
                    </div>
                </div>

                {/* Reason */}
                <div>
                    <label className="block text-xs font-medium text-[#94A3B8] mb-2">Termination Reason</label>
                    <select
                        value={reason}
                        onChange={e => setReason(e.target.value)}
                        className="w-full px-3 py-2 text-sm text-white bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-lg focus:outline-none focus:border-cyan-500/50"
                    >
                        <option value="">Select reason...</option>
                        {reasons.map(r => (
                            <option key={r} value={r}>{r}</option>
                        ))}
                    </select>
                </div>

                {/* Last Day */}
                <div>
                    <label className="block text-xs font-medium text-[#94A3B8] mb-2">Last Day of Work</label>
                    <input
                        type="date"
                        value={lastDay}
                        onChange={e => setLastDay(e.target.value)}
                        className="w-full px-3 py-2 text-sm text-white bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-lg focus:outline-none focus:border-cyan-500/50"
                    />
                </div>

                {/* Options */}
                <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={cobraEligible}
                            onChange={e => setCobraEligible(e.target.checked)}
                            className="w-4 h-4 rounded border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.03)] text-cyan-500 focus:ring-cyan-500/20"
                        />
                        <div>
                            <span className="text-sm text-white">COBRA Eligible</span>
                            <p className="text-xs text-[#64748B]">Employee qualifies for continuation coverage</p>
                        </div>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={sendNotification}
                            onChange={e => setSendNotification(e.target.checked)}
                            className="w-4 h-4 rounded border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.03)] text-cyan-500 focus:ring-cyan-500/20"
                        />
                        <div>
                            <span className="text-sm text-white">Send COBRA Notice</span>
                            <p className="text-xs text-[#64748B]">Automatically generate and send COBRA election notice</p>
                        </div>
                    </label>
                </div>
            </div>

            <div className="p-5 border-t border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.01)]">
                <motion.button
                    onClick={() => onSubmit?.({ reason, lastDay, cobraEligible })}
                    disabled={!reason || !lastDay}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-2.5 px-4 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 disabled:opacity-50 transition-colors"
                >
                    Process Termination
                </motion.button>
            </div>
        </motion.div>
    );
}

export default EmployeeOnboardingWizard;
