'use client';
export const dynamic = 'force-dynamic';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart3, Boxes, ShoppingBag, Settings as SettingsIcon } from 'lucide-react';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { RefreshCw } from 'lucide-react';

interface StatsData {
    totalProducts: number;
    totalUsers: number;
    totalOrders: number;
    totalRevenue: number;
    monthlySales: { month: string; total: number; count: number }[];
    lowStock: { id: number; name: string; stock: number; category: string }[];
    recentOrders: { id: number; total: number; status: string; createdAt: string; user: { name: string; email: string }; items: { name: string; quantity: number }[] }[];
    products: { id: string; name: string; stock: number; category: string; price: number; image: string }[];
}

export default function AdminPage() {
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        setRefreshing(true);
        try {
            const res = await fetch('/api/admin/stats');
            if (res.status === 403) {
                router.push('/admin/login');
                return;
            }
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const statusColor = (status: string) => {
        switch (status) {
            case 'PENDIENTE': return '#f59e0b';
            case 'EN_PROCESO': return '#3b82f6';
            case 'ENTREGADO': return '#10b981';
            case 'CANCELADO': return '#ef4444';
            default: return '#888';
        }
    };

    const statusLabel = (s: string) => s.replace('_', ' ').replace(/^\w/, c => c.toUpperCase());
    const maxSale = stats?.monthlySales ? Math.max(...stats.monthlySales.map((m: any) => m.total), 1) : 1;

    if (loading) {
        return (
            <div className="loading-state">
                <div className="spinner" />
                <style jsx>{`
                    .loading-state { display: flex; align-items: center; justify-content: center; min-height: 400px; }
                    .spinner { width: 40px; height: 40px; border: 3px solid rgba(0,0,0,0.05); border-top-color: #0f172a; border-radius: 50%; animation: spin 0.8s linear infinite; }
                    @keyframes spin { to { transform: rotate(360deg); } }
                `}</style>
            </div>
        );
    }

    return (
        <div className="admin-page animate-entrance">
            <AdminPageHeader
                title="Panel de Control"
                breadcrumb={[{ label: 'Admin' }, { label: 'Dashboard' }]}
                actions={
                    <button
                        className={`refresh-btn-premium ${refreshing ? 'spinning' : ''}`}
                        onClick={fetchStats}
                        disabled={refreshing}
                    >
                        <RefreshCw size={16} /> {refreshing ? 'Sincronizando...' : 'Actualizar Datos'}
                    </button>
                }
            />

            <AdminDashboard
                stats={stats}
                maxSale={maxSale}
                statusColor={statusColor}
                statusLabel={statusLabel}
                onRefresh={fetchStats}
                refreshing={refreshing}
            />

            <style jsx>{`
                .refresh-btn-premium {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 10px 20px;
                    border-radius: 14px;
                    color: white;
                    font-weight: 800;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    cursor: pointer;
                    transition: 0.3s;
                }
                .refresh-btn-premium:hover:not(:disabled) {
                    background: rgba(255, 255, 255, 0.1);
                    transform: translateY(-2px);
                }
                .refresh-btn-premium:disabled {
                    opacity: 0.5;
                }
                .spinning {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}
