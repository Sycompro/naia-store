'use client';
export const dynamic = 'force-dynamic';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminOrders from '@/components/admin/AdminOrders';
import AdminPageHeader from '@/components/admin/AdminPageHeader';

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
        <div className="admin-pedidos-page animate-entrance">
            <AdminPageHeader
                title="Gestión de Pedidos"
                breadcrumb={[{ label: 'Admin', href: '/admin' }, { label: 'Pedidos' }]}
            />

            <AdminOrders
                orders={orders}
                statusColor={statusColor}
                statusLabel={statusLabel}
                onUpdateStatus={handleUpdateStatus}
                onViewDetail={(o) => alert(`Viendo detalle del pedido #${o.id}`)}
            />

            {pagination.totalPages > 1 && (
                <div className="pagination-wrapper">
                    <div className="pagination-controls-admin">
                        <button
                            disabled={pagination.page <= 1}
                            onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                        >
                            Anterior
                        </button>
                        <span className="page-indicator">Página {pagination.page} de {pagination.totalPages}</span>
                        <button
                            disabled={pagination.page >= pagination.totalPages}
                            onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            )}

            <style jsx>{`
                .admin-pedidos-page {
                    max-width: 1600px;
                    margin: 0 auto;
                }
                .pagination-wrapper {
                    display: flex;
                    justify-content: flex-end;
                    margin-top: 20px;
                }
                .pagination-controls-admin {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    background: rgba(255,255,255,0.03);
                    padding: 8px 16px;
                    border-radius: 16px;
                    border: 1px solid rgba(255,255,255,0.05);
                }
                .page-indicator {
                    font-size: 13px;
                    font-weight: 700;
                    color: #64748b;
                }
                button {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 8px 16px;
                    border-radius: 10px;
                    color: white;
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: 700;
                    transition: 0.3s;
                }
                button:hover:not(:disabled) {
                    background: rgba(255, 255, 255, 0.15);
                }
                button:disabled {
                    opacity: 0.3;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
}
