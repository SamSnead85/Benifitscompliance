'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FileText,
    Download,
    Printer,
    Mail,
    ZoomIn,
    ZoomOut,
    ChevronLeft,
    ChevronRight,
    AlertTriangle,
    CheckCircle2,
    Edit2,
    Eye
} from 'lucide-react';

interface Form1095CData {
    taxYear: number;
    employeeInfo: {
        name: string;
        ssn: string;
        address: string;
        city: string;
        state: string;
        zip: string;
    };
    employerInfo: {
        name: string;
        ein: string;
        address: string;
        city: string;
        state: string;
        zip: string;
        contact: string;
        phone: string;
    };
    monthlyData: {
        month: string;
        line14: string;
        line15: string;
        line16: string;
        line17: string;
    }[];
    partIII: {
        coveredIndividuals: {
            name: string;
            ssn: string;
            dob: string;
            covered: boolean[];
        }[];
    };
}

interface Form1095CPreviewProps {
    data?: Form1095CData;
    className?: string;
    validationErrors?: string[];
    onEdit?: () => void;
}

const defaultData: Form1095CData = {
    taxYear: 2025,
    employeeInfo: {
        name: 'Sarah J. Mitchell',
        ssn: 'XXX-XX-4521',
        address: '123 Main Street Apt 4B',
        city: 'San Francisco',
        state: 'CA',
        zip: '94102'
    },
    employerInfo: {
        name: 'Acme Corporation',
        ein: '12-3456789',
        address: '500 Tech Drive',
        city: 'San Francisco',
        state: 'CA',
        zip: '94105',
        contact: 'HR Department',
        phone: '(555) 123-4567'
    },
    monthlyData: Array.from({ length: 12 }, (_, i) => ({
        month: new Date(2025, i).toLocaleString('en', { month: 'short' }),
        line14: '1H',
        line15: '2C',
        line16: '2C',
        line17: ''
    })),
    partIII: {
        coveredIndividuals: [
            { name: 'Sarah J. Mitchell', ssn: 'XXX-XX-4521', dob: '03/15/1988', covered: Array(12).fill(true) },
            { name: 'Michael R. Mitchell', ssn: 'XXX-XX-8734', dob: '07/22/1986', covered: Array(12).fill(true) },
            { name: 'Emma L. Mitchell', ssn: 'XXX-XX-1234', dob: '11/08/2015', covered: Array(12).fill(true) }
        ]
    }
};

const codeDescriptions: Record<string, Record<string, string>> = {
    line14: {
        '1A': 'Qualifying Offer (MEC, Affordable, MV)',
        '1B': 'MEC providing MV offered to employee only',
        '1C': 'MEC providing MV offered to employee + dependent(s)',
        '1D': 'MEC providing MV offered to employee + spouse',
        '1E': 'MEC providing MV offered to employee + spouse + dependent(s)',
        '1F': 'MEC NOT providing MV offered',
        '1G': 'Conditional Offer to spouse',
        '1H': 'No offer of coverage',
        '1J': 'MEC offer to spouse & dependents (not employee)',
        '1K': 'MEC minimum value offer to spouse only'
    },
    line16: {
        '2A': 'Employee not employed during the month',
        '2B': 'Employee not FT employee during month',
        '2C': 'Employee enrolled in coverage offered',
        '2D': 'Employee in Limited Non-Assessment Period',
        '2F': 'Form W-2 safe harbor',
        '2G': 'FPL safe harbor',
        '2H': 'Rate of Pay safe harbor'
    }
};

export function Form1095CPreview({
    data = defaultData,
    className = '',
    validationErrors = [],
    onEdit
}: Form1095CPreviewProps) {
    const [zoom, setZoom] = useState(100);
    const [showCodes, setShowCodes] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card overflow-hidden ${className}`}
        >
            {/* Toolbar */}
            <div className="p-4 border-b border-[var(--glass-border)] flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                    <h3 className="font-semibold text-white">Form 1095-C Preview</h3>
                    <span className="px-2 py-0.5 rounded text-xs bg-[var(--glass-bg)] text-[var(--color-steel)]">
                        Tax Year {data.taxYear}
                    </span>
                    {validationErrors.length === 0 ? (
                        <span className="px-2 py-0.5 rounded text-xs bg-[rgba(34,197,94,0.2)] text-[var(--color-success)] flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Valid
                        </span>
                    ) : (
                        <span className="px-2 py-0.5 rounded text-xs bg-[rgba(239,68,68,0.2)] text-[var(--color-critical)] flex items-center gap-1">
                            <AlertTriangle className="w-3 h-3" />
                            {validationErrors.length} errors
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <button className="btn-secondary text-sm" onClick={() => setZoom(z => Math.max(50, z - 10))}>
                        <ZoomOut className="w-4 h-4" />
                    </button>
                    <span className="text-sm text-[var(--color-steel)] min-w-[50px] text-center">{zoom}%</span>
                    <button className="btn-secondary text-sm" onClick={() => setZoom(z => Math.min(150, z + 10))}>
                        <ZoomIn className="w-4 h-4" />
                    </button>
                    <div className="w-px h-6 bg-[var(--glass-border)] mx-2" />
                    <button onClick={onEdit} className="btn-secondary text-sm">
                        <Edit2 className="w-4 h-4" />
                        Edit
                    </button>
                    <button className="btn-secondary text-sm">
                        <Printer className="w-4 h-4" />
                        Print
                    </button>
                    <button className="btn-primary text-sm">
                        <Download className="w-4 h-4" />
                        Download PDF
                    </button>
                </div>
            </div>

            {/* Form Preview */}
            <div className="p-6 bg-[var(--glass-bg)] overflow-auto max-h-[600px]">
                <div
                    className="mx-auto bg-white text-black p-8 shadow-lg"
                    style={{
                        width: `${8.5 * (zoom / 100)}in`,
                        minHeight: `${11 * (zoom / 100)}in`,
                        fontSize: `${10 * (zoom / 100)}px`,
                        fontFamily: 'Courier New, monospace'
                    }}
                >
                    {/* Form Header */}
                    <div className="text-center mb-4 border-b-2 border-black pb-2">
                        <p className="text-xs">Form</p>
                        <p className="text-2xl font-bold">1095-C</p>
                        <p className="text-xs mt-1">Department of the Treasury - Internal Revenue Service</p>
                        <p className="font-bold mt-2">Employer-Provided Health Insurance Offer and Coverage</p>
                        <p className="text-xs">For calendar year {data.taxYear}</p>
                    </div>

                    {/* Part I - Employee */}
                    <div className="mb-4">
                        <p className="font-bold bg-gray-200 px-2 py-1">Part I - Employee</p>
                        <div className="grid grid-cols-2 gap-4 p-2 border border-gray-300">
                            <div>
                                <p className="text-xs text-gray-600">1. Employee Name (first, middle initial, last)</p>
                                <p className="font-bold">{data.employeeInfo.name}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-600">2. Social Security Number</p>
                                <p className="font-bold">{data.employeeInfo.ssn}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-xs text-gray-600">3-6. Address</p>
                                <p>{data.employeeInfo.address}</p>
                                <p>{data.employeeInfo.city}, {data.employeeInfo.state} {data.employeeInfo.zip}</p>
                            </div>
                        </div>
                    </div>

                    {/* Part I - Employer */}
                    <div className="mb-4">
                        <p className="font-bold bg-gray-200 px-2 py-1">Applicable Large Employer Member (ALE)</p>
                        <div className="grid grid-cols-2 gap-4 p-2 border border-gray-300">
                            <div>
                                <p className="text-xs text-gray-600">7. Employer Name</p>
                                <p className="font-bold">{data.employerInfo.name}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-600">8. Employer EIN</p>
                                <p className="font-bold">{data.employerInfo.ein}</p>
                            </div>
                            <div className="col-span-2">
                                <p className="text-xs text-gray-600">9-13. Address</p>
                                <p>{data.employerInfo.address}</p>
                                <p>{data.employerInfo.city}, {data.employerInfo.state} {data.employerInfo.zip}</p>
                            </div>
                        </div>
                    </div>

                    {/* Part II - Monthly Coverage */}
                    <div className="mb-4">
                        <p className="font-bold bg-gray-200 px-2 py-1">Part II - Employee Offer and Coverage</p>
                        <table className="w-full border border-gray-300 text-xs">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 p-1">Month</th>
                                    <th className="border border-gray-300 p-1">Line 14 (Offer)</th>
                                    <th className="border border-gray-300 p-1">Line 15 (EE Share)</th>
                                    <th className="border border-gray-300 p-1">Line 16 (Safe Harbor)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.monthlyData.map((row) => (
                                    <tr key={row.month}>
                                        <td className="border border-gray-300 p-1 font-bold">{row.month}</td>
                                        <td className="border border-gray-300 p-1 text-center">{row.line14}</td>
                                        <td className="border border-gray-300 p-1 text-center">{row.line15}</td>
                                        <td className="border border-gray-300 p-1 text-center">{row.line16}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Part III - Covered Individuals */}
                    <div>
                        <p className="font-bold bg-gray-200 px-2 py-1">Part III - Covered Individuals</p>
                        <table className="w-full border border-gray-300 text-xs">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="border border-gray-300 p-1">Name</th>
                                    <th className="border border-gray-300 p-1">SSN</th>
                                    <th className="border border-gray-300 p-1">DOB</th>
                                    {data.monthlyData.map((m) => (
                                        <th key={m.month} className="border border-gray-300 p-1 text-center">{m.month[0]}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {data.partIII.coveredIndividuals.map((ind, idx) => (
                                    <tr key={idx}>
                                        <td className="border border-gray-300 p-1">{ind.name}</td>
                                        <td className="border border-gray-300 p-1">{ind.ssn}</td>
                                        <td className="border border-gray-300 p-1">{ind.dob}</td>
                                        {ind.covered.map((c, mi) => (
                                            <td key={mi} className="border border-gray-300 p-1 text-center">{c ? 'X' : ''}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Code Reference */}
            <div className="p-4 border-t border-[var(--glass-border)]">
                <button
                    onClick={() => setShowCodes(!showCodes)}
                    className="text-sm text-[var(--color-synapse-teal)] hover:underline flex items-center gap-1"
                >
                    <Eye className="w-4 h-4" />
                    {showCodes ? 'Hide' : 'Show'} Code Reference
                </button>
                {showCodes && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 grid grid-cols-2 gap-4 text-xs"
                    >
                        <div>
                            <p className="font-medium text-white mb-2">Line 14 Codes (Offer of Coverage)</p>
                            <div className="space-y-1">
                                {Object.entries(codeDescriptions.line14).map(([code, desc]) => (
                                    <p key={code} className="text-[var(--color-steel)]">
                                        <span className="font-mono text-[var(--color-synapse-cyan)]">{code}</span>: {desc}
                                    </p>
                                ))}
                            </div>
                        </div>
                        <div>
                            <p className="font-medium text-white mb-2">Line 16 Codes (Safe Harbor)</p>
                            <div className="space-y-1">
                                {Object.entries(codeDescriptions.line16).map(([code, desc]) => (
                                    <p key={code} className="text-[var(--color-steel)]">
                                        <span className="font-mono text-[var(--color-synapse-cyan)]">{code}</span>: {desc}
                                    </p>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </motion.div>
    );
}

export default Form1095CPreview;
