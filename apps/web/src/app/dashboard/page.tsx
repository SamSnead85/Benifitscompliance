'use client';

import { motion } from 'framer-motion';
import {
    Users,
    Building2,
    AlertTriangle,
    CheckCircle2,
    TrendingUp,
    TrendingDown,
    Calendar,
    FileCheck,
    ArrowRight,
    Clock,
    AlertCircle,
    ChevronRight
} from 'lucide-react';
import Link from 'next/link';

// Animation variants
const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const stagger = {
    visible: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

// Sample data
const portfolioStats = [
    {
        label: 'Total Clients',
        value: '24',
        change: '+3',
        trend: 'up',
        icon: Building2,
        color: 'var(--color-synapse-teal)'
    },
    {
        label: 'Employees Managed',
        value: '12,847',
        change: '+847',
        trend: 'up',
        icon: Users,
        color: 'var(--color-synapse-cyan)'
    },
    {
        label: 'Compliance Score',
        value: '94.2%',
        change: '+2.1%',
        trend: 'up',
        icon: CheckCircle2,
        color: 'var(--color-success)'
    },
    {
        label: 'Open Risks',
        value: '7',
        change: '-2',
        trend: 'down',
        icon: AlertTriangle,
        color: 'var(--color-warning)'
    },
];

const upcomingDeadlines = [
    { name: '1095-C Distribution', date: 'Jan 31, 2026', status: 'upcoming', daysLeft: 4 },
    { name: 'Q4 ACA Filing', date: 'Feb 28, 2026', status: 'safe', daysLeft: 32 },
    { name: '1094-C Submission', date: 'Mar 31, 2026', status: 'safe', daysLeft: 63 },
];

const recentClients = [
    { name: 'Apex Manufacturing', employees: 2340, status: 'compliant', lastSync: '2 hours ago' },
    { name: 'Horizon Healthcare', employees: 1820, status: 'at_risk', lastSync: '4 hours ago' },
    { name: 'Summit Logistics', employees: 890, status: 'compliant', lastSync: '6 hours ago' },
    { name: 'Coastal Energy', employees: 1560, status: 'pending_review', lastSync: '1 day ago' },
];

const riskAlerts = [
    {
        client: 'Horizon Healthcare',
        issue: '23 employees missing FTE determination',
        severity: 'high',
        action: 'Review Required'
    },
    {
        client: 'Coastal Energy',
        issue: 'Data sync failed - credentials expired',
        severity: 'medium',
        action: 'Reconnect HRIS'
    },
    {
        client: 'Metro Services',
        issue: 'Affordability threshold exceeded for 5 employees',
        severity: 'low',
        action: 'Verify Premiums'
    },
];

function StatusBadge({ status }: { status: string }) {
    const config = {
        compliant: { label: 'Compliant', className: 'badge--success' },
        at_risk: { label: 'At Risk', className: 'badge--warning' },
        non_compliant: { label: 'Non-Compliant', className: 'badge--critical' },
        pending_review: { label: 'Pending Review', className: 'badge--info' },
    }[status] || { label: status, className: 'badge--info' };

    return <span className={`badge ${config.className}`}>{config.label}</span>;
}

function SeverityBadge({ severity }: { severity: string }) {
    const config = {
        high: { label: 'High', className: 'badge--critical' },
        medium: { label: 'Medium', className: 'badge--warning' },
        low: { label: 'Low', className: 'badge--info' },
    }[severity] || { label: severity, className: 'badge--info' };

    return <span className={`badge ${config.className}`}>{config.label}</span>;
}

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Dashboard</h1>
                    <p className="text-[var(--color-steel)] mt-1">Overview of your compliance portfolio</p>
                </div>
                <Link href="/onboard" className="btn-primary">
                    Add Client
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>

            {/* Portfolio Stats */}
            <motion.div
                variants={stagger}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
                {portfolioStats.map((stat, i) => (
                    <motion.div
                        key={i}
                        variants={fadeInUp}
                        className="metric-card"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center"
                                style={{
                                    background: `rgba(${stat.color === 'var(--color-synapse-teal)' ? '6, 182, 212' : stat.color === 'var(--color-synapse-cyan)' ? '34, 211, 238' : stat.color === 'var(--color-success)' ? '16, 185, 129' : '245, 158, 11'}, 0.15)`
                                }}
                            >
                                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                            </div>
                            <div className={`metric-trend metric-trend--${stat.trend === 'up' ? 'up' : 'down'} flex items-center gap-1`}>
                                {stat.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                {stat.change}
                            </div>
                        </div>
                        <div className="metric-value">{stat.value}</div>
                        <div className="metric-label">{stat.label}</div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Main Content Grid */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Upcoming Deadlines */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="glass-card p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                            Upcoming Deadlines
                        </h2>
                    </div>
                    <div className="space-y-4">
                        {upcomingDeadlines.map((deadline, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between p-3 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]"
                            >
                                <div>
                                    <div className="text-sm font-medium text-white">{deadline.name}</div>
                                    <div className="text-xs text-[var(--color-steel)] mt-1">{deadline.date}</div>
                                </div>
                                <div className={`text-xs font-semibold ${deadline.daysLeft <= 7 ? 'text-[var(--color-warning)]' : 'text-[var(--color-steel)]'
                                    }`}>
                                    {deadline.daysLeft} days
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Recent Clients */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-6 lg:col-span-2"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                            Recent Clients
                        </h2>
                        <Link href="/clients" className="text-sm text-[var(--color-synapse-teal)] hover:underline flex items-center gap-1">
                            View All <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Client</th>
                                <th>Employees</th>
                                <th>Status</th>
                                <th>Last Sync</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentClients.map((client, i) => (
                                <tr key={i} className="cursor-pointer">
                                    <td className="font-medium">{client.name}</td>
                                    <td className="font-mono">{client.employees.toLocaleString()}</td>
                                    <td><StatusBadge status={client.status} /></td>
                                    <td className="text-[var(--color-steel)]">{client.lastSync}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>
            </div>

            {/* Risk Alerts */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-card p-6"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-[var(--color-warning)]" />
                        Risk Alerts
                    </h2>
                    <Link href="/compliance" className="text-sm text-[var(--color-synapse-teal)] hover:underline flex items-center gap-1">
                        Compliance Center <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="space-y-3">
                    {riskAlerts.map((alert, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)] hover:border-[var(--glass-border-hover)] transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <SeverityBadge severity={alert.severity} />
                                <div>
                                    <div className="text-sm font-medium text-white">{alert.client}</div>
                                    <div className="text-xs text-[var(--color-steel)] mt-1">{alert.issue}</div>
                                </div>
                            </div>
                            <button className="btn-secondary text-sm px-4 py-2">
                                {alert.action}
                            </button>
                        </div>
                    ))}
                </div>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="grid grid-cols-2 lg:grid-cols-4 gap-4"
            >
                {[
                    { label: 'New Client Onboarding', icon: Building2, href: '/onboard' },
                    { label: 'Run Compliance Check', icon: FileCheck, href: '/compliance' },
                    { label: 'View Data Refinery', icon: Clock, href: '/refinery' },
                    { label: 'Generate Reports', icon: FileCheck, href: '/reports' },
                ].map((action, i) => (
                    <Link
                        key={i}
                        href={action.href}
                        className="glass-card p-4 flex items-center gap-3 hover:border-[var(--color-synapse-teal)] group"
                    >
                        <action.icon className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                        <span className="text-sm text-[var(--color-silver)] group-hover:text-white transition-colors">
                            {action.label}
                        </span>
                    </Link>
                ))}
            </motion.div>
        </div>
    );
}
