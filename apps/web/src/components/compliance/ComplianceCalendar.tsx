'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    ChevronLeft,
    ChevronRight,
    Clock,
    FileText,
    AlertTriangle,
    CheckCircle2,
    Bell,
    Flag,
    Users,
    Building2,
    Filter,
    Plus,
    X,
    CalendarDays
} from 'lucide-react';

interface ComplianceCalendarProps {
    className?: string;
}

interface CalendarEvent {
    id: string;
    date: string;
    title: string;
    type: 'filing' | 'deadline' | 'reminder' | 'audit' | 'enrollment';
    priority: 'high' | 'medium' | 'low';
    status: 'upcoming' | 'due_soon' | 'overdue' | 'completed';
    description?: string;
    affectedEntities?: number;
}

const mockEvents: CalendarEvent[] = [
    { id: 'ev1', date: '2026-02-28', title: '1095-C Distribution Deadline', type: 'deadline', priority: 'high', status: 'upcoming', description: 'Distribute 1095-C forms to all FT employees', affectedEntities: 4256 },
    { id: 'ev2', date: '2026-03-02', title: 'Correction Period Ends', type: 'deadline', priority: 'high', status: 'upcoming', description: 'Last day to submit corrected AIR filings' },
    { id: 'ev3', date: '2026-03-31', title: 'IRS Filing Deadline', type: 'filing', priority: 'high', status: 'upcoming', description: '1094-C and 1095-C electronic filing deadline' },
    { id: 'ev4', date: '2026-01-31', title: 'W-2 Distribution', type: 'deadline', priority: 'medium', status: 'completed', description: 'Annual W-2 form distribution to employees' },
    { id: 'ev5', date: '2026-02-15', title: 'Quarterly Review Meeting', type: 'reminder', priority: 'low', status: 'upcoming', description: 'Review Q4 compliance metrics with leadership' },
    { id: 'ev6', date: '2026-04-15', title: 'ACA Compliance Audit', type: 'audit', priority: 'high', status: 'upcoming', description: 'Annual internal compliance audit', affectedEntities: 12 },
    { id: 'ev7', date: '2026-11-01', title: 'Open Enrollment Starts', type: 'enrollment', priority: 'high', status: 'upcoming', description: '2027 plan year open enrollment period begins' },
    { id: 'ev8', date: '2026-12-15', title: 'Open Enrollment Ends', type: 'enrollment', priority: 'high', status: 'upcoming', description: '2027 plan year open enrollment period ends' },
];

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const eventTypeConfig: Record<string, { color: string; bgColor: string; icon: typeof Calendar }> = {
    filing: { color: 'text-blue-400', bgColor: 'bg-[rgba(59,130,246,0.1)]', icon: FileText },
    deadline: { color: 'text-[var(--color-critical)]', bgColor: 'bg-[rgba(239,68,68,0.1)]', icon: AlertTriangle },
    reminder: { color: 'text-[var(--color-synapse-teal)]', bgColor: 'bg-[var(--color-synapse-teal-muted)]', icon: Bell },
    audit: { color: 'text-purple-400', bgColor: 'bg-[rgba(139,92,246,0.1)]', icon: Flag },
    enrollment: { color: 'text-[var(--color-success)]', bgColor: 'bg-[rgba(16,185,129,0.1)]', icon: Users },
};

export function ComplianceCalendar({ className = '' }: ComplianceCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1)); // February 2026
    const [selectedDate, setSelectedDate] = useState<string | null>(null);
    const [filterType, setFilterType] = useState<string>('all');
    const [showEventModal, setShowEventModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    const getEventsForDate = (date: string) => {
        return mockEvents.filter(e => e.date === date && (filterType === 'all' || e.type === filterType));
    };

    const filteredEvents = mockEvents.filter(e => {
        if (filterType !== 'all' && e.type !== filterType) return false;
        const eventMonth = new Date(e.date).getMonth();
        const eventYear = new Date(e.date).getFullYear();
        return eventMonth === month && eventYear === year;
    });

    const upcomingEvents = mockEvents
        .filter(e => new Date(e.date) >= new Date() && e.status !== 'completed')
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, 5);

    const openEventDetails = (event: CalendarEvent) => {
        setSelectedEvent(event);
        setShowEventModal(true);
    };

    const generateCalendarDays = () => {
        const days = [];

        // Empty cells for days before the first day of the month
        for (let i = 0; i < firstDayOfMonth; i++) {
            days.push(<div key={`empty-${i}`} className="h-24" />);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const events = getEventsForDate(dateString);
            const isToday = dateString === '2026-01-28'; // Mock today
            const isSelected = dateString === selectedDate;

            days.push(
                <motion.div
                    key={day}
                    whileHover={{ scale: 1.02 }}
                    className={`h-24 p-2 rounded-lg border cursor-pointer transition-all ${isSelected
                            ? 'border-[var(--color-synapse-teal)] bg-[var(--color-synapse-teal-muted)]'
                            : isToday
                                ? 'border-[var(--color-synapse-teal)] bg-[rgba(6,182,212,0.05)]'
                                : 'border-[var(--glass-border)] bg-[rgba(255,255,255,0.01)] hover:border-[var(--glass-border-hover)]'
                        }`}
                    onClick={() => setSelectedDate(dateString)}
                >
                    <div className={`text-sm font-medium ${isToday ? 'text-[var(--color-synapse-teal)]' : 'text-white'}`}>
                        {day}
                    </div>
                    <div className="mt-1 space-y-1">
                        {events.slice(0, 2).map(event => {
                            const config = eventTypeConfig[event.type];
                            return (
                                <div
                                    key={event.id}
                                    onClick={(e) => { e.stopPropagation(); openEventDetails(event); }}
                                    className={`px-1.5 py-0.5 text-[10px] rounded truncate ${config.bgColor} ${config.color}`}
                                >
                                    {event.title}
                                </div>
                            );
                        })}
                        {events.length > 2 && (
                            <div className="text-[10px] text-[var(--color-steel)]">
                                +{events.length - 2} more
                            </div>
                        )}
                    </div>
                </motion.div>
            );
        }

        return days;
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card ${className}`}
        >
            {/* Header */}
            <div className="p-5 border-b border-[var(--glass-border)]">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                            <CalendarDays className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">Compliance Calendar</h2>
                            <p className="text-xs text-[var(--color-steel)]">Deadlines, filings, and compliance milestones</p>
                        </div>
                    </div>
                    <button className="btn-primary flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Add Event
                    </button>
                </div>

                {/* Navigation and Filters */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={prevMonth}
                            className="p-2 rounded-lg text-[var(--color-steel)] hover:bg-[rgba(255,255,255,0.05)]"
                        >
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <h3 className="text-lg font-medium text-white min-w-[180px] text-center">
                            {months[month]} {year}
                        </h3>
                        <button
                            onClick={nextMonth}
                            className="p-2 rounded-lg text-[var(--color-steel)] hover:bg-[rgba(255,255,255,0.05)]"
                        >
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex items-center gap-1">
                        {[
                            { id: 'all', label: 'All' },
                            { id: 'filing', label: 'Filings' },
                            { id: 'deadline', label: 'Deadlines' },
                            { id: 'enrollment', label: 'Enrollment' },
                            { id: 'audit', label: 'Audits' },
                        ].map(f => (
                            <button
                                key={f.id}
                                onClick={() => setFilterType(f.id)}
                                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${filterType === f.id
                                    ? 'bg-[var(--color-synapse-teal)] text-black'
                                    : 'text-[var(--color-steel)] hover:bg-[rgba(255,255,255,0.05)]'
                                    }`}
                            >
                                {f.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-4 divide-x divide-[var(--glass-border)]">
                {/* Calendar Grid */}
                <div className="col-span-3 p-5">
                    {/* Weekday Headers */}
                    <div className="grid grid-cols-7 gap-2 mb-2">
                        {weekdays.map(day => (
                            <div key={day} className="text-center text-xs font-medium text-[var(--color-steel)] py-2">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Calendar Days */}
                    <div className="grid grid-cols-7 gap-2">
                        {generateCalendarDays()}
                    </div>
                </div>

                {/* Upcoming Events Sidebar */}
                <div className="p-5">
                    <h4 className="font-medium text-white mb-4 flex items-center gap-2">
                        <Clock className="w-4 h-4 text-[var(--color-synapse-teal)]" />
                        Upcoming
                    </h4>
                    <div className="space-y-3">
                        {upcomingEvents.map(event => {
                            const config = eventTypeConfig[event.type];
                            const Icon = config.icon;
                            const eventDate = new Date(event.date);
                            const daysUntil = Math.ceil((eventDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

                            return (
                                <button
                                    key={event.id}
                                    onClick={() => openEventDetails(event)}
                                    className="w-full p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)] hover:border-[var(--glass-border-hover)] transition-all text-left"
                                >
                                    <div className="flex items-start gap-2 mb-2">
                                        <div className={`w-6 h-6 rounded flex items-center justify-center ${config.bgColor}`}>
                                            <Icon className={`w-3 h-3 ${config.color}`} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white truncate">{event.title}</p>
                                            <p className="text-xs text-[var(--color-steel)]">
                                                {eventDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                            </p>
                                        </div>
                                    </div>
                                    <div className={`text-xs ${daysUntil <= 7 ? 'text-[var(--color-critical)]' : daysUntil <= 30 ? 'text-[var(--color-warning)]' : 'text-[var(--color-steel)]'}`}>
                                        {daysUntil <= 0 ? 'Today' : daysUntil === 1 ? 'Tomorrow' : `${daysUntil} days`}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            </div>

            {/* Event Details Modal */}
            <AnimatePresence>
                {showEventModal && selectedEvent && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowEventModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="glass-card w-full max-w-md"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-5 border-b border-[var(--glass-border)] flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${eventTypeConfig[selectedEvent.type].bgColor}`}>
                                        {(() => {
                                            const Icon = eventTypeConfig[selectedEvent.type].icon;
                                            return <Icon className={`w-5 h-5 ${eventTypeConfig[selectedEvent.type].color}`} />;
                                        })()}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white">{selectedEvent.title}</h3>
                                        <p className="text-xs text-[var(--color-steel)] capitalize">{selectedEvent.type}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowEventModal(false)}
                                    className="p-2 rounded-lg text-[var(--color-steel)] hover:bg-[rgba(255,255,255,0.05)]"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-5 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-xs text-[var(--color-steel)] mb-1">Date</p>
                                        <p className="font-medium text-white">
                                            {new Date(selectedEvent.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-[var(--color-steel)] mb-1">Priority</p>
                                        <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${selectedEvent.priority === 'high'
                                                ? 'bg-[rgba(239,68,68,0.1)] text-[var(--color-critical)]'
                                                : selectedEvent.priority === 'medium'
                                                    ? 'bg-[rgba(245,158,11,0.1)] text-[var(--color-warning)]'
                                                    : 'bg-[rgba(255,255,255,0.05)] text-[var(--color-steel)]'
                                            }`}>
                                            {selectedEvent.priority}
                                        </span>
                                    </div>
                                </div>

                                {selectedEvent.description && (
                                    <div>
                                        <p className="text-xs text-[var(--color-steel)] mb-1">Description</p>
                                        <p className="text-sm text-[var(--color-silver)]">{selectedEvent.description}</p>
                                    </div>
                                )}

                                {selectedEvent.affectedEntities && (
                                    <div>
                                        <p className="text-xs text-[var(--color-steel)] mb-1">Affected</p>
                                        <p className="text-sm text-white">{selectedEvent.affectedEntities.toLocaleString()} {selectedEvent.type === 'audit' ? 'organizations' : 'employees'}</p>
                                    </div>
                                )}

                                <div>
                                    <p className="text-xs text-[var(--color-steel)] mb-1">Status</p>
                                    <span className={`px-2 py-1 text-xs font-medium rounded capitalize ${selectedEvent.status === 'completed'
                                            ? 'bg-[rgba(16,185,129,0.1)] text-[var(--color-success)]'
                                            : selectedEvent.status === 'overdue'
                                                ? 'bg-[rgba(239,68,68,0.1)] text-[var(--color-critical)]'
                                                : selectedEvent.status === 'due_soon'
                                                    ? 'bg-[rgba(245,158,11,0.1)] text-[var(--color-warning)]'
                                                    : 'bg-[rgba(6,182,212,0.1)] text-[var(--color-synapse-teal)]'
                                        }`}>
                                        {selectedEvent.status.replace('_', ' ')}
                                    </span>
                                </div>
                            </div>

                            <div className="p-5 border-t border-[var(--glass-border)] flex justify-end gap-3">
                                <button className="btn-secondary">
                                    Set Reminder
                                </button>
                                <button className="btn-primary">
                                    Mark Complete
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default ComplianceCalendar;
