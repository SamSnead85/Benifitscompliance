'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield,
    CheckCircle2,
    AlertTriangle,
    ArrowRight,
    ArrowLeft,
    Calculator,
    Users,
    DollarSign,
    TrendingDown,
    Sparkles,
    Info
} from 'lucide-react';

interface SafeHarborWizardProps {
    className?: string;
    onComplete?: (results: SafeHarborResults) => void;
}

interface SafeHarborResults {
    method: 'w2' | 'rate_of_pay' | 'fpl';
    employeesAffected: number;
    estimatedSavings: number;
    riskReduction: number;
}

const steps = [
    { id: 1, title: 'Select Method', description: 'Choose your safe harbor approach' },
    { id: 2, title: 'Employee Selection', description: 'Select employees to apply' },
    { id: 3, title: 'Review Impact', description: 'Analyze the financial impact' },
    { id: 4, title: 'Confirm & Apply', description: 'Apply changes to selected employees' },
];

const safeHarborMethods = [
    {
        id: 'w2',
        name: 'W-2 Safe Harbor',
        code: '2F',
        description: 'Based on Box 1 W-2 wages. Best for salaried employees with stable income.',
        pros: ['Simple calculation', 'Uses actual income', 'IRS-preferred'],
        cons: ['Requires W-2 after year end', 'Not ideal for variable pay'],
        recommended: true
    },
    {
        id: 'rate_of_pay',
        name: 'Rate of Pay Safe Harbor',
        code: '2H',
        description: 'Based on hourly rate × 130 hours or monthly salary. Best for hourly workers.',
        pros: ['Available in real-time', 'Good for hourly workers', 'Predictable'],
        cons: ['May underestimate for overtime', 'Requires tracking rate changes'],
        recommended: false
    },
    {
        id: 'fpl',
        name: 'Federal Poverty Line',
        code: '2G',
        description: 'Based on federal poverty guidelines. Best for low-wage workers.',
        pros: ['Simple threshold', 'Lowest contribution limit', 'Good for low-wage'],
        cons: ['May not be affordable for higher earners', 'Updates annually'],
        recommended: false
    }
];

export function SafeHarborWizard({ className = '', onComplete }: SafeHarborWizardProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
    const [selectedEmployees, setSelectedEmployees] = useState<string[]>([]);
    const [isApplying, setIsApplying] = useState(false);

    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleApply = async () => {
        setIsApplying(true);
        await new Promise(r => setTimeout(r, 2000));
        setIsApplying(false);
        onComplete?.({
            method: selectedMethod as 'w2' | 'rate_of_pay' | 'fpl',
            employeesAffected: 156,
            estimatedSavings: 45600,
            riskReduction: 34
        });
    };

    const canProceed = () => {
        if (currentStep === 1) return selectedMethod !== null;
        if (currentStep === 2) return selectedEmployees.length > 0 || true; // Allow all for demo
        return true;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card overflow-hidden ${className}`}
        >
            {/* Header */}
            <div className="p-6 border-b border-[var(--glass-border)]">
                <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-synapse-teal)] to-[var(--color-synapse-cyan)] flex items-center justify-center">
                        <Shield className="w-5 h-5 text-black" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-white">Safe Harbor Optimization Wizard</h2>
                        <p className="text-sm text-[var(--color-steel)]">Optimize affordability safe harbor codes</p>
                    </div>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-between">
                    {steps.map((step, i) => (
                        <div key={step.id} className="flex items-center">
                            <div className="flex flex-col items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${currentStep > step.id
                                        ? 'bg-[var(--color-success)] text-black'
                                        : currentStep === step.id
                                            ? 'bg-[var(--color-synapse-teal)] text-black'
                                            : 'bg-[var(--glass-bg)] text-[var(--color-steel)]'
                                    }`}>
                                    {currentStep > step.id ? (
                                        <CheckCircle2 className="w-5 h-5" />
                                    ) : (
                                        <span className="font-medium">{step.id}</span>
                                    )}
                                </div>
                                <p className={`text-xs mt-2 text-center max-w-[100px] ${currentStep >= step.id ? 'text-white' : 'text-[var(--color-steel)]'
                                    }`}>
                                    {step.title}
                                </p>
                            </div>
                            {i < steps.length - 1 && (
                                <div className={`w-20 h-0.5 mx-2 ${currentStep > step.id ? 'bg-[var(--color-success)]' : 'bg-[var(--glass-border)]'
                                    }`} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Step Content */}
            <div className="p-6 min-h-[400px]">
                <AnimatePresence mode="wait">
                    {/* Step 1: Select Method */}
                    {currentStep === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-4"
                        >
                            <h3 className="font-medium text-white mb-4">Choose Safe Harbor Method</h3>
                            {safeHarborMethods.map((method) => (
                                <div
                                    key={method.id}
                                    onClick={() => setSelectedMethod(method.id)}
                                    className={`p-4 rounded-lg border cursor-pointer transition-all ${selectedMethod === method.id
                                            ? 'border-[var(--color-synapse-teal)] bg-[rgba(20,184,166,0.1)]'
                                            : 'border-[var(--glass-border)] bg-[var(--glass-bg-light)] hover:border-[var(--color-steel)]'
                                        }`}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedMethod === method.id
                                                    ? 'border-[var(--color-synapse-teal)]'
                                                    : 'border-[var(--color-steel)]'
                                                }`}>
                                                {selectedMethod === method.id && (
                                                    <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-synapse-teal)]" />
                                                )}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium text-white">{method.name}</p>
                                                    <span className="px-2 py-0.5 rounded text-xs bg-[var(--glass-bg)] font-mono text-[var(--color-synapse-cyan)]">
                                                        {method.code}
                                                    </span>
                                                    {method.recommended && (
                                                        <span className="px-2 py-0.5 rounded text-xs bg-[rgba(34,197,94,0.2)] text-[var(--color-success)] flex items-center gap-1">
                                                            <Sparkles className="w-3 h-3" />
                                                            AI Recommended
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-[var(--color-steel)] mt-1">{method.description}</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="mt-3 ml-8 grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-[var(--color-success)] mb-1">Advantages</p>
                                            <ul className="text-xs text-[var(--color-steel)] space-y-0.5">
                                                {method.pros.map((pro, i) => (
                                                    <li key={i} className="flex items-center gap-1">
                                                        <CheckCircle2 className="w-3 h-3 text-[var(--color-success)]" />
                                                        {pro}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                        <div>
                                            <p className="text-xs text-[var(--color-warning)] mb-1">Considerations</p>
                                            <ul className="text-xs text-[var(--color-steel)] space-y-0.5">
                                                {method.cons.map((con, i) => (
                                                    <li key={i} className="flex items-center gap-1">
                                                        <AlertTriangle className="w-3 h-3 text-[var(--color-warning)]" />
                                                        {con}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {/* Step 2: Employee Selection */}
                    {currentStep === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <h3 className="font-medium text-white mb-4">Select Employees to Apply</h3>
                            <div className="p-4 rounded-lg bg-[rgba(6,182,212,0.1)] border border-[rgba(6,182,212,0.3)] mb-4">
                                <div className="flex items-start gap-3">
                                    <Info className="w-5 h-5 text-[var(--color-synapse-cyan)] shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm text-white">AI has identified 156 employees</p>
                                        <p className="text-xs text-[var(--color-steel)] mt-1">
                                            Based on your selection of Rate of Pay safe harbor, these employees would benefit most from this change.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-3 max-h-[250px] overflow-y-auto">
                                <div className="p-3 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)] flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-[var(--glass-border)]" />
                                        <div>
                                            <p className="text-sm text-white">All Recommended Employees</p>
                                            <p className="text-xs text-[var(--color-steel)]">156 employees identified by AI</p>
                                        </div>
                                    </div>
                                    <span className="px-2 py-1 rounded text-xs bg-[rgba(34,197,94,0.2)] text-[var(--color-success)]">
                                        Recommended
                                    </span>
                                </div>
                                {['Hourly Workers - Manufacturing', 'Part-Time Staff', 'Variable Hour Employees', 'Seasonal Workers'].map((group) => (
                                    <div key={group} className="p-3 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)] flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <input type="checkbox" className="w-4 h-4 rounded border-[var(--glass-border)]" />
                                            <div>
                                                <p className="text-sm text-white">{group}</p>
                                                <p className="text-xs text-[var(--color-steel)]">{Math.floor(Math.random() * 50 + 20)} employees</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Review Impact */}
                    {currentStep === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <h3 className="font-medium text-white mb-4">Review Financial Impact</h3>
                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)] text-center">
                                    <Users className="w-6 h-6 mx-auto text-[var(--color-synapse-teal)] mb-2" />
                                    <p className="text-2xl font-bold text-white font-mono">156</p>
                                    <p className="text-xs text-[var(--color-steel)]">Employees Affected</p>
                                </div>
                                <div className="p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)] text-center">
                                    <TrendingDown className="w-6 h-6 mx-auto text-[var(--color-success)] mb-2" />
                                    <p className="text-2xl font-bold text-white font-mono">34%</p>
                                    <p className="text-xs text-[var(--color-steel)]">Risk Reduction</p>
                                </div>
                                <div className="p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)] text-center">
                                    <DollarSign className="w-6 h-6 mx-auto text-[var(--color-synapse-gold)] mb-2" />
                                    <p className="text-2xl font-bold text-white font-mono">$45.6K</p>
                                    <p className="text-xs text-[var(--color-steel)]">Potential Penalty Avoided</p>
                                </div>
                            </div>
                            <div className="p-4 rounded-lg bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.3)]">
                                <div className="flex items-start gap-3">
                                    <CheckCircle2 className="w-5 h-5 text-[var(--color-success)] shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-sm font-medium text-white">No Negative Impact Detected</p>
                                        <p className="text-xs text-[var(--color-steel)] mt-1">
                                            All selected employees will remain in full compliance after this change. No coverage gaps or affordability issues detected.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Step 4: Confirm */}
                    {currentStep === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="text-center"
                        >
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-synapse-teal)] to-[var(--color-synapse-cyan)] flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-8 h-8 text-black" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Ready to Apply Changes</h3>
                            <p className="text-[var(--color-steel)] mb-6">
                                This will update the safe harbor code for 156 employees from W-2 (2F) to Rate of Pay (2H).
                            </p>
                            <div className="p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)] text-left max-w-md mx-auto">
                                <p className="text-sm text-[var(--color-steel)] mb-2">Summary of Changes:</p>
                                <ul className="text-sm text-white space-y-1">
                                    <li>• Safe Harbor: W-2 (2F) → Rate of Pay (2H)</li>
                                    <li>• Employees Affected: 156</li>
                                    <li>• Effective: January 2026</li>
                                    <li>• Forms to Regenerate: 156</li>
                                </ul>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer Actions */}
            <div className="p-6 border-t border-[var(--glass-border)] flex items-center justify-between">
                <button
                    onClick={handleBack}
                    disabled={currentStep === 1}
                    className="btn-secondary disabled:opacity-50"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back
                </button>
                {currentStep < steps.length ? (
                    <button
                        onClick={handleNext}
                        disabled={!canProceed()}
                        className="btn-primary disabled:opacity-50"
                    >
                        Continue
                        <ArrowRight className="w-4 h-4" />
                    </button>
                ) : (
                    <button
                        onClick={handleApply}
                        disabled={isApplying}
                        className="btn-primary"
                    >
                        {isApplying ? (
                            <>Applying Changes...</>
                        ) : (
                            <>
                                <CheckCircle2 className="w-4 h-4" />
                                Apply Changes
                            </>
                        )}
                    </button>
                )}
            </div>
        </motion.div>
    );
}

export default SafeHarborWizard;
