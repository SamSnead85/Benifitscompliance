'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Search,
    Filter,
    Download,
    ChevronRight,
    CheckCircle2,
    AlertCircle,
    Clock,
    MoreHorizontal
} from 'lucide-react';

interface Employee {
    id: string;
    name: string;
    department: string;
    hireDate: string;
    fteStatus: 'full-time' | 'part-time' | 'variable';
    complianceStatus: 'compliant' | 'review' | 'issue';
    hoursYTD: number;
    coverageStatus: 'enrolled' | 'waived' | 'pending';
}

interface EmployeeTableWidgetProps {
    className?: string;
    onViewEmployee?: (id: string) => void;
}

const mockEmployees: Employee[] = [
    { id: 'E001', name: 'Michael Chen', department: 'Engineering', hireDate: '2022-03-15', fteStatus: 'full-time', complianceStatus: 'compliant', hoursYTD: 1840, coverageStatus: 'enrolled' },
    { id: 'E002', name: 'Sarah Johnson', department: 'Marketing', hireDate: '2021-08-22', fteStatus: 'full-time', complianceStatus: 'compliant', hoursYTD: 1920, coverageStatus: 'enrolled' },
    { id: 'E003', name: 'David Williams', department: 'Sales', hireDate: '2023-01-10', fteStatus: 'variable', complianceStatus: 'review', hoursYTD: 1560, coverageStatus: 'pending' },
    { id: 'E004', name: 'Emily Davis', department: 'HR', hireDate: '2020-11-05', fteStatus: 'full-time', complianceStatus: 'compliant', hoursYTD: 1880, coverageStatus: 'enrolled' },
    { id: 'E005', name: 'James Wilson', department: 'Finance', hireDate: '2024-02-20', fteStatus: 'part-time', complianceStatus: 'issue', hoursYTD: 780, coverageStatus: 'waived' },
    { id: 'E006', name: 'Lisa Anderson', department: 'Engineering', hireDate: '2022-06-01', fteStatus: 'full-time', complianceStatus: 'compliant', hoursYTD: 1800, coverageStatus: 'enrolled' },
];

const fteColors = {
    'full-time': 'var(--color-success)',
    'part-time': 'var(--color-steel)',
    'variable': 'var(--color-warning)',
};

const complianceColors = {
    compliant: 'var(--color-success)',
    review: 'var(--color-warning)',
    issue: 'var(--color-critical)',
};

const coverageColors = {
    enrolled: 'var(--color-synapse-teal)',
    waived: 'var(--color-steel)',
    pending: 'var(--color-warning)',
};

export function EmployeeTableWidget({ className = '', onViewEmployee }: EmployeeTableWidgetProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredEmployees = mockEmployees.filter(emp =>
        emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        emp.department.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card overflow-hidden ${className}`}
        >
            {/* Header */}
            <div className="p-4 border-b border-[var(--glass-border)]">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[var(--color-synapse-cyan)] to-[var(--color-synapse-teal)] flex items-center justify-center">
                            <Users className="w-4 h-4 text-black" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Employee Overview</h3>
                            <p className="text-xs text-[var(--color-steel)]">{mockEmployees.length} employees</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="btn-secondary text-xs">
                            <Filter className="w-3 h-3" />
                            Filter
                        </button>
                        <button className="btn-secondary text-xs">
                            <Download className="w-3 h-3" />
                            Export
                        </button>
                    </div>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-steel)]" />
                    <input
                        type="text"
                        placeholder="Search employees..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-white placeholder:text-[var(--color-steel)] outline-none focus:border-[var(--color-synapse-teal)] transition-colors text-sm"
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-[var(--glass-border)]">
                            <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-steel)] uppercase">Employee</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-[var(--color-steel)] uppercase">Department</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-[var(--color-steel)] uppercase">FTE Status</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-[var(--color-steel)] uppercase">Hours YTD</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-[var(--color-steel)] uppercase">Coverage</th>
                            <th className="px-4 py-3 text-center text-xs font-medium text-[var(--color-steel)] uppercase">Compliance</th>
                            <th className="px-4 py-3 w-10"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.map((emp, i) => (
                            <motion.tr
                                key={emp.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.03 }}
                                onClick={() => onViewEmployee?.(emp.id)}
                                className="border-b border-[var(--glass-border)] hover:bg-[var(--glass-bg-light)] transition-colors cursor-pointer"
                            >
                                <td className="px-4 py-3">
                                    <div>
                                        <p className="text-sm font-medium text-white">{emp.name}</p>
                                        <p className="text-xs text-[var(--color-steel)]">{emp.id}</p>
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-sm text-[var(--color-steel)]">{emp.department}</td>
                                <td className="px-4 py-3 text-center">
                                    <span
                                        className="px-2 py-1 rounded-full text-xs capitalize"
                                        style={{
                                            backgroundColor: `${fteColors[emp.fteStatus]}20`,
                                            color: fteColors[emp.fteStatus]
                                        }}
                                    >
                                        {emp.fteStatus}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-center text-sm text-white font-mono">{emp.hoursYTD.toLocaleString()}</td>
                                <td className="px-4 py-3 text-center">
                                    <span
                                        className="px-2 py-1 rounded-full text-xs capitalize"
                                        style={{
                                            backgroundColor: `${coverageColors[emp.coverageStatus]}20`,
                                            color: coverageColors[emp.coverageStatus]
                                        }}
                                    >
                                        {emp.coverageStatus}
                                    </span>
                                </td>
                                <td className="px-4 py-3 text-center">
                                    {emp.complianceStatus === 'compliant' && <CheckCircle2 className="w-4 h-4 mx-auto text-[var(--color-success)]" />}
                                    {emp.complianceStatus === 'review' && <Clock className="w-4 h-4 mx-auto text-[var(--color-warning)]" />}
                                    {emp.complianceStatus === 'issue' && <AlertCircle className="w-4 h-4 mx-auto text-[var(--color-critical)]" />}
                                </td>
                                <td className="px-4 py-3">
                                    <button className="p-1 rounded hover:bg-[var(--glass-bg)]">
                                        <MoreHorizontal className="w-4 h-4 text-[var(--color-steel)]" />
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-[var(--glass-border)] flex items-center justify-between">
                <p className="text-xs text-[var(--color-steel)]">Showing {filteredEmployees.length} of {mockEmployees.length}</p>
                <button className="text-xs text-[var(--color-synapse-teal)] hover:underline flex items-center gap-1">
                    View All Employees <ChevronRight className="w-3 h-3" />
                </button>
            </div>
        </motion.div>
    );
}

export default EmployeeTableWidget;
