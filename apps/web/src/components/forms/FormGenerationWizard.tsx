'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    ChevronRight,
    ChevronLeft,
    Check,
    AlertTriangle,
    Users,
    Calendar,
    Download,
    Loader2
} from 'lucide-react';

interface FormGenerationWizardProps {
    onComplete?: (config: FormGenerationConfig) => void;
    className?: string;
}

interface FormGenerationConfig {
    formType: '1095-C' | '1094-C';
    taxYear: number;
    employeeFilter: 'all' | 'full_time' | 'selected';
    selectedEmployees: string[];
    distributionMethod: 'download' | 'email' | 'print';
    includeCorrections: boolean;
}

const steps = [
    { id: 'type', title: 'Form Type', description: 'Select which IRS form to generate' },
    { id: 'employees', title: 'Employees', description: 'Choose which employees to include' },
    { id: 'options', title: 'Options', description: 'Configure generation settings' },
    { id: 'review', title: 'Review', description: 'Confirm and generate' }
];

export function FormGenerationWizard({
    onComplete,
    className = ''
}: FormGenerationWizardProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);
    const [config, setConfig] = useState<FormGenerationConfig>({
        formType: '1095-C',
        taxYear: 2025,
        employeeFilter: 'all',
        selectedEmployees: [],
        distributionMethod: 'download',
        includeCorrections: false
    });

    const canProceed = () => {
        switch (currentStep) {
            case 0: return config.formType !== null;
            case 1: return config.employeeFilter !== null;
            case 2: return config.distributionMethod !== null;
            default: return true;
        }
    };

    const handleNext = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleGenerate = async () => {
        setIsGenerating(true);
        // Simulate generation
        await new Promise(r => setTimeout(r, 2000));
        setIsGenerating(false);
        onComplete?.(config);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-6 ${className}`}
        >
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
                <FileText className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                <h3 className="font-semibold text-white">IRS Form Generation Wizard</h3>
            </div>

            {/* Progress */}
            <div className="flex items-center gap-2 mb-8">
                {steps.map((step, i) => (
                    <div key={step.id} className="flex items-center flex-1">
                        <div className={`flex items-center gap-2 ${i <= currentStep ? 'text-white' : 'text-[var(--color-steel)]'}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${i < currentStep
                                    ? 'bg-[var(--color-synapse-teal)] text-black'
                                    : i === currentStep
                                        ? 'bg-[var(--color-synapse-teal)] text-black'
                                        : 'bg-[var(--glass-bg)] text-[var(--color-steel)]'
                                }`}>
                                {i < currentStep ? <Check className="w-4 h-4" /> : i + 1}
                            </div>
                            <span className="text-sm hidden md:block">{step.title}</span>
                        </div>
                        {i < steps.length - 1 && (
                            <div className={`flex-1 h-0.5 mx-2 ${i < currentStep ? 'bg-[var(--color-synapse-teal)]' : 'bg-[var(--glass-border)]'
                                }`} />
                        )}
                    </div>
                ))}
            </div>

            {/* Step Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="min-h-[300px]"
                >
                    {currentStep === 0 && (
                        <div className="space-y-4">
                            <h4 className="text-lg text-white mb-4">Select Form Type</h4>
                            {(['1095-C', '1094-C'] as const).map((type) => (
                                <button
                                    key={type}
                                    onClick={() => setConfig({ ...config, formType: type })}
                                    className={`w-full p-4 rounded-lg border text-left transition-colors ${config.formType === type
                                            ? 'bg-[var(--glass-bg-light)] border-[var(--color-synapse-teal)]'
                                            : 'bg-[var(--glass-bg)] border-[var(--glass-border)] hover:border-[var(--glass-border-hover)]'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="font-medium text-white">Form {type}</span>
                                            <p className="text-sm text-[var(--color-steel)]">
                                                {type === '1095-C'
                                                    ? 'Employer-Provided Health Insurance Offer and Coverage'
                                                    : 'Transmittal of Employer-Provided Health Insurance Offer and Coverage'
                                                }
                                            </p>
                                        </div>
                                        {config.formType === type && (
                                            <Check className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                                        )}
                                    </div>
                                </button>
                            ))}

                            <div className="mt-6">
                                <label className="text-sm text-[var(--color-steel)] block mb-2">Tax Year</label>
                                <select
                                    value={config.taxYear}
                                    onChange={(e) => setConfig({ ...config, taxYear: parseInt(e.target.value) })}
                                    className="w-full p-3 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-white"
                                >
                                    <option value={2025}>2025</option>
                                    <option value={2024}>2024</option>
                                    <option value={2023}>2023</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {currentStep === 1 && (
                        <div className="space-y-4">
                            <h4 className="text-lg text-white mb-4">Select Employees</h4>
                            {([
                                { value: 'all', label: 'All Eligible Employees', count: 4521 },
                                { value: 'full_time', label: 'Full-Time Only', count: 3842 },
                                { value: 'selected', label: 'Selected Employees', count: 0 }
                            ] as const).map((option) => (
                                <button
                                    key={option.value}
                                    onClick={() => setConfig({ ...config, employeeFilter: option.value })}
                                    className={`w-full p-4 rounded-lg border text-left transition-colors ${config.employeeFilter === option.value
                                            ? 'bg-[var(--glass-bg-light)] border-[var(--color-synapse-teal)]'
                                            : 'bg-[var(--glass-bg)] border-[var(--glass-border)] hover:border-[var(--glass-border-hover)]'
                                        }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Users className="w-5 h-5 text-[var(--color-steel)]" />
                                            <span className="text-white">{option.label}</span>
                                        </div>
                                        <span className="text-sm text-[var(--color-steel)]">
                                            {option.count.toLocaleString()} employees
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}

                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <h4 className="text-lg text-white mb-4">Generation Options</h4>

                            <div>
                                <label className="text-sm text-[var(--color-steel)] block mb-2">Distribution Method</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {([
                                        { value: 'download', label: 'Download', icon: Download },
                                        { value: 'email', label: 'Email', icon: FileText },
                                        { value: 'print', label: 'Print', icon: FileText }
                                    ] as const).map((method) => {
                                        const Icon = method.icon;
                                        return (
                                            <button
                                                key={method.value}
                                                onClick={() => setConfig({ ...config, distributionMethod: method.value })}
                                                className={`p-4 rounded-lg border flex flex-col items-center gap-2 transition-colors ${config.distributionMethod === method.value
                                                        ? 'bg-[var(--glass-bg-light)] border-[var(--color-synapse-teal)]'
                                                        : 'bg-[var(--glass-bg)] border-[var(--glass-border)]'
                                                    }`}
                                            >
                                                <Icon className="w-5 h-5 text-[var(--color-steel)]" />
                                                <span className="text-sm text-white">{method.label}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="corrections"
                                    checked={config.includeCorrections}
                                    onChange={(e) => setConfig({ ...config, includeCorrections: e.target.checked })}
                                    className="w-4 h-4"
                                />
                                <label htmlFor="corrections" className="text-sm text-white">
                                    Include corrected forms
                                </label>
                            </div>
                        </div>
                    )}

                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <h4 className="text-lg text-white mb-4">Review & Generate</h4>

                            <div className="p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)] space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-[var(--color-steel)]">Form Type</span>
                                    <span className="text-white">Form {config.formType}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[var(--color-steel)]">Tax Year</span>
                                    <span className="text-white">{config.taxYear}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[var(--color-steel)]">Employees</span>
                                    <span className="text-white capitalize">{config.employeeFilter.replace('_', ' ')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[var(--color-steel)]">Distribution</span>
                                    <span className="text-white capitalize">{config.distributionMethod}</span>
                                </div>
                            </div>

                            <div className="p-4 rounded-lg bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.3)]">
                                <div className="flex items-start gap-2">
                                    <AlertTriangle className="w-4 h-4 text-[var(--color-warning)] shrink-0 mt-0.5" />
                                    <div className="text-sm text-[var(--color-warning)]">
                                        <strong>Estimated generation time:</strong> 3-5 minutes for {config.employeeFilter === 'all' ? '4,521' : '3,842'} forms
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--glass-border)]">
                <button
                    onClick={handleBack}
                    disabled={currentStep === 0}
                    className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back
                </button>

                {currentStep < steps.length - 1 ? (
                    <button
                        onClick={handleNext}
                        disabled={!canProceed()}
                        className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next
                        <ChevronRight className="w-4 h-4" />
                    </button>
                ) : (
                    <button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="btn-primary disabled:opacity-50"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Generating...
                            </>
                        ) : (
                            <>
                                Generate Forms
                                <FileText className="w-4 h-4" />
                            </>
                        )}
                    </button>
                )}
            </div>
        </motion.div>
    );
}

export default FormGenerationWizard;
