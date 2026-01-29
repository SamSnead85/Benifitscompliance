'use client';

import { useState, useRef, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';

interface DropdownProps {
    trigger: ReactNode;
    children: ReactNode;
    align?: 'left' | 'right';
    className?: string;
}

export function Dropdown({ trigger, children, align = 'left', className = '' }: DropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={ref} className={`relative ${className}`}>
            <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute top-full mt-2 min-w-[200px] rounded-xl bg-[var(--glass-bg)] border border-[var(--glass-border)] shadow-xl z-50 py-1 ${align === 'right' ? 'right-0' : 'left-0'
                            }`}
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}


interface DropdownItemProps {
    children: ReactNode;
    icon?: ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    destructive?: boolean;
    selected?: boolean;
}

export function DropdownItem({
    children,
    icon,
    onClick,
    disabled = false,
    destructive = false,
    selected = false
}: DropdownItemProps) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`w-full flex items-center gap-2 px-3 py-2 text-sm text-left transition-colors ${disabled
                    ? 'opacity-50 cursor-not-allowed'
                    : destructive
                        ? 'text-[var(--color-critical)] hover:bg-[rgba(239,68,68,0.1)]'
                        : 'text-white hover:bg-[var(--glass-bg-light)]'
                }`}
        >
            {icon && <span className="w-4 h-4 text-[var(--color-steel)]">{icon}</span>}
            <span className="flex-1">{children}</span>
            {selected && <Check className="w-4 h-4 text-[var(--color-synapse-teal)]" />}
        </button>
    );
}


export function DropdownDivider() {
    return <div className="my-1 h-px bg-[var(--glass-border)]" />;
}


interface DropdownLabelProps {
    children: ReactNode;
}

export function DropdownLabel({ children }: DropdownLabelProps) {
    return (
        <div className="px-3 py-2 text-xs font-medium text-[var(--color-steel)] uppercase tracking-wider">
            {children}
        </div>
    );
}


// Select dropdown variant
interface SelectDropdownOption {
    value: string;
    label: string;
    icon?: ReactNode;
}

interface SelectDropdownProps {
    value: string;
    options: SelectDropdownOption[];
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export function SelectDropdown({
    value,
    options,
    onChange,
    placeholder = 'Select...',
    className = ''
}: SelectDropdownProps) {
    const selectedOption = options.find(o => o.value === value);

    return (
        <Dropdown
            align="left"
            className={className}
            trigger={
                <button className="flex items-center justify-between gap-2 px-3 py-2 min-w-[160px] rounded-lg bg-[var(--glass-bg)] border border-[var(--glass-border)] hover:border-[var(--glass-border-hover)] transition-colors">
                    <span className={selectedOption ? 'text-white text-sm' : 'text-[var(--color-steel)] text-sm'}>
                        {selectedOption?.label || placeholder}
                    </span>
                    <ChevronDown className="w-4 h-4 text-[var(--color-steel)]" />
                </button>
            }
        >
            {options.map((option) => (
                <DropdownItem
                    key={option.value}
                    onClick={() => onChange(option.value)}
                    selected={option.value === value}
                    icon={option.icon}
                >
                    {option.label}
                </DropdownItem>
            ))}
        </Dropdown>
    );
}

export default Dropdown;
