'use client';

import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, TrendingDown, AlertTriangle, PieChart, BarChart3, Calendar, Users, Activity } from 'lucide-react';

interface Claim { id: string; claimNumber: string; employeeId: string; dateOfService: string; amount: number; status: 'pending' | 'approved' | 'denied' | 'processing'; claimType: 'medical' | 'rx' | 'dental' | 'vision'; provider?: string; }

interface ClaimsAnalysisDashboardProps { claims: Claim[]; totalPaidYTD: number; totalPendingAmount: number; avgClaimAmount: number; topCategories: { category: string; amount: number; count: number }[]; className?: string; }

export function ClaimsAnalysisDashboard({ claims, totalPaidYTD, totalPendingAmount, avgClaimAmount, topCategories, className = '' }: ClaimsAnalysisDashboardProps) {
    const getStatusColor = (status: Claim['status']) => {
        const colors = { pending: 'text-amber-400 bg-amber-500/10', approved: 'text-emerald-400 bg-emerald-500/10', denied: 'text-red-400 bg-red-500/10', processing: 'text-cyan-400 bg-cyan-500/10' };
        return colors[status];
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`glass-card overflow-hidden ${className}`}>
            <div className="p-5 border-b border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-green-500/20 flex items-center justify-center">
                        <Activity className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>Claims Analysis</h2>
                        <p className="text-xs text-[#64748B]">{claims.length} claims this period</p>
                    </div>
                </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-4 gap-px bg-[rgba(255,255,255,0.04)]">
                {[
                    { label: 'Paid YTD', value: `$${(totalPaidYTD / 1000).toFixed(0)}K`, color: 'text-emerald-400' },
                    { label: 'Pending', value: `$${(totalPendingAmount / 1000).toFixed(0)}K`, color: 'text-amber-400' },
                    { label: 'Avg Claim', value: `$${avgClaimAmount.toFixed(0)}`, color: 'text-white' },
                    { label: 'Claims', value: claims.length, color: 'text-cyan-400' },
                ].map((stat, i) => (
                    <div key={i} className="p-4 bg-[#0A0A0F]">
                        <p className={`text-xl font-bold font-mono ${stat.color}`}>{stat.value}</p>
                        <p className="text-[10px] text-[#64748B] uppercase tracking-wider">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Top Categories */}
            <div className="p-5 border-b border-[rgba(255,255,255,0.06)]">
                <h3 className="text-xs font-medium text-[#94A3B8] mb-3">Top Categories</h3>
                <div className="space-y-2">
                    {topCategories.map((cat, i) => {
                        const maxAmount = Math.max(...topCategories.map(c => c.amount));
                        const width = (cat.amount / maxAmount) * 100;
                        return (
                            <div key={cat.category} className="flex items-center gap-3">
                                <span className="text-xs text-white w-24 truncate">{cat.category}</span>
                                <div className="flex-1 h-2 rounded-full bg-[rgba(255,255,255,0.04)] overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${width}%` }} transition={{ delay: i * 0.1 }} className="h-full bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full" />
                                </div>
                                <span className="text-xs font-mono text-[#94A3B8] w-20 text-right">${(cat.amount / 1000).toFixed(1)}K</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Recent Claims */}
            <div className="divide-y divide-[rgba(255,255,255,0.04)]">
                {claims.slice(0, 5).map((claim, index) => (
                    <motion.div key={claim.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * 0.03 }} className="p-4 hover:bg-[rgba(255,255,255,0.02)]">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="text-sm font-medium text-white">{claim.claimNumber}</p>
                                    <span className={`px-1.5 py-0.5 text-[9px] font-bold uppercase rounded ${getStatusColor(claim.status)}`}>{claim.status}</span>
                                </div>
                                <p className="text-xs text-[#64748B] mt-0.5">{claim.claimType} • {claim.dateOfService} {claim.provider && `• ${claim.provider}`}</p>
                            </div>
                            <p className="text-sm font-bold font-mono text-white">${claim.amount.toLocaleString()}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

interface BudgetTrackerProps { allocated: number; spent: number; projected: number; categories: { name: string; budget: number; spent: number }[]; className?: string; }

export function BudgetTracker({ allocated, spent, projected, categories, className = '' }: BudgetTrackerProps) {
    const utilizationPct = (spent / allocated) * 100;
    const projectedPct = (projected / allocated) * 100;
    const isOverBudget = projectedPct > 100;

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`glass-card overflow-hidden ${className}`}>
            <div className="p-5 border-b border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isOverBudget ? 'bg-red-500/20' : 'bg-emerald-500/20'}`}>
                        <DollarSign className={`w-5 h-5 ${isOverBudget ? 'text-red-400' : 'text-emerald-400'}`} />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>Budget Tracker</h2>
                        <p className="text-xs text-[#64748B]">${(allocated / 1000000).toFixed(1)}M allocated</p>
                    </div>
                </div>
            </div>

            <div className="p-5">
                {/* Progress */}
                <div className="mb-6">
                    <div className="flex justify-between text-xs mb-2">
                        <span className="text-[#94A3B8]">Budget Utilization</span>
                        <span className={`font-mono ${isOverBudget ? 'text-red-400' : 'text-white'}`}>{utilizationPct.toFixed(1)}%</span>
                    </div>
                    <div className="h-3 rounded-full bg-[rgba(255,255,255,0.04)] overflow-hidden relative">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(utilizationPct, 100)}%` }} className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
                        {projectedPct > utilizationPct && <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(projectedPct, 100)}%` }} className="absolute top-0 left-0 h-full bg-amber-500/30 rounded-full" style={{ opacity: 0.5 }} />}
                    </div>
                    <div className="flex justify-between text-[10px] mt-1 text-[#64748B]">
                        <span>Spent: ${(spent / 1000000).toFixed(2)}M</span>
                        <span className={isOverBudget ? 'text-red-400' : ''}>Projected: ${(projected / 1000000).toFixed(2)}M</span>
                    </div>
                </div>

                {/* Category Breakdown */}
                <h3 className="text-xs font-medium text-[#94A3B8] mb-3">By Category</h3>
                <div className="space-y-3">
                    {categories.map(cat => {
                        const catPct = (cat.spent / cat.budget) * 100;
                        const isOver = catPct > 100;
                        return (
                            <div key={cat.name}>
                                <div className="flex justify-between text-xs mb-1">
                                    <span className="text-white">{cat.name}</span>
                                    <span className={`font-mono ${isOver ? 'text-red-400' : 'text-[#94A3B8]'}`}>${(cat.spent / 1000).toFixed(0)}K / ${(cat.budget / 1000).toFixed(0)}K</span>
                                </div>
                                <div className="h-1.5 rounded-full bg-[rgba(255,255,255,0.04)] overflow-hidden">
                                    <motion.div initial={{ width: 0 }} animate={{ width: `${Math.min(catPct, 100)}%` }} className={`h-full rounded-full ${isOver ? 'bg-red-500' : 'bg-cyan-500'}`} />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
}

export default ClaimsAnalysisDashboard;
