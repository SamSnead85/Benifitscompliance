'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import {
    FileText,
    Download,
    Send,
    Calendar,
    BarChart3,
    PieChart,
    TrendingUp,
    Users,
    Building2,
    DollarSign,
    CheckCircle2,
    Clock,
    FileCheck,
    Printer,
    Mail,
} from 'lucide-react';

interface ReportConfig {
    type: 'compliance_summary' | 'penalty_exposure' | 'workforce_analysis' | 'board_package';
    period: string;
    format: 'pdf' | 'excel' | 'presentation';
    includeCharts: boolean;
    includeBreakdown: boolean;
    recipients?: string[];
}

interface BoardReportGeneratorProps {
    organizations: Array<{ id: string; name: string }>;
    className?: string;
    onGenerate?: (config: ReportConfig) => void;
}

/**
 * Board Report Generator
 * Executive-ready PDF reports with branded templates
 */
export function BoardReportGenerator({
    organizations,
    className = '',
    onGenerate,
}: BoardReportGeneratorProps) {
    const [selectedType, setSelectedType] = useState<string>('compliance_summary');
    const [selectedOrgs, setSelectedOrgs] = useState<string[]>([]);
    const [period, setPeriod] = useState('current_quarter');
    const [format, setFormat] = useState<'pdf' | 'excel' | 'presentation'>('pdf');
    const [includeCharts, setIncludeCharts] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);

    const reportTypes = [
        {
            id: 'compliance_summary',
            label: 'Compliance Summary',
            icon: <FileCheck className="w-4 h-4" />,
            description: 'Overall compliance status with key metrics',
            pages: '8-12 pages'
        },
        {
            id: 'penalty_exposure',
            label: 'Penalty Exposure Analysis',
            icon: <DollarSign className="w-4 h-4" />,
            description: '4980H exposure breakdown by entity',
            pages: '6-10 pages'
        },
        {
            id: 'workforce_analysis',
            label: 'Workforce Analysis',
            icon: <Users className="w-4 h-4" />,
            description: 'FT/PT distribution and hour trends',
            pages: '10-15 pages'
        },
        {
            id: 'board_package',
            label: 'Board Package',
            icon: <BarChart3 className="w-4 h-4" />,
            description: 'Complete executive presentation',
            pages: '20-25 pages'
        },
    ];

    const periods = [
        { id: 'current_quarter', label: 'Current Quarter' },
        { id: 'ytd', label: 'Year-to-Date' },
        { id: 'prior_year', label: 'Prior Year' },
        { id: 'custom', label: 'Custom Range' },
    ];

    const handleGenerate = async () => {
        setIsGenerating(true);

        // Simulate report generation
        await new Promise(resolve => setTimeout(resolve, 3000));

        onGenerate?.({
            type: selectedType as ReportConfig['type'],
            period,
            format,
            includeCharts,
            includeBreakdown: true,
        });

        setIsGenerating(false);
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card overflow-hidden ${className}`}
        >
            {/* Header */}
            <div className="p-5 border-b border-[rgba(255,255,255,0.06)]">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                        <h2 className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-display)' }}>
                            Board Report Generator
                        </h2>
                        <p className="text-sm text-[#64748B]">Executive-ready documents</p>
                    </div>
                </div>
            </div>

            <div className="p-5 space-y-6">
                {/* Report Type Selection */}
                <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-3 block">
                        Report Type
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                        {reportTypes.map(type => (
                            <button
                                key={type.id}
                                onClick={() => setSelectedType(type.id)}
                                className={`
                  p-4 rounded-lg border text-left transition-all duration-200
                  ${selectedType === type.id
                                        ? 'bg-cyan-500/10 border-cyan-500/30'
                                        : 'bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.06)] hover:border-[rgba(255,255,255,0.12)]'
                                    }
                `}
                            >
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={selectedType === type.id ? 'text-cyan-400' : 'text-[#64748B]'}>
                                        {type.icon}
                                    </span>
                                    <span className={`text-sm font-medium ${selectedType === type.id ? 'text-cyan-400' : 'text-white'}`}>
                                        {type.label}
                                    </span>
                                </div>
                                <p className="text-xs text-[#64748B]">{type.description}</p>
                                <p className="text-xs text-[#94A3B8] mt-1">{type.pages}</p>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Period Selection */}
                <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-3 block">
                        Time Period
                    </label>
                    <div className="flex gap-2">
                        {periods.map(p => (
                            <button
                                key={p.id}
                                onClick={() => setPeriod(p.id)}
                                className={`
                  px-4 py-2 text-xs font-medium rounded-md transition-all
                  ${period === p.id
                                        ? 'bg-cyan-500/20 text-cyan-400'
                                        : 'text-[#94A3B8] hover:bg-[rgba(255,255,255,0.04)] hover:text-white'
                                    }
                `}
                            >
                                {p.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Format Selection */}
                <div>
                    <label className="text-xs font-semibold uppercase tracking-wider text-[#64748B] mb-3 block">
                        Output Format
                    </label>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFormat('pdf')}
                            className={`
                flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-md
                ${format === 'pdf' ? 'bg-cyan-500/20 text-cyan-400' : 'text-[#94A3B8] hover:bg-[rgba(255,255,255,0.04)]'}
              `}
                        >
                            <FileText className="w-4 h-4" />
                            PDF
                        </button>
                        <button
                            onClick={() => setFormat('excel')}
                            className={`
                flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-md
                ${format === 'excel' ? 'bg-cyan-500/20 text-cyan-400' : 'text-[#94A3B8] hover:bg-[rgba(255,255,255,0.04)]'}
              `}
                        >
                            <BarChart3 className="w-4 h-4" />
                            Excel
                        </button>
                        <button
                            onClick={() => setFormat('presentation')}
                            className={`
                flex items-center gap-2 px-4 py-2 text-xs font-medium rounded-md
                ${format === 'presentation' ? 'bg-cyan-500/20 text-cyan-400' : 'text-[#94A3B8] hover:bg-[rgba(255,255,255,0.04)]'}
              `}
                        >
                            <PieChart className="w-4 h-4" />
                            Presentation
                        </button>
                    </div>
                </div>

                {/* Options */}
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={includeCharts}
                            onChange={(e) => setIncludeCharts(e.target.checked)}
                            className="w-4 h-4 rounded border-[rgba(255,255,255,0.2)] bg-transparent text-cyan-500 focus:ring-cyan-500"
                        />
                        <span className="text-sm text-[#94A3B8]">Include Charts & Visualizations</span>
                    </label>
                </div>

                {/* Generate Button */}
                <div className="flex gap-3">
                    <motion.button
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`
              flex-1 flex items-center justify-center gap-2 px-4 py-3
              bg-gradient-to-b from-cyan-500 to-teal-600 text-[#030712] font-semibold
              rounded-lg transition-all disabled:opacity-50
              shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.25)]
            `}
                    >
                        {isGenerating ? (
                            <>
                                <Clock className="w-4 h-4 animate-spin" />
                                Generating Report...
                            </>
                        ) : (
                            <>
                                <Download className="w-4 h-4" />
                                Generate Report
                            </>
                        )}
                    </motion.button>

                    <button className="px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[#94A3B8] hover:text-white transition-colors">
                        <Mail className="w-4 h-4" />
                    </button>

                    <button className="px-4 py-3 rounded-lg bg-[rgba(255,255,255,0.04)] border border-[rgba(255,255,255,0.08)] text-[#94A3B8] hover:text-white transition-colors">
                        <Printer className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

export default BoardReportGenerator;
