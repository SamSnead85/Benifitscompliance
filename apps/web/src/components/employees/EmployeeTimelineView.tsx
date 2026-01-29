'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Clock,
    Calendar,
    User,
    Briefcase,
    Heart,
    Shield,
    FileText,
    TrendingUp,
    TrendingDown,
    CheckCircle2,
    AlertTriangle,
    XCircle,
    ChevronLeft,
    ChevronRight,
    Filter,
    Download,
    Printer
} from 'lucide-react';

interface EmployeeTimelineViewProps {
    className?: string;
    employeeId?: string;
}

interface TimelineEvent {
    id: string;
    date: string;
    type: 'status_change' | 'coverage' | 'enrollment' | 'form' | 'employment' | 'hours';
    title: string;
    description: string;
    details?: Record<string, string>;
    status?: 'success' | 'warning' | 'error' | 'info';
}

interface EmployeeInfo {
    id: string;
    name: string;
    ssn: string;
    department: string;
    hireDate: string;
    ftStatus: string;
    currentCoverage: string;
    planName: string;
}

const mockEmployee: EmployeeInfo = {
    id: 'E001',
    name: 'John Smith',
    ssn: '***-**-1234',
    department: 'Engineering',
    hireDate: 'Mar 15, 2020',
    ftStatus: 'Full-Time',
    currentCoverage: 'Employee + Family',
    planName: 'Premium PPO Gold',
};

const mockTimeline: TimelineEvent[] = [
    { id: 'ev1', date: 'Jan 15, 2026', type: 'form', title: '1095-C Generated', description: 'Tax year 2025 form generated and ready for distribution', status: 'success', details: { 'Form ID': '1095C-2025-E001', 'Status': 'Pending Distribution' } },
    { id: 'ev2', date: 'Jan 1, 2026', type: 'coverage', title: 'Coverage Renewed', description: 'Annual enrollment completed, coverage renewed for 2026', status: 'success', details: { 'Plan': 'Premium PPO Gold', 'Coverage Level': 'Employee + Family' } },
    { id: 'ev3', date: 'Dec 1, 2025', type: 'enrollment', title: 'Open Enrollment', description: 'Employee elected to keep current coverage during OE period', status: 'info', details: { 'Election': 'No Change', 'Effective': 'Jan 1, 2026' } },
    { id: 'ev4', date: 'Oct 15, 2025', type: 'hours', title: 'Hours Review', description: 'Standard measurement period completed - maintained FT status', status: 'success', details: { 'Avg Hours': '42.5 hrs/week', 'Period': 'Oct 2024 - Sep 2025' } },
    { id: 'ev5', date: 'Jul 1, 2025', type: 'coverage', title: 'Dependent Added', description: 'New dependent added to coverage after qualifying life event', status: 'info', details: { 'Dependent': 'Sarah Smith (Spouse)', 'Event': 'Marriage' } },
    { id: 'ev6', date: 'Mar 15, 2025', type: 'employment', title: 'Work Anniversary', description: '5-year work anniversary milestone', status: 'success', details: { 'Years': '5', 'Position': 'Senior Engineer' } },
    { id: 'ev7', date: 'Jan 1, 2025', type: 'coverage', title: 'Coverage Renewed', description: 'Annual enrollment completed for 2025', status: 'success', details: { 'Plan': 'Premium PPO Gold', 'Coverage Level': 'Employee + Family' } },
    { id: 'ev8', date: 'Sep 1, 2024', type: 'status_change', title: 'Promotion', description: 'Promoted from Engineer to Senior Engineer', status: 'success', details: { 'Previous': 'Engineer', 'New': 'Senior Engineer' } },
    { id: 'ev9', date: 'Mar 15, 2020', type: 'employment', title: 'Hired', description: 'Started employment as Engineer in Engineering department', status: 'info', details: { 'Position': 'Engineer', 'Type': 'Full-Time' } },
];

const eventTypeConfig: Record<string, { icon: typeof Clock; color: string; bgColor: string }> = {
    status_change: { icon: TrendingUp, color: 'text-purple-400', bgColor: 'bg-[rgba(139,92,246,0.1)]' },
    coverage: { icon: Heart, color: 'text-pink-400', bgColor: 'bg-[rgba(236,72,153,0.1)]' },
    enrollment: { icon: Shield, color: 'text-[var(--color-synapse-teal)]', bgColor: 'bg-[var(--color-synapse-teal-muted)]' },
    form: { icon: FileText, color: 'text-blue-400', bgColor: 'bg-[rgba(59,130,246,0.1)]' },
    employment: { icon: Briefcase, color: 'text-[var(--color-success)]', bgColor: 'bg-[rgba(16,185,129,0.1)]' },
    hours: { icon: Clock, color: 'text-amber-400', bgColor: 'bg-[rgba(245,158,11,0.1)]' },
};

export function EmployeeTimelineView({ className = '', employeeId }: EmployeeTimelineViewProps) {
    const [selectedYear, setSelectedYear] = useState('2026');
    const [filterType, setFilterType] = useState<string>('all');
    const [expandedEvents, setExpandedEvents] = useState<string[]>(['ev1', 'ev2']);

    const years = ['2026', '2025', '2024', '2023', '2022', '2021', '2020'];
    const eventTypes = [
        { id: 'all', label: 'All Events' },
        { id: 'status_change', label: 'Status Changes' },
        { id: 'coverage', label: 'Coverage' },
        { id: 'enrollment', label: 'Enrollment' },
        { id: 'form', label: 'Forms' },
        { id: 'employment', label: 'Employment' },
        { id: 'hours', label: 'Hours' },
    ];

    const filteredEvents = mockTimeline.filter(event => {
        if (filterType !== 'all' && event.type !== filterType) return false;
        const eventYear = event.date.split(', ')[1];
        if (selectedYear !== 'all' && eventYear !== selectedYear) return false;
        return true;
    });

    const toggleEvent = (id: string) => {
        setExpandedEvents(prev =>
            prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
        );
    };

    const getStatusIcon = (status?: string) => {
        switch (status) {
            case 'success': return <CheckCircle2 className="w-4 h-4 text-[var(--color-success)]" />;
            case 'warning': return <AlertTriangle className="w-4 h-4 text-[var(--color-warning)]" />;
            case 'error': return <XCircle className="w-4 h-4 text-[var(--color-critical)]" />;
            default: return null;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card ${className}`}
        >
            {/* Header */}
            <div className="p-5 border-b border-[var(--glass-border)]">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-[var(--color-synapse-teal)] to-[var(--color-synapse-cyan)] flex items-center justify-center text-xl font-bold text-black">
                            {mockEmployee.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white">{mockEmployee.name}</h2>
                            <div className="flex items-center gap-3 text-sm text-[var(--color-steel)]">
                                <span>{mockEmployee.id}</span>
                                <span>•</span>
                                <span>{mockEmployee.department}</span>
                                <span>•</span>
                                <span className="text-[var(--color-success)]">{mockEmployee.ftStatus}</span>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button className="btn-secondary flex items-center gap-2">
                            <Printer className="w-4 h-4" />
                            Print
                        </button>
                        <button className="btn-secondary flex items-center gap-2">
                            <Download className="w-4 h-4" />
                            Export
                        </button>
                    </div>
                </div>

                {/* Employee Summary Cards */}
                <div className="grid grid-cols-4 gap-4">
                    <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)]">
                        <p className="text-xs text-[var(--color-steel)]">Hire Date</p>
                        <p className="font-medium text-white">{mockEmployee.hireDate}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)]">
                        <p className="text-xs text-[var(--color-steel)]">SSN</p>
                        <p className="font-medium text-white">{mockEmployee.ssn}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)]">
                        <p className="text-xs text-[var(--color-steel)]">Current Coverage</p>
                        <p className="font-medium text-white">{mockEmployee.currentCoverage}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)]">
                        <p className="text-xs text-[var(--color-steel)]">Plan</p>
                        <p className="font-medium text-white">{mockEmployee.planName}</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="px-5 py-4 border-b border-[var(--glass-border)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {eventTypes.map(type => (
                        <button
                            key={type.id}
                            onClick={() => setFilterType(type.id)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${filterType === type.id
                                ? 'bg-[var(--color-synapse-teal)] text-black'
                                : 'text-[var(--color-steel)] hover:bg-[rgba(255,255,255,0.05)]'
                                }`}
                        >
                            {type.label}
                        </button>
                    ))}
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => {
                            const idx = years.indexOf(selectedYear);
                            if (idx < years.length - 1) setSelectedYear(years[idx + 1]);
                        }}
                        disabled={years.indexOf(selectedYear) === years.length - 1}
                        className="p-2 rounded-lg text-[var(--color-steel)] hover:bg-[rgba(255,255,255,0.05)] disabled:opacity-30"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(e.target.value)}
                        className="px-3 py-1.5 text-sm bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white focus:outline-none focus:border-[var(--color-synapse-teal)]"
                    >
                        {years.map(year => (
                            <option key={year} value={year}>{year}</option>
                        ))}
                    </select>
                    <button
                        onClick={() => {
                            const idx = years.indexOf(selectedYear);
                            if (idx > 0) setSelectedYear(years[idx - 1]);
                        }}
                        disabled={years.indexOf(selectedYear) === 0}
                        className="p-2 rounded-lg text-[var(--color-steel)] hover:bg-[rgba(255,255,255,0.05)] disabled:opacity-30"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>

            {/* Timeline */}
            <div className="p-5">
                <div className="relative">
                    {/* Timeline Line */}
                    <div className="absolute left-[27px] top-0 bottom-0 w-0.5 bg-[var(--glass-border)]" />

                    <div className="space-y-4">
                        {filteredEvents.map((event, index) => {
                            const config = eventTypeConfig[event.type];
                            const Icon = config.icon;
                            const isExpanded = expandedEvents.includes(event.id);

                            return (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="relative pl-14"
                                >
                                    {/* Timeline Dot */}
                                    <div className={`absolute left-0 w-14 h-14 rounded-full ${config.bgColor} flex items-center justify-center`}>
                                        <Icon className={`w-6 h-6 ${config.color}`} />
                                    </div>

                                    {/* Event Card */}
                                    <button
                                        onClick={() => toggleEvent(event.id)}
                                        className={`w-full text-left p-4 rounded-lg border transition-all ${isExpanded
                                            ? 'bg-[rgba(255,255,255,0.03)] border-[var(--color-synapse-teal)]'
                                            : 'bg-[rgba(255,255,255,0.01)] border-[var(--glass-border)] hover:border-[var(--glass-border-hover)]'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-medium text-white">{event.title}</h4>
                                                {getStatusIcon(event.status)}
                                            </div>
                                            <span className="text-sm text-[var(--color-steel)]">{event.date}</span>
                                        </div>
                                        <p className="text-sm text-[var(--color-silver)]">{event.description}</p>

                                        <AnimatePresence>
                                            {isExpanded && event.details && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: 'auto', opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <div className="mt-3 pt-3 border-t border-[var(--glass-border)] grid grid-cols-2 gap-3">
                                                        {Object.entries(event.details).map(([key, value]) => (
                                                            <div key={key}>
                                                                <p className="text-xs text-[var(--color-steel)]">{key}</p>
                                                                <p className="text-sm font-medium text-white">{value}</p>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </button>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                {filteredEvents.length === 0 && (
                    <div className="text-center py-12">
                        <Calendar className="w-12 h-12 mx-auto mb-4 text-[var(--color-steel)]" />
                        <p className="text-[var(--color-steel)]">No events found for the selected filters</p>
                    </div>
                )}
            </div>
        </motion.div>
    );
}

export default EmployeeTimelineView;
