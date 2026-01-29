'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, FileText, Download, Printer, ZoomIn, ZoomOut, ChevronLeft, ChevronRight } from 'lucide-react';

interface FormPreviewModalProps {
    isOpen: boolean;
    onClose: () => void;
    formType: '1095-C' | '1094-C';
    employeeName?: string;
    employeeId?: string;
    taxYear?: number;
}

export function FormPreviewModal({
    isOpen,
    onClose,
    formType,
    employeeName = 'Michael Chen',
    employeeId = 'EMP-001',
    taxYear = 2025
}: FormPreviewModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-4 md:inset-8 z-50 flex flex-col glass-card overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-4 border-b border-[var(--glass-border)] flex items-center justify-between shrink-0">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-[rgba(245,158,11,0.2)] flex items-center justify-center">
                                    <FileText className="w-5 h-5 text-[var(--color-synapse-gold)]" />
                                </div>
                                <div>
                                    <h2 className="font-semibold text-white">Form {formType} Preview</h2>
                                    <p className="text-sm text-[var(--color-steel)]">
                                        {employeeName} ({employeeId}) • Tax Year {taxYear}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="btn-secondary">
                                    <Printer className="w-4 h-4" />
                                    Print
                                </button>
                                <button className="btn-primary">
                                    <Download className="w-4 h-4" />
                                    Download PDF
                                </button>
                                <button
                                    onClick={onClose}
                                    className="p-2 rounded-lg hover:bg-[var(--glass-bg)] transition-colors ml-2"
                                >
                                    <X className="w-5 h-5 text-[var(--color-steel)]" />
                                </button>
                            </div>
                        </div>

                        {/* Toolbar */}
                        <div className="p-2 border-b border-[var(--glass-border)] flex items-center justify-center gap-4 shrink-0">
                            <button className="p-2 rounded hover:bg-[var(--glass-bg)]">
                                <ZoomOut className="w-4 h-4 text-[var(--color-steel)]" />
                            </button>
                            <span className="text-sm text-white">100%</span>
                            <button className="p-2 rounded hover:bg-[var(--glass-bg)]">
                                <ZoomIn className="w-4 h-4 text-[var(--color-steel)]" />
                            </button>
                            <div className="w-px h-5 bg-[var(--glass-border)] mx-2" />
                            <button className="p-2 rounded hover:bg-[var(--glass-bg)]">
                                <ChevronLeft className="w-4 h-4 text-[var(--color-steel)]" />
                            </button>
                            <span className="text-sm text-white">Page 1 of 2</span>
                            <button className="p-2 rounded hover:bg-[var(--glass-bg)]">
                                <ChevronRight className="w-4 h-4 text-[var(--color-steel)]" />
                            </button>
                        </div>

                        {/* Preview Content */}
                        <div className="flex-1 overflow-auto p-8 bg-[#1a1a1a]">
                            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-2xl p-8 text-black">
                                {/* Form Header */}
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <p className="text-xs text-gray-500">Form</p>
                                        <p className="text-2xl font-bold">{formType}</p>
                                        <p className="text-sm text-gray-600">
                                            Health Coverage (Tax Year {taxYear})
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-500">OMB No. 1545-2251</p>
                                        <p className="text-xs text-gray-500">{taxYear}</p>
                                    </div>
                                </div>

                                {/* Part I - Employee */}
                                <div className="border border-gray-300 rounded mb-4">
                                    <div className="bg-gray-100 px-4 py-2 border-b border-gray-300">
                                        <p className="font-semibold text-sm">Part I - Employee</p>
                                    </div>
                                    <div className="p-4 grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-gray-500">1. Name</p>
                                            <p className="font-medium">{employeeName}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">2. SSN</p>
                                            <p className="font-medium">***-**-1234</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-xs text-gray-500">3. Street Address</p>
                                            <p className="font-medium">123 Main Street, Suite 100</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">4. City</p>
                                            <p className="font-medium">San Francisco</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">5. State/ZIP</p>
                                            <p className="font-medium">CA 94102</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Part II - Employer */}
                                <div className="border border-gray-300 rounded mb-4">
                                    <div className="bg-gray-100 px-4 py-2 border-b border-gray-300">
                                        <p className="font-semibold text-sm">Part II - Employer Information</p>
                                    </div>
                                    <div className="p-4 grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-gray-500">7. Employer Name</p>
                                            <p className="font-medium">Acme Corporation</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">8. EIN</p>
                                            <p className="font-medium">12-3456789</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Part III - Monthly Data */}
                                <div className="border border-gray-300 rounded">
                                    <div className="bg-gray-100 px-4 py-2 border-b border-gray-300">
                                        <p className="font-semibold text-sm">Part III - Monthly Coverage</p>
                                    </div>
                                    <div className="p-4">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b">
                                                    <th className="text-left py-2">Month</th>
                                                    <th className="text-center py-2">14 - Offer</th>
                                                    <th className="text-center py-2">15 - Cost</th>
                                                    <th className="text-center py-2">16 - Safe Harbor</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                                                    <tr key={month} className="border-b border-gray-200">
                                                        <td className="py-1">{month}</td>
                                                        <td className="text-center">1E</td>
                                                        <td className="text-center">$125.00</td>
                                                        <td className="text-center">2C</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

export default FormPreviewModal;
