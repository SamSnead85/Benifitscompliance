'use client';

import { motion } from 'framer-motion';
import { ReactNode, forwardRef } from 'react';
import { Loader2 } from 'lucide-react';

interface PremiumButtonProps {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success';
    size?: 'sm' | 'md' | 'lg';
    icon?: ReactNode;
    iconPosition?: 'left' | 'right';
    loading?: boolean;
    disabled?: boolean;
    fullWidth?: boolean;
    className?: string;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
}

/**
 * Premium Button System
 * Sharp-edged, physics-based interactions with optical volume
 */
export const PremiumButton = forwardRef<HTMLButtonElement, PremiumButtonProps>(
    function PremiumButton(
        {
            children,
            variant = 'primary',
            size = 'md',
            icon,
            iconPosition = 'left',
            loading = false,
            disabled = false,
            fullWidth = false,
            className = '',
            onClick,
            type = 'button',
        },
        ref
    ) {
        const variants = {
            primary: `
        bg-gradient-to-b from-cyan-500 to-teal-600
        text-[#030712] font-semibold
        shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.25)]
        hover:shadow-[0_4px_12px_rgba(0,0,0,0.4),0_0_20px_rgba(6,182,212,0.3),inset_0_1px_0_rgba(255,255,255,0.25)]
        active:shadow-[0_1px_2px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(0,0,0,0.2)]
      `,
            secondary: `
        bg-[rgba(255,255,255,0.03)]
        text-white font-medium
        border border-[rgba(255,255,255,0.08)]
        hover:bg-[rgba(255,255,255,0.06)]
        hover:border-[rgba(6,182,212,0.4)]
        shadow-[0_2px_4px_rgba(0,0,0,0.2)]
      `,
            ghost: `
        bg-transparent
        text-[#94A3B8] font-medium
        hover:text-white
        hover:bg-[rgba(255,255,255,0.04)]
      `,
            danger: `
        bg-gradient-to-b from-red-500 to-red-600
        text-white font-semibold
        shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)]
        hover:shadow-[0_4px_12px_rgba(0,0,0,0.4),0_0_20px_rgba(239,68,68,0.3)]
      `,
            success: `
        bg-gradient-to-b from-emerald-500 to-emerald-600
        text-white font-semibold
        shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.2)]
        hover:shadow-[0_4px_12px_rgba(0,0,0,0.4),0_0_20px_rgba(16,185,129,0.3)]
      `,
        };

        const sizes = {
            sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-md',
            md: 'px-4 py-2.5 text-sm gap-2 rounded-md',
            lg: 'px-6 py-3 text-base gap-2.5 rounded-lg',
        };

        return (
            <motion.button
                ref={ref}
                type={type}
                onClick={onClick}
                disabled={disabled || loading}
                whileHover={{ y: disabled ? 0 : -1 }}
                whileTap={{ y: disabled ? 0 : 0, scale: disabled ? 1 : 0.98 }}
                transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className={`
          relative inline-flex items-center justify-center
          transition-all duration-200
          ${variants[variant]}
          ${sizes[size]}
          ${fullWidth ? 'w-full' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${className}
        `}
            >
                {loading && (
                    <Loader2 className="w-4 h-4 animate-spin absolute" />
                )}
                <span className={`inline-flex items-center gap-2 ${loading ? 'opacity-0' : ''}`}>
                    {icon && iconPosition === 'left' && icon}
                    {children}
                    {icon && iconPosition === 'right' && icon}
                </span>
            </motion.button>
        );
    }
);

/**
 * Premium Button Group
 */
interface PremiumButtonGroupProps {
    children: ReactNode;
    className?: string;
}

export function PremiumButtonGroup({ children, className = '' }: PremiumButtonGroupProps) {
    return (
        <div className={`inline-flex items-center gap-2 ${className}`}>
            {children}
        </div>
    );
}

/**
 * Premium Icon Button
 */
interface PremiumIconButtonProps {
    icon: ReactNode;
    variant?: 'primary' | 'secondary' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    label?: string;
    disabled?: boolean;
    className?: string;
    onClick?: () => void;
}

export function PremiumIconButton({
    icon,
    variant = 'ghost',
    size = 'md',
    label,
    disabled = false,
    className = '',
    onClick,
}: PremiumIconButtonProps) {
    const sizes = {
        sm: 'w-7 h-7',
        md: 'w-9 h-9',
        lg: 'w-11 h-11',
    };

    const variants = {
        primary: `
      bg-gradient-to-b from-cyan-500 to-teal-600
      text-[#030712]
      shadow-[0_2px_4px_rgba(0,0,0,0.3)]
    `,
        secondary: `
      bg-[rgba(255,255,255,0.04)]
      text-[#94A3B8]
      border border-[rgba(255,255,255,0.08)]
      hover:bg-[rgba(255,255,255,0.08)]
      hover:text-white
    `,
        ghost: `
      text-[#64748B]
      hover:text-white
      hover:bg-[rgba(255,255,255,0.06)]
    `,
    };

    return (
        <motion.button
            onClick={onClick}
            disabled={disabled}
            whileHover={{ scale: disabled ? 1 : 1.05 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
            aria-label={label}
            className={`
        inline-flex items-center justify-center rounded-lg
        transition-all duration-200
        ${sizes[size]}
        ${variants[variant]}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
        >
            {icon}
        </motion.button>
    );
}

export default PremiumButton;
