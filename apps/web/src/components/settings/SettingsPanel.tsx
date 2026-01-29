'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Settings,
    Bell,
    Mail,
    Shield,
    Moon,
    Globe,
    HardDrive,
    Clock,
    Save,
    RotateCcw
} from 'lucide-react';

interface SettingsPanelProps {
    className?: string;
}

interface SettingSection {
    id: string;
    icon: React.ElementType;
    title: string;
    description: string;
}

const sections: SettingSection[] = [
    { id: 'notifications', icon: Bell, title: 'Notifications', description: 'Email alerts and in-app notifications' },
    { id: 'security', icon: Shield, title: 'Security', description: 'MFA, session timeout, password policy' },
    { id: 'appearance', icon: Moon, title: 'Appearance', description: 'Theme, density, accessibility' },
    { id: 'regional', icon: Globe, title: 'Regional', description: 'Timezone, date format, language' },
    { id: 'data', icon: HardDrive, title: 'Data & Storage', description: 'Retention policies, exports' },
];

export function SettingsPanel({ className = '' }: SettingsPanelProps) {
    const [activeSection, setActiveSection] = useState('notifications');
    const [hasChanges, setHasChanges] = useState(false);

    // Notification Settings
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [complianceAlerts, setComplianceAlerts] = useState(true);
    const [digestFrequency, setDigestFrequency] = useState('daily');

    // Security Settings
    const [mfaEnabled, setMfaEnabled] = useState(true);
    const [sessionTimeout, setSessionTimeout] = useState('30');

    // Appearance Settings
    const [theme, setTheme] = useState('dark');
    const [density, setDensity] = useState('comfortable');

    // Regional Settings
    const [timezone, setTimezone] = useState('America/New_York');
    const [dateFormat, setDateFormat] = useState('MM/DD/YYYY');

    const handleChange = () => {
        setHasChanges(true);
    };

    const handleSave = () => {
        setHasChanges(false);
        // Save settings
    };

    const handleReset = () => {
        setHasChanges(false);
        // Reset to defaults
    };

    const ToggleSwitch = ({ enabled, onChange }: { enabled: boolean; onChange: (v: boolean) => void }) => (
        <button
            onClick={() => { onChange(!enabled); handleChange(); }}
            className={`relative w-11 h-6 rounded-full transition-colors ${enabled ? 'bg-[var(--color-synapse-teal)]' : 'bg-[var(--glass-bg)]'
                }`}
        >
            <motion.div
                animate={{ x: enabled ? 20 : 2 }}
                className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
            />
        </button>
    );

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
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-synapse-teal)] to-[var(--color-synapse-cyan)] flex items-center justify-center">
                            <Settings className="w-5 h-5 text-black" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white">Settings</h2>
                            <p className="text-sm text-[var(--color-steel)]">Customize your experience</p>
                        </div>
                    </div>
                    {hasChanges && (
                        <div className="flex items-center gap-2">
                            <button onClick={handleReset} className="btn-secondary">
                                <RotateCcw className="w-4 h-4" />
                                Reset
                            </button>
                            <button onClick={handleSave} className="btn-primary">
                                <Save className="w-4 h-4" />
                                Save Changes
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex">
                {/* Sidebar */}
                <div className="w-64 p-4 border-r border-[var(--glass-border)]">
                    <div className="space-y-1">
                        {sections.map((section) => {
                            const Icon = section.icon;
                            return (
                                <button
                                    key={section.id}
                                    onClick={() => setActiveSection(section.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${activeSection === section.id
                                            ? 'bg-[var(--color-synapse-teal)] text-black'
                                            : 'text-[var(--color-steel)] hover:text-white hover:bg-[var(--glass-bg)]'
                                        }`}
                                >
                                    <Icon className="w-4 h-4" />
                                    <span className="text-sm font-medium">{section.title}</span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6">
                    {activeSection === 'notifications' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-1">Notifications</h3>
                                <p className="text-sm text-[var(--color-steel)]">Control how you receive updates</p>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]">
                                    <div className="flex items-center gap-3">
                                        <Mail className="w-5 h-5 text-[var(--color-synapse-cyan)]" />
                                        <div>
                                            <p className="text-sm font-medium text-white">Email Notifications</p>
                                            <p className="text-xs text-[var(--color-steel)]">Receive important updates via email</p>
                                        </div>
                                    </div>
                                    <ToggleSwitch enabled={emailNotifications} onChange={setEmailNotifications} />
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]">
                                    <div className="flex items-center gap-3">
                                        <Bell className="w-5 h-5 text-[var(--color-synapse-cyan)]" />
                                        <div>
                                            <p className="text-sm font-medium text-white">Push Notifications</p>
                                            <p className="text-xs text-[var(--color-steel)]">In-app and browser notifications</p>
                                        </div>
                                    </div>
                                    <ToggleSwitch enabled={pushNotifications} onChange={setPushNotifications} />
                                </div>
                                <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]">
                                    <div className="flex items-center gap-3">
                                        <Shield className="w-5 h-5 text-[var(--color-warning)]" />
                                        <div>
                                            <p className="text-sm font-medium text-white">Compliance Alerts</p>
                                            <p className="text-xs text-[var(--color-steel)]">Critical ACA deadline reminders</p>
                                        </div>
                                    </div>
                                    <ToggleSwitch enabled={complianceAlerts} onChange={setComplianceAlerts} />
                                </div>
                                <div className="p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]">
                                    <p className="text-sm font-medium text-white mb-2">Email Digest Frequency</p>
                                    <select
                                        value={digestFrequency}
                                        onChange={(e) => { setDigestFrequency(e.target.value); handleChange(); }}
                                        className="w-full p-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-white text-sm"
                                    >
                                        <option value="realtime">Real-time</option>
                                        <option value="daily">Daily Digest</option>
                                        <option value="weekly">Weekly Digest</option>
                                        <option value="never">Never</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'security' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-1">Security</h3>
                                <p className="text-sm text-[var(--color-steel)]">Protect your account</p>
                            </div>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]">
                                    <div className="flex items-center gap-3">
                                        <Shield className="w-5 h-5 text-[var(--color-success)]" />
                                        <div>
                                            <p className="text-sm font-medium text-white">Two-Factor Authentication</p>
                                            <p className="text-xs text-[var(--color-steel)]">Add an extra layer of security</p>
                                        </div>
                                    </div>
                                    <ToggleSwitch enabled={mfaEnabled} onChange={setMfaEnabled} />
                                </div>
                                <div className="p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]">
                                    <div className="flex items-center gap-3 mb-2">
                                        <Clock className="w-5 h-5 text-[var(--color-synapse-gold)]" />
                                        <p className="text-sm font-medium text-white">Session Timeout</p>
                                    </div>
                                    <select
                                        value={sessionTimeout}
                                        onChange={(e) => { setSessionTimeout(e.target.value); handleChange(); }}
                                        className="w-full p-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-white text-sm"
                                    >
                                        <option value="15">15 minutes</option>
                                        <option value="30">30 minutes</option>
                                        <option value="60">1 hour</option>
                                        <option value="480">8 hours</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'appearance' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-1">Appearance</h3>
                                <p className="text-sm text-[var(--color-steel)]">Customize the look and feel</p>
                            </div>
                            <div className="space-y-4">
                                <div className="p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]">
                                    <p className="text-sm font-medium text-white mb-3">Theme</p>
                                    <div className="flex gap-3">
                                        {['dark', 'light', 'system'].map((t) => (
                                            <button
                                                key={t}
                                                onClick={() => { setTheme(t); handleChange(); }}
                                                className={`px-4 py-2 rounded-lg text-sm capitalize transition-colors ${theme === t
                                                        ? 'bg-[var(--color-synapse-teal)] text-black'
                                                        : 'bg-[var(--glass-bg)] text-[var(--color-steel)] hover:text-white'
                                                    }`}
                                            >
                                                {t}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]">
                                    <p className="text-sm font-medium text-white mb-3">Density</p>
                                    <div className="flex gap-3">
                                        {['compact', 'comfortable', 'spacious'].map((d) => (
                                            <button
                                                key={d}
                                                onClick={() => { setDensity(d); handleChange(); }}
                                                className={`px-4 py-2 rounded-lg text-sm capitalize transition-colors ${density === d
                                                        ? 'bg-[var(--color-synapse-teal)] text-black'
                                                        : 'bg-[var(--glass-bg)] text-[var(--color-steel)] hover:text-white'
                                                    }`}
                                            >
                                                {d}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'regional' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-1">Regional</h3>
                                <p className="text-sm text-[var(--color-steel)]">Location and format preferences</p>
                            </div>
                            <div className="space-y-4">
                                <div className="p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]">
                                    <p className="text-sm font-medium text-white mb-2">Timezone</p>
                                    <select
                                        value={timezone}
                                        onChange={(e) => { setTimezone(e.target.value); handleChange(); }}
                                        className="w-full p-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-white text-sm"
                                    >
                                        <option value="America/New_York">Eastern Time (ET)</option>
                                        <option value="America/Chicago">Central Time (CT)</option>
                                        <option value="America/Denver">Mountain Time (MT)</option>
                                        <option value="America/Los_Angeles">Pacific Time (PT)</option>
                                    </select>
                                </div>
                                <div className="p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]">
                                    <p className="text-sm font-medium text-white mb-2">Date Format</p>
                                    <select
                                        value={dateFormat}
                                        onChange={(e) => { setDateFormat(e.target.value); handleChange(); }}
                                        className="w-full p-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-white text-sm"
                                    >
                                        <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                                        <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                                        <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeSection === 'data' && (
                        <div className="space-y-6">
                            <div>
                                <h3 className="text-lg font-semibold text-white mb-1">Data & Storage</h3>
                                <p className="text-sm text-[var(--color-steel)]">Data retention and export options</p>
                            </div>
                            <div className="space-y-4">
                                <div className="p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]">
                                    <div className="flex items-center justify-between mb-3">
                                        <p className="text-sm font-medium text-white">Storage Used</p>
                                        <span className="text-sm text-[var(--color-steel)]">2.4 GB / 10 GB</span>
                                    </div>
                                    <div className="h-2 rounded-full bg-[var(--glass-bg)] overflow-hidden">
                                        <div className="h-full w-[24%] bg-gradient-to-r from-[var(--color-synapse-teal)] to-[var(--color-synapse-cyan)]" />
                                    </div>
                                </div>
                                <button className="w-full p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)] text-left hover:border-[var(--color-synapse-teal)] transition-colors">
                                    <p className="text-sm font-medium text-white">Export All Data</p>
                                    <p className="text-xs text-[var(--color-steel)]">Download a complete backup of your data</p>
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

export default SettingsPanel;
