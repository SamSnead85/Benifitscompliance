'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { FileText, Calendar, Clock, User, Filter, Search, Download, ChevronRight, Eye, Shield, AlertTriangle } from 'lucide-react';

interface AuditEvent { id: string; timestamp: string; action: string; user: string; category: 'data_change' | 'access' | 'export' | 'system' | 'compliance'; details: string; ipAddress?: string; }

interface AuditLogViewerProps { events: AuditEvent[]; onExport?: () => void; onViewDetails?: (event: AuditEvent) => void; className?: string; }

export function AuditLogViewer({ events, onExport, onViewDetails, className = '' }: AuditLogViewerProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState<string>('all');

    const categories = [{ id: 'all', label: 'All' }, { id: 'data_change', label: 'Data Changes' }, { id: 'access', label: 'Access' }, { id: 'export', label: 'Exports' }, { id: 'compliance', label: 'Compliance' }];

    const getCategoryConfig = (cat: AuditEvent['category']) => {
        const configs = { data_change: { color: 'text-cyan-400', bg: 'bg-cyan-500/10' }, access: { color: 'text-purple-400', bg: 'bg-purple-500/10' }, export: { color: 'text-emerald-400', bg: 'bg-emerald-500/10' }, system: { color: 'text-[#94A3B8]', bg: 'bg-[rgba(255,255,255,0.04)]' }, compliance: { color: 'text-amber-400', bg: 'bg-amber-500/10' } };
        return configs[cat] || configs.system;
    };

    const filtered = events.filter(e => {
        const matchesSearch = e.action.toLowerCase().includes(searchQuery.toLowerCase()) || e.user.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === 'all' || e.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`glass-card overflow-hidden ${className}`}>
            <div className="p-5 border-b border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-violet-500/20 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>Audit Log</h2>
                            <p className="text-xs text-[#64748B]">{events.length} events</p>
                        </div>
                    </div>
                    <motion.button onClick={onExport} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="px-3 py-1.5 text-xs font-medium flex items-center gap-1 bg-[rgba(255,255,255,0.04)] text-[#94A3B8] hover:text-white rounded-lg">
                        <Download className="w-3.5 h-3.5" />Export
                    </motion.button>
                </div>
                <div className="flex gap-3">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#64748B]" />
                        <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search audit log..." className="w-full pl-10 pr-4 py-2 text-sm text-white bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-lg focus:outline-none focus:border-cyan-500/50" />
                    </div>
                    <div className="flex gap-1">
                        {categories.map(cat => (
                            <button key={cat.id} onClick={() => setFilterCategory(cat.id)} className={`px-3 py-2 text-xs font-medium rounded-lg whitespace-nowrap ${filterCategory === cat.id ? 'bg-cyan-500/20 text-cyan-400' : 'text-[#94A3B8] hover:bg-[rgba(255,255,255,0.04)]'}`}>{cat.label}</button>
                        ))}
                    </div>
                </div>
            </div>
            <div className="max-h-[500px] overflow-y-auto divide-y divide-[rgba(255,255,255,0.04)]">
                {filtered.map((event, index) => {
                    const config = getCategoryConfig(event.category);
                    return (
                        <motion.div key={event.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.02 }} className="p-4 hover:bg-[rgba(255,255,255,0.02)] transition-colors cursor-pointer group" onClick={() => onViewDetails?.(event)}>
                            <div className="flex items-start gap-3">
                                <div className={`w-8 h-8 rounded-full ${config.bg} flex items-center justify-center ${config.color}`}><FileText className="w-4 h-4" /></div>
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-white">{event.action}</p>
                                    <p className="text-xs text-[#64748B] mt-0.5">{event.details}</p>
                                    <div className="flex items-center gap-3 mt-2 text-[10px] text-[#64748B]">
                                        <span className="flex items-center gap-1"><User className="w-3 h-3" />{event.user}</span>
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{event.timestamp}</span>
                                        {event.ipAddress && <span>{event.ipAddress}</span>}
                                    </div>
                                </div>
                                <ChevronRight className="w-4 h-4 text-[#64748B] opacity-0 group-hover:opacity-100 transition-opacity" />
                            </div>
                        </motion.div>
                    );
                })}
                {filtered.length === 0 && <div className="p-12 text-center"><Shield className="w-10 h-10 text-[#64748B] mx-auto mb-3 opacity-50" /><p className="text-sm text-[#94A3B8]">No events found</p></div>}
            </div>
        </motion.div>
    );
}

interface ComplianceCalendarProps { events: { date: string; title: string; type: 'deadline' | 'filing' | 'reminder' }[]; onEventClick?: (event: { date: string; title: string }) => void; className?: string; }

export function ComplianceCalendar({ events, onEventClick, className = '' }: ComplianceCalendarProps) {
    const [currentMonth] = useState(new Date());
    const typeColors = { deadline: 'bg-red-500', filing: 'bg-cyan-500', reminder: 'bg-amber-500' };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`glass-card overflow-hidden ${className}`}>
            <div className="p-5 border-b border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-teal-500/20 flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>Compliance Calendar</h2>
                        <p className="text-xs text-[#64748B]">{currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}</p>
                    </div>
                </div>
            </div>
            <div className="p-5">
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => <div key={day} className="text-[10px] text-[#64748B] text-center py-2">{day}</div>)}
                </div>
                <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: 35 }).map((_, i) => {
                        const day = i - new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() + 1;
                        const isCurrentMonth = day > 0 && day <= new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
                        const dayEvents = events.filter(e => new Date(e.date).getDate() === day);
                        return (
                            <div key={i} className={`p-2 min-h-[60px] rounded-lg ${isCurrentMonth ? 'bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.04)]' : ''}`}>
                                {isCurrentMonth && <p className="text-xs text-[#94A3B8] mb-1">{day}</p>}
                                {dayEvents.map((e, idx) => <div key={idx} className={`text-[9px] px-1 py-0.5 rounded mb-0.5 truncate cursor-pointer ${typeColors[e.type]} bg-opacity-20`} onClick={() => onEventClick?.(e)}>{e.title}</div>)}
                            </div>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
}

export default AuditLogViewer;
