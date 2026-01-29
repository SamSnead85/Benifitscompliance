'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Layers,
    Play,
    CheckCircle2,
    AlertCircle,
    Clock,
    Users,
    FileText,
    Shield,
    X,
    RotateCcw
} from 'lucide-react';

interface BatchOperationsProps {
    className?: string;
}

interface BatchJob {
    id: string;
    name: string;
    description: string;
    status: 'idle' | 'running' | 'complete' | 'error';
    progress?: number;
    affectedCount?: number;
    completedAt?: string;
    icon: React.ElementType;
}

const initialJobs: BatchJob[] = [
    {
        id: 'sync-hours',
        name: 'Sync Employee Hours',
        description: 'Pull latest hours from HRIS integration',
        status: 'idle',
        icon: Clock
    },
    {
        id: 'calc-fte',
        name: 'Recalculate FTE Status',
        description: 'Update FTE status for all employees',
        status: 'idle',
        icon: Users
    },
    {
        id: 'assign-codes',
        name: 'Auto-Assign Offer Codes',
        description: 'AI-suggested codes based on coverage',
        status: 'idle',
        icon: Shield
    },
    {
        id: 'gen-forms',
        name: 'Generate 1095-C Forms',
        description: 'Create forms for all eligible employees',
        status: 'idle',
        icon: FileText
    },
];

export function BatchOperations({ className = '' }: BatchOperationsProps) {
    const [jobs, setJobs] = useState<BatchJob[]>(initialJobs);
    const [selectedJobs, setSelectedJobs] = useState<string[]>([]);
    const [isRunning, setIsRunning] = useState(false);

    const toggleJob = (jobId: string) => {
        setSelectedJobs(prev =>
            prev.includes(jobId)
                ? prev.filter(id => id !== jobId)
                : [...prev, jobId]
        );
    };

    const runJobs = async () => {
        if (selectedJobs.length === 0) return;

        setIsRunning(true);

        for (const jobId of selectedJobs) {
            // Set job to running
            setJobs(prev => prev.map(j =>
                j.id === jobId ? { ...j, status: 'running' as const, progress: 0 } : j
            ));

            // Simulate progress
            for (let i = 0; i <= 100; i += 10) {
                await new Promise(r => setTimeout(r, 100));
                setJobs(prev => prev.map(j =>
                    j.id === jobId ? { ...j, progress: i } : j
                ));
            }

            // Complete job
            setJobs(prev => prev.map(j =>
                j.id === jobId ? {
                    ...j,
                    status: 'complete' as const,
                    progress: 100,
                    affectedCount: Math.floor(Math.random() * 4000) + 100,
                    completedAt: 'Just now'
                } : j
            ));
        }

        setIsRunning(false);
        setSelectedJobs([]);
    };

    const resetJobs = () => {
        setJobs(initialJobs);
        setSelectedJobs([]);
    };

    const statusConfig = {
        idle: { color: 'var(--color-steel)', icon: Clock },
        running: { color: 'var(--color-synapse-cyan)', icon: Clock },
        complete: { color: 'var(--color-success)', icon: CheckCircle2 },
        error: { color: 'var(--color-critical)', icon: AlertCircle },
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card overflow-hidden ${className}`}
        >
            {/* Header */}
            <div className="p-6 border-b border-[var(--glass-border)]">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-synapse-teal)] to-[var(--color-synapse-cyan)] flex items-center justify-center">
                            <Layers className="w-5 h-5 text-black" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white">Batch Operations</h2>
                            <p className="text-sm text-[var(--color-steel)]">Run bulk data operations</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {selectedJobs.length > 0 && (
                            <span className="text-sm text-[var(--color-synapse-teal)]">
                                {selectedJobs.length} selected
                            </span>
                        )}
                        <button onClick={resetJobs} className="btn-secondary">
                            <RotateCcw className="w-4 h-4" />
                            Reset
                        </button>
                        <button
                            onClick={runJobs}
                            disabled={selectedJobs.length === 0 || isRunning}
                            className="btn-primary"
                        >
                            <Play className="w-4 h-4" />
                            Run Selected
                        </button>
                    </div>
                </div>
            </div>

            {/* Jobs List */}
            <div className="p-4 space-y-3">
                {jobs.map((job) => {
                    const JobIcon = job.icon;
                    const config = statusConfig[job.status];
                    const StatusIcon = config.icon;
                    const isSelected = selectedJobs.includes(job.id);
                    const isDisabled = job.status === 'running' || job.status === 'complete';

                    return (
                        <motion.div
                            key={job.id}
                            layout
                            className={`p-4 rounded-xl border transition-colors ${isSelected && !isDisabled
                                    ? 'bg-[rgba(20,184,166,0.1)] border-[var(--color-synapse-teal)]'
                                    : 'bg-[var(--glass-bg-light)] border-[var(--glass-border)]'
                                } ${isDisabled ? 'opacity-60' : 'cursor-pointer hover:border-[var(--color-synapse-teal)]'}`}
                            onClick={() => !isDisabled && toggleJob(job.id)}
                        >
                            <div className="flex items-center gap-4">
                                {/* Checkbox */}
                                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${isSelected && !isDisabled
                                        ? 'bg-[var(--color-synapse-teal)] border-[var(--color-synapse-teal)]'
                                        : 'border-[var(--glass-border)]'
                                    }`}>
                                    {isSelected && !isDisabled && (
                                        <CheckCircle2 className="w-3 h-3 text-black" />
                                    )}
                                    {job.status === 'complete' && (
                                        <CheckCircle2 className="w-3 h-3 text-[var(--color-success)]" />
                                    )}
                                </div>

                                {/* Icon */}
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                                    style={{ backgroundColor: `${config.color}20` }}
                                >
                                    <JobIcon className="w-5 h-5" style={{ color: config.color }} />
                                </div>

                                {/* Content */}
                                <div className="flex-1">
                                    <p className="font-medium text-white">{job.name}</p>
                                    <p className="text-sm text-[var(--color-steel)]">{job.description}</p>
                                </div>

                                {/* Status */}
                                <div className="text-right">
                                    {job.status === 'running' && (
                                        <div className="flex items-center gap-2">
                                            <div className="w-24 h-2 rounded-full bg-[var(--glass-bg)] overflow-hidden">
                                                <motion.div
                                                    className="h-full bg-[var(--color-synapse-cyan)]"
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${job.progress}%` }}
                                                />
                                            </div>
                                            <span className="text-sm text-[var(--color-synapse-cyan)]">
                                                {job.progress}%
                                            </span>
                                        </div>
                                    )}
                                    {job.status === 'complete' && (
                                        <div>
                                            <p className="text-sm text-[var(--color-success)]">
                                                {job.affectedCount?.toLocaleString()} processed
                                            </p>
                                            <p className="text-xs text-[var(--color-steel)]">{job.completedAt}</p>
                                        </div>
                                    )}
                                    {job.status === 'idle' && (
                                        <span className="text-sm text-[var(--color-steel)]">Ready</span>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}

export default BatchOperations;
