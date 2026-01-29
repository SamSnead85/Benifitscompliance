'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText, Download, Calendar, ChevronDown, ChevronRight, Plus,
    Clock, CheckCircle, AlertCircle, Play, Pause, Settings,
    Mail, Users, BarChart3, PieChart, TrendingUp, DollarSign,
    FileSpreadsheet, Presentation, File, Printer, Eye, Edit,
    Trash2, Copy, Share2, Lock, Unlock, Star, Filter
} from 'lucide-react';

// ============================================================================
// REPORT DATA
// ============================================================================

const reportTemplates = [
    {
        id: 'exec-summary',
        name: 'Executive Summary',
        description: 'High-level plan performance overview for C-suite stakeholders',
        icon: BarChart3,
        category: 'Executive',
        formats: ['pdf', 'pptx'],
        lastGenerated: '2024-12-28',
        scheduleEnabled: true,
        scheduleFrequency: 'Monthly'
    },
    {
        id: 'claims-analysis',
        name: 'Claims Analysis Report',
        description: 'Detailed claims breakdown by category, provider, and diagnosis',
        icon: FileText,
        category: 'Analytics',
        formats: ['pdf', 'xlsx'],
        lastGenerated: '2024-12-25',
        scheduleEnabled: false,
        scheduleFrequency: null
    },
    {
        id: 'financial-summary',
        name: 'CFO Financial Report',
        description: 'Budget variance, funding analysis, and financial projections',
        icon: DollarSign,
        category: 'Financial',
        formats: ['pdf', 'xlsx'],
        lastGenerated: '2024-12-15',
        scheduleEnabled: true,
        scheduleFrequency: 'Quarterly'
    },
    {
        id: 'stop-loss',
        name: 'Stop-Loss Tracking Report',
        description: 'Specific and aggregate stop-loss utilization with projections',
        icon: TrendingUp,
        category: 'Risk',
        formats: ['pdf', 'xlsx'],
        lastGenerated: '2024-12-20',
        scheduleEnabled: true,
        scheduleFrequency: 'Weekly'
    },
    {
        id: 'pharmacy-intel',
        name: 'Pharmacy Intelligence Report',
        description: 'Rx trends, GLP-1 impact, specialty drugs, and savings opportunities',
        icon: PieChart,
        category: 'Analytics',
        formats: ['pdf', 'xlsx'],
        lastGenerated: '2024-12-22',
        scheduleEnabled: false,
        scheduleFrequency: null
    },
    {
        id: 'aca-compliance',
        name: 'ACA Compliance Summary',
        description: 'Eligibility tracking, measurement periods, and compliance status',
        icon: CheckCircle,
        category: 'Compliance',
        formats: ['pdf'],
        lastGenerated: '2024-12-01',
        scheduleEnabled: true,
        scheduleFrequency: 'Monthly'
    }
];

const recentReports = [
    {
        id: 'rpt-001',
        name: 'Executive Summary - December 2024',
        template: 'exec-summary',
        generatedAt: '2024-12-28T14:32:00',
        format: 'pdf',
        size: '2.4 MB',
        status: 'completed',
        generatedBy: 'System (Scheduled)'
    },
    {
        id: 'rpt-002',
        name: 'Claims Analysis Q4 2024',
        template: 'claims-analysis',
        generatedAt: '2024-12-25T09:15:00',
        format: 'xlsx',
        size: '5.8 MB',
        status: 'completed',
        generatedBy: 'Admin User'
    },
    {
        id: 'rpt-003',
        name: 'Stop-Loss Report - Week 52',
        template: 'stop-loss',
        generatedAt: '2024-12-23T08:00:00',
        format: 'pdf',
        size: '1.2 MB',
        status: 'completed',
        generatedBy: 'System (Scheduled)'
    },
    {
        id: 'rpt-004',
        name: 'Pharmacy Intel Report',
        template: 'pharmacy-intel',
        generatedAt: '2024-12-22T16:45:00',
        format: 'pdf',
        size: '3.1 MB',
        status: 'completed',
        generatedBy: 'Analyst'
    },
    {
        id: 'rpt-005',
        name: 'Ad-hoc Claims Export',
        template: 'claims-analysis',
        generatedAt: '2024-12-21T11:20:00',
        format: 'xlsx',
        size: '12.4 MB',
        status: 'completed',
        generatedBy: 'Admin User'
    }
];

const scheduledReports = [
    {
        id: 'sch-001',
        template: 'Executive Summary',
        frequency: 'Monthly',
        nextRun: '2025-01-01T09:00:00',
        recipients: ['cfo@company.com', 'hr-director@company.com'],
        format: 'pdf',
        status: 'active'
    },
    {
        id: 'sch-002',
        template: 'Stop-Loss Tracking',
        frequency: 'Weekly',
        nextRun: '2024-12-30T08:00:00',
        recipients: ['benefits@company.com'],
        format: 'pdf',
        status: 'active'
    },
    {
        id: 'sch-003',
        template: 'CFO Financial Report',
        frequency: 'Quarterly',
        nextRun: '2025-01-15T09:00:00',
        recipients: ['cfo@company.com', 'finance@company.com'],
        format: 'xlsx',
        status: 'active'
    },
    {
        id: 'sch-004',
        template: 'ACA Compliance Summary',
        frequency: 'Monthly',
        nextRun: '2025-01-05T09:00:00',
        recipients: ['compliance@company.com'],
        format: 'pdf',
        status: 'paused'
    }
];

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
};

const stagger = {
    visible: { transition: { staggerChildren: 0.06 } }
};

// ============================================================================
// COMPONENTS
// ============================================================================

function FormatIcon({ format }: { format: string }) {
    if (format === 'pdf') {
        return (
            <div className="p-1.5 rounded bg-rose-500/20">
                <File className="w-4 h-4 text-rose-400" />
            </div>
        );
    }
    if (format === 'xlsx') {
        return (
            <div className="p-1.5 rounded bg-emerald-500/20">
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            </div>
        );
    }
    if (format === 'pptx') {
        return (
            <div className="p-1.5 rounded bg-amber-500/20">
                <Presentation className="w-4 h-4 text-amber-400" />
            </div>
        );
    }
    return (
        <div className="p-1.5 rounded bg-slate-500/20">
            <File className="w-4 h-4 text-slate-400" />
        </div>
    );
}

function StatusBadge({ status }: { status: string }) {
    const configs: Record<string, { label: string; className: string; icon: React.ComponentType<{ className?: string }> }> = {
        completed: { label: 'Completed', className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: CheckCircle },
        running: { label: 'Generating', className: 'bg-blue-500/10 text-blue-400 border-blue-500/20', icon: Clock },
        failed: { label: 'Failed', className: 'bg-rose-500/10 text-rose-400 border-rose-500/20', icon: AlertCircle },
        active: { label: 'Active', className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20', icon: Play },
        paused: { label: 'Paused', className: 'bg-amber-500/10 text-amber-400 border-amber-500/20', icon: Pause }
    };
    const config = configs[status] || configs.completed;
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.className}`}>
            <Icon className="w-3 h-3" />
            {config.label}
        </span>
    );
}

function ReportTemplateCard({ template, onGenerate }: { template: typeof reportTemplates[0]; onGenerate: () => void }) {
    const Icon = template.icon;

    return (
        <motion.div
            variants={fadeInUp}
            className="p-5 rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)] hover:border-[var(--accent-primary)]/30 transition-colors group"
        >
            <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 rounded-lg bg-[var(--surface-secondary)]">
                    <Icon className="w-5 h-5 text-[var(--accent-primary)]" />
                </div>
                <div className="flex items-center gap-1">
                    {template.formats.map((fmt) => (
                        <FormatIcon key={fmt} format={fmt} />
                    ))}
                </div>
            </div>

            <h3 className="text-sm font-medium text-[var(--text-primary)] mb-1">{template.name}</h3>
            <p className="text-xs text-[var(--text-secondary)] line-clamp-2 mb-4">{template.description}</p>

            <div className="flex items-center justify-between pt-3 border-t border-[var(--border-primary)]">
                <div className="text-xs text-[var(--text-tertiary)]">
                    {template.scheduleEnabled ? (
                        <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {template.scheduleFrequency}
                        </span>
                    ) : (
                        <span>On-demand</span>
                    )}
                </div>
                <button
                    onClick={onGenerate}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent-primary)] text-black text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity hover:opacity-90"
                >
                    <Play className="w-3 h-3" />
                    Generate
                </button>
            </div>
        </motion.div>
    );
}

function GenerateReportModal({ isOpen, onClose, template }: { isOpen: boolean; onClose: () => void; template: typeof reportTemplates[0] | null }) {
    const [selectedFormat, setSelectedFormat] = useState('pdf');
    const [dateRange, setDateRange] = useState('last-month');
    const [isGenerating, setIsGenerating] = useState(false);

    if (!isOpen || !template) return null;

    const handleGenerate = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
            onClose();
        }, 2000);
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="bg-[var(--surface-primary)] border border-[var(--border-primary)] rounded-xl p-6 w-full max-w-md"
                    onClick={(e) => e.stopPropagation()}
                >
                    <h2 className="text-lg font-medium text-[var(--text-primary)] mb-1">Generate Report</h2>
                    <p className="text-sm text-[var(--text-secondary)] mb-6">{template.name}</p>

                    <div className="space-y-4">
                        {/* Format Selection */}
                        <div>
                            <label className="text-xs uppercase text-[var(--text-tertiary)] tracking-wider mb-2 block">Export Format</label>
                            <div className="flex gap-2">
                                {template.formats.map((fmt) => (
                                    <button
                                        key={fmt}
                                        onClick={() => setSelectedFormat(fmt)}
                                        className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm transition-colors ${selectedFormat === fmt
                                            ? 'bg-[var(--accent-primary)]/10 border-[var(--accent-primary)]/30 text-[var(--accent-primary)]'
                                            : 'bg-[var(--surface-secondary)] border-[var(--border-primary)] text-[var(--text-secondary)]'
                                            }`}
                                    >
                                        <FormatIcon format={fmt} />
                                        {fmt.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Date Range */}
                        <div>
                            <label className="text-xs uppercase text-[var(--text-tertiary)] tracking-wider mb-2 block">Date Range</label>
                            <select
                                value={dateRange}
                                onChange={(e) => setDateRange(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg bg-[var(--surface-secondary)] border border-[var(--border-primary)] text-[var(--text-primary)] text-sm"
                            >
                                <option value="last-week">Last Week</option>
                                <option value="last-month">Last Month</option>
                                <option value="last-quarter">Last Quarter</option>
                                <option value="ytd">Year to Date</option>
                                <option value="custom">Custom Range</option>
                            </select>
                        </div>

                        {/* Options */}
                        <div className="flex items-center gap-4 pt-2">
                            <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)] cursor-pointer">
                                <input type="checkbox" className="rounded border-[var(--border-primary)]" defaultChecked />
                                Include charts
                            </label>
                            <label className="flex items-center gap-2 text-sm text-[var(--text-secondary)] cursor-pointer">
                                <input type="checkbox" className="rounded border-[var(--border-primary)]" />
                                Email when ready
                            </label>
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 rounded-lg border border-[var(--border-primary)] text-[var(--text-secondary)] text-sm hover:bg-[var(--surface-secondary)] transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleGenerate}
                            disabled={isGenerating}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--accent-primary)] text-black text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                            {isGenerating ? (
                                <>
                                    <Clock className="w-4 h-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Download className="w-4 h-4" />
                                    Generate Report
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

// ============================================================================
// MAIN PAGE COMPONENT
// ============================================================================

export default function ReportStudioPage() {
    const [selectedTemplate, setSelectedTemplate] = useState<typeof reportTemplates[0] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'templates' | 'recent' | 'scheduled'>('templates');

    const handleGenerateClick = (template: typeof reportTemplates[0]) => {
        setSelectedTemplate(template);
        setIsModalOpen(true);
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-[var(--text-primary)] tracking-tight flex items-center gap-3">
                        <FileText className="w-7 h-7 text-[var(--accent-primary)]" />
                        Report Studio
                    </h1>
                    <p className="text-[var(--text-secondary)] mt-1">
                        Generate, schedule, and manage analytics reports
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--surface-primary)] border border-[var(--border-primary)] text-[var(--text-secondary)] text-sm hover:text-[var(--text-primary)] transition-colors">
                        <Settings className="w-4 h-4" />
                        Settings
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[var(--accent-primary)] text-black text-sm font-medium hover:opacity-90 transition-opacity">
                        <Plus className="w-4 h-4" />
                        Custom Report
                    </button>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 p-1 rounded-lg bg-[var(--surface-primary)] border border-[var(--border-primary)] w-fit">
                {[
                    { id: 'templates', label: 'Report Templates', count: reportTemplates.length },
                    { id: 'recent', label: 'Recent Reports', count: recentReports.length },
                    { id: 'scheduled', label: 'Scheduled', count: scheduledReports.filter(s => s.status === 'active').length }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab.id
                            ? 'bg-[var(--surface-secondary)] text-[var(--text-primary)]'
                            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                            }`}
                    >
                        {tab.label}
                        <span className={`px-1.5 py-0.5 rounded text-xs ${activeTab === tab.id ? 'bg-[var(--accent-primary)]/20 text-[var(--accent-primary)]' : 'bg-[var(--surface-secondary)] text-[var(--text-tertiary)]'
                            }`}>
                            {tab.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Templates Tab */}
            {activeTab === 'templates' && (
                <motion.div
                    variants={stagger}
                    initial="hidden"
                    animate="visible"
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                    {reportTemplates.map((template) => (
                        <ReportTemplateCard
                            key={template.id}
                            template={template}
                            onGenerate={() => handleGenerateClick(template)}
                        />
                    ))}
                </motion.div>
            )}

            {/* Recent Reports Tab */}
            {activeTab === 'recent' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)] overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider border-b border-[var(--border-primary)]">
                                    <th className="text-left py-3 px-4">Report Name</th>
                                    <th className="text-left py-3 px-4">Generated</th>
                                    <th className="text-left py-3 px-4">Generated By</th>
                                    <th className="text-center py-3 px-4">Format</th>
                                    <th className="text-right py-3 px-4">Size</th>
                                    <th className="text-center py-3 px-4">Status</th>
                                    <th className="text-center py-3 px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentReports.map((report) => (
                                    <tr key={report.id} className="border-b border-[var(--border-primary)] hover:bg-white/[0.02] transition-colors">
                                        <td className="py-3 px-4">
                                            <span className="text-sm text-[var(--text-primary)]">{report.name}</span>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-[var(--text-secondary)]">
                                            {new Date(report.generatedAt).toLocaleDateString()} at {new Date(report.generatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="py-3 px-4 text-sm text-[var(--text-secondary)]">
                                            {report.generatedBy}
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <FormatIcon format={report.format} />
                                        </td>
                                        <td className="py-3 px-4 text-right">
                                            <span className="text-sm text-[var(--text-secondary)] font-mono">{report.size}</span>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <StatusBadge status={report.status} />
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <button className="p-1.5 rounded-lg hover:bg-[var(--surface-secondary)] transition-colors">
                                                    <Download className="w-4 h-4 text-[var(--text-secondary)]" />
                                                </button>
                                                <button className="p-1.5 rounded-lg hover:bg-[var(--surface-secondary)] transition-colors">
                                                    <Eye className="w-4 h-4 text-[var(--text-secondary)]" />
                                                </button>
                                                <button className="p-1.5 rounded-lg hover:bg-[var(--surface-secondary)] transition-colors">
                                                    <Share2 className="w-4 h-4 text-[var(--text-secondary)]" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}

            {/* Scheduled Reports Tab */}
            {activeTab === 'scheduled' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-xl bg-[var(--surface-primary)] border border-[var(--border-primary)] overflow-hidden"
                >
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-xs text-[var(--text-tertiary)] uppercase tracking-wider border-b border-[var(--border-primary)]">
                                    <th className="text-left py-3 px-4">Report Template</th>
                                    <th className="text-left py-3 px-4">Frequency</th>
                                    <th className="text-left py-3 px-4">Next Run</th>
                                    <th className="text-left py-3 px-4">Recipients</th>
                                    <th className="text-center py-3 px-4">Format</th>
                                    <th className="text-center py-3 px-4">Status</th>
                                    <th className="text-center py-3 px-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {scheduledReports.map((schedule) => (
                                    <tr key={schedule.id} className="border-b border-[var(--border-primary)] hover:bg-white/[0.02] transition-colors">
                                        <td className="py-3 px-4">
                                            <span className="text-sm text-[var(--text-primary)]">{schedule.template}</span>
                                        </td>
                                        <td className="py-3 px-4">
                                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded text-xs bg-[var(--surface-secondary)] text-[var(--text-secondary)]">
                                                <Clock className="w-3 h-3" />
                                                {schedule.frequency}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-sm text-[var(--text-secondary)]">
                                            {new Date(schedule.nextRun).toLocaleDateString()} at {new Date(schedule.nextRun).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="py-3 px-4">
                                            <div className="flex items-center gap-1">
                                                <Mail className="w-4 h-4 text-[var(--text-tertiary)]" />
                                                <span className="text-sm text-[var(--text-secondary)]">{schedule.recipients.length} recipients</span>
                                            </div>
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <FormatIcon format={schedule.format} />
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <StatusBadge status={schedule.status} />
                                        </td>
                                        <td className="py-3 px-4 text-center">
                                            <div className="flex items-center justify-center gap-1">
                                                <button className="p-1.5 rounded-lg hover:bg-[var(--surface-secondary)] transition-colors">
                                                    <Edit className="w-4 h-4 text-[var(--text-secondary)]" />
                                                </button>
                                                <button className="p-1.5 rounded-lg hover:bg-[var(--surface-secondary)] transition-colors">
                                                    {schedule.status === 'active' ? (
                                                        <Pause className="w-4 h-4 text-[var(--text-secondary)]" />
                                                    ) : (
                                                        <Play className="w-4 h-4 text-[var(--text-secondary)]" />
                                                    )}
                                                </button>
                                                <button className="p-1.5 rounded-lg hover:bg-rose-500/10 transition-colors">
                                                    <Trash2 className="w-4 h-4 text-rose-400" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            )}

            {/* Generate Report Modal */}
            <GenerateReportModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                template={selectedTemplate}
            />
        </div>
    );
}
