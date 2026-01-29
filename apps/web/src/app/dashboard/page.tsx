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

const portfolioStats = [
    {
        label: 'Total Clients',
        value: '24',
        change: '+3',
        trend: 'up',
        icon: Building2,
        color: '#0D9488'
    },
    {
        label: 'Employees Managed',
        value: '12,847',
        change: '+847',
        trend: 'up',
        icon: Users,
        color: '#0284C7'
    },
    {
        label: 'Compliance Score',
        value: '94.2%',
        change: '+2.1%',
        trend: 'up',
        icon: CheckCircle2,
        color: '#059669'
    },
    {
        label: 'Open Risks',
        value: '7',
        change: '-2',
        trend: 'down',
        icon: AlertTriangle,
        color: '#D97706'
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
        compliant: { label: 'Compliant', bg: 'bg-[#059669]/10', text: 'text-[#059669]', border: 'border-[#059669]/25' },
        at_risk: { label: 'At Risk', bg: 'bg-[#D97706]/10', text: 'text-[#D97706]', border: 'border-[#D97706]/25' },
        non_compliant: { label: 'Non-Compliant', bg: 'bg-[#DC2626]/10', text: 'text-[#DC2626]', border: 'border-[#DC2626]/25' },
        pending_review: { label: 'Pending Review', bg: 'bg-[#0284C7]/10', text: 'text-[#0284C7]', border: 'border-[#0284C7]/25' },
    }[status] || { label: status, bg: 'bg-[#64748B]/10', text: 'text-[#64748B]', border: 'border-[#64748B]/25' };

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold ${config.bg} ${config.text} border ${config.border}`}>
            {config.label}
        </span>
    );
}

function SeverityBadge({ severity }: { severity: string }) {
    const config = {
        high: { label: 'High', bg: 'bg-[#DC2626]/10', text: 'text-[#DC2626]', border: 'border-[#DC2626]/25' },
        medium: { label: 'Medium', bg: 'bg-[#D97706]/10', text: 'text-[#D97706]', border: 'border-[#D97706]/25' },
        low: { label: 'Low', bg: 'bg-[#0284C7]/10', text: 'text-[#0284C7]', border: 'border-[#0284C7]/25' },
    }[severity] || { label: severity, bg: 'bg-[#64748B]/10', text: 'text-[#64748B]', border: 'border-[#64748B]/25' };

    return (
        <span className={`inline-flex items-center px-2.5 py-1 rounded text-xs font-semibold ${config.bg} ${config.text} border ${config.border}`}>
            {config.label}
        </span>
    );
}

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[#0F172A]">Dashboard</h1>
                    <p className="text-[#64748B] mt-1">Overview of your compliance portfolio</p>
                </div>
                <Link href="/onboard" className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-white bg-[#0D9488] rounded-lg hover:bg-[#0F766E] transition-colors shadow-sm">
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
                        className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm hover:shadow-md hover:border-[#CBD5E1] transition-all"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div
                                className="w-10 h-10 rounded-lg flex items-center justify-center"
                                style={{ background: `${stat.color}15` }}
                            >
                                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                            </div>
                            <div className={`flex items-center gap-1 text-xs font-semibold ${stat.trend === 'up' ? 'text-[#059669]' : 'text-[#DC2626]'}`}>
                                {stat.trend === 'up' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                {stat.change}
                            </div>
                        </div>
                        <div className="text-3xl font-bold text-[#0F172A] font-mono">{stat.value}</div>
                        <div className="text-sm text-[#64748B] mt-1">{stat.label}</div>
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
                    className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-[#0F172A] flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-[#0D9488]" />
                            Upcoming Deadlines
                        </h2>
                    </div>
                    <div className="space-y-3">
                        {upcomingDeadlines.map((deadline, i) => (
                            <div
                                key={i}
                                className="flex items-center justify-between p-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]"
                            >
                                <div>
                                    <div className="text-sm font-medium text-[#0F172A]">{deadline.name}</div>
                                    <div className="text-xs text-[#64748B] mt-1">{deadline.date}</div>
                                </div>
                                <div className={`text-xs font-semibold px-2 py-1 rounded ${deadline.daysLeft <= 7 ? 'bg-[#D97706]/10 text-[#D97706]' : 'bg-[#F1F5F9] text-[#64748B]'}`}>
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
                    className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm lg:col-span-2"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold text-[#0F172A] flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-[#0D9488]" />
                            Recent Clients
                        </h2>
                        <Link href="/clients" className="text-sm text-[#0D9488] hover:underline flex items-center gap-1 font-medium">
                            View All <ChevronRight className="w-4 h-4" />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-[#E2E8F0]">
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Client</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Employees</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Status</th>
                                    <th className="text-left py-3 px-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">Last Sync</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentClients.map((client, i) => (
                                    <tr key={i} className="border-b border-[#F1F5F9] hover:bg-[#F8FAFC] cursor-pointer transition-colors">
                                        <td className="py-3 px-4 text-sm font-medium text-[#0F172A]">{client.name}</td>
                                        <td className="py-3 px-4 text-sm font-mono text-[#334155]">{client.employees.toLocaleString()}</td>
                                        <td className="py-3 px-4"><StatusBadge status={client.status} /></td>
                                        <td className="py-3 px-4 text-sm text-[#64748B]">{client.lastSync}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </motion.div>
            </div>

            {/* Risk Alerts */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white rounded-xl border border-[#E2E8F0] p-6 shadow-sm"
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-[#0F172A] flex items-center gap-2">
                        <AlertCircle className="w-5 h-5 text-[#D97706]" />
                        Risk Alerts
                    </h2>
                    <Link href="/compliance" className="text-sm text-[#0D9488] hover:underline flex items-center gap-1 font-medium">
                        Compliance Center <ChevronRight className="w-4 h-4" />
                    </Link>
                </div>
                <div className="space-y-3">
                    {riskAlerts.map((alert, i) => (
                        <div
                            key={i}
                            className="flex items-center justify-between p-4 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] hover:border-[#CBD5E1] transition-colors"
                        >
                            <div className="flex items-center gap-4">
                                <SeverityBadge severity={alert.severity} />
                                <div>
                                    <div className="text-sm font-medium text-[#0F172A]">{alert.client}</div>
                                    <div className="text-xs text-[#64748B] mt-1">{alert.issue}</div>
                                </div>
                            </div>
                            <button className="px-4 py-2 text-sm font-medium text-[#0F172A] bg-white border border-[#CBD5E1] rounded-lg hover:bg-[#F1F5F9] transition-colors">
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
                        className="bg-white rounded-xl border border-[#E2E8F0] p-4 flex items-center gap-3 hover:border-[#0D9488] hover:shadow-md transition-all group"
                    >
                        <div className="w-10 h-10 rounded-lg bg-[#0D9488]/10 flex items-center justify-center">
                            <action.icon className="w-5 h-5 text-[#0D9488]" />
                        </div>
                        <span className="text-sm font-medium text-[#334155] group-hover:text-[#0F172A] transition-colors">
                            {action.label}
                        </span>
                    </Link>
                ))}
            </motion.div>
        </div>
    );
}
