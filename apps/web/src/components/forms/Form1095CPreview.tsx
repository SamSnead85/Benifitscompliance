'use client';

import { motion } from 'framer-motion';
import {
    FileText,
    Download,
    Printer,
    CheckCircle2,
    AlertTriangle,
    User,
    Building2,
    Calendar
} from 'lucide-react';

interface Form1095CPreviewProps {
    className?: string;
    formData?: FormData;
}

interface FormData {
    taxYear: number;
    employee: {
        name: string;
        ssn: string;
        dob: string;
        address: {
            street: string;
            city: string;
            state: string;
            zip: string;
        };
    };
    employer: {
        name: string;
        ein: string;
        address: {
            street: string;
            city: string;
            state: string;
            zip: string;
        };
        phone: string;
    };
    monthlyData: {
        month: string;
        line14: string;
        line15: string;
        line16: string;
    }[];
    status: 'draft' | 'pending' | 'approved' | 'filed';
}

const mockFormData: FormData = {
    taxYear: 2025,
    employee: {
        name: 'Michael Chen',
        ssn: '***-**-4521',
        dob: '03/15/1985',
        address: {
            street: '456 Oak Street, Apt 12',
            city: 'San Francisco',
            state: 'CA',
            zip: '94102'
        }
    },
    employer: {
        name: 'Acme Healthcare Solutions',
        ein: '12-3456789',
        address: {
            street: '123 Business Park Drive, Suite 400',
            city: 'San Francisco',
            state: 'CA',
            zip: '94105'
        },
        phone: '(555) 123-4567'
    },
    monthlyData: Array.from({ length: 12 }, (_, i) => ({
        month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
        line14: '1E',
        line15: '$245.00',
        line16: '2C'
    })),
    status: 'approved'
};

const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export function Form1095CPreview({ className = '', formData = mockFormData }: Form1095CPreviewProps) {
    const statusConfig = {
        draft: { color: 'var(--color-steel)', label: 'Draft' },
        pending: { color: 'var(--color-warning)', label: 'Pending Review' },
        approved: { color: 'var(--color-success)', label: 'Approved' },
        filed: { color: 'var(--color-synapse-teal)', label: 'Filed' }
    };

    const status = statusConfig[formData.status];

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card overflow-hidden ${className}`}
        >
            {/* Header */}
            <div className="p-4 border-b border-[var(--glass-border)] flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-synapse-gold)] to-[var(--color-warning)] flex items-center justify-center">
                        <FileText className="w-5 h-5 text-black" />
                    </div>
                    <div>
                        <h2 className="font-semibold text-white">Form 1095-C</h2>
                        <p className="text-sm text-[var(--color-steel)]">Tax Year {formData.taxYear}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span
                        className="px-3 py-1 rounded text-xs"
                        style={{ backgroundColor: `${status.color}20`, color: status.color }}
                    >
                        {status.label}
                    </span>
                    <button className="p-2 rounded-lg hover:bg-[var(--glass-bg)] transition-colors" title="Print">
                        <Printer className="w-4 h-4 text-[var(--color-steel)]" />
                    </button>
                    <button className="p-2 rounded-lg hover:bg-[var(--glass-bg)] transition-colors" title="Download PDF">
                        <Download className="w-4 h-4 text-[var(--color-steel)]" />
                    </button>
                </div>
            </div>

            {/* Form Preview */}
            <div className="p-6 bg-white/5">
                {/* IRS Form Header */}
                <div className="p-4 mb-4 border border-[var(--glass-border)] rounded-lg bg-[var(--glass-bg)]">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-[var(--color-steel)]">Department of the Treasury - Internal Revenue Service</span>
                        <span className="text-xs font-mono text-[var(--color-steel)]">OMB No. 1545-2251</span>
                    </div>
                    <h3 className="text-lg font-bold text-white text-center">Form 1095-C</h3>
                    <p className="text-sm text-center text-[var(--color-steel)]">
                        Employer-Provided Health Insurance Offer and Coverage
                    </p>
                </div>

                {/* Part I - Employee */}
                <div className="mb-4 p-4 border border-[var(--glass-border)] rounded-lg bg-[var(--glass-bg)]">
                    <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                        <User className="w-4 h-4 text-[var(--color-synapse-cyan)]" />
                        Part I - Employee
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-xs text-[var(--color-steel)]">1. Employee Name</p>
                            <p className="text-white font-mono">{formData.employee.name}</p>
                        </div>
                        <div>
                            <p className="text-xs text-[var(--color-steel)]">2. SSN</p>
                            <p className="text-white font-mono">{formData.employee.ssn}</p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-xs text-[var(--color-steel)]">3-6. Address</p>
                            <p className="text-white font-mono">
                                {formData.employee.address.street}, {formData.employee.address.city}, {formData.employee.address.state} {formData.employee.address.zip}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Part II - Employer */}
                <div className="mb-4 p-4 border border-[var(--glass-border)] rounded-lg bg-[var(--glass-bg)]">
                    <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                        <Building2 className="w-4 h-4 text-[var(--color-synapse-gold)]" />
                        Part II - Applicable Large Employer
                    </h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-xs text-[var(--color-steel)]">7. Employer Name</p>
                            <p className="text-white font-mono">{formData.employer.name}</p>
                        </div>
                        <div>
                            <p className="text-xs text-[var(--color-steel)]">8. EIN</p>
                            <p className="text-white font-mono">{formData.employer.ein}</p>
                        </div>
                        <div>
                            <p className="text-xs text-[var(--color-steel)]">9-13. Address</p>
                            <p className="text-white font-mono">
                                {formData.employer.address.city}, {formData.employer.address.state} {formData.employer.address.zip}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-[var(--color-steel)]">Contact Phone</p>
                            <p className="text-white font-mono">{formData.employer.phone}</p>
                        </div>
                    </div>
                </div>

                {/* Part III - Monthly Coverage */}
                <div className="p-4 border border-[var(--glass-border)] rounded-lg bg-[var(--glass-bg)]">
                    <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-[var(--color-synapse-teal)]" />
                        Part III - Monthly Coverage Information
                    </h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs">
                            <thead>
                                <tr className="border-b border-[var(--glass-border)]">
                                    <th className="py-2 text-left text-[var(--color-steel)] font-medium">Month</th>
                                    <th className="py-2 text-center text-[var(--color-steel)] font-medium">Line 14 (Offer)</th>
                                    <th className="py-2 text-center text-[var(--color-steel)] font-medium">Line 15 (Contrib.)</th>
                                    <th className="py-2 text-center text-[var(--color-steel)] font-medium">Line 16 (Safe Harbor)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {formData.monthlyData.map((data, i) => (
                                    <tr key={i} className="border-b border-[var(--glass-border)]">
                                        <td className="py-2 text-white">{data.month}</td>
                                        <td className="py-2 text-center font-mono text-[var(--color-synapse-teal)]">{data.line14}</td>
                                        <td className="py-2 text-center font-mono text-white">{data.line15}</td>
                                        <td className="py-2 text-center font-mono text-[var(--color-synapse-gold)]">{data.line16}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export default Form1095CPreview;
