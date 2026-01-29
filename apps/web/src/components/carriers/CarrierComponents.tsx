'use client';

import { motion } from 'framer-motion';
import { Building2, Phone, Mail, Globe, MapPin, Star, CheckCircle2, Clock, DollarSign } from 'lucide-react';

interface Carrier { id: string; name: string; logo?: string; type: 'medical' | 'dental' | 'vision' | 'life' | 'disability'; rating?: number; contactEmail?: string; contactPhone?: string; website?: string; }

interface CarrierCardProps { carrier: Carrier; isSelected?: boolean; onSelect?: () => void; className?: string; }

export function CarrierCard({ carrier, isSelected, onSelect, className = '' }: CarrierCardProps) {
    const typeColors = { medical: 'from-cyan-500/20 to-teal-500/20 text-cyan-400', dental: 'from-blue-500/20 to-indigo-500/20 text-blue-400', vision: 'from-purple-500/20 to-violet-500/20 text-purple-400', life: 'from-emerald-500/20 to-green-500/20 text-emerald-400', disability: 'from-amber-500/20 to-orange-500/20 text-amber-400' };
    const colors = typeColors[carrier.type] || typeColors.medical;

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onClick={onSelect} className={`glass-card p-4 cursor-pointer transition-all ${isSelected ? 'ring-2 ring-cyan-500/50 bg-cyan-500/5' : 'hover:bg-[rgba(255,255,255,0.02)]'} ${className}`}>
            <div className="flex items-start gap-3">
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${colors} flex items-center justify-center flex-shrink-0`}>
                    {carrier.logo ? <img src={carrier.logo} alt={carrier.name} className="w-8 h-8" /> : <Building2 className="w-6 h-6" />}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-sm font-semibold text-white truncate">{carrier.name}</h3>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-cyan-400" />}
                    </div>
                    <p className="text-xs text-[#64748B] capitalize">{carrier.type}</p>
                    {carrier.rating && <div className="flex items-center gap-1 mt-1"><Star className="w-3 h-3 text-amber-400 fill-amber-400" /><span className="text-xs text-amber-400">{carrier.rating.toFixed(1)}</span></div>}
                </div>
            </div>
            {(carrier.contactEmail || carrier.contactPhone) && (
                <div className="mt-3 pt-3 border-t border-[rgba(255,255,255,0.06)] space-y-1">
                    {carrier.contactEmail && <div className="flex items-center gap-2 text-[10px] text-[#64748B]"><Mail className="w-3 h-3" />{carrier.contactEmail}</div>}
                    {carrier.contactPhone && <div className="flex items-center gap-2 text-[10px] text-[#64748B]"><Phone className="w-3 h-3" />{carrier.contactPhone}</div>}
                </div>
            )}
        </motion.div>
    );
}

interface Plan { id: string; name: string; type: 'medical' | 'dental' | 'vision' | 'life' | 'disability'; tier: 'bronze' | 'silver' | 'gold' | 'platinum'; monthlyPremium: number; employerContribution: number; deductible: number; outOfPocketMax: number; }

interface PlanCardProps { plan: Plan; isSelected?: boolean; onSelect?: () => void; className?: string; }

export function PlanCard({ plan, isSelected, onSelect, className = '' }: PlanCardProps) {
    const tierColors = { bronze: 'from-orange-600/30 to-amber-700/30 text-orange-400 border-orange-500/30', silver: 'from-gray-400/30 to-slate-500/30 text-gray-300 border-gray-400/30', gold: 'from-yellow-500/30 to-amber-500/30 text-yellow-400 border-yellow-500/30', platinum: 'from-slate-300/30 to-gray-400/30 text-slate-200 border-slate-300/30' };
    const colors = tierColors[plan.tier];

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onClick={onSelect} className={`glass-card overflow-hidden cursor-pointer transition-all ${isSelected ? 'ring-2 ring-cyan-500/50' : 'hover:bg-[rgba(255,255,255,0.02)]'} ${className}`}>
            <div className={`px-4 py-2 bg-gradient-to-r ${colors} border-b`}>
                <p className="text-[10px] font-bold uppercase tracking-wider">{plan.tier} Plan</p>
            </div>
            <div className="p-4">
                <h3 className="text-sm font-semibold text-white mb-1">{plan.name}</h3>
                <p className="text-xs text-[#64748B] capitalize mb-3">{plan.type}</p>
                <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="p-2 rounded bg-[rgba(255,255,255,0.02)]">
                        <p className="text-[10px] text-[#64748B]">Monthly Premium</p>
                        <p className="font-mono text-white">${plan.monthlyPremium}</p>
                    </div>
                    <div className="p-2 rounded bg-[rgba(255,255,255,0.02)]">
                        <p className="text-[10px] text-[#64748B]">Employer Pays</p>
                        <p className="font-mono text-emerald-400">{plan.employerContribution}%</p>
                    </div>
                    <div className="p-2 rounded bg-[rgba(255,255,255,0.02)]">
                        <p className="text-[10px] text-[#64748B]">Deductible</p>
                        <p className="font-mono text-white">${plan.deductible.toLocaleString()}</p>
                    </div>
                    <div className="p-2 rounded bg-[rgba(255,255,255,0.02)]">
                        <p className="text-[10px] text-[#64748B]">Max OOP</p>
                        <p className="font-mono text-white">${plan.outOfPocketMax.toLocaleString()}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

interface RateCalculatorProps { basePremium: number; tiers: { name: string; multiplier: number }[]; onCalculate?: (tier: string, result: number) => void; className?: string; }

export function RateCalculator({ basePremium, tiers, onCalculate, className = '' }: RateCalculatorProps) {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`glass-card overflow-hidden ${className}`}>
            <div className="p-5 border-b border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-emerald-500/20 to-green-500/20 flex items-center justify-center">
                        <DollarSign className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>Rate Calculator</h2>
                        <p className="text-xs text-[#64748B]">Base premium: ${basePremium}/month</p>
                    </div>
                </div>
            </div>
            <div className="p-5">
                <div className="space-y-2">
                    {tiers.map(tier => {
                        const rate = basePremium * tier.multiplier;
                        return (
                            <div key={tier.name} className="flex items-center justify-between p-3 rounded-lg bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.04)] transition-colors">
                                <div>
                                    <p className="text-sm font-medium text-white">{tier.name}</p>
                                    <p className="text-[10px] text-[#64748B]">{tier.multiplier}x base rate</p>
                                </div>
                                <p className="text-lg font-bold font-mono text-emerald-400">${rate.toFixed(2)}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </motion.div>
    );
}

export default CarrierCard;
