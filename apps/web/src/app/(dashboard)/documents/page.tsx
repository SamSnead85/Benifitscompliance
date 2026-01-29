'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    FileText,
    Upload,
    Search,
    Filter,
    Clock,
    CheckCircle2,
    AlertCircle,
    Eye,
    Download,
    Trash2,
    Sparkles,
    FileSpreadsheet,
    FileCheck,
    ChevronRight,
    X,
    Loader2,
    Brain
} from 'lucide-react';

// Animation variants
const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

const stagger = {
    visible: {
        transition: { staggerChildren: 0.06 }
    }
};

// Sample documents data
const documents = [
    {
        id: 1,
        name: 'Acme Corp - Medical SPD 2024',
        type: 'SPD',
        client: 'Acme Corporation',
        uploadedAt: '2024-01-15',
        status: 'analyzed',
        pages: 142,
        clauses: 28,
        size: '2.4 MB'
    },
    {
        id: 2,
        name: 'TechStart - 5500 Annual Report',
        type: '5500',
        client: 'TechStart Inc.',
        uploadedAt: '2024-01-12',
        status: 'analyzing',
        pages: 45,
        clauses: null,
        size: '890 KB'
    },
    {
        id: 3,
        name: 'Global Services - Carrier Contract',
        type: 'Contract',
        client: 'Global Services LLC',
        uploadedAt: '2024-01-10',
        status: 'pending',
        pages: 78,
        clauses: null,
        size: '1.8 MB'
    },
    {
        id: 4,
        name: 'HealthFirst - Dental Plan Document',
        type: 'SPD',
        client: 'HealthFirst Medical',
        uploadedAt: '2024-01-08',
        status: 'analyzed',
        pages: 56,
        clauses: 15,
        size: '1.2 MB'
    },
    {
        id: 5,
        name: 'Metro Corp - WRAP Document',
        type: 'WRAP',
        client: 'Metro Corporation',
        uploadedAt: '2024-01-05',
        status: 'analyzed',
        pages: 32,
        clauses: 12,
        size: '780 KB'
    }
];

const documentTypes = ['All Types', 'SPD', '5500', 'Contract', 'WRAP', 'Amendment'];

function StatusBadge({ status }: { status: string }) {
    const configs: Record<string, { label: string; icon: React.ElementType; className: string }> = {
        'analyzed': { label: 'Analyzed', icon: CheckCircle2, className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' },
        'analyzing': { label: 'Analyzing', icon: Loader2, className: 'bg-blue-500/10 text-blue-400 border-blue-500/20' },
        'pending': { label: 'Pending', icon: Clock, className: 'bg-amber-500/10 text-amber-400 border-amber-500/20' },
        'error': { label: 'Error', icon: AlertCircle, className: 'bg-red-500/10 text-red-400 border-red-500/20' }
    };
    const config = configs[status] || configs.pending;
    const Icon = config.icon;

    return (
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${config.className}`}>
            <Icon className={`w-3 h-3 ${status === 'analyzing' ? 'animate-spin' : ''}`} />
            {config.label}
        </span>
    );
}

function TypeIcon({ type }: { type: string }) {
    const colors: Record<string, string> = {
        'SPD': 'bg-purple-500/20 text-purple-400',
        '5500': 'bg-blue-500/20 text-blue-400',
        'Contract': 'bg-amber-500/20 text-amber-400',
        'WRAP': 'bg-emerald-500/20 text-emerald-400',
        'Amendment': 'bg-pink-500/20 text-pink-400'
    };

    return (
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${colors[type] || 'bg-slate-500/20 text-slate-400'}`}>
            <FileText className="w-5 h-5" />
        </div>
    );
}

export default function DocumentsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedType, setSelectedType] = useState('All Types');
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [selectedDoc, setSelectedDoc] = useState<typeof documents[0] | null>(null);

    const filteredDocs = documents.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.client.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = selectedType === 'All Types' || doc.type === selectedType;
        return matchesSearch && matchesType;
    });

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-semibold" style={{ color: 'var(--text-primary)' }}>
                        Document Intelligence
                    </h1>
                    <p style={{ color: 'var(--text-muted)' }}>
                        AI-powered document parsing and clause extraction
                    </p>
                </div>
                <button
                    onClick={() => setIsUploadOpen(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Upload className="w-4 h-4" />
                    Upload Document
                </button>
            </div>

            {/* Stats Row */}
            <motion.div
                variants={stagger}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-4 gap-4"
            >
                {[
                    { label: 'Total Documents', value: '156', icon: FileText, color: 'var(--accent-primary)' },
                    { label: 'Analyzed', value: '142', icon: CheckCircle2, color: '#10B981' },
                    { label: 'In Progress', value: '8', icon: Loader2, color: '#3B82F6' },
                    { label: 'Clauses Extracted', value: '2,847', icon: Sparkles, color: '#A855F7' }
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        variants={fadeInUp}
                        className="glass-card p-5"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
                        </div>
                        <div className="text-2xl font-semibold font-mono" style={{ color: 'var(--text-primary)' }}>
                            {stat.value}
                        </div>
                        <div className="text-xs mt-1" style={{ color: 'var(--text-dim)' }}>
                            {stat.label}
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            {/* Filters & Search */}
            <div className="flex items-center gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--text-dim)' }} />
                    <input
                        type="text"
                        placeholder="Search documents or clients..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 rounded-lg border text-sm"
                        style={{
                            background: 'var(--input-bg)',
                            borderColor: 'var(--card-border)',
                            color: 'var(--text-primary)'
                        }}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <Filter className="w-4 h-4" style={{ color: 'var(--text-dim)' }} />
                    {documentTypes.map((type) => (
                        <button
                            key={type}
                            onClick={() => setSelectedType(type)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${selectedType === type
                                    ? 'bg-[var(--accent-primary)] text-white'
                                    : ''
                                }`}
                            style={selectedType !== type ? {
                                background: 'var(--hover-overlay)',
                                color: 'var(--text-muted)'
                            } : {}}
                        >
                            {type}
                        </button>
                    ))}
                </div>
            </div>

            {/* Documents Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card overflow-hidden"
            >
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Document</th>
                            <th>Type</th>
                            <th>Client</th>
                            <th>Pages</th>
                            <th>Clauses</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDocs.map((doc) => (
                            <tr key={doc.id} className="group">
                                <td>
                                    <div className="flex items-center gap-3">
                                        <TypeIcon type={doc.type} />
                                        <div>
                                            <div className="font-medium" style={{ color: 'var(--text-primary)' }}>
                                                {doc.name}
                                            </div>
                                            <div className="text-xs" style={{ color: 'var(--text-dim)' }}>
                                                {doc.size} • Uploaded {doc.uploadedAt}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <span className="text-xs font-medium px-2 py-1 rounded" style={{ background: 'var(--hover-overlay)', color: 'var(--text-secondary)' }}>
                                        {doc.type}
                                    </span>
                                </td>
                                <td style={{ color: 'var(--text-muted)' }}>{doc.client}</td>
                                <td className="font-mono">{doc.pages}</td>
                                <td className="font-mono">{doc.clauses || '—'}</td>
                                <td><StatusBadge status={doc.status} /></td>
                                <td>
                                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => setSelectedDoc(doc)}
                                            className="p-1.5 rounded-lg transition-colors"
                                            style={{ color: 'var(--text-muted)' }}
                                            title="View Details"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            className="p-1.5 rounded-lg transition-colors"
                                            style={{ color: 'var(--text-muted)' }}
                                            title="Download"
                                        >
                                            <Download className="w-4 h-4" />
                                        </button>
                                        <button
                                            className="p-1.5 rounded-lg transition-colors hover:text-red-400"
                                            style={{ color: 'var(--text-muted)' }}
                                            title="Delete"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </motion.div>

            {/* Upload Modal */}
            <AnimatePresence>
                {isUploadOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        style={{ background: 'rgba(0,0,0,0.7)' }}
                        onClick={() => setIsUploadOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="glass-card w-full max-w-lg p-6"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                                    Upload Document
                                </h2>
                                <button onClick={() => setIsUploadOpen(false)} style={{ color: 'var(--text-muted)' }}>
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div
                                className="border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors hover:border-[var(--accent-primary)]"
                                style={{ borderColor: 'var(--card-border)' }}
                            >
                                <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--color-info-muted)' }}>
                                    <Upload className="w-6 h-6" style={{ color: 'var(--accent-primary)' }} />
                                </div>
                                <p className="font-medium mb-1" style={{ color: 'var(--text-primary)' }}>
                                    Drop files here or click to upload
                                </p>
                                <p className="text-sm" style={{ color: 'var(--text-dim)' }}>
                                    PDF, DOC, DOCX up to 50MB
                                </p>
                            </div>

                            <div className="mt-6 p-4 rounded-lg" style={{ background: 'var(--hover-overlay)' }}>
                                <div className="flex items-center gap-3">
                                    <Brain className="w-5 h-5" style={{ color: 'var(--accent-primary)' }} />
                                    <div>
                                        <p className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>
                                            AI Analysis Enabled
                                        </p>
                                        <p className="text-xs" style={{ color: 'var(--text-dim)' }}>
                                            Documents will be automatically parsed and clauses extracted
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    onClick={() => setIsUploadOpen(false)}
                                    className="px-4 py-2 rounded-lg text-sm font-medium"
                                    style={{ color: 'var(--text-muted)' }}
                                >
                                    Cancel
                                </button>
                                <button className="btn-primary">
                                    Upload & Analyze
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Document Detail Slideout */}
            <AnimatePresence>
                {selectedDoc && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50"
                        style={{ background: 'rgba(0,0,0,0.5)' }}
                        onClick={() => setSelectedDoc(null)}
                    >
                        <motion.div
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="absolute right-0 top-0 h-full w-full max-w-xl"
                            style={{ background: 'var(--bg-elevated)' }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="h-full flex flex-col">
                                <div className="p-6 border-b" style={{ borderColor: 'var(--card-border)' }}>
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-lg font-semibold" style={{ color: 'var(--text-primary)' }}>
                                            Document Details
                                        </h2>
                                        <button onClick={() => setSelectedDoc(null)} style={{ color: 'var(--text-muted)' }}>
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                                    <div className="flex items-start gap-4">
                                        <TypeIcon type={selectedDoc.type} />
                                        <div>
                                            <h3 className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                                                {selectedDoc.name}
                                            </h3>
                                            <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
                                                {selectedDoc.client}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        {[
                                            { label: 'Pages', value: selectedDoc.pages },
                                            { label: 'Clauses', value: selectedDoc.clauses || '—' },
                                            { label: 'Size', value: selectedDoc.size }
                                        ].map((item, i) => (
                                            <div key={i} className="p-4 rounded-lg" style={{ background: 'var(--hover-overlay)' }}>
                                                <div className="text-xl font-mono font-semibold" style={{ color: 'var(--text-primary)' }}>
                                                    {item.value}
                                                </div>
                                                <div className="text-xs" style={{ color: 'var(--text-dim)' }}>
                                                    {item.label}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {selectedDoc.status === 'analyzed' && (
                                        <div>
                                            <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
                                                Extracted Clauses
                                            </h4>
                                            <div className="space-y-2">
                                                {[
                                                    'Eligibility Requirements - Full-time 30+ hours',
                                                    'Waiting Period - First of month after 60 days',
                                                    'Contribution Strategy - Fixed Dollar Amount',
                                                    'COBRA - Standard 18-month coverage',
                                                    'Dependent Eligibility - Spouse and children to age 26'
                                                ].map((clause, i) => (
                                                    <div
                                                        key={i}
                                                        className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors"
                                                        style={{ background: 'var(--hover-overlay)' }}
                                                    >
                                                        <FileCheck className="w-4 h-4" style={{ color: 'var(--accent-primary)' }} />
                                                        <span className="text-sm flex-1" style={{ color: 'var(--text-secondary)' }}>
                                                            {clause}
                                                        </span>
                                                        <ChevronRight className="w-4 h-4" style={{ color: 'var(--text-dim)' }} />
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="p-6 border-t" style={{ borderColor: 'var(--card-border)' }}>
                                    <div className="flex gap-3">
                                        <button className="flex-1 btn-primary">
                                            <Eye className="w-4 h-4" />
                                            View Document
                                        </button>
                                        <button
                                            className="px-4 py-2 rounded-lg font-medium text-sm border"
                                            style={{ borderColor: 'var(--card-border)', color: 'var(--text-muted)' }}
                                        >
                                            <Download className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
