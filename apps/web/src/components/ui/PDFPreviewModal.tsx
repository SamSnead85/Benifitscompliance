'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    X,
    FileText,
    Download,
    Printer,
    Check,
    Loader2,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';

interface PDFPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    formType: '1095-C' | '1094-C';
    formId: string;
    employeeName?: string;
    clientName: string;
}

export function PDFPreviewModal({
    isOpen,
    onClose,
    formType,
    formId,
    employeeName,
    clientName
}: PDFPreviewModalProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = formType === '1095-C' ? 2 : 3;

    useEffect(() => {
        if (isOpen) {
            setIsLoading(true);
            // Simulate PDF load
            const timer = setTimeout(() => setIsLoading(false), 1000);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    const handleDownload = () => {
        // In production, trigger actual PDF download
        console.log(`Downloading ${formType} PDF for ${formId}`);
    };

    const handlePrint = () => {
        window.print();
    };

    if (!isOpen) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-[var(--color-charcoal)] rounded-xl w-full max-w-4xl h-[85vh] flex flex-col m-4 overflow-hidden border border-[var(--glass-border)]"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--glass-border)]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[rgba(6,182,212,0.15)] flex items-center justify-center">
                            <FileText className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                        </div>
                        <div>
                            <h2 className="font-semibold text-white">
                                Form {formType} Preview
                            </h2>
                            <p className="text-xs text-[var(--color-steel)]">
                                {employeeName ? `${employeeName} - ` : ''}{clientName}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handlePrint}
                            className="btn-secondary text-sm"
                        >
                            <Printer className="w-4 h-4" />
                            Print
                        </button>
                        <button
                            onClick={handleDownload}
                            className="btn-primary text-sm"
                        >
                            <Download className="w-4 h-4" />
                            Download PDF
                        </button>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-[var(--glass-bg-light)] text-[var(--color-steel)] hover:text-white transition-colors ml-2"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                {/* Preview Area */}
                <div className="flex-1 overflow-auto bg-[#1a1a1a] p-8">
                    {isLoading ? (
                        <div className="h-full flex items-center justify-center">
                            <div className="text-center">
                                <Loader2 className="w-8 h-8 text-[var(--color-synapse-teal)] mx-auto mb-3 animate-spin" />
                                <p className="text-[var(--color-steel)]">Loading PDF preview...</p>
                            </div>
                        </div>
                    ) : (
                        <div className="max-w-2xl mx-auto">
                            {/* Simulated PDF Page */}
                            <div className="bg-white rounded-lg shadow-2xl p-8 text-black">
                                {/* IRS Form Header */}
                                <div className="flex justify-between items-start mb-6 pb-4 border-b-2 border-black">
                                    <div>
                                        <p className="text-xs">Department of the Treasury - Internal Revenue Service</p>
                                        <h1 className="text-2xl font-bold mt-1">Form {formType}</h1>
                                        <p className="text-sm text-gray-600">
                                            {formType === '1095-C'
                                                ? 'Employer-Provided Health Insurance Offer and Coverage'
                                                : 'Transmittal of Employer-Provided Health Insurance'}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-lg font-bold">2026</p>
                                        <p className="text-xs text-gray-500">OMB No. 1545-2251</p>
                                    </div>
                                </div>

                                {formType === '1095-C' ? (
                                    <>
                                        {/* Part I - Employee */}
                                        <div className="mb-6">
                                            <h2 className="text-sm font-bold bg-gray-100 px-2 py-1 mb-3">Part I - Employee</h2>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <p className="text-xs text-gray-500">1. Employee's name</p>
                                                    <p className="font-medium">{employeeName || 'John Smith'}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">2. SSN</p>
                                                    <p className="font-medium">XXX-XX-4521</p>
                                                </div>
                                                <div className="col-span-2">
                                                    <p className="text-xs text-gray-500">3. Address</p>
                                                    <p className="font-medium">123 Main Street, Suite 100</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Part II - Coverage */}
                                        <div className="mb-6">
                                            <h2 className="text-sm font-bold bg-gray-100 px-2 py-1 mb-3">Part II - Employee Offer and Coverage</h2>
                                            <table className="w-full text-xs border-collapse">
                                                <thead>
                                                    <tr className="bg-gray-50">
                                                        <th className="border p-1">Month</th>
                                                        <th className="border p-1">Line 14</th>
                                                        <th className="border p-1">Line 15</th>
                                                        <th className="border p-1">Line 16</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                                                        <tr key={month}>
                                                            <td className="border p-1 text-center">{month}</td>
                                                            <td className="border p-1 text-center">1E</td>
                                                            <td className="border p-1 text-center">$125.00</td>
                                                            <td className="border p-1 text-center">2C</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        {/* 1094-C Content */}
                                        <div className="mb-6">
                                            <h2 className="text-sm font-bold bg-gray-100 px-2 py-1 mb-3">Part I - Applicable Large Employer Member (ALE)</h2>
                                            <div className="grid grid-cols-2 gap-4 text-sm">
                                                <div>
                                                    <p className="text-xs text-gray-500">1. Name of ALE Member</p>
                                                    <p className="font-medium">{clientName}</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">2. EIN</p>
                                                    <p className="font-medium">XX-XXXXXXX</p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mb-6">
                                            <h2 className="text-sm font-bold bg-gray-100 px-2 py-1 mb-3">Part II - ALE Member Information</h2>
                                            <div className="grid grid-cols-3 gap-4 text-sm">
                                                <div>
                                                    <p className="text-xs text-gray-500">18. Total employees</p>
                                                    <p className="font-medium">2,340</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">19. Full-time employees</p>
                                                    <p className="font-medium">1,872</p>
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500">20. Total 1095-C forms</p>
                                                    <p className="font-medium">2,340</p>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* Footer */}
                                <div className="mt-8 pt-4 border-t text-xs text-gray-500 text-center">
                                    <p>For Privacy Act and Paperwork Reduction Act Notice, see separate instructions.</p>
                                    <p className="mt-1">Cat. No. 60705M | Form {formType} (2026)</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer with Pagination */}
                <div className="flex items-center justify-between px-6 py-3 border-t border-[var(--glass-border)]">
                    <p className="text-sm text-[var(--color-steel)]">
                        Form ID: <span className="font-mono text-white">{formId}</span>
                    </p>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-1 rounded hover:bg-[var(--glass-bg-light)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-5 h-5 text-[var(--color-steel)]" />
                        </button>
                        <span className="text-sm text-[var(--color-silver)]">
                            Page {currentPage} of {totalPages}
                        </span>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-1 rounded hover:bg-[var(--glass-bg-light)] disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-5 h-5 text-[var(--color-steel)]" />
                        </button>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-[var(--color-steel)]">
                        <Check className="w-4 h-4 text-[var(--color-success)]" />
                        Ready for filing
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
}

export default PDFPreviewModal;
