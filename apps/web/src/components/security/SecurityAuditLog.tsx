'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield,
    Lock,
    Unlock,
    Eye,
    AlertTriangle,
    CheckCircle2,
    XCircle,
    RefreshCw,
    Clock,
    User,
    MapPin,
    Monitor,
    Smartphone,
    Globe,
    ChevronDown,
    Key,
    FileText,
    Activity
} from 'lucide-react';

interface SecurityAuditLogProps {
    className?: string;
}

interface AuditEvent {
    id: string;
    timestamp: string;
    eventType: 'login' | 'logout' | 'api_access' | 'data_export' | 'permission_change' | 'failed_login' | '2fa_enabled' | 'password_reset';
    actor: string;
    actorEmail: string;
    ipAddress: string;
    location: string;
    device: string;
    browser: string;
    resource: string;
    action: string;
    status: 'success' | 'failure' | 'warning';
    details: string;
}

const mockEvents: AuditEvent[] = [
    {
        id: 'ae1',
        timestamp: '2026-01-29 11:45:32 AM',
        eventType: 'api_access',
        actor: 'HRIS Integration',
        actorEmail: 'system@integration.local',
        ipAddress: '192.168.1.100',
        location: 'New York, US',
        device: 'Server',
        browser: 'API Client v2.1',
        resource: '/api/v1/employees',
        action: 'GET',
        status: 'success',
        details: 'Retrieved 892 employee records'
    },
    {
        id: 'ae2',
        timestamp: '2026-01-29 11:30:15 AM',
        eventType: 'login',
        actor: 'Sarah Johnson',
        actorEmail: 'sarah.johnson@company.com',
        ipAddress: '74.125.224.72',
        location: 'San Francisco, US',
        device: 'Desktop',
        browser: 'Chrome 121',
        resource: '/auth/login',
        action: 'POST',
        status: 'success',
        details: '2FA verification completed'
    },
    {
        id: 'ae3',
        timestamp: '2026-01-29 11:15:45 AM',
        eventType: 'data_export',
        actor: 'Michael Chen',
        actorEmail: 'michael.chen@company.com',
        ipAddress: '98.156.45.123',
        location: 'Chicago, US',
        device: 'Desktop',
        browser: 'Firefox 122',
        resource: '/reports/1095c-batch',
        action: 'EXPORT',
        status: 'success',
        details: 'Exported 2,456 Form 1095-C records to CSV'
    },
    {
        id: 'ae4',
        timestamp: '2026-01-29 10:58:12 AM',
        eventType: 'failed_login',
        actor: 'Unknown',
        actorEmail: 'admin@company.com',
        ipAddress: '185.220.101.45',
        location: 'Moscow, RU',
        device: 'Unknown',
        browser: 'Unknown',
        resource: '/auth/login',
        action: 'POST',
        status: 'failure',
        details: 'Invalid password (3rd attempt)'
    },
    {
        id: 'ae5',
        timestamp: '2026-01-29 10:45:00 AM',
        eventType: 'permission_change',
        actor: 'Admin User',
        actorEmail: 'admin@company.com',
        ipAddress: '192.168.1.50',
        location: 'New York, US',
        device: 'Desktop',
        browser: 'Edge 121',
        resource: '/users/sarah.johnson',
        action: 'UPDATE',
        status: 'success',
        details: 'Granted "Report Export" permission'
    },
    {
        id: 'ae6',
        timestamp: '2026-01-29 10:30:22 AM',
        eventType: '2fa_enabled',
        actor: 'Emily Davis',
        actorEmail: 'emily.davis@company.com',
        ipAddress: '73.45.178.90',
        location: 'Austin, US',
        device: 'Mobile',
        browser: 'Safari iOS 17',
        resource: '/settings/security',
        action: 'ENABLE',
        status: 'success',
        details: 'Enabled authenticator app 2FA'
    },
];

function getEventTypeIcon(type: string) {
    switch (type) {
        case 'login': return { icon: Unlock, color: 'text-[var(--color-success)]', bg: 'bg-[rgba(16,185,129,0.1)]' };
        case 'logout': return { icon: Lock, color: 'text-[var(--color-steel)]', bg: 'bg-[rgba(255,255,255,0.05)]' };
        case 'api_access': return { icon: Key, color: 'text-[var(--color-synapse-teal)]', bg: 'bg-[rgba(6,182,212,0.1)]' };
        case 'data_export': return { icon: FileText, color: 'text-purple-400', bg: 'bg-[rgba(139,92,246,0.1)]' };
        case 'permission_change': return { icon: Shield, color: 'text-[var(--color-warning)]', bg: 'bg-[rgba(245,158,11,0.1)]' };
        case 'failed_login': return { icon: XCircle, color: 'text-[var(--color-critical)]', bg: 'bg-[rgba(239,68,68,0.1)]' };
        case '2fa_enabled': return { icon: Shield, color: 'text-[var(--color-success)]', bg: 'bg-[rgba(16,185,129,0.1)]' };
        case 'password_reset': return { icon: RefreshCw, color: 'text-[var(--color-warning)]', bg: 'bg-[rgba(245,158,11,0.1)]' };
        default: return { icon: Activity, color: 'text-[var(--color-steel)]', bg: 'bg-[rgba(255,255,255,0.05)]' };
    }
}

function getStatusBadge(status: string) {
    switch (status) {
        case 'success': return { bg: 'bg-[rgba(16,185,129,0.1)]', text: 'text-[var(--color-success)]', border: 'border-[rgba(16,185,129,0.3)]' };
        case 'failure': return { bg: 'bg-[rgba(239,68,68,0.1)]', text: 'text-[var(--color-critical)]', border: 'border-[rgba(239,68,68,0.3)]' };
        case 'warning': return { bg: 'bg-[rgba(245,158,11,0.1)]', text: 'text-[var(--color-warning)]', border: 'border-[rgba(245,158,11,0.3)]' };
        default: return { bg: 'bg-[rgba(255,255,255,0.05)]', text: 'text-[var(--color-steel)]', border: 'border-[var(--glass-border)]' };
    }
}

export function SecurityAuditLog({ className = '' }: SecurityAuditLogProps) {
    const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
    const [filterType, setFilterType] = useState<string>('all');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const stats = {
        total: mockEvents.length,
        success: mockEvents.filter(e => e.status === 'success').length,
        failures: mockEvents.filter(e => e.status === 'failure').length,
        suspicious: mockEvents.filter(e => e.location.includes('RU') || e.location.includes('CN')).length,
    };

    const filteredEvents = mockEvents.filter(event => {
        const matchesType = filterType === 'all' || event.eventType === filterType;
        const matchesStatus = filterStatus === 'all' || event.status === filterStatus;
        return matchesType && matchesStatus;
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card ${className}`}
        >
            {/* Header */}
            <div className="p-5 border-b border-[var(--glass-border)]">
                <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--color-synapse-teal)] to-[var(--color-synapse-emerald)] flex items-center justify-center">
                            <Shield className="w-5 h-5 text-black" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">Security Audit Log</h2>
                            <p className="text-xs text-[var(--color-steel)]">Real-time security event monitoring</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1 text-xs text-[var(--color-success)]">
                            <span className="w-2 h-2 rounded-full bg-[var(--color-success)] animate-pulse" />
                            Live
                        </span>
                        <button className="btn-secondary flex items-center gap-2">
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4">
                    <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)]">
                        <div className="flex items-center gap-2 mb-2">
                            <Activity className="w-4 h-4 text-[var(--color-steel)]" />
                            <span className="text-xs text-[var(--color-steel)]">Total Events</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{stats.total}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-[rgba(16,185,129,0.05)] border border-[rgba(16,185,129,0.2)]">
                        <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 className="w-4 h-4 text-[var(--color-success)]" />
                            <span className="text-xs text-[var(--color-steel)]">Successful</span>
                        </div>
                        <p className="text-2xl font-bold text-[var(--color-success)]">{stats.success}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-[rgba(239,68,68,0.05)] border border-[rgba(239,68,68,0.2)]">
                        <div className="flex items-center gap-2 mb-2">
                            <XCircle className="w-4 h-4 text-[var(--color-critical)]" />
                            <span className="text-xs text-[var(--color-steel)]">Failed</span>
                        </div>
                        <p className="text-2xl font-bold text-[var(--color-critical)]">{stats.failures}</p>
                    </div>
                    <div className="p-4 rounded-lg bg-[rgba(245,158,11,0.05)] border border-[rgba(245,158,11,0.2)]">
                        <div className="flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-4 h-4 text-[var(--color-warning)]" />
                            <span className="text-xs text-[var(--color-steel)]">Suspicious</span>
                        </div>
                        <p className="text-2xl font-bold text-[var(--color-warning)]">{stats.suspicious}</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="p-4 border-b border-[var(--glass-border)] flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <span className="text-xs text-[var(--color-steel)]">Type:</span>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="px-3 py-1.5 text-xs bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white focus:outline-none focus:border-[var(--color-synapse-teal)]"
                    >
                        <option value="all">All Types</option>
                        <option value="login">Login</option>
                        <option value="api_access">API Access</option>
                        <option value="data_export">Data Export</option>
                        <option value="permission_change">Permission Change</option>
                        <option value="failed_login">Failed Login</option>
                    </select>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-[var(--color-steel)]">Status:</span>
                    {['all', 'success', 'failure'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-3 py-1.5 text-xs font-medium rounded capitalize transition-colors ${filterStatus === status
                                ? 'bg-[var(--color-synapse-teal)] text-black'
                                : 'bg-[rgba(255,255,255,0.03)] text-[var(--color-silver)] hover:bg-[rgba(255,255,255,0.08)]'
                                }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {/* Event List */}
            <div className="divide-y divide-[var(--glass-border)] max-h-[500px] overflow-y-auto">
                {filteredEvents.map((event, index) => {
                    const typeStyle = getEventTypeIcon(event.eventType);
                    const statusStyle = getStatusBadge(event.status);
                    const TypeIcon = typeStyle.icon;

                    return (
                        <motion.div
                            key={event.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.02 }}
                        >
                            <div
                                className={`p-4 cursor-pointer transition-colors ${expandedEvent === event.id ? 'bg-[rgba(255,255,255,0.03)]' : 'hover:bg-[rgba(255,255,255,0.02)]'}`}
                                onClick={() => setExpandedEvent(expandedEvent === event.id ? null : event.id)}
                            >
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${typeStyle.bg}`}>
                                        <TypeIcon className={`w-5 h-5 ${typeStyle.color}`} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="font-medium text-white">{event.actor}</span>
                                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full border ${statusStyle.bg} ${statusStyle.text} ${statusStyle.border}`}>
                                                {event.status}
                                            </span>
                                            {event.location.includes('RU') && (
                                                <span className="px-2 py-0.5 text-[10px] font-bold uppercase rounded-full bg-[rgba(239,68,68,0.1)] text-[var(--color-critical)] border border-[rgba(239,68,68,0.3)]">
                                                    Suspicious Location
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-[var(--color-silver)]">{event.details}</p>
                                    </div>

                                    <div className="flex items-center gap-4 text-xs text-[var(--color-steel)]">
                                        <div className="flex items-center gap-1">
                                            <Globe className="w-3 h-3" />
                                            <span>{event.location}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <Clock className="w-3 h-3" />
                                            <span>{event.timestamp.split(' ').slice(1).join(' ')}</span>
                                        </div>
                                    </div>

                                    <ChevronDown className={`w-4 h-4 text-[var(--color-steel)] transition-transform ${expandedEvent === event.id ? 'rotate-180' : ''}`} />
                                </div>
                            </div>

                            <AnimatePresence>
                                {expandedEvent === event.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden border-t border-[var(--glass-border)]"
                                    >
                                        <div className="p-4 bg-[rgba(255,255,255,0.01)] grid grid-cols-4 gap-4">
                                            <div>
                                                <p className="text-xs text-[var(--color-steel)] mb-1">IP Address</p>
                                                <p className="text-sm font-mono text-white">{event.ipAddress}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-[var(--color-steel)] mb-1">Device</p>
                                                <p className="text-sm text-white">{event.device}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-[var(--color-steel)] mb-1">Browser</p>
                                                <p className="text-sm text-white">{event.browser}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-[var(--color-steel)] mb-1">Resource</p>
                                                <p className="text-sm font-mono text-[var(--color-synapse-teal)]">{event.resource}</p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}

export default SecurityAuditLog;
