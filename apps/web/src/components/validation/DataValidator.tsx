'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ClipboardCheck,
    CheckCircle2,
    AlertCircle,
    XCircle,
    ChevronDown,
    ChevronRight,
    Play,
    RotateCcw,
    FileSearch
} from 'lucide-react';

interface DataValidatorProps {
    className?: string;
    onValidate?: () => void;
}

interface ValidationRule {
    id: string;
    name: string;
    description: string;
    category: string;
    status: 'pass' | 'warning' | 'error' | 'pending';
    details?: string;
    affectedCount?: number;
}

const mockRules: ValidationRule[] = [
    { id: 'ssn', name: 'SSN Format Validation', description: 'All SSNs are properly formatted', category: 'Data Quality', status: 'pass' },
    { id: 'dob', name: 'Date of Birth Range', description: 'DOB values are within valid range', category: 'Data Quality', status: 'pass' },
    { id: 'email', name: 'Email Format', description: 'Email addresses are properly formatted', category: 'Data Quality', status: 'warning', details: '12 employees have invalid email formats', affectedCount: 12 },
    { id: 'hours', name: 'Hours Consistency', description: 'Monthly hours are within expected range', category: 'Hours', status: 'pass' },
    { id: 'fte', name: 'FTE Calculation', description: 'FTE status properly calculated', category: 'Compliance', status: 'pass' },
    { id: 'offer', name: 'Offer Code Assignment', description: 'All FTEs have valid offer codes', category: 'Compliance', status: 'error', details: '3 employees missing offer codes', affectedCount: 3 },
    { id: 'safeharbor', name: 'Safe Harbor Codes', description: 'Safe harbor codes match coverage', category: 'Compliance', status: 'warning', details: '8 employees may need code review', affectedCount: 8 },
    { id: 'coverage', name: 'Coverage Dates', description: 'Coverage dates are valid and complete', category: 'Compliance', status: 'pass' },
    { id: 'ein', name: 'Employer EIN', description: 'EIN is properly formatted', category: 'Organization', status: 'pass' },
    { id: 'address', name: 'Address Validation', description: 'Employee addresses are complete', category: 'Data Quality', status: 'warning', details: '5 addresses may be incomplete', affectedCount: 5 },
];

const statusConfig = {
    pass: { icon: CheckCircle2, color: 'var(--color-success)', label: 'Pass' },
    warning: { icon: AlertCircle, color: 'var(--color-warning)', label: 'Warning' },
    error: { icon: XCircle, color: 'var(--color-critical)', label: 'Error' },
    pending: { icon: FileSearch, color: 'var(--color-steel)', label: 'Pending' },
};

export function DataValidator({ className = '', onValidate }: DataValidatorProps) {
    const [rules, setRules] = useState(mockRules);
    const [expandedCategory, setExpandedCategory] = useState<string | null>('Compliance');
    const [isValidating, setIsValidating] = useState(false);

    const categories = Array.from(new Set(rules.map(r => r.category)));

    const summary = {
        pass: rules.filter(r => r.status === 'pass').length,
        warning: rules.filter(r => r.status === 'warning').length,
        error: rules.filter(r => r.status === 'error').length,
    };

    const handleValidate = async () => {
        setIsValidating(true);
        // Simulate validation
        await new Promise(r => setTimeout(r, 2000));
        setIsValidating(false);
        onValidate?.();
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card overflow-hidden ${className}`}
        >
            {/* Header */}
            <div className="p-6 border-b border-[var(--glass-border)]">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-synapse-teal)] to-[var(--color-synapse-cyan)] flex items-center justify-center">
                            <ClipboardCheck className="w-5 h-5 text-black" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white">Data Validation</h2>
                            <p className="text-sm text-[var(--color-steel)]">Verify data quality before form generation</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setRules(mockRules)}
                            className="btn-secondary"
                        >
                            <RotateCcw className="w-4 h-4" />
                            Reset
                        </button>
                        <button
                            onClick={handleValidate}
                            disabled={isValidating}
                            className="btn-primary"
                        >
                            {isValidating ? (
                                <>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                        className="w-4 h-4 border-2 border-black border-t-transparent rounded-full"
                                    />
                                    Validating...
                                </>
                            ) : (
                                <>
                                    <Play className="w-4 h-4" />
                                    Run Validation
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Summary */}
                <div className="flex gap-4">
                    {Object.entries(summary).map(([status, count]) => {
                        const config = statusConfig[status as keyof typeof statusConfig];
                        const StatusIcon = config.icon;
                        return (
                            <div key={status} className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--glass-bg)]">
                                <StatusIcon className="w-4 h-4" style={{ color: config.color }} />
                                <span className="text-sm text-white">{count}</span>
                                <span className="text-xs text-[var(--color-steel)]">{config.label}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Rules by Category */}
            <div className="p-4">
                {categories.map((category) => {
                    const categoryRules = rules.filter(r => r.category === category);
                    const isExpanded = expandedCategory === category;
                    const hasIssues = categoryRules.some(r => r.status !== 'pass');

                    return (
                        <div key={category} className="mb-2">
                            <button
                                onClick={() => setExpandedCategory(isExpanded ? null : category)}
                                className="w-full flex items-center justify-between p-3 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)] hover:border-[var(--color-synapse-teal)] transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    {isExpanded ? (
                                        <ChevronDown className="w-4 h-4 text-[var(--color-steel)]" />
                                    ) : (
                                        <ChevronRight className="w-4 h-4 text-[var(--color-steel)]" />
                                    )}
                                    <span className="font-medium text-white">{category}</span>
                                    <span className="text-xs text-[var(--color-steel)]">
                                        {categoryRules.length} rules
                                    </span>
                                </div>
                                {hasIssues && (
                                    <AlertCircle className="w-4 h-4 text-[var(--color-warning)]" />
                                )}
                            </button>

                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="pt-2 space-y-2">
                                            {categoryRules.map((rule) => {
                                                const config = statusConfig[rule.status];
                                                const StatusIcon = config.icon;

                                                return (
                                                    <div
                                                        key={rule.id}
                                                        className="ml-7 p-3 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)]"
                                                    >
                                                        <div className="flex items-start justify-between">
                                                            <div className="flex-1">
                                                                <div className="flex items-center gap-2 mb-1">
                                                                    <StatusIcon
                                                                        className="w-4 h-4"
                                                                        style={{ color: config.color }}
                                                                    />
                                                                    <span className="text-sm font-medium text-white">
                                                                        {rule.name}
                                                                    </span>
                                                                </div>
                                                                <p className="text-xs text-[var(--color-steel)]">
                                                                    {rule.description}
                                                                </p>
                                                                {rule.details && (
                                                                    <p
                                                                        className="text-xs mt-1"
                                                                        style={{ color: config.color }}
                                                                    >
                                                                        {rule.details}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            {rule.affectedCount && (
                                                                <span
                                                                    className="px-2 py-0.5 rounded text-xs"
                                                                    style={{
                                                                        backgroundColor: `${config.color}20`,
                                                                        color: config.color
                                                                    }}
                                                                >
                                                                    {rule.affectedCount} affected
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
}

export default DataValidator;
