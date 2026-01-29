'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Building2,
    Users,
    Link2,
    Settings,
    CheckCircle2,
    ArrowRight,
    ArrowLeft,
    Upload,
    Database,
    Shield,
    AlertCircle
} from 'lucide-react';
import Link from 'next/link';

const steps = [
    { id: 1, name: 'Company Info', icon: Building2 },
    { id: 2, name: 'Data Source', icon: Link2 },
    { id: 3, name: 'Plan Config', icon: Settings },
    { id: 4, name: 'Confirmation', icon: CheckCircle2 },
];

const dataSources = [
    {
        id: 'gusto',
        name: 'Gusto',
        description: 'Connect via OAuth for automatic sync',
        icon: Database,
        status: 'available'
    },
    {
        id: 'rippling',
        name: 'Rippling',
        description: 'Connect via API key integration',
        icon: Database,
        status: 'available'
    },
    {
        id: 'csv',
        name: 'Manual CSV Upload',
        description: 'Upload employee data files directly',
        icon: Upload,
        status: 'available'
    },
    {
        id: 'adp',
        name: 'ADP Workforce Now',
        description: 'Coming soon - enterprise integration',
        icon: Database,
        status: 'coming_soon'
    },
];

const safeHarborOptions = [
    { id: 'w2', name: 'W-2 Safe Harbor', description: 'Based on Form W-2 wages' },
    { id: 'rate_of_pay', name: 'Rate of Pay', description: 'Based on hourly rate × 130 hours' },
    { id: 'fpl', name: 'Federal Poverty Line', description: 'Based on FPL percentage' },
];

export default function OnboardPage() {
    const [currentStep, setCurrentStep] = useState(1);
    const [formData, setFormData] = useState({
        // Step 1: Company Info
        companyName: '',
        ein: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        contactName: '',
        contactEmail: '',
        // Step 2: Data Source
        dataSource: '',
        apiCredentials: '',
        // Step 3: Plan Config
        measurementPeriod: 'standard',
        safeHarbor: 'w2',
        planStartMonth: '1',
    });

    const updateFormData = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const nextStep = () => {
        if (currentStep < 4) setCurrentStep(prev => prev + 1);
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = () => {
        // In production, this would submit to the API
        console.log('Submitting:', formData);
        // Redirect to clients page or show success
    };

    return (
        <div className="min-h-[calc(100vh-8rem)]">
            {/* Header */}
            <div className="mb-8">
                <Link href="/dashboard" className="text-sm text-[var(--color-steel)] hover:text-white mb-4 inline-flex items-center gap-1">
                    <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                </Link>
                <h1 className="text-2xl font-bold text-white mt-4">New Client Onboarding</h1>
                <p className="text-[var(--color-steel)] mt-1">Set up a new employer for ACA compliance tracking</p>
            </div>

            {/* Progress Steps */}
            <div className="glass-card p-6 mb-8">
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => (
                        <div key={step.id} className="flex items-center flex-1">
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${currentStep >= step.id
                                            ? 'bg-[var(--color-synapse-teal)] text-black'
                                            : 'bg-[var(--glass-bg-light)] text-[var(--color-steel)] border border-[var(--glass-border)]'
                                        }`}
                                >
                                    {currentStep > step.id ? (
                                        <CheckCircle2 className="w-6 h-6" />
                                    ) : (
                                        <step.icon className="w-5 h-5" />
                                    )}
                                </div>
                                <span className={`text-xs mt-2 ${currentStep >= step.id ? 'text-white' : 'text-[var(--color-steel)]'}`}>
                                    {step.name}
                                </span>
                            </div>
                            {index < steps.length - 1 && (
                                <div
                                    className={`flex-1 h-0.5 mx-4 ${currentStep > step.id ? 'bg-[var(--color-synapse-teal)]' : 'bg-[var(--glass-border)]'
                                        }`}
                                />
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Form Content */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="glass-card p-8"
                >
                    {/* Step 1: Company Info */}
                    {currentStep === 1 && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-[rgba(6,182,212,0.15)] flex items-center justify-center">
                                    <Building2 className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-white">Company Information</h2>
                                    <p className="text-sm text-[var(--color-steel)]">Enter the employer&apos;s basic details</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">
                                        Company Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.companyName}
                                        onChange={(e) => updateFormData('companyName', e.target.value)}
                                        className="form-input"
                                        placeholder="Apex Manufacturing Corp"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">
                                        EIN (Employer ID) *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.ein}
                                        onChange={(e) => updateFormData('ein', e.target.value)}
                                        className="form-input"
                                        placeholder="12-3456789"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">
                                    Street Address *
                                </label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => updateFormData('address', e.target.value)}
                                    className="form-input"
                                    placeholder="123 Business Ave"
                                />
                            </div>

                            <div className="grid grid-cols-3 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">City</label>
                                    <input
                                        type="text"
                                        value={formData.city}
                                        onChange={(e) => updateFormData('city', e.target.value)}
                                        className="form-input"
                                        placeholder="New York"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">State</label>
                                    <input
                                        type="text"
                                        value={formData.state}
                                        onChange={(e) => updateFormData('state', e.target.value)}
                                        className="form-input"
                                        placeholder="NY"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">ZIP Code</label>
                                    <input
                                        type="text"
                                        value={formData.zip}
                                        onChange={(e) => updateFormData('zip', e.target.value)}
                                        className="form-input"
                                        placeholder="10001"
                                    />
                                </div>
                            </div>

                            <div className="border-t border-[var(--glass-border)] pt-6 mt-6">
                                <h3 className="text-sm font-semibold text-white mb-4">Primary Contact</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">Contact Name</label>
                                        <input
                                            type="text"
                                            value={formData.contactName}
                                            onChange={(e) => updateFormData('contactName', e.target.value)}
                                            className="form-input"
                                            placeholder="Jane Smith"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">Email</label>
                                        <input
                                            type="email"
                                            value={formData.contactEmail}
                                            onChange={(e) => updateFormData('contactEmail', e.target.value)}
                                            className="form-input"
                                            placeholder="jane@company.com"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Data Source */}
                    {currentStep === 2 && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-[rgba(6,182,212,0.15)] flex items-center justify-center">
                                    <Link2 className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-white">Connect Data Source</h2>
                                    <p className="text-sm text-[var(--color-steel)]">Choose how to import employee data</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {dataSources.map((source) => (
                                    <button
                                        key={source.id}
                                        onClick={() => updateFormData('dataSource', source.id)}
                                        disabled={source.status === 'coming_soon'}
                                        className={`p-4 rounded-lg border text-left transition-all ${formData.dataSource === source.id
                                                ? 'border-[var(--color-synapse-teal)] bg-[rgba(6,182,212,0.1)]'
                                                : source.status === 'coming_soon'
                                                    ? 'border-[var(--glass-border)] bg-[var(--glass-bg-light)] opacity-50 cursor-not-allowed'
                                                    : 'border-[var(--glass-border)] bg-[var(--glass-bg-light)] hover:border-[var(--glass-border-hover)]'
                                            }`}
                                    >
                                        <div className="flex items-start gap-3">
                                            <source.icon className={`w-5 h-5 mt-0.5 ${formData.dataSource === source.id ? 'text-[var(--color-synapse-teal)]' : 'text-[var(--color-steel)]'
                                                }`} />
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="font-medium text-white">{source.name}</span>
                                                    {source.status === 'coming_soon' && (
                                                        <span className="text-xs px-2 py-0.5 rounded bg-[var(--glass-bg)] text-[var(--color-steel)]">
                                                            Coming Soon
                                                        </span>
                                                    )}
                                                </div>
                                                <p className="text-sm text-[var(--color-steel)] mt-1">{source.description}</p>
                                            </div>
                                        </div>
                                    </button>
                                ))}
                            </div>

                            {formData.dataSource === 'csv' && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-6 p-6 border border-dashed border-[var(--glass-border)] rounded-lg text-center"
                                >
                                    <Upload className="w-10 h-10 text-[var(--color-steel)] mx-auto mb-3" />
                                    <p className="text-sm text-[var(--color-silver)]">
                                        Drag and drop your CSV file here, or click to browse
                                    </p>
                                    <p className="text-xs text-[var(--color-steel)] mt-2">
                                        Supports: Employee census, payroll exports, benefits enrollment files
                                    </p>
                                    <button className="btn-secondary mt-4">
                                        Select File
                                    </button>
                                </motion.div>
                            )}

                            {(formData.dataSource === 'gusto' || formData.dataSource === 'rippling') && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-6 p-6 bg-[var(--glass-bg-light)] rounded-lg"
                                >
                                    <div className="flex items-center gap-3 mb-4">
                                        <Shield className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                                        <span className="text-sm font-medium text-white">Secure Connection</span>
                                    </div>
                                    <p className="text-sm text-[var(--color-steel)] mb-4">
                                        You&apos;ll be redirected to {formData.dataSource === 'gusto' ? 'Gusto' : 'Rippling'} to authorize the connection.
                                        We only request read access to employee and payroll data.
                                    </p>
                                    <button className="btn-primary">
                                        Connect to {formData.dataSource === 'gusto' ? 'Gusto' : 'Rippling'}
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    )}

                    {/* Step 3: Plan Config */}
                    {currentStep === 3 && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-[rgba(6,182,212,0.15)] flex items-center justify-center">
                                    <Settings className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-white">Plan Configuration</h2>
                                    <p className="text-sm text-[var(--color-steel)]">Configure ACA measurement and safe harbor settings</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--color-silver)] mb-3">
                                    Measurement Period
                                </label>
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => updateFormData('measurementPeriod', 'standard')}
                                        className={`p-4 rounded-lg border text-left ${formData.measurementPeriod === 'standard'
                                                ? 'border-[var(--color-synapse-teal)] bg-[rgba(6,182,212,0.1)]'
                                                : 'border-[var(--glass-border)] bg-[var(--glass-bg-light)]'
                                            }`}
                                    >
                                        <span className="font-medium text-white">Standard (12-month)</span>
                                        <p className="text-sm text-[var(--color-steel)] mt-1">
                                            Full look-back measurement period
                                        </p>
                                    </button>
                                    <button
                                        onClick={() => updateFormData('measurementPeriod', 'monthly')}
                                        className={`p-4 rounded-lg border text-left ${formData.measurementPeriod === 'monthly'
                                                ? 'border-[var(--color-synapse-teal)] bg-[rgba(6,182,212,0.1)]'
                                                : 'border-[var(--glass-border)] bg-[var(--glass-bg-light)]'
                                            }`}
                                    >
                                        <span className="font-medium text-white">Monthly</span>
                                        <p className="text-sm text-[var(--color-steel)] mt-1">
                                            Month-by-month FTE determination
                                        </p>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--color-silver)] mb-3">
                                    Affordability Safe Harbor
                                </label>
                                <div className="space-y-3">
                                    {safeHarborOptions.map((option) => (
                                        <button
                                            key={option.id}
                                            onClick={() => updateFormData('safeHarbor', option.id)}
                                            className={`w-full p-4 rounded-lg border text-left flex items-center gap-4 ${formData.safeHarbor === option.id
                                                    ? 'border-[var(--color-synapse-teal)] bg-[rgba(6,182,212,0.1)]'
                                                    : 'border-[var(--glass-border)] bg-[var(--glass-bg-light)]'
                                                }`}
                                        >
                                            <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${formData.safeHarbor === option.id
                                                    ? 'border-[var(--color-synapse-teal)]'
                                                    : 'border-[var(--color-steel)]'
                                                }`}>
                                                {formData.safeHarbor === option.id && (
                                                    <div className="w-2 h-2 rounded-full bg-[var(--color-synapse-teal)]" />
                                                )}
                                            </div>
                                            <div>
                                                <span className="font-medium text-white">{option.name}</span>
                                                <p className="text-sm text-[var(--color-steel)]">{option.description}</p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">
                                    Plan Year Start Month
                                </label>
                                <select
                                    value={formData.planStartMonth}
                                    onChange={(e) => updateFormData('planStartMonth', e.target.value)}
                                    className="form-input"
                                >
                                    <option value="1">January</option>
                                    <option value="2">February</option>
                                    <option value="3">March</option>
                                    <option value="4">April</option>
                                    <option value="5">May</option>
                                    <option value="6">June</option>
                                    <option value="7">July</option>
                                    <option value="8">August</option>
                                    <option value="9">September</option>
                                    <option value="10">October</option>
                                    <option value="11">November</option>
                                    <option value="12">December</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Confirmation */}
                    {currentStep === 4 && (
                        <div className="space-y-6">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-10 h-10 rounded-lg bg-[rgba(16,185,129,0.15)] flex items-center justify-center">
                                    <CheckCircle2 className="w-5 h-5 text-[var(--color-success)]" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-semibold text-white">Review & Confirm</h2>
                                    <p className="text-sm text-[var(--color-steel)]">Verify the information before creating the client</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]">
                                    <h3 className="text-sm font-semibold text-[var(--color-synapse-teal)] mb-3">Company Information</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-[var(--color-steel)]">Company Name:</span>
                                            <span className="text-white ml-2">{formData.companyName || 'Not provided'}</span>
                                        </div>
                                        <div>
                                            <span className="text-[var(--color-steel)]">EIN:</span>
                                            <span className="text-white ml-2">{formData.ein || 'Not provided'}</span>
                                        </div>
                                        <div className="col-span-2">
                                            <span className="text-[var(--color-steel)]">Address:</span>
                                            <span className="text-white ml-2">
                                                {formData.address ? `${formData.address}, ${formData.city}, ${formData.state} ${formData.zip}` : 'Not provided'}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]">
                                    <h3 className="text-sm font-semibold text-[var(--color-synapse-teal)] mb-3">Data Source</h3>
                                    <p className="text-sm text-white">
                                        {dataSources.find(s => s.id === formData.dataSource)?.name || 'Not selected'}
                                    </p>
                                </div>

                                <div className="p-4 rounded-lg bg-[var(--glass-bg-light)] border border-[var(--glass-border)]">
                                    <h3 className="text-sm font-semibold text-[var(--color-synapse-teal)] mb-3">Plan Configuration</h3>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <span className="text-[var(--color-steel)]">Measurement:</span>
                                            <span className="text-white ml-2">{formData.measurementPeriod === 'standard' ? '12-month Standard' : 'Monthly'}</span>
                                        </div>
                                        <div>
                                            <span className="text-[var(--color-steel)]">Safe Harbor:</span>
                                            <span className="text-white ml-2">
                                                {safeHarborOptions.find(s => s.id === formData.safeHarbor)?.name}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 rounded-lg bg-[rgba(6,182,212,0.1)] border border-[var(--color-synapse-teal)]">
                                <div className="flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-[var(--color-synapse-teal)] mt-0.5" />
                                    <div>
                                        <p className="text-sm text-white">Ready to begin data import</p>
                                        <p className="text-xs text-[var(--color-steel)] mt-1">
                                            Once you confirm, we&apos;ll start processing employee data through the AI Data Refinery.
                                            You&apos;ll be notified when the initial compliance assessment is complete.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-[var(--glass-border)]">
                        <button
                            onClick={prevStep}
                            disabled={currentStep === 1}
                            className={`btn-secondary ${currentStep === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Previous
                        </button>

                        {currentStep < 4 ? (
                            <button onClick={nextStep} className="btn-primary">
                                Continue
                                <ArrowRight className="w-4 h-4" />
                            </button>
                        ) : (
                            <Link href="/clients" onClick={handleSubmit} className="btn-primary">
                                Create Client
                                <CheckCircle2 className="w-4 h-4" />
                            </Link>
                        )}
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}
