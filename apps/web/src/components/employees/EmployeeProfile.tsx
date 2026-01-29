'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Mail,
    Phone,
    Calendar,
    Briefcase,
    Clock,
    Shield,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    ChevronRight,
    Edit2,
    History,
    FileText
} from 'lucide-react';

interface Employee {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    ssn: string; // masked
    dateOfBirth: string;
    hireDate: string;
    terminationDate?: string;
    department: string;
    jobTitle: string;
    employmentType: 'full_time' | 'part_time' | 'variable';
    hoursPerWeek: number;
    compensationType: 'hourly' | 'salary';
    compensation: number;
    coverageStatus: 'covered' | 'waived' | 'pending' | 'ineligible';
    acaStatus: 'full_time' | 'part_time' | 'variable_initial' | 'variable_standard';
    measurementPeriod?: { type: string; start: string; end: string };
    complianceScore: number;
    issues: string[];
}

interface EmployeeProfileProps {
    employee?: Employee;
    className?: string;
    onEdit?: () => void;
}

const defaultEmployee: Employee = {
    id: 'EMP-001',
    firstName: 'Sarah',
    lastName: 'Mitchell',
    email: 'sarah.mitchell@company.com',
    phone: '(555) 123-4567',
    ssn: 'XXX-XX-4521',
    dateOfBirth: 'Mar 15, 1988',
    hireDate: 'Jan 15, 2020',
    department: 'Engineering',
    jobTitle: 'Senior Software Engineer',
    employmentType: 'full_time',
    hoursPerWeek: 40,
    compensationType: 'salary',
    compensation: 125000,
    coverageStatus: 'covered',
    acaStatus: 'full_time',
    measurementPeriod: { type: 'annual', start: 'Oct 1, 2024', end: 'Sep 30, 2025' },
    complianceScore: 98,
    issues: []
};

const statusConfig = {
    covered: { color: 'var(--color-success)', label: 'Covered', icon: CheckCircle2 },
    waived: { color: 'var(--color-warning)', label: 'Waived', icon: AlertTriangle },
    pending: { color: 'var(--color-synapse-cyan)', label: 'Pending', icon: Clock },
    ineligible: { color: 'var(--color-steel)', label: 'Ineligible', icon: XCircle }
};

const acaStatusLabels = {
    full_time: 'Full-Time (FT)',
    part_time: 'Part-Time (PT)',
    variable_initial: 'Variable Hour - Initial',
    variable_standard: 'Variable Hour - Standard'
};

export function EmployeeProfile({
    employee = defaultEmployee,
    className = '',
    onEdit
}: EmployeeProfileProps) {
    const [activeTab, setActiveTab] = useState<'overview' | 'compliance' | 'history'>('overview');
    const status = statusConfig[employee.coverageStatus];
    const StatusIcon = status.icon;

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card overflow-hidden ${className}`}
        >
            {/* Header */}
            <div className="p-6 border-b border-[var(--glass-border)] bg-gradient-to-br from-[var(--glass-bg-light)] to-transparent">
                <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[var(--color-synapse-teal)] to-[var(--color-synapse-cyan)] flex items-center justify-center text-2xl font-bold text-black">
                        {employee.firstName[0]}{employee.lastName[0]}
                    </div>

                    {/* Info */}
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                            <h2 className="text-xl font-semibold text-white">
                                {employee.firstName} {employee.lastName}
                            </h2>
                            <span
                                className="px-2 py-0.5 rounded text-xs flex items-center gap-1"
                                style={{ backgroundColor: `${status.color}20`, color: status.color }}
                            >
                                <StatusIcon className="w-3 h-3" />
                                {status.label}
                            </span>
                        </div>
                        <p className="text-sm text-[var(--color-steel)]">{employee.jobTitle} • {employee.department}</p>
                        <p className="text-xs text-[var(--color-steel)] mt-1">ID: {employee.id}</p>
                    </div>

                    {/* Actions */}
                    <button onClick={onEdit} className="btn-secondary">
                        <Edit2 className="w-4 h-4" />
                        Edit
                    </button>
                </div>

                {/* Compliance Score */}
                <div className="mt-4 flex items-center gap-4">
                    <div className="flex-1 h-2 bg-[var(--glass-bg)] rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${employee.complianceScore}%` }}
                            transition={{ duration: 0.8 }}
                            className="h-full rounded-full"
                            style={{
                                backgroundColor: employee.complianceScore >= 90
                                    ? 'var(--color-success)'
                                    : employee.complianceScore >= 70
                                        ? 'var(--color-warning)'
                                        : 'var(--color-critical)'
                            }}
                        />
                    </div>
                    <span className="text-sm font-mono text-white">{employee.complianceScore}%</span>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-[var(--glass-border)]">
                {(['overview', 'compliance', 'history'] as const).map((tab) => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`flex-1 py-3 text-sm font-medium transition-colors ${activeTab === tab
                                ? 'text-[var(--color-synapse-teal)] border-b-2 border-[var(--color-synapse-teal)]'
                                : 'text-[var(--color-steel)] hover:text-white'
                            }`}
                    >
                        {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                ))}
            </div>

            {/* Content */}
            <div className="p-6">
                <AnimatePresence mode="wait">
                    {activeTab === 'overview' && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <InfoRow icon={Mail} label="Email" value={employee.email} />
                                <InfoRow icon={Phone} label="Phone" value={employee.phone || 'Not provided'} />
                                <InfoRow icon={Calendar} label="Date of Birth" value={employee.dateOfBirth} />
                                <InfoRow icon={Shield} label="SSN" value={employee.ssn} />
                                <InfoRow icon={Calendar} label="Hire Date" value={employee.hireDate} />
                                <InfoRow icon={Briefcase} label="Employment Type" value={employee.employmentType.replace('_', ' ')} />
                                <InfoRow icon={Clock} label="Hours/Week" value={`${employee.hoursPerWeek} hrs`} />
                                <InfoRow
                                    icon={Briefcase}
                                    label="Compensation"
                                    value={`${employee.compensationType === 'hourly' ? '$' + employee.compensation + '/hr' : '$' + employee.compensation.toLocaleString() + '/yr'}`}
                                />
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'compliance' && (
                        <motion.div
                            key="compliance"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-4"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]">
                                    <p className="text-xs text-[var(--color-steel)] mb-1">ACA Status</p>
                                    <p className="text-sm font-medium text-white">{acaStatusLabels[employee.acaStatus]}</p>
                                </div>
                                <div className="p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]">
                                    <p className="text-xs text-[var(--color-steel)] mb-1">Coverage Status</p>
                                    <p className="text-sm font-medium text-white">{status.label}</p>
                                </div>
                            </div>

                            {employee.measurementPeriod && (
                                <div className="p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]">
                                    <p className="text-xs text-[var(--color-steel)] mb-2">Measurement Period</p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-white">{employee.measurementPeriod.type}</span>
                                        <span className="text-xs text-[var(--color-steel)]">
                                            {employee.measurementPeriod.start} - {employee.measurementPeriod.end}
                                        </span>
                                    </div>
                                </div>
                            )}

                            {employee.issues.length > 0 && (
                                <div className="p-4 rounded-lg bg-[rgba(239,68,68,0.1)] border border-[rgba(239,68,68,0.3)]">
                                    <p className="text-xs text-[var(--color-critical)] mb-2 flex items-center gap-1">
                                        <AlertTriangle className="w-3 h-3" />
                                        Compliance Issues
                                    </p>
                                    <ul className="space-y-1">
                                        {employee.issues.map((issue, idx) => (
                                            <li key={idx} className="text-sm text-[var(--color-critical)]">• {issue}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </motion.div>
                    )}

                    {activeTab === 'history' && (
                        <motion.div
                            key="history"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="space-y-3"
                        >
                            <HistoryItem
                                date="Jan 28, 2026"
                                event="Coverage confirmed for 2026"
                                type="success"
                            />
                            <HistoryItem
                                date="Jan 15, 2026"
                                event="Annual enrollment completed"
                                type="info"
                            />
                            <HistoryItem
                                date="Oct 1, 2025"
                                event="Measurement period started"
                                type="info"
                            />
                            <HistoryItem
                                date="Jan 15, 2020"
                                event="Employee hired"
                                type="success"
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
    return (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--glass-bg-light)]">
            <Icon className="w-4 h-4 text-[var(--color-steel)]" />
            <div>
                <p className="text-xs text-[var(--color-steel)]">{label}</p>
                <p className="text-sm text-white">{value}</p>
            </div>
        </div>
    );
}

function HistoryItem({ date, event, type }: { date: string; event: string; type: 'success' | 'info' | 'warning' }) {
    return (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-[var(--glass-bg-light)]">
            <div className={`w-2 h-2 rounded-full ${type === 'success' ? 'bg-[var(--color-success)]' :
                    type === 'warning' ? 'bg-[var(--color-warning)]' :
                        'bg-[var(--color-synapse-cyan)]'
                }`} />
            <div className="flex-1">
                <p className="text-sm text-white">{event}</p>
                <p className="text-xs text-[var(--color-steel)]">{date}</p>
            </div>
        </div>
    );
}

export default EmployeeProfile;
