'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Building2,
    Users,
    Shield,
    Database,
    Globe,
    Settings,
    ChevronRight,
    Check,
    AlertTriangle,
    Crown
} from 'lucide-react';

interface Tenant {
    id: string;
    name: string;
    subdomain: string;
    plan: 'starter' | 'professional' | 'enterprise';
    users: number;
    employees: number;
    status: 'active' | 'suspended' | 'trial';
    features: string[];
    dataRegion: string;
    createdAt: string;
}

interface TenantConfigurationProps {
    tenants?: Tenant[];
    className?: string;
}

const defaultTenants: Tenant[] = [
    {
        id: 'tenant-001',
        name: 'Acme Corporation',
        subdomain: 'acme',
        plan: 'enterprise',
        users: 25,
        employees: 4521,
        status: 'active',
        features: ['sso', 'api', 'custom_branding', 'audit_log', 'dedicated_support'],
        dataRegion: 'us-east-1',
        createdAt: 'Oct 15, 2025'
    },
    {
        id: 'tenant-002',
        name: 'TechStart Inc',
        subdomain: 'techstart',
        plan: 'professional',
        users: 8,
        employees: 287,
        status: 'active',
        features: ['sso', 'api', 'audit_log'],
        dataRegion: 'us-west-2',
        createdAt: 'Jan 3, 2026'
    },
    {
        id: 'tenant-003',
        name: 'Demo Company',
        subdomain: 'demo',
        plan: 'starter',
        users: 2,
        employees: 50,
        status: 'trial',
        features: [],
        dataRegion: 'us-east-1',
        createdAt: 'Jan 20, 2026'
    }
];

const planConfig = {
    starter: { color: 'var(--color-steel)', label: 'Starter', icon: Building2 },
    professional: { color: 'var(--color-synapse-cyan)', label: 'Professional', icon: Shield },
    enterprise: { color: 'var(--color-synapse-gold)', label: 'Enterprise', icon: Crown }
};

const featureLabels: Record<string, string> = {
    sso: 'Single Sign-On',
    api: 'API Access',
    custom_branding: 'Custom Branding',
    audit_log: 'Audit Logging',
    dedicated_support: 'Dedicated Support'
};

export function TenantConfiguration({
    tenants = defaultTenants,
    className = ''
}: TenantConfigurationProps) {
    const [selectedTenant, setSelectedTenant] = useState<string | null>(null);

    const totalEmployees = tenants.reduce((sum, t) => sum + t.employees, 0);
    const totalUsers = tenants.reduce((sum, t) => sum + t.users, 0);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-6 ${className}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                    <h3 className="font-semibold text-white">Multi-Tenant Configuration</h3>
                </div>
                <button className="btn-primary text-sm">
                    <Building2 className="w-4 h-4" />
                    Add Tenant
                </button>
            </div>

            {/* Summary */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                <div className="p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]">
                    <p className="text-2xl font-bold text-white font-mono">{tenants.length}</p>
                    <p className="text-xs text-[var(--color-steel)]">Active Tenants</p>
                </div>
                <div className="p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]">
                    <p className="text-2xl font-bold text-[var(--color-synapse-teal)] font-mono">{totalEmployees.toLocaleString()}</p>
                    <p className="text-xs text-[var(--color-steel)]">Total Employees</p>
                </div>
                <div className="p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]">
                    <p className="text-2xl font-bold text-white font-mono">{totalUsers}</p>
                    <p className="text-xs text-[var(--color-steel)]">Platform Users</p>
                </div>
                <div className="p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]">
                    <p className="text-2xl font-bold text-[var(--color-synapse-gold)] font-mono">
                        {tenants.filter(t => t.plan === 'enterprise').length}
                    </p>
                    <p className="text-xs text-[var(--color-steel)]">Enterprise</p>
                </div>
            </div>

            {/* Tenant List */}
            <div className="space-y-3">
                {tenants.map((tenant, i) => {
                    const plan = planConfig[tenant.plan];
                    const PlanIcon = plan.icon;

                    return (
                        <motion.div
                            key={tenant.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)] hover:border-[var(--glass-border-hover)] cursor-pointer transition-colors"
                            onClick={() => setSelectedTenant(selectedTenant === tenant.id ? null : tenant.id)}
                        >
                            <div className="flex items-center gap-4">
                                {/* Plan Badge */}
                                <div
                                    className="w-10 h-10 rounded-lg flex items-center justify-center"
                                    style={{ backgroundColor: `${plan.color}20` }}
                                >
                                    <PlanIcon className="w-5 h-5" style={{ color: plan.color }} />
                                </div>

                                {/* Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-white">{tenant.name}</span>
                                        <span
                                            className="px-2 py-0.5 rounded text-xs"
                                            style={{ backgroundColor: `${plan.color}20`, color: plan.color }}
                                        >
                                            {plan.label}
                                        </span>
                                        {tenant.status === 'trial' && (
                                            <span className="px-2 py-0.5 rounded text-xs bg-[rgba(245,158,11,0.2)] text-[var(--color-warning)]">
                                                Trial
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-[var(--color-steel)]">
                                        {tenant.subdomain}.synapse.app • {tenant.employees.toLocaleString()} employees • {tenant.users} users
                                    </p>
                                </div>

                                {/* Data Region */}
                                <div className="flex items-center gap-2 text-xs text-[var(--color-steel)]">
                                    <Database className="w-4 h-4" />
                                    {tenant.dataRegion}
                                </div>

                                <ChevronRight className="w-5 h-5 text-[var(--color-steel)]" />
                            </div>

                            {/* Expanded Details */}
                            {selectedTenant === tenant.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    className="mt-4 pt-4 border-t border-[var(--glass-border)]"
                                >
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <span className="text-xs text-[var(--color-steel)]">Features</span>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {tenant.features.map(feature => (
                                                    <span
                                                        key={feature}
                                                        className="px-2 py-1 rounded text-xs bg-[var(--glass-bg)] text-[var(--color-silver)] flex items-center gap-1"
                                                    >
                                                        <Check className="w-3 h-3 text-[var(--color-success)]" />
                                                        {featureLabels[feature] || feature}
                                                    </span>
                                                ))}
                                                {tenant.features.length === 0 && (
                                                    <span className="text-xs text-[var(--color-steel)]">No premium features enabled</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-end justify-end gap-2">
                                            <button className="btn-secondary text-xs">
                                                <Settings className="w-3 h-3" />
                                                Configure
                                            </button>
                                            <button className="btn-secondary text-xs">
                                                <Users className="w-3 h-3" />
                                                Manage Users
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}

export default TenantConfiguration;
