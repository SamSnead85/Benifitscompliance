'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileSpreadsheet,
    ArrowRight,
    ArrowLeft,
    CheckCircle2,
    AlertTriangle,
    Columns,
    ArrowUpDown,
    Sparkles,
    Info
} from 'lucide-react';

interface ColumnMapping {
    sourceColumn: string;
    targetField: string;
    sampleData: string;
    status: 'mapped' | 'unmapped' | 'suggested';
}

interface DataImportWizardProps {
    className?: string;
    onComplete?: () => void;
}

const steps = [
    { id: 1, title: 'Upload File', description: 'Select your data file' },
    { id: 2, title: 'Map Columns', description: 'Match columns to fields' },
    { id: 3, title: 'Validate Data', description: 'Review and fix issues' },
    { id: 4, title: 'Import', description: 'Confirm and import' },
];

const targetFields = [
    { id: 'employee_id', label: 'Employee ID', required: true },
    { id: 'first_name', label: 'First Name', required: true },
    { id: 'last_name', label: 'Last Name', required: true },
    { id: 'ssn', label: 'SSN', required: true },
    { id: 'hire_date', label: 'Hire Date', required: true },
    { id: 'termination_date', label: 'Termination Date', required: false },
    { id: 'department', label: 'Department', required: false },
    { id: 'job_title', label: 'Job Title', required: false },
    { id: 'weekly_hours', label: 'Weekly Hours', required: true },
    { id: 'hourly_rate', label: 'Hourly Rate', required: false },
    { id: 'annual_salary', label: 'Annual Salary', required: false },
    { id: 'coverage_offered', label: 'Coverage Offered', required: false },
    { id: 'coverage_enrolled', label: 'Coverage Enrolled', required: false },
];

const mockMappings: ColumnMapping[] = [
    { sourceColumn: 'EMP_ID', targetField: 'employee_id', sampleData: 'EMP-001', status: 'mapped' },
    { sourceColumn: 'FNAME', targetField: 'first_name', sampleData: 'John', status: 'mapped' },
    { sourceColumn: 'LNAME', targetField: 'last_name', sampleData: 'Smith', status: 'mapped' },
    { sourceColumn: 'SOCIAL', targetField: 'ssn', sampleData: '***-**-4521', status: 'mapped' },
    { sourceColumn: 'START_DATE', targetField: 'hire_date', sampleData: '01/15/2020', status: 'suggested' },
    { sourceColumn: 'HOURS', targetField: 'weekly_hours', sampleData: '40', status: 'suggested' },
    { sourceColumn: 'DEPT', targetField: 'department', sampleData: 'Engineering', status: 'unmapped' },
];

export function DataImportWizard({ className = '', onComplete }: DataImportWizardProps) {
    const [currentStep, setCurrentStep] = useState(2); // Start at mapping for demo
    const [mappings, setMappings] = useState<ColumnMapping[]>(mockMappings);
    const [isImporting, setIsImporting] = useState(false);

    const mappedCount = mappings.filter(m => m.status === 'mapped').length;
    const suggestedCount = mappings.filter(m => m.status === 'suggested').length;
    const unmappedCount = mappings.filter(m => m.status === 'unmapped').length;

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

    const handleImport = async () => {
        setIsImporting(true);
        await new Promise(r => setTimeout(r, 3000));
        setIsImporting(false);
        onComplete?.();
    };

    const acceptSuggestion = (sourceColumn: string) => {
        setMappings(prev => prev.map(m =>
            m.sourceColumn === sourceColumn ? { ...m, status: 'mapped' } : m
        ));
    };

    const acceptAllSuggestions = () => {
        setMappings(prev => prev.map(m =>
            m.status === 'suggested' ? { ...m, status: 'mapped' } : m
        ));
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
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-synapse-gold)] to-[var(--color-warning)] flex items-center justify-center">
                        <FileSpreadsheet className="w-5 h-5 text-black" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-white">Data Import Wizard</h2>
                        <p className="text-sm text-[var(--color-steel)]">Import employee data from external files</p>
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
                                <p className={`text-xs mt-2 ${currentStep >= step.id ? 'text-white' : 'text-[var(--color-steel)]'
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
                    {/* Step 2: Column Mapping */}
                    {currentStep === 2 && (
                        <motion.div
                            key="step2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-medium text-white flex items-center gap-2">
                                    <Columns className="w-5 h-5 text-[var(--color-synapse-cyan)]" />
                                    Column Mapping
                                </h3>
                                <div className="flex items-center gap-4 text-sm">
                                    <span className="text-[var(--color-success)]">{mappedCount} mapped</span>
                                    <span className="text-[var(--color-synapse-gold)]">{suggestedCount} suggested</span>
                                    <span className="text-[var(--color-steel)]">{unmappedCount} unmapped</span>
                                </div>
                            </div>

                            {suggestedCount > 0 && (
                                <div className="p-3 rounded-lg bg-[rgba(20,184,166,0.1)] border border-[rgba(20,184,166,0.3)] mb-4 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-sm">
                                        <Sparkles className="w-4 h-4 text-[var(--color-synapse-teal)]" />
                                        <span className="text-white">AI detected {suggestedCount} column mappings</span>
                                    </div>
                                    <button
                                        onClick={acceptAllSuggestions}
                                        className="px-3 py-1 rounded text-sm bg-[var(--color-synapse-teal)] text-black hover:opacity-90"
                                    >
                                        Accept All
                                    </button>
                                </div>
                            )}

                            <div className="space-y-2 max-h-[280px] overflow-y-auto">
                                {mappings.map((mapping, i) => (
                                    <motion.div
                                        key={mapping.sourceColumn}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.03 }}
                                        className={`p-3 rounded-lg border flex items-center gap-4 ${mapping.status === 'mapped'
                                                ? 'bg-[rgba(34,197,94,0.05)] border-[rgba(34,197,94,0.3)]'
                                                : mapping.status === 'suggested'
                                                    ? 'bg-[rgba(6,182,212,0.05)] border-[rgba(6,182,212,0.3)]'
                                                    : 'bg-[var(--glass-bg-light)] border-[var(--glass-border)]'
                                            }`}
                                    >
                                        <div className="flex-1">
                                            <p className="text-sm font-mono text-white">{mapping.sourceColumn}</p>
                                            <p className="text-xs text-[var(--color-steel)]">Sample: {mapping.sampleData}</p>
                                        </div>

                                        <ArrowRight className="w-4 h-4 text-[var(--color-steel)]" />

                                        <div className="flex-1">
                                            <select
                                                value={mapping.targetField}
                                                onChange={() => { }} // Would handle mapping change
                                                className="w-full px-3 py-2 rounded bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm text-white"
                                            >
                                                <option value="">-- Select Field --</option>
                                                {targetFields.map(field => (
                                                    <option key={field.id} value={field.id}>
                                                        {field.label} {field.required ? '*' : ''}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="w-24 text-right">
                                            {mapping.status === 'mapped' && (
                                                <span className="px-2 py-1 rounded text-xs bg-[rgba(34,197,94,0.2)] text-[var(--color-success)] flex items-center gap-1 justify-end">
                                                    <CheckCircle2 className="w-3 h-3" />
                                                    Mapped
                                                </span>
                                            )}
                                            {mapping.status === 'suggested' && (
                                                <button
                                                    onClick={() => acceptSuggestion(mapping.sourceColumn)}
                                                    className="px-2 py-1 rounded text-xs bg-[var(--color-synapse-teal)] text-black"
                                                >
                                                    Accept
                                                </button>
                                            )}
                                            {mapping.status === 'unmapped' && (
                                                <span className="px-2 py-1 rounded text-xs bg-[rgba(245,158,11,0.2)] text-[var(--color-warning)]">
                                                    Unmapped
                                                </span>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Step 3: Validation */}
                    {currentStep === 3 && (
                        <motion.div
                            key="step3"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <h3 className="font-medium text-white mb-4">Data Validation Results</h3>

                            <div className="grid grid-cols-3 gap-4 mb-6">
                                <div className="p-4 rounded-lg bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.3)] text-center">
                                    <p className="text-2xl font-bold text-[var(--color-success)] font-mono">4,498</p>
                                    <p className="text-xs text-[var(--color-steel)]">Valid Records</p>
                                </div>
                                <div className="p-4 rounded-lg bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.3)] text-center">
                                    <p className="text-2xl font-bold text-[var(--color-warning)] font-mono">23</p>
                                    <p className="text-xs text-[var(--color-steel)]">Warnings</p>
                                </div>
                                <div className="p-4 rounded-lg bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)] text-center">
                                    <p className="text-2xl font-bold text-[var(--color-critical)] font-mono">0</p>
                                    <p className="text-xs text-[var(--color-steel)]">Errors</p>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <h4 className="text-sm font-medium text-white">Warnings (23)</h4>
                                {[
                                    { issue: 'Missing termination date for inactive employees', count: 12 },
                                    { issue: 'Weekly hours less than typical full-time threshold', count: 8 },
                                    { issue: 'Duplicate employee IDs detected', count: 3 },
                                ].map((warning, i) => (
                                    <div key={i} className="p-3 rounded-lg bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.3)] flex items-center gap-3">
                                        <AlertTriangle className="w-4 h-4 text-[var(--color-warning)]" />
                                        <p className="text-sm text-white flex-1">{warning.issue}</p>
                                        <span className="text-xs text-[var(--color-warning)]">{warning.count} records</span>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {/* Step 4: Import */}
                    {currentStep === 4 && (
                        <motion.div
                            key="step4"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="text-center"
                        >
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[var(--color-synapse-teal)] to-[var(--color-synapse-cyan)] flex items-center justify-center mx-auto mb-4">
                                <FileSpreadsheet className="w-8 h-8 text-black" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Ready to Import</h3>
                            <p className="text-[var(--color-steel)] mb-6">
                                4,498 employee records will be imported into the system.
                            </p>

                            <div className="p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)] text-left max-w-md mx-auto mb-6">
                                <p className="text-sm text-[var(--color-steel)] mb-2">Import Summary:</p>
                                <ul className="text-sm text-white space-y-1">
                                    <li>• New records: 4,156</li>
                                    <li>• Updates to existing: 342</li>
                                    <li>• Skipped (warnings): 23</li>
                                </ul>
                            </div>

                            <div className="p-3 rounded-lg bg-[rgba(6,182,212,0.1)] border border-[rgba(6,182,212,0.3)] max-w-md mx-auto">
                                <div className="flex items-start gap-2 text-left">
                                    <Info className="w-4 h-4 text-[var(--color-synapse-cyan)] shrink-0 mt-0.5" />
                                    <p className="text-xs text-[var(--color-steel)]">
                                        Import will run in the background. You'll be notified when complete.
                                    </p>
                                </div>
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
                    <button onClick={handleNext} className="btn-primary">
                        Continue
                        <ArrowRight className="w-4 h-4" />
                    </button>
                ) : (
                    <button
                        onClick={handleImport}
                        disabled={isImporting}
                        className="btn-primary"
                    >
                        {isImporting ? (
                            <>Importing...</>
                        ) : (
                            <>
                                <CheckCircle2 className="w-4 h-4" />
                                Start Import
                            </>
                        )}
                    </button>
                )}
            </div>
        </motion.div>
    );
}

export default DataImportWizard;
