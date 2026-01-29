'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Scale,
    Calendar,
    Bell,
    FileText,
    ExternalLink,
    ChevronRight,
    Clock,
    CheckCircle2,
    AlertTriangle,
    Info,
    Filter,
    Download,
    Search,
    Newspaper,
    Building2,
    Gavel,
    TrendingUp
} from 'lucide-react';

// Animation variants
const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const stagger = {
    visible: {
        transition: { staggerChildren: 0.06 }
    }
};

// Sample regulatory updates
const regulatoryUpdates = [
    {
        id: 1,
        title: '2026 ACA Affordability Threshold Updated',
        source: 'IRS',
        date: '2026-01-25',
        type: 'guidance',
        impact: 'high',
        summary: 'The IRS has released the updated affordability percentage for 2026 plan years. The new threshold is 9.02% of household income.',
        affectedClients: 247
    },
    {
        id: 2,
        title: 'Mental Health Parity Final Rule Implementation',
        source: 'DOL',
        date: '2026-01-20',
        type: 'rule',
        impact: 'high',
        summary: 'New MHPAEA requirements take effect requiring comparative analyses of NQTLs. Plans must document and submit analyses upon request.',
        affectedClients: 185
    },
    {
        id: 3,
        title: 'Transparency in Coverage Machine-Readable Files Update',
        source: 'CMS',
        date: '2026-01-15',
        type: 'guidance',
        impact: 'medium',
        summary: 'CMS clarifies requirements for prescription drug pricing files and updates technical specifications for file formats.',
        affectedClients: 247
    },
    {
        id: 4,
        title: 'PCORI Fee Rate for 2026',
        source: 'IRS',
        date: '2026-01-10',
        type: 'notice',
        impact: 'low',
        summary: 'The PCORI fee rate for plan years ending in 2026 has been set at $3.22 per covered life.',
        affectedClients: 247
    },
    {
        id: 5,
        title: 'State Mandate: Paid Family Leave Expansion',
        source: 'State',
        date: '2026-01-05',
        type: 'legislation',
        impact: 'medium',
        summary: 'Three additional states have enacted paid family leave requirements effective July 1, 2026.',
        affectedClients: 68
    }
];

// Upcoming deadlines
const upcomingDeadlines = [
    { name: 'Form 1095-C Distribution', date: 'Mar 3, 2026', daysLeft: 33, status: 'on-track', clients: 247 },
    { name: 'Form 1094-C E-File', date: 'Mar 31, 2026', daysLeft: 61, status: 'on-track', clients: 247 },
    { name: 'Form 5500 Filing', date: 'Jul 31, 2026', daysLeft: 183, status: 'upcoming', clients: 156 },
    { name: 'PCORI Fee Payment', date: 'Jul 31, 2026', daysLeft: 183, status: 'upcoming', clients: 89 },
    { name: 'Medicare Part D Notice', date: 'Oct 15, 2026', daysLeft: 259, status: 'upcoming', clients: 247 }
];

function ImpactBadge({ impact }: { impact: string }) {
    const configs: Record<string, { label: string; className: string }> = {
        'high': { label: 'High Impact', className: 'bg-red-500/10 text-red-400 border-red-500/20' },
        'medium': { label: 'Medium', className: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
        'low': { label: 'Low', className: 'bg-slate-500/10 text-slate-400 border-slate-500/20' }
    };
    const config = configs[impact] || configs.low;

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${config.className}`}>
            {config.label}
        </span>
    );
}

function TypeBadge({ type }: { type: string }) {
    const colors: Record<string, string> = {
        'guidance': 'bg-blue-500/10 text-blue-400',
        'rule': 'bg-purple-500/10 text-purple-400',
        'notice': 'bg-emerald-500/10 text-emerald-400',
        'legislation': 'bg-amber-500/10 text-amber-400'
    };

    return (
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium capitalize ${colors[type] || 'bg-slate-500/10 text-slate-400'}`}>
            {type}
        </span>
    );
}

function SourceIcon({ source }: { source: string }) {
    const icons: Record<string, { icon: React.ElementType; color: string }> = {
        'IRS': { icon: Building2, color: '#3B82F6' },
        'DOL': { icon: Gavel, color: '#8B5CF6' },
        'CMS': { icon: Scale, color: '#10B981' },
        'State': { icon: Building2, color: '#F59E0B' }
    };
    const config = icons[source] || icons.IRS;
    const Icon = config.icon;

    return (
        <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: `${config.color}20` }}>
            <Icon className="w-5 h-5" style={{ color: config.color }} />
        </div>
    );
}

export default function RegulatoryPage() {
    const [selectedUpdate, setSelectedUpdate] = useState<typeof regulatoryUpdates[0] | null>(null);
    const [activeTab, setActiveTab] = useState<'updates' | 'calendar' | 'filings'>('updates');

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Regulatory Command Center
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>
                        Stay ahead of compliance requirements with AI-powered regulatory intelligence
                    </p>
                </div>
                <button className="btn-primary flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Subscribe to Alerts
                </button>
            </div>

            {/* Stats Row */}
            <motion.div
                variants={stagger}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-4 gap-4"
            >
                {[
                    { label: 'Active Regulations', value: '156', icon: Scale, color: 'var(--accent-primary)' },
                    { label: 'High Impact Updates', value: '12', icon: AlertTriangle, color: '#EF4444' },
                    { label: 'Upcoming Deadlines', value: '8', icon: Calendar, color: '#F59E0B' },
                    { label: 'Compliance Score', value: '98.7%', icon: CheckCircle2, color: '#10B981' }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        variants={fadeInUp}
                        className="glass-card p-5"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                            <TrendingUp className="w-4 h-4" style={{ color: 'var(--text-dim)' }} />
                        </div>
                        <div className="text-2xl font-semibold font-mono" style={{ color: 'var(--text-primary)' }}>
                            {stat.value}
                        </div>
                        <div className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>
                            {stat.label}
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Tab Navigation */}
            <div className="flex gap-1 p-1 rounded-lg w-fit" style={{ background: 'var(--hover-overlay)' }}>
                {[
                    { id: 'updates', label: 'Regulatory Updates', icon: Newspaper },
                    { id: 'calendar', label: 'Compliance Calendar', icon: Calendar },
                    { id: 'filings', label: 'Filing Tracker', icon: FileText }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab.id ? '' : ''
                            }`}
                        style={{
                            background: activeTab === tab.id ? 'var(--card-bg)' : 'transparent',
                            color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-dim)'
                        }}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Main Content */}
            {activeTab === 'updates' && (
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Updates List */}
                    <div className="lg:col-span-2 space-y-4">
                        {regulatoryUpdates.map((update) => (
                            <motion.div
                                key={update.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`glass-card p-5 cursor-pointer transition-all ${selectedUpdate?.id === update.id ? 'ring-1' : ''
                                    }`}
                                style={{
                                    borderColor: selectedUpdate?.id === update.id ? 'var(--accent-primary)' : undefined
                                }}
                                onClick={() => setSelectedUpdate(update)}
                            >
                                <div className="flex items-start gap-4">
                                    <SourceIcon source={update.source} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                                            <TypeBadge type={update.type} />
                                            <ImpactBadge impact={update.impact} />
                                        </div>
                                        <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
                                            {update.title}
                                        </h3>
                                        <p className="text-sm line-clamp-2 mb-3" style={{ color: 'var(--text-muted)' }}>
                                            {update.summary}
                                        </p>
                                        <div className="flex items-center gap-4 text-xs" style={{ color: 'var(--text-dim)' }}>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {update.date}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Building2 className="w-3 h-3" />
                                                {update.affectedClients} clients affected
                                            </span>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--text-dim)' }} />
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Upcoming Deadlines Sidebar */}
                    <div className="glass-card p-5">
                        <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
                            <Calendar className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                            Upcoming Deadlines
                        </h3>
                        <div className="space-y-3">
                            {upcomingDeadlines.map((deadline, i) => (
                                <div
                                    key={i}
                                    className="p-3 rounded-lg"
                                    style={{ background: 'var(--hover-overlay)' }}
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                                            {deadline.name}
                                        </span>
                                        <span
                                            className={`text-xs font-mono px-2 py-0.5 rounded ${deadline.daysLeft <= 30 ? 'bg-amber-500/10 text-amber-400' : 'bg-slate-500/10 text-slate-400'
                                                }`}
                                        >
                                            {deadline.daysLeft}d
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-xs" style={{ color: 'var(--text-dim)' }}>
                                        <span>{deadline.date}</span>
                                        <span>{deadline.clients} clients</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button
                            className="w-full mt-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2"
                            style={{ background: 'var(--hover-overlay)', color: 'var(--text-muted)' }}
                        >
                            View Full Calendar
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {activeTab === 'calendar' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass-card p-6"
                >
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                            2026 Compliance Calendar
                        </h2>
                        <button className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: 'var(--hover-overlay)', color: 'var(--text-muted)' }}>
                            <Download className="w-4 h-4" />
                            Export to Calendar
                        </button>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                        {upcomingDeadlines.map((deadline, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-4 p-4 rounded-lg border"
                                style={{ borderColor: 'var(--card-border)', background: 'var(--bg-base)' }}
                            >
                                <div
                                    className="w-12 h-12 rounded-lg flex flex-col items-center justify-center"
                                    style={{ background: deadline.daysLeft <= 30 ? 'var(--color-warning-muted)' : 'var(--color-info-muted)' }}
                                >
                                    <span className="text-xs font-medium" style={{ color: deadline.daysLeft <= 30 ? 'var(--color-warning)' : 'var(--accent-primary)' }}>
                                        {deadline.date.split(' ')[0]}
                                    </span>
                                    <span className="text-lg font-bold" style={{ color: deadline.daysLeft <= 30 ? 'var(--color-warning)' : 'var(--accent-primary)' }}>
                                        {deadline.date.split(' ')[1].replace(',', '')}
                                    </span>
                                </div>
                                <div className="flex-1">
                                    <div className="font-medium" style={{ color: 'var(--text-primary)' }}>{deadline.name}</div>
                                    <div className="text-sm" style={{ color: 'var(--text-dim)' }}>{deadline.clients} clients</div>
                                </div>
                                <div className="text-right">
                                    <span
                                        className={`inline-flex items-center gap-1 text-xs font-medium ${deadline.status === 'on-track' ? 'text-emerald-400' : 'text-slate-400'
                                            }`}
                                    >
                                        {deadline.status === 'on-track' && <CheckCircle2 className="w-3 h-3" />}
                                        {deadline.status.replace('-', ' ')}
                                    </span>
                                    <div className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>
                                        {deadline.daysLeft} days left
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {activeTab === 'filings' && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass-card overflow-hidden"
                >
                    <div className="p-5 border-b" style={{ borderColor: 'var(--card-border)' }}>
                        <div className="flex items-center justify-between">
                            <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                                Filing Status Tracker
                            </h2>
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-dim)' }} />
                                    <input
                                        type="text"
                                        placeholder="Search filings..."
                                        className="pl-9 pr-4 py-2 rounded-lg border text-sm"
                                        style={{ background: 'var(--input-bg)', borderColor: 'var(--card-border)', color: 'var(--text-primary)' }}
                                    />
                                </div>
                                <button className="flex items-center gap-2 px-4 py-2 rounded-lg" style={{ background: 'var(--hover-overlay)', color: 'var(--text-muted)' }}>
                                    <Filter className="w-4 h-4" />
                                    Filters
                                </button>
                            </div>
                        </div>
                    </div>
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Filing Type</th>
                                <th>Client</th>
                                <th>Due Date</th>
                                <th>Status</th>
                                <th>Submitted</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {[
                                { type: 'Form 1095-C', client: 'Acme Corporation', due: 'Mar 3, 2026', status: 'prepared', submitted: null },
                                { type: 'Form 1094-C', client: 'Acme Corporation', due: 'Mar 31, 2026', status: 'in-progress', submitted: null },
                                { type: 'Form 5500', client: 'TechStart Inc.', due: 'Jul 31, 2026', status: 'not-started', submitted: null },
                                { type: 'Form 1095-C', client: 'Global Services', due: 'Mar 3, 2025', status: 'filed', submitted: 'Feb 28, 2025' },
                                { type: 'PCORI Fee', client: 'Metro Corp', due: 'Jul 31, 2025', status: 'filed', submitted: 'Jul 15, 2025' }
                            ].map((filing, i) => (
                                <tr key={i}>
                                    <td>
                                        <div className="flex items-center gap-3">
                                            <FileText className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                                            <span className="font-medium" style={{ color: 'var(--text-primary)' }}>{filing.type}</span>
                                        </div>
                                    </td>
                                    <td style={{ color: 'var(--text-muted)' }}>{filing.client}</td>
                                    <td className="font-mono text-sm">{filing.due}</td>
                                    <td>
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${filing.status === 'filed' ? 'bg-emerald-500/10 text-emerald-400' :
                                                filing.status === 'prepared' ? 'bg-blue-500/10 text-blue-400' :
                                                    filing.status === 'in-progress' ? 'bg-amber-500/10 text-amber-400' :
                                                        'bg-slate-500/10 text-slate-400'
                                            }`}>
                                            {filing.status === 'filed' && <CheckCircle2 className="w-3 h-3" />}
                                            {filing.status.replace('-', ' ')}
                                        </span>
                                    </td>
                                    <td className="font-mono text-sm" style={{ color: 'var(--text-dim)' }}>{filing.submitted || '—'}</td>
                                    <td>
                                        <button className="text-sm font-medium" style={{ color: 'var(--accent-primary)' }}>
                                            View Details
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </motion.div>
            )}
        </div>
    );
}
