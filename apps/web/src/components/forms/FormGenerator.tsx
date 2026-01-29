'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FileText,
    Printer,
    Download,
    Mail,
    CheckCircle2,
    AlertTriangle,
    Clock,
    Settings,
    Play,
    Pause,
    RotateCcw
} from 'lucide-react';

interface FormBatch {
    id: string;
    name: string;
    taxYear: number;
    formType: '1094-C' | '1095-C';
    totalForms: number;
    generated: number;
    status: 'pending' | 'generating' | 'completed' | 'failed' | 'paused';
    errors: number;
    createdAt: string;
    completedAt?: string;
}

interface FormGeneratorProps {
    batches?: FormBatch[];
    onStartGeneration?: (batch: FormBatch) => void;
    onPause?: (batch: FormBatch) => void;
    onRetry?: (batch: FormBatch) => void;
    onDownload?: (batch: FormBatch) => void;
    className?: string;
}

const defaultBatches: FormBatch[] = [
    {
        id: '1',
        name: 'Q4 2025 Forms',
        taxYear: 2025,
        formType: '1095-C',
        totalForms: 1247,
        generated: 1247,
        status: 'completed',
        errors: 0,
        createdAt: '2026-01-15T10:00:00',
        completedAt: '2026-01-15T10:45:00'
    },
    {
        id: '2',
        name: 'January 2026 Distribution',
        taxYear: 2025,
        formType: '1095-C',
        totalForms: 1182,
        generated: 876,
        status: 'generating',
        errors: 3,
        createdAt: '2026-01-28T09:00:00'
    },
    {
        id: '3',
        name: '1094-C Transmittal',
        taxYear: 2025,
        formType: '1094-C',
        totalForms: 1,
        generated: 0,
        status: 'pending',
        errors: 0,
        createdAt: '2026-01-28T08:30:00'
    },
];

const statusConfig = {
    pending: { color: 'var(--color-steel)', icon: Clock, label: 'Pending' },
    generating: { color: 'var(--color-synapse-cyan)', icon: Settings, label: 'Generating' },
    completed: { color: 'var(--color-success)', icon: CheckCircle2, label: 'Completed' },
    failed: { color: 'var(--color-critical)', icon: AlertTriangle, label: 'Failed' },
    paused: { color: 'var(--color-warning)', icon: Pause, label: 'Paused' },
};

export function FormGenerator({
    batches = defaultBatches,
    onStartGeneration,
    onPause,
    onRetry,
    onDownload,
    className = ''
}: FormGeneratorProps) {
    const [selectedBatch, setSelectedBatch] = useState<string | null>(null);

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className={`glass-card ${className}`}>
            {/* Header */}
            <div className="p-4 border-b border-[var(--glass-border)]">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-synapse-violet)] to-[var(--color-synapse-cyan)] flex items-center justify-center">
                            <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Form Generation</h3>
                            <p className="text-xs text-[var(--color-steel)]">{batches.length} batches</p>
                        </div>
                    </div>
                    <button className="btn-primary text-sm">
                        <FileText className="w-4 h-4" />
                        New Batch
                    </button>
                </div>
            </div>

            {/* Batches */}
            <div className="divide-y divide-[var(--glass-border)]">
                {batches.map((batch, i) => {
                    const config = statusConfig[batch.status];
                    const StatusIcon = config.icon;
                    const progress = (batch.generated / batch.totalForms) * 100;
                    const isSelected = selectedBatch === batch.id;

                    return (
                        <motion.div
                            key={batch.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => setSelectedBatch(isSelected ? null : batch.id)}
                            className="p-4 cursor-pointer hover:bg-[var(--glass-bg)] transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                {/* Icon */}
                                <div
                                    className={`w-12 h-12 rounded-xl flex items-center justify-center ${batch.status === 'generating' ? 'animate-pulse' : ''
                                        }`}
                                    style={{ backgroundColor: `${config.color}20` }}
                                >
                                    <StatusIcon className="w-6 h-6" style={{ color: config.color }} />
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="font-medium text-white">{batch.name}</h4>
                                        <span className="px-2 py-0.5 rounded text-xs bg-[var(--glass-bg)] text-[var(--color-steel)]">
                                            {batch.formType}
                                        </span>
                                        <span className="px-2 py-0.5 rounded text-xs bg-[var(--glass-bg)] text-[var(--color-steel)]">
                                            TY {batch.taxYear}
                                        </span>
                                    </div>

                                    {/* Progress */}
                                    <div className="flex items-center gap-3 mb-2">
                                        <div className="flex-1 h-2 rounded-full bg-[var(--glass-bg)]">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${progress}%` }}
                                                className="h-full rounded-full"
                                                style={{ backgroundColor: config.color }}
                                            />
                                        </div>
                                        <span className="text-sm text-white font-medium">
                                            {batch.generated.toLocaleString()} / {batch.totalForms.toLocaleString()}
                                        </span>
                                    </div>

                                    {/* Meta */}
                                    <div className="flex items-center gap-4 text-xs text-[var(--color-steel)]">
                                        <span>Created {formatDate(batch.createdAt)}</span>
                                        {batch.completedAt && <span>Completed {formatDate(batch.completedAt)}</span>}
                                        {batch.errors > 0 && (
                                            <span className="text-[var(--color-critical)]">
                                                {batch.errors} errors
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    {batch.status === 'pending' && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onStartGeneration?.(batch); }}
                                            className="btn-primary text-xs"
                                        >
                                            <Play className="w-4 h-4" />
                                            Start
                                        </button>
                                    )}
                                    {batch.status === 'generating' && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onPause?.(batch); }}
                                            className="btn-secondary text-xs"
                                        >
                                            <Pause className="w-4 h-4" />
                                            Pause
                                        </button>
                                    )}
                                    {batch.status === 'failed' && (
                                        <button
                                            onClick={(e) => { e.stopPropagation(); onRetry?.(batch); }}
                                            className="btn-secondary text-xs"
                                        >
                                            <RotateCcw className="w-4 h-4" />
                                            Retry
                                        </button>
                                    )}
                                    {batch.status === 'completed' && (
                                        <>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onDownload?.(batch); }}
                                                className="btn-secondary text-xs"
                                            >
                                                <Download className="w-4 h-4" />
                                                Download
                                            </button>
                                            <button className="btn-secondary text-xs">
                                                <Printer className="w-4 h-4" />
                                                Print
                                            </button>
                                            <button className="btn-secondary text-xs">
                                                <Mail className="w-4 h-4" />
                                                Distribute
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

export default FormGenerator;
