'use client';

import { motion } from 'framer-motion';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface AvatarProps {
    src?: string;
    name: string;
    size?: AvatarSize;
    status?: 'online' | 'offline' | 'busy' | 'away';
    className?: string;
}

const sizeConfig = {
    xs: { container: 'w-6 h-6', text: 'text-[10px]', status: 'w-1.5 h-1.5' },
    sm: { container: 'w-8 h-8', text: 'text-xs', status: 'w-2 h-2' },
    md: { container: 'w-10 h-10', text: 'text-sm', status: 'w-2.5 h-2.5' },
    lg: { container: 'w-12 h-12', text: 'text-base', status: 'w-3 h-3' },
    xl: { container: 'w-16 h-16', text: 'text-lg', status: 'w-4 h-4' },
};

const statusColors = {
    online: 'bg-[var(--color-success)]',
    offline: 'bg-[var(--color-steel)]',
    busy: 'bg-[var(--color-critical)]',
    away: 'bg-[var(--color-warning)]',
};

function getInitials(name: string): string {
    return name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

function getColorFromName(name: string): string {
    const colors = [
        'var(--color-synapse-teal)',
        'var(--color-synapse-cyan)',
        'var(--color-synapse-gold)',
        'var(--color-synapse-violet)',
        '#6366f1',
        '#ec4899',
        '#f97316',
    ];
    const index = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[index % colors.length];
}

export function Avatar({ src, name, size = 'md', status, className = '' }: AvatarProps) {
    const config = sizeConfig[size];
    const initials = getInitials(name);
    const bgColor = getColorFromName(name);

    return (
        <div className={`relative inline-block ${className}`}>
            <div className={`${config.container} rounded-full overflow-hidden flex items-center justify-center`}>
                {src ? (
                    <img src={src} alt={name} className="w-full h-full object-cover" />
                ) : (
                    <div
                        className={`w-full h-full flex items-center justify-center ${config.text} font-medium text-white`}
                        style={{ backgroundColor: bgColor }}
                    >
                        {initials}
                    </div>
                )}
            </div>
            {status && (
                <div
                    className={`absolute bottom-0 right-0 ${config.status} rounded-full border-2 border-[var(--color-obsidian)] ${statusColors[status]}`}
                />
            )}
        </div>
    );
}


interface AvatarGroupProps {
    avatars: { src?: string; name: string }[];
    max?: number;
    size?: AvatarSize;
    className?: string;
}

export function AvatarGroup({ avatars, max = 4, size = 'sm', className = '' }: AvatarGroupProps) {
    const visible = avatars.slice(0, max);
    const remaining = avatars.length - max;
    const config = sizeConfig[size];

    return (
        <div className={`flex items-center -space-x-2 ${className}`}>
            {visible.map((avatar, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="relative"
                    style={{ zIndex: visible.length - i }}
                >
                    <Avatar {...avatar} size={size} />
                </motion.div>
            ))}
            {remaining > 0 && (
                <div
                    className={`${config.container} rounded-full flex items-center justify-center bg-[var(--glass-bg)] border-2 border-[var(--glass-border)] ${config.text} font-medium text-[var(--color-steel)]`}
                >
                    +{remaining}
                </div>
            )}
        </div>
    );
}

export default Avatar;
