'use client';
export const dynamic = 'force-dynamic';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AdminOrders from '@/components/admin/AdminOrders';
import AdminPageHeader from '@/components/admin/AdminPageHeader';

function PedidosContent() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
    const router = useRouter();
    const searchParams = useSearchParams();
    const statusFilter = searchParams.get('status');

    useEffect(() => {
        fetchOrders(pagination.page, statusFilter);
    }, [pagination.page, statusFilter]);

    const fetchOrders = async (page: number, status?: string | null) => {
        setLoading(true);
        try {
            let url = `/api/admin/orders?page=${page}&pageSize=10`;
            if (status) url += `&status=${status}`;

            const res = await fetch(url);
            if (res.status === 403) {
                router.push('/admin/login');
                return;
            }
            if (res.ok) {
                const data = await res.json();
                setOrders(data.orders || []);
                setPagination(prev => ({
                    ...prev,
                    totalPages: data.pagination?.totalPages || 1
                }));
            }
        } catch (e) {
            console.error('Fetch orders error:', e);
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

    const statusLabel = (s: string) => s ? s.replace('_', ' ').replace(/^\w/, c => c.toUpperCase()) : 'N/A';

    const handleUpdateStatus = async (id: number, newStatus: string) => {
        try {
            const res = await fetch(`/api/admin/orders/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            if (res.ok) {
                fetchOrders(pagination.page, statusFilter);
            }
        } catch (e) {
            console.error('Update status error:', e);
        }
    };

    if (loading && orders.length === 0) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="w-10 h-10 border-3 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
            </div>
        );
    }

    const currentFilter = statusFilter?.toUpperCase();

    return (
        <div className="admin-pedidos-page animate-entrance max-w-[1600px] mx-auto">
            <AdminPageHeader
                title={currentFilter === 'PENDIENTE' ? 'Pedidos Pendientes' : 'Gestión de Pedidos'}
                breadcrumb={[
                    { label: 'Admin', href: '/admin' },
                    { label: 'Pedidos', href: '/admin/pedidos' },
                    { label: currentFilter ? (currentFilter === 'PENDIENTE' ? 'Pendientes' : currentFilter) : 'Todos' }
                ]}
            />

            <div className="settings-nav-tabs mt-8 mb-7">
                <button
                    className={`tab-item ${!statusFilter ? 'active' : ''}`}
                    onClick={() => router.push('/admin/pedidos')}
                >
                    <span>Todos los Pedidos</span>
                </button>
                <button
                    className={`tab-item ${currentFilter === 'PENDIENTE' ? 'active' : ''}`}
                    onClick={() => router.push('/admin/pedidos?status=pendiente')}
                >
                    <span>Pendientes</span>
                </button>
            </div>

            <AdminOrders
                orders={orders}
                statusColor={statusColor}
                statusLabel={statusLabel}
                onUpdateStatus={handleUpdateStatus}
                onViewDetail={(o) => alert(`Viendo detalle del pedido #${o.id}`)}
            />

            <style jsx>{`
                .settings-nav-tabs {
                    display: flex; gap: 8px; background: rgba(15, 23, 42, 0.4); 
                    padding: 6px; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.05);
                    width: fit-content; margin-bottom: 28px;
                }
                .tab-item {
                    display: flex; align-items: center; gap: 10px; padding: 10px 20px;
                    border-radius: 12px; border: none; background: none; color: #64748b;
                    font-weight: 800; font-size: 14px; cursor: pointer; transition: 0.3s;
                }
                .tab-item:hover { color: white; background: rgba(255,255,255,0.03); }
                .tab-item.active { background: white; color: #0f172a; box-shadow: 0 10px 20px rgba(0,0,0,0.2); }
            `}</style>

            {pagination.totalPages > 1 && (
                <div className="flex justify-end mt-5">
                    <div className="flex items-center gap-4 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
                        <button
                            className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-white font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
                            disabled={pagination.page <= 1}
                            onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                        >
                            Anterior
                        </button>
                        <span className="text-sm font-bold text-slate-500">Página {pagination.page} de {pagination.totalPages}</span>
                        <button
                            className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-white font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white/10 transition-all"
                            disabled={pagination.page >= pagination.totalPages}
                            onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default function PedidosPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-slate-500">Cargando módulo de pedidos...</div>}>
            <PedidosContent />
        </Suspense>
    );
}
