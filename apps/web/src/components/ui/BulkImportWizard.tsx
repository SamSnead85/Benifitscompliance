'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Upload,
    FileSpreadsheet,
    CheckCircle2,
    AlertTriangle,
    AlertCircle,
    X,
    Download,
    ChevronRight,
    ChevronLeft,
    Users,
    Loader2,
    FileText,
    Check
} from 'lucide-react';

interface ValidationError {
    row: number;
    field: string;
    value: string;
    message: string;
    severity: 'error' | 'warning';
}

interface ImportedEmployee {
    firstName: string;
    lastName: string;
    ssn: string;
    dateOfBirth: string;
    hireDate: string;
    hoursPerWeek: number;
    employeeId: string;
    department: string;
    status: 'valid' | 'warning' | 'error';
    errors?: ValidationError[];
}

interface BulkImportWizardProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: (employees: ImportedEmployee[]) => void;
    clientId: string;
    clientName: string;
}

const REQUIRED_COLUMNS = [
    'first_name',
    'last_name',
    'ssn',
    'date_of_birth',
    'hire_date',
    'hours_per_week'
];

const OPTIONAL_COLUMNS = [
    'employee_id',
    'department',
    'termination_date',
    'coverage_start_date',
    'plan_type'
];

// Demo data for preview
const demoEmployees: ImportedEmployee[] = [
    { firstName: 'John', lastName: 'Smith', ssn: '***-**-4521', dateOfBirth: '1985-03-15', hireDate: '2020-01-15', hoursPerWeek: 40, employeeId: 'EMP-001', department: 'Engineering', status: 'valid' },
    { firstName: 'Sarah', lastName: 'Johnson', ssn: '***-**-8832', dateOfBirth: '1990-07-22', hireDate: '2021-06-01', hoursPerWeek: 35, employeeId: 'EMP-002', department: 'Marketing', status: 'valid' },
    { firstName: 'Michael', lastName: 'Davis', ssn: '***-**-1234', dateOfBirth: '1988-11-08', hireDate: '2019-03-20', hoursPerWeek: 40, employeeId: 'EMP-003', department: 'Sales', status: 'warning', errors: [{ row: 3, field: 'hours_per_week', value: '40', message: 'Employee approaches variable hour threshold', severity: 'warning' }] },
    { firstName: 'Emily', lastName: 'Chen', ssn: '***-**-5678', dateOfBirth: '1992-05-30', hireDate: '2022-09-12', hoursPerWeek: 28, employeeId: 'EMP-004', department: 'HR', status: 'warning', errors: [{ row: 4, field: 'hours_per_week', value: '28', message: 'Part-time status - may need measurement period', severity: 'warning' }] },
    { firstName: 'Robert', lastName: 'Wilson', ssn: '', dateOfBirth: '1975-12-01', hireDate: '2018-04-10', hoursPerWeek: 40, employeeId: 'EMP-005', department: 'Finance', status: 'error', errors: [{ row: 5, field: 'ssn', value: '', message: 'SSN is required for 1095-C generation', severity: 'error' }] },
];

export function BulkImportWizard({ isOpen, onClose, onComplete, clientId, clientName }: BulkImportWizardProps) {
    const [step, setStep] = useState<'upload' | 'mapping' | 'validation' | 'review' | 'importing' | 'complete'>('upload');
    const [file, setFile] = useState<File | null>(null);
    const [employees, setEmployees] = useState<ImportedEmployee[]>([]);
    const [progress, setProgress] = useState(0);

    const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile) {
            setFile(selectedFile);
        }
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        const droppedFile = e.dataTransfer.files[0];
        if (droppedFile && (droppedFile.name.endsWith('.csv') || droppedFile.name.endsWith('.xlsx'))) {
            setFile(droppedFile);
        }
    }, []);

    const handleNextStep = async () => {
        if (step === 'upload' && file) {
            setStep('mapping');
        } else if (step === 'mapping') {
            setStep('validation');
            // Simulate validation
            await new Promise(resolve => setTimeout(resolve, 1500));
            setEmployees(demoEmployees);
            setStep('review');
        } else if (step === 'review') {
            setStep('importing');
            // Simulate import
            for (let i = 0; i <= 100; i += 10) {
                await new Promise(resolve => setTimeout(resolve, 200));
                setProgress(i);
            }
            setStep('complete');
        } else if (step === 'complete') {
            onComplete(employees.filter(e => e.status !== 'error'));
            handleClose();
        }
    };

    const handleClose = () => {
        setStep('upload');
        setFile(null);
        setEmployees([]);
        setProgress(0);
        onClose();
    };

    const downloadTemplate = () => {
        const csv = `first_name,last_name,ssn,date_of_birth,hire_date,hours_per_week,employee_id,department
John,Doe,123-45-6789,1985-03-15,2020-01-15,40,EMP-001,Engineering
Jane,Smith,987-65-4321,1990-07-22,2021-06-01,35,EMP-002,Marketing`;

        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'employee_import_template.csv';
        a.click();
    };

    const validCount = employees.filter(e => e.status === 'valid').length;
    const warningCount = employees.filter(e => e.status === 'warning').length;
    const errorCount = employees.filter(e => e.status === 'error').length;

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
                onClick={handleClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="glass-card w-full max-w-3xl max-h-[85vh] flex flex-col m-4 overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--glass-border)]">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-[rgba(6,182,212,0.15)] flex items-center justify-center">
                                <Users className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                            </div>
                            <div>
                                <h2 className="font-semibold text-white">Bulk Employee Import</h2>
                                <p className="text-xs text-[var(--color-steel)]">{clientName}</p>
                            </div>
                        </div>
                        <button onClick={handleClose} className="p-2 rounded-lg hover:bg-[var(--glass-bg-light)] text-[var(--color-steel)] hover:text-white transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Step Indicator */}
                    <div className="px-6 py-3 border-b border-[var(--glass-border)] bg-[var(--glass-bg-light)]">
                        <div className="flex items-center justify-between">
                            {['Upload', 'Map Fields', 'Review', 'Import'].map((label, i) => {
                                const stepIndex = ['upload', 'mapping', 'review', 'complete'].indexOf(step);
                                const isActive = i <= (step === 'validation' || step === 'importing' ? 2 : stepIndex);
                                const isCurrent = i === stepIndex || (step === 'validation' && i === 1) || (step === 'importing' && i === 3);

                                return (
                                    <div key={label} className="flex items-center">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${isActive
                                                ? 'bg-[var(--color-synapse-teal)] text-black'
                                                : 'bg-[var(--glass-bg)] text-[var(--color-steel)]'
                                            } ${isCurrent ? 'ring-2 ring-[var(--color-synapse-teal)] ring-offset-2 ring-offset-[var(--color-charcoal)]' : ''}`}>
                                            {i + 1}
                                        </div>
                                        <span className={`ml-2 text-sm hidden sm:inline ${isActive ? 'text-white' : 'text-[var(--color-steel)]'}`}>
                                            {label}
                                        </span>
                                        {i < 3 && <ChevronRight className="w-4 h-4 mx-4 text-[var(--color-steel)]" />}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex-1 overflow-auto p-6">
                        {/* Upload Step */}
                        {step === 'upload' && (
                            <div className="space-y-6">
                                <div
                                    onDrop={handleDrop}
                                    onDragOver={(e) => e.preventDefault()}
                                    className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${file
                                            ? 'border-[var(--color-synapse-teal)] bg-[rgba(6,182,212,0.05)]'
                                            : 'border-[var(--glass-border)] hover:border-[var(--color-synapse-teal)]'
                                        }`}
                                >
                                    {file ? (
                                        <div className="flex items-center justify-center gap-4">
                                            <FileSpreadsheet className="w-12 h-12 text-[var(--color-synapse-teal)]" />
                                            <div className="text-left">
                                                <p className="font-medium text-white">{file.name}</p>
                                                <p className="text-sm text-[var(--color-steel)]">
                                                    {(file.size / 1024).toFixed(1)} KB
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => setFile(null)}
                                                className="p-2 rounded-lg hover:bg-[var(--glass-bg-light)] text-[var(--color-steel)]"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <Upload className="w-12 h-12 text-[var(--color-steel)] mx-auto mb-4" />
                                            <p className="text-lg font-medium text-white mb-2">Drop your file here</p>
                                            <p className="text-sm text-[var(--color-steel)] mb-4">or click to browse</p>
                                            <input
                                                type="file"
                                                accept=".csv,.xlsx"
                                                onChange={handleFileSelect}
                                                className="hidden"
                                                id="file-input"
                                            />
                                            <label htmlFor="file-input" className="btn-secondary cursor-pointer">
                                                <FileText className="w-4 h-4" />
                                                Select CSV or Excel File
                                            </label>
                                        </>
                                    )}
                                </div>

                                <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]">
                                    <div>
                                        <p className="text-sm font-medium text-white">Need a template?</p>
                                        <p className="text-xs text-[var(--color-steel)]">Download our CSV template with all required fields</p>
                                    </div>
                                    <button onClick={downloadTemplate} className="btn-secondary text-sm">
                                        <Download className="w-4 h-4" />
                                        Download Template
                                    </button>
                                </div>

                                <div className="text-sm text-[var(--color-steel)]">
                                    <p className="font-medium text-white mb-2">Required columns:</p>
                                    <div className="flex flex-wrap gap-2">
                                        {REQUIRED_COLUMNS.map(col => (
                                            <span key={col} className="px-2 py-1 rounded bg-[var(--glass-bg)] text-[var(--color-silver)] font-mono text-xs">
                                                {col}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Mapping Step */}
                        {step === 'mapping' && (
                            <div className="space-y-4">
                                <p className="text-sm text-[var(--color-silver)]">
                                    Map your file columns to the required fields. We&apos;ve auto-detected most mappings.
                                </p>
                                <div className="space-y-3">
                                    {REQUIRED_COLUMNS.map(col => (
                                        <div key={col} className="flex items-center gap-4 p-3 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]">
                                            <span className="w-40 text-sm font-medium text-white">{col.replace(/_/g, ' ')}</span>
                                            <ChevronRight className="w-4 h-4 text-[var(--color-steel)]" />
                                            <select className="flex-1 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded-lg px-3 py-2 text-sm text-white">
                                                <option value={col}>{col}</option>
                                            </select>
                                            <CheckCircle2 className="w-5 h-5 text-[var(--color-success)]" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Validation Step */}
                        {step === 'validation' && (
                            <div className="flex flex-col items-center justify-center py-12">
                                <Loader2 className="w-12 h-12 text-[var(--color-synapse-teal)] animate-spin mb-4" />
                                <p className="text-lg font-medium text-white">Validating employee data...</p>
                                <p className="text-sm text-[var(--color-steel)]">Checking for duplicates and compliance requirements</p>
                            </div>
                        )}

                        {/* Review Step */}
                        {step === 'review' && (
                            <div className="space-y-4">
                                {/* Summary */}
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="p-4 rounded-lg bg-[rgba(16,185,129,0.1)] border border-[rgba(16,185,129,0.3)]">
                                        <div className="flex items-center gap-2 text-[var(--color-success)]">
                                            <CheckCircle2 className="w-5 h-5" />
                                            <span className="text-2xl font-bold">{validCount}</span>
                                        </div>
                                        <p className="text-xs text-[var(--color-steel)] mt-1">Ready to import</p>
                                    </div>
                                    <div className="p-4 rounded-lg bg-[rgba(245,158,11,0.1)] border border-[rgba(245,158,11,0.3)]">
                                        <div className="flex items-center gap-2 text-[var(--color-warning)]">
                                            <AlertTriangle className="w-5 h-5" />
                                            <span className="text-2xl font-bold">{warningCount}</span>
                                        </div>
                                        <p className="text-xs text-[var(--color-steel)] mt-1">Warnings (will import)</p>
                                    </div>
                                    <div className="p-4 rounded-lg bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)]">
                                        <div className="flex items-center gap-2 text-[var(--color-critical)]">
                                            <AlertCircle className="w-5 h-5" />
                                            <span className="text-2xl font-bold">{errorCount}</span>
                                        </div>
                                        <p className="text-xs text-[var(--color-steel)] mt-1">Errors (will skip)</p>
                                    </div>
                                </div>

                                {/* Employee List */}
                                <div className="border border-[var(--glass-border)] rounded-lg overflow-hidden">
                                    <table className="w-full text-sm">
                                        <thead className="bg-[var(--glass-bg-light)]">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-[var(--color-steel)]">Status</th>
                                                <th className="px-4 py-2 text-left text-[var(--color-steel)]">Name</th>
                                                <th className="px-4 py-2 text-left text-[var(--color-steel)]">SSN</th>
                                                <th className="px-4 py-2 text-left text-[var(--color-steel)]">Hours/Week</th>
                                                <th className="px-4 py-2 text-left text-[var(--color-steel)]">Issues</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {employees.map((emp, i) => (
                                                <tr key={i} className="border-t border-[var(--glass-border)]">
                                                    <td className="px-4 py-2">
                                                        {emp.status === 'valid' && <CheckCircle2 className="w-4 h-4 text-[var(--color-success)]" />}
                                                        {emp.status === 'warning' && <AlertTriangle className="w-4 h-4 text-[var(--color-warning)]" />}
                                                        {emp.status === 'error' && <AlertCircle className="w-4 h-4 text-[var(--color-critical)]" />}
                                                    </td>
                                                    <td className="px-4 py-2 text-white">{emp.firstName} {emp.lastName}</td>
                                                    <td className="px-4 py-2 font-mono text-[var(--color-steel)]">{emp.ssn}</td>
                                                    <td className="px-4 py-2 text-[var(--color-silver)]">{emp.hoursPerWeek}</td>
                                                    <td className="px-4 py-2 text-xs text-[var(--color-steel)]">
                                                        {emp.errors?.[0]?.message || '-'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {/* Importing Step */}
                        {step === 'importing' && (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="w-full max-w-md mb-6">
                                    <div className="flex justify-between text-sm mb-2">
                                        <span className="text-white">Importing employees...</span>
                                        <span className="text-[var(--color-synapse-teal)]">{progress}%</span>
                                    </div>
                                    <div className="h-2 bg-[var(--glass-bg)] rounded-full overflow-hidden">
                                        <motion.div
                                            className="h-full bg-[var(--color-synapse-teal)]"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                        />
                                    </div>
                                </div>
                                <p className="text-sm text-[var(--color-steel)]">
                                    Processing {validCount + warningCount} employees for {clientName}
                                </p>
                            </div>
                        )}

                        {/* Complete Step */}
                        {step === 'complete' && (
                            <div className="flex flex-col items-center justify-center py-12">
                                <div className="w-16 h-16 rounded-full bg-[rgba(16,185,129,0.15)] flex items-center justify-center mb-4">
                                    <Check className="w-8 h-8 text-[var(--color-success)]" />
                                </div>
                                <h3 className="text-xl font-semibold text-white mb-2">Import Complete!</h3>
                                <p className="text-[var(--color-silver)] text-center mb-6">
                                    Successfully imported {validCount + warningCount} employees to {clientName}
                                </p>
                                <div className="flex gap-3">
                                    <button onClick={handleClose} className="btn-primary">
                                        Done
                                    </button>
                                    <button className="btn-secondary">
                                        <Download className="w-4 h-4" />
                                        Download Report
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Footer */}
                    {!['importing', 'complete', 'validation'].includes(step) && (
                        <div className="flex items-center justify-between px-6 py-4 border-t border-[var(--glass-border)]">
                            <button
                                onClick={() => {
                                    if (step === 'mapping') setStep('upload');
                                    else if (step === 'review') setStep('mapping');
                                }}
                                disabled={step === 'upload'}
                                className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="w-4 h-4" />
                                Back
                            </button>
                            <button
                                onClick={handleNextStep}
                                disabled={step === 'upload' && !file}
                                className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {step === 'review' ? 'Import Employees' : 'Continue'}
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

export default BulkImportWizard;
