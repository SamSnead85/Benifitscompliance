'use client';

import { motion } from 'framer-motion';
import {
    Building2,
    Users,
    Shield,
    FileText,
    Calendar,
    MapPin,
    Phone,
    Mail,
    Globe,
    CheckCircle2
} from 'lucide-react';

interface OrganizationSummaryProps {
    className?: string;
}

interface Organization {
    name: string;
    ein: string;
    address: {
        street: string;
        city: string;
        state: string;
        zip: string;
    };
    contact: {
        phone: string;
        email: string;
        website: string;
    };
    stats: {
        totalEmployees: number;
        fullTimeEmployees: number;
        aleStatus: boolean;
        planYear: string;
        controlGroup: string;
    };
}

const org: Organization = {
    name: 'Acme Corporation',
    ein: '12-3456789',
    address: {
        street: '100 Innovation Drive, Suite 500',
        city: 'San Francisco',
        state: 'CA',
        zip: '94102',
    },
    contact: {
        phone: '(415) 555-0123',
        email: 'benefits@acmecorp.com',
        website: 'www.acmecorp.com',
    },
    stats: {
        totalEmployees: 4256,
        fullTimeEmployees: 3892,
        aleStatus: true,
        planYear: 'January - December',
        controlGroup: 'Acme Holdings LLC',
    },
};

export function OrganizationSummary({ className = '' }: OrganizationSummaryProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card overflow-hidden ${className}`}
        >
            {/* Header */}
            <div className="p-5 border-b border-[var(--glass-border)]">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[var(--color-synapse-teal)] to-[var(--color-synapse-cyan)] flex items-center justify-center">
                        <Building2 className="w-7 h-7 text-black" />
                    </div>
                    <div className="flex-1">
                        <h2 className="text-xl font-semibold text-white">{org.name}</h2>
                        <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm text-[var(--color-steel)]">EIN: {org.ein}</span>
                            {org.stats.aleStatus && (
                                <span className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-[rgba(20,184,166,0.1)] text-xs text-[var(--color-synapse-teal)]">
                                    <CheckCircle2 className="w-3 h-3" />
                                    ALE Status
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-4 border-b border-[var(--glass-border)]">
                <div className="p-4 border-r border-[var(--glass-border)]">
                    <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-[var(--color-synapse-cyan)]" />
                        <span className="text-xs text-[var(--color-steel)]">Total Employees</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{org.stats.totalEmployees.toLocaleString()}</p>
                </div>
                <div className="p-4 border-r border-[var(--glass-border)]">
                    <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-[var(--color-synapse-teal)]" />
                        <span className="text-xs text-[var(--color-steel)]">Full-Time</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{org.stats.fullTimeEmployees.toLocaleString()}</p>
                </div>
                <div className="p-4 border-r border-[var(--glass-border)]">
                    <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-[var(--color-synapse-gold)]" />
                        <span className="text-xs text-[var(--color-steel)]">Plan Year</span>
                    </div>
                    <p className="text-sm font-medium text-white mt-1">{org.stats.planYear}</p>
                </div>
                <div className="p-4">
                    <div className="flex items-center gap-2 mb-1">
                        <Shield className="w-4 h-4 text-[var(--color-success)]" />
                        <span className="text-xs text-[var(--color-steel)]">Control Group</span>
                    </div>
                    <p className="text-sm font-medium text-white mt-1">{org.stats.controlGroup}</p>
                </div>
            </div>

            {/* Contact Info */}
            <div className="p-5">
                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <p className="text-xs font-medium text-[var(--color-steel)] mb-3">Address</p>
                        <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-[var(--color-steel)] mt-0.5" />
                            <div>
                                <p className="text-sm text-white">{org.address.street}</p>
                                <p className="text-sm text-white">{org.address.city}, {org.address.state} {org.address.zip}</p>
                            </div>
                        </div>
                    </div>
                    <div>
                        <p className="text-xs font-medium text-[var(--color-steel)] mb-3">Contact</p>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <Phone className="w-4 h-4 text-[var(--color-steel)]" />
                                <span className="text-sm text-white">{org.contact.phone}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="w-4 h-4 text-[var(--color-steel)]" />
                                <span className="text-sm text-[var(--color-synapse-teal)]">{org.contact.email}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Globe className="w-4 h-4 text-[var(--color-steel)]" />
                                <span className="text-sm text-[var(--color-synapse-teal)]">{org.contact.website}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default OrganizationSummary;
