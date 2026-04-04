'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminOrders from '@/components/admin/AdminOrders';

export default function PedidosPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
    const router = useRouter();

    useEffect(() => {
        fetchOrders(pagination.page);
    }, [pagination.page]);

    const fetchOrders = async (page: number) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/admin/orders?page=${page}&pageSize=10`);
            if (res.status === 403) {
                router.push('/admin/login');
                return;
            }
            if (res.ok) {
                const data = await res.json();
                setOrders(data.orders || []);
                setPagination(prev => ({ ...prev, totalPages: data.pagination.totalPages }));
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

    const handleUpdateStatus = async (id: number, newStatus: string) => {
        try {
            const res = await fetch(`/api/admin/orders/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                fetchOrders(pagination.page);
            }
        } catch (e) {
            console.error(e);
        }
    };

    if (loading && orders.length === 0) {
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
                onUpdateStatus={handleUpdateStatus}
                onViewDetail={(o) => alert(`Viendo detalle del pedido #${o.id}`)}
            />

            {pagination.totalPages > 1 && (
                <div className="pagination-controls">
                    <button
                        disabled={pagination.page <= 1}
                        onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                    >
                        Anterior
                    </button>
                    <span>Página {pagination.page} de {pagination.totalPages}</span>
                    <button
                        disabled={pagination.page >= pagination.totalPages}
                        onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                    >
                        Siguiente
                    </button>
                </div>
            )}

            <style jsx>{`
                .pagination-controls {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 20px;
                    margin-top: 30px;
                    padding: 20px;
                    color: white;
                }
                button {
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    padding: 8px 20px;
                    border-radius: 8px;
                    color: white;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                button:hover:not(:disabled) {
                    background: rgba(255, 255, 255, 0.2);
                    transform: translateY(-2px);
                }
                button:disabled {
                    opacity: 0.3;
                    cursor: not-allowed;
                }
                span {
                    font-size: 0.9rem;
                    opacity: 0.8;
                }
            `}</style>
        </div>
    );
}
