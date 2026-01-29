'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Brain,
    LayoutDashboard,
    Building2,
    Workflow,
    FileCheck,
    Users,
    Settings,
    HelpCircle,
    ChevronDown,
    Search,
    Bell,
    Command,
    LogOut,
    User,
    DollarSign
} from 'lucide-react';
import { clsx } from 'clsx';

// Navigation structure
const navigation = [
    {
        group: 'Core',
        items: [
            { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
            { name: 'Clients', href: '/clients', icon: Building2 },
        ]
    },
    {
        group: 'Intelligence',
        items: [
            { name: 'Data Refinery', href: '/refinery', icon: Workflow },
            { name: 'Compliance', href: '/compliance', icon: FileCheck },
            { name: 'Self-Insured', href: '/self-insured', icon: DollarSign },
            { name: 'Reports', href: '/reports', icon: FileCheck },
        ]
    },
    {
        group: 'Management',
        items: [
            { name: 'Onboard', href: '/onboard', icon: Users },
            { name: 'Settings', href: '/settings', icon: Settings },
        ]
    },
];

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const [isCommandOpen, setIsCommandOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <div className="min-h-screen flex bg-[#F8FAFC]">
            {/* Sidebar - Dark for contrast */}
            <aside className="w-[260px] h-screen bg-[#0F172A] border-r border-[#1E293B] flex flex-col fixed left-0 top-0">
                {/* Brand */}
                <div className="p-6 border-b border-[#1E293B]">
                    <Link href="/dashboard" className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#0D9488] to-[#14B8A6] flex items-center justify-center">
                            <Brain className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <div className="text-lg font-semibold text-white">Synapse</div>
                            <div className="text-xs text-[#64748B]">Compliance Platform</div>
                        </div>
                    </Link>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 overflow-y-auto">
                    {navigation.map((section) => (
                        <div key={section.group} className="mb-6">
                            <div className="text-[10px] font-bold uppercase tracking-widest text-[#475569] px-3 mb-2">
                                {section.group}
                            </div>
                            {section.items.map((item) => {
                                const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={clsx(
                                            'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all mb-1',
                                            isActive
                                                ? 'bg-[#0D9488]/15 text-[#14B8A6]'
                                                : 'text-[#94A3B8] hover:bg-[#1E293B] hover:text-white'
                                        )}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    ))}
                </nav>

                {/* Help & Support */}
                <div className="p-4 border-t border-[#1E293B]">
                    <Link
                        href="/help"
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-[#94A3B8] hover:bg-[#1E293B] hover:text-white transition-all"
                    >
                        <HelpCircle className="w-5 h-5" />
                        <span>Help & Support</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 ml-[260px]">
                {/* Top Header - Light */}
                <header className="sticky top-0 z-50 h-16 px-6 flex items-center justify-between border-b border-[#E2E8F0] bg-white/80 backdrop-blur-xl">
                    {/* Search / Command */}
                    <button
                        onClick={() => setIsCommandOpen(true)}
                        className="flex items-center gap-3 px-4 py-2 rounded-lg bg-[#F1F5F9] border border-[#E2E8F0] text-[#64748B] hover:border-[#CBD5E1] transition-colors"
                    >
                        <Search className="w-4 h-4" />
                        <span className="text-sm">Search...</span>
                        <div className="flex items-center gap-1 ml-8 text-xs text-[#94A3B8]">
                            <Command className="w-3 h-3" />
                            <span>K</span>
                        </div>
                    </button>

                    {/* Right Actions */}
                    <div className="flex items-center gap-4">
                        {/* Notifications */}
                        <button className="relative p-2 rounded-lg hover:bg-[#F1F5F9] transition-colors">
                            <Bell className="w-5 h-5 text-[#64748B]" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-[#0D9488] rounded-full" />
                        </button>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setIsProfileOpen(!isProfileOpen)}
                                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-[#F1F5F9] transition-colors"
                            >
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#0D9488] to-[#14B8A6] flex items-center justify-center">
                                    <User className="w-4 h-4 text-white" />
                                </div>
                                <div className="text-left hidden md:block">
                                    <div className="text-sm font-medium text-[#0F172A]">Demo User</div>
                                    <div className="text-xs text-[#64748B]">Broker Admin</div>
                                </div>
                                <ChevronDown className="w-4 h-4 text-[#64748B]" />
                            </button>

                            <AnimatePresence>
                                {isProfileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 4, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 4, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className="absolute top-full right-0 mt-2 w-48 p-2 rounded-lg bg-white border border-[#E2E8F0] shadow-lg"
                                    >
                                        <Link href="/settings" className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-colors">
                                            <Settings className="w-4 h-4" />
                                            Settings
                                        </Link>
                                        <button className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-sm text-[#DC2626] hover:bg-[#FEF2F2] transition-colors">
                                            <LogOut className="w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="p-6">
                    {children}
                </main>
            </div>

            {/* Command Palette Overlay */}
            <AnimatePresence>
                {isCommandOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-[#0F172A]/50 backdrop-blur-sm z-[9999] flex items-start justify-center pt-[20vh]"
                        onClick={() => setIsCommandOpen(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -20 }}
                            transition={{ duration: 0.2 }}
                            className="w-full max-w-[560px] bg-white rounded-xl border border-[#E2E8F0] shadow-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <input
                                type="text"
                                placeholder="Search pages, clients, or commands..."
                                className="w-full px-6 py-4 border-b border-[#E2E8F0] text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none"
                                autoFocus
                            />
                            <div className="max-h-[400px] overflow-y-auto p-2">
                                <div className="text-[10px] font-bold uppercase tracking-widest text-[#64748B] px-4 py-2">
                                    Pages
                                </div>
                                {[
                                    { name: 'Dashboard', icon: LayoutDashboard },
                                    { name: 'Clients', icon: Building2 },
                                    { name: 'Data Refinery', icon: Workflow },
                                    { name: 'Compliance Center', icon: FileCheck },
                                ].map((item) => (
                                    <button key={item.name} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm text-[#334155] hover:bg-[#F1F5F9] transition-colors">
                                        <item.icon className="w-4 h-4 text-[#64748B]" />
                                        <span>{item.name}</span>
                                    </button>
                                ))}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
