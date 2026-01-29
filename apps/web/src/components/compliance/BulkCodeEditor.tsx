'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Edit2,
    Users,
    CheckCircle2,
    AlertTriangle,
    Search,
    Filter,
    Save,
    X,
    ArrowUpDown
} from 'lucide-react';

interface Employee {
    id: string;
    name: string;
    department: string;
    offerCode: string;
    safeHarbor: string;
    selected: boolean;
}

interface BulkCodeEditorProps {
    className?: string;
    onSave?: (changes: { employeeIds: string[]; offerCode?: string; safeHarbor?: string }) => void;
}

const offerCodes = [
    { code: '1A', label: 'Qualifying Offer' },
    { code: '1B', label: 'MEC + MV (Employee Only)' },
    { code: '1C', label: 'MEC + MV (Employee + Dependents)' },
    { code: '1D', label: 'MEC + MV (Employee + Spouse)' },
    { code: '1E', label: 'MEC + MV (Employee + Spouse + Dependents)' },
    { code: '1F', label: 'MEC (No MV)' },
    { code: '1H', label: 'No Offer of Coverage' },
];

const safeHarborCodes = [
    { code: '2C', label: 'Employee Enrolled' },
    { code: '2F', label: 'W-2 Safe Harbor' },
    { code: '2G', label: 'FPL Safe Harbor' },
    { code: '2H', label: 'Rate of Pay Safe Harbor' },
];

const mockEmployees: Employee[] = [
    { id: 'EMP-001', name: 'Michael Chen', department: 'Engineering', offerCode: '1E', safeHarbor: '2C', selected: false },
    { id: 'EMP-002', name: 'Sarah Johnson', department: 'Marketing', offerCode: '1E', safeHarbor: '2F', selected: false },
    { id: 'EMP-003', name: 'David Kim', department: 'Sales', offerCode: '1B', safeHarbor: '2H', selected: false },
    { id: 'EMP-004', name: 'Emily Davis', department: 'HR', offerCode: '1E', safeHarbor: '2C', selected: false },
    { id: 'EMP-005', name: 'James Wilson', department: 'Finance', offerCode: '1E', safeHarbor: '2F', selected: false },
    { id: 'EMP-006', name: 'Lisa Thompson', department: 'Operations', offerCode: '1C', safeHarbor: '2G', selected: false },
    { id: 'EMP-007', name: 'Robert Brown', department: 'Engineering', offerCode: '1E', safeHarbor: '2C', selected: false },
    { id: 'EMP-008', name: 'Jennifer Martinez', department: 'Sales', offerCode: '1H', safeHarbor: '', selected: false },
];

export function BulkCodeEditor({ className = '', onSave }: BulkCodeEditorProps) {
    const [employees, setEmployees] = useState(mockEmployees);
    const [searchQuery, setSearchQuery] = useState('');
    const [departmentFilter, setDepartmentFilter] = useState('all');
    const [newOfferCode, setNewOfferCode] = useState('');
    const [newSafeHarbor, setNewSafeHarbor] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    const selectedCount = employees.filter(e => e.selected).length;
    const departments = ['all', ...new Set(mockEmployees.map(e => e.department))];

    const filteredEmployees = employees.filter(e => {
        if (searchQuery && !e.name.toLowerCase().includes(searchQuery.toLowerCase()) && !e.id.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }
        if (departmentFilter !== 'all' && e.department !== departmentFilter) {
            return false;
        }
        return true;
    });

    const toggleSelect = (id: string) => {
        setEmployees(prev => prev.map(e =>
            e.id === id ? { ...e, selected: !e.selected } : e
        ));
    };

    const toggleAll = () => {
        const allSelected = filteredEmployees.every(e => e.selected);
        setEmployees(prev => prev.map(e =>
            filteredEmployees.some(fe => fe.id === e.id)
                ? { ...e, selected: !allSelected }
                : e
        ));
    };

    const handleSave = async () => {
        setIsSaving(true);
        await new Promise(r => setTimeout(r, 1500));

        setEmployees(prev => prev.map(e => {
            if (!e.selected) return e;
            return {
                ...e,
                offerCode: newOfferCode || e.offerCode,
                safeHarbor: newSafeHarbor || e.safeHarbor,
                selected: false
            };
        }));

        setNewOfferCode('');
        setNewSafeHarbor('');
        setIsSaving(false);
    };

    const clearSelection = () => {
        setEmployees(prev => prev.map(e => ({ ...e, selected: false })));
        setNewOfferCode('');
        setNewSafeHarbor('');
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card overflow-hidden ${className}`}
        >
            {/* Header */}
            <div className="p-6 border-b border-[var(--glass-border)]">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-synapse-cyan)] to-[var(--color-synapse-teal)] flex items-center justify-center">
                            <Edit2 className="w-5 h-5 text-black" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white">Bulk Code Editor</h2>
                            <p className="text-sm text-[var(--color-steel)]">Update offer and safe harbor codes for multiple employees</p>
                        </div>
                    </div>
                    {selectedCount > 0 && (
                        <span className="px-3 py-1 rounded-full text-sm bg-[var(--color-synapse-teal)] text-black">
                            {selectedCount} selected
                        </span>
                    )}
                </div>

                {/* Filters */}
                <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-steel)]" />
                        <input
                            type="text"
                            placeholder="Search employees..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm text-white placeholder:text-[var(--color-steel)] focus:border-[var(--color-synapse-teal)] focus:outline-none"
                        />
                    </div>
                    <select
                        value={departmentFilter}
                        onChange={(e) => setDepartmentFilter(e.target.value)}
                        className="px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm text-white"
                    >
                        {departments.map(dept => (
                            <option key={dept} value={dept}>
                                {dept === 'all' ? 'All Departments' : dept}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Bulk Edit Panel */}
            {selectedCount > 0 && (
                <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="p-4 bg-[rgba(6,182,212,0.1)] border-b border-[rgba(6,182,212,0.3)]"
                >
                    <div className="flex items-center gap-4">
                        <div className="flex-1">
                            <label className="block text-xs text-[var(--color-steel)] mb-1">New Offer Code (Line 14)</label>
                            <select
                                value={newOfferCode}
                                onChange={(e) => setNewOfferCode(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm text-white"
                            >
                                <option value="">No change</option>
                                {offerCodes.map(code => (
                                    <option key={code.code} value={code.code}>{code.code} - {code.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex-1">
                            <label className="block text-xs text-[var(--color-steel)] mb-1">New Safe Harbor (Line 16)</label>
                            <select
                                value={newSafeHarbor}
                                onChange={(e) => setNewSafeHarbor(e.target.value)}
                                className="w-full px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm text-white"
                            >
                                <option value="">No change</option>
                                {safeHarborCodes.map(code => (
                                    <option key={code.code} value={code.code}>{code.code} - {code.label}</option>
                                ))}
                            </select>
                        </div>
                        <div className="flex items-end gap-2">
                            <button onClick={clearSelection} className="btn-secondary">
                                <X className="w-4 h-4" />
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                disabled={(!newOfferCode && !newSafeHarbor) || isSaving}
                                className="btn-primary disabled:opacity-50"
                            >
                                {isSaving ? (
                                    <>Saving...</>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Apply to {selectedCount}
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Employee Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-[var(--glass-bg-light)] border-b border-[var(--glass-border)]">
                            <th className="text-left px-4 py-3 w-10">
                                <input
                                    type="checkbox"
                                    checked={filteredEmployees.length > 0 && filteredEmployees.every(e => e.selected)}
                                    onChange={toggleAll}
                                    className="w-4 h-4 rounded border-[var(--glass-border)]"
                                />
                            </th>
                            <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-steel)]">Employee</th>
                            <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-steel)]">Department</th>
                            <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-steel)]">Offer Code</th>
                            <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-steel)]">Safe Harbor</th>
                            <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-steel)]">Status</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--glass-border)]">
                        {filteredEmployees.map((employee, i) => {
                            const hasIssue = employee.offerCode === '1H' || !employee.safeHarbor;
                            return (
                                <motion.tr
                                    key={employee.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.02 }}
                                    className={`hover:bg-[var(--glass-bg-light)] transition-colors ${employee.selected ? 'bg-[rgba(6,182,212,0.05)]' : ''
                                        }`}
                                >
                                    <td className="px-4 py-3">
                                        <input
                                            type="checkbox"
                                            checked={employee.selected}
                                            onChange={() => toggleSelect(employee.id)}
                                            className="w-4 h-4 rounded border-[var(--glass-border)]"
                                        />
                                    </td>
                                    <td className="px-4 py-3">
                                        <p className="text-sm text-white">{employee.name}</p>
                                        <p className="text-xs text-[var(--color-steel)] font-mono">{employee.id}</p>
                                    </td>
                                    <td className="px-4 py-3 text-sm text-[var(--color-silver)]">{employee.department}</td>
                                    <td className="px-4 py-3">
                                        <span className="px-2 py-1 rounded text-xs font-mono bg-[var(--glass-bg)] text-[var(--color-synapse-cyan)]">
                                            {employee.offerCode}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`px-2 py-1 rounded text-xs font-mono ${employee.safeHarbor
                                                ? 'bg-[var(--glass-bg)] text-[var(--color-synapse-teal)]'
                                                : 'bg-[rgba(239,68,68,0.2)] text-[var(--color-critical)]'
                                            }`}>
                                            {employee.safeHarbor || 'None'}
                                        </span>
                                    </td>
                                    <td className="px-4 py-3">
                                        {hasIssue ? (
                                            <span className="px-2 py-1 rounded text-xs bg-[rgba(239,68,68,0.2)] text-[var(--color-critical)] flex items-center gap-1 w-fit">
                                                <AlertTriangle className="w-3 h-3" />
                                                Review
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 rounded text-xs bg-[rgba(34,197,94,0.2)] text-[var(--color-success)] flex items-center gap-1 w-fit">
                                                <CheckCircle2 className="w-3 h-3" />
                                                Valid
                                            </span>
                                        )}
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {filteredEmployees.length === 0 && (
                <div className="p-8 text-center">
                    <Users className="w-8 h-8 mx-auto mb-3 text-[var(--color-steel)] opacity-50" />
                    <p className="text-[var(--color-steel)]">No employees match your filters</p>
                </div>
            )}
        </motion.div>
    );
}

export default BulkCodeEditor;
