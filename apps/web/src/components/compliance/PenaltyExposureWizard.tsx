'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    AlertTriangle,
    DollarSign,
    Users,
    Calculator,
    FileText,
    ChevronRight,
    ChevronLeft,
    CheckCircle2,
    XCircle,
    TrendingUp,
    TrendingDown,
    Shield,
    Download,
    Loader2,
    Info,
    BarChart3,
    Target,
    Zap,
    Calendar,
    Search,
    Filter,
    Eye,
    ChevronDown,
    ChevronUp
} from 'lucide-react';

interface PenaltyExposureWizardProps {
    className?: string;
}

interface PenaltyAssessment {
    employeeId: string;
    name: string;
    department: string;
    penaltyType: '4980H_a' | '4980H_b' | 'none';
    reason: string;
    monthlyPenalty: number;
    annualizedPenalty: number;
    mitigationOptions: string[];
    riskLevel: 'high' | 'medium' | 'low';
    affectedMonths: number;
}

interface PenaltyScenario {
    id: string;
    name: string;
    description: string;
    totalExposure: number;
    employeesAffected: number;
    riskLevel: 'high' | 'medium' | 'low';
}

const mockAssessments: PenaltyAssessment[] = [
    { employeeId: 'E001', name: 'John Smith', department: 'Engineering', penaltyType: '4980H_b', reason: 'Affordability failure - premium exceeds 9.12% of FPL', monthlyPenalty: 365.83, annualizedPenalty: 4390, mitigationOptions: ['Reduce employee share', 'Adjust to W-2 safe harbor'], riskLevel: 'high', affectedMonths: 12 },
    { employeeId: 'E002', name: 'Sarah Johnson', department: 'Marketing', penaltyType: '4980H_b', reason: 'MEC offer failure - coverage declined but not MEC compliant', monthlyPenalty: 365.83, annualizedPenalty: 4390, mitigationOptions: ['Verify plan meets MEC requirements'], riskLevel: 'medium', affectedMonths: 6 },
    { employeeId: 'E003', name: 'Michael Brown', department: 'Sales', penaltyType: 'none', reason: 'N/A', monthlyPenalty: 0, annualizedPenalty: 0, mitigationOptions: [], riskLevel: 'low', affectedMonths: 0 },
    { employeeId: 'E004', name: 'Emily Davis', department: 'HR', penaltyType: '4980H_a', reason: 'No offer of coverage to FT employee', monthlyPenalty: 243.33, annualizedPenalty: 2920, mitigationOptions: ['Extend coverage offer immediately', 'Document prior waiver'], riskLevel: 'high', affectedMonths: 12 },
    { employeeId: 'E005', name: 'David Wilson', department: 'Finance', penaltyType: '4980H_b', reason: 'Affordability failure - premium exceeds safe harbor', monthlyPenalty: 365.83, annualizedPenalty: 4390, mitigationOptions: ['Reduce employee share to meet FPL safe harbor'], riskLevel: 'high', affectedMonths: 12 },
    { employeeId: 'E006', name: 'Jessica Martinez', department: 'Operations', penaltyType: 'none', reason: 'N/A', monthlyPenalty: 0, annualizedPenalty: 0, mitigationOptions: [], riskLevel: 'low', affectedMonths: 0 },
    { employeeId: 'E007', name: 'Robert Taylor', department: 'Engineering', penaltyType: '4980H_b', reason: 'Minimum value failure - actuarial value below 60%', monthlyPenalty: 365.83, annualizedPenalty: 4390, mitigationOptions: ['Review plan design with actuary', 'Upgrade to qualifying plan'], riskLevel: 'medium', affectedMonths: 8 },
    { employeeId: 'E008', name: 'Amanda Anderson', department: 'Support', penaltyType: 'none', reason: 'N/A', monthlyPenalty: 0, annualizedPenalty: 0, mitigationOptions: [], riskLevel: 'low', affectedMonths: 0 },
];

const mockScenarios: PenaltyScenario[] = [
    { id: 'scenario1', name: 'Current State', description: 'Based on current coverage offers and employee share amounts', totalExposure: 24870, employeesAffected: 5, riskLevel: 'high' },
    { id: 'scenario2', name: 'Premium Reduction', description: 'Reduce employee share by $50/month across all plans', totalExposure: 8780, employeesAffected: 2, riskLevel: 'medium' },
    { id: 'scenario3', name: 'Full Remediation', description: 'Address all identified compliance gaps', totalExposure: 0, employeesAffected: 0, riskLevel: 'low' },
];

const steps = [
    { id: 'config', title: 'Configuration', icon: Calendar, description: 'Select tax year and parameters' },
    { id: 'analyze', title: 'Analyze Risk', icon: Calculator, description: 'Calculate potential penalty exposure' },
    { id: 'scenarios', title: 'Scenarios', icon: BarChart3, description: 'Compare mitigation strategies' },
    { id: 'report', title: 'Report', icon: FileText, description: 'Review and export assessment' },
];

export function PenaltyExposureWizard({ className = '' }: PenaltyExposureWizardProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedYear, setSelectedYear] = useState('2025');
    const [selectedScenario, setSelectedScenario] = useState<string>('scenario1');
    const [expandedRows, setExpandedRows] = useState<string[]>([]);
    const [riskFilter, setRiskFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState<PenaltyAssessment[]>([]);

    const nextStep = () => {
        if (currentStep === 1 && results.length === 0) {
            // Process analysis
            setIsProcessing(true);
            setTimeout(() => {
                setIsProcessing(false);
                setResults(mockAssessments);
                setCurrentStep(currentStep + 1);
            }, 2000);
        } else if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const toggleRow = (id: string) => {
        setExpandedRows(prev =>
            prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
        );
    };

    const filteredResults = results.filter(r => {
        const matchesRisk = riskFilter === 'all' || r.riskLevel === riskFilter;
        const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesRisk && matchesSearch;
    });

    const stats = {
        total: results.length,
        atRisk: results.filter(r => r.penaltyType !== 'none').length,
        totalExposure: results.reduce((acc, r) => acc + r.annualizedPenalty, 0),
        highRisk: results.filter(r => r.riskLevel === 'high').length,
        mediumRisk: results.filter(r => r.riskLevel === 'medium').length,
        penaltyA: results.filter(r => r.penaltyType === '4980H_a').reduce((acc, r) => acc + r.annualizedPenalty, 0),
        penaltyB: results.filter(r => r.penaltyType === '4980H_b').reduce((acc, r) => acc + r.annualizedPenalty, 0),
    };

    const renderStepContent = () => {
        switch (steps[currentStep].id) {
            case 'config':
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-silver)] mb-3">Tax Year</label>
                            <div className="flex gap-3">
                                {['2023', '2024', '2025', '2026'].map(year => (
                                    <button
                                        key={year}
                                        onClick={() => setSelectedYear(year)}
                                        className={`px-6 py-3 rounded-lg border font-medium transition-all ${selectedYear === year
                                            ? 'bg-[var(--color-synapse-teal)] border-[var(--color-synapse-teal)] text-black'
                                            : 'bg-[rgba(255,255,255,0.02)] border-[var(--glass-border)] text-white hover:border-[var(--glass-border-hover)]'
                                            }`}
                                    >
                                        {year}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="p-5 rounded-lg bg-[rgba(239,68,68,0.05)] border border-[rgba(239,68,68,0.2)]">
                                <div className="flex items-center gap-3 mb-3">
                                    <AlertTriangle className="w-6 h-6 text-[var(--color-critical)]" />
                                    <h4 className="font-semibold text-white">4980H(a) Penalty</h4>
                                </div>
                                <p className="text-sm text-[var(--color-steel)] mb-3">
                                    "No Offer" penalty - Triggered when ALE fails to offer MEC to at least 95% of FT employees
                                </p>
                                <div className="p-3 rounded bg-[rgba(255,255,255,0.03)]">
                                    <p className="text-xs text-[var(--color-steel)]">{selectedYear} Annual Amount</p>
                                    <p className="text-xl font-bold text-[var(--color-critical)]">$2,970 <span className="text-sm font-normal text-[var(--color-steel)]">per FT employee</span></p>
                                </div>
                            </div>

                            <div className="p-5 rounded-lg bg-[rgba(245,158,11,0.05)] border border-[rgba(245,158,11,0.2)]">
                                <div className="flex items-center gap-3 mb-3">
                                    <DollarSign className="w-6 h-6 text-[var(--color-warning)]" />
                                    <h4 className="font-semibold text-white">4980H(b) Penalty</h4>
                                </div>
                                <p className="text-sm text-[var(--color-steel)] mb-3">
                                    "Affordability" penalty - Triggered when coverage is unaffordable or doesn't provide MV
                                </p>
                                <div className="p-3 rounded bg-[rgba(255,255,255,0.03)]">
                                    <p className="text-xs text-[var(--color-steel)]">{selectedYear} Annual Amount</p>
                                    <p className="text-xl font-bold text-[var(--color-warning)]">$4,460 <span className="text-sm font-normal text-[var(--color-steel)]">per affected employee</span></p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 rounded-lg bg-[rgba(6,182,212,0.05)] border border-[rgba(6,182,212,0.2)] flex items-start gap-3">
                            <Info className="w-5 h-5 text-[var(--color-synapse-teal)] flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium text-[var(--color-synapse-teal)]">Analysis Scope</p>
                                <p className="text-sm text-[var(--color-steel)]">
                                    This wizard will analyze all full-time employees for the selected tax year to identify
                                    potential penalty exposure based on coverage offers, affordability, and minimum value requirements.
                                </p>
                            </div>
                        </div>
                    </div>
                );

            case 'analyze':
                if (isProcessing) {
                    return (
                        <div className="py-12 text-center">
                            <Loader2 className="w-16 h-16 mx-auto mb-6 text-[var(--color-synapse-teal)] animate-spin" />
                            <h3 className="text-xl font-semibold text-white mb-2">Analyzing Penalty Exposure</h3>
                            <p className="text-[var(--color-steel)] mb-6">
                                Evaluating coverage offers, affordability calculations, and minimum value compliance...
                            </p>
                            <div className="max-w-md mx-auto">
                                <div className="h-2 rounded-full bg-[rgba(255,255,255,0.1)] overflow-hidden">
                                    <motion.div
                                        className="h-full bg-[var(--color-synapse-teal)]"
                                        initial={{ width: 0 }}
                                        animate={{ width: '100%' }}
                                        transition={{ duration: 2 }}
                                    />
                                </div>
                            </div>
                        </div>
                    );
                }

                return (
                    <div className="space-y-6">
                        <div className="text-center py-8">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[rgba(239,68,68,0.1)] flex items-center justify-center">
                                <AlertTriangle className="w-10 h-10 text-[var(--color-critical)]" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Ready to Analyze</h3>
                            <p className="text-[var(--color-steel)] max-w-lg mx-auto">
                                Click "Analyze Risk" to evaluate potential IRS penalty exposure for tax year {selectedYear}.
                                This analysis will identify employees at risk and calculate potential penalty amounts.
                            </p>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)]">
                                <div className="flex items-center gap-2 mb-2">
                                    <Users className="w-4 h-4 text-[var(--color-synapse-teal)]" />
                                    <span className="text-sm text-[var(--color-steel)]">FT Employees</span>
                                </div>
                                <p className="text-2xl font-bold text-white">4,256</p>
                            </div>
                            <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)]">
                                <div className="flex items-center gap-2 mb-2">
                                    <Calendar className="w-4 h-4 text-[var(--color-synapse-teal)]" />
                                    <span className="text-sm text-[var(--color-steel)]">Tax Year</span>
                                </div>
                                <p className="text-2xl font-bold text-white">{selectedYear}</p>
                            </div>
                            <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)]">
                                <div className="flex items-center gap-2 mb-2">
                                    <Shield className="w-4 h-4 text-[var(--color-synapse-teal)]" />
                                    <span className="text-sm text-[var(--color-steel)]">Offer Rate</span>
                                </div>
                                <p className="text-2xl font-bold text-white">98.2%</p>
                            </div>
                        </div>
                    </div>
                );

            case 'scenarios':
                return (
                    <div className="space-y-6">
                        {/* Summary Stats */}
                        <div className="grid grid-cols-4 gap-4">
                            <div className="p-4 rounded-lg bg-[rgba(239,68,68,0.05)] border border-[rgba(239,68,68,0.2)]">
                                <p className="text-xs text-[var(--color-steel)]">Total Exposure</p>
                                <p className="text-2xl font-bold text-[var(--color-critical)]">${stats.totalExposure.toLocaleString()}</p>
                            </div>
                            <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)]">
                                <p className="text-xs text-[var(--color-steel)]">Employees at Risk</p>
                                <p className="text-2xl font-bold text-white">{stats.atRisk}</p>
                            </div>
                            <div className="p-4 rounded-lg bg-[rgba(239,68,68,0.05)] border border-[rgba(239,68,68,0.2)]">
                                <p className="text-xs text-[var(--color-steel)]">4980H(a) Exposure</p>
                                <p className="text-2xl font-bold text-[var(--color-critical)]">${stats.penaltyA.toLocaleString()}</p>
                            </div>
                            <div className="p-4 rounded-lg bg-[rgba(245,158,11,0.05)] border border-[rgba(245,158,11,0.2)]">
                                <p className="text-xs text-[var(--color-steel)]">4980H(b) Exposure</p>
                                <p className="text-2xl font-bold text-[var(--color-warning)]">${stats.penaltyB.toLocaleString()}</p>
                            </div>
                        </div>

                        {/* Scenario Comparison */}
                        <div>
                            <h4 className="font-medium text-white mb-3">Mitigation Scenarios</h4>
                            <div className="space-y-3">
                                {mockScenarios.map(scenario => (
                                    <button
                                        key={scenario.id}
                                        onClick={() => setSelectedScenario(scenario.id)}
                                        className={`w-full p-4 rounded-lg border text-left transition-all ${selectedScenario === scenario.id
                                            ? 'bg-[var(--color-synapse-teal-muted)] border-[var(--color-synapse-teal)]'
                                            : 'bg-[rgba(255,255,255,0.02)] border-[var(--glass-border)] hover:border-[var(--glass-border-hover)]'
                                            }`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-3 h-3 rounded-full ${scenario.riskLevel === 'high'
                                                    ? 'bg-[var(--color-critical)]'
                                                    : scenario.riskLevel === 'medium'
                                                        ? 'bg-[var(--color-warning)]'
                                                        : 'bg-[var(--color-success)]'
                                                    }`} />
                                                <p className={`font-medium ${selectedScenario === scenario.id ? 'text-[var(--color-synapse-teal)]' : 'text-white'}`}>
                                                    {scenario.name}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <p className={`font-bold ${scenario.totalExposure === 0 ? 'text-[var(--color-success)]' : 'text-[var(--color-critical)]'}`}>
                                                    ${scenario.totalExposure.toLocaleString()}
                                                </p>
                                                <p className="text-xs text-[var(--color-steel)]">{scenario.employeesAffected} employees affected</p>
                                            </div>
                                        </div>
                                        <p className="text-sm text-[var(--color-steel)]">{scenario.description}</p>
                                        {scenario.totalExposure < stats.totalExposure && scenario.totalExposure > 0 && (
                                            <div className="mt-2 flex items-center gap-1 text-sm text-[var(--color-success)]">
                                                <TrendingDown className="w-4 h-4" />
                                                Saves ${(stats.totalExposure - scenario.totalExposure).toLocaleString()}
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'report':
                return (
                    <div className="space-y-4">
                        {/* Filters */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-steel)]" />
                                    <input
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search employees..."
                                        className="pl-10 pr-4 py-2 text-sm bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white placeholder:text-[var(--color-steel)] focus:outline-none focus:border-[var(--color-synapse-teal)]"
                                    />
                                </div>
                                <div className="flex items-center gap-1">
                                    {[
                                        { id: 'all', label: 'All' },
                                        { id: 'high', label: 'High Risk' },
                                        { id: 'medium', label: 'Medium' },
                                        { id: 'low', label: 'Low/None' },
                                    ].map(f => (
                                        <button
                                            key={f.id}
                                            onClick={() => setRiskFilter(f.id as any)}
                                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${riskFilter === f.id
                                                ? 'bg-[var(--color-synapse-teal)] text-black'
                                                : 'text-[var(--color-steel)] hover:bg-[rgba(255,255,255,0.05)]'
                                                }`}
                                        >
                                            {f.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <button className="btn-secondary flex items-center gap-2 text-sm">
                                    <Download className="w-4 h-4" />
                                    Export PDF
                                </button>
                                <button className="btn-secondary flex items-center gap-2 text-sm">
                                    <Download className="w-4 h-4" />
                                    Export CSV
                                </button>
                            </div>
                        </div>

                        {/* Results */}
                        <div className="max-h-[350px] overflow-y-auto rounded-lg border border-[var(--glass-border)]">
                            {filteredResults.map((result, index) => (
                                <motion.div
                                    key={result.employeeId}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: index * 0.02 }}
                                    className="border-b border-[var(--glass-border)] last:border-0"
                                >
                                    <button
                                        onClick={() => toggleRow(result.employeeId)}
                                        className="w-full p-4 flex items-center justify-between hover:bg-[rgba(255,255,255,0.02)] transition-colors text-left"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className={`w-3 h-3 rounded-full ${result.riskLevel === 'high'
                                                ? 'bg-[var(--color-critical)]'
                                                : result.riskLevel === 'medium'
                                                    ? 'bg-[var(--color-warning)]'
                                                    : 'bg-[var(--color-success)]'
                                                }`} />
                                            <div>
                                                <p className="font-medium text-white">{result.name}</p>
                                                <p className="text-xs text-[var(--color-steel)]">{result.employeeId} • {result.department}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                            {result.penaltyType !== 'none' ? (
                                                <>
                                                    <div className="text-right">
                                                        <span className={`px-2 py-1 text-[10px] font-bold rounded ${result.penaltyType === '4980H_a'
                                                            ? 'bg-[rgba(239,68,68,0.1)] text-[var(--color-critical)]'
                                                            : 'bg-[rgba(245,158,11,0.1)] text-[var(--color-warning)]'
                                                            }`}>
                                                            {result.penaltyType === '4980H_a' ? '4980H(a)' : '4980H(b)'}
                                                        </span>
                                                    </div>
                                                    <div className="text-right min-w-[100px]">
                                                        <p className="font-bold text-[var(--color-critical)]">${result.annualizedPenalty.toLocaleString()}</p>
                                                        <p className="text-xs text-[var(--color-steel)]">{result.affectedMonths} months</p>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex items-center gap-2 text-[var(--color-success)]">
                                                    <CheckCircle2 className="w-4 h-4" />
                                                    <span className="text-sm">No Exposure</span>
                                                </div>
                                            )}
                                            {expandedRows.includes(result.employeeId)
                                                ? <ChevronUp className="w-4 h-4 text-[var(--color-steel)]" />
                                                : <ChevronDown className="w-4 h-4 text-[var(--color-steel)]" />
                                            }
                                        </div>
                                    </button>
                                    <AnimatePresence>
                                        {expandedRows.includes(result.employeeId) && result.penaltyType !== 'none' && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                className="overflow-hidden bg-[rgba(255,255,255,0.01)] border-t border-[var(--glass-border)]"
                                            >
                                                <div className="p-4 space-y-3">
                                                    <div>
                                                        <p className="text-xs text-[var(--color-steel)] mb-1">Reason</p>
                                                        <p className="text-sm text-white">{result.reason}</p>
                                                    </div>
                                                    {result.mitigationOptions.length > 0 && (
                                                        <div>
                                                            <p className="text-xs text-[var(--color-steel)] mb-2">Mitigation Options</p>
                                                            <div className="flex flex-wrap gap-2">
                                                                {result.mitigationOptions.map((option, i) => (
                                                                    <span key={i} className="px-3 py-1.5 text-xs bg-[rgba(6,182,212,0.1)] text-[var(--color-synapse-teal)] rounded-full">
                                                                        {option}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`glass-card ${className}`}
        >
            {/* Header */}
            <div className="p-5 border-b border-[var(--glass-border)]">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-synapse-coral)] to-[var(--color-critical)] flex items-center justify-center">
                        <AlertTriangle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold text-white">Penalty Exposure Wizard</h1>
                        <p className="text-sm text-[var(--color-steel)]">Analyze IRS 4980H penalty risk and mitigation strategies</p>
                    </div>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="px-5 py-4 border-b border-[var(--glass-border)]">
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        const isCompleted = index < currentStep;
                        const isCurrent = index === currentStep;

                        return (
                            <div key={step.id} className="flex items-center">
                                <div className={`flex items-center gap-2 ${isCurrent ? '' : 'opacity-70'}`}>
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isCompleted
                                        ? 'bg-[var(--color-success)] text-black'
                                        : isCurrent
                                            ? 'bg-[var(--color-synapse-teal)] text-black'
                                            : 'bg-[rgba(255,255,255,0.05)] text-[var(--color-steel)]'
                                        }`}>
                                        {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                                    </div>
                                    <div className="hidden lg:block">
                                        <p className={`text-sm font-medium ${isCurrent ? 'text-white' : 'text-[var(--color-steel)]'}`}>
                                            {step.title}
                                        </p>
                                    </div>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className={`w-12 lg:w-20 h-0.5 mx-2 ${isCompleted ? 'bg-[var(--color-success)]' : 'bg-[var(--glass-border)]'}`} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Step Content */}
            <div className="p-6 min-h-[450px]">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={currentStep}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.2 }}
                    >
                        <h3 className="text-lg font-semibold text-white mb-2">{steps[currentStep].title}</h3>
                        <p className="text-sm text-[var(--color-steel)] mb-6">{steps[currentStep].description}</p>
                        {renderStepContent()}
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="px-5 py-4 border-t border-[var(--glass-border)] flex items-center justify-between">
                <button
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${currentStep === 0
                        ? 'text-[var(--color-steel)] cursor-not-allowed'
                        : 'text-white hover:bg-[rgba(255,255,255,0.05)]'
                        }`}
                >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                </button>
                {currentStep < steps.length - 1 ? (
                    <button onClick={nextStep} className="btn-primary flex items-center gap-2">
                        {currentStep === 1 ? (
                            <>
                                <Calculator className="w-4 h-4" />
                                Analyze Risk
                            </>
                        ) : (
                            <>
                                Continue
                                <ChevronRight className="w-4 h-4" />
                            </>
                        )}
                    </button>
                ) : (
                    <button className="btn-primary flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        Generate Report
                    </button>
                )}
            </div>
        </motion.div>
    );
}

export default PenaltyExposureWizard;
