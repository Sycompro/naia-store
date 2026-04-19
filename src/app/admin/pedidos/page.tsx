'use client';
export const dynamic = 'force-dynamic';
import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AdminOrders from '@/components/admin/AdminOrders';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { ShoppingBag, Clock } from 'lucide-react';

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

    const currentFilter = statusFilter?.toUpperCase();

    return (
        <div className="admin-pedidos-page animate-entrance">
            <AdminPageHeader
                title={currentFilter === 'PENDIENTE' ? 'Nuevos Pedidos' : 'Centro de Pedidos'}
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
                    <ShoppingBag size={18} /><span>Todos</span>
                </button>
                <button
                    className={`tab-item ${currentFilter === 'PENDIENTE' ? 'active' : ''}`}
                    onClick={() => router.push('/admin/pedidos?status=pendiente')}
                >
                    <Clock size={18} /><span>Pendientes</span>
                </button>
            </div>

            <div className="orders-container animate-fade-in">
                <AdminOrders
                    orders={orders}
                    statusColor={statusColor}
                    statusLabel={statusLabel}
                    onUpdateStatus={handleUpdateStatus}
                    onViewDetail={(o) => alert(`Viendo detalle del pedido #${o.id}`)}
                />
            </div>

            <style jsx>{`
                .admin-pedidos-page { max-width: 1400px; margin: 0 auto; }
                .settings-nav-tabs {
                    display: flex; gap: 8px; background: #f1f5f9; 
                    padding: 6px; border-radius: 18px; border: 1px solid #e2e8f0;
                    width: fit-content; margin-bottom: 35px;
                }
                .tab-item {
                    display: flex; align-items: center; gap: 10px; padding: 12px 24px;
                    border-radius: 14px; border: none; background: none; color: #64748b;
                    font-weight: 800; font-size: 14px; cursor: pointer; transition: 0.3s;
                }
                .tab-item:hover { color: #ec4899; }
                .tab-item.active { background: #ec4899; color: white; box-shadow: 0 10px 20px rgba(236, 72, 153, 0.2); }

                .pagination-wrapper { display: flex; justify-content: center; margin-top: 40px; }
                .pagination-controls-admin { 
                    display: flex; align-items: center; gap: 20px; background: #fff; 
                    padding: 8px 12px; border-radius: 20px; border: 1px solid #f1f5f9;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.02);
                }
                .page-indicator { font-size: 14px; font-weight: 800; color: #1e293b; min-width: 140px; text-align: center; }
                .p-nav-btn { 
                    background: #f8fafc; border: 1px solid #f1f5f9; padding: 10px 20px; 
                    border-radius: 14px; color: #64748b; cursor: pointer; font-size: 13px; font-weight: 800; transition: 0.3s; 
                }
                .p-nav-btn:hover:not(:disabled) { background: #1e293b; color: white; border-color: #1e293b; }
                .p-nav-btn:disabled { opacity: 0.4; cursor: not-allowed; }

                @keyframes entrance { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .animate-entrance { animation: entrance 0.6s ease-out; }
            `}</style>

            {pagination.totalPages > 1 && (
                <div className="pagination-wrapper">
                    <div className="pagination-controls-admin">
                        <button
                            className="p-nav-btn"
                            disabled={pagination.page <= 1}
                            onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                        >
                            Anterior
                        </button>
                        <span className="page-indicator">Página {pagination.page} de {pagination.totalPages}</span>
                        <button
                            className="p-nav-btn"
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
        <Suspense fallback={<div className="p-8 text-center text-slate-500 font-bold">Iniciando Centro de Pedidos...</div>}>
            <PedidosContent />
        </Suspense>
    );
}
