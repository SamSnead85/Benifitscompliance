'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'analyst' | 'viewer';
    organization: string;
}

interface Organization {
    id: string;
    name: string;
    ein: string;
    taxYear: number;
}

interface AppState {
    user: User | null;
    organization: Organization | null;
    sidebarOpen: boolean;
    commandPaletteOpen: boolean;
    notifications: number;
}

interface AppContextType extends AppState {
    setUser: (user: User | null) => void;
    setOrganization: (org: Organization | null) => void;
    toggleSidebar: () => void;
    setSidebarOpen: (open: boolean) => void;
    toggleCommandPalette: () => void;
    setNotifications: (count: number) => void;
}

const defaultState: AppState = {
    user: {
        id: 'U001',
        name: 'Sarah Thompson',
        email: 'sarah.thompson@acmecorp.com',
        role: 'admin',
        organization: 'Acme Corporation',
    },
    organization: {
        id: 'ORG001',
        name: 'Acme Corporation',
        ein: '12-3456789',
        taxYear: 2025,
    },
    sidebarOpen: true,
    commandPaletteOpen: false,
    notifications: 3,
};

const AppContext = createContext<AppContextType | null>(null);

export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
}

interface AppProviderProps {
    children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
    const [state, setState] = useState<AppState>(defaultState);

    const setUser = useCallback((user: User | null) => {
        setState(prev => ({ ...prev, user }));
    }, []);

    const setOrganization = useCallback((organization: Organization | null) => {
        setState(prev => ({ ...prev, organization }));
    }, []);

    const toggleSidebar = useCallback(() => {
        setState(prev => ({ ...prev, sidebarOpen: !prev.sidebarOpen }));
    }, []);

    const setSidebarOpen = useCallback((sidebarOpen: boolean) => {
        setState(prev => ({ ...prev, sidebarOpen }));
    }, []);

    const toggleCommandPalette = useCallback(() => {
        setState(prev => ({ ...prev, commandPaletteOpen: !prev.commandPaletteOpen }));
    }, []);

    const setNotifications = useCallback((notifications: number) => {
        setState(prev => ({ ...prev, notifications }));
    }, []);

    const value: AppContextType = {
        ...state,
        setUser,
        setOrganization,
        toggleSidebar,
        setSidebarOpen,
        toggleCommandPalette,
        setNotifications,
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export default AppProvider;
