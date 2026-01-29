'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileSpreadsheet,
    FileText,
    FileJson,
    Download,
    Calendar,
    Filter,
    Plus,
    Play,
    Clock,
    CheckCircle2,
    X,
    Settings,
    Mail,
    ChevronDown
} from 'lucide-react';

interface ReportTemplate {
    id: string;
    name: string;
    description: string;
    category: 'compliance' | 'workforce' | 'financial' | 'custom';
    outputFormats: ('pdf' | 'excel' | 'csv' | 'json')[];
    lastRun?: string;
    scheduled?: boolean;
}

interface CustomReportBuilderProps {
    templates?: ReportTemplate[];
    onGenerate?: (templateId: string, format: string) => void;
    className?: string;
}

const defaultTemplates: ReportTemplate[] = [
    { id: '1', name: 'ACA Compliance Summary', description: 'Overview of ACA compliance status across all clients', category: 'compliance', outputFormats: ['pdf', 'excel'], lastRun: '2 hours ago', scheduled: true },
    { id: '2', name: 'FTE Classification Report', description: 'Detailed breakdown of employee FTE status by measurement period', category: 'workforce', outputFormats: ['pdf', 'excel', 'csv'], lastRun: '1 day ago' },
    { id: '3', name: 'Penalty Risk Assessment', description: '4980H(a) and 4980H(b) exposure analysis', category: 'financial', outputFormats: ['pdf', 'excel'], lastRun: '3 days ago', scheduled: true },
    { id: '4', name: '1095-C Filing Status', description: 'Status of all 1095-C forms by client', category: 'compliance', outputFormats: ['pdf', 'excel', 'csv'] },
    { id: '5', name: 'Coverage Offer Audit', description: 'Audit trail of coverage offers and employee elections', category: 'compliance', outputFormats: ['pdf', 'excel', 'json'] },
    { id: '6', name: 'Workforce Demographics', description: 'Employee distribution by department, status, and tenure', category: 'workforce', outputFormats: ['pdf', 'excel', 'csv'] },
];

const formatIcons = {
    pdf: FileText,
    excel: FileSpreadsheet,
    csv: FileSpreadsheet,
    json: FileJson
};

const categoryColors = {
    compliance: 'var(--color-synapse-teal)',
    workforce: 'var(--color-synapse-cyan)',
    financial: 'var(--color-warning)',
    custom: 'var(--color-silver)'
};

export function CustomReportBuilder({
    templates = defaultTemplates,
    onGenerate,
    className = ''
}: CustomReportBuilderProps) {
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
    const [selectedFormat, setSelectedFormat] = useState<string>('pdf');
    const [filterCategory, setFilterCategory] = useState<string>('all');
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [generating, setGenerating] = useState<string | null>(null);

    const filteredTemplates = filterCategory === 'all'
        ? templates
        : templates.filter(t => t.category === filterCategory);

    const handleGenerate = async (templateId: string, format: string) => {
        setGenerating(templateId);
        // Simulate generation
        await new Promise(resolve => setTimeout(resolve, 2000));
        setGenerating(null);
        onGenerate?.(templateId, format);
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
                    <FileSpreadsheet className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                    <h3 className="font-semibold text-white">Report Builder</h3>
                </div>
                <div className="flex items-center gap-2">
                    <button className="btn-secondary text-sm">
                        <Plus className="w-4 h-4" />
                        New Template
                    </button>
                </div>
            </div>

            {/* Filter */}
            <div className="flex items-center gap-2 mb-4">
                <Filter className="w-4 h-4 text-[var(--color-steel)]" />
                {['all', 'compliance', 'workforce', 'financial'].map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setFilterCategory(cat)}
                        className={`px-3 py-1 rounded text-xs font-medium transition-colors ${filterCategory === cat
                                ? 'bg-[var(--color-synapse-teal)] text-black'
                                : 'bg-[var(--glass-bg)] text-[var(--color-steel)] hover:text-white'
                            }`}
                    >
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                ))}
            </div>

            {/* Templates Grid */}
            <div className="grid grid-cols-2 gap-4">
                {filteredTemplates.map((template, i) => {
                    const isSelected = selectedTemplate === template.id;
                    const isGenerating = generating === template.id;

                    return (
                        <motion.div
                            key={template.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            onClick={() => setSelectedTemplate(isSelected ? null : template.id)}
                            className={`p-4 rounded-lg border cursor-pointer transition-all ${isSelected
                                    ? 'bg-[rgba(6,182,212,0.1)] border-[var(--color-synapse-teal)]'
                                    : 'bg-[var(--glass-bg-light)] border-[var(--glass-border)] hover:border-[var(--glass-border-hover)]'
                                }`}
                        >
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex items-center gap-2">
                                    <span
                                        className="w-2 h-2 rounded-full"
                                        style={{ backgroundColor: categoryColors[template.category] }}
                                    />
                                    <span className="text-sm font-medium text-white">{template.name}</span>
                                </div>
                                {template.scheduled && (
                                    <Clock className="w-4 h-4 text-[var(--color-synapse-teal)]" />
                                )}
                            </div>
                            <p className="text-xs text-[var(--color-steel)] mb-3">{template.description}</p>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1">
                                    {template.outputFormats.map((format) => {
                                        const Icon = formatIcons[format];
                                        return (
                                            <span
                                                key={format}
                                                className="p-1 rounded bg-[var(--glass-bg)] text-[var(--color-steel)]"
                                            >
                                                <Icon className="w-3 h-3" />
                                            </span>
                                        );
                                    })}
                                </div>
                                {template.lastRun && (
                                    <span className="text-xs text-[var(--color-steel)]">
                                        Last: {template.lastRun}
                                    </span>
                                )}
                            </div>

                            {/* Expanded Actions */}
                            <AnimatePresence>
                                {isSelected && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="mt-4 pt-4 border-t border-[var(--glass-border)]"
                                    >
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-xs text-[var(--color-steel)]">Format:</span>
                                            <div className="flex gap-1">
                                                {template.outputFormats.map((format) => (
                                                    <button
                                                        key={format}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            setSelectedFormat(format);
                                                        }}
                                                        className={`px-2 py-1 rounded text-xs uppercase font-medium ${selectedFormat === format
                                                                ? 'bg-[var(--color-synapse-teal)] text-black'
                                                                : 'bg-[var(--glass-bg)] text-[var(--color-steel)]'
                                                            }`}
                                                    >
                                                        {format}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleGenerate(template.id, selectedFormat);
                                                }}
                                                disabled={isGenerating}
                                                className="flex-1 btn-primary text-sm disabled:opacity-50"
                                            >
                                                {isGenerating ? (
                                                    <span className="flex items-center gap-2">
                                                        <motion.div
                                                            animate={{ rotate: 360 }}
                                                            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                                                        >
                                                            <Settings className="w-4 h-4" />
                                                        </motion.div>
                                                        Generating...
                                                    </span>
                                                ) : (
                                                    <>
                                                        <Play className="w-4 h-4" />
                                                        Generate Now
                                                    </>
                                                )}
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setShowScheduleModal(true);
                                                }}
                                                className="btn-secondary text-sm"
                                            >
                                                <Calendar className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}

export default CustomReportBuilder;
