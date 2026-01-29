'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Users,
    Clock,
    Calendar,
    ChevronRight,
    ChevronLeft,
    CheckCircle2,
    AlertTriangle,
    Calculator,
    FileText,
    Search,
    Filter,
    Download,
    Loader2,
    TrendingUp,
    TrendingDown,
    Minus,
    BarChart3,
    RefreshCw,
    Info,
    Target,
    Shield
} from 'lucide-react';

interface ACAEligibilityWizardProps {
    className?: string;
}

interface EligibilityResult {
    employeeId: string;
    name: string;
    ssn: string;
    department: string;
    averageHours: number;
    ftStatus: 'full-time' | 'part-time' | 'variable';
    previousStatus: 'full-time' | 'part-time' | 'variable';
    statusChanged: boolean;
    coverageRequired: boolean;
    measurementPeriod: string;
    stabilityPeriod: string;
}

interface PeriodConfig {
    measurementStart: string;
    measurementEnd: string;
    adminStart: string;
    adminEnd: string;
    stabilityStart: string;
    stabilityEnd: string;
}

const mockResults: EligibilityResult[] = [
    { employeeId: 'E001', name: 'John Smith', ssn: '***-**-1234', department: 'Engineering', averageHours: 38.5, ftStatus: 'full-time', previousStatus: 'full-time', statusChanged: false, coverageRequired: true, measurementPeriod: 'Jan-Dec 2025', stabilityPeriod: 'Feb-Jan 2026-27' },
    { employeeId: 'E002', name: 'Sarah Johnson', ssn: '***-**-5678', department: 'Marketing', averageHours: 32.0, ftStatus: 'full-time', previousStatus: 'part-time', statusChanged: true, coverageRequired: true, measurementPeriod: 'Jan-Dec 2025', stabilityPeriod: 'Feb-Jan 2026-27' },
    { employeeId: 'E003', name: 'Michael Brown', ssn: '***-**-9012', department: 'Sales', averageHours: 28.5, ftStatus: 'part-time', previousStatus: 'part-time', statusChanged: false, coverageRequired: false, measurementPeriod: 'Jan-Dec 2025', stabilityPeriod: 'Feb-Jan 2026-27' },
    { employeeId: 'E004', name: 'Emily Davis', ssn: '***-**-3456', department: 'HR', averageHours: 40.0, ftStatus: 'full-time', previousStatus: 'full-time', statusChanged: false, coverageRequired: true, measurementPeriod: 'Jan-Dec 2025', stabilityPeriod: 'Feb-Jan 2026-27' },
    { employeeId: 'E005', name: 'David Wilson', ssn: '***-**-7890', department: 'Finance', averageHours: 35.2, ftStatus: 'full-time', previousStatus: 'variable', statusChanged: true, coverageRequired: true, measurementPeriod: 'Jan-Dec 2025', stabilityPeriod: 'Feb-Jan 2026-27' },
    { employeeId: 'E006', name: 'Jessica Martinez', ssn: '***-**-2345', department: 'Operations', averageHours: 25.0, ftStatus: 'part-time', previousStatus: 'full-time', statusChanged: true, coverageRequired: false, measurementPeriod: 'Jan-Dec 2025', stabilityPeriod: 'Feb-Jan 2026-27' },
    { employeeId: 'E007', name: 'Robert Taylor', ssn: '***-**-6789', department: 'Engineering', averageHours: 42.0, ftStatus: 'full-time', previousStatus: 'full-time', statusChanged: false, coverageRequired: true, measurementPeriod: 'Jan-Dec 2025', stabilityPeriod: 'Feb-Jan 2026-27' },
    { employeeId: 'E008', name: 'Amanda Anderson', ssn: '***-**-0123', department: 'Support', averageHours: 30.5, ftStatus: 'variable', previousStatus: 'variable', statusChanged: false, coverageRequired: true, measurementPeriod: 'Jan-Dec 2025', stabilityPeriod: 'Feb-Jan 2026-27' },
];

const steps = [
    { id: 'period', title: 'Select Period', icon: Calendar, description: 'Choose measurement and stability periods' },
    { id: 'employees', title: 'Employee Selection', icon: Users, description: 'Select employees to analyze' },
    { id: 'calculate', title: 'Calculate Eligibility', icon: Calculator, description: 'Process hours and determine status' },
    { id: 'results', title: 'Review Results', icon: FileText, description: 'Review and export determinations' },
];

export function ACAEligibilityWizard({ className = '' }: ACAEligibilityWizardProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [selectedPeriod, setSelectedPeriod] = useState<'ongoing' | 'new_hire' | 'custom'>('ongoing');
    const [employeeFilter, setEmployeeFilter] = useState<'all' | 'variable' | 'new'>('all');
    const [selectedEmployees, setSelectedEmployees] = useState<string[]>(mockResults.map(r => r.employeeId));
    const [results, setResults] = useState<EligibilityResult[]>([]);
    const [statusFilter, setStatusFilter] = useState<'all' | 'full-time' | 'part-time' | 'variable' | 'changed'>('all');
    const [searchQuery, setSearchQuery] = useState('');

    const [periodConfig] = useState<PeriodConfig>({
        measurementStart: '2025-01-01',
        measurementEnd: '2025-12-31',
        adminStart: '2026-01-01',
        adminEnd: '2026-01-31',
        stabilityStart: '2026-02-01',
        stabilityEnd: '2027-01-31',
    });

    const nextStep = () => {
        if (currentStep === 2 && !isComplete) {
            // Process calculation
            setIsProcessing(true);
            setTimeout(() => {
                setIsProcessing(false);
                setIsComplete(true);
                setResults(mockResults);
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

    const toggleEmployee = (id: string) => {
        setSelectedEmployees(prev =>
            prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
        );
    };

    const selectAllEmployees = () => {
        setSelectedEmployees(mockResults.map(r => r.employeeId));
    };

    const deselectAllEmployees = () => {
        setSelectedEmployees([]);
    };

    const filteredResults = results.filter(r => {
        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'changed' ? r.statusChanged : r.ftStatus === statusFilter);
        const matchesSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.employeeId.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesStatus && matchesSearch;
    });

    const stats = {
        total: results.length,
        fullTime: results.filter(r => r.ftStatus === 'full-time').length,
        partTime: results.filter(r => r.ftStatus === 'part-time').length,
        variable: results.filter(r => r.ftStatus === 'variable').length,
        changed: results.filter(r => r.statusChanged).length,
        coverageRequired: results.filter(r => r.coverageRequired).length,
    };

    const renderStepContent = () => {
        switch (steps[currentStep].id) {
            case 'period':
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-silver)] mb-3">Measurement Type</label>
                            <div className="grid grid-cols-3 gap-4">
                                {[
                                    { id: 'ongoing', label: 'Ongoing Employees', desc: 'Standard 12-month look-back period' },
                                    { id: 'new_hire', label: 'New Hire Initial', desc: '3-12 month initial measurement' },
                                    { id: 'custom', label: 'Custom Period', desc: 'Define custom start/end dates' },
                                ].map(period => (
                                    <button
                                        key={period.id}
                                        onClick={() => setSelectedPeriod(period.id as any)}
                                        className={`p-4 rounded-lg border text-left transition-all ${selectedPeriod === period.id
                                            ? 'bg-[var(--color-synapse-teal-muted)] border-[var(--color-synapse-teal)]'
                                            : 'bg-[rgba(255,255,255,0.02)] border-[var(--glass-border)] hover:border-[var(--glass-border-hover)]'
                                            }`}
                                    >
                                        <p className={`font-medium ${selectedPeriod === period.id ? 'text-[var(--color-synapse-teal)]' : 'text-white'}`}>
                                            {period.label}
                                        </p>
                                        <p className="text-sm text-[var(--color-steel)] mt-1">{period.desc}</p>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="p-5 rounded-lg bg-[rgba(6,182,212,0.05)] border border-[rgba(6,182,212,0.2)]">
                            <h4 className="font-medium text-white mb-4 flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                                Period Configuration
                            </h4>
                            <div className="grid grid-cols-3 gap-6">
                                <div>
                                    <p className="text-xs text-[var(--color-steel)] mb-1">Measurement Period</p>
                                    <p className="font-medium text-white">Jan 1, 2025 - Dec 31, 2025</p>
                                    <p className="text-xs text-[var(--color-synapse-teal)]">12 months</p>
                                </div>
                                <div>
                                    <p className="text-xs text-[var(--color-steel)] mb-1">Administrative Period</p>
                                    <p className="font-medium text-white">Jan 1, 2026 - Jan 31, 2026</p>
                                    <p className="text-xs text-[var(--color-synapse-teal)]">1 month</p>
                                </div>
                                <div>
                                    <p className="text-xs text-[var(--color-steel)] mb-1">Stability Period</p>
                                    <p className="font-medium text-white">Feb 1, 2026 - Jan 31, 2027</p>
                                    <p className="text-xs text-[var(--color-synapse-teal)]">12 months</p>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 rounded-lg bg-[rgba(245,158,11,0.05)] border border-[rgba(245,158,11,0.2)] flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-[var(--color-warning)] flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium text-[var(--color-warning)]">Important Note</p>
                                <p className="text-sm text-[var(--color-steel)]">
                                    Ensure all employee hour data is complete for the selected measurement period before proceeding.
                                    Incomplete data may result in inaccurate FT status determinations.
                                </p>
                            </div>
                        </div>
                    </div>
                );

            case 'employees':
                return (
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <select
                                    value={employeeFilter}
                                    onChange={(e) => setEmployeeFilter(e.target.value as any)}
                                    className="px-3 py-2 text-sm bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white focus:outline-none focus:border-[var(--color-synapse-teal)]"
                                >
                                    <option value="all">All Employees</option>
                                    <option value="variable">Variable Hour Employees</option>
                                    <option value="new">New Hires Only</option>
                                </select>
                                <span className="text-sm text-[var(--color-steel)]">
                                    {selectedEmployees.length} of {mockResults.length} selected
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <button onClick={selectAllEmployees} className="text-sm text-[var(--color-synapse-teal)] hover:underline">
                                    Select All
                                </button>
                                <span className="text-[var(--color-steel)]">|</span>
                                <button onClick={deselectAllEmployees} className="text-sm text-[var(--color-steel)] hover:underline">
                                    Deselect All
                                </button>
                            </div>
                        </div>

                        <div className="max-h-[350px] overflow-y-auto rounded-lg border border-[var(--glass-border)]">
                            <table className="w-full">
                                <thead className="sticky top-0 bg-[var(--color-obsidian-elevated)]">
                                    <tr className="border-b border-[var(--glass-border)]">
                                        <th className="p-3 text-left text-xs font-medium text-[var(--color-steel)] w-12">
                                            <input
                                                type="checkbox"
                                                checked={selectedEmployees.length === mockResults.length}
                                                onChange={() => selectedEmployees.length === mockResults.length ? deselectAllEmployees() : selectAllEmployees()}
                                                className="w-4 h-4 rounded"
                                            />
                                        </th>
                                        <th className="p-3 text-left text-xs font-medium text-[var(--color-steel)]">Employee</th>
                                        <th className="p-3 text-left text-xs font-medium text-[var(--color-steel)]">Department</th>
                                        <th className="p-3 text-left text-xs font-medium text-[var(--color-steel)]">Current Status</th>
                                        <th className="p-3 text-left text-xs font-medium text-[var(--color-steel)]">Last Avg Hours</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {mockResults.map((employee, index) => (
                                        <tr
                                            key={employee.employeeId}
                                            className={`border-b border-[var(--glass-border)] hover:bg-[rgba(255,255,255,0.02)] transition-colors ${selectedEmployees.includes(employee.employeeId) ? 'bg-[rgba(6,182,212,0.02)]' : ''
                                                }`}
                                        >
                                            <td className="p-3">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedEmployees.includes(employee.employeeId)}
                                                    onChange={() => toggleEmployee(employee.employeeId)}
                                                    className="w-4 h-4 rounded"
                                                />
                                            </td>
                                            <td className="p-3">
                                                <p className="font-medium text-white">{employee.name}</p>
                                                <p className="text-xs text-[var(--color-steel)]">{employee.employeeId}</p>
                                            </td>
                                            <td className="p-3 text-sm text-[var(--color-silver)]">{employee.department}</td>
                                            <td className="p-3">
                                                <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${employee.previousStatus === 'full-time'
                                                    ? 'bg-[rgba(16,185,129,0.1)] text-[var(--color-success)]'
                                                    : employee.previousStatus === 'part-time'
                                                        ? 'bg-[rgba(255,255,255,0.05)] text-[var(--color-steel)]'
                                                        : 'bg-[rgba(245,158,11,0.1)] text-[var(--color-warning)]'
                                                    }`}>
                                                    {employee.previousStatus}
                                                </span>
                                            </td>
                                            <td className="p-3 text-sm text-white">{employee.averageHours}h</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            case 'calculate':
                if (isProcessing) {
                    return (
                        <div className="py-12 text-center">
                            <Loader2 className="w-16 h-16 mx-auto mb-6 text-[var(--color-synapse-teal)] animate-spin" />
                            <h3 className="text-xl font-semibold text-white mb-2">Calculating Eligibility</h3>
                            <p className="text-[var(--color-steel)] mb-6">
                                Processing average hours and determining FT status for {selectedEmployees.length} employees...
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
                            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[rgba(6,182,212,0.1)] flex items-center justify-center">
                                <Calculator className="w-10 h-10 text-[var(--color-synapse-teal)]" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">Ready to Calculate</h3>
                            <p className="text-[var(--color-steel)] max-w-lg mx-auto">
                                Click "Calculate Eligibility" to process average hours worked during the measurement period
                                and determine full-time status for {selectedEmployees.length} selected employees.
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)]">
                                <div className="flex items-center gap-2 mb-2">
                                    <Users className="w-4 h-4 text-[var(--color-synapse-teal)]" />
                                    <span className="text-sm text-[var(--color-steel)]">Employees Selected</span>
                                </div>
                                <p className="text-2xl font-bold text-white">{selectedEmployees.length}</p>
                            </div>
                            <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)]">
                                <div className="flex items-center gap-2 mb-2">
                                    <Clock className="w-4 h-4 text-[var(--color-synapse-teal)]" />
                                    <span className="text-sm text-[var(--color-steel)]">FT Threshold</span>
                                </div>
                                <p className="text-2xl font-bold text-white">130 hrs/mo</p>
                            </div>
                        </div>

                        <div className="p-4 rounded-lg bg-[rgba(6,182,212,0.05)] border border-[rgba(6,182,212,0.2)]">
                            <h4 className="font-medium text-[var(--color-synapse-teal)] mb-2 flex items-center gap-2">
                                <Info className="w-4 h-4" />
                                Calculation Method
                            </h4>
                            <p className="text-sm text-[var(--color-steel)]">
                                Employees averaging 30+ hours/week (130+ hours/month) during the measurement period
                                will be classified as full-time and must be offered coverage during the stability period.
                            </p>
                        </div>
                    </div>
                );

            case 'results':
                return (
                    <div className="space-y-4">
                        {/* Summary Stats */}
                        <div className="grid grid-cols-6 gap-3">
                            <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)]">
                                <p className="text-xs text-[var(--color-steel)]">Total</p>
                                <p className="text-xl font-bold text-white">{stats.total}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-[rgba(16,185,129,0.05)] border border-[rgba(16,185,129,0.2)]">
                                <p className="text-xs text-[var(--color-steel)]">Full-Time</p>
                                <p className="text-xl font-bold text-[var(--color-success)]">{stats.fullTime}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)]">
                                <p className="text-xs text-[var(--color-steel)]">Part-Time</p>
                                <p className="text-xl font-bold text-white">{stats.partTime}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-[rgba(245,158,11,0.05)] border border-[rgba(245,158,11,0.2)]">
                                <p className="text-xs text-[var(--color-steel)]">Variable</p>
                                <p className="text-xl font-bold text-[var(--color-warning)]">{stats.variable}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-[rgba(139,92,246,0.05)] border border-[rgba(139,92,246,0.2)]">
                                <p className="text-xs text-[var(--color-steel)]">Changed</p>
                                <p className="text-xl font-bold text-purple-400">{stats.changed}</p>
                            </div>
                            <div className="p-3 rounded-lg bg-[rgba(6,182,212,0.05)] border border-[rgba(6,182,212,0.2)]">
                                <p className="text-xs text-[var(--color-steel)]">Need Coverage</p>
                                <p className="text-xl font-bold text-[var(--color-synapse-teal)]">{stats.coverageRequired}</p>
                            </div>
                        </div>

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
                                        { id: 'full-time', label: 'Full-Time' },
                                        { id: 'part-time', label: 'Part-Time' },
                                        { id: 'variable', label: 'Variable' },
                                        { id: 'changed', label: 'Changed' },
                                    ].map(f => (
                                        <button
                                            key={f.id}
                                            onClick={() => setStatusFilter(f.id as any)}
                                            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${statusFilter === f.id
                                                ? 'bg-[var(--color-synapse-teal)] text-black'
                                                : 'text-[var(--color-steel)] hover:bg-[rgba(255,255,255,0.05)]'
                                                }`}
                                        >
                                            {f.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <button className="btn-secondary flex items-center gap-2 text-sm">
                                <Download className="w-4 h-4" />
                                Export Results
                            </button>
                        </div>

                        {/* Results Table */}
                        <div className="max-h-[300px] overflow-y-auto rounded-lg border border-[var(--glass-border)]">
                            <table className="w-full">
                                <thead className="sticky top-0 bg-[var(--color-obsidian-elevated)]">
                                    <tr className="border-b border-[var(--glass-border)]">
                                        <th className="p-3 text-left text-xs font-medium text-[var(--color-steel)]">Employee</th>
                                        <th className="p-3 text-left text-xs font-medium text-[var(--color-steel)]">Avg Hours</th>
                                        <th className="p-3 text-left text-xs font-medium text-[var(--color-steel)]">Previous</th>
                                        <th className="p-3 text-left text-xs font-medium text-[var(--color-steel)]">New Status</th>
                                        <th className="p-3 text-left text-xs font-medium text-[var(--color-steel)]">Coverage</th>
                                        <th className="p-3 text-left text-xs font-medium text-[var(--color-steel)]">Stability Period</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredResults.map((result, index) => (
                                        <motion.tr
                                            key={result.employeeId}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: index * 0.02 }}
                                            className={`border-b border-[var(--glass-border)] hover:bg-[rgba(255,255,255,0.02)] ${result.statusChanged ? 'bg-[rgba(139,92,246,0.02)]' : ''
                                                }`}
                                        >
                                            <td className="p-3">
                                                <p className="font-medium text-white">{result.name}</p>
                                                <p className="text-xs text-[var(--color-steel)]">{result.employeeId} • {result.department}</p>
                                            </td>
                                            <td className="p-3">
                                                <span className={`font-medium ${result.averageHours >= 30 ? 'text-[var(--color-success)]' : 'text-white'}`}>
                                                    {result.averageHours}h
                                                </span>
                                            </td>
                                            <td className="p-3">
                                                <span className="text-sm text-[var(--color-steel)] capitalize">{result.previousStatus}</span>
                                            </td>
                                            <td className="p-3">
                                                <div className="flex items-center gap-2">
                                                    <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${result.ftStatus === 'full-time'
                                                        ? 'bg-[rgba(16,185,129,0.1)] text-[var(--color-success)]'
                                                        : result.ftStatus === 'part-time'
                                                            ? 'bg-[rgba(255,255,255,0.05)] text-[var(--color-steel)]'
                                                            : 'bg-[rgba(245,158,11,0.1)] text-[var(--color-warning)]'
                                                        }`}>
                                                        {result.ftStatus}
                                                    </span>
                                                    {result.statusChanged && (
                                                        <span className="flex items-center text-purple-400">
                                                            {result.ftStatus === 'full-time' ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-3">
                                                {result.coverageRequired ? (
                                                    <span className="flex items-center gap-1 text-sm text-[var(--color-success)]">
                                                        <Shield className="w-3 h-3" />
                                                        Required
                                                    </span>
                                                ) : (
                                                    <span className="text-sm text-[var(--color-steel)]">Not Required</span>
                                                )}
                                            </td>
                                            <td className="p-3 text-sm text-[var(--color-steel)]">{result.stabilityPeriod}</td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
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
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-synapse-teal)] to-[var(--color-synapse-cyan)] flex items-center justify-center">
                        <Target className="w-6 h-6 text-black" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold text-white">ACA Eligibility Wizard</h1>
                        <p className="text-sm text-[var(--color-steel)]">Determine full-time status and coverage requirements</p>
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
                        {currentStep === 2 ? (
                            <>
                                <Calculator className="w-4 h-4" />
                                Calculate Eligibility
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
                        Generate Forms
                    </button>
                )}
            </div>
        </motion.div>
    );
}

export default ACAEligibilityWizard;
