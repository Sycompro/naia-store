'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, UserRole } from '@/types';

interface AuthState {
    id: number;
    email: string;
    name: string | null;
    role: UserRole;
}

interface AuthContextType {
    user: AuthState | null;
    login: (user: AuthState) => void;
    logout: () => void;
    loading: boolean;
    isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<AuthState | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        try {
            const savedUser = localStorage.getItem('naia-user');
            if (savedUser) {
                const parsed = JSON.parse(savedUser) as AuthState;
                if (parsed.id && parsed.email && parsed.role) {
                    setUser(parsed);
                }
            }
        } catch (error) {
            console.error('Error parsing user from localStorage:', error);
            localStorage.removeItem('naia-user');
        } finally {
            setLoading(false);
        }
    }, []);

    const login = useCallback((userData: AuthState) => {
        setUser(userData);
        localStorage.setItem('naia-user', JSON.stringify(userData));
    }, []);

    const logout = useCallback(() => {
        setUser(null);
        localStorage.removeItem('naia-user');
        fetch('/api/auth/logout', { method: 'POST' }).catch(console.error);
    }, []);

    const isAdmin = user?.role === 'ADMIN';

    return (
        <AuthContext.Provider value={{ user, login, logout, loading, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
