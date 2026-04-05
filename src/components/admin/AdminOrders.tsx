'use client';
import React from 'react';
import { ShoppingBag, Clock, MoreVertical, Eye, Download, Truck, Filter, Search } from 'lucide-react';
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
                title="Historial de Transacciones"
                description="Listado completo de pedidos realizados en la tienda."
                actions={
                    <div className="header-filters-modern">
                        <button className="filter-chip active">Todos</button>
                        <button className="filter-chip">Críticos</button>
                        <div className="search-mini">
                            <Search size={14} />
                            <input type="text" placeholder="ID o Cliente" />
                        </div>
                    </div>
                }
            >
                <div className="table-responsive">
                    <div className="orders-table-modern">
                        <div className="table-head">
                            <div className="col-id">Orden</div>
                            <div className="col-cust">Cliente</div>
                            <div className="col-date">Fecha</div>
                            <div className="col-total text-right">Total</div>
                            <div className="col-status">Estado</div>
                            <div className="col-actions text-right">Acciones</div>
                        </div>
                        <div className="table-list">
                            {orders.length === 0 ? (
                                <div className="empty-state">No hay pedidos registrados</div>
                            ) : (
                                orders.map(order => (
                                    <div key={order.id} className="row-item-modern">
                                        <div className="col-id font-mono font-black text-white opacity-70">
                                            #{String(order.id).padStart(5, '0')}
                                        </div>
                                        <div className="col-cust">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-white text-sm">{order.user?.name || 'Invitado'}</span>
                                                <span className="text-[10px] text-slate-500 font-bold uppercase">{order.user?.email || 'Venta Local'}</span>
                                            </div>
                                        </div>
                                        <div className="col-date text-xs font-bold text-slate-400">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </div>
                                        <div className="col-total text-right font-black text-white">
                                            S/ {order.total?.toFixed(2) || '0.00'}
                                        </div>
                                        <div className="col-status">
                                            <span className="status-pill" style={{
                                                '--status-color': statusColor(order.status)
                                            } as any}>
                                                {statusLabel(order.status)}
                                            </span>
                                        </div>
                                        <div className="col-actions flex justify-end gap-1.5">
                                            <button className="btn-mini" onClick={() => onViewDetail(order)} title="Ver Detalle"><Eye size={14} /></button>
                                            <button className="btn-mini" onClick={() => onUpdateStatus(order.id, 'EN_PROCESO')} title="En Proceso"><Truck size={14} /></button>
                                            <button className="btn-mini" onClick={() => onUpdateStatus(order.id, 'ENTREGADO')} title="Entregado"><Clock size={14} /></button>
                                            <button className="btn-mini del" onClick={() => onUpdateStatus(order.id, 'CANCELADO')} title="Cancelar"><MoreVertical size={14} /></button>
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
                
                .header-filters-modern { display: flex; gap: 8px; align-items: center; }
                .filter-chip {
                    padding: 6px 14px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.05);
                    background: rgba(255,255,255,0.02); color: #64748b; font-size: 11px; font-weight: 800;
                    cursor: pointer; transition: 0.3s; text-transform: uppercase;
                }
                .filter-chip.active { background: white; color: #0f172a; border-color: white; }
                
                .search-mini {
                    display: flex; align-items: center; gap: 8px; padding: 6px 12px;
                    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05);
                    border-radius: 10px; color: #475569; margin-left: 10px;
                }
                .search-mini input {
                    background: none; border: none; outline: none; color: white; font-size: 11px; font-weight: 600; width: 100px;
                }

                .table-responsive { width: 100%; overflow-x: auto; }
                .orders-table-modern { min-width: 900px; }
                
                .table-head {
                    display: grid; grid-template-columns: 0.8fr 2fr 1fr 1fr 1.2fr 1.5fr;
                    padding: 12px 10px; border-bottom: 2px solid rgba(255,255,255,0.05);
                    font-size: 11px; font-weight: 950; color: #475569; text-transform: uppercase;
                }
                
                .row-item-modern {
                    display: grid; grid-template-columns: 0.8fr 2fr 1fr 1fr 1.2fr 1.5fr;
                    padding: 16px 10px; border-bottom: 1px solid rgba(255,255,255,0.02);
                    align-items: center; transition: 0.2s;
                }
                .row-item-modern:hover { background: rgba(255,255,255,0.02); }

                .status-pill {
                    padding: 4px 10px; border-radius: 8px; font-size: 10px; font-weight: 950;
                    text-transform: uppercase; letter-spacing: 0.05em;
                    background: color-mix(in srgb, var(--status-color), transparent 90%);
                    color: var(--status-color);
                    border: 1px solid color-mix(in srgb, var(--status-color), transparent 80%);
                }

                .btn-mini {
                    width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center;
                    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); color: #64748b; cursor: pointer; transition: 0.2s;
                }
                .btn-mini:hover { background: rgba(255,255,255,0.1); color: white; }
                .btn-mini.del:hover { color: #f87171; border-color: #f87171; background: rgba(248, 113, 113, 0.1); }

                .text-right { text-align: right; }
                .empty-state { padding: 40px; text-align: center; color: #475569; font-weight: 700; width: 100%; }
            `}</style>
        </div>
    );
}
