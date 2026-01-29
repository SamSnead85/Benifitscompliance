'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FileText,
    CheckCircle2,
    AlertTriangle,
    XCircle,
    ChevronDown,
    Eye,
    Download,
    Check
} from 'lucide-react';

interface FormPreview {
    id: string;
    employeeName: string;
    ein: string;
    formType: '1095-C' | '1094-C';
    status: 'valid' | 'warning' | 'error';
    issues?: string[];
    data?: {
        line14: string;
        line15: string;
        line16: string;
    };
}

interface BatchFormPreviewProps {
    forms?: FormPreview[];
    className?: string;
    onApprove?: (formIds: string[]) => void;
    onExport?: (formIds: string[]) => void;
}

const defaultForms: FormPreview[] = [
    { id: 'form-001', employeeName: 'Smith, John', ein: '12-3456789', formType: '1095-C', status: 'valid', data: { line14: '1A', line15: '2C', line16: '2C' } },
    { id: 'form-002', employeeName: 'Johnson, Sarah', ein: '12-3456789', formType: '1095-C', status: 'valid', data: { line14: '1B', line15: '2C', line16: '2C' } },
    { id: 'form-003', employeeName: 'Williams, Mike', ein: '12-3456789', formType: '1095-C', status: 'warning', issues: ['Coverage gap in March'], data: { line14: '1H', line15: '2C', line16: '2C' } },
    { id: 'form-004', employeeName: 'Brown, Emily', ein: '12-3456789', formType: '1095-C', status: 'error', issues: ['Missing SSN', 'DOB not verified'] },
    { id: 'form-005', employeeName: 'Davis, Robert', ein: '12-3456789', formType: '1095-C', status: 'valid', data: { line14: '1A', line15: '2D', line16: '2D' } },
];

const statusConfig = {
    valid: { icon: CheckCircle2, color: 'var(--color-success)', label: 'Valid' },
    warning: { icon: AlertTriangle, color: 'var(--color-warning)', label: 'Needs Review' },
    error: { icon: XCircle, color: 'var(--color-critical)', label: 'Invalid' }
};

export function BatchFormPreview({
    forms = defaultForms,
    className = '',
    onApprove,
    onExport
}: BatchFormPreviewProps) {
    const [selectedForms, setSelectedForms] = useState<string[]>([]);
    const [expandedForm, setExpandedForm] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState<'all' | 'valid' | 'warning' | 'error'>('all');

    const filteredForms = forms.filter(f =>
        filterStatus === 'all' || f.status === filterStatus
    );

    const validCount = forms.filter(f => f.status === 'valid').length;
    const warningCount = forms.filter(f => f.status === 'warning').length;
    const errorCount = forms.filter(f => f.status === 'error').length;

    const toggleSelect = (formId: string) => {
        setSelectedForms(prev =>
            prev.includes(formId)
                ? prev.filter(id => id !== formId)
                : [...prev, formId]
        );
    };

    const toggleSelectAll = () => {
        if (selectedForms.length === filteredForms.length) {
            setSelectedForms([]);
        } else {
            setSelectedForms(filteredForms.map(f => f.id));
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-6 ${className}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                    <h3 className="font-semibold text-white">Batch Form Preview</h3>
                    <span className="px-2 py-0.5 rounded text-xs bg-[var(--glass-bg)] text-[var(--color-steel)]">
                        {forms.length} forms
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    {selectedForms.length > 0 && (
                        <>
                            <button
                                onClick={() => onExport?.(selectedForms)}
                                className="btn-secondary text-sm"
                            >
                                <Download className="w-4 h-4" />
                                Export ({selectedForms.length})
                            </button>
                            <button
                                onClick={() => onApprove?.(selectedForms)}
                                className="btn-primary text-sm"
                            >
                                <Check className="w-4 h-4" />
                                Approve ({selectedForms.length})
                            </button>
                        </>
                    )}
                </div>
            </div>

            {/* Summary Stats */}
            <div className="flex items-center gap-4 mb-4">
                {([
                    { key: 'all', count: forms.length },
                    { key: 'valid', count: validCount },
                    { key: 'warning', count: warningCount },
                    { key: 'error', count: errorCount }
                ] as const).map(({ key, count }) => (
                    <button
                        key={key}
                        onClick={() => setFilterStatus(key)}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${filterStatus === key
                                ? 'bg-[var(--color-synapse-teal)] text-black'
                                : 'bg-[var(--glass-bg)] text-[var(--color-steel)] hover:text-white'
                            }`}
                    >
                        {key.charAt(0).toUpperCase() + key.slice(1)} ({count})
                    </button>
                ))}
            </div>

            {/* Table */}
            <div className="border border-[var(--glass-border)] rounded-lg overflow-hidden">
                {/* Table Header */}
                <div className="flex items-center gap-4 p-3 bg-[var(--glass-bg-light)] border-b border-[var(--glass-border)] text-xs text-[var(--color-steel)]">
                    <div className="w-8">
                        <input
                            type="checkbox"
                            checked={selectedForms.length === filteredForms.length && filteredForms.length > 0}
                            onChange={toggleSelectAll}
                            className="w-4 h-4"
                        />
                    </div>
                    <div className="flex-1">Employee</div>
                    <div className="w-24">Form</div>
                    <div className="w-24">Status</div>
                    <div className="w-32">Line 14</div>
                    <div className="w-20"></div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-[var(--glass-border)]">
                    {filteredForms.map((form, i) => {
                        const status = statusConfig[form.status];
                        const StatusIcon = status.icon;
                        const isExpanded = expandedForm === form.id;

                        return (
                            <div key={form.id}>
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.02 }}
                                    className="flex items-center gap-4 p-3 hover:bg-[var(--glass-bg-light)] transition-colors"
                                >
                                    <div className="w-8">
                                        <input
                                            type="checkbox"
                                            checked={selectedForms.includes(form.id)}
                                            onChange={() => toggleSelect(form.id)}
                                            className="w-4 h-4"
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <span className="text-sm text-white">{form.employeeName}</span>
                                    </div>
                                    <div className="w-24 text-sm text-[var(--color-steel)]">
                                        {form.formType}
                                    </div>
                                    <div className="w-24">
                                        <span
                                            className="px-2 py-0.5 rounded text-xs flex items-center gap-1 w-fit"
                                            style={{ backgroundColor: `${status.color}20`, color: status.color }}
                                        >
                                            <StatusIcon className="w-3 h-3" />
                                            {status.label}
                                        </span>
                                    </div>
                                    <div className="w-32 text-sm text-[var(--color-silver)] font-mono">
                                        {form.data?.line14 || '—'}
                                    </div>
                                    <div className="w-20 flex items-center gap-1">
                                        <button
                                            onClick={() => setExpandedForm(isExpanded ? null : form.id)}
                                            className="p-1 rounded hover:bg-[var(--glass-bg)] text-[var(--color-steel)]"
                                        >
                                            <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}>
                                                <ChevronDown className="w-4 h-4" />
                                            </motion.div>
                                        </button>
                                        <button className="p-1 rounded hover:bg-[var(--glass-bg)] text-[var(--color-steel)]">
                                            <Eye className="w-4 h-4" />
                                        </button>
                                    </div>
                                </motion.div>

                                {/* Expanded Details */}
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="px-12 pb-4"
                                    >
                                        <div className="p-4 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)]">
                                            {form.data ? (
                                                <div className="grid grid-cols-3 gap-4 text-sm">
                                                    <div>
                                                        <span className="text-[var(--color-steel)]">Line 14:</span>
                                                        <span className="ml-2 text-white font-mono">{form.data.line14}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-[var(--color-steel)]">Line 15:</span>
                                                        <span className="ml-2 text-white font-mono">{form.data.line15}</span>
                                                    </div>
                                                    <div>
                                                        <span className="text-[var(--color-steel)]">Line 16:</span>
                                                        <span className="ml-2 text-white font-mono">{form.data.line16}</span>
                                                    </div>
                                                </div>
                                            ) : null}
                                            {form.issues && form.issues.length > 0 && (
                                                <div className="mt-3 pt-3 border-t border-[var(--glass-border)]">
                                                    <span className="text-xs text-[var(--color-warning)]">Issues:</span>
                                                    <ul className="mt-1 space-y-1">
                                                        {form.issues.map((issue, idx) => (
                                                            <li key={idx} className="text-sm text-[var(--color-warning)] flex items-center gap-2">
                                                                <AlertTriangle className="w-3 h-3" />
                                                                {issue}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
}

export default BatchFormPreview;
