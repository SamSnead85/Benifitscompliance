'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Building2,
    Save,
    Upload,
    Globe,
    Calendar,
    MapPin,
    Phone,
    Mail,
    FileText,
    Shield,
    Clock,
    CheckCircle2
} from 'lucide-react';

interface OrganizationSettingsProps {
    className?: string;
    onSave?: (data: OrganizationData) => void;
}

interface OrganizationData {
    name: string;
    ein: string;
    address: {
        street: string;
        city: string;
        state: string;
        zip: string;
    };
    phone: string;
    email: string;
    website: string;
    fiscalYearStart: string;
    measurementPeriod: string;
    timezone: string;
}

export function OrganizationSettings({ className = '', onSave }: OrganizationSettingsProps) {
    const [isSaving, setIsSaving] = useState(false);
    const [showSaved, setShowSaved] = useState(false);
    const [formData, setFormData] = useState<OrganizationData>({
        name: 'Acme Healthcare Solutions',
        ein: '12-3456789',
        address: {
            street: '123 Business Park Drive, Suite 400',
            city: 'San Francisco',
            state: 'CA',
            zip: '94105'
        },
        phone: '(555) 123-4567',
        email: 'compliance@acmehealthcare.com',
        website: 'www.acmehealthcare.com',
        fiscalYearStart: '01',
        measurementPeriod: 'look-back',
        timezone: 'America/Los_Angeles'
    });

    const handleSave = async () => {
        setIsSaving(true);
        await new Promise(r => setTimeout(r, 1500));
        setIsSaving(false);
        setShowSaved(true);
        setTimeout(() => setShowSaved(false), 2000);
        onSave?.(formData);
    };

    const updateField = (field: string, value: string) => {
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...(prev[parent as keyof OrganizationData] as Record<string, string>),
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({ ...prev, [field]: value }));
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card overflow-hidden ${className}`}
        >
            {/* Header */}
            <div className="p-6 border-b border-[var(--glass-border)]">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-synapse-gold)] to-[var(--color-warning)] flex items-center justify-center">
                            <Building2 className="w-5 h-5 text-black" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white">Organization Settings</h2>
                            <p className="text-sm text-[var(--color-steel)]">Manage your organization profile</p>
                        </div>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="btn-primary"
                    >
                        {isSaving ? (
                            <>Saving...</>
                        ) : showSaved ? (
                            <>
                                <CheckCircle2 className="w-4 h-4" />
                                Saved
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                Save Changes
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="p-6 space-y-8">
                {/* Logo Upload */}
                <div className="flex items-start gap-6">
                    <div className="w-24 h-24 rounded-xl bg-[var(--glass-bg-light)] border border-[var(--glass-border)] flex items-center justify-center">
                        <Building2 className="w-10 h-10 text-[var(--color-steel)]" />
                    </div>
                    <div>
                        <h3 className="font-medium text-white mb-2">Organization Logo</h3>
                        <p className="text-sm text-[var(--color-steel)] mb-3">
                            Recommended: 400x400px, PNG or SVG
                        </p>
                        <button className="btn-secondary">
                            <Upload className="w-4 h-4" />
                            Upload Logo
                        </button>
                    </div>
                </div>

                {/* Basic Information */}
                <div>
                    <h3 className="font-medium text-white mb-4 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[var(--color-synapse-cyan)]" />
                        Basic Information
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-[var(--color-steel)] mb-1">Organization Name *</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => updateField('name', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-white focus:border-[var(--color-synapse-teal)] focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-[var(--color-steel)] mb-1">EIN (Tax ID) *</label>
                            <input
                                type="text"
                                value={formData.ein}
                                onChange={(e) => updateField('ein', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-white font-mono focus:border-[var(--color-synapse-teal)] focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* Address */}
                <div>
                    <h3 className="font-medium text-white mb-4 flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-[var(--color-synapse-cyan)]" />
                        Address
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                        <div>
                            <label className="block text-sm text-[var(--color-steel)] mb-1">Street Address</label>
                            <input
                                type="text"
                                value={formData.address.street}
                                onChange={(e) => updateField('address.street', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-white focus:border-[var(--color-synapse-teal)] focus:outline-none"
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm text-[var(--color-steel)] mb-1">City</label>
                                <input
                                    type="text"
                                    value={formData.address.city}
                                    onChange={(e) => updateField('address.city', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-white focus:border-[var(--color-synapse-teal)] focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-[var(--color-steel)] mb-1">State</label>
                                <select
                                    value={formData.address.state}
                                    onChange={(e) => updateField('address.state', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-white focus:border-[var(--color-synapse-teal)] focus:outline-none"
                                >
                                    <option value="CA">California</option>
                                    <option value="NY">New York</option>
                                    <option value="TX">Texas</option>
                                    <option value="FL">Florida</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm text-[var(--color-steel)] mb-1">ZIP Code</label>
                                <input
                                    type="text"
                                    value={formData.address.zip}
                                    onChange={(e) => updateField('address.zip', e.target.value)}
                                    className="w-full px-4 py-2.5 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-white font-mono focus:border-[var(--color-synapse-teal)] focus:outline-none"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="font-medium text-white mb-4 flex items-center gap-2">
                        <Phone className="w-4 h-4 text-[var(--color-synapse-cyan)]" />
                        Contact Information
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm text-[var(--color-steel)] mb-1">Phone</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => updateField('phone', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-white focus:border-[var(--color-synapse-teal)] focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-[var(--color-steel)] mb-1">Email</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => updateField('email', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-white focus:border-[var(--color-synapse-teal)] focus:outline-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-[var(--color-steel)] mb-1">Website</label>
                            <input
                                type="url"
                                value={formData.website}
                                onChange={(e) => updateField('website', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-white focus:border-[var(--color-synapse-teal)] focus:outline-none"
                            />
                        </div>
                    </div>
                </div>

                {/* ACA Settings */}
                <div>
                    <h3 className="font-medium text-white mb-4 flex items-center gap-2">
                        <Shield className="w-4 h-4 text-[var(--color-synapse-cyan)]" />
                        ACA Compliance Settings
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm text-[var(--color-steel)] mb-1">Fiscal Year Start</label>
                            <select
                                value={formData.fiscalYearStart}
                                onChange={(e) => updateField('fiscalYearStart', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-white focus:border-[var(--color-synapse-teal)] focus:outline-none"
                            >
                                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month, i) => (
                                    <option key={month} value={String(i + 1).padStart(2, '0')}>{month}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-[var(--color-steel)] mb-1">Measurement Method</label>
                            <select
                                value={formData.measurementPeriod}
                                onChange={(e) => updateField('measurementPeriod', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-white focus:border-[var(--color-synapse-teal)] focus:outline-none"
                            >
                                <option value="look-back">Look-Back Measurement</option>
                                <option value="monthly">Monthly Measurement</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm text-[var(--color-steel)] mb-1">Timezone</label>
                            <select
                                value={formData.timezone}
                                onChange={(e) => updateField('timezone', e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-white focus:border-[var(--color-synapse-teal)] focus:outline-none"
                            >
                                <option value="America/Los_Angeles">Pacific Time</option>
                                <option value="America/Denver">Mountain Time</option>
                                <option value="America/Chicago">Central Time</option>
                                <option value="America/New_York">Eastern Time</option>
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default OrganizationSettings;
