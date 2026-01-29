'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Shield,
    Plus,
    Edit,
    Trash2,
    ChevronRight,
    Check,
    X
} from 'lucide-react';

interface Permission {
    id: string;
    name: string;
    description: string;
    enabled: boolean;
}

interface Role {
    id: string;
    name: string;
    description: string;
    userCount: number;
    permissions: Permission[];
    isSystem: boolean;
}

interface RoleManagerProps {
    roles?: Role[];
    onCreateRole?: () => void;
    onEditRole?: (role: Role) => void;
    onDeleteRole?: (role: Role) => void;
    onTogglePermission?: (roleId: string, permissionId: string, enabled: boolean) => void;
    className?: string;
}

const defaultRoles: Role[] = [
    {
        id: '1',
        name: 'Administrator',
        description: 'Full system access with all permissions',
        userCount: 3,
        isSystem: true,
        permissions: [
            { id: 'p1', name: 'manage_users', description: 'Create, edit, delete users', enabled: true },
            { id: 'p2', name: 'manage_roles', description: 'Create and modify roles', enabled: true },
            { id: 'p3', name: 'view_audit_log', description: 'Access audit trail', enabled: true },
            { id: 'p4', name: 'manage_settings', description: 'Modify system settings', enabled: true },
            { id: 'p5', name: 'generate_forms', description: 'Generate IRS forms', enabled: true },
            { id: 'p6', name: 'manage_employees', description: 'Manage employee records', enabled: true },
        ]
    },
    {
        id: '2',
        name: 'Compliance Manager',
        description: 'Manage compliance and generate forms',
        userCount: 8,
        isSystem: false,
        permissions: [
            { id: 'p1', name: 'manage_users', description: 'Create, edit, delete users', enabled: false },
            { id: 'p2', name: 'manage_roles', description: 'Create and modify roles', enabled: false },
            { id: 'p3', name: 'view_audit_log', description: 'Access audit trail', enabled: true },
            { id: 'p4', name: 'manage_settings', description: 'Modify system settings', enabled: false },
            { id: 'p5', name: 'generate_forms', description: 'Generate IRS forms', enabled: true },
            { id: 'p6', name: 'manage_employees', description: 'Manage employee records', enabled: true },
        ]
    },
    {
        id: '3',
        name: 'HR Specialist',
        description: 'Manage employee records only',
        userCount: 15,
        isSystem: false,
        permissions: [
            { id: 'p1', name: 'manage_users', description: 'Create, edit, delete users', enabled: false },
            { id: 'p2', name: 'manage_roles', description: 'Create and modify roles', enabled: false },
            { id: 'p3', name: 'view_audit_log', description: 'Access audit trail', enabled: false },
            { id: 'p4', name: 'manage_settings', description: 'Modify system settings', enabled: false },
            { id: 'p5', name: 'generate_forms', description: 'Generate IRS forms', enabled: false },
            { id: 'p6', name: 'manage_employees', description: 'Manage employee records', enabled: true },
        ]
    },
    {
        id: '4',
        name: 'Viewer',
        description: 'Read-only access to compliance data',
        userCount: 25,
        isSystem: true,
        permissions: [
            { id: 'p1', name: 'manage_users', description: 'Create, edit, delete users', enabled: false },
            { id: 'p2', name: 'manage_roles', description: 'Create and modify roles', enabled: false },
            { id: 'p3', name: 'view_audit_log', description: 'Access audit trail', enabled: false },
            { id: 'p4', name: 'manage_settings', description: 'Modify system settings', enabled: false },
            { id: 'p5', name: 'generate_forms', description: 'Generate IRS forms', enabled: false },
            { id: 'p6', name: 'manage_employees', description: 'Manage employee records', enabled: false },
        ]
    },
];

export function RoleManager({
    roles = defaultRoles,
    onCreateRole,
    onEditRole,
    onDeleteRole,
    onTogglePermission,
    className = ''
}: RoleManagerProps) {
    const [expandedId, setExpandedId] = useState<string | null>(null);

    return (
        <div className={`glass-card ${className}`}>
            {/* Header */}
            <div className="p-4 border-b border-[var(--glass-border)]">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-synapse-gold)] to-[var(--color-warning)] flex items-center justify-center">
                            <Shield className="w-5 h-5 text-black" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-white">Role Management</h3>
                            <p className="text-xs text-[var(--color-steel)]">{roles.length} roles configured</p>
                        </div>
                    </div>
                    <button onClick={onCreateRole} className="btn-primary text-sm">
                        <Plus className="w-4 h-4" />
                        Create Role
                    </button>
                </div>
            </div>

            {/* Roles list */}
            <div className="divide-y divide-[var(--glass-border)]">
                {roles.map((role, i) => {
                    const isExpanded = expandedId === role.id;
                    const enabledCount = role.permissions.filter(p => p.enabled).length;

                    return (
                        <motion.div
                            key={role.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.03 }}
                        >
                            <div
                                onClick={() => setExpandedId(isExpanded ? null : role.id)}
                                className="p-4 cursor-pointer hover:bg-[var(--glass-bg)] transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    {/* Icon */}
                                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--glass-bg)] to-[var(--glass-bg-light)] flex items-center justify-center">
                                        <Users className="w-6 h-6 text-[var(--color-synapse-teal)]" />
                                    </div>

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-medium text-white">{role.name}</h4>
                                            {role.isSystem && (
                                                <span className="px-2 py-0.5 rounded text-xs bg-[var(--glass-bg)] text-[var(--color-steel)]">
                                                    System
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-xs text-[var(--color-steel)] mb-1">{role.description}</p>
                                        <div className="flex items-center gap-4 text-xs text-[var(--color-steel)]">
                                            <span>{role.userCount} users</span>
                                            <span>•</span>
                                            <span>{enabledCount} of {role.permissions.length} permissions</span>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2">
                                        {!role.isSystem && (
                                            <>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onEditRole?.(role); }}
                                                    className="p-2 rounded-lg hover:bg-[var(--glass-bg-light)] transition-colors"
                                                >
                                                    <Edit className="w-4 h-4 text-[var(--color-steel)]" />
                                                </button>
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); onDeleteRole?.(role); }}
                                                    className="p-2 rounded-lg hover:bg-[var(--glass-bg-light)] transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4 text-[var(--color-steel)]" />
                                                </button>
                                            </>
                                        )}
                                        <ChevronRight className={`w-5 h-5 text-[var(--color-steel)] transition-transform ${isExpanded ? 'rotate-90' : ''
                                            }`} />
                                    </div>
                                </div>
                            </div>

                            {/* Expanded permissions */}
                            {isExpanded && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    className="px-4 pb-4 overflow-hidden"
                                >
                                    <div className="ml-16 p-4 rounded-xl bg-[var(--glass-bg)]">
                                        <h5 className="text-sm font-medium text-white mb-3">Permissions</h5>
                                        <div className="grid grid-cols-2 gap-3">
                                            {role.permissions.map((perm) => (
                                                <div
                                                    key={perm.id}
                                                    className="flex items-center justify-between p-3 rounded-lg bg-[var(--color-obsidian)]"
                                                >
                                                    <div>
                                                        <p className="text-sm text-white">{perm.name.replace(/_/g, ' ')}</p>
                                                        <p className="text-xs text-[var(--color-steel)]">{perm.description}</p>
                                                    </div>
                                                    <button
                                                        onClick={() => onTogglePermission?.(role.id, perm.id, !perm.enabled)}
                                                        className={`w-8 h-8 rounded flex items-center justify-center ${perm.enabled
                                                                ? 'bg-[var(--color-success)]'
                                                                : 'bg-[var(--glass-bg)]'
                                                            }`}
                                                    >
                                                        {perm.enabled ? (
                                                            <Check className="w-4 h-4 text-black" />
                                                        ) : (
                                                            <X className="w-4 h-4 text-[var(--color-steel)]" />
                                                        )}
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

export default RoleManager;
