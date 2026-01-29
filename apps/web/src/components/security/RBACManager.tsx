'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Shield,
    Users,
    Key,
    Eye,
    EyeOff,
    Plus,
    Trash2,
    Edit2,
    Check,
    X,
    ChevronDown,
    Lock,
    Unlock
} from 'lucide-react';

interface Permission {
    id: string;
    name: string;
    description: string;
    category: 'view' | 'edit' | 'admin';
}

interface Role {
    id: string;
    name: string;
    description: string;
    userCount: number;
    permissions: string[];
    isSystem: boolean;
}

interface RBACManagerProps {
    roles?: Role[];
    permissions?: Permission[];
    className?: string;
}

const defaultPermissions: Permission[] = [
    { id: 'view_clients', name: 'View Clients', description: 'View client list and details', category: 'view' },
    { id: 'edit_clients', name: 'Edit Clients', description: 'Modify client settings', category: 'edit' },
    { id: 'view_employees', name: 'View Employees', description: 'View employee records', category: 'view' },
    { id: 'edit_employees', name: 'Edit Employees', description: 'Modify employee data', category: 'edit' },
    { id: 'view_compliance', name: 'View Compliance', description: 'View compliance status', category: 'view' },
    { id: 'run_compliance', name: 'Run Compliance', description: 'Execute compliance checks', category: 'edit' },
    { id: 'generate_forms', name: 'Generate Forms', description: 'Generate IRS forms', category: 'edit' },
    { id: 'approve_forms', name: 'Approve Forms', description: 'Approve forms for filing', category: 'admin' },
    { id: 'manage_users', name: 'Manage Users', description: 'Add/remove users', category: 'admin' },
    { id: 'manage_roles', name: 'Manage Roles', description: 'Configure roles and permissions', category: 'admin' },
    { id: 'view_audit', name: 'View Audit Log', description: 'Access audit trail', category: 'view' },
    { id: 'manage_integrations', name: 'Manage Integrations', description: 'Configure HRIS connections', category: 'admin' },
];

const defaultRoles: Role[] = [
    {
        id: '1',
        name: 'Administrator',
        description: 'Full system access',
        userCount: 2,
        permissions: defaultPermissions.map(p => p.id),
        isSystem: true
    },
    {
        id: '2',
        name: 'Compliance Manager',
        description: 'Manage compliance operations',
        userCount: 5,
        permissions: ['view_clients', 'view_employees', 'view_compliance', 'run_compliance', 'generate_forms', 'approve_forms', 'view_audit'],
        isSystem: true
    },
    {
        id: '3',
        name: 'HR Analyst',
        description: 'View and analyze employee data',
        userCount: 12,
        permissions: ['view_clients', 'view_employees', 'edit_employees', 'view_compliance'],
        isSystem: false
    },
    {
        id: '4',
        name: 'Viewer',
        description: 'Read-only access',
        userCount: 8,
        permissions: ['view_clients', 'view_employees', 'view_compliance', 'view_audit'],
        isSystem: true
    }
];

const categoryConfig = {
    view: { color: 'var(--color-synapse-cyan)', label: 'View' },
    edit: { color: 'var(--color-warning)', label: 'Edit' },
    admin: { color: 'var(--color-critical)', label: 'Admin' }
};

export function RBACManager({
    roles = defaultRoles,
    permissions = defaultPermissions,
    className = ''
}: RBACManagerProps) {
    const [expandedRole, setExpandedRole] = useState<string | null>(null);
    const [editingRole, setEditingRole] = useState<string | null>(null);
    const [localRoles, setLocalRoles] = useState(roles);

    const togglePermission = (roleId: string, permissionId: string) => {
        setLocalRoles(prev => prev.map(role => {
            if (role.id !== roleId) return role;
            const hasPermission = role.permissions.includes(permissionId);
            return {
                ...role,
                permissions: hasPermission
                    ? role.permissions.filter(p => p !== permissionId)
                    : [...role.permissions, permissionId]
            };
        }));
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card p-6 ${className}`}
        >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                    <h3 className="font-semibold text-white">Role-Based Access Control</h3>
                </div>
                <button className="btn-secondary text-sm">
                    <Plus className="w-4 h-4" />
                    New Role
                </button>
            </div>

            {/* Roles List */}
            <div className="space-y-3">
                {localRoles.map((role, i) => {
                    const isExpanded = expandedRole === role.id;
                    const isEditing = editingRole === role.id;

                    return (
                        <motion.div
                            key={role.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="rounded-lg border border-[var(--glass-border)] overflow-hidden"
                        >
                            {/* Role Header */}
                            <div
                                onClick={() => setExpandedRole(isExpanded ? null : role.id)}
                                className="p-4 bg-[var(--glass-bg-light)] flex items-center justify-between cursor-pointer hover:bg-[var(--glass-bg)] transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-[var(--glass-bg)] flex items-center justify-center">
                                        {role.isSystem ? (
                                            <Lock className="w-5 h-5 text-[var(--color-steel)]" />
                                        ) : (
                                            <Key className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-white">{role.name}</span>
                                            {role.isSystem && (
                                                <span className="px-2 py-0.5 rounded text-xs bg-[var(--glass-bg)] text-[var(--color-steel)]">
                                                    System
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-[var(--color-steel)]">{role.description}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2 text-sm text-[var(--color-steel)]">
                                        <Users className="w-4 h-4" />
                                        <span>{role.userCount} users</span>
                                    </div>
                                    <span className="px-2 py-1 rounded text-xs bg-[var(--glass-bg)] text-[var(--color-silver)]">
                                        {role.permissions.length} permissions
                                    </span>
                                    <motion.div
                                        animate={{ rotate: isExpanded ? 180 : 0 }}
                                    >
                                        <ChevronDown className="w-5 h-5 text-[var(--color-steel)]" />
                                    </motion.div>
                                </div>
                            </div>

                            {/* Expanded Permissions */}
                            <AnimatePresence>
                                {isExpanded && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="border-t border-[var(--glass-border)]"
                                    >
                                        <div className="p-4">
                                            {/* Actions */}
                                            <div className="flex items-center justify-between mb-4">
                                                <span className="text-sm text-[var(--color-steel)]">Permissions</span>
                                                {!role.isSystem && (
                                                    <div className="flex items-center gap-2">
                                                        {isEditing ? (
                                                            <>
                                                                <button
                                                                    onClick={() => setEditingRole(null)}
                                                                    className="btn-primary text-xs"
                                                                >
                                                                    <Check className="w-3 h-3" />
                                                                    Save
                                                                </button>
                                                                <button
                                                                    onClick={() => setEditingRole(null)}
                                                                    className="btn-secondary text-xs"
                                                                >
                                                                    <X className="w-3 h-3" />
                                                                    Cancel
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <button
                                                                    onClick={() => setEditingRole(role.id)}
                                                                    className="btn-secondary text-xs"
                                                                >
                                                                    <Edit2 className="w-3 h-3" />
                                                                    Edit
                                                                </button>
                                                                <button className="text-xs text-[var(--color-critical)] hover:underline flex items-center gap-1">
                                                                    <Trash2 className="w-3 h-3" />
                                                                    Delete
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Permission Grid */}
                                            <div className="grid grid-cols-2 gap-2">
                                                {permissions.map((perm) => {
                                                    const hasPermission = role.permissions.includes(perm.id);
                                                    const category = categoryConfig[perm.category];

                                                    return (
                                                        <div
                                                            key={perm.id}
                                                            onClick={() => isEditing && togglePermission(role.id, perm.id)}
                                                            className={`p-3 rounded-lg border flex items-center gap-3 transition-colors ${hasPermission
                                                                    ? 'bg-[var(--glass-bg-light)] border-[var(--glass-border)]'
                                                                    : 'bg-[var(--glass-bg)] border-transparent opacity-50'
                                                                } ${isEditing ? 'cursor-pointer hover:opacity-100' : ''}`}
                                                        >
                                                            <div className={`w-5 h-5 rounded border flex items-center justify-center ${hasPermission
                                                                    ? 'bg-[var(--color-synapse-teal)] border-[var(--color-synapse-teal)]'
                                                                    : 'border-[var(--glass-border)]'
                                                                }`}>
                                                                {hasPermission && <Check className="w-3 h-3 text-black" />}
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-sm text-white">{perm.name}</span>
                                                                    <span
                                                                        className="px-1.5 py-0.5 rounded text-xs"
                                                                        style={{
                                                                            backgroundColor: `${category.color}20`,
                                                                            color: category.color
                                                                        }}
                                                                    >
                                                                        {category.label}
                                                                    </span>
                                                                </div>
                                                                <p className="text-xs text-[var(--color-steel)] truncate">{perm.description}</p>
                                                            </div>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>
        </motion.div>
    );
}

export default RBACManager;
