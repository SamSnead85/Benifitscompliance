'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    Users,
    Plus,
    Search,
    MoreVertical,
    Mail,
    Shield,
    Clock,
    CheckCircle2,
    XCircle,
    Edit2,
    Trash2,
    Key,
    UserPlus
} from 'lucide-react';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'super_admin' | 'admin' | 'manager' | 'analyst' | 'viewer';
    status: 'active' | 'inactive' | 'pending';
    lastActive: string;
    mfaEnabled: boolean;
}

interface UserManagementProps {
    className?: string;
}

const mockUsers: User[] = [
    { id: 'user-1', name: 'Alex Johnson', email: 'alex@company.com', role: 'super_admin', status: 'active', lastActive: '2 min ago', mfaEnabled: true },
    { id: 'user-2', name: 'Sarah Chen', email: 'sarah@company.com', role: 'admin', status: 'active', lastActive: '1 hour ago', mfaEnabled: true },
    { id: 'user-3', name: 'Michael Brown', email: 'michael@company.com', role: 'manager', status: 'active', lastActive: '3 hours ago', mfaEnabled: false },
    { id: 'user-4', name: 'Emily Davis', email: 'emily@company.com', role: 'analyst', status: 'pending', lastActive: 'Never', mfaEnabled: false },
    { id: 'user-5', name: 'James Wilson', email: 'james@company.com', role: 'viewer', status: 'inactive', lastActive: '2 weeks ago', mfaEnabled: false },
];

const roleLabels: Record<string, { label: string; color: string }> = {
    super_admin: { label: 'Super Admin', color: 'var(--color-synapse-gold)' },
    admin: { label: 'Admin', color: 'var(--color-synapse-teal)' },
    manager: { label: 'Manager', color: 'var(--color-synapse-cyan)' },
    analyst: { label: 'Analyst', color: 'var(--color-silver)' },
    viewer: { label: 'Viewer', color: 'var(--color-steel)' },
};

export function UserManagement({ className = '' }: UserManagementProps) {
    const [users, setUsers] = useState(mockUsers);
    const [searchQuery, setSearchQuery] = useState('');
    const [roleFilter, setRoleFilter] = useState<string>('all');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [showInviteModal, setShowInviteModal] = useState(false);

    const filteredUsers = users.filter(user => {
        if (searchQuery && !user.name.toLowerCase().includes(searchQuery.toLowerCase()) && !user.email.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }
        if (roleFilter !== 'all' && user.role !== roleFilter) {
            return false;
        }
        if (statusFilter !== 'all' && user.status !== statusFilter) {
            return false;
        }
        return true;
    });

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card overflow-hidden ${className}`}
        >
            {/* Header */}
            <div className="p-6 border-b border-[var(--glass-border)]">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-synapse-teal)] to-[var(--color-synapse-cyan)] flex items-center justify-center">
                            <Users className="w-5 h-5 text-black" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold text-white">User Management</h2>
                            <p className="text-sm text-[var(--color-steel)]">{users.length} total users</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowInviteModal(true)}
                        className="btn-primary"
                    >
                        <UserPlus className="w-4 h-4" />
                        Invite User
                    </button>
                </div>

                {/* Filters */}
                <div className="flex items-center gap-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-steel)]" />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm text-white placeholder:text-[var(--color-steel)] focus:border-[var(--color-synapse-teal)] focus:outline-none"
                        />
                    </div>
                    <select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                        className="px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm text-white"
                    >
                        <option value="all">All Roles</option>
                        {Object.entries(roleLabels).map(([key, value]) => (
                            <option key={key} value={key}>{value.label}</option>
                        ))}
                    </select>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-3 py-2 rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] text-sm text-white"
                    >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                        <option value="pending">Pending</option>
                    </select>
                </div>
            </div>

            {/* User Table */}
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead>
                        <tr className="bg-[var(--glass-bg-light)] border-b border-[var(--glass-border)]">
                            <th className="text-left px-6 py-3 text-xs font-medium text-[var(--color-steel)]">User</th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-[var(--color-steel)]">Role</th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-[var(--color-steel)]">Status</th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-[var(--color-steel)]">MFA</th>
                            <th className="text-left px-6 py-3 text-xs font-medium text-[var(--color-steel)]">Last Active</th>
                            <th className="text-right px-6 py-3 text-xs font-medium text-[var(--color-steel)]">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--glass-border)]">
                        {filteredUsers.map((user, i) => (
                            <motion.tr
                                key={user.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: i * 0.03 }}
                                className="hover:bg-[var(--glass-bg-light)] transition-colors"
                            >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[var(--color-synapse-teal)] to-[var(--color-synapse-cyan)] flex items-center justify-center text-sm font-medium text-black">
                                            {user.name.split(' ').map(n => n[0]).join('')}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-white">{user.name}</p>
                                            <p className="text-xs text-[var(--color-steel)]">{user.email}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className="px-2 py-1 rounded text-xs"
                                        style={{
                                            backgroundColor: `${roleLabels[user.role].color}20`,
                                            color: roleLabels[user.role].color
                                        }}
                                    >
                                        {roleLabels[user.role].label}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs flex items-center gap-1 w-fit ${user.status === 'active'
                                            ? 'bg-[rgba(34,197,94,0.2)] text-[var(--color-success)]'
                                            : user.status === 'pending'
                                                ? 'bg-[rgba(245,158,11,0.2)] text-[var(--color-warning)]'
                                                : 'bg-[rgba(156,163,175,0.2)] text-[var(--color-steel)]'
                                        }`}>
                                        {user.status === 'active' && <CheckCircle2 className="w-3 h-3" />}
                                        {user.status === 'pending' && <Clock className="w-3 h-3" />}
                                        {user.status === 'inactive' && <XCircle className="w-3 h-3" />}
                                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    {user.mfaEnabled ? (
                                        <span className="px-2 py-1 rounded text-xs bg-[rgba(34,197,94,0.2)] text-[var(--color-success)] flex items-center gap-1 w-fit">
                                            <Shield className="w-3 h-3" />
                                            Enabled
                                        </span>
                                    ) : (
                                        <span className="text-xs text-[var(--color-steel)]">Disabled</span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="text-sm text-[var(--color-steel)]">{user.lastActive}</span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-1.5 rounded hover:bg-[var(--glass-bg)] transition-colors" title="Edit">
                                            <Edit2 className="w-4 h-4 text-[var(--color-steel)]" />
                                        </button>
                                        <button className="p-1.5 rounded hover:bg-[var(--glass-bg)] transition-colors" title="Reset Password">
                                            <Key className="w-4 h-4 text-[var(--color-steel)]" />
                                        </button>
                                        <button className="p-1.5 rounded hover:bg-[var(--glass-bg)] transition-colors" title="Delete">
                                            <Trash2 className="w-4 h-4 text-[var(--color-steel)]" />
                                        </button>
                                    </div>
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredUsers.length === 0 && (
                <div className="p-8 text-center">
                    <Users className="w-8 h-8 mx-auto mb-3 text-[var(--color-steel)] opacity-50" />
                    <p className="text-[var(--color-steel)]">No users match your filters</p>
                </div>
            )}
        </motion.div>
    );
}

export default UserManagement;
