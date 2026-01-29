'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Edit3,
    Save,
    X,
    Search,
    Filter,
    CheckCircle2,
    AlertTriangle,
    ArrowLeft,
    ArrowRight
} from 'lucide-react';

interface Employee {
    id: string;
    name: string;
    ssn: string;
    monthlyData: {
        [month: string]: {
            line14: string;
            line15: string;
            line16: string;
            line17: string;
        };
    };
    hasErrors: boolean;
}

interface CodeEditorGridProps {
    employees?: Employee[];
    taxYear?: number;
    onSave?: (employees: Employee[]) => void;
    className?: string;
}

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const defaultEmployees: Employee[] = [
    {
        id: 'E001',
        name: 'John Smith',
        ssn: '***-**-1234',
        monthlyData: {
            Jan: { line14: '1A', line15: '220.00', line16: '2C', line17: '' },
            Feb: { line14: '1A', line15: '220.00', line16: '2C', line17: '' },
            Mar: { line14: '1A', line15: '220.00', line16: '2C', line17: '' },
            Apr: { line14: '1A', line15: '220.00', line16: '2C', line17: '' },
            May: { line14: '1A', line15: '220.00', line16: '2C', line17: '' },
            Jun: { line14: '1A', line15: '220.00', line16: '2C', line17: '' },
            Jul: { line14: '1A', line15: '220.00', line16: '2C', line17: '' },
            Aug: { line14: '1A', line15: '220.00', line16: '2C', line17: '' },
            Sep: { line14: '1A', line15: '220.00', line16: '2C', line17: '' },
            Oct: { line14: '1A', line15: '220.00', line16: '2C', line17: '' },
            Nov: { line14: '1A', line15: '220.00', line16: '2C', line17: '' },
            Dec: { line14: '1A', line15: '220.00', line16: '2C', line17: '' },
        },
        hasErrors: false
    },
    {
        id: 'E002',
        name: 'Sarah Johnson',
        ssn: '***-**-5678',
        monthlyData: {
            Jan: { line14: '1H', line15: '', line16: '2D', line17: '' },
            Feb: { line14: '1H', line15: '', line16: '2D', line17: '' },
            Mar: { line14: '1A', line15: '180.00', line16: '2C', line17: '' },
            Apr: { line14: '1A', line15: '180.00', line16: '2C', line17: '' },
            May: { line14: '1A', line15: '180.00', line16: '2C', line17: '' },
            Jun: { line14: '1A', line15: '180.00', line16: '2C', line17: '' },
            Jul: { line14: '1A', line15: '180.00', line16: '2C', line17: '' },
            Aug: { line14: '1A', line15: '180.00', line16: '2C', line17: '' },
            Sep: { line14: '1A', line15: '180.00', line16: '2C', line17: '' },
            Oct: { line14: '1A', line15: '180.00', line16: '2C', line17: '' },
            Nov: { line14: '1A', line15: '180.00', line16: '2C', line17: '' },
            Dec: { line14: '1A', line15: '180.00', line16: '2C', line17: '' },
        },
        hasErrors: true
    },
];

export function CodeEditorGrid({
    employees = defaultEmployees,
    taxYear = 2025,
    onSave,
    className = ''
}: CodeEditorGridProps) {
    const [data, setData] = useState(employees);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLine, setSelectedLine] = useState<'line14' | 'line15' | 'line16' | 'line17'>('line14');
    const [editingCell, setEditingCell] = useState<{ empId: string; month: string } | null>(null);
    const [hasChanges, setHasChanges] = useState(false);

    const filteredData = data.filter(emp =>
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleCellChange = (empId: string, month: string, value: string) => {
        setData(prev =>
            prev.map(emp =>
                emp.id === empId
                    ? {
                        ...emp,
                        monthlyData: {
                            ...emp.monthlyData,
                            [month]: { ...emp.monthlyData[month], [selectedLine]: value }
                        }
                    }
                    : emp
            )
        );
        setHasChanges(true);
    };

    const handleSave = () => {
        onSave?.(data);
        setHasChanges(false);
    };

    const lineLabels = {
        line14: 'Line 14 (Offer)',
        line15: 'Line 15 (Share)',
        line16: 'Line 16 (Safe Harbor)',
        line17: 'Line 17 (ZIP)'
    };

    return (
        <div className={`glass-card ${className}`}>
            {/* Header */}
            <div className="p-4 border-b border-[var(--glass-border)]">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-synapse-violet)] to-[var(--color-synapse-cyan)] flex items-center justify-center">
                            <Edit3 className="w-5 h-5 text-black" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">1095-C Code Editor</h3>
                            <p className="text-xs text-[var(--color-steel)]">Tax Year {taxYear}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {hasChanges && (
                            <span className="text-xs text-[var(--color-warning)]">Unsaved changes</span>
                        )}
                        <button
                            onClick={handleSave}
                            disabled={!hasChanges}
                            className="btn-primary text-sm"
                        >
                            <Save className="w-4 h-4" />
                            Save Changes
                        </button>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-4">
                    {/* Search */}
                    <div className="relative flex-1 max-w-xs">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-steel)]" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search employees..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm text-white placeholder:text-[var(--color-steel)]"
                        />
                    </div>

                    {/* Line selector */}
                    <div className="flex gap-1">
                        {(['line14', 'line15', 'line16', 'line17'] as const).map((line) => (
                            <button
                                key={line}
                                onClick={() => setSelectedLine(line)}
                                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedLine === line
                                        ? 'bg-[var(--color-synapse-teal)] text-black'
                                        : 'bg-[var(--glass-bg)] text-[var(--color-steel)] hover:text-white'
                                    }`}
                            >
                                {line.replace('line', 'L')}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Grid */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-[var(--glass-border)]">
                            <th className="sticky left-0 bg-[var(--glass-bg)] p-3 text-left text-xs font-medium text-[var(--color-steel)] min-w-[180px]">
                                Employee
                            </th>
                            {months.map((month) => (
                                <th key={month} className="p-3 text-center text-xs font-medium text-[var(--color-steel)] min-w-[60px]">
                                    {month}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--glass-border)]">
                        {filteredData.map((emp) => (
                            <tr key={emp.id} className="hover:bg-[var(--glass-bg)]">
                                <td className="sticky left-0 bg-[var(--color-obsidian)] p-3">
                                    <div className="flex items-center gap-2">
                                        {emp.hasErrors && (
                                            <AlertTriangle className="w-4 h-4 text-[var(--color-warning)]" />
                                        )}
                                        <div>
                                            <p className="text-sm font-medium text-white">{emp.name}</p>
                                            <p className="text-xs text-[var(--color-steel)]">{emp.ssn}</p>
                                        </div>
                                    </div>
                                </td>
                                {months.map((month) => {
                                    const cellValue = emp.monthlyData[month]?.[selectedLine] || '';
                                    const isEditing = editingCell?.empId === emp.id && editingCell?.month === month;

                                    return (
                                        <td key={month} className="p-1">
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    value={cellValue}
                                                    onChange={(e) => handleCellChange(emp.id, month, e.target.value)}
                                                    onBlur={() => setEditingCell(null)}
                                                    onKeyDown={(e) => e.key === 'Enter' && setEditingCell(null)}
                                                    autoFocus
                                                    className="w-full px-2 py-1 rounded bg-[var(--glass-bg)] border border-[var(--color-synapse-teal)] text-sm text-white text-center"
                                                />
                                            ) : (
                                                <button
                                                    onClick={() => setEditingCell({ empId: emp.id, month })}
                                                    className="w-full px-2 py-1 rounded bg-[var(--glass-bg)] border border-transparent hover:border-[var(--glass-border)] text-sm text-white text-center transition-colors"
                                                >
                                                    {cellValue || '-'}
                                                </button>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[var(--glass-border)]">
                <p className="text-xs text-[var(--color-steel)]">
                    Editing: <span className="text-white">{lineLabels[selectedLine]}</span> •
                    Click any cell to edit • Press Enter or click outside to save
                </p>
            </div>
        </div>
    );
}

export default CodeEditorGrid;
