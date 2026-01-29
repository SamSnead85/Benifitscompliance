'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
    label: string;
    href?: string;
}

interface BreadcrumbsProps {
    items?: BreadcrumbItem[];
    showHome?: boolean;
    className?: string;
}

// Route label mappings
const routeLabels: Record<string, string> = {
    'dashboard': 'Dashboard',
    'clients': 'Clients',
    'compliance': 'Compliance Center',
    'refinery': 'Data Refinery',
    'self-insured': 'Self-Insured',
    'anomalies': 'AI Anomaly Detection',
    'reports': 'Reports',
    'settings': 'Settings',
    'onboard': 'Onboarding',
};

export function Breadcrumbs({ items, showHome = true, className = '' }: BreadcrumbsProps) {
    const pathname = usePathname();

    // Auto-generate breadcrumbs from pathname if items not provided
    const breadcrumbItems: BreadcrumbItem[] = items || (() => {
        const segments = pathname.split('/').filter(Boolean);
        let path = '';

        return segments.map((segment, index) => {
            path += `/${segment}`;
            const isLast = index === segments.length - 1;

            return {
                label: routeLabels[segment] || segment.charAt(0).toUpperCase() + segment.slice(1),
                href: isLast ? undefined : path
            };
        });
    })();

    if (breadcrumbItems.length === 0) return null;

    return (
        <nav aria-label="Breadcrumb" className={`flex items-center text-sm ${className}`}>
            {showHome && (
                <>
                    <Link
                        href="/dashboard"
                        className="flex items-center text-[var(--color-steel)] hover:text-[var(--color-synapse-teal)] transition-colors"
                    >
                        <Home className="w-4 h-4" />
                    </Link>
                    {breadcrumbItems.length > 0 && (
                        <ChevronRight className="w-4 h-4 mx-2 text-[var(--color-steel)]" />
                    )}
                </>
            )}

            {breadcrumbItems.map((item, index) => {
                const isLast = index === breadcrumbItems.length - 1;

                return (
                    <span key={index} className="flex items-center">
                        {item.href ? (
                            <Link
                                href={item.href}
                                className="text-[var(--color-steel)] hover:text-[var(--color-synapse-teal)] transition-colors"
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-white font-medium">{item.label}</span>
                        )}
                        {!isLast && (
                            <ChevronRight className="w-4 h-4 mx-2 text-[var(--color-steel)]" />
                        )}
                    </span>
                );
            })}
        </nav>
    );
}

export default Breadcrumbs;
