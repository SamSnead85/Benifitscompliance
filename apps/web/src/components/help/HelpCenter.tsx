'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    HelpCircle,
    Book,
    Video,
    FileText,
    MessageCircle,
    Search,
    ChevronRight,
    ChevronDown,
    ExternalLink,
    Play,
    File,
    Lightbulb,
    X
} from 'lucide-react';

interface HelpCenterProps {
    className?: string;
}

interface HelpArticle {
    id: string;
    title: string;
    description: string;
    category: string;
    readTime: string;
    popular?: boolean;
}

interface VideoTutorial {
    id: string;
    title: string;
    duration: string;
    thumbnail: string;
    category: string;
}

interface FAQItem {
    id: string;
    question: string;
    answer: string;
    category: string;
}

const helpArticles: HelpArticle[] = [
    { id: 'ha1', title: 'Getting Started with ACA Compliance', description: 'Learn the basics of ACA reporting and compliance requirements', category: 'Getting Started', readTime: '5 min', popular: true },
    { id: 'ha2', title: 'Understanding FT Employee Eligibility', description: 'How to determine full-time status under ACA guidelines', category: 'Compliance', readTime: '8 min', popular: true },
    { id: 'ha3', title: 'Generating 1095-C Forms', description: 'Step-by-step guide to generating employee forms', category: 'Forms', readTime: '6 min' },
    { id: 'ha4', title: 'Setting Up HRIS Integration', description: 'Connect your HR system for automated data sync', category: 'Integrations', readTime: '10 min' },
    { id: 'ha5', title: 'Measurement Period Configuration', description: 'Configure look-back and stability periods', category: 'Compliance', readTime: '7 min' },
];

const videoTutorials: VideoTutorial[] = [
    { id: 'vt1', title: 'Platform Overview', duration: '4:32', thumbnail: '/thumbnails/overview.jpg', category: 'Getting Started' },
    { id: 'vt2', title: 'Running Your First Eligibility Report', duration: '6:15', thumbnail: '/thumbnails/eligibility.jpg', category: 'Reports' },
    { id: 'vt3', title: 'Bulk Form Generation Walkthrough', duration: '8:45', thumbnail: '/thumbnails/forms.jpg', category: 'Forms' },
];

const faqItems: FAQItem[] = [
    { id: 'faq1', question: 'What is the ACA employer mandate?', answer: 'The ACA employer mandate requires applicable large employers (ALEs) with 50+ full-time equivalent employees to offer minimum essential coverage to at least 95% of their full-time employees and dependents, or face potential penalties.', category: 'Compliance' },
    { id: 'faq2', question: 'How is full-time status determined?', answer: 'Under the ACA, a full-time employee is one who averages at least 30 hours of service per week or 130 hours per month during the applicable measurement period.', category: 'Compliance' },
    { id: 'faq3', question: 'What are the 1095-C distribution deadlines?', answer: 'For tax year 2025, 1095-C forms must be furnished to employees by February 28, 2026 (March 31 for electronic filing to the IRS).', category: 'Forms' },
    { id: 'faq4', question: 'How do I handle new hires?', answer: 'New hires can be assigned an initial measurement period to determine FT status, or you can use the monthly measurement method if they are expected to be FT from hire.', category: 'Employees' },
];

const categories = [
    { id: 'all', label: 'All Topics', icon: Book },
    { id: 'getting-started', label: 'Getting Started', icon: Lightbulb },
    { id: 'compliance', label: 'Compliance', icon: FileText },
    { id: 'forms', label: 'Forms', icon: File },
    { id: 'integrations', label: 'Integrations', icon: ExternalLink },
];

export function HelpCenter({ className = '' }: HelpCenterProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [expandedFAQs, setExpandedFAQs] = useState<string[]>(['faq1']);
    const [activeTab, setActiveTab] = useState<'articles' | 'videos' | 'faq'>('articles');

    const toggleFAQ = (id: string) => {
        setExpandedFAQs(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
    };

    const filteredArticles = helpArticles.filter(a =>
        a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        a.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`glass-card ${className}`}>
            {/* Header */}
            <div className="p-6 border-b border-[var(--glass-border)]">
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                        <HelpCircle className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold text-white">Help Center</h2>
                        <p className="text-sm text-[var(--color-steel)]">Find answers, tutorials, and support resources</p>
                    </div>
                </div>

                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-steel)]" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for help articles, tutorials, FAQs..."
                        className="w-full pl-12 pr-4 py-3 bg-[rgba(255,255,255,0.03)] border border-[var(--glass-border)] rounded-lg text-white placeholder:text-[var(--color-steel)] focus:outline-none focus:border-[var(--color-synapse-teal)]"
                    />
                </div>
            </div>

            {/* Tabs */}
            <div className="px-6 py-3 border-b border-[var(--glass-border)] flex items-center gap-4">
                {[
                    { id: 'articles', label: 'Articles', icon: Book },
                    { id: 'videos', label: 'Video Tutorials', icon: Video },
                    { id: 'faq', label: 'FAQ', icon: MessageCircle },
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                        className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${activeTab === tab.id ? 'bg-[var(--color-synapse-teal)] text-black' : 'text-[var(--color-silver)] hover:bg-[rgba(255,255,255,0.05)]'}`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="p-6">
                {activeTab === 'articles' && (
                    <div className="space-y-4">
                        {/* Popular Articles */}
                        <div className="mb-6">
                            <h3 className="text-sm font-medium text-[var(--color-steel)] mb-3">Popular Articles</h3>
                            <div className="grid grid-cols-2 gap-4">
                                {filteredArticles.filter(a => a.popular).map((article) => (
                                    <button key={article.id} className="p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)] hover:border-[var(--color-synapse-teal)] transition-all text-left group">
                                        <div className="flex items-start justify-between mb-2">
                                            <h4 className="font-medium text-white group-hover:text-[var(--color-synapse-teal)]">{article.title}</h4>
                                            <ChevronRight className="w-4 h-4 text-[var(--color-steel)] group-hover:text-[var(--color-synapse-teal)]" />
                                        </div>
                                        <p className="text-sm text-[var(--color-steel)] mb-2">{article.description}</p>
                                        <span className="text-xs text-[var(--color-steel)]">{article.readTime} read</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* All Articles */}
                        <h3 className="text-sm font-medium text-[var(--color-steel)] mb-3">All Articles</h3>
                        <div className="space-y-2">
                            {filteredArticles.map((article) => (
                                <button key={article.id} className="w-full p-4 rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)] hover:border-[var(--glass-border-hover)] transition-all flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <FileText className="w-5 h-5 text-[var(--color-synapse-teal)]" />
                                        <div className="text-left">
                                            <h4 className="font-medium text-white">{article.title}</h4>
                                            <p className="text-xs text-[var(--color-steel)]">{article.category} • {article.readTime} read</p>
                                        </div>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-[var(--color-steel)]" />
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'videos' && (
                    <div className="grid grid-cols-3 gap-4">
                        {videoTutorials.map((video) => (
                            <button key={video.id} className="rounded-lg bg-[rgba(255,255,255,0.02)] border border-[var(--glass-border)] overflow-hidden hover:border-[var(--color-synapse-teal)] transition-all group">
                                <div className="aspect-video bg-[rgba(255,255,255,0.05)] flex items-center justify-center relative">
                                    <div className="w-12 h-12 rounded-full bg-[var(--color-synapse-teal)] flex items-center justify-center group-hover:scale-110 transition-transform">
                                        <Play className="w-5 h-5 text-black ml-1" />
                                    </div>
                                    <span className="absolute bottom-2 right-2 px-2 py-1 rounded bg-black/70 text-xs text-white">{video.duration}</span>
                                </div>
                                <div className="p-3">
                                    <h4 className="font-medium text-white text-sm">{video.title}</h4>
                                    <p className="text-xs text-[var(--color-steel)]">{video.category}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {activeTab === 'faq' && (
                    <div className="space-y-3">
                        {faqItems.map((faq) => (
                            <div key={faq.id} className="rounded-lg border border-[var(--glass-border)] overflow-hidden">
                                <button onClick={() => toggleFAQ(faq.id)} className="w-full p-4 flex items-center justify-between bg-[rgba(255,255,255,0.02)] hover:bg-[rgba(255,255,255,0.03)] transition-colors">
                                    <span className="font-medium text-white text-left">{faq.question}</span>
                                    <ChevronDown className={`w-4 h-4 text-[var(--color-steel)] transition-transform ${expandedFAQs.includes(faq.id) ? 'rotate-180' : ''}`} />
                                </button>
                                <AnimatePresence>
                                    {expandedFAQs.includes(faq.id) && (
                                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                                            <div className="p-4 pt-0 bg-[rgba(0,0,0,0.2)]">
                                                <p className="text-sm text-[var(--color-silver)]">{faq.answer}</p>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Contact Support */}
            <div className="p-6 border-t border-[var(--glass-border)] bg-[rgba(255,255,255,0.01)]">
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-medium text-white">Still need help?</h4>
                        <p className="text-sm text-[var(--color-steel)]">Our support team is available 24/7</p>
                    </div>
                    <button className="btn-primary flex items-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        Contact Support
                    </button>
                </div>
            </div>
        </motion.div>
    );
}

export default HelpCenter;
