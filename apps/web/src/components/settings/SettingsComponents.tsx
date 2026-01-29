'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import { Settings, Building2, Users, Shield, Bell, Palette, Globe, Database, Save, ChevronRight } from 'lucide-react';

interface SettingsSectionProps { title: string; description?: string; children: React.ReactNode; }

export function SettingsSection({ title, description, children }: SettingsSectionProps) {
    return (
        <div className="py-6 border-b border-[rgba(255,255,255,0.06)] last:border-b-0">
            <div className="mb-4">
                <h3 className="text-sm font-semibold text-white">{title}</h3>
                {description && <p className="text-xs text-[#64748B] mt-0.5">{description}</p>}
            </div>
            {children}
        </div>
    );
}

interface ToggleSettingProps { label: string; description?: string; checked: boolean; onChange: (checked: boolean) => void; }

export function ToggleSetting({ label, description, checked, onChange }: ToggleSettingProps) {
    return (
        <label className="flex items-center justify-between py-3 cursor-pointer group">
            <div>
                <p className="text-sm text-white group-hover:text-cyan-400 transition-colors">{label}</p>
                {description && <p className="text-xs text-[#64748B]">{description}</p>}
            </div>
            <button onClick={() => onChange(!checked)} className={`relative w-11 h-6 rounded-full transition-colors ${checked ? 'bg-cyan-500' : 'bg-[rgba(255,255,255,0.1)]'}`}>
                <motion.span animate={{ x: checked ? 20 : 2 }} className="absolute top-1 w-4 h-4 rounded-full bg-white" />
            </button>
        </label>
    );
}

interface SelectSettingProps { label: string; description?: string; value: string; options: { value: string; label: string }[]; onChange: (value: string) => void; }

export function SelectSetting({ label, description, value, options, onChange }: SelectSettingProps) {
    return (
        <div className="py-3">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-white">{label}</p>
                    {description && <p className="text-xs text-[#64748B]">{description}</p>}
                </div>
                <select value={value} onChange={e => onChange(e.target.value)} className="px-3 py-1.5 text-sm text-white bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-lg focus:outline-none focus:border-cyan-500/50">
                    {options.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
            </div>
        </div>
    );
}

interface OrganizationSettingsProps { organization: { name: string; ein: string; address: string; phone: string; }; onSave?: (data: Record<string, string>) => void; className?: string; }

export function OrganizationSettings({ organization, onSave, className = '' }: OrganizationSettingsProps) {
    const [formData, setFormData] = useState(organization);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        await new Promise(r => setTimeout(r, 1000));
        onSave?.(formData);
        setIsSaving(false);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`glass-card overflow-hidden ${className}`}>
            <div className="p-5 border-b border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-cyan-500/20 to-teal-500/20 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>Organization Settings</h2>
                        <p className="text-xs text-[#64748B]">Manage your organization profile</p>
                    </div>
                </div>
            </div>
            <div className="p-5 space-y-4">
                {[{ key: 'name', label: 'Organization Name' }, { key: 'ein', label: 'EIN/Tax ID' }, { key: 'address', label: 'Address' }, { key: 'phone', label: 'Phone' }].map(field => (
                    <div key={field.key}>
                        <label className="block text-xs font-medium text-[#94A3B8] mb-2">{field.label}</label>
                        <input type="text" value={formData[field.key as keyof typeof formData]} onChange={e => setFormData({ ...formData, [field.key]: e.target.value })} className="w-full px-3 py-2 text-sm text-white bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded-lg focus:outline-none focus:border-cyan-500/50" />
                    </div>
                ))}
                <motion.button onClick={handleSave} disabled={isSaving} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="w-full py-2.5 px-4 text-sm font-semibold text-[#030712] bg-gradient-to-b from-cyan-500 to-teal-600 rounded-lg flex items-center justify-center gap-2 disabled:opacity-70">
                    <Save className="w-4 h-4" />{isSaving ? 'Saving...' : 'Save Changes'}
                </motion.button>
            </div>
        </motion.div>
    );
}

interface ThresholdManagerProps { thresholds: { id: string; name: string; value: number; unit: string; description: string }[]; onUpdate?: (id: string, value: number) => void; className?: string; }

export function ThresholdManager({ thresholds, onUpdate, className = '' }: ThresholdManagerProps) {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`glass-card overflow-hidden ${className}`}>
            <div className="p-5 border-b border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>Compliance Thresholds</h2>
                        <p className="text-xs text-[#64748B]">Configure ACA eligibility and alert thresholds</p>
                    </div>
                </div>
            </div>
            <div className="divide-y divide-[rgba(255,255,255,0.04)]">
                {thresholds.map(threshold => (
                    <div key={threshold.id} className="p-4 hover:bg-[rgba(255,255,255,0.02)]">
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <p className="text-sm font-medium text-white">{threshold.name}</p>
                                <p className="text-xs text-[#64748B]">{threshold.description}</p>
                            </div>
                            <div className="flex items-center gap-2">
                                <input type="number" value={threshold.value} onChange={e => onUpdate?.(threshold.id, Number(e.target.value))} className="w-20 px-2 py-1 text-sm text-right text-white bg-[rgba(255,255,255,0.03)] border border-[rgba(255,255,255,0.08)] rounded focus:outline-none focus:border-cyan-500/50" />
                                <span className="text-xs text-[#64748B]">{threshold.unit}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </motion.div>
    );
}

export default OrganizationSettings;
