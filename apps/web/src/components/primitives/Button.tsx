'use client';

import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    loading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
}

const variantStyles = {
    primary: 'bg-[var(--color-synapse-teal)] text-black hover:bg-[var(--color-synapse-teal)]/90 border-transparent',
    secondary: 'bg-[var(--glass-bg)] text-white hover:bg-[var(--glass-bg-light)] border-[var(--glass-border)]',
    outline: 'bg-transparent text-white hover:bg-[var(--glass-bg)] border-[var(--glass-border)]',
    ghost: 'bg-transparent text-[var(--color-steel)] hover:text-white hover:bg-[var(--glass-bg)] border-transparent',
    danger: 'bg-[var(--color-critical)] text-white hover:bg-[var(--color-critical)]/90 border-transparent',
};

const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-6 py-3 gap-2.5',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    variant = 'primary',
    size = 'md',
    loading = false,
    leftIcon,
    rightIcon,
    fullWidth = false,
    disabled,
    children,
    className = '',
    ...props
}, ref) => {
    return (
        <button
            ref={ref}
            disabled={disabled || loading}
            className={`
                inline-flex items-center justify-center font-medium rounded-lg border transition-all
                disabled:opacity-50 disabled:cursor-not-allowed
                ${variantStyles[variant]}
                ${sizeStyles[size]}
                ${fullWidth ? 'w-full' : ''}
                ${className}
            `}
            {...props}
        >
            {loading ? (
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                >
                    <Loader2 className="w-4 h-4" />
                </motion.div>
            ) : (
                leftIcon
            )}
            {children}
            {!loading && rightIcon}
        </button>
    );
});

Button.displayName = 'Button';


// Icon-only button
interface IconButtonProps extends Omit<ButtonProps, 'leftIcon' | 'rightIcon' | 'children'> {
    icon: React.ReactNode;
    'aria-label': string;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(({
    icon,
    variant = 'ghost',
    size = 'md',
    className = '',
    ...props
}, ref) => {
    const sizeMap = {
        sm: 'w-7 h-7',
        md: 'w-9 h-9',
        lg: 'w-11 h-11',
    };

    return (
        <button
            ref={ref}
            className={`
                inline-flex items-center justify-center rounded-lg border transition-all
                disabled:opacity-50 disabled:cursor-not-allowed
                ${variantStyles[variant]}
                ${sizeMap[size]}
                ${className}
            `}
            {...props}
        >
            {icon}
        </button>
    );
});

IconButton.displayName = 'IconButton';


// Button group
interface ButtonGroupProps {
    children: React.ReactNode;
    attached?: boolean;
    className?: string;
}

export function ButtonGroup({ children, attached = false, className = '' }: ButtonGroupProps) {
    return (
        <div
            className={`inline-flex ${attached ? '[&>button]:rounded-none [&>button:first-child]:rounded-l-lg [&>button:last-child]:rounded-r-lg [&>button:not(:last-child)]:border-r-0' : 'gap-2'} ${className}`}
        >
            {children}
        </div>
    );
}

export default Button;
