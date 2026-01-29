'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import {
    FileText,
    Download,
    Settings,
    Calendar,
    Building2,
    Users,
    CheckCircle2,
    Loader2,
    FileSpreadsheet,
    Printer,
    Mail,
} from 'lucide-react';

interface ReportConfig {
    type: 'aca_1094c' | 'aca_1095c' | 'eligibility' | 'penalty_exposure' | 'audit_trail' | 'custom';
    format: 'pdf' | 'excel' | 'csv';
    period: { year: number; month?: number };
    includeCharts?: boolean;
    includeSummary?: boolean;
    recipients?: string[];
}

interface PDFReportGeneratorProps {
    organizations: { id: string; name: string }[];
    onGenerate?: (config: ReportConfig) => void;
    className?: string;
}

/**
 * PDF Report Generator
 * Enterprise-grade report generation with multiple formats
 */
export function PDFReportGenerator({
    organizations,
    onGenerate,
    className = '',
}: PDFReportGeneratorProps) {
    const [reportType, setReportType] = useState<ReportConfig['type']>('aca_1094c');
    const [format, setFormat] = useState<ReportConfig['format']>('pdf');
    const [selectedOrg, setSelectedOrg] = useState<string>('all');
    const [year, setYear] = useState(new Date().getFullYear());
    const [includeCharts, setIncludeCharts] = useState(true);
    const [includeSummary, setIncludeSummary] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [generationProgress, setGenerationProgress] = useState(0);

    const reportTypes = [
        { id: 'aca_1094c', label: 'ACA 1094-C', description: 'Employer transmittal filing' },
        { id: 'aca_1095c', label: 'ACA 1095-C', description: 'Employee statements' },
        { id: 'eligibility', label: 'Eligibility Report', description: 'Full-time status analysis' },
        { id: 'penalty_exposure', label: 'Penalty Exposure', description: 'Risk assessment summary' },
        { id: 'audit_trail', label: 'Audit Trail', description: 'Change history log' },
        { id: 'custom', label: 'Custom Report', description: 'Build your own report' },
    ];

    const formats = [
        { id: 'pdf', label: 'PDF', icon: <FileText className="w-4 h-4" /> },
        { id: 'excel', label: 'Excel', icon: <FileSpreadsheet className="w-4 h-4" /> },
        { id: 'csv', label: 'CSV', icon: <FileText className="w-4 h-4" /> },
    ];

    const handleGenerate = async () => {
        setIsGenerating(true);
        setGenerationProgress(0);

        // Simulate progress
        const interval = setInterval(() => {
            setGenerationProgress(p => {
                if (p >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                return p + Math.random() * 15;
            });
        }, 200);

        // Simulate generation
        await new Promise(resolve => setTimeout(resolve, 2500));

        clearInterval(interval);
        setGenerationProgress(100);

        onGenerate?.({
            type: reportType,
            format,
            period: { year },
            includeCharts,
            includeSummary,
        });

        setTimeout(() => {
            setIsGenerating(false);
            setGenerationProgress(0);
        }, 500);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card overflow-hidden ${className}`}
        >
            {/* Header */}
            <div className="p-5 border-b border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-teal-500/20 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                            Report Generator
                        </h2>
                        <p className="text-xs text-[#64748B]">Create compliance reports and exports</p>
                    </div>
                </div>
            </div>

            <div className="p-5 space-y-6">
                {/* Report Type Selection */}
                <div>
                    <label className="block text-xs font-medium text-[#94A3B8] mb-3">Report Type</label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {reportTypes.map(type => (
                            <button
                                key={type.id}
                                onClick={() => setReportType(type.id as ReportConfig['type'])}
                                className={`
                  p-3 rounded-lg border text-left transition-all
                  ${reportType === type.id
                                        ? 'bg-cyan-500/10 border-cyan-500/50 ring-1 ring-cyan-500/20'
                                        : 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)]'
                                    }
                `}
                            >
                                <p className="text-sm font-medium text-white">{type.label}</p>
                                <p className="text-[10px] text-[#64748B] mt-0.5">{type.description}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Format & Options Row */}
                <div className="grid grid-cols-2 gap-4">
                    {/* Format */}
                    <div>
                        <label className="block text-xs font-medium text-[#94A3B8] mb-2">Format</label>
                        <div className="flex gap-2">
                            {formats.map(f => (
                                <button
                                    key={f.id}
                                    onClick={() => setFormat(f.id as ReportConfig['format'])}
                                    className={`
                    flex items-center gap-2 px-3 py-2 rounded-lg border text-sm
                    ${format === f.id
                                            ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400'
                                            : 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.06)] text-[#94A3B8] hover:text-white'
                                        }
                  `}
                                >
                                    {f.icon}
                                    {f.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Year */}
                    <div>
                        <label className="block text-xs font-medium text-[#94A3B8] mb-2">Plan Year</label>
                        <select
                            value={year}
                            onChange={e => setYear(Number(e.target.value))}
                            className="w-full px-3 py-2 text-sm text-white bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-lg focus:outline-none focus:border-cyan-500/50"
                        >
                            {[2026, 2025, 2024, 2023].map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Organization */}
                <div>
                    <label className="block text-xs font-medium text-[#94A3B8] mb-2">Organization</label>
                    <select
                        value={selectedOrg}
                        onChange={e => setSelectedOrg(e.target.value)}
                        className="w-full px-3 py-2 text-sm text-white bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-lg focus:outline-none focus:border-cyan-500/50"
                    >
                        <option value="all">All Organizations</option>
                        {organizations.map(org => (
                            <option key={org.id} value={org.id}>{org.name}</option>
                        ))}
                    </select>
                </div>

                {/* Options */}
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={includeCharts}
                            onChange={e => setIncludeCharts(e.target.checked)}
                            className="w-4 h-4 rounded border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.03)] text-cyan-500 focus:ring-cyan-500/20"
                        />
                        <span className="text-sm text-[#94A3B8]">Include Charts</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={includeSummary}
                            onChange={e => setIncludeSummary(e.target.checked)}
                            className="w-4 h-4 rounded border-[rgba(255,255,255,0.2)] bg-[rgba(255,255,255,0.03)] text-cyan-500 focus:ring-cyan-500/20"
                        />
                        <span className="text-sm text-[#94A3B8]">Include Executive Summary</span>
                    </label>
                </div>

                {/* Generate Button */}
                <div className="pt-2">
                    <motion.button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        whileHover={{ scale: isGenerating ? 1 : 1.01 }}
                        whileTap={{ scale: isGenerating ? 1 : 0.99 }}
                        className="w-full py-3 px-4 rounded-lg font-semibold text-sm flex items-center justify-center gap-2 bg-gradient-to-b from-cyan-500 to-teal-600 text-[#030712] transition-all disabled:opacity-70"
                    >
                        {isGenerating ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Generating... {Math.round(generationProgress)}%
                            </>
                        ) : (
                            <>
                                <Download className="w-4 h-4" />
                                Generate Report
                            </>
                        )}
                    </motion.button>

                    {/* Progress Bar */}
                    {isGenerating && (
                        <div className="mt-3 h-1.5 rounded-full bg-[rgba(255,255,255,0.1)] overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${generationProgress}%` }}
                                className="h-full bg-cyan-400 rounded-full"
                            />
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

/**
 * Batch Export Manager
 * Manage bulk exports and downloads
 */
interface ExportJob {
    id: string;
    name: string;
    type: string;
    status: 'pending' | 'processing' | 'complete' | 'failed';
    progress: number;
    createdAt: string;
    size?: string;
}

interface BatchExportManagerProps {
    jobs: ExportJob[];
    onDownload?: (jobId: string) => void;
    onRetry?: (jobId: string) => void;
    onCancel?: (jobId: string) => void;
    className?: string;
}

export function BatchExportManager({
    jobs,
    onDownload,
    onRetry,
    onCancel,
    className = '',
}: BatchExportManagerProps) {
    const getStatusConfig = (status: ExportJob['status']) => {
        switch (status) {
            case 'pending': return { color: 'text-amber-400', bg: 'bg-amber-500/10', label: 'Pending' };
            case 'processing': return { color: 'text-cyan-400', bg: 'bg-cyan-500/10', label: 'Processing' };
            case 'complete': return { color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Complete' };
            case 'failed': return { color: 'text-red-400', bg: 'bg-red-500/10', label: 'Failed' };
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card overflow-hidden ${className}`}
        >
            <div className="p-5 border-b border-[rgba(255,255,255,0.06)]">
                <h3 className="text-base font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                    Export Queue
                </h3>
                <p className="text-xs text-[#64748B] mt-1">{jobs.length} exports in queue</p>
            </div>

            <div className="divide-y divide-[rgba(255,255,255,0.04)]">
                {jobs.map((job, index) => {
                    const statusConfig = getStatusConfig(job.status);

                    return (
                        <motion.div
                            key={job.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="p-4 hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium text-white">{job.name}</p>
                                        <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase rounded ${statusConfig.bg} ${statusConfig.color}`}>
                                            {statusConfig.label}
                                        </span>
                                    </div>
                                    <p className="text-xs text-[#64748B] mt-0.5">
                                        {job.type} • {job.createdAt}
                                        {job.size && ` • ${job.size}`}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2">
                                    {job.status === 'complete' && (
                                        <button
                                            onClick={() => onDownload?.(job.id)}
                                            className="p-2 rounded-md bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 transition-colors"
                                        >
                                            <Download className="w-4 h-4" />
                                        </button>
                                    )}
                                    {job.status === 'failed' && (
                                        <button
                                            onClick={() => onRetry?.(job.id)}
                                            className="p-2 rounded-md bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors"
                                        >
                                            <Loader2 className="w-4 h-4" />
                                        </button>
                                    )}
                                    {job.status === 'processing' && (
                                        <button
                                            onClick={() => onCancel?.(job.id)}
                                            className="p-2 rounded-md bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors"
                                        >
                                            ×
                                        </button>
                                    )}
                                </div>
                            </div>

                            {job.status === 'processing' && (
                                <div className="mt-2 h-1 rounded-full bg-[rgba(255,255,255,0.1)] overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${job.progress}%` }}
                                        className="h-full bg-cyan-400 rounded-full"
                                    />
                                </div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}

export default PDFReportGenerator;
