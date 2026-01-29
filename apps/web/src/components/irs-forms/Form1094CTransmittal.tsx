'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FileText,
    Upload,
    CheckCircle2,
    AlertTriangle,
    Clock,
    Send,
    Download,
    RefreshCw,
    Calendar,
    Users,
    Shield
} from 'lucide-react';

interface TransmittalSummary {
    taxYear: number;
    ein: string;
    employerName: string;
    totalForms: number;
    validForms: number;
    errorForms: number;
    warningForms: number;
    transmissionDate?: string;
    receiptId?: string;
    status: 'draft' | 'validated' | 'submitted' | 'accepted' | 'rejected';
    monthlyMec: boolean[];
}

interface Form1094CTransmittalProps {
    summary?: TransmittalSummary;
    className?: string;
    onSubmit?: () => void;
}

const defaultSummary: TransmittalSummary = {
    taxYear: 2025,
    ein: '12-3456789',
    employerName: 'Acme Corporation',
    totalForms: 4521,
    validForms: 4498,
    errorForms: 8,
    warningForms: 15,
    status: 'validated',
    monthlyMec: Array(12).fill(true)
};

const statusConfig = {
    draft: { color: 'var(--color-steel)', label: 'Draft', icon: FileText },
    validated: { color: 'var(--color-synapse-cyan)', label: 'Validated', icon: CheckCircle2 },
    submitted: { color: 'var(--color-synapse-gold)', label: 'Submitted', icon: Upload },
    accepted: { color: 'var(--color-success)', label: 'Accepted', icon: CheckCircle2 },
    rejected: { color: 'var(--color-critical)', label: 'Rejected', icon: AlertTriangle }
};

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function Form1094CTransmittal({
    summary = defaultSummary,
    className = '',
    onSubmit
}: Form1094CTransmittalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const status = statusConfig[summary.status];
    const StatusIcon = status.icon;

    const handleSubmit = async () => {
        setIsSubmitting(true);
        await new Promise(r => setTimeout(r, 3000));
        setIsSubmitting(false);
        onSubmit?.();
    };

    const validPercentage = ((summary.validForms / summary.totalForms) * 100).toFixed(1);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-6 ${className}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-synapse-teal)] to-[var(--color-synapse-cyan)] flex items-center justify-center">
                        <FileText className="w-6 h-6 text-black" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-white text-lg">Form 1094-C Transmittal</h3>
                        <p className="text-sm text-[var(--color-steel)]">Tax Year {summary.taxYear}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span
                        className="px-3 py-1 rounded-full text-sm flex items-center gap-2"
                        style={{ backgroundColor: `${status.color}20`, color: status.color }}
                    >
                        <StatusIcon className="w-4 h-4" />
                        {status.label}
                    </span>
                </div>
            </div>

            {/* Employer Info */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]">
                    <p className="text-xs text-[var(--color-steel)] mb-1">Employer Name</p>
                    <p className="font-medium text-white">{summary.employerName}</p>
                </div>
                <div className="p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]">
                    <p className="text-xs text-[var(--color-steel)] mb-1">Employer EIN</p>
                    <p className="font-mono font-medium text-white">{summary.ein}</p>
                </div>
                <div className="p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]">
                    <p className="text-xs text-[var(--color-steel)] mb-1">ALE Member</p>
                    <p className="font-medium text-[var(--color-success)] flex items-center gap-1">
                        <Shield className="w-4 h-4" />
                        Yes - Subject to ACA
                    </p>
                </div>
            </div>

            {/* Form Statistics */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)] text-center"
                >
                    <Users className="w-6 h-6 mx-auto text-[var(--color-synapse-teal)] mb-2" />
                    <p className="text-2xl font-bold text-white font-mono">{summary.totalForms.toLocaleString()}</p>
                    <p className="text-xs text-[var(--color-steel)]">Total 1095-C Forms</p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.05 }}
                    className="p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)] text-center"
                >
                    <CheckCircle2 className="w-6 h-6 mx-auto text-[var(--color-success)] mb-2" />
                    <p className="text-2xl font-bold text-white font-mono">{summary.validForms.toLocaleString()}</p>
                    <p className="text-xs text-[var(--color-steel)]">Valid ({validPercentage}%)</p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)] text-center"
                >
                    <AlertTriangle className="w-6 h-6 mx-auto text-[var(--color-warning)] mb-2" />
                    <p className="text-2xl font-bold text-white font-mono">{summary.warningForms}</p>
                    <p className="text-xs text-[var(--color-steel)]">Warnings</p>
                </motion.div>
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.15 }}
                    className="p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)] text-center"
                >
                    <AlertTriangle className="w-6 h-6 mx-auto text-[var(--color-critical)] mb-2" />
                    <p className="text-2xl font-bold text-white font-mono">{summary.errorForms}</p>
                    <p className="text-xs text-[var(--color-steel)]">Errors</p>
                </motion.div>
            </div>

            {/* MEC Offered Grid */}
            <div className="mb-6 p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]">
                <p className="text-sm font-medium text-white mb-3">Minimum Essential Coverage Offered by Month</p>
                <div className="grid grid-cols-12 gap-2">
                    {months.map((month, i) => (
                        <div key={month} className="text-center">
                            <p className="text-xs text-[var(--color-steel)] mb-1">{month}</p>
                            <div className={`w-full aspect-square rounded-lg flex items-center justify-center ${summary.monthlyMec[i]
                                    ? 'bg-[rgba(34,197,94,0.2)] text-[var(--color-success)]'
                                    : 'bg-[rgba(239,68,68,0.2)] text-[var(--color-critical)]'
                                }`}>
                                {summary.monthlyMec[i] ? <CheckCircle2 className="w-5 h-5" /> : '—'}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Transmission Info */}
            {summary.transmissionDate && (
                <div className="mb-6 p-4 rounded-lg bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.3)]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Calendar className="w-5 h-5 text-[var(--color-success)]" />
                            <div>
                                <p className="text-sm text-white">Transmitted: {summary.transmissionDate}</p>
                                <p className="text-xs text-[var(--color-steel)]">Receipt ID: {summary.receiptId}</p>
                            </div>
                        </div>
                        <button className="btn-secondary text-sm">
                            <Download className="w-4 h-4" />
                            Download Confirmation
                        </button>
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-[var(--glass-border)]">
                <div className="flex items-center gap-2">
                    <button className="btn-secondary">
                        <Download className="w-4 h-4" />
                        Download 1094-C PDF
                    </button>
                    <button className="btn-secondary">
                        <RefreshCw className="w-4 h-4" />
                        Re-validate
                    </button>
                </div>
                {summary.status !== 'accepted' && summary.status !== 'submitted' && (
                    <button
                        onClick={handleSubmit}
                        disabled={summary.errorForms > 0 || isSubmitting}
                        className="btn-primary disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <>
                                <RefreshCw className="w-4 h-4 animate-spin" />
                                Submitting...
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4" />
                                Submit to IRS
                            </>
                        )}
                    </button>
                )}
            </div>

            {summary.errorForms > 0 && (
                <p className="mt-3 text-xs text-[var(--color-critical)] flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    You must resolve all errors before submitting to the IRS
                </p>
            )}
        </motion.div>
    );
}

export default Form1094CTransmittal;
