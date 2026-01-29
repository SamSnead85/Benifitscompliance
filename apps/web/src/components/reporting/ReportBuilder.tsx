'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Plus,
    Trash2,
    GripVertical,
    Type,
    BarChart3,
    PieChart,
    Table,
    Image,
    Minus,
    Settings,
    Eye,
    Download,
    Save,
    Layout
} from 'lucide-react';

interface ReportElement {
    id: string;
    type: 'heading' | 'text' | 'chart' | 'table' | 'metric' | 'divider' | 'image';
    content: unknown;
    settings?: Record<string, unknown>;
}

interface ReportTemplate {
    id: string;
    name: string;
    description: string;
    elements: ReportElement[];
}

interface ReportBuilderProps {
    template?: ReportTemplate;
    className?: string;
    onSave?: (template: ReportTemplate) => void;
}

const elementTypes = [
    { type: 'heading', icon: Type, label: 'Heading' },
    { type: 'text', icon: FileText, label: 'Text Block' },
    { type: 'chart', icon: BarChart3, label: 'Chart' },
    { type: 'table', icon: Table, label: 'Data Table' },
    { type: 'metric', icon: PieChart, label: 'Metric Card' },
    { type: 'divider', icon: Minus, label: 'Divider' },
    { type: 'image', icon: Image, label: 'Image' },
];

const defaultElements: ReportElement[] = [
    { id: 'el-001', type: 'heading', content: { text: 'Compliance Summary Report', level: 1 } },
    { id: 'el-002', type: 'text', content: { text: 'This report provides an overview of ACA compliance status for the current reporting period.' } },
    { id: 'el-003', type: 'metric', content: { metrics: ['compliance_rate', 'fte_count', 'pending_actions'] } },
    { id: 'el-004', type: 'divider', content: {} },
    { id: 'el-005', type: 'heading', content: { text: 'Employee Coverage Analysis', level: 2 } },
    { id: 'el-006', type: 'chart', content: { type: 'bar', dataSource: 'coverage_by_month' } },
    { id: 'el-007', type: 'table', content: { dataSource: 'employee_status', columns: ['name', 'status', 'coverage'] } },
];

export function ReportBuilder({
    template,
    className = '',
    onSave
}: ReportBuilderProps) {
    const [elements, setElements] = useState<ReportElement[]>(template?.elements || defaultElements);
    const [selectedElement, setSelectedElement] = useState<string | null>(null);
    const [reportName, setReportName] = useState(template?.name || 'Untitled Report');
    const [showPreview, setShowPreview] = useState(false);
    const [draggedElement, setDraggedElement] = useState<string | null>(null);

    const addElement = (type: ReportElement['type']) => {
        const newElement: ReportElement = {
            id: `el-${Date.now()}`,
            type,
            content: getDefaultContent(type)
        };
        setElements([...elements, newElement]);
        setSelectedElement(newElement.id);
    };

    const removeElement = (id: string) => {
        setElements(elements.filter(el => el.id !== id));
        if (selectedElement === id) setSelectedElement(null);
    };

    const getDefaultContent = (type: ReportElement['type']): unknown => {
        switch (type) {
            case 'heading': return { text: 'New Heading', level: 2 };
            case 'text': return { text: 'Enter your text here...' };
            case 'chart': return { type: 'bar', dataSource: 'select_data' };
            case 'table': return { dataSource: 'select_data', columns: [] };
            case 'metric': return { metrics: [] };
            default: return {};
        }
    };

    const renderElement = (element: ReportElement) => {
        const isSelected = selectedElement === element.id;

        return (
            <motion.div
                key={element.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                onClick={() => setSelectedElement(element.id)}
                className={`group relative p-4 rounded-lg border-2 transition-colors cursor-pointer ${isSelected
                        ? 'border-[var(--color-synapse-teal)] bg-[var(--glass-bg-light)]'
                        : 'border-transparent hover:border-[var(--glass-border)] bg-[var(--glass-bg)]'
                    }`}
            >
                {/* Drag Handle */}
                <div className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 cursor-grab">
                    <GripVertical className="w-4 h-4 text-[var(--color-steel)]" />
                </div>

                {/* Remove Button */}
                <button
                    onClick={(e) => { e.stopPropagation(); removeElement(element.id); }}
                    className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-[rgba(239,68,68,0.2)] text-[var(--color-critical)]"
                >
                    <Trash2 className="w-4 h-4" />
                </button>

                {/* Element Content */}
                <div className="pl-6">
                    {element.type === 'heading' && (
                        <h3 className="text-lg font-semibold text-white">
                            {(element.content as { text: string }).text}
                        </h3>
                    )}
                    {element.type === 'text' && (
                        <p className="text-sm text-[var(--color-silver)]">
                            {(element.content as { text: string }).text}
                        </p>
                    )}
                    {element.type === 'chart' && (
                        <div className="h-32 rounded-lg bg-gradient-to-br from-[var(--glass-bg)] to-[var(--glass-bg-light)] flex items-center justify-center border border-dashed border-[var(--glass-border)]">
                            <div className="text-center">
                                <BarChart3 className="w-8 h-8 mx-auto text-[var(--color-steel)] mb-2" />
                                <span className="text-xs text-[var(--color-steel)]">
                                    Chart: {(element.content as { dataSource: string }).dataSource}
                                </span>
                            </div>
                        </div>
                    )}
                    {element.type === 'table' && (
                        <div className="h-24 rounded-lg bg-gradient-to-br from-[var(--glass-bg)] to-[var(--glass-bg-light)] flex items-center justify-center border border-dashed border-[var(--glass-border)]">
                            <div className="text-center">
                                <Table className="w-8 h-8 mx-auto text-[var(--color-steel)] mb-2" />
                                <span className="text-xs text-[var(--color-steel)]">Data Table</span>
                            </div>
                        </div>
                    )}
                    {element.type === 'metric' && (
                        <div className="flex gap-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="flex-1 p-3 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)]">
                                    <div className="h-4 w-1/2 bg-[var(--glass-border)] rounded mb-2" />
                                    <div className="h-6 w-3/4 bg-[var(--glass-border)] rounded" />
                                </div>
                            ))}
                        </div>
                    )}
                    {element.type === 'divider' && (
                        <hr className="border-[var(--glass-border)]" />
                    )}
                </div>
            </motion.div>
        );
    };

    return (
        <div className={`flex gap-6 ${className}`}>
            {/* Canvas */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex-1 glass-card p-6"
            >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Layout className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                        <input
                            type="text"
                            value={reportName}
                            onChange={(e) => setReportName(e.target.value)}
                            className="text-lg font-semibold text-white bg-transparent border-b border-transparent hover:border-[var(--glass-border)] focus:border-[var(--color-synapse-teal)] focus:outline-none px-1"
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setShowPreview(!showPreview)}
                            className="btn-secondary text-sm"
                        >
                            <Eye className="w-4 h-4" />
                            Preview
                        </button>
                        <button className="btn-primary text-sm">
                            <Save className="w-4 h-4" />
                            Save Template
                        </button>
                    </div>
                </div>

                {/* Elements */}
                <div className="space-y-3 min-h-[400px]">
                    <AnimatePresence>
                        {elements.map(renderElement)}
                    </AnimatePresence>
                </div>

                {/* Add Element */}
                <div className="mt-6 p-4 border-2 border-dashed border-[var(--glass-border)] rounded-lg">
                    <p className="text-center text-sm text-[var(--color-steel)] mb-3">Add Element</p>
                    <div className="flex justify-center gap-2 flex-wrap">
                        {elementTypes.map(({ type, icon: Icon, label }) => (
                            <button
                                key={type}
                                onClick={() => addElement(type as ReportElement['type'])}
                                className="px-3 py-2 rounded-lg bg-[var(--glass-bg)] hover:bg-[var(--glass-bg-light)] border border-[var(--glass-border)] text-sm text-[var(--color-steel)] hover:text-white flex items-center gap-2 transition-colors"
                            >
                                <Icon className="w-4 h-4" />
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Properties Panel */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-80 glass-card p-4"
            >
                <div className="flex items-center gap-2 mb-4">
                    <Settings className="w-4 h-4 text-[var(--color-synapse-teal)]" />
                    <h4 className="font-medium text-white">Properties</h4>
                </div>

                {selectedElement ? (
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-[var(--color-steel)] block mb-1">Element Type</label>
                            <p className="text-sm text-white capitalize">
                                {elements.find(el => el.id === selectedElement)?.type}
                            </p>
                        </div>

                        <div>
                            <label className="text-xs text-[var(--color-steel)] block mb-1">Data Source</label>
                            <select className="w-full p-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm text-white">
                                <option>Compliance Metrics</option>
                                <option>Employee Status</option>
                                <option>Coverage by Month</option>
                                <option>FTE Distribution</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs text-[var(--color-steel)] block mb-1">Filters</label>
                            <button className="w-full p-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm text-[var(--color-steel)] hover:text-white flex items-center justify-center gap-2">
                                <Plus className="w-4 h-4" />
                                Add Filter
                            </button>
                        </div>
                    </div>
                ) : (
                    <p className="text-sm text-[var(--color-steel)] text-center py-8">
                        Select an element to edit its properties
                    </p>
                )}
            </motion.div>
        </div>
    );
}

export default ReportBuilder;
