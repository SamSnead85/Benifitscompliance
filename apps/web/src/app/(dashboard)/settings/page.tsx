'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Settings,
    Building2,
    User,
    Bell,
    Shield,
    Key,
    Database,
    Globe,
    Palette,
    Save,
    ChevronRight,
    Check,
    AlertCircle,
    Link2,
    Mail,
    Phone
} from 'lucide-react';

const tabs = [
    { id: 'organization', name: 'Organization', icon: Building2 },
    { id: 'users', name: 'Users', icon: User },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'integrations', name: 'Integrations', icon: Link2 },
    { id: 'security', name: 'Security', icon: Shield },
];

const integrations = [
    {
        id: 'gusto',
        name: 'Gusto',
        description: 'Payroll and HR platform',
        status: 'connected',
        lastSync: '2 hours ago'
    },
    {
        id: 'rippling',
        name: 'Rippling',
        description: 'Workforce management platform',
        status: 'disconnected',
        lastSync: 'Never'
    },
    {
        id: 'adp',
        name: 'ADP Workforce Now',
        description: 'Enterprise payroll solution',
        status: 'coming_soon',
        lastSync: '--'
    },
    {
        id: 'sftp',
        name: 'SFTP Server',
        description: 'Automated file transfers',
        status: 'connected',
        lastSync: '1 day ago'
    },
];

const teamMembers = [
    { id: 1, name: 'Alex Johnson', email: 'alex@synapse.io', role: 'Admin', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@synapse.io', role: 'Manager', status: 'active' },
    { id: 3, name: 'Mike Johnson', email: 'mike@synapse.io', role: 'Viewer', status: 'pending' },
];

function IntegrationStatus({ status }: { status: string }) {
    const config = {
        connected: { label: 'Connected', className: 'text-[var(--color-success)]', dotClass: 'bg-[var(--color-success)]' },
        disconnected: { label: 'Disconnected', className: 'text-[var(--color-steel)]', dotClass: 'bg-[var(--color-steel)]' },
        coming_soon: { label: 'Coming Soon', className: 'text-[var(--color-steel)]', dotClass: 'bg-[var(--color-steel)]' },
    }[status] || { label: status, className: 'text-[var(--color-steel)]', dotClass: 'bg-[var(--color-steel)]' };

    return (
        <span className={`flex items-center gap-2 text-sm ${config.className}`}>
            <span className={`w-2 h-2 rounded-full ${config.dotClass}`} />
            {config.label}
        </span>
    );
}

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState('organization');
    const [orgSettings, setOrgSettings] = useState({
        companyName: 'Synapse Benefits',
        adminEmail: 'admin@synapse.io',
        phone: '(555) 123-4567',
        timezone: 'America/New_York',
        taxYear: '2026',
    });
    const [notifications, setNotifications] = useState({
        emailAlerts: true,
        complianceReminders: true,
        weeklyDigest: false,
        slackIntegration: false,
    });

    const handleSave = () => {
        // In production, save to API
        console.log('Saving settings...');
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-white">Settings</h1>
                    <p className="text-[var(--color-steel)] mt-1">Manage your organization and platform preferences</p>
                </div>
                <button onClick={handleSave} className="btn-primary">
                    <Save className="w-4 h-4" />
                    Save Changes
                </button>
            </div>

            <div className="flex gap-6">
                {/* Sidebar Navigation */}
                <div className="w-64 shrink-0">
                    <nav className="glass-card p-2 space-y-1">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${activeTab === tab.id
                                    ? 'bg-[rgba(6,182,212,0.15)] text-[var(--color-synapse-teal)]'
                                    : 'text-[var(--color-silver)] hover:text-white hover:bg-[var(--glass-bg-light)]'
                                    }`}
                            >
                                <tab.icon className="w-5 h-5" />
                                {tab.name}
                            </button>
                        ))}
                    </nav>
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2 }}
                        className="glass-card p-6"
                    >
                        {/* Organization Tab */}
                        {activeTab === 'organization' && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-lg bg-[rgba(6,182,212,0.15)] flex items-center justify-center">
                                        <Building2 className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-white">Organization Profile</h2>
                                        <p className="text-sm text-[var(--color-steel)]">Manage your company information</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">
                                            Company Name
                                        </label>
                                        <input
                                            type="text"
                                            value={orgSettings.companyName}
                                            onChange={(e) => setOrgSettings(prev => ({ ...prev, companyName: e.target.value }))}
                                            className="form-input"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">
                                            Admin Email
                                        </label>
                                        <input
                                            type="email"
                                            value={orgSettings.adminEmail}
                                            onChange={(e) => setOrgSettings(prev => ({ ...prev, adminEmail: e.target.value }))}
                                            className="form-input"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">
                                            Phone Number
                                        </label>
                                        <input
                                            type="tel"
                                            value={orgSettings.phone}
                                            onChange={(e) => setOrgSettings(prev => ({ ...prev, phone: e.target.value }))}
                                            className="form-input"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">
                                            Timezone
                                        </label>
                                        <select
                                            value={orgSettings.timezone}
                                            onChange={(e) => setOrgSettings(prev => ({ ...prev, timezone: e.target.value }))}
                                            className="form-input"
                                        >
                                            <option value="America/New_York">Eastern Time (ET)</option>
                                            <option value="America/Chicago">Central Time (CT)</option>
                                            <option value="America/Denver">Mountain Time (MT)</option>
                                            <option value="America/Los_Angeles">Pacific Time (PT)</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="border-t border-[var(--glass-border)] pt-6">
                                    <h3 className="text-sm font-semibold text-white mb-4">Compliance Settings</h3>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">
                                                Current Tax Year
                                            </label>
                                            <select
                                                value={orgSettings.taxYear}
                                                onChange={(e) => setOrgSettings(prev => ({ ...prev, taxYear: e.target.value }))}
                                                className="form-input"
                                            >
                                                <option value="2026">2026</option>
                                                <option value="2025">2025</option>
                                                <option value="2024">2024</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Users Tab */}
                        {activeTab === 'users' && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-[rgba(6,182,212,0.15)] flex items-center justify-center">
                                            <User className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                                        </div>
                                        <div>
                                            <h2 className="text-lg font-semibold text-white">Team Members</h2>
                                            <p className="text-sm text-[var(--color-steel)]">Manage user access and permissions</p>
                                        </div>
                                    </div>
                                    <button className="btn-primary text-sm">
                                        Invite User
                                    </button>
                                </div>

                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Role</th>
                                            <th>Status</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {teamMembers.map((member) => (
                                            <tr key={member.id}>
                                                <td className="font-medium">{member.name}</td>
                                                <td className="text-[var(--color-steel)]">{member.email}</td>
                                                <td>
                                                    <span className={`badge ${member.role === 'Admin' ? 'badge--success' :
                                                        member.role === 'Manager' ? 'badge--info' : 'badge--secondary'
                                                        }`}>
                                                        {member.role}
                                                    </span>
                                                </td>
                                                <td>
                                                    <span className={`text-sm ${member.status === 'active' ? 'text-[var(--color-success)]' : 'text-[var(--color-warning)]'}`}>
                                                        {member.status === 'active' ? 'Active' : 'Pending'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button className="text-[var(--color-steel)] hover:text-white">
                                                        <ChevronRight className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}

                        {/* Notifications Tab */}
                        {activeTab === 'notifications' && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-lg bg-[rgba(6,182,212,0.15)] flex items-center justify-center">
                                        <Bell className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-white">Notification Preferences</h2>
                                        <p className="text-sm text-[var(--color-steel)]">Control how you receive alerts</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {[
                                        { key: 'emailAlerts', label: 'Email Alerts', description: 'Receive immediate email notifications for critical events' },
                                        { key: 'complianceReminders', label: 'Compliance Reminders', description: 'Get reminded about upcoming filing deadlines' },
                                        { key: 'weeklyDigest', label: 'Weekly Digest', description: 'Receive a weekly summary of compliance activity' },
                                        { key: 'slackIntegration', label: 'Slack Notifications', description: 'Push alerts to your Slack workspace' },
                                    ].map((item) => (
                                        <div
                                            key={item.key}
                                            className="flex items-center justify-between p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]"
                                        >
                                            <div>
                                                <span className="font-medium text-white">{item.label}</span>
                                                <p className="text-sm text-[var(--color-steel)] mt-1">{item.description}</p>
                                            </div>
                                            <button
                                                onClick={() => setNotifications(prev => ({
                                                    ...prev,
                                                    [item.key]: !prev[item.key as keyof typeof notifications]
                                                }))}
                                                className={`w-12 h-6 rounded-full transition-colors relative ${notifications[item.key as keyof typeof notifications]
                                                    ? 'bg-[var(--color-synapse-teal)]'
                                                    : 'bg-[var(--glass-border)]'
                                                    }`}
                                            >
                                                <span
                                                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${notifications[item.key as keyof typeof notifications]
                                                        ? 'translate-x-7'
                                                        : 'translate-x-1'
                                                        }`}
                                                />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Integrations Tab */}
                        {activeTab === 'integrations' && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-lg bg-[rgba(6,182,212,0.15)] flex items-center justify-center">
                                        <Link2 className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-white">Integrations</h2>
                                        <p className="text-sm text-[var(--color-steel)]">Connect your HRIS and payroll systems</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {integrations.map((integration) => (
                                        <div
                                            key={integration.id}
                                            className="flex items-center justify-between p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]"
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-lg bg-[var(--glass-bg)] flex items-center justify-center">
                                                    <Database className="w-6 h-6 text-[var(--color-synapse-teal)]" />
                                                </div>
                                                <div>
                                                    <span className="font-medium text-white">{integration.name}</span>
                                                    <p className="text-sm text-[var(--color-steel)]">{integration.description}</p>
                                                    {integration.status === 'connected' && (
                                                        <p className="text-xs text-[var(--color-steel)] mt-1">Last synced: {integration.lastSync}</p>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <IntegrationStatus status={integration.status} />
                                                {integration.status !== 'coming_soon' && (
                                                    <button className={`btn-secondary text-sm ${integration.status === 'connected' ? '' : 'btn-primary'
                                                        }`}>
                                                        {integration.status === 'connected' ? 'Configure' : 'Connect'}
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === 'security' && (
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 rounded-lg bg-[rgba(6,182,212,0.15)] flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                                    </div>
                                    <div>
                                        <h2 className="text-lg font-semibold text-white">Security Settings</h2>
                                        <p className="text-sm text-[var(--color-steel)]">Manage authentication and access controls</p>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="font-medium text-white">Two-Factor Authentication</span>
                                                <p className="text-sm text-[var(--color-steel)] mt-1">Add an extra layer of security to your account</p>
                                            </div>
                                            <button className="btn-secondary text-sm">Enable 2FA</button>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="font-medium text-white">API Keys</span>
                                                <p className="text-sm text-[var(--color-steel)] mt-1">Manage API access for third-party integrations</p>
                                            </div>
                                            <button className="btn-secondary text-sm">Manage Keys</button>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="font-medium text-white">Session Management</span>
                                                <p className="text-sm text-[var(--color-steel)] mt-1">View and manage active sessions</p>
                                            </div>
                                            <button className="btn-secondary text-sm">View Sessions</button>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <span className="font-medium text-white">Audit Log</span>
                                                <p className="text-sm text-[var(--color-steel)] mt-1">Review account activity and changes</p>
                                            </div>
                                            <button className="btn-secondary text-sm">View Log</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
