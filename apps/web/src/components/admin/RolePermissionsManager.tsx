'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield,
    Users,
    Lock,
    Unlock,
    Plus,
    Search,
    Edit2,
    Trash2,
    ChevronDown,
    CheckCircle2,
    Key,
    Eye,
    EyeOff,
    X,
    UserPlus,
    Settings
} from 'lucide-react';

interface RolePermissionsManagerProps {
    className?: string;
}

interface Role {
    id: string;
    name: string;
    description: string;
    userCount: number;
    permissions: string[];
    isSystem: boolean;
    color: string;
}

interface Permission {
    id: string;
    category: string;
    name: string;
    description: string;
}

const permissionCategories = [
    { id: 'employees', name: 'Employee Management', permissions: ['employees.view', 'employees.create', 'employees.edit', 'employees.delete', 'employees.export'] },
    { id: 'forms', name: 'Form Management', permissions: ['forms.view', 'forms.generate', 'forms.edit', 'forms.approve', 'forms.file'] },
    { id: 'reports', name: 'Reports & Analytics', permissions: ['reports.view', 'reports.create', 'reports.schedule', 'reports.export'] },
    { id: 'compliance', name: 'Compliance', permissions: ['compliance.view', 'compliance.manage', 'compliance.audit'] },
    { id: 'settings', name: 'System Settings', permissions: ['settings.view', 'settings.edit', 'settings.integrations'] },
    { id: 'admin', name: 'Administration', permissions: ['admin.users', 'admin.roles', 'admin.organizations', 'admin.billing'] },
];

const mockRoles: Role[] = [
    { id: 'r1', name: 'Super Admin', description: 'Full system access with all permissions', userCount: 2, permissions: ['*'], isSystem: true, color: 'bg-purple-500' },
    { id: 'r2', name: 'Compliance Officer', description: 'Manage compliance, forms, and reporting', userCount: 5, permissions: ['employees.view', 'employees.export', 'forms.*', 'reports.*', 'compliance.*'], isSystem: true, color: 'bg-[var(--color-synapse-teal)]' },
    { id: 'r3', name: 'HR Administrator', description: 'Manage employee records and enrollments', userCount: 12, permissions: ['employees.*', 'forms.view', 'forms.generate', 'reports.view'], isSystem: false, color: 'bg-blue-500' },
    { id: 'r4', name: 'HR Viewer', description: 'Read-only access to employee data', userCount: 25, permissions: ['employees.view', 'forms.view', 'reports.view'], isSystem: false, color: 'bg-slate-500' },
    { id: 'r5', name: 'Report Analyst', description: 'Access to reporting and analytics', userCount: 8, permissions: ['reports.*', 'employees.view'], isSystem: false, color: 'bg-pink-500' },
];

export function RolePermissionsManager({ className = '' }: RolePermissionsManagerProps) {
    const [roles, setRoles] = useState<Role[]>(mockRoles);
    const [selectedRole, setSelectedRole] = useState<string | null>('r2');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [expandedCategories, setExpandedCategories] = useState<string[]>(['employees', 'forms']);

    const toggleCategory = (id: string) => {
        setExpandedCategories(prev => prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]);
    };

    const currentRole = roles.find(r => r.id === selectedRole);

    const hasPermission = (permission: string) => {
        if (!currentRole) return false;
        if (currentRole.permissions.includes('*')) return true;
        const [category] = permission.split('.');
        if (currentRole.permissions.includes(`${category}.*`)) return true;
        return currentRole.permissions.includes(permission);
    };

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`glass-card ${className}`}>
            {/* Header */}
            <div className="p-5 border-b border-[var(--glass-border)]">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                            <Shield className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">Roles & Permissions</h2>
                            <p className="text-xs text-[var(--color-steel)]">Manage user roles and access control</p>
                        </div>
                    </div>
                    <button onClick={() => setShowCreateModal(true)} className="btn-primary flex items-center gap-2">
                        <Plus className="w-4 h-4" />
                        Create Role
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-3 divide-x divide-[var(--glass-border)]">
                {/* Roles List */}
                <div className="p-4">
                    <h3 className="text-sm font-medium text-[var(--color-steel)] mb-3">Roles</h3>
                    <div className="space-y-2">
                        {roles.map((role) => (
                            <button key={role.id} onClick={() => setSelectedRole(role.id)} className={`w-full p-3 rounded-lg text-left transition-all ${selectedRole === role.id ? 'border-[var(--color-synapse-teal)] bg-[var(--color-synapse-teal-muted)] border' : 'border border-transparent hover:bg-[rgba(255,255,255,0.02)]'}`}>
                                <div className="flex items-center gap-3">
                                    <div className={`w-3 h-3 rounded-full ${role.color}`} />
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <p className="font-medium text-white truncate">{role.name}</p>
                                            {role.isSystem && <Lock className="w-3 h-3 text-[var(--color-steel)]" />}
                                        </div>
                                        <p className="text-xs text-[var(--color-steel)] flex items-center gap-1">
                                            <Users className="w-3 h-3" /> {role.userCount} users
                                        </p>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Permissions Grid */}
                <div className="col-span-2 p-4">
                    {currentRole ? (
                        <>
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <div className={`w-4 h-4 rounded-full ${currentRole.color}`} />
                                        <h3 className="font-medium text-white">{currentRole.name}</h3>
                                        {currentRole.isSystem && <span className="px-2 py-0.5 text-[10px] font-medium bg-[rgba(255,255,255,0.05)] rounded text-[var(--color-steel)]">System Role</span>}
                                    </div>
                                    <p className="text-sm text-[var(--color-steel)] mt-1">{currentRole.description}</p>
                                </div>
                                {!currentRole.isSystem && (
                                    <div className="flex items-center gap-2">
                                        <button className="btn-secondary flex items-center gap-2">
                                            <Edit2 className="w-4 h-4" />
                                            Edit
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3 max-h-[400px] overflow-y-auto">
                                {permissionCategories.map((category) => (
                                    <div key={category.id} className="border border-[var(--glass-border)] rounded-lg overflow-hidden">
                                        <button onClick={() => toggleCategory(category.id)} className="w-full px-4 py-3 flex items-center justify-between bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.03)] transition-colors">
                                            <span className="font-medium text-white">{category.name}</span>
                                            <ChevronDown className={`w-4 h-4 text-[var(--color-steel)] transition-transform ${expandedCategories.includes(category.id) ? 'rotate-180' : ''}`} />
                                        </button>
                                        <AnimatePresence>
                                            {expandedCategories.includes(category.id) && (
                                                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                                                    <div className="p-4 space-y-2 bg-[rgba(0,0,0,0.2)]">
                                                        {category.permissions.map((perm) => {
                                                            const hasIt = hasPermission(perm);
                                                            const [, action] = perm.split('.');
                                                            return (
                                                                <div key={perm} className="flex items-center justify-between py-2 px-3 rounded-lg bg-[rgba(255,255,255,0.02)]">
                                                                    <div className="flex items-center gap-3">
                                                                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${hasIt ? 'bg-[rgba(16,185,129,0.1)]' : 'bg-[rgba(255,255,255,0.03)]'}`}>
                                                                            {hasIt ? <CheckCircle2 className="w-4 h-4 text-[var(--color-success)]" /> : <Lock className="w-4 h-4 text-[var(--color-steel)]" />}
                                                                        </div>
                                                                        <div>
                                                                            <p className="text-sm text-white capitalize">{action}</p>
                                                                            <p className="text-xs text-[var(--color-steel)]">{perm}</p>
                                                                        </div>
                                                                    </div>
                                                                    <span className={`text-xs font-medium ${hasIt ? 'text-[var(--color-success)]' : 'text-[var(--color-steel)]'}`}>
                                                                        {hasIt ? 'Granted' : 'Denied'}
                                                                    </span>
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center justify-center h-64">
                            <p className="text-[var(--color-steel)]">Select a role to view permissions</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Create Role Modal */}
            <AnimatePresence>
                {showCreateModal && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowCreateModal(false)}>
                        <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="glass-card w-full max-w-md" onClick={e => e.stopPropagation()}>
                            <div className="p-5 border-b border-[var(--glass-border)] flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-white">Create Role</h3>
                                <button onClick={() => setShowCreateModal(false)} className="p-2 rounded-lg text-[var(--color-steel)] hover:bg-[rgba(255,255,255,0.05)]">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <div className="p-5 space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">Role Name</label>
                                    <input type="text" placeholder="e.g., Benefits Coordinator" className="w-full px-4 py-2.5 bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white placeholder:text-[var(--color-steel)] focus:outline-none focus:border-[var(--color-synapse-teal)]" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">Description</label>
                                    <textarea rows={2} placeholder="Role description..." className="w-full px-4 py-2.5 bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white placeholder:text-[var(--color-steel)] focus:outline-none focus:border-[var(--color-synapse-teal)] resize-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">Copy From</label>
                                    <select className="w-full px-4 py-2.5 bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white focus:outline-none focus:border-[var(--color-synapse-teal)]">
                                        <option value="">Start from scratch</option>
                                        <option value="r3">HR Administrator</option>
                                        <option value="r4">HR Viewer</option>
                                    </select>
                                </div>
                            </div>
                            <div className="p-5 border-t border-[var(--glass-border)] flex justify-end gap-3">
                                <button onClick={() => setShowCreateModal(false)} className="btn-secondary">Cancel</button>
                                <button className="btn-primary flex items-center gap-2"><Shield className="w-4 h-4" />Create Role</button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default RolePermissionsManager;
