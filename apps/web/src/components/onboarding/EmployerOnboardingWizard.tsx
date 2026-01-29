'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Building2,
    Users,
    FileText,
    Settings,
    CheckCircle2,
    ChevronRight,
    ChevronLeft,
    Upload,
    Calendar,
    DollarSign,
    Shield,
    MapPin,
    Phone,
    Mail,
    Globe,
    AlertTriangle,
    Sparkles,
    ArrowRight,
    Loader2
} from 'lucide-react';

interface EmployerOnboardingWizardProps {
    className?: string;
}

interface FormData {
    // Company Info
    companyName: string;
    ein: string;
    dbaName: string;
    industry: string;
    // Contact Info
    primaryContact: string;
    email: string;
    phone: string;
    // Address
    address: string;
    city: string;
    state: string;
    zip: string;
    // ACA Configuration
    measurementMethod: 'monthly' | 'lookback';
    measurementPeriod: number;
    adminPeriod: number;
    stabilityPeriod: number;
    // Coverage Info
    planStartMonth: number;
    lowestCostPremium: number;
    safeHarborType: 'w2' | 'fpl' | 'rate_of_pay';
}

const steps = [
    { id: 'company', title: 'Company Information', icon: Building2, description: 'Basic organization details' },
    { id: 'contact', title: 'Contact Details', icon: Users, description: 'Primary contact information' },
    { id: 'address', title: 'Physical Address', icon: MapPin, description: 'Principal business location' },
    { id: 'aca', title: 'ACA Configuration', icon: Settings, description: 'Measurement periods and methods' },
    { id: 'coverage', title: 'Coverage Details', icon: Shield, description: 'Plan and affordability info' },
    { id: 'review', title: 'Review & Submit', icon: CheckCircle2, description: 'Verify all information' },
];

const industries = [
    'Healthcare', 'Technology', 'Manufacturing', 'Retail', 'Finance',
    'Education', 'Construction', 'Transportation', 'Hospitality', 'Other'
];

const states = [
    'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
    'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
    'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
    'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
    'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
];

export function EmployerOnboardingWizard({ className = '' }: EmployerOnboardingWizardProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        companyName: '',
        ein: '',
        dbaName: '',
        industry: '',
        primaryContact: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        measurementMethod: 'lookback',
        measurementPeriod: 12,
        adminPeriod: 1,
        stabilityPeriod: 12,
        planStartMonth: 1,
        lowestCostPremium: 0,
        safeHarborType: 'fpl',
    });

    const updateFormData = (updates: Partial<FormData>) => {
        setFormData(prev => ({ ...prev, ...updates }));
    };

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = () => {
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
            setIsComplete(true);
        }, 2000);
    };

    const renderStepContent = () => {
        switch (steps[currentStep].id) {
            case 'company':
                return (
                    <div className="grid grid-cols-2 gap-6">
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">Legal Company Name *</label>
                            <input
                                type="text"
                                value={formData.companyName}
                                onChange={(e) => updateFormData({ companyName: e.target.value })}
                                placeholder="Enter legal company name"
                                className="w-full px-4 py-3 bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white placeholder:text-[var(--color-steel)] focus:outline-none focus:border-[var(--color-synapse-teal)]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">Employer Identification Number (EIN) *</label>
                            <input
                                type="text"
                                value={formData.ein}
                                onChange={(e) => updateFormData({ ein: e.target.value })}
                                placeholder="XX-XXXXXXX"
                                className="w-full px-4 py-3 bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white placeholder:text-[var(--color-steel)] focus:outline-none focus:border-[var(--color-synapse-teal)]"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">DBA Name (if applicable)</label>
                            <input
                                type="text"
                                value={formData.dbaName}
                                onChange={(e) => updateFormData({ dbaName: e.target.value })}
                                placeholder="Doing Business As"
                                className="w-full px-4 py-3 bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white placeholder:text-[var(--color-steel)] focus:outline-none focus:border-[var(--color-synapse-teal)]"
                            />
                        </div>
                        <div className="col-span-2">
                            <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">Industry *</label>
                            <select
                                value={formData.industry}
                                onChange={(e) => updateFormData({ industry: e.target.value })}
                                className="w-full px-4 py-3 bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white focus:outline-none focus:border-[var(--color-synapse-teal)]"
                            >
                                <option value="">Select industry</option>
                                {industries.map(ind => (
                                    <option key={ind} value={ind}>{ind}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                );

            case 'contact':
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">Primary Contact Name *</label>
                            <div className="relative">
                                <Users className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-steel)]" />
                                <input
                                    type="text"
                                    value={formData.primaryContact}
                                    onChange={(e) => updateFormData({ primaryContact: e.target.value })}
                                    placeholder="Full name"
                                    className="w-full pl-12 pr-4 py-3 bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white placeholder:text-[var(--color-steel)] focus:outline-none focus:border-[var(--color-synapse-teal)]"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">Email Address *</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-steel)]" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => updateFormData({ email: e.target.value })}
                                    placeholder="email@company.com"
                                    className="w-full pl-12 pr-4 py-3 bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white placeholder:text-[var(--color-steel)] focus:outline-none focus:border-[var(--color-synapse-teal)]"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">Phone Number *</label>
                            <div className="relative">
                                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-steel)]" />
                                <input
                                    type="tel"
                                    value={formData.phone}
                                    onChange={(e) => updateFormData({ phone: e.target.value })}
                                    placeholder="(XXX) XXX-XXXX"
                                    className="w-full pl-12 pr-4 py-3 bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white placeholder:text-[var(--color-steel)] focus:outline-none focus:border-[var(--color-synapse-teal)]"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 'address':
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">Street Address *</label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={(e) => updateFormData({ address: e.target.value })}
                                placeholder="Street address"
                                className="w-full px-4 py-3 bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white placeholder:text-[var(--color-steel)] focus:outline-none focus:border-[var(--color-synapse-teal)]"
                            />
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">City *</label>
                                <input
                                    type="text"
                                    value={formData.city}
                                    onChange={(e) => updateFormData({ city: e.target.value })}
                                    placeholder="City"
                                    className="w-full px-4 py-3 bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white placeholder:text-[var(--color-steel)] focus:outline-none focus:border-[var(--color-synapse-teal)]"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">State *</label>
                                <select
                                    value={formData.state}
                                    onChange={(e) => updateFormData({ state: e.target.value })}
                                    className="w-full px-4 py-3 bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white focus:outline-none focus:border-[var(--color-synapse-teal)]"
                                >
                                    <option value="">State</option>
                                    {states.map(st => (
                                        <option key={st} value={st}>{st}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">ZIP Code *</label>
                                <input
                                    type="text"
                                    value={formData.zip}
                                    onChange={(e) => updateFormData({ zip: e.target.value })}
                                    placeholder="XXXXX"
                                    className="w-full px-4 py-3 bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white placeholder:text-[var(--color-steel)] focus:outline-none focus:border-[var(--color-synapse-teal)]"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 'aca':
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-silver)] mb-3">FT Employee Determination Method *</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button
                                    onClick={() => updateFormData({ measurementMethod: 'monthly' })}
                                    className={`p-4 rounded-lg border text-left transition-all ${formData.measurementMethod === 'monthly'
                                        ? 'bg-[var(--color-synapse-teal-muted)] border-[var(--color-synapse-teal)]'
                                        : 'bg-[rgba(255,255,255,0.02)] border-[var(--glass-border)] hover:border-[var(--glass-border-hover)]'
                                        }`}
                                >
                                    <p className={`font-medium ${formData.measurementMethod === 'monthly' ? 'text-[var(--color-synapse-teal)]' : 'text-white'}`}>
                                        Monthly Measurement
                                    </p>
                                    <p className="text-sm text-[var(--color-steel)] mt-1">
                                        FT status determined each month based on 130+ hours
                                    </p>
                                </button>
                                <button
                                    onClick={() => updateFormData({ measurementMethod: 'lookback' })}
                                    className={`p-4 rounded-lg border text-left transition-all ${formData.measurementMethod === 'lookback'
                                        ? 'bg-[var(--color-synapse-teal-muted)] border-[var(--color-synapse-teal)]'
                                        : 'bg-[rgba(255,255,255,0.02)] border-[var(--glass-border)] hover:border-[var(--glass-border-hover)]'
                                        }`}
                                >
                                    <p className={`font-medium ${formData.measurementMethod === 'lookback' ? 'text-[var(--color-synapse-teal)]' : 'text-white'}`}>
                                        Look-Back Measurement
                                    </p>
                                    <p className="text-sm text-[var(--color-steel)] mt-1">
                                        FT status based on prior measurement period average
                                    </p>
                                </button>
                            </div>
                        </div>

                        {formData.measurementMethod === 'lookback' && (
                            <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-[rgba(6,182,212,0.05)] border border-[rgba(6,182,212,0.2)]">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">Measurement Period (months)</label>
                                    <select
                                        value={formData.measurementPeriod}
                                        onChange={(e) => updateFormData({ measurementPeriod: Number(e.target.value) })}
                                        className="w-full px-4 py-2.5 bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white focus:outline-none focus:border-[var(--color-synapse-teal)]"
                                    >
                                        {[3, 6, 12].map(m => (
                                            <option key={m} value={m}>{m} months</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">Admin Period (months)</label>
                                    <select
                                        value={formData.adminPeriod}
                                        onChange={(e) => updateFormData({ adminPeriod: Number(e.target.value) })}
                                        className="w-full px-4 py-2.5 bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white focus:outline-none focus:border-[var(--color-synapse-teal)]"
                                    >
                                        {[1, 2].map(m => (
                                            <option key={m} value={m}>{m} month{m > 1 ? 's' : ''}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">Stability Period (months)</label>
                                    <select
                                        value={formData.stabilityPeriod}
                                        onChange={(e) => updateFormData({ stabilityPeriod: Number(e.target.value) })}
                                        className="w-full px-4 py-2.5 bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white focus:outline-none focus:border-[var(--color-synapse-teal)]"
                                    >
                                        {[6, 12].map(m => (
                                            <option key={m} value={m}>{m} months</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 'coverage':
                return (
                    <div className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">Plan Year Start Month *</label>
                            <select
                                value={formData.planStartMonth}
                                onChange={(e) => updateFormData({ planStartMonth: Number(e.target.value) })}
                                className="w-full px-4 py-3 bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white focus:outline-none focus:border-[var(--color-synapse-teal)]"
                            >
                                {['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((month, i) => (
                                    <option key={i + 1} value={i + 1}>{month}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-silver)] mb-2">Lowest Cost Monthly Premium (Employee Only) *</label>
                            <div className="relative">
                                <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-steel)]" />
                                <input
                                    type="number"
                                    value={formData.lowestCostPremium || ''}
                                    onChange={(e) => updateFormData({ lowestCostPremium: Number(e.target.value) })}
                                    placeholder="0.00"
                                    className="w-full pl-12 pr-4 py-3 bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white placeholder:text-[var(--color-steel)] focus:outline-none focus:border-[var(--color-synapse-teal)]"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-[var(--color-silver)] mb-3">Affordability Safe Harbor *</label>
                            <div className="space-y-3">
                                {[
                                    { id: 'fpl', label: 'Federal Poverty Line (FPL)', desc: 'Most common - 9.12% of FPL for current year' },
                                    { id: 'w2', label: 'W-2 Safe Harbor', desc: 'Based on Box 1 W-2 wages' },
                                    { id: 'rate_of_pay', label: 'Rate of Pay', desc: 'Based on employee hourly rate × 130 hours' },
                                ].map(harbor => (
                                    <button
                                        key={harbor.id}
                                        onClick={() => updateFormData({ safeHarborType: harbor.id as any })}
                                        className={`w-full p-4 rounded-lg border text-left transition-all flex items-center gap-4 ${formData.safeHarborType === harbor.id
                                            ? 'bg-[var(--color-synapse-teal-muted)] border-[var(--color-synapse-teal)]'
                                            : 'bg-[rgba(255,255,255,0.02)] border-[var(--glass-border)] hover:border-[var(--glass-border-hover)]'
                                            }`}
                                    >
                                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${formData.safeHarborType === harbor.id
                                            ? 'border-[var(--color-synapse-teal)] bg-[var(--color-synapse-teal)]'
                                            : 'border-[var(--color-steel)]'
                                            }`}>
                                            {formData.safeHarborType === harbor.id && (
                                                <CheckCircle2 className="w-3 h-3 text-black" />
                                            )}
                                        </div>
                                        <div>
                                            <p className={`font-medium ${formData.safeHarborType === harbor.id ? 'text-[var(--color-synapse-teal)]' : 'text-white'}`}>
                                                {harbor.label}
                                            </p>
                                            <p className="text-sm text-[var(--color-steel)]">{harbor.desc}</p>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 'review':
                if (isComplete) {
                    return (
                        <div className="text-center py-8">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-[var(--color-success)] flex items-center justify-center">
                                <Sparkles className="w-10 h-10 text-black" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Welcome Aboard!</h3>
                            <p className="text-[var(--color-silver)] mb-6 max-w-md mx-auto">
                                Your organization has been successfully onboarded. You can now start importing employee data and generating compliance forms.
                            </p>
                            <div className="flex items-center justify-center gap-4">
                                <button className="btn-secondary flex items-center gap-2">
                                    <Upload className="w-4 h-4" />
                                    Import Employees
                                </button>
                                <button className="btn-primary flex items-center gap-2">
                                    Go to Dashboard
                                    <ArrowRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    );
                }

                return (
                    <div className="space-y-6">
                        <p className="text-[var(--color-silver)]">
                            Please review your organization information before submitting.
                        </p>

                        <div className="grid grid-cols-2 gap-6">
                            <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)]">
                                <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                                    <Building2 className="w-4 h-4 text-[var(--color-synapse-teal)]" />
                                    Company Information
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <p className="text-[var(--color-steel)]">Name: <span className="text-white">{formData.companyName || '-'}</span></p>
                                    <p className="text-[var(--color-steel)]">EIN: <span className="text-white">{formData.ein || '-'}</span></p>
                                    <p className="text-[var(--color-steel)]">Industry: <span className="text-white">{formData.industry || '-'}</span></p>
                                </div>
                            </div>

                            <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)]">
                                <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                                    <Users className="w-4 h-4 text-[var(--color-synapse-teal)]" />
                                    Contact Details
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <p className="text-[var(--color-steel)]">Contact: <span className="text-white">{formData.primaryContact || '-'}</span></p>
                                    <p className="text-[var(--color-steel)]">Email: <span className="text-white">{formData.email || '-'}</span></p>
                                    <p className="text-[var(--color-steel)]">Phone: <span className="text-white">{formData.phone || '-'}</span></p>
                                </div>
                            </div>

                            <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)]">
                                <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                                    <Settings className="w-4 h-4 text-[var(--color-synapse-teal)]" />
                                    ACA Configuration
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <p className="text-[var(--color-steel)]">Method: <span className="text-white capitalize">{formData.measurementMethod}</span></p>
                                    <p className="text-[var(--color-steel)]">Measurement: <span className="text-white">{formData.measurementPeriod} months</span></p>
                                    <p className="text-[var(--color-steel)]">Stability: <span className="text-white">{formData.stabilityPeriod} months</span></p>
                                </div>
                            </div>

                            <div className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)]">
                                <h4 className="font-medium text-white mb-3 flex items-center gap-2">
                                    <Shield className="w-4 h-4 text-[var(--color-synapse-teal)]" />
                                    Coverage Details
                                </h4>
                                <div className="space-y-2 text-sm">
                                    <p className="text-[var(--color-steel)]">Plan Start: <span className="text-white">Month {formData.planStartMonth}</span></p>
                                    <p className="text-[var(--color-steel)]">Premium: <span className="text-white">${formData.lowestCostPremium.toFixed(2)}</span></p>
                                    <p className="text-[var(--color-steel)]">Safe Harbor: <span className="text-white uppercase">{formData.safeHarborType}</span></p>
                                </div>
                            </div>
                        </div>

                        {isSubmitting ? (
                            <div className="p-6 rounded-lg bg-[rgba(6,182,212,0.05)] border border-[rgba(6,182,212,0.2)] text-center">
                                <Loader2 className="w-8 h-8 mx-auto mb-3 text-[var(--color-synapse-teal)] animate-spin" />
                                <p className="text-[var(--color-synapse-teal)]">Setting up your organization...</p>
                            </div>
                        ) : (
                            <button
                                onClick={handleSubmit}
                                className="btn-primary w-full flex items-center justify-center gap-2"
                            >
                                <Sparkles className="w-4 h-4" />
                                Complete Onboarding
                            </button>
                        )}
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
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-synapse-teal)] to-[var(--color-synapse-emerald)] flex items-center justify-center">
                        <Building2 className="w-6 h-6 text-black" />
                    </div>
                    <div>
                        <h1 className="text-xl font-semibold text-white">Employer Onboarding</h1>
                        <p className="text-sm text-[var(--color-steel)]">Set up your organization for ACA compliance</p>
                    </div>
                </div>
            </div>

            {/* Progress Steps */}
            <div className="px-5 py-4 border-b border-[var(--glass-border)]">
                <div className="flex items-center justify-between">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        const isComplete = index < currentStep;
                        const isCurrent = index === currentStep;

                        return (
                            <div key={step.id} className="flex items-center">
                                <button
                                    onClick={() => index < currentStep && setCurrentStep(index)}
                                    disabled={index > currentStep}
                                    className={`flex items-center gap-2 ${index <= currentStep ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'}`}
                                >
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${isComplete
                                        ? 'bg-[var(--color-success)] text-black'
                                        : isCurrent
                                            ? 'bg-[var(--color-synapse-teal)] text-black'
                                            : 'bg-[rgba(255,255,255,0.05)] text-[var(--color-steel)]'
                                        }`}>
                                        {isComplete ? <CheckCircle2 className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                                    </div>
                                    <div className="hidden lg:block text-left">
                                        <p className={`text-sm font-medium ${isCurrent ? 'text-white' : 'text-[var(--color-steel)]'}`}>
                                            {step.title}
                                        </p>
                                    </div>
                                </button>
                                {index < steps.length - 1 && (
                                    <div className={`w-8 lg:w-16 h-0.5 mx-2 ${isComplete ? 'bg-[var(--color-success)]' : 'bg-[var(--glass-border)]'}`} />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Step Content */}
            <div className="p-6 min-h-[400px]">
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
            {!isComplete && (
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
                    {currentStep < steps.length - 1 && (
                        <button onClick={nextStep} className="btn-primary flex items-center gap-2">
                            Continue
                            <ChevronRight className="w-4 h-4" />
                        </button>
                    )}
                </div>
            )}
        </motion.div>
    );
}

export default EmployerOnboardingWizard;
