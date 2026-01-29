'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    User,
    Search,
    Filter,
    Calendar,
    Shield,
    Heart,
    Users,
    FileText,
    Clock,
    CheckCircle2,
    AlertTriangle,
    ChevronRight,
    Mail,
    Phone,
    Building2,
    Activity,
    TrendingUp,
    ArrowRight
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

// Sample members data
const members = [
    {
        id: 'EMP001',
        name: 'Sarah Johnson',
        email: 'sarah.johnson@acmecorp.com',
        department: 'Engineering',
        client: 'Acme Corporation',
        status: 'active',
        coverageTier: 'EE+Family',
        enrollmentDate: '2022-03-15',
        acaStatus: 'FT-Variable',
        measurementPeriod: 'MP2024',
        hoursThisPeriod: 1248,
        dependents: 3
    },
    {
        id: 'EMP002',
        name: 'Michael Chen',
        email: 'm.chen@techstart.io',
        department: 'Product',
        client: 'TechStart Inc.',
        status: 'review',
        coverageTier: 'EE+Spouse',
        enrollmentDate: '2023-01-01',
        acaStatus: 'FT-Regular',
        measurementPeriod: 'MP2024',
        hoursThisPeriod: 2080,
        dependents: 1
    },
    {
        id: 'EMP003',
        name: 'Emily Rodriguez',
        email: 'emily.r@global.com',
        department: 'Sales',
        client: 'Global Services LLC',
        status: 'active',
        coverageTier: 'EE Only',
        enrollmentDate: '2021-06-01',
        acaStatus: 'FT-Regular',
        measurementPeriod: 'MP2024',
        hoursThisPeriod: 2080,
        dependents: 0
    },
    {
        id: 'EMP004',
        name: 'James Wilson',
        email: 'jwilson@metro.com',
        department: 'Operations',
        client: 'Metro Corporation',
        status: 'gap',
        coverageTier: 'Waived',
        enrollmentDate: null,
        acaStatus: 'PT-Variable',
        measurementPeriod: 'MP2024',
        hoursThisPeriod: 890,
        dependents: 0
    },
    {
        id: 'EMP005',
        name: 'Lisa Thompson',
        email: 'lisa.t@healthfirst.med',
        department: 'HR',
        client: 'HealthFirst Medical',
        status: 'cobra',
        coverageTier: 'EE+Family',
        enrollmentDate: '2020-09-01',
        acaStatus: 'Terminated',
        measurementPeriod: 'N/A',
        hoursThisPeriod: 0,
        dependents: 2
    }
];

const lifeEvents = [
    { type: 'marriage', label: 'Marriage', icon: Heart, color: '#EC4899' },
    { type: 'birth', label: 'Birth/Adoption', icon: Users, color: '#10B981' },
    { type: 'divorce', label: 'Divorce', icon: Users, color: '#F59E0B' },
    { type: 'termination', label: 'Termination', icon: Building2, color: '#EF4444' },
    { type: 'cobra', label: 'COBRA Election', icon: Shield, color: '#8B5CF6' }
];

function StatusBadge({ status }: { status: string }) {
    const configs: Record<string, { label: string; className: string }> = {
        'active': { label: 'Active', className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
        'review': { label: 'Review', className: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
        'gap': { label: 'Coverage Gap', className: 'bg-red-500/10 text-red-400 border-red-500/20' },
        'cobra': { label: 'COBRA', className: 'bg-purple-500/10 text-purple-400 border-purple-500/20' },
        'pending': { label: 'Pending', className: 'bg-blue-500/10 text-blue-400 border-blue-500/20' }
    };
    const config = configs[status] || configs.pending;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.className}`}>
            {config.label}
        </span>
    );
}

function ACAStatusBadge({ status }: { status: string }) {
    const isFullTime = status.startsWith('FT');
    return (
        <span
            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono ${isFullTime ? 'bg-blue-500/10 text-blue-400' : 'bg-slate-500/10 text-slate-400'
                }`}
        >
            {status}
        </span>
    );
}

export default function MembersPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedMember, setSelectedMember] = useState<typeof members[0] | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'eligibility' | 'events' | 'documents'>('overview');

    const filteredMembers = members.filter(m =>
        m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Member 360°
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>
                        Complete member eligibility and coverage view
                    </p>
                </div>
            </div>

            {/* Stats Row */}
            <motion.div
                variants={stagger}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-5 gap-4"
            >
                {[
                    { label: 'Total Members', value: '18,432', icon: Users, color: 'var(--accent-primary)' },
                    { label: 'Active Coverage', value: '17,891', icon: Shield, color: '#10B981' },
                    { label: 'Coverage Gaps', value: '234', icon: AlertTriangle, color: '#EF4444' },
                    { label: 'COBRA', value: '156', icon: Clock, color: '#8B5CF6' },
                    { label: 'Pending Events', value: '47', icon: Calendar, color: '#F59E0B' }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        variants={fadeInUp}
                        className="glass-card p-4"
                    >
                        <div className="flex items-center justify-between mb-2">
                            <stat.icon className="w-4 h-4" style={{ color: stat.color }} />
                            <TrendingUp className="w-3 h-3" style={{ color: 'var(--text-dim)' }} />
                        </div>
                        <div className="text-xl font-semibold font-mono" style={{ color: 'var(--text-primary)' }}>
                            {stat.value}
                        </div>
                        <div className="text-xs" style={{ color: 'var(--text-dim)' }}>
                            {stat.label}
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Search & Filters */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-dim)' }} />
                    <input
                        type="text"
                        placeholder="Search by name, email, or ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm"
                        style={{
                            background: 'var(--input-bg)',
                            borderColor: 'var(--card-border)',
                            color: 'var(--text-primary)'
                        }}
                    />
                </div>
                <button
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm"
                    style={{ borderColor: 'var(--card-border)', color: 'var(--text-muted)' }}
                >
                    <Filter className="w-4 h-4" />
                    Filters
                </button>
            </div>

            {/* Main Content */}
            <div className="grid lg:grid-cols-3 gap-6">
                {/* Members List */}
                <div className="lg:col-span-2 glass-card overflow-hidden">
                    <div className="p-4 border-b" style={{ borderColor: 'var(--card-border)' }}>
                        <h2 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                            Members ({filteredMembers.length})
                        </h2>
                    </div>
                    <div className="divide-y" style={{ borderColor: 'var(--card-border)' }}>
                        {filteredMembers.map((member) => (
                            <div
                                key={member.id}
                                onClick={() => setSelectedMember(member)}
                                className={`p-4 cursor-pointer transition-colors ${selectedMember?.id === member.id ? '' : ''
                                    }`}
                                style={{
                                    background: selectedMember?.id === member.id ? 'var(--hover-overlay)' : 'transparent'
                                }}
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold"
                                        style={{ background: 'var(--color-info-muted)', color: 'var(--accent-primary)' }}
                                    >
                                        {member.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium" style={{ color: 'var(--text-primary)' }}>
                                                {member.name}
                                            </span>
                                            <StatusBadge status={member.status} />
                                        </div>
                                        <div className="text-sm truncate" style={{ color: 'var(--text-dim)' }}>
                                            {member.client} • {member.department}
                                        </div>
                                    </div>
                                    <div className="text-right hidden md:block">
                                        <ACAStatusBadge status={member.acaStatus} />
                                        <div className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>
                                            {member.coverageTier}
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4" style={{ color: 'var(--text-dim)' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Member Detail Panel */}
                <div className="glass-card">
                    {selectedMember ? (
                        <div>
                            {/* Header */}
                            <div className="p-5 border-b" style={{ borderColor: 'var(--card-border)' }}>
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-14 h-14 rounded-full flex items-center justify-center text-lg font-semibold"
                                        style={{ background: 'var(--accent-gradient)', color: 'white' }}
                                    >
                                        {selectedMember.name.split(' ').map(n => n[0]).join('')}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                                            {selectedMember.name}
                                        </h3>
                                        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                            {selectedMember.id}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-4">
                                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs" style={{ background: 'var(--hover-overlay)', color: 'var(--text-muted)' }}>
                                        <Mail className="w-3 h-3" /> Email
                                    </button>
                                    <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs" style={{ background: 'var(--hover-overlay)', color: 'var(--text-muted)' }}>
                                        <Phone className="w-3 h-3" /> Call
                                    </button>
                                </div>
                            </div>

                            {/* Tabs */}
                            <div className="flex border-b" style={{ borderColor: 'var(--card-border)' }}>
                                {['overview', 'eligibility', 'events', 'documents'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab as typeof activeTab)}
                                        className={`flex-1 px-4 py-3 text-xs font-medium capitalize transition-colors ${activeTab === tab ? 'border-b-2' : ''
                                            }`}
                                        style={{
                                            borderColor: activeTab === tab ? 'var(--accent-primary)' : 'transparent',
                                            color: activeTab === tab ? 'var(--accent-primary)' : 'var(--text-dim)'
                                        }}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            {/* Tab Content */}
                            <div className="p-5 space-y-4">
                                {activeTab === 'overview' && (
                                    <>
                                        <div className="space-y-3">
                                            {[
                                                { label: 'Status', value: selectedMember.status.toUpperCase() },
                                                { label: 'Coverage Tier', value: selectedMember.coverageTier },
                                                { label: 'Dependents', value: selectedMember.dependents.toString() },
                                                { label: 'Client', value: selectedMember.client },
                                                { label: 'Department', value: selectedMember.department }
                                            ].map((item, i) => (
                                                <div key={i} className="flex justify-between">
                                                    <span className="text-sm" style={{ color: 'var(--text-dim)' }}>{item.label}</span>
                                                    <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{item.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}

                                {activeTab === 'eligibility' && (
                                    <div className="space-y-4">
                                        <div className="p-4 rounded-lg" style={{ background: 'var(--hover-overlay)' }}>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Activity className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                                                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                                                    ACA Measurement
                                                </span>
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-sm">
                                                    <span style={{ color: 'var(--text-dim)' }}>Period</span>
                                                    <span style={{ color: 'var(--text-primary)' }}>{selectedMember.measurementPeriod}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span style={{ color: 'var(--text-dim)' }}>Hours</span>
                                                    <span className="font-mono" style={{ color: 'var(--text-primary)' }}>{selectedMember.hoursThisPeriod.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between text-sm">
                                                    <span style={{ color: 'var(--text-dim)' }}>Status</span>
                                                    <ACAStatusBadge status={selectedMember.acaStatus} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'events' && (
                                    <div className="space-y-3">
                                        <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
                                            Record a life event for this member:
                                        </p>
                                        {lifeEvents.map((event) => (
                                            <button
                                                key={event.type}
                                                className="w-full flex items-center gap-3 p-3 rounded-lg transition-colors"
                                                style={{ background: 'var(--hover-overlay)' }}
                                            >
                                                <event.icon className="w-4 h-4" style={{ color: event.color }} />
                                                <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>{event.label}</span>
                                                <ArrowRight className="w-4 h-4 ml-auto" style={{ color: 'var(--text-dim)' }} />
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {activeTab === 'documents' && (
                                    <div className="space-y-3">
                                        {[
                                            { name: 'Enrollment Form 2024', date: 'Jan 15, 2024' },
                                            { name: 'Dependent Verification', date: 'Jan 10, 2024' },
                                            { name: 'HIPAA Authorization', date: 'Mar 15, 2022' }
                                        ].map((doc, i) => (
                                            <div
                                                key={i}
                                                className="flex items-center gap-3 p-3 rounded-lg"
                                                style={{ background: 'var(--hover-overlay)' }}
                                            >
                                                <FileText className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                                                <div className="flex-1">
                                                    <div className="text-sm" style={{ color: 'var(--text-primary)' }}>{doc.name}</div>
                                                    <div className="text-xs" style={{ color: 'var(--text-dim)' }}>{doc.date}</div>
                                                </div>
                                                <ChevronRight className="w-4 h-4" style={{ color: 'var(--text-dim)' }} />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-96 text-center p-6">
                            <User className="w-12 h-12 mb-4" style={{ color: 'var(--text-dim)' }} />
                            <p style={{ color: 'var(--text-muted)' }}>Select a member to view details</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
