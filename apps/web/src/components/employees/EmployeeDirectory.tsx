'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Search,
    Filter,
    Download,
    Upload,
    Plus,
    Users,
    CheckCircle2,
    AlertTriangle,
    Clock,
    XCircle,
    ChevronDown,
    MoreHorizontal,
    Eye,
    Edit2
} from 'lucide-react';

interface Employee {
    id: string;
    name: string;
    email: string;
    department: string;
    jobTitle: string;
    hireDate: string;
    status: 'active' | 'terminated' | 'leave';
    acaStatus: 'full_time' | 'part_time' | 'variable';
    coverageStatus: 'covered' | 'waived' | 'pending' | 'ineligible';
    hoursAvg: number;
    complianceScore: number;
}

interface EmployeeDirectoryProps {
    employees?: Employee[];
    className?: string;
    onViewEmployee?: (id: string) => void;
}

const defaultEmployees: Employee[] = [
    { id: 'EMP-001', name: 'Sarah Mitchell', email: 'sarah.m@company.com', department: 'Engineering', jobTitle: 'Senior Developer', hireDate: 'Jan 15, 2020', status: 'active', acaStatus: 'full_time', coverageStatus: 'covered', hoursAvg: 40, complianceScore: 98 },
    { id: 'EMP-002', name: 'Michael Chen', email: 'michael.c@company.com', department: 'Sales', jobTitle: 'Account Executive', hireDate: 'Mar 22, 2021', status: 'active', acaStatus: 'full_time', coverageStatus: 'covered', hoursAvg: 42, complianceScore: 100 },
    { id: 'EMP-003', name: 'Emily Davis', email: 'emily.d@company.com', department: 'Marketing', jobTitle: 'Marketing Manager', hireDate: 'Jun 10, 2022', status: 'active', acaStatus: 'full_time', coverageStatus: 'waived', hoursAvg: 38, complianceScore: 95 },
    { id: 'EMP-004', name: 'James Wilson', email: 'james.w@company.com', department: 'Operations', jobTitle: 'Operations Lead', hireDate: 'Sep 5, 2019', status: 'active', acaStatus: 'full_time', coverageStatus: 'covered', hoursAvg: 45, complianceScore: 92 },
    { id: 'EMP-005', name: 'Lisa Thompson', email: 'lisa.t@company.com', department: 'HR', jobTitle: 'HR Specialist', hireDate: 'Nov 15, 2023', status: 'active', acaStatus: 'variable', coverageStatus: 'pending', hoursAvg: 28, complianceScore: 85 },
    { id: 'EMP-006', name: 'David Brown', email: 'david.b@company.com', department: 'Finance', jobTitle: 'Financial Analyst', hireDate: 'Feb 1, 2024', status: 'active', acaStatus: 'full_time', coverageStatus: 'ineligible', hoursAvg: 40, complianceScore: 78 },
];

const coverageConfig = {
    covered: { color: 'var(--color-success)', icon: CheckCircle2 },
    waived: { color: 'var(--color-warning)', icon: AlertTriangle },
    pending: { color: 'var(--color-synapse-cyan)', icon: Clock },
    ineligible: { color: 'var(--color-steel)', icon: XCircle }
};

export function EmployeeDirectory({
    employees = defaultEmployees,
    className = '',
    onViewEmployee
}: EmployeeDirectoryProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterDepartment, setFilterDepartment] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [sortField, setSortField] = useState<'name' | 'hireDate' | 'complianceScore'>('name');
    const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

    const departments = [...new Set(employees.map(e => e.department))];

    const filteredEmployees = employees
        .filter(e => {
            if (searchQuery && !e.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
                !e.email.toLowerCase().includes(searchQuery.toLowerCase())) return false;
            if (filterDepartment !== 'all' && e.department !== filterDepartment) return false;
            if (filterStatus !== 'all' && e.coverageStatus !== filterStatus) return false;
            return true;
        })
        .sort((a, b) => {
            const dir = sortDir === 'asc' ? 1 : -1;
            if (sortField === 'name') return a.name.localeCompare(b.name) * dir;
            if (sortField === 'complianceScore') return (a.complianceScore - b.complianceScore) * dir;
            return 0;
        });

    const handleSort = (field: typeof sortField) => {
        if (sortField === field) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDir('asc');
        }
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
                    <Users className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                    <h3 className="font-semibold text-white">Employee Directory</h3>
                    <span className="px-2 py-0.5 rounded text-xs bg-[var(--glass-bg)] text-[var(--color-steel)]">
                        {employees.length} employees
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <button className="btn-secondary text-sm">
                        <Upload className="w-4 h-4" />
                        Import
                    </button>
                    <button className="btn-secondary text-sm">
                        <Download className="w-4 h-4" />
                        Export
                    </button>
                    <button className="btn-primary text-sm">
                        <Plus className="w-4 h-4" />
                        Add Employee
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex items-center gap-4 mb-4">
                <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-steel)]" />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm text-white placeholder:text-[var(--color-steel)] focus:border-[var(--color-synapse-teal)] focus:outline-none"
                    />
                </div>
                <select
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                    className="px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm text-white"
                >
                    <option value="all">All Departments</option>
                    {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                    ))}
                </select>
                <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm text-white"
                >
                    <option value="all">All Statuses</option>
                    <option value="covered">Covered</option>
                    <option value="waived">Waived</option>
                    <option value="pending">Pending</option>
                    <option value="ineligible">Ineligible</option>
                </select>
            </div>

            {/* Table */}
            <div className="border border-[var(--glass-border)] rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="bg-[var(--glass-bg-light)] border-b border-[var(--glass-border)]">
                                <th
                                    onClick={() => handleSort('name')}
                                    className="text-left px-4 py-3 text-xs font-medium text-[var(--color-steel)] cursor-pointer hover:text-white"
                                >
                                    Employee
                                    {sortField === 'name' && <ChevronDown className={`inline w-3 h-3 ml-1 ${sortDir === 'desc' ? 'rotate-180' : ''}`} />}
                                </th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-steel)]">Department</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-steel)]">ACA Status</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-steel)]">Coverage</th>
                                <th className="text-left px-4 py-3 text-xs font-medium text-[var(--color-steel)]">Avg Hours</th>
                                <th
                                    onClick={() => handleSort('complianceScore')}
                                    className="text-left px-4 py-3 text-xs font-medium text-[var(--color-steel)] cursor-pointer hover:text-white"
                                >
                                    Compliance
                                    {sortField === 'complianceScore' && <ChevronDown className={`inline w-3 h-3 ml-1 ${sortDir === 'desc' ? 'rotate-180' : ''}`} />}
                                </th>
                                <th className="text-right px-4 py-3 text-xs font-medium text-[var(--color-steel)]">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--glass-border)]">
                            {filteredEmployees.map((emp, i) => {
                                const coverage = coverageConfig[emp.coverageStatus];
                                const CoverageIcon = coverage.icon;

                                return (
                                    <motion.tr
                                        key={emp.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: i * 0.02 }}
                                        className="hover:bg-[var(--glass-bg-light)] transition-colors"
                                    >
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-[var(--glass-bg)] flex items-center justify-center text-sm font-medium text-[var(--color-silver)]">
                                                    {emp.name.split(' ').map(n => n[0]).join('')}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-white">{emp.name}</p>
                                                    <p className="text-xs text-[var(--color-steel)]">{emp.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-[var(--color-silver)]">{emp.department}</td>
                                        <td className="px-4 py-3">
                                            <span className={`px-2 py-0.5 rounded text-xs ${emp.acaStatus === 'full_time' ? 'bg-[rgba(34,197,94,0.2)] text-[var(--color-success)]' :
                                                    emp.acaStatus === 'part_time' ? 'bg-[var(--glass-bg)] text-[var(--color-steel)]' :
                                                        'bg-[rgba(245,158,11,0.2)] text-[var(--color-warning)]'
                                                }`}>
                                                {emp.acaStatus.replace('_', '-').toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className="px-2 py-0.5 rounded text-xs flex items-center gap-1 w-fit"
                                                style={{ backgroundColor: `${coverage.color}20`, color: coverage.color }}
                                            >
                                                <CoverageIcon className="w-3 h-3" />
                                                {emp.coverageStatus}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-[var(--color-silver)] font-mono">{emp.hoursAvg} hrs</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-2 bg-[var(--glass-bg)] rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full rounded-full"
                                                        style={{
                                                            width: `${emp.complianceScore}%`,
                                                            backgroundColor: emp.complianceScore >= 90 ? 'var(--color-success)' :
                                                                emp.complianceScore >= 70 ? 'var(--color-warning)' : 'var(--color-critical)'
                                                        }}
                                                    />
                                                </div>
                                                <span className="text-xs font-mono text-white">{emp.complianceScore}%</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => onViewEmployee?.(emp.id)}
                                                    className="p-1.5 rounded-lg hover:bg-[var(--glass-bg)] text-[var(--color-steel)] hover:text-white"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button className="p-1.5 rounded-lg hover:bg-[var(--glass-bg)] text-[var(--color-steel)] hover:text-white">
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {filteredEmployees.length === 0 && (
                <div className="p-8 text-center text-[var(--color-steel)]">
                    <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No employees found</p>
                </div>
            )}
        </motion.div>
    );
}

export default EmployeeDirectory;
