'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface ComplianceFilters {
    taxYear: number;
    status: string[];
    departments: string[];
    fteStatus: string[];
}

interface ComplianceState {
    selectedEmployees: string[];
    filters: ComplianceFilters;
    viewMode: 'grid' | 'list' | 'table';
    sortBy: string;
    sortDirection: 'asc' | 'desc';
}

interface ComplianceContextType extends ComplianceState {
    selectEmployee: (id: string) => void;
    selectEmployees: (ids: string[]) => void;
    clearSelection: () => void;
    updateFilters: (filters: Partial<ComplianceFilters>) => void;
    resetFilters: () => void;
    setViewMode: (mode: 'grid' | 'list' | 'table') => void;
    setSorting: (key: string, direction?: 'asc' | 'desc') => void;
}

const defaultFilters: ComplianceFilters = {
    taxYear: 2025,
    status: [],
    departments: [],
    fteStatus: [],
};

const defaultState: ComplianceState = {
    selectedEmployees: [],
    filters: defaultFilters,
    viewMode: 'table',
    sortBy: 'name',
    sortDirection: 'asc',
};

const ComplianceContext = createContext<ComplianceContextType | null>(null);

export function useCompliance() {
    const context = useContext(ComplianceContext);
    if (!context) {
        throw new Error('useCompliance must be used within ComplianceProvider');
    }
    return context;
}

interface ComplianceProviderProps {
    children: ReactNode;
}

export function ComplianceProvider({ children }: ComplianceProviderProps) {
    const [state, setState] = useState<ComplianceState>(defaultState);

    const selectEmployee = useCallback((id: string) => {
        setState(prev => ({
            ...prev,
            selectedEmployees: prev.selectedEmployees.includes(id)
                ? prev.selectedEmployees.filter(e => e !== id)
                : [...prev.selectedEmployees, id]
        }));
    }, []);

    const selectEmployees = useCallback((ids: string[]) => {
        setState(prev => ({ ...prev, selectedEmployees: ids }));
    }, []);

    const clearSelection = useCallback(() => {
        setState(prev => ({ ...prev, selectedEmployees: [] }));
    }, []);

    const updateFilters = useCallback((filters: Partial<ComplianceFilters>) => {
        setState(prev => ({
            ...prev,
            filters: { ...prev.filters, ...filters }
        }));
    }, []);

    const resetFilters = useCallback(() => {
        setState(prev => ({ ...prev, filters: defaultFilters }));
    }, []);

    const setViewMode = useCallback((viewMode: 'grid' | 'list' | 'table') => {
        setState(prev => ({ ...prev, viewMode }));
    }, []);

    const setSorting = useCallback((sortBy: string, direction?: 'asc' | 'desc') => {
        setState(prev => ({
            ...prev,
            sortBy,
            sortDirection: direction || (prev.sortBy === sortBy && prev.sortDirection === 'asc' ? 'desc' : 'asc')
        }));
    }, []);

    const value: ComplianceContextType = {
        ...state,
        selectEmployee,
        selectEmployees,
        clearSelection,
        updateFilters,
        resetFilters,
        setViewMode,
        setSorting,
    };

    return (
        <ComplianceContext.Provider value={value}>
            {children}
        </ComplianceContext.Provider>
    );
}

export default ComplianceProvider;
