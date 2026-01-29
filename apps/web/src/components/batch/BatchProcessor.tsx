'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Layers,
    Play,
    Pause,
    Square,
    CheckCircle2,
    AlertTriangle,
    Clock,
    RefreshCw,
    Download,
    Settings,
    ChevronRight,
    Activity,
    FileText,
    Users,
    BarChart3,
    XCircle,
    Loader2,
    Zap
} from 'lucide-react';

interface BatchProcessorProps {
    className?: string;
}

interface BatchJob {
    id: string;
    name: string;
    type: 'generate_1095c' | 'validate_data' | 'import_census' | 'export_forms' | 'correction_batch';
    status: 'queued' | 'running' | 'completed' | 'failed' | 'paused';
    progress: number;
    totalRecords: number;
    processedRecords: number;
    successCount: number;
    errorCount: number;
    startedAt: string | null;
    estimatedCompletion: string | null;
    createdBy: string;
}

const mockJobs: BatchJob[] = [
    {
        id: 'bj1',
        name: '2025 1095-C Generation - All Employees',
        type: 'generate_1095c',
        status: 'running',
        progress: 67,
        totalRecords: 4256,
        processedRecords: 2851,
        successCount: 2834,
        errorCount: 17,
        startedAt: '2026-01-29 10:30 AM',
        estimatedCompletion: '~12 minutes',
        createdBy: 'System Admin'
    },
    {
        id: 'bj2',
        name: 'Data Validation - Q4 2025',
        type: 'validate_data',
        status: 'completed',
        progress: 100,
        totalRecords: 4256,
        processedRecords: 4256,
        successCount: 4198,
        errorCount: 58,
        startedAt: '2026-01-29 09:15 AM',
        estimatedCompletion: null,
        createdBy: 'Sarah Johnson'
    },
    {
        id: 'bj3',
        name: 'January Census Import',
        type: 'import_census',
        status: 'queued',
        progress: 0,
        totalRecords: 892,
        processedRecords: 0,
        successCount: 0,
        errorCount: 0,
        startedAt: null,
        estimatedCompletion: null,
        createdBy: 'HR System'
    },
    {
        id: 'bj4',
        name: 'Form Export - Distribution Ready',
        type: 'export_forms',
        status: 'failed',
        progress: 34,
        totalRecords: 2100,
        processedRecords: 714,
        successCount: 698,
        errorCount: 16,
        startedAt: '2026-01-29 08:00 AM',
        estimatedCompletion: null,
        createdBy: 'Michael Chen'
    },
];

function getJobTypeStyle(type: string) {
    switch (type) {
        case 'generate_1095c': return { bg: 'bg-[rgba(6,182,212,0.1)]', text: 'text-[var(--color-synapse-teal)]', icon: FileText };
        case 'validate_data': return { bg: 'bg-[rgba(16,185,129,0.1)]', text: 'text-[var(--color-success)]', icon: CheckCircle2 };
        case 'import_census': return { bg: 'bg-[rgba(245,158,11,0.1)]', text: 'text-[var(--color-warning)]', icon: Users };
        case 'export_forms': return { bg: 'bg-[rgba(139,92,246,0.1)]', text: 'text-purple-400', icon: Download };
        case 'correction_batch': return { bg: 'bg-[rgba(239,68,68,0.1)]', text: 'text-[var(--color-critical)]', icon: RefreshCw };
        default: return { bg: 'bg-[rgba(255,255,255,0.05)]', text: 'text-[var(--color-steel)]', icon: Layers };
    }
}

function getStatusStyle(status: string) {
    switch (status) {
        case 'running': return { bg: 'bg-[rgba(6,182,212,0.1)]', text: 'text-[var(--color-synapse-teal)]', border: 'border-[rgba(6,182,212,0.3)]' };
        case 'completed': return { bg: 'bg-[rgba(16,185,129,0.1)]', text: 'text-[var(--color-success)]', border: 'border-[rgba(16,185,129,0.3)]' };
        case 'failed': return { bg: 'bg-[rgba(239,68,68,0.1)]', text: 'text-[var(--color-critical)]', border: 'border-[rgba(239,68,68,0.3)]' };
        case 'paused': return { bg: 'bg-[rgba(245,158,11,0.1)]', text: 'text-[var(--color-warning)]', border: 'border-[rgba(245,158,11,0.3)]' };
        case 'queued': return { bg: 'bg-[rgba(255,255,255,0.05)]', text: 'text-[var(--color-steel)]', border: 'border-[var(--glass-border)]' };
        default: return { bg: 'bg-[rgba(255,255,255,0.05)]', text: 'text-[var(--color-steel)]', border: 'border-[var(--glass-border)]' };
    }
}

export function BatchProcessor({ className = '' }: BatchProcessorProps) {
    const [jobs, setJobs] = useState<BatchJob[]>(mockJobs);
    const [selectedJob, setSelectedJob] = useState<string | null>(null);
    const [showNewJobModal, setShowNewJobModal] = useState(false);

    // Simulate running job progress
    useEffect(() => {
        const interval = setInterval(() => {
            setJobs(prev => prev.map(job => {
                if (job.status === 'running' && job.progress < 100) {
                    const newProcessed = Math.min(job.processedRecords + Math.floor(Math.random() * 50), job.totalRecords);
                    const newProgress = Math.floor((newProcessed / job.totalRecords) * 100);
                    return {
                        ...job,
                        processedRecords: newProcessed,
                        successCount: Math.floor(newProcessed * 0.995),
                        errorCount: Math.floor(newProcessed * 0.005),
                        progress: newProgress,
                        status: newProgress >= 100 ? 'completed' : 'running'
                    };
                }
                return job;
            }));
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    const runningJobs = jobs.filter(j => j.status === 'running').length;
    const queuedJobs = jobs.filter(j => j.status === 'queued').length;
    const totalProcessed = jobs.reduce((acc, j) => acc + j.processedRecords, 0);
    const totalErrors = jobs.reduce((acc, j) => acc + j.errorCount, 0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card ${className}`}
        >
            {/* Header */}
            <div className="p-5 border-b border-[var(--glass-border)]">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--color-synapse-cyan)] to-[var(--color-synapse-teal)] flex items-center justify-center">
                            <Layers className="w-5 h-5 text-black" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">Batch Processor</h2>
                            <p className="text-xs text-[var(--color-steel)]">High-volume data processing engine</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowNewJobModal(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <Zap className="w-4 h-4" />
                        New Batch Job
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4">
                    <div className="p-4 rounded-lg bg-[rgba(6,182,212,0.05)] border border-[rgba(6,182,212,0.2)]">
                        <div className="flex items-center gap-2">
                            <Activity className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                            <span className="text-xs text-[var(--color-steel)]">Running</span>
                        </div>
                        <p className="text-2xl font-bold text-[var(--color-synapse-teal)] mt-2">{runningJobs}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)]">
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5 text-[var(--color-steel)]" />
                            <span className="text-xs text-[var(--color-steel)]">Queued</span>
                        </div>
                        <p className="text-2xl font-bold text-white mt-2">{queuedJobs}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)]">
                        <div className="flex items-center gap-2">
                            <BarChart3 className="w-5 h-5 text-[var(--color-steel)]" />
                            <span className="text-xs text-[var(--color-steel)]">Processed</span>
                        </div>
                        <p className="text-2xl font-bold text-white mt-2">{totalProcessed.toLocaleString()}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-[rgba(239,68,68,0.05)] border border-[rgba(239,68,68,0.2)]">
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-[var(--color-critical)]" />
                            <span className="text-xs text-[var(--color-steel)]">Errors</span>
                        </div>
                        <p className="text-2xl font-bold text-[var(--color-critical)] mt-2">{totalErrors}</p>
                    </div>
                </div>
            </div>

            {/* Job List */}
            <div className="divide-y divide-[var(--glass-border)]">
                {jobs.map((job, index) => {
                    const typeStyle = getJobTypeStyle(job.type);
                    const statusStyle = getStatusStyle(job.status);
                    const TypeIcon = typeStyle.icon;

                    return (
                        <motion.div
                            key={job.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`p-4 transition-colors ${selectedJob === job.id ? 'bg-[rgba(255,255,255,0.03)]' : 'hover:bg-[rgba(255,255,255,0.02)]'}`}
                        >
                            <div className="flex items-center gap-4">
                                {/* Type Icon */}
                                <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${typeStyle.bg}`}>
                                    <TypeIcon className={`w-6 h-6 ${typeStyle.text}`} />
                                </div>

                                {/* Job Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="font-medium text-white truncate">{job.name}</span>
                                        <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                                            {job.status === 'running' && <span className="inline-block w-1.5 h-1.5 rounded-full bg-current mr-1 animate-pulse" />}
                                            {job.status}
                                        </span>
                                    </div>
                                    <p className="text-xs text-[var(--color-steel)]">
                                        Created by {job.createdBy} • {job.startedAt || 'Not started'}
                                    </p>
                                </div>

                                {/* Progress */}
                                <div className="w-48">
                                    <div className="flex items-center justify-between text-xs mb-1">
                                        <span className="text-[var(--color-silver)]">
                                            {job.processedRecords.toLocaleString()} / {job.totalRecords.toLocaleString()}
                                        </span>
                                        <span className={typeStyle.text}>{job.progress}%</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-[rgba(255,255,255,0.1)] overflow-hidden">
                                        <motion.div
                                            className={`h-full rounded-full ${job.status === 'running'
                                                ? 'bg-[var(--color-synapse-teal)]'
                                                : job.status === 'completed'
                                                    ? 'bg-[var(--color-success)]'
                                                    : job.status === 'failed'
                                                        ? 'bg-[var(--color-critical)]'
                                                        : 'bg-[var(--color-steel)]'
                                                }`}
                                            initial={{ width: 0 }}
                                            animate={{ width: `${job.progress}%` }}
                                            transition={{ duration: 0.5 }}
                                        />
                                    </div>
                                </div>

                                {/* Stats */}
                                <div className="flex items-center gap-4 text-xs">
                                    <div className="text-center">
                                        <p className="text-[var(--color-success)] font-medium">{job.successCount.toLocaleString()}</p>
                                        <p className="text-[var(--color-steel)]">Success</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[var(--color-critical)] font-medium">{job.errorCount}</p>
                                        <p className="text-[var(--color-steel)]">Errors</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    {job.status === 'running' && (
                                        <>
                                            <button className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] text-[var(--color-warning)]" title="Pause">
                                                <Pause className="w-4 h-4" />
                                            </button>
                                            <button className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] text-[var(--color-critical)]" title="Stop">
                                                <Square className="w-4 h-4" />
                                            </button>
                                        </>
                                    )}
                                    {job.status === 'queued' && (
                                        <button className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] text-[var(--color-synapse-teal)]" title="Start">
                                            <Play className="w-4 h-4" />
                                        </button>
                                    )}
                                    {job.status === 'paused' && (
                                        <button className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] text-[var(--color-synapse-teal)]" title="Resume">
                                            <Play className="w-4 h-4" />
                                        </button>
                                    )}
                                    {job.status === 'failed' && (
                                        <button className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] text-[var(--color-warning)]" title="Retry">
                                            <RefreshCw className="w-4 h-4" />
                                        </button>
                                    )}
                                    {job.status === 'completed' && (
                                        <button className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] text-[var(--color-synapse-teal)]" title="Download Results">
                                            <Download className="w-4 h-4" />
                                        </button>
                                    )}
                                    <button className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.05)] text-[var(--color-steel)]" title="Details">
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Estimated Completion for Running Jobs */}
                            {job.status === 'running' && job.estimatedCompletion && (
                                <div className="mt-3 ml-16 flex items-center gap-2 text-xs text-[var(--color-steel)]">
                                    <Loader2 className="w-3 h-3 animate-spin text-[var(--color-synapse-teal)]" />
                                    <span>Estimated completion: {job.estimatedCompletion}</span>
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            {/* New Job Modal */}
            <AnimatePresence>
                {showNewJobModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowNewJobModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="glass-card w-full max-w-lg"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="p-5 border-b border-[var(--glass-border)]">
                                <h2 className="text-lg font-semibold text-white">Create Batch Job</h2>
                                <p className="text-sm text-[var(--color-steel)]">Configure and queue a new processing job</p>
                            </div>
                            <div className="p-5 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">Job Type</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[
                                            { id: 'generate_1095c', label: '1095-C Generation', icon: FileText },
                                            { id: 'validate_data', label: 'Data Validation', icon: CheckCircle2 },
                                            { id: 'import_census', label: 'Census Import', icon: Users },
                                            { id: 'export_forms', label: 'Form Export', icon: Download },
                                        ].map(type => {
                                            const Icon = type.icon;
                                            return (
                                                <button
                                                    key={type.id}
                                                    className="p-3 rounded-lg border border-[var(--glass-border)] bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.05)] hover:border-[var(--color-synapse-teal)] transition-colors flex items-center gap-3"
                                                >
                                                    <Icon className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                                                    <span className="text-sm text-[var(--color-silver)]">{type.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">Job Name</label>
                                    <input
                                        type="text"
                                        placeholder="Enter job name..."
                                        className="w-full px-4 py-2.5 bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-sm text-white placeholder:text-[var(--color-steel)] focus:outline-none focus:border-[var(--color-synapse-teal)]"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">Priority</label>
                                    <select className="w-full px-4 py-2.5 bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-sm text-white focus:outline-none focus:border-[var(--color-synapse-teal)]">
                                        <option value="low">Low</option>
                                        <option value="normal">Normal</option>
                                        <option value="high">High</option>
                                        <option value="critical">Critical</option>
                                    </select>
                                </div>
                            </div>
                            <div className="p-5 border-t border-[var(--glass-border)] flex justify-end gap-3">
                                <button onClick={() => setShowNewJobModal(false)} className="btn-secondary">
                                    Cancel
                                </button>
                                <button className="btn-primary flex items-center gap-2">
                                    <Play className="w-4 h-4" />
                                    Create & Start
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default BatchProcessor;
