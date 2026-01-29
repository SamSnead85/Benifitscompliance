'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Bell, X, Check, AlertTriangle, Info, CheckCircle2, Trash2, MailOpen, ChevronRight } from 'lucide-react';

interface Notification {
    id: string;
    type: 'info' | 'success' | 'warning' | 'error';
    title: string;
    message: string;
    timestamp: string;
    isRead: boolean;
    category?: string;
}

interface NotificationCenterProps {
    notifications: Notification[];
    onMarkRead?: (id: string) => void;
    onMarkAllRead?: () => void;
    onDelete?: (id: string) => void;
    className?: string;
}

export function NotificationCenter({
    notifications,
    onMarkRead,
    onMarkAllRead,
    onDelete,
    className = '',
}: NotificationCenterProps) {
    const [filterType, setFilterType] = useState<'all' | 'unread'>('all');
    const unreadCount = notifications.filter(n => !n.isRead).length;
    const filteredNotifications = filterType === 'unread' ? notifications.filter(n => !n.isRead) : notifications;

    const getTypeConfig = (type: Notification['type']) => {
        switch (type) {
            case 'success': return { icon: <CheckCircle2 className="w-4 h-4" />, color: 'text-emerald-400', bg: 'bg-emerald-500/10' };
            case 'warning': return { icon: <AlertTriangle className="w-4 h-4" />, color: 'text-amber-400', bg: 'bg-amber-500/10' };
            case 'error': return { icon: <AlertTriangle className="w-4 h-4" />, color: 'text-red-400', bg: 'bg-red-500/10' };
            default: return { icon: <Info className="w-4 h-4" />, color: 'text-cyan-400', bg: 'bg-cyan-500/10' };
        }
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`glass-card overflow-hidden ${className}`}>
            <div className="p-5 border-b border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <Bell className="w-5 h-5 text-white" />
                        <div>
                            <h2 className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>Notifications</h2>
                            <p className="text-xs text-[#64748B]">{unreadCount} unread</p>
                        </div>
                    </div>
                    <button onClick={onMarkAllRead} disabled={unreadCount === 0} className="px-3 py-1.5 text-xs font-medium text-[#94A3B8] hover:text-white disabled:opacity-50">Mark all read</button>
                </div>
                <div className="flex gap-2">
                    {(['all', 'unread'] as const).map(type => (
                        <button key={type} onClick={() => setFilterType(type)} className={`px-3 py-1.5 text-xs font-medium rounded-md ${filterType === type ? 'bg-cyan-500/20 text-cyan-400' : 'text-[#94A3B8] hover:bg-[rgba(255,255,255,0.04)]'}`}>
                            {type === 'all' ? 'All' : `Unread (${unreadCount})`}
                        </button>
                    ))}
                </div>
            </div>
            <div className="max-h-[400px] overflow-y-auto divide-y divide-[rgba(255,255,255,0.04)]">
                {filteredNotifications.map((notification, index) => {
                    const config = getTypeConfig(notification.type);
                    return (
                        <motion.div key={notification.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.02 }} className={`p-4 hover:bg-[rgba(255,255,255,0.02)] ${!notification.isRead ? 'bg-[rgba(255,255,255,0.01)]' : ''}`}>
                            <div className="flex gap-3">
                                <div className={`w-8 h-8 rounded-full ${config.bg} flex items-center justify-center ${config.color}`}>{config.icon}</div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className={`text-sm font-medium ${notification.isRead ? 'text-[#94A3B8]' : 'text-white'}`}>{notification.title}</h4>
                                        {!notification.isRead && <span className="w-2 h-2 rounded-full bg-cyan-400" />}
                                    </div>
                                    <p className="text-xs text-[#64748B] mb-1">{notification.message}</p>
                                    <span className="text-[10px] text-[#64748B]">{notification.timestamp}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                    {!notification.isRead && <button onClick={() => onMarkRead?.(notification.id)} className="p-1.5 rounded hover:bg-[rgba(255,255,255,0.06)] text-[#64748B]"><MailOpen className="w-3.5 h-3.5" /></button>}
                                    <button onClick={() => onDelete?.(notification.id)} className="p-1.5 rounded hover:bg-red-500/10 text-[#64748B] hover:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
                {filteredNotifications.length === 0 && <div className="p-12 text-center"><Bell className="w-10 h-10 text-[#64748B] mx-auto mb-3 opacity-50" /><p className="text-sm text-[#94A3B8]">No notifications</p></div>}
            </div>
        </motion.div>
    );
}

interface ToastProps { id: string; type: 'info' | 'success' | 'warning' | 'error'; title: string; message?: string; onClose: () => void; }

export function Toast({ type, title, message, onClose }: ToastProps) {
    const configs = { success: { icon: <CheckCircle2 className="w-5 h-5" />, color: 'text-emerald-400', border: 'border-emerald-500/30' }, warning: { icon: <AlertTriangle className="w-5 h-5" />, color: 'text-amber-400', border: 'border-amber-500/30' }, error: { icon: <AlertTriangle className="w-5 h-5" />, color: 'text-red-400', border: 'border-red-500/30' }, info: { icon: <Info className="w-5 h-5" />, color: 'text-cyan-400', border: 'border-cyan-500/30' } };
    const config = configs[type];
    return (
        <motion.div initial={{ opacity: 0, y: -20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: -20 }} className={`flex items-start gap-3 p-4 rounded-lg bg-[#15151F] border ${config.border} shadow-lg max-w-sm`}>
            <div className={config.color}>{config.icon}</div>
            <div className="flex-1"><p className="text-sm font-medium text-white">{title}</p>{message && <p className="text-xs text-[#94A3B8] mt-0.5">{message}</p>}</div>
            <button onClick={onClose} className="p-1 rounded hover:bg-[rgba(255,255,255,0.06)] text-[#64748B]"><X className="w-4 h-4" /></button>
        </motion.div>
    );
}

export function InlineAlert({ type, title, message, dismissible = false, onDismiss, className = '' }: { type: 'info' | 'success' | 'warning' | 'error'; title?: string; message: string; dismissible?: boolean; onDismiss?: () => void; className?: string; }) {
    const configs = { success: { icon: <CheckCircle2 className="w-4 h-4" />, color: 'text-emerald-400', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' }, warning: { icon: <AlertTriangle className="w-4 h-4" />, color: 'text-amber-400', border: 'border-amber-500/30', bg: 'bg-amber-500/10' }, error: { icon: <AlertTriangle className="w-4 h-4" />, color: 'text-red-400', border: 'border-red-500/30', bg: 'bg-red-500/10' }, info: { icon: <Info className="w-4 h-4" />, color: 'text-cyan-400', border: 'border-cyan-500/30', bg: 'bg-cyan-500/10' } };
    const config = configs[type];
    return (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className={`flex items-start gap-3 p-4 rounded-lg ${config.bg} border ${config.border} ${className}`}>
            <div className={`${config.color} flex-shrink-0 mt-0.5`}>{config.icon}</div>
            <div className="flex-1">{title && <p className="text-sm font-medium text-white mb-0.5">{title}</p>}<p className="text-sm text-[#94A3B8]">{message}</p></div>
            {dismissible && <button onClick={onDismiss} className="p-1 rounded hover:bg-[rgba(255,255,255,0.06)] text-[#64748B]"><X className="w-4 h-4" /></button>}
        </motion.div>
    );
}

export default NotificationCenter;
