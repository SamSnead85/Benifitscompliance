'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    UserPlus,
    Edit2,
    Trash2,
    Calendar,
    Heart,
    Shield,
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Search,
    Filter,
    Plus,
    X,
    ChevronDown,
    ChevronUp,
    User,
    Baby,
    Home
} from 'lucide-react';

interface DependentManagerProps {
    className?: string;
    employeeId?: string;
}

interface Dependent {
    id: string;
    firstName: string;
    lastName: string;
    relationship: 'spouse' | 'child' | 'domestic_partner' | 'other';
    dateOfBirth: string;
    ssn: string;
    gender: 'M' | 'F';
    enrolledPlans: string[];
    status: 'active' | 'inactive' | 'pending';
    addedDate: string;
    qualifyingEvent?: string;
    verificationStatus: 'verified' | 'pending' | 'failed';
    documents?: string[];
}

const mockDependents: Dependent[] = [
    { id: 'd1', firstName: 'Sarah', lastName: 'Smith', relationship: 'spouse', dateOfBirth: '1988-05-15', ssn: '***-**-5678', gender: 'F', enrolledPlans: ['Medical PPO Gold', 'Dental', 'Vision'], status: 'active', addedDate: 'Jul 2025', qualifyingEvent: 'Marriage', verificationStatus: 'verified', documents: ['Marriage Certificate'] },
    { id: 'd2', firstName: 'Emma', lastName: 'Smith', relationship: 'child', dateOfBirth: '2015-09-22', ssn: '***-**-9012', gender: 'F', enrolledPlans: ['Medical PPO Gold', 'Dental', 'Vision'], status: 'active', addedDate: 'Sep 2015', qualifyingEvent: 'Birth', verificationStatus: 'verified', documents: ['Birth Certificate'] },
    { id: 'd3', firstName: 'James', lastName: 'Smith', relationship: 'child', dateOfBirth: '2018-03-10', ssn: '***-**-3456', gender: 'M', enrolledPlans: ['Medical PPO Gold', 'Dental'], status: 'active', addedDate: 'Mar 2018', qualifyingEvent: 'Birth', verificationStatus: 'verified', documents: ['Birth Certificate'] },
    { id: 'd4', firstName: 'Robert', lastName: 'Smith', relationship: 'child', dateOfBirth: '2008-11-05', ssn: '***-**-7890', gender: 'M', enrolledPlans: ['Medical PPO Gold'], status: 'pending', addedDate: 'Jan 2026', qualifyingEvent: 'Court Order', verificationStatus: 'pending', documents: [] },
];

const relationshipConfig: Record<string, { icon: typeof User; label: string; color: string }> = {
    spouse: { icon: Heart, label: 'Spouse', color: 'text-pink-400' },
    child: { icon: Baby, label: 'Child', color: 'text-blue-400' },
    domestic_partner: { icon: Home, label: 'Domestic Partner', color: 'text-purple-400' },
    other: { icon: User, label: 'Other', color: 'text-[var(--color-steel)]' },
};

export function DependentManager({ className = '', employeeId }: DependentManagerProps) {
    const [dependents, setDependents] = useState<Dependent[]>(mockDependents);
    const [expandedDependents, setExpandedDependents] = useState<string[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'pending' | 'inactive'>('all');

    const toggleExpand = (id: string) => {
        setExpandedDependents(prev =>
            prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
        );
    };

    const removeDependent = (id: string) => {
        setDependents(prev => prev.filter(d => d.id !== id));
    };

    const filteredDependents = dependents.filter(d => {
        const matchesSearch = `${d.firstName} ${d.lastName}`.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || d.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'active': return { bg: 'bg-[rgba(16,185,129,0.1)]', text: 'text-[var(--color-success)]' };
            case 'pending': return { bg: 'bg-[rgba(245,158,11,0.1)]', text: 'text-[var(--color-warning)]' };
            case 'inactive': return { bg: 'bg-[rgba(255,255,255,0.05)]', text: 'text-[var(--color-steel)]' };
            default: return { bg: 'bg-[rgba(255,255,255,0.05)]', text: 'text-[var(--color-steel)]' };
        }
    };

    const getVerificationIcon = (status: string) => {
        switch (status) {
            case 'verified': return <CheckCircle2 className="w-4 h-4 text-[var(--color-success)]" />;
            case 'pending': return <AlertTriangle className="w-4 h-4 text-[var(--color-warning)]" />;
            case 'failed': return <XCircle className="w-4 h-4 text-[var(--color-critical)]" />;
            default: return null;
        }
    };

    const calculateAge = (dob: string) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return age;
    };

    const stats = {
        total: dependents.length,
        active: dependents.filter(d => d.status === 'active').length,
        pending: dependents.filter(d => d.status === 'pending').length,
        children: dependents.filter(d => d.relationship === 'child').length,
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card ${className}`}
        >
            {/* Header */}
            <div className="p-5 border-b border-[var(--glass-border)]">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                            <Users className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-white">Dependent Management</h2>
                            <p className="text-xs text-[var(--color-steel)]">Manage employee dependents and coverage</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="btn-primary flex items-center gap-2"
                    >
                        <UserPlus className="w-4 h-4" />
                        Add Dependent
                    </button>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4">
                    <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)]">
                        <p className="text-xs text-[var(--color-steel)]">Total Dependents</p>
                        <p className="text-xl font-bold text-white">{stats.total}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[rgba(16,185,129,0.05)] border border-[rgba(16,185,129,0.2)]">
                        <p className="text-xs text-[var(--color-steel)]">Active</p>
                        <p className="text-xl font-bold text-[var(--color-success)]">{stats.active}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[rgba(245,158,11,0.05)] border border-[rgba(245,158,11,0.2)]">
                        <p className="text-xs text-[var(--color-steel)]">Pending</p>
                        <p className="text-xl font-bold text-[var(--color-warning)]">{stats.pending}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-[rgba(59,130,246,0.05)] border border-[rgba(59,130,246,0.2)]">
                        <p className="text-xs text-[var(--color-steel)]">Children</p>
                        <p className="text-xl font-bold text-blue-400">{stats.children}</p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="px-5 py-3 border-b border-[var(--glass-border)] flex items-center justify-between">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-steel)]" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search dependents..."
                        className="pl-10 pr-4 py-2 text-sm bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white placeholder:text-[var(--color-steel)] focus:outline-none focus:border-[var(--color-synapse-teal)] w-64"
                    />
                </div>
                <div className="flex items-center gap-1">
                    {[
                        { id: 'all', label: 'All' },
                        { id: 'active', label: 'Active' },
                        { id: 'pending', label: 'Pending' },
                        { id: 'inactive', label: 'Inactive' },
                    ].map(f => (
                        <button
                            key={f.id}
                            onClick={() => setFilterStatus(f.id as any)}
                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${filterStatus === f.id
                                ? 'bg-[var(--color-synapse-teal)] text-black'
                                : 'text-[var(--color-steel)] hover:bg-[rgba(255,255,255,0.05)]'
                                }`}
                        >
                            {f.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Dependent List */}
            <div className="divide-y divide-[var(--glass-border)]">
                {filteredDependents.map((dependent, index) => {
                    const relationConfig = relationshipConfig[dependent.relationship];
                    const RelationIcon = relationConfig.icon;
                    const statusStyle = getStatusStyle(dependent.status);
                    const isExpanded = expandedDependents.includes(dependent.id);
                    const age = calculateAge(dependent.dateOfBirth);

                    return (
                        <motion.div
                            key={dependent.id}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: index * 0.03 }}
                            className="hover:bg-[rgba(255,255,255,0.01)] transition-colors"
                        >
                            <div className="p-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center">
                                        <RelationIcon className={`w-6 h-6 ${relationConfig.color}`} />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h4 className="font-medium text-white">{dependent.firstName} {dependent.lastName}</h4>
                                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded ${statusStyle.bg} ${statusStyle.text}`}>
                                                {dependent.status}
                                            </span>
                                            {getVerificationIcon(dependent.verificationStatus)}
                                        </div>
                                        <div className="flex items-center gap-3 text-sm text-[var(--color-steel)]">
                                            <span className={relationConfig.color}>{relationConfig.label}</span>
                                            <span>•</span>
                                            <span>Age {age}</span>
                                            <span>•</span>
                                            <span>{dependent.gender === 'M' ? 'Male' : 'Female'}</span>
                                            <span>•</span>
                                            <span>Added {dependent.addedDate}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <div className="flex -space-x-2">
                                            {dependent.enrolledPlans.slice(0, 3).map((plan, i) => (
                                                <div
                                                    key={i}
                                                    className="w-8 h-8 rounded-full bg-[rgba(6,182,212,0.1)] border-2 border-[var(--color-obsidian-surface)] flex items-center justify-center"
                                                    title={plan}
                                                >
                                                    <Shield className="w-3 h-3 text-[var(--color-synapse-teal)]" />
                                                </div>
                                            ))}
                                            {dependent.enrolledPlans.length > 3 && (
                                                <div className="w-8 h-8 rounded-full bg-[rgba(255,255,255,0.1)] border-2 border-[var(--color-obsidian-surface)] flex items-center justify-center text-xs text-[var(--color-steel)]">
                                                    +{dependent.enrolledPlans.length - 3}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1">
                                        <button
                                            onClick={() => toggleExpand(dependent.id)}
                                            className="p-2 rounded-lg text-[var(--color-steel)] hover:bg-[rgba(255,255,255,0.05)] transition-colors"
                                        >
                                            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                        </button>
                                        <button className="p-2 rounded-lg text-[var(--color-steel)] hover:bg-[rgba(255,255,255,0.05)] transition-colors">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => removeDependent(dependent.id)}
                                            className="p-2 rounded-lg text-[var(--color-steel)] hover:bg-[rgba(239,68,68,0.1)] hover:text-[var(--color-critical)] transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <AnimatePresence>
                                    {isExpanded && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            className="overflow-hidden"
                                        >
                                            <div className="mt-4 ml-16 p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)]">
                                                <div className="grid grid-cols-4 gap-4 mb-4">
                                                    <div>
                                                        <p className="text-xs text-[var(--color-steel)]">Date of Birth</p>
                                                        <p className="text-sm font-medium text-white">{new Date(dependent.dateOfBirth).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-[var(--color-steel)]">SSN</p>
                                                        <p className="text-sm font-medium text-white">{dependent.ssn}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-[var(--color-steel)]">Qualifying Event</p>
                                                        <p className="text-sm font-medium text-white">{dependent.qualifyingEvent || '-'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-[var(--color-steel)]">Verification</p>
                                                        <p className={`text-sm font-medium capitalize ${dependent.verificationStatus === 'verified' ? 'text-[var(--color-success)]' : dependent.verificationStatus === 'pending' ? 'text-[var(--color-warning)]' : 'text-[var(--color-critical)]'}`}>
                                                            {dependent.verificationStatus}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div>
                                                    <p className="text-xs text-[var(--color-steel)] mb-2">Enrolled Plans</p>
                                                    <div className="flex flex-wrap gap-2">
                                                        {dependent.enrolledPlans.map((plan, i) => (
                                                            <span key={i} className="px-3 py-1.5 text-xs bg-[rgba(6,182,212,0.1)] text-[var(--color-synapse-teal)] rounded-full">
                                                                {plan}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>

                                                {dependent.documents && dependent.documents.length > 0 && (
                                                    <div className="mt-4">
                                                        <p className="text-xs text-[var(--color-steel)] mb-2">Documents</p>
                                                        <div className="flex flex-wrap gap-2">
                                                            {dependent.documents.map((doc, i) => (
                                                                <span key={i} className="px-3 py-1.5 text-xs bg-[rgba(255,255,255,0.05)] text-[var(--color-silver)] rounded-full">
                                                                    {doc}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Add Dependent Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowAddModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="glass-card w-full max-w-xl"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="p-5 border-b border-[var(--glass-border)] flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-white">Add New Dependent</h3>
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="p-2 rounded-lg text-[var(--color-steel)] hover:bg-[rgba(255,255,255,0.05)]"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="p-5 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">First Name</label>
                                        <input
                                            type="text"
                                            placeholder="Enter first name"
                                            className="w-full px-4 py-2.5 bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white placeholder:text-[var(--color-steel)] focus:outline-none focus:border-[var(--color-synapse-teal)]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">Last Name</label>
                                        <input
                                            type="text"
                                            placeholder="Enter last name"
                                            className="w-full px-4 py-2.5 bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white placeholder:text-[var(--color-steel)] focus:outline-none focus:border-[var(--color-synapse-teal)]"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">Relationship</label>
                                        <select className="w-full px-4 py-2.5 bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white focus:outline-none focus:border-[var(--color-synapse-teal)]">
                                            <option value="spouse">Spouse</option>
                                            <option value="child">Child</option>
                                            <option value="domestic_partner">Domestic Partner</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">Gender</label>
                                        <select className="w-full px-4 py-2.5 bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white focus:outline-none focus:border-[var(--color-synapse-teal)]">
                                            <option value="M">Male</option>
                                            <option value="F">Female</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">Date of Birth</label>
                                        <input
                                            type="date"
                                            className="w-full px-4 py-2.5 bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white focus:outline-none focus:border-[var(--color-synapse-teal)]"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">SSN</label>
                                        <input
                                            type="text"
                                            placeholder="XXX-XX-XXXX"
                                            className="w-full px-4 py-2.5 bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white placeholder:text-[var(--color-steel)] focus:outline-none focus:border-[var(--color-synapse-teal)]"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">Qualifying Event</label>
                                    <select className="w-full px-4 py-2.5 bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white focus:outline-none focus:border-[var(--color-synapse-teal)]">
                                        <option value="marriage">Marriage</option>
                                        <option value="birth">Birth</option>
                                        <option value="adoption">Adoption</option>
                                        <option value="court_order">Court Order</option>
                                        <option value="loss_coverage">Loss of Other Coverage</option>
                                    </select>
                                </div>
                            </div>

                            <div className="p-5 border-t border-[var(--glass-border)] flex justify-end gap-3">
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="btn-secondary"
                                >
                                    Cancel
                                </button>
                                <button className="btn-primary flex items-center gap-2">
                                    <UserPlus className="w-4 h-4" />
                                    Add Dependent
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default DependentManager;
