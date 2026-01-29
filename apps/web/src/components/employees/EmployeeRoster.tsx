'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    Search,
    Filter,
    Download,
    ChevronDown,
    ChevronRight,
    CheckCircle2,
    AlertTriangle,
    Clock,
    MoreVertical,
    UserPlus,
    FileText,
    Mail
} from 'lucide-react';

interface Employee {
    id: string;
    name: string;
    email: string;
    department: string;
    position: string;
    employmentType: 'full-time' | 'part-time' | 'variable';
    hireDate: string;
    status: 'active' | 'terminated' | 'on-leave';
    complianceStatus: 'compliant' | 'at-risk' | 'non-compliant';
    coverageStatus: 'enrolled' | 'waived' | 'pending' | 'ineligible';
    averageHours: number;
}

interface EmployeeRosterProps {
    employees?: Employee[];
    onEmployeeSelect?: (employee: Employee) => void;
    onBulkAction?: (action: string, ids: string[]) => void;
    className?: string;
}

const defaultEmployees: Employee[] = [
    {
        id: 'E001',
        name: 'John Smith',
        email: 'john.smith@company.com',
        department: 'Engineering',
        position: 'Senior Developer',
        employmentType: 'full-time',
        hireDate: '2022-03-15',
        status: 'active',
        complianceStatus: 'compliant',
        coverageStatus: 'enrolled',
        averageHours: 42
    },
    {
        id: 'E002',
        name: 'Sarah Johnson',
        email: 'sarah.j@company.com',
        department: 'Marketing',
        position: 'Marketing Manager',
        employmentType: 'full-time',
        hireDate: '2021-06-01',
        status: 'active',
        complianceStatus: 'compliant',
        coverageStatus: 'enrolled',
        averageHours: 40
    },
    {
        id: 'E003',
        name: 'Mike Wilson',
        email: 'mike.w@company.com',
        department: 'Sales',
        position: 'Sales Rep',
        employmentType: 'variable',
        hireDate: '2023-01-10',
        status: 'active',
        complianceStatus: 'at-risk',
        coverageStatus: 'pending',
        averageHours: 32
    },
    {
        id: 'E004',
        name: 'Emily Chen',
        email: 'emily.c@company.com',
        department: 'HR',
        position: 'HR Specialist',
        employmentType: 'full-time',
        hireDate: '2020-09-20',
        status: 'on-leave',
        complianceStatus: 'compliant',
        coverageStatus: 'enrolled',
        averageHours: 40
    },
    {
        id: 'E005',
        name: 'David Brown',
        email: 'david.b@company.com',
        department: 'Finance',
        position: 'Accountant',
        employmentType: 'part-time',
        hireDate: '2024-02-01',
        status: 'active',
        complianceStatus: 'non-compliant',
        coverageStatus: 'ineligible',
        averageHours: 22
    },
];

const statusColors = {
    active: 'var(--color-success)',
    terminated: 'var(--color-critical)',
    'on-leave': 'var(--color-warning)',
};

const complianceColors = {
    compliant: 'var(--color-success)',
    'at-risk': 'var(--color-warning)',
    'non-compliant': 'var(--color-critical)',
};

const coverageColors = {
    enrolled: 'var(--color-success)',
    waived: 'var(--color-steel)',
    pending: 'var(--color-warning)',
    ineligible: 'var(--color-steel)',
};

export function EmployeeRoster({
    employees = defaultEmployees,
    onEmployeeSelect,
    onBulkAction,
    className = ''
}: EmployeeRosterProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedIds, setSelectedIds] = useState<string[]>([]);
    const [sortField, setSortField] = useState<keyof Employee>('name');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
    const [filterDept, setFilterDept] = useState<string>('all');

    const departments = ['all', ...new Set(employees.map(e => e.department))];

    const filteredEmployees = employees
        .filter(e =>
            (filterDept === 'all' || e.department === filterDept) &&
            (e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                e.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                e.id.toLowerCase().includes(searchQuery.toLowerCase()))
        )
        .sort((a, b) => {
            const aVal = a[sortField];
            const bVal = b[sortField];
            const cmp = typeof aVal === 'string' ? aVal.localeCompare(bVal as string) : (aVal as number) - (bVal as number);
            return sortDir === 'asc' ? cmp : -cmp;
        });

    const toggleSelect = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
        );
    };

    const toggleSelectAll = () => {
        if (selectedIds.length === filteredEmployees.length) {
            setSelectedIds([]);
        } else {
            setSelectedIds(filteredEmployees.map(e => e.id));
        }
    };

    return (
        <div className={`glass-card ${className}`}>
            {/* Header */}
            <div className="p-4 border-b border-[var(--glass-border)]">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-synapse-cyan)] to-[var(--color-synapse-teal)] flex items-center justify-center">
                            <Users className="w-5 h-5 text-black" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Employee Roster</h3>
                            <p className="text-xs text-[var(--color-steel)]">{employees.length} employees</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {selectedIds.length > 0 && (
                            <>
                                <span className="text-xs text-[var(--color-steel)]">{selectedIds.length} selected</span>
                                <button onClick={() => onBulkAction?.('export', selectedIds)} className="btn-secondary text-xs">
                                    <Download className="w-4 h-4" />
                                    Export
                                </button>
                                <button onClick={() => onBulkAction?.('email', selectedIds)} className="btn-secondary text-xs">
                                    <Mail className="w-4 h-4" />
                                    Email
                                </button>
                            </>
                        )}
                        <button className="btn-primary text-sm">
                            <UserPlus className="w-4 h-4" />
                            Add Employee
                        </button>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center gap-3">
                    <div className="relative flex-1 max-w-sm">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-steel)]" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search employees..."
                            className="w-full pl-10 pr-4 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm text-white placeholder:text-[var(--color-steel)]"
                        />
                    </div>
                    <select
                        value={filterDept}
                        onChange={(e) => setFilterDept(e.target.value)}
                        className="px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm text-white"
                    >
                        {departments.map(dept => (
                            <option key={dept} value={dept}>{dept === 'all' ? 'All Departments' : dept}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="border-b border-[var(--glass-border)]">
                            <th className="p-3 text-left">
                                <input
                                    type="checkbox"
                                    checked={selectedIds.length === filteredEmployees.length && filteredEmployees.length > 0}
                                    onChange={toggleSelectAll}
                                    className="rounded border-[var(--glass-border)]"
                                />
                            </th>
                            <th className="p-3 text-left text-xs font-medium text-[var(--color-steel)]">Employee</th>
                            <th className="p-3 text-left text-xs font-medium text-[var(--color-steel)]">Department</th>
                            <th className="p-3 text-left text-xs font-medium text-[var(--color-steel)]">Type</th>
                            <th className="p-3 text-left text-xs font-medium text-[var(--color-steel)]">Hours</th>
                            <th className="p-3 text-left text-xs font-medium text-[var(--color-steel)]">Status</th>
                            <th className="p-3 text-left text-xs font-medium text-[var(--color-steel)]">Compliance</th>
                            <th className="p-3 text-left text-xs font-medium text-[var(--color-steel)]">Coverage</th>
                            <th className="p-3"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--glass-border)]">
                        {filteredEmployees.map((emp, i) => (
                            <motion.tr
                                key={emp.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.02 }}
                                onClick={() => onEmployeeSelect?.(emp)}
                                className="hover:bg-[var(--glass-bg)] cursor-pointer"
                            >
                                <td className="p-3" onClick={(e) => e.stopPropagation()}>
                                    <input
                                        type="checkbox"
                                        checked={selectedIds.includes(emp.id)}
                                        onChange={() => toggleSelect(emp.id)}
                                        className="rounded border-[var(--glass-border)]"
                                    />
                                </td>
                                <td className="p-3">
                                    <div>
                                        <p className="font-medium text-white">{emp.name}</p>
                                        <p className="text-xs text-[var(--color-steel)]">{emp.email}</p>
                                    </div>
                                </td>
                                <td className="p-3 text-sm text-white">{emp.department}</td>
                                <td className="p-3">
                                    <span className="px-2 py-0.5 rounded text-xs bg-[var(--glass-bg)] text-[var(--color-steel)] capitalize">
                                        {emp.employmentType}
                                    </span>
                                </td>
                                <td className="p-3 text-sm text-white">{emp.averageHours}h</td>
                                <td className="p-3">
                                    <span
                                        className="px-2 py-0.5 rounded text-xs capitalize"
                                        style={{
                                            backgroundColor: `${statusColors[emp.status]}20`,
                                            color: statusColors[emp.status]
                                        }}
                                    >
                                        {emp.status}
                                    </span>
                                </td>
                                <td className="p-3">
                                    <span
                                        className="px-2 py-0.5 rounded text-xs capitalize"
                                        style={{
                                            backgroundColor: `${complianceColors[emp.complianceStatus]}20`,
                                            color: complianceColors[emp.complianceStatus]
                                        }}
                                    >
                                        {emp.complianceStatus}
                                    </span>
                                </td>
                                <td className="p-3">
                                    <span
                                        className="px-2 py-0.5 rounded text-xs capitalize"
                                        style={{
                                            backgroundColor: `${coverageColors[emp.coverageStatus]}20`,
                                            color: coverageColors[emp.coverageStatus]
                                        }}
                                    >
                                        {emp.coverageStatus}
                                    </span>
                                </td>
                                <td className="p-3">
                                    <button className="p-1 rounded hover:bg-[var(--glass-bg-light)]">
                                        <MoreVertical className="w-4 h-4 text-[var(--color-steel)]" />
                                    </button>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default EmployeeRoster;
