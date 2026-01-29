'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Download,
    Upload,
    FileSpreadsheet,
    FileText,
    Database,
    ChevronRight,
    ChevronLeft,
    CheckCircle2,
    AlertTriangle,
    Settings,
    ArrowRight,
    Table,
    Columns,
    Filter,
    Calendar,
    Users,
    Building2,
    Loader2
} from 'lucide-react';

interface ExportImportWizardProps {
    className?: string;
    mode?: 'export' | 'import';
}

const exportFormats = [
    { id: 'csv', label: 'CSV', description: 'Comma-separated values', icon: FileSpreadsheet },
    { id: 'xlsx', label: 'Excel (XLSX)', description: 'Microsoft Excel format', icon: FileSpreadsheet },
    { id: 'json', label: 'JSON', description: 'JavaScript Object Notation', icon: FileText },
    { id: 'xml', label: 'XML', description: 'Extensible Markup Language', icon: FileText },
];

const dataTypes = [
    { id: 'employees', label: 'Employees', description: 'Employee roster data', icon: Users, recordCount: 4256 },
    { id: 'forms_1095c', label: '1095-C Forms', description: 'ACA reporting forms', icon: FileText, recordCount: 4256 },
    { id: 'forms_1094c', label: '1094-C Transmittal', description: 'ALE transmittal form', icon: FileText, recordCount: 1 },
    { id: 'coverage_history', label: 'Coverage History', description: 'Monthly coverage records', icon: Calendar, recordCount: 51072 },
    { id: 'organizations', label: 'Organizations', description: 'Tenant organization data', icon: Building2, recordCount: 24 },
];

const employeeFields = [
    { id: 'employee_id', label: 'Employee ID', selected: true },
    { id: 'ssn', label: 'SSN', selected: true },
    { id: 'first_name', label: 'First Name', selected: true },
    { id: 'last_name', label: 'Last Name', selected: true },
    { id: 'dob', label: 'Date of Birth', selected: true },
    { id: 'hire_date', label: 'Hire Date', selected: true },
    { id: 'termination_date', label: 'Termination Date', selected: true },
    { id: 'department', label: 'Department', selected: false },
    { id: 'employment_status', label: 'Employment Status', selected: true },
    { id: 'ft_status', label: 'FT Status', selected: true },
    { id: 'coverage_offered', label: 'Coverage Offered', selected: true },
    { id: 'coverage_code_14', label: 'Line 14 Code', selected: true },
    { id: 'coverage_code_16', label: 'Line 16 Code', selected: true },
    { id: 'employee_share', label: 'Employee Share', selected: true },
    { id: 'address', label: 'Address', selected: false },
    { id: 'city', label: 'City', selected: false },
    { id: 'state', label: 'State', selected: false },
    { id: 'zip', label: 'ZIP Code', selected: false },
];

export function ExportImportWizard({ className = '', mode = 'export' }: ExportImportWizardProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedFormat, setSelectedFormat] = useState<string | null>(null);
    const [selectedDataType, setSelectedDataType] = useState<string | null>(null);
    const [selectedFields, setSelectedFields] = useState<string[]>(
        employeeFields.filter(f => f.selected).map(f => f.id)
    );
    const [isProcessing, setIsProcessing] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    const steps = mode === 'export'
        ? ['Select Data', 'Choose Format', 'Select Fields', 'Review & Export']
        : ['Upload File', 'Map Columns', 'Validate', 'Import'];

    const nextStep = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleProcess = () => {
        setIsProcessing(true);
        setTimeout(() => {
            setIsProcessing(false);
            setIsComplete(true);
        }, 2000);
    };

    const toggleField = (fieldId: string) => {
        setSelectedFields(prev =>
            prev.includes(fieldId)
                ? prev.filter(f => f !== fieldId)
                : [...prev, fieldId]
        );
    };

    const selectAllFields = () => {
        setSelectedFields(employeeFields.map(f => f.id));
    };

    const deselectAllFields = () => {
        setSelectedFields([]);
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 1:
                return (
                    <div className="space-y-4">
                        <p className="text-[var(--color-silver)]">
                            Select the type of data you want to {mode}.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            {dataTypes.map(type => {
                                const Icon = type.icon;
                                return (
                                    <button
                                        key={type.id}
                                        onClick={() => setSelectedDataType(type.id)}
                                        className={`p-4 rounded-lg border text-left transition-all ${selectedDataType === type.id
                                            ? 'bg-[var(--color-synapse-teal-muted)] border-[var(--color-synapse-teal)]'
                                            : 'bg-[rgba(255,255,255,0.02)] border-[var(--glass-border)] hover:border-[var(--glass-border-hover)]'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${selectedDataType === type.id
                                                ? 'bg-[var(--color-synapse-teal)] text-black'
                                                : 'bg-[rgba(255,255,255,0.05)] text-[var(--color-steel)]'
                                                }`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className={`font-medium ${selectedDataType === type.id ? 'text-[var(--color-synapse-teal)]' : 'text-white'}`}>
                                                    {type.label}
                                                </p>
                                                <p className="text-xs text-[var(--color-steel)]">{type.recordCount.toLocaleString()} records</p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-[var(--color-steel)]">{type.description}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-4">
                        <p className="text-[var(--color-silver)]">
                            Choose the file format for your {mode}.
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            {exportFormats.map(format => {
                                const Icon = format.icon;
                                return (
                                    <button
                                        key={format.id}
                                        onClick={() => setSelectedFormat(format.id)}
                                        className={`p-4 rounded-lg border text-left transition-all ${selectedFormat === format.id
                                            ? 'bg-[var(--color-synapse-teal-muted)] border-[var(--color-synapse-teal)]'
                                            : 'bg-[rgba(255,255,255,0.02)] border-[var(--glass-border)] hover:border-[var(--glass-border-hover)]'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${selectedFormat === format.id
                                                ? 'bg-[var(--color-synapse-teal)] text-black'
                                                : 'bg-[rgba(255,255,255,0.05)] text-[var(--color-steel)]'
                                                }`}>
                                                <Icon className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <p className={`font-medium ${selectedFormat === format.id ? 'text-[var(--color-synapse-teal)]' : 'text-white'}`}>
                                                    {format.label}
                                                </p>
                                                <p className="text-xs text-[var(--color-steel)]">{format.description}</p>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <p className="text-[var(--color-silver)]">
                                Select the fields to include in your {mode}.
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={selectAllFields}
                                    className="text-xs text-[var(--color-synapse-teal)] hover:underline"
                                >
                                    Select All
                                </button>
                                <span className="text-[var(--color-steel)]">|</span>
                                <button
                                    onClick={deselectAllFields}
                                    className="text-xs text-[var(--color-steel)] hover:underline"
                                >
                                    Deselect All
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-3 gap-3 max-h-[300px] overflow-y-auto p-1">
                            {employeeFields.map(field => (
                                <label
                                    key={field.id}
                                    className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${selectedFields.includes(field.id)
                                        ? 'bg-[var(--color-synapse-teal-muted)] border-[var(--color-synapse-teal)]'
                                        : 'bg-[rgba(255,255,255,0.02)] border-[var(--glass-border)] hover:border-[var(--glass-border-hover)]'
                                        }`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedFields.includes(field.id)}
                                        onChange={() => toggleField(field.id)}
                                        className="w-4 h-4 rounded border-[var(--glass-border)] bg-transparent checked:bg-[var(--color-synapse-teal)] checked:border-[var(--color-synapse-teal)]"
                                    />
                                    <span className={`text-sm ${selectedFields.includes(field.id) ? 'text-white' : 'text-[var(--color-silver)]'}`}>
                                        {field.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                        <div className="p-3 rounded-lg bg-[rgba(6,182,212,0.05)] border border-[rgba(6,182,212,0.2)]">
                            <p className="text-sm text-[var(--color-synapse-teal)]">
                                {selectedFields.length} of {employeeFields.length} fields selected
                            </p>
                        </div>
                    </div>
                );

            case 4:
                if (isComplete) {
                    return (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--color-success)] flex items-center justify-center">
                                <CheckCircle2 className="w-8 h-8 text-black" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-2">Export Complete!</h3>
                            <p className="text-[var(--color-silver)] mb-6">
                                Your file has been generated and is ready for download.
                            </p>
                            <button className="btn-primary flex items-center gap-2 mx-auto">
                                <Download className="w-4 h-4" />
                                Download File
                            </button>
                        </div>
                    );
                }

                return (
                    <div className="space-y-6">
                        <p className="text-[var(--color-silver)]">
                            Review your export configuration before processing.
                        </p>

                        <div className="space-y-3">
                            <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)]">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-[var(--color-steel)]">Data Type</span>
                                    <span className="font-medium text-white capitalize">{selectedDataType?.replace('_', ' ')}</span>
                                </div>
                            </div>
                            <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)]">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-[var(--color-steel)]">Format</span>
                                    <span className="font-medium text-white uppercase">{selectedFormat}</span>
                                </div>
                            </div>
                            <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)]">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-[var(--color-steel)]">Fields</span>
                                    <span className="font-medium text-white">{selectedFields.length} selected</span>
                                </div>
                            </div>
                            <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)]">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-[var(--color-steel)]">Estimated Records</span>
                                    <span className="font-medium text-white">
                                        {dataTypes.find(d => d.id === selectedDataType)?.recordCount.toLocaleString() || '0'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {isProcessing ? (
                            <div className="p-6 rounded-lg bg-[rgba(6,182,212,0.05)] border border-[rgba(6,182,212,0.2)] text-center">
                                <Loader2 className="w-8 h-8 mx-auto mb-3 text-[var(--color-synapse-teal)] animate-spin" />
                                <p className="text-[var(--color-synapse-teal)]">Processing export...</p>
                            </div>
                        ) : (
                            <button
                                onClick={handleProcess}
                                className="btn-primary w-full flex items-center justify-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                Generate Export
                            </button>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card ${className}`}
        >
            {/* Header */}
            <div className="p-5 border-b border-[var(--glass-border)]">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${mode === 'export'
                        ? 'bg-gradient-to-br from-[var(--color-synapse-teal)] to-[var(--color-synapse-cyan)]'
                        : 'bg-gradient-to-br from-[var(--color-synapse-amber)] to-[var(--color-synapse-coral)]'
                        }`}>
                        {mode === 'export' ? <Download className="w-5 h-5 text-black" /> : <Upload className="w-5 h-5 text-black" />}
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white capitalize">{mode} Wizard</h2>
                        <p className="text-xs text-[var(--color-steel)]">Step {currentStep} of {steps.length}</p>
                    </div>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="px-5 py-4 border-b border-[var(--glass-border)]">
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => (
                        <div key={index} className="flex items-center">
                            <div className={`flex items-center gap-2 ${currentStep > index + 1 ? 'text-[var(--color-success)]' : currentStep === index + 1 ? 'text-[var(--color-synapse-teal)]' : 'text-[var(--color-steel)]'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${currentStep === index + 1
                                    ? 'bg-[var(--color-synapse-teal)] text-black'
                                    : currentStep > index + 1
                                        ? 'bg-[var(--color-success)] text-black'
                                        : 'bg-[rgba(255,255,255,0.05)] text-[var(--color-steel)]'
                                    }`}>
                                    {currentStep > index + 1 ? <CheckCircle2 className="w-4 h-4" /> : index + 1}
                                </div>
                                <span className={`text-sm font-medium hidden md:block ${currentStep >= index + 1 ? 'text-white' : 'text-[var(--color-steel)]'}`}>
                                    {step}
                                </span>
                            </div>
                            {index < steps.length - 1 && (
                                <div className={`w-8 md:w-16 h-0.5 mx-2 ${currentStep > index + 1 ? 'bg-[var(--color-success)]' : 'bg-[var(--glass-border)]'}`} />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Step Content */}
            <div className="p-6 min-h-[400px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        {renderStepContent()}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation */}
            {!isComplete && (
                <div className="px-5 py-4 border-t border-[var(--glass-border)] flex items-center justify-between">
                    <button
                        onClick={prevStep}
                        disabled={currentStep === 1}
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${currentStep === 1
                            ? 'text-[var(--color-steel)] cursor-not-allowed'
                            : 'text-white hover:bg-[rgba(255,255,255,0.05)]'
                            }`}
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Previous
                    </button>
                    {currentStep < steps.length && (
                        <button
                            onClick={nextStep}
                            disabled={
                                (currentStep === 1 && !selectedDataType) ||
                                (currentStep === 2 && !selectedFormat) ||
                                (currentStep === 3 && selectedFields.length === 0)
                            }
                            className="btn-primary flex items-center gap-2"
                        >
                            Continue
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
            )}
        </motion.div>
    );
}

export default ExportImportWizard;
