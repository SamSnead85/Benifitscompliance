'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Plus,
    Trash2,
    GripVertical,
    ChevronDown,
    ChevronUp,
    Settings,
    Download,
    Eye,
    Save,
    BarChart3,
    PieChart,
    TrendingUp,
    Table,
    Calendar,
    Users,
    Building2,
    Filter,
    Columns,
    Palette,
    Layout,
    Clock,
    CheckCircle2,
    Loader2
} from 'lucide-react';

interface ComplianceReportBuilderProps {
    className?: string;
}

interface ReportSection {
    id: string;
    type: 'table' | 'chart' | 'summary' | 'text';
    title: string;
    dataSource: string;
    config: Record<string, unknown>;
}

interface SavedTemplate {
    id: string;
    name: string;
    description: string;
    sections: number;
    lastUsed: string;
}

const dataSources = [
    { id: 'employees', label: 'Employee Roster', icon: Users },
    { id: 'forms_1095c', label: '1095-C Forms', icon: FileText },
    { id: 'coverage', label: 'Coverage History', icon: Calendar },
    { id: 'eligibility', label: 'Eligibility Status', icon: CheckCircle2 },
    { id: 'penalties', label: 'Penalty Exposure', icon: TrendingUp },
    { id: 'organizations', label: 'Organizations', icon: Building2 },
];

const chartTypes = [
    { id: 'bar', label: 'Bar Chart', icon: BarChart3 },
    { id: 'pie', label: 'Pie Chart', icon: PieChart },
    { id: 'line', label: 'Trend Line', icon: TrendingUp },
    { id: 'table', label: 'Data Table', icon: Table },
];

const mockTemplates: SavedTemplate[] = [
    { id: 't1', name: 'Monthly Compliance Summary', description: 'FT status, coverage offers, and penalty exposure overview', sections: 4, lastUsed: '2 days ago' },
    { id: 't2', name: 'Quarterly ALE Report', description: 'Detailed ALE member breakdown with transmission status', sections: 6, lastUsed: '1 week ago' },
    { id: 't3', name: 'Annual Filing Audit', description: 'Complete 1094-C and 1095-C filing analysis', sections: 8, lastUsed: '1 month ago' },
];

export function ComplianceReportBuilder({ className = '' }: ComplianceReportBuilderProps) {
    const [sections, setSections] = useState<ReportSection[]>([
        { id: 's1', type: 'summary', title: 'Executive Summary', dataSource: 'eligibility', config: {} },
        { id: 's2', type: 'chart', title: 'FT Status Distribution', dataSource: 'employees', config: { chartType: 'pie' } },
        { id: 's3', type: 'table', title: 'Coverage Offer Details', dataSource: 'coverage', config: {} },
    ]);
    const [selectedSection, setSelectedSection] = useState<string | null>(null);
    const [showTemplates, setShowTemplates] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const [reportName, setReportName] = useState('Untitled Report');
    const [expandedSections, setExpandedSections] = useState<string[]>(['s1', 's2', 's3']);

    const addSection = (type: 'table' | 'chart' | 'summary' | 'text') => {
        const newSection: ReportSection = {
            id: `s${Date.now()}`,
            type,
            title: `New ${type.charAt(0).toUpperCase() + type.slice(1)} Section`,
            dataSource: 'employees',
            config: type === 'chart' ? { chartType: 'bar' } : {},
        };
        setSections([...sections, newSection]);
        setExpandedSections([...expandedSections, newSection.id]);
    };

    const removeSection = (id: string) => {
        setSections(sections.filter(s => s.id !== id));
    };

    const updateSection = (id: string, updates: Partial<ReportSection>) => {
        setSections(sections.map(s => s.id === id ? { ...s, ...updates } : s));
    };

    const toggleExpand = (id: string) => {
        setExpandedSections(prev =>
            prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
        );
    };

    const generateReport = () => {
        setIsGenerating(true);
        setTimeout(() => {
            setIsGenerating(false);
        }, 2000);
    };

    const getSectionIcon = (type: string) => {
        switch (type) {
            case 'table': return Table;
            case 'chart': return BarChart3;
            case 'summary': return FileText;
            case 'text': return FileText;
            default: return FileText;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card ${className}`}
        >
            {/* Header */}
            <div className="p-5 border-b border-[var(--glass-border)]">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
                            <FileText className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <input
                                type="text"
                                value={reportName}
                                onChange={(e) => setReportName(e.target.value)}
                                className="text-lg font-semibold text-white bg-transparent border-none focus:outline-none focus:ring-0"
                            />
                            <p className="text-xs text-[var(--color-steel)]">Custom Compliance Report Builder</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowTemplates(!showTemplates)}
                            className="btn-secondary flex items-center gap-2"
                        >
                            <Layout className="w-4 h-4" />
                            Templates
                        </button>
                        <button className="btn-secondary flex items-center gap-2">
                            <Save className="w-4 h-4" />
                            Save
                        </button>
                        <button className="btn-secondary flex items-center gap-2">
                            <Eye className="w-4 h-4" />
                            Preview
                        </button>
                        <button
                            onClick={generateReport}
                            disabled={isGenerating}
                            className="btn-primary flex items-center gap-2"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Download className="w-4 h-4" />
                                    Generate
                                </>
                            )}
                        </button>
                    </div>
                </div>

                {/* Templates Panel */}
                <AnimatePresence>
                    {showTemplates && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                        >
                            <div className="pt-4 border-t border-[var(--glass-border)]">
                                <p className="text-sm font-medium text-white mb-3">Saved Templates</p>
                                <div className="grid grid-cols-3 gap-3">
                                    {mockTemplates.map(template => (
                                        <button
                                            key={template.id}
                                            className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)] hover:border-[var(--color-synapse-teal)] transition-colors text-left"
                                        >
                                            <p className="font-medium text-white mb-1">{template.name}</p>
                                            <p className="text-xs text-[var(--color-steel)] mb-2">{template.description}</p>
                                            <div className="flex items-center justify-between text-xs text-[var(--color-steel)]">
                                                <span>{template.sections} sections</span>
                                                <span>{template.lastUsed}</span>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <div className="grid grid-cols-4 divide-x divide-[var(--glass-border)]">
                {/* Section List */}
                <div className="col-span-3 p-5">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-medium text-white">Report Sections</h3>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => addSection('summary')}
                                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[rgba(255,255,255,0.05)] text-[var(--color-silver)] hover:bg-[rgba(255,255,255,0.1)] transition-colors flex items-center gap-1"
                            >
                                <Plus className="w-3 h-3" />
                                Summary
                            </button>
                            <button
                                onClick={() => addSection('chart')}
                                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[rgba(255,255,255,0.05)] text-[var(--color-silver)] hover:bg-[rgba(255,255,255,0.1)] transition-colors flex items-center gap-1"
                            >
                                <Plus className="w-3 h-3" />
                                Chart
                            </button>
                            <button
                                onClick={() => addSection('table')}
                                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-[rgba(255,255,255,0.05)] text-[var(--color-silver)] hover:bg-[rgba(255,255,255,0.1)] transition-colors flex items-center gap-1"
                            >
                                <Plus className="w-3 h-3" />
                                Table
                            </button>
                        </div>
                    </div>

                    <div className="space-y-3 max-h-[500px] overflow-y-auto">
                        {sections.map((section, index) => {
                            const SectionIcon = getSectionIcon(section.type);
                            const isExpanded = expandedSections.includes(section.id);

                            return (
                                <motion.div
                                    key={section.id}
                                    layout
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className={`rounded-lg border transition-colors ${selectedSection === section.id
                                        ? 'border-[var(--color-synapse-teal)] bg-[var(--color-synapse-teal-muted)]'
                                        : 'border-[var(--glass-border)] bg-[rgba(255,255,255,0.02)]'
                                        }`}
                                >
                                    <div
                                        className="p-4 flex items-center gap-3 cursor-pointer"
                                        onClick={() => setSelectedSection(section.id)}
                                    >
                                        <GripVertical className="w-4 h-4 text-[var(--color-steel)] cursor-grab" />
                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${section.type === 'chart'
                                            ? 'bg-[rgba(139,92,246,0.1)] text-purple-400'
                                            : section.type === 'table'
                                                ? 'bg-[rgba(6,182,212,0.1)] text-[var(--color-synapse-teal)]'
                                                : 'bg-[rgba(16,185,129,0.1)] text-[var(--color-success)]'
                                            }`}>
                                            <SectionIcon className="w-4 h-4" />
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                value={section.title}
                                                onChange={(e) => updateSection(section.id, { title: e.target.value })}
                                                onClick={(e) => e.stopPropagation()}
                                                className="font-medium text-white bg-transparent border-none focus:outline-none w-full"
                                            />
                                            <p className="text-xs text-[var(--color-steel)]">
                                                {section.type.charAt(0).toUpperCase() + section.type.slice(1)} • {dataSources.find(d => d.id === section.dataSource)?.label}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); toggleExpand(section.id); }}
                                                className="p-1.5 rounded hover:bg-[rgba(255,255,255,0.05)] text-[var(--color-steel)]"
                                            >
                                                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); removeSection(section.id); }}
                                                className="p-1.5 rounded hover:bg-[rgba(239,68,68,0.1)] text-[var(--color-steel)] hover:text-[var(--color-critical)]"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden border-t border-[var(--glass-border)]"
                                            >
                                                <div className="p-4 space-y-4">
                                                    <div>
                                                        <label className="block text-xs font-medium text-[var(--color-steel)] mb-2">Data Source</label>
                                                        <select
                                                            value={section.dataSource}
                                                            onChange={(e) => updateSection(section.id, { dataSource: e.target.value })}
                                                            className="w-full px-3 py-2 text-sm bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white focus:outline-none focus:border-[var(--color-synapse-teal)]"
                                                        >
                                                            {dataSources.map(ds => (
                                                                <option key={ds.id} value={ds.id}>{ds.label}</option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    {section.type === 'chart' && (
                                                        <div>
                                                            <label className="block text-xs font-medium text-[var(--color-steel)] mb-2">Chart Type</label>
                                                            <div className="flex gap-2">
                                                                {chartTypes.map(ct => {
                                                                    const ChartIcon = ct.icon;
                                                                    return (
                                                                        <button
                                                                            key={ct.id}
                                                                            onClick={() => updateSection(section.id, { config: { ...section.config, chartType: ct.id } })}
                                                                            className={`flex-1 p-2 rounded-lg border flex items-center justify-center gap-2 transition-colors ${(section.config as { chartType?: string }).chartType === ct.id
                                                                                ? 'border-[var(--color-synapse-teal)] bg-[var(--color-synapse-teal-muted)] text-[var(--color-synapse-teal)]'
                                                                                : 'border-[var(--glass-border)] text-[var(--color-steel)] hover:border-[var(--glass-border-hover)]'
                                                                                }`}
                                                                        >
                                                                            <ChartIcon className="w-4 h-4" />
                                                                            <span className="text-xs">{ct.label}</span>
                                                                        </button>
                                                                    );
                                                                })}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {/* Settings Panel */}
                <div className="p-5">
                    <h3 className="font-medium text-white mb-4 flex items-center gap-2">
                        <Settings className="w-4 h-4 text-[var(--color-synapse-teal)]" />
                        Report Settings
                    </h3>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-[var(--color-steel)] mb-2">Output Format</label>
                            <select className="w-full px-3 py-2 text-sm bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white focus:outline-none focus:border-[var(--color-synapse-teal)]">
                                <option value="pdf">PDF Document</option>
                                <option value="xlsx">Excel Workbook</option>
                                <option value="csv">CSV Files</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-[var(--color-steel)] mb-2">Date Range</label>
                            <select className="w-full px-3 py-2 text-sm bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white focus:outline-none focus:border-[var(--color-synapse-teal)]">
                                <option value="ytd">Year to Date</option>
                                <option value="last_month">Last Month</option>
                                <option value="last_quarter">Last Quarter</option>
                                <option value="last_year">Last Year</option>
                                <option value="custom">Custom Range</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-[var(--color-steel)] mb-2">Organization</label>
                            <select className="w-full px-3 py-2 text-sm bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white focus:outline-none focus:border-[var(--color-synapse-teal)]">
                                <option value="all">All Organizations</option>
                                <option value="org1">Acme Corporation</option>
                                <option value="org2">TechStart Inc</option>
                            </select>
                        </div>

                        <div className="pt-4 border-t border-[var(--glass-border)]">
                            <label className="flex items-center justify-between p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)]">
                                <span className="text-sm text-[var(--color-silver)]">Include Cover Page</span>
                                <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                            </label>
                        </div>

                        <div>
                            <label className="flex items-center justify-between p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)]">
                                <span className="text-sm text-[var(--color-silver)]">Include Page Numbers</span>
                                <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                            </label>
                        </div>

                        <div>
                            <label className="flex items-center justify-between p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)]">
                                <span className="text-sm text-[var(--color-silver)]">Include Table of Contents</span>
                                <input type="checkbox" className="w-4 h-4 rounded" />
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default ComplianceReportBuilder;
