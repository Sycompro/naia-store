'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BarChart3, Boxes, ShoppingBag, Settings as SettingsIcon } from 'lucide-react';
import AdminDashboard from '@/components/admin/AdminDashboard';
import AdminInventory from '@/components/admin/AdminInventory';
import AdminOrders from '@/components/admin/AdminOrders';
import AdminSettings from '@/components/admin/AdminSettings';

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
    const router = useRouter();

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
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
        <div className="admin-dashboard-page">
            <AdminDashboard
                stats={stats}
                maxSale={maxSale}
                statusColor={statusColor}
                statusLabel={statusLabel}
            />
        </div>
    );
}
