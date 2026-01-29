'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Menu,
    X,
    Home,
    Users,
    FileCheck,
    Database,
    Shield,
    FileText,
    Settings,
    ChevronRight,
    Plus
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface MobileNavProps {
    className?: string;
}

const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: Home },
    { label: 'Clients', href: '/clients', icon: Users },
    { label: 'Compliance', href: '/compliance', icon: FileCheck },
    { label: 'Data Refinery', href: '/refinery', icon: Database },
    { label: 'Self-Insured', href: '/self-insured', icon: Shield },
    { label: 'Reports', href: '/reports', icon: FileText },
    { label: 'Settings', href: '/settings', icon: Settings },
];

export function MobileNav({ className = '' }: MobileNavProps) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    return (
        <>
            {/* Mobile menu button - only visible on small screens */}
            <button
                onClick={() => setIsOpen(true)}
                className={`lg:hidden fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full bg-[var(--color-synapse-teal)] text-black shadow-lg flex items-center justify-center ${className}`}
                aria-label="Open navigation menu"
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Mobile navigation overlay */}
            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                        />

                        {/* Slide-up menu */}
                        <motion.div
                            initial={{ y: '100%' }}
                            animate={{ y: 0 }}
                            exit={{ y: '100%' }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--color-charcoal)] rounded-t-2xl border-t border-[var(--glass-border)] max-h-[80vh] overflow-auto"
                        >
                            {/* Handle */}
                            <div className="flex justify-center pt-3 pb-2">
                                <div className="w-10 h-1 rounded-full bg-[var(--glass-border)]" />
                            </div>

                            {/* Header */}
                            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--glass-border)]">
                                <span className="text-lg font-semibold text-white">Navigation</span>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 rounded-lg hover:bg-[var(--glass-bg-light)] text-[var(--color-steel)]"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            {/* Quick action */}
                            <div className="px-6 py-4">
                                <Link
                                    href="/onboard"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center justify-center gap-2 w-full py-3 rounded-lg bg-[var(--color-synapse-teal)] text-black font-medium"
                                >
                                    <Plus className="w-5 h-5" />
                                    New Client
                                </Link>
                            </div>

                            {/* Navigation items */}
                            <nav className="px-4 pb-8">
                                {navItems.map((item) => {
                                    const isActive = pathname.startsWith(item.href);
                                    const Icon = item.icon;

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            onClick={() => setIsOpen(false)}
                                            className={`flex items-center justify-between px-4 py-4 rounded-xl mb-1 transition-colors ${isActive
                                                    ? 'bg-[rgba(6,182,212,0.1)] text-[var(--color-synapse-teal)]'
                                                    : 'text-[var(--color-silver)] hover:bg-[var(--glass-bg-light)]'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <Icon className="w-5 h-5" />
                                                <span className="font-medium">{item.label}</span>
                                            </div>
                                            <ChevronRight className={`w-5 h-5 ${isActive ? 'text-[var(--color-synapse-teal)]' : 'text-[var(--color-steel)]'}`} />
                                        </Link>
                                    );
                                })}
                            </nav>

                            {/* Safe area for iOS home indicator */}
                            <div className="h-6" />
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}

export default MobileNav;
