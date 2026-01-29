'use client';

import { motion } from 'framer-motion';
import { Users, Calendar, Clock, TrendingUp, TrendingDown, AlertTriangle, CheckCircle2, Shield, Activity, Building2 } from 'lucide-react';

interface WorkforceMetric { label: string; value: number | string; change?: number; trend?: 'up' | 'down' | 'flat'; status?: 'good' | 'warning' | 'danger'; }

interface WorkforceDashboardProps { totalEmployees: number; fullTimeCount: number; partTimeCount: number; variableHourCount: number; eligibilityRate: number; metrics: WorkforceMetric[]; className?: string; }

export function WorkforceDashboard({ totalEmployees, fullTimeCount, partTimeCount, variableHourCount, eligibilityRate, metrics, className = '' }: WorkforceDashboardProps) {
    const ftPct = (fullTimeCount / totalEmployees) * 100;
    const ptPct = (partTimeCount / totalEmployees) * 100;
    const vhPct = (variableHourCount / totalEmployees) * 100;

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`glass-card overflow-hidden ${className}`}>
            <div className="p-5 border-b border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-teal-500/20 flex items-center justify-center">
                        <Users className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>Workforce Overview</h2>
                        <p className="text-xs text-[#64748B]">{totalEmployees.toLocaleString()} active employees</p>
                    </div>
                </div>
            </div>

            {/* Distribution Bar */}
            <div className="p-5 border-b border-[rgba(255,255,255,0.06)]">
                <div className="flex h-4 rounded-full overflow-hidden bg-[rgba(255,255,255,0.04)]">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${ftPct}%` }} className="bg-emerald-500" title={`Full-Time: ${ftPct.toFixed(1)}%`} />
                    <motion.div initial={{ width: 0 }} animate={{ width: `${ptPct}%` }} transition={{ delay: 0.1 }} className="bg-cyan-500" title={`Part-Time: ${ptPct.toFixed(1)}%`} />
                    <motion.div initial={{ width: 0 }} animate={{ width: `${vhPct}%` }} transition={{ delay: 0.2 }} className="bg-amber-500" title={`Variable: ${vhPct.toFixed(1)}%`} />
                </div>
                <div className="flex justify-between mt-3 text-xs">
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-emerald-500" /><span className="text-[#94A3B8]">Full-Time</span><span className="font-mono text-white">{fullTimeCount.toLocaleString()}</span></div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-cyan-500" /><span className="text-[#94A3B8]">Part-Time</span><span className="font-mono text-white">{partTimeCount.toLocaleString()}</span></div>
                    <div className="flex items-center gap-2"><span className="w-3 h-3 rounded bg-amber-500" /><span className="text-[#94A3B8]">Variable</span><span className="font-mono text-white">{variableHourCount.toLocaleString()}</span></div>
                </div>
            </div>

            {/* Eligibility Rate */}
            <div className="p-5 border-b border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center justify-between mb-2">
                    <span className="text-xs text-[#94A3B8]">ACA Eligibility Rate</span>
                    <span className="text-lg font-bold font-mono text-emerald-400">{eligibilityRate.toFixed(1)}%</span>
                </div>
                <div className="h-2 rounded-full bg-[rgba(255,255,255,0.04)] overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${eligibilityRate}%` }} className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full" />
                </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-px bg-[rgba(255,255,255,0.04)]">
                {metrics.map((metric, i) => (
                    <div key={i} className="p-4 bg-[#0A0A0F]">
                        <div className="flex items-center justify-between mb-1">
                            {metric.change !== undefined && (
                                <span className={`flex items-center gap-0.5 text-[10px] ${metric.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                    {metric.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                    {Math.abs(metric.change)}%
                                </span>
                            )}
                        </div>
                        <p className={`text-xl font-bold font-mono ${metric.status === 'danger' ? 'text-red-400' : metric.status === 'warning' ? 'text-amber-400' : 'text-white'}`}>{metric.value}</p>
                        <p className="text-[10px] text-[#64748B] uppercase tracking-wider">{metric.label}</p>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

interface SafeHarborStatusProps { methods: { name: string; status: 'passed' | 'failed' | 'pending'; details: string }[]; overallStatus: 'safe' | 'at_risk' | 'failed'; className?: string; }

export function SafeHarborStatus({ methods, overallStatus, className = '' }: SafeHarborStatusProps) {
    const statusConfigs = { safe: { color: 'text-emerald-400', bg: 'bg-emerald-500/10', label: 'Safe Harbor Met' }, at_risk: { color: 'text-amber-400', bg: 'bg-amber-500/10', label: 'At Risk' }, failed: { color: 'text-red-400', bg: 'bg-red-500/10', label: 'Failed' } };
    const config = statusConfigs[overallStatus];

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`glass-card overflow-hidden ${className}`}>
            <div className={`p-5 border-b border-[rgba(255,255,255,0.06)] ${config.bg}`}>
                <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${config.bg} flex items-center justify-center`}>
                        <Shield className={`w-5 h-5 ${config.color}`} />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>Safe Harbor Status</h2>
                        <p className={`text-xs ${config.color}`}>{config.label}</p>
                    </div>
                </div>
            </div>
            <div className="divide-y divide-[rgba(255,255,255,0.04)]">
                {methods.map((method, i) => (
                    <motion.div key={method.name} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }} className="p-4 flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${method.status === 'passed' ? 'bg-emerald-500/10 text-emerald-400' : method.status === 'failed' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
                            {method.status === 'passed' ? <CheckCircle2 className="w-4 h-4" /> : method.status === 'failed' ? <AlertTriangle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
                        </div>
                        <div className="flex-1">
                            <p className="text-sm font-medium text-white">{method.name}</p>
                            <p className="text-xs text-[#64748B]">{method.details}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </motion.div>
    );
}

export default WorkforceDashboard;
