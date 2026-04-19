'use client';
import React from 'react';
import { ShoppingBag, Clock, MoreVertical, Eye, Truck, Search } from 'lucide-react';
import AdminCard from './AdminCard';

interface AdminOrdersProps {
    orders: any[];
    statusColor: (status: string) => string;
    statusLabel: (status: string) => string;
    onUpdateStatus: (id: number, status: string) => void;
    onViewDetail: (order: any) => void;
}

export default function AdminOrders({ orders, statusColor, statusLabel, onUpdateStatus, onViewDetail }: AdminOrdersProps) {
    return (
        <div className="orders-section">
            <AdminCard
                title="Lista de Pedidos"
                description="Monitorea y gestiona el flujo de ventas de tu tienda en tiempo real."
                actions={
                    <div className="header-filters-premium">
                        <div className="search-mini-premium">
                            <Search size={14} color="#94a3b8" />
                            <input type="text" placeholder="Buscar ID o Cliente..." />
                        </div>
                    </div>
                }
            >
                <div className="table-responsive">
                    <div className="orders-table-premium">
                        <div className="table-head">
                            <div className="col-id">Orden</div>
                            <div className="col-cust">Cliente / Información</div>
                            <div className="col-date">Fecha Registro</div>
                            <div className="col-total text-right">Total</div>
                            <div className="col-status">Estado Entrega</div>
                            <div className="col-actions text-right">Acciones</div>
                        </div>
                        <div className="table-list">
                            {orders.length === 0 ? (
                                <div className="empty-state">No hay pedidos disponibles para mostrar</div>
                            ) : (
                                orders.map(order => (
                                    <div key={order.id} className="row-item-premium">
                                        <div className="col-id">
                                            <span className="order-id-label">#{String(order.id).padStart(5, '0')}</span>
                                        </div>
                                        <div className="col-cust">
                                            <span className="cust-name-premium">{order.user?.name || order.customerName || 'Invitado'}</span>
                                            <span className="cust-meta-premium">{order.user?.email || order.customerPhone || 'Venta Presencial'}</span>
                                        </div>
                                        <div className="col-date">
                                            <span className="date-txt-premium">{new Date(order.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                        </div>
                                        <div className="col-total text-right">
                                            <span className="total-val-premium">S/ {Number(order.total || 0).toFixed(2)}</span>
                                        </div>
                                        <div className="col-status">
                                            <span className="status-pill-premium" style={{
                                                '--status-color': statusColor(order.status)
                                            } as any}>
                                                {statusLabel(order.status) || 'Pendiente'}
                                            </span>
                                        </div>
                                        <div className="col-actions">
                                            <button className="btn-action-premium" onClick={() => onViewDetail(order)} title="Ver Detalle"><Eye size={16} /></button>
                                            <button className="btn-action-premium" onClick={() => onUpdateStatus(order.id, 'EN_PROCESO')} title="En Proceso"><Truck size={16} /></button>
                                            <button className="btn-action-premium" onClick={() => onUpdateStatus(order.id, 'ENTREGADO')} title="Completar"><Clock size={16} /></button>
                                            <button className="btn-action-premium del" onClick={() => onUpdateStatus(order.id, 'CANCELADO')} title="Cancelar"><MoreVertical size={16} /></button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </AdminCard>

            <style jsx>{`
                .orders-section { display: flex; flex-direction: column; gap: 20px; }
                
                .header-filters-premium { display: flex; gap: 10px; align-items: center; }
                .search-mini-premium {
                    display: flex; align-items: center; gap: 8px; padding: 10px 16px;
                    background: #f8fafc; border: 1px solid #e2e8f0;
                    border-radius: 14px; width: 260px; transition: 0.3s;
                }
                .search-mini-premium:focus-within { border-color: #ec4899; background: #fff; box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.05); }
                .search-mini-premium input {
                    background: none; border: none; outline: none; color: #1e293b; font-size: 13px; font-weight: 700; width: 100%;
                }
                .search-mini-premium input::placeholder { color: #94a3b8; }

                .table-responsive { width: 100%; overflow-x: auto; margin-top: 5px; }
                .orders-table-premium { min-width: 1000px; }
                
                .table-head {
                    display: grid; 
                    grid-template-columns: 100px 1fr 150px 130px 180px 180px;
                    padding: 15px 10px; 
                    border-bottom: 2px solid #f1f5f9;
                    font-size: 11px; font-weight: 900; color: #94a3b8; 
                    text-transform: uppercase; letter-spacing: 0.1em;
                    gap: 20px;
                    align-items: center;
                }
                
                .row-item-premium {
                    display: grid; 
                    grid-template-columns: 100px 1fr 150px 130px 180px 180px;
                    padding: 20px 10px; 
                    border-bottom: 1px solid #f8fafc;
                    align-items: center; 
                    transition: 0.2s;
                    gap: 20px;
                }
                .row-item-premium:hover { background: #fdf2f8; }

                .order-id-label { font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 950; color: #cbd5e1; }
                .col-cust { display: flex; flex-direction: column; gap: 3px; }
                .cust-name-premium { font-weight: 850; color: #1e293b; font-size: 15px; letter-spacing: -0.3px; }
                .cust-meta-premium { font-size: 11px; color: #64748b; font-weight: 700; }

                .date-txt-premium { font-size: 13px; font-weight: 800; color: #475569; }
                .total-val-premium { font-size: 16px; font-weight: 950; color: #1e293b; }

                .status-pill-premium {
                    padding: 6px 14px; border-radius: 100px; font-size: 10px; font-weight: 900;
                    text-transform: uppercase; letter-spacing: 0.05em;
                    background: color-mix(in srgb, var(--status-color), white 90%);
                    color: var(--status-color);
                    border: 1px solid color-mix(in srgb, var(--status-color), white 80%);
                    display: inline-flex; align-items: center; justify-content: center;
                }

                .col-actions { display: flex !important; flex-direction: row !important; gap: 8px !important; justify-content: flex-end; }

                .btn-action-premium {
                    width: 38px; height: 38px; border-radius: 12px; display: flex; align-items: center; justify-content: center;
                    background: #fff; border: 1px solid #e2e8f0; color: #64748b; cursor: pointer; transition: 0.3s;
                }
                .btn-action-premium:hover { border-color: #ec4899; color: #ec4899; background: #fff; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
                .btn-action-premium.del:hover { color: #f43f5e; border-color: #fecdd3; title="Cancelar" }

                .text-right { text-align: right; }
                .empty-state { padding: 80px; text-align: center; color: #94a3b8; font-weight: 700; font-size: 15px; }
            `}</style>
        </div>
    );
}
