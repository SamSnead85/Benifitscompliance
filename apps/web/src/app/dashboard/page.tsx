'use client';

import { motion } from 'framer-motion';
import {
    TrendingUp,
    TrendingDown,
    Users,
    FileCheck,
    AlertTriangle,
    Clock,
    Building2,
    ArrowRight,
    Activity,
    Shield,
    DollarSign,
    Calendar
} from 'lucide-react';
import Link from 'next/link';

const stats = [
    {
        label: 'Total Clients',
        value: '247',
        change: '+12',
        trend: 'up',
        icon: Building2,
    },
    {
        label: 'Active Employees',
        value: '18,432',
        change: '+3.2%',
        trend: 'up',
        icon: Users,
    },
    {
        label: 'Compliance Score',
        value: '98.7%',
        change: '+0.8%',
        trend: 'up',
        icon: Shield,
    },
    {
        label: 'Pending Actions',
        value: '23',
        change: '-5',
        trend: 'down',
        icon: Clock,
    },
];

const upcomingDeadlines = [
    { name: 'Q4 1095-C Filing', date: 'Mar 31, 2026', status: 'on-track', daysLeft: 61 },
    { name: 'Annual 1094-C Summary', date: 'Feb 28, 2026', status: 'attention', daysLeft: 30 },
    { name: 'Safe Harbor Refresh', date: 'Jan 15, 2026', status: 'complete', daysLeft: 0 },
];

const recentClients = [
    { name: 'Acme Corporation', employees: 1250, status: 'compliant', lastSync: '2 hours ago' },
    { name: 'TechStart Inc.', employees: 342, status: 'review', lastSync: '5 hours ago' },
    { name: 'Global Services LLC', employees: 890, status: 'compliant', lastSync: '1 day ago' },
];

const riskAlerts = [
    { type: 'warning', title: 'Coverage Gap Detected', description: '3 employees missing coverage for January', client: 'TechStart Inc.' },
    { type: 'info', title: 'Rate Update Available', description: '2026 affordability thresholds published', client: 'All Clients' },
];

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

function StatusBadge({ status }: { status: string }) {
    const configs: Record<string, { label: string; className: string }> = {
        'compliant': { label: 'Compliant', className: 'badge badge--success' },
        'on-track': { label: 'On Track', className: 'badge badge--success' },
        'review': { label: 'Review', className: 'badge badge--warning' },
        'attention': { label: 'Attention', className: 'badge badge--warning' },
        'complete': { label: 'Complete', className: 'badge badge--info' },
    };
    const config = configs[status] || { label: status, className: 'badge' };
    return <span className={config.className}>{config.label}</span>;
}

export default function DashboardPage() {
    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>Dashboard</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Welcome back. Here&apos;s your compliance overview.</p>
                </div>
                <Link
                    href="/clients/new"
                    className="btn-primary"
                >
                    <Building2 className="w-4 h-4" />
                    Add Client
                </Link>
            </div>

            {/* Stats Grid */}
            <motion.div
                variants={stagger}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
            >
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        variants={fadeInUp}
                        className="metric-card"
                    >
                        <div className="flex items-start justify-between mb-3">
                            <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center"
                                style={{ background: 'var(--color-info-muted)' }}
                            >
                                <stat.icon className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                            </div>
                            <span className={`metric-trend ${stat.trend === 'up' ? 'metric-trend--up' : 'metric-trend--down'}`}>
                                {stat.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                {stat.change}
                            </span>
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
                    className="glass-card p-6 lg:col-span-2"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                            <Calendar className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                            Upcoming Deadlines
                        </h2>
                        <Link href="/calendar" className="text-sm font-medium flex items-center gap-1" style={{ color: 'var(--accent-primary)' }}>
                            View All <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {upcomingDeadlines.map((deadline, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between p-4 rounded-lg transition-colors"
                                style={{ background: 'var(--hover-overlay)' }}
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-10 h-10 rounded-lg flex items-center justify-center"
                                        style={{ background: 'var(--color-warning-muted)' }}
                                    >
                                        <FileCheck className="w-5 h-5" style={{ color: 'var(--color-warning)' }} />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{deadline.name}</div>
                                        <div className="text-xs" style={{ color: 'var(--text-muted)' }}>Due: {deadline.date}</div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {deadline.daysLeft > 0 && (
                                        <span className="text-sm font-mono" style={{ color: 'var(--text-dim)' }}>
                                            {deadline.daysLeft}d left
                                        </span>
                                    )}
                                    <StatusBadge status={deadline.status} />
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* Risk Alerts */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="glass-card p-6"
                >
                    <div className="flex items-center gap-2 mb-6">
                        <AlertTriangle className="w-5 h-5" style={{ color: 'var(--color-warning)' }} />
                        <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>Risk Alerts</h2>
                    </div>
                    <div className="space-y-3">
                        {riskAlerts.map((alert, i) => (
                            <div
                                key={i}
                                className="p-4 rounded-lg border transition-colors"
                                style={{
                                    background: alert.type === 'warning' ? 'var(--color-warning-muted)' : 'var(--color-info-muted)',
                                    borderColor: 'var(--card-border)'
                                }}
                            >
                                <div className="text-sm font-medium mb-1" style={{ color: 'var(--text-primary)' }}>{alert.title}</div>
                                <div className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>{alert.description}</div>
                                <div className="text-xs font-medium" style={{ color: 'var(--accent-primary)' }}>{alert.client}</div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>

            {/* Recent Clients */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-card p-6"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                        <Activity className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                        Recent Clients
                    </h2>
                    <Link href="/clients" className="text-sm font-medium flex items-center gap-1" style={{ color: 'var(--accent-primary)' }}>
                        View All <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="overflow-x-auto">
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
                                <tr key={i}>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-8 h-8 rounded-lg flex items-center justify-center"
                                                style={{ background: 'var(--color-info-muted)' }}
                                            >
                                                <Building2 className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                                            </div>
                                            <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{client.name}</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span className="font-mono">{client.employees.toLocaleString()}</span>
                                    </td>
                                    <td><StatusBadge status={client.status} /></td>
                                    <td style={{ color: 'var(--text-dim)' }}>{client.lastSync}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
                    { label: 'Run Compliance Check', icon: Shield, href: '/compliance' },
                    { label: 'Workflow Builder', icon: DollarSign, href: '/workflow-builder' },
                    { label: 'Generate Reports', icon: FileCheck, href: '/reports' },
                    { label: 'Self-Insured Analytics', icon: TrendingUp, href: '/self-insured' },
                ].map((action, i) => (
                    <Link
                        key={i}
                        href={action.href}
                        className="glass-card p-4 flex items-center gap-3 group"
                    >
                        <div
                            className="w-10 h-10 rounded-lg flex items-center justify-center"
                            style={{ background: 'var(--color-info-muted)' }}
                        >
                            <action.icon className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                        </div>
                        <span className="text-sm font-medium" style={{ color: 'var(--text-secondary)' }}>
                            {action.label}
                        </span>
                    </Link>
                ))}
            </motion.div>
        </div>
    );
}
