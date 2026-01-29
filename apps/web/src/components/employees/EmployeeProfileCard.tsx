'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Building2,
    Calendar,
    Clock,
    Shield,
    FileText,
    TrendingUp,
    Edit2,
    CheckCircle2,
    AlertTriangle
} from 'lucide-react';

interface EmployeeProfileCardProps {
    className?: string;
    employee?: Employee;
}

interface Employee {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    department: string;
    position: string;
    hireDate: Date;
    address: {
        street: string;
        city: string;
        state: string;
        zip: string;
    };
    employmentType: 'full-time' | 'part-time' | 'variable';
    weeklyHours: number;
    fteStatus: boolean;
    coverageStatus: 'enrolled' | 'waived' | 'ineligible';
    complianceScore: number;
    offerCode?: string;
    safeHarborCode?: string;
}

const mockEmployee: Employee = {
    id: 'EMP-001',
    firstName: 'Michael',
    lastName: 'Chen',
    email: 'michael.chen@company.com',
    phone: '(555) 234-5678',
    department: 'Engineering',
    position: 'Senior Software Engineer',
    hireDate: new Date(2020, 2, 15),
    address: {
        street: '456 Oak Street, Apt 12',
        city: 'San Francisco',
        state: 'CA',
        zip: '94102'
    },
    employmentType: 'full-time',
    weeklyHours: 40,
    fteStatus: true,
    coverageStatus: 'enrolled',
    complianceScore: 100,
    offerCode: '1E',
    safeHarborCode: '2C'
};

export function EmployeeProfileCard({ className = '', employee = mockEmployee }: EmployeeProfileCardProps) {
    const [isEditing, setIsEditing] = useState(false);

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'enrolled': return { bg: 'rgba(34,197,94,0.2)', text: 'var(--color-success)' };
            case 'waived': return { bg: 'rgba(245,158,11,0.2)', text: 'var(--color-warning)' };
            case 'ineligible': return { bg: 'rgba(156,163,175,0.2)', text: 'var(--color-steel)' };
            default: return { bg: 'rgba(156,163,175,0.2)', text: 'var(--color-steel)' };
        }
    };

    const statusColors = getStatusColor(employee.coverageStatus);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card overflow-hidden ${className}`}
        >
            {/* Header */}
            <div className="relative p-6 border-b border-[var(--glass-border)]">
                <div className="absolute inset-0 bg-gradient-to-r from-[rgba(20,184,166,0.1)] to-[rgba(6,182,212,0.1)]" />
                <div className="relative flex items-start justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[var(--color-synapse-teal)] to-[var(--color-synapse-cyan)] flex items-center justify-center text-2xl font-bold text-black">
                            {employee.firstName[0]}{employee.lastName[0]}
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white">
                                {employee.firstName} {employee.lastName}
                            </h2>
                            <p className="text-[var(--color-steel)]">{employee.position}</p>
                            <p className="text-sm text-[var(--color-steel)]">{employee.department}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="px-3 py-1 rounded text-xs font-mono bg-[var(--glass-bg)] text-[var(--color-steel)]">
                            {employee.id}
                        </span>
                        <button
                            onClick={() => setIsEditing(!isEditing)}
                            className="p-2 rounded-lg hover:bg-[var(--glass-bg)] transition-colors"
                        >
                            <Edit2 className="w-4 h-4 text-[var(--color-steel)]" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="p-6 grid grid-cols-2 gap-6">
                {/* Contact Info */}
                <div>
                    <h3 className="text-sm font-medium text-[var(--color-steel)] mb-3">Contact Information</h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Mail className="w-4 h-4 text-[var(--color-synapse-cyan)]" />
                            <span className="text-sm text-white">{employee.email}</span>
                        </div>
                        {employee.phone && (
                            <div className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-[var(--color-synapse-cyan)]" />
                                <span className="text-sm text-white">{employee.phone}</span>
                            </div>
                        )}
                        <div className="flex items-start gap-3">
                            <MapPin className="w-4 h-4 text-[var(--color-synapse-cyan)] mt-0.5" />
                            <div className="text-sm text-white">
                                <p>{employee.address.street}</p>
                                <p>{employee.address.city}, {employee.address.state} {employee.address.zip}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Employment Info */}
                <div>
                    <h3 className="text-sm font-medium text-[var(--color-steel)] mb-3">Employment Details</h3>
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <Calendar className="w-4 h-4 text-[var(--color-synapse-gold)]" />
                            <span className="text-sm text-white">Hired {formatDate(employee.hireDate)}</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Clock className="w-4 h-4 text-[var(--color-synapse-gold)]" />
                            <span className="text-sm text-white">{employee.weeklyHours} hours/week ({employee.employmentType})</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <Building2 className="w-4 h-4 text-[var(--color-synapse-gold)]" />
                            <span className="text-sm text-white">{employee.department}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Compliance Status */}
            <div className="p-6 pt-0">
                <h3 className="text-sm font-medium text-[var(--color-steel)] mb-3">ACA Compliance Status</h3>
                <div className="grid grid-cols-4 gap-4">
                    <div className="p-3 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]">
                        <p className="text-xs text-[var(--color-steel)] mb-1">FTE Status</p>
                        <span className={`px-2 py-0.5 rounded text-xs ${employee.fteStatus
                                ? 'bg-[rgba(34,197,94,0.2)] text-[var(--color-success)]'
                                : 'bg-[rgba(156,163,175,0.2)] text-[var(--color-steel)]'
                            }`}>
                            {employee.fteStatus ? 'Full-Time' : 'Part-Time'}
                        </span>
                    </div>
                    <div className="p-3 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]">
                        <p className="text-xs text-[var(--color-steel)] mb-1">Coverage</p>
                        <span
                            className="px-2 py-0.5 rounded text-xs"
                            style={{ backgroundColor: statusColors.bg, color: statusColors.text }}
                        >
                            {employee.coverageStatus.charAt(0).toUpperCase() + employee.coverageStatus.slice(1)}
                        </span>
                    </div>
                    <div className="p-3 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]">
                        <p className="text-xs text-[var(--color-steel)] mb-1">Offer Code</p>
                        <span className="text-sm font-mono text-white">{employee.offerCode || '—'}</span>
                    </div>
                    <div className="p-3 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]">
                        <p className="text-xs text-[var(--color-steel)] mb-1">Safe Harbor</p>
                        <span className="text-sm font-mono text-white">{employee.safeHarborCode || '—'}</span>
                    </div>
                </div>
            </div>

            {/* Compliance Score */}
            <div className="p-6 pt-0">
                <div className="p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <Shield className="w-4 h-4 text-[var(--color-success)]" />
                            <span className="text-sm font-medium text-white">Compliance Score</span>
                        </div>
                        <span className="text-lg font-bold text-[var(--color-success)]">{employee.complianceScore}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-[var(--glass-bg)] overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${employee.complianceScore}%` }}
                            transition={{ duration: 1, ease: 'easeOut' }}
                            className="h-full bg-gradient-to-r from-[var(--color-success)] to-[var(--color-synapse-teal)]"
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default EmployeeProfileCard;
