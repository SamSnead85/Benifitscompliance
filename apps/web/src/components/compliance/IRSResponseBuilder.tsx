'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Shield, FileText, AlertTriangle, CheckCircle2, Clock, Calendar, Building2, Users, DollarSign, ChevronRight, Search, Filter } from 'lucide-react';

interface IRSNotice { id: string; noticeNumber: string; receivedDate: string; responseDeadline: string; type: 'penalty_assessment' | 'information_request' | 'proposed_penalty' | 'determination'; status: 'pending' | 'in_progress' | 'responded' | 'resolved'; amount?: number; }

interface IRSResponseBuilderProps { notices: IRSNotice[]; onRespond?: (notice: IRSNotice) => void; onViewDetails?: (notice: IRSNotice) => void; className?: string; }

export function IRSResponseBuilder({ notices, onRespond, onViewDetails, className = '' }: IRSResponseBuilderProps) {
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const getTypeLabel = (type: IRSNotice['type']) => {
        const labels = { penalty_assessment: 'Penalty Assessment', information_request: 'Information Request', proposed_penalty: 'Proposed Penalty', determination: 'Determination' };
        return labels[type];
    };

    const getStatusConfig = (status: IRSNotice['status']) => {
        const configs = { pending: { color: 'text-amber-400', bg: 'bg-amber-500/10', label: 'Pending' }, in_progress: { color: 'text-cyan-400', bg: 'bg-cyan-500/10', label: 'In Progress' }, responded: { color: 'text-blue-400', bg: 'bg-blue-500/10', label: 'Responded' }, resolved: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Resolved' } };
        return configs[status];
    };

    const filtered = filterStatus === 'all' ? notices : notices.filter(n => n.status === filterStatus);

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`glass-card overflow-hidden ${className}`}>
            <div className="p-5 border-b border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-red-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>IRS Response Center</h2>
                            <p className="text-xs text-[#64748B]">{notices.filter(n => n.status === 'pending').length} pending responses</p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    {['all', 'pending', 'in_progress', 'responded', 'resolved'].map(status => (
                        <button key={status} onClick={() => setFilterStatus(status)} className={`px-3 py-1.5 text-xs font-medium rounded-md capitalize ${filterStatus === status ? 'bg-cyan-500/20 text-cyan-400' : 'text-[#94A3B8] hover:bg-[rgba(255,255,255,0.04)]'}`}>
                            {status === 'all' ? 'All' : status.replace('_', ' ')}
                        </button>
                    ))}
                </div>
            </div>
            <div className="divide-y divide-[rgba(255,255,255,0.04)]">
                {filtered.map((notice, index) => {
                    const statusConfig = getStatusConfig(notice.status);
                    const isUrgent = new Date(notice.responseDeadline) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
                    return (
                        <motion.div key={notice.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.02 }} className="p-4 hover:bg-[rgba(255,255,255,0.02)] cursor-pointer group" onClick={() => onViewDetails?.(notice)}>
                            <div className="flex items-start gap-4">
                                <div className={`w-10 h-10 rounded-lg ${isUrgent ? 'bg-red-500/20' : 'bg-[rgba(255,255,255,0.04)]'} flex items-center justify-center`}>
                                    {isUrgent ? <AlertTriangle className="w-5 h-5 text-red-400" /> : <FileText className="w-5 h-5 text-[#64748B]" />}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <p className="text-sm font-medium text-white">Notice {notice.noticeNumber}</p>
                                        <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase rounded ${statusConfig.bg} ${statusConfig.color}`}>{statusConfig.label}</span>
                                        {isUrgent && <span className="px-1.5 py-0.5 text-[9px] font-bold uppercase rounded bg-red-500/10 text-red-400">Urgent</span>}
                                    </div>
                                    <p className="text-xs text-[#64748B]">{getTypeLabel(notice.type)}</p>
                                    <div className="flex items-center gap-4 mt-2 text-[10px] text-[#64748B]">
                                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />Received: {notice.receivedDate}</span>
                                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Due: {notice.responseDeadline}</span>
                                        {notice.amount && <span className="flex items-center gap-1 text-red-400"><DollarSign className="w-3 h-3" />${notice.amount.toLocaleString()}</span>}
                                    </div>
                                </div>
                                {notice.status === 'pending' && (
                                    <motion.button onClick={e => { e.stopPropagation(); onRespond?.(notice); }} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="px-3 py-1.5 text-xs font-medium bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 rounded-lg hover:bg-cyan-500/20">Respond</motion.button>
                                )}
                                <ChevronRight className="w-4 h-4 text-[#64748B] opacity-0 group-hover:opacity-100" />
                            </div>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}

interface EvidenceItem { id: string; type: 'document' | 'data_export' | 'screenshot' | 'attestation'; name: string; addedDate: string; addedBy: string; }

interface EvidenceCollectionProps { items: EvidenceItem[]; onAdd?: () => void; onDownload?: (item: EvidenceItem) => void; className?: string; }

export function EvidenceCollection({ items, onAdd, onDownload, className = '' }: EvidenceCollectionProps) {
    const getTypeIcon = (type: EvidenceItem['type']) => {
        const icons = { document: <FileText className="w-4 h-4" />, data_export: <Shield className="w-4 h-4" />, screenshot: <FileText className="w-4 h-4" />, attestation: <CheckCircle2 className="w-4 h-4" /> };
        return icons[type];
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`glass-card overflow-hidden ${className}`}>
            <div className="p-5 border-b border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-violet-500/20 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-purple-400" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>Evidence Collection</h2>
                            <p className="text-xs text-[#64748B]">{items.length} items collected</p>
                        </div>
                    </div>
                    <motion.button onClick={onAdd} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="px-3 py-1.5 text-xs font-medium bg-gradient-to-b from-cyan-500 to-teal-600 text-[#030712] rounded-lg">+ Add Evidence</motion.button>
                </div>
            </div>
            <div className="divide-y divide-[rgba(255,255,255,0.04)]">
                {items.map((item, index) => (
                    <motion.div key={item.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.02 }} className="p-4 hover:bg-[rgba(255,255,255,0.02)] flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-[rgba(255,255,255,0.04)] flex items-center justify-center text-[#64748B]">{getTypeIcon(item.type)}</div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-white">{item.name}</p>
                            <p className="text-[10px] text-[#64748B]">Added {item.addedDate} by {item.addedBy}</p>
                        </div>
                        <button onClick={() => onDownload?.(item)} className="p-2 rounded-lg hover:bg-[rgba(255,255,255,0.06)] text-[#64748B] hover:text-white"><FileText className="w-4 h-4" /></button>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

export default IRSResponseBuilder;
