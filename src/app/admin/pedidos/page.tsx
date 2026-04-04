'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminOrders from '@/components/admin/AdminOrders';

export default function PedidosPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/admin/stats');
            if (res.status === 403) {
                router.push('/admin/login');
                return;
            }
            if (res.ok) {
                const data = await res.json();
                setOrders(data.recentOrders || []);
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
        <div className="admin-pedidos-page">
            <AdminOrders
                orders={orders}
                statusColor={statusColor}
                statusLabel={statusLabel}
            />
        </div>
    );
}
