'use client';
import React from 'react';
import { ShoppingBag, Clock, MoreVertical, Eye, Download, Truck } from 'lucide-react';

interface AdminOrdersProps {
    orders: any[];
    statusColor: (status: string) => string;
    statusLabel: (status: string) => string;
}

export default function AdminOrders({ orders, statusColor, statusLabel }: AdminOrdersProps) {
    return (
        <div className="orders-section">
            <div className="section-header">
                <h2>Gestión de Pedidos</h2>
                <div className="header-filters">
                    <button className="pill-btn active">Todos</button>
                    <button className="pill-btn">Pendientes</button>
                    <button className="pill-btn">Enviados</button>
                    <button className="pill-btn">Completados</button>
                </div>
            </div>

            <div className="orders-grid">
                <div className="orders-table-wrapper glass-premium">
                    <div className="orders-table-header">
                        <span>ID Pedido</span>
                        <span>Cliente</span>
                        <span>Fecha</span>
                        <span>Total</span>
                        <span>Estado</span>
                        <span>Acciones</span>
                    </div>
                    <div className="orders-table-body">
                        {orders.length === 0 ? (
                            <div className="empty-orders">No hay pedidos registrados aún.</div>
                        ) : (
                            orders.map(order => (
                                <div key={order.id} className="order-row-mod">
                                    <span className="order-id-mod">#{order.id.substring(0, 8)}</span>
                                    <div className="order-customer-mod">
                                        <span className="cust-name">{order.user?.name || 'Invitado'}</span>
                                        <span className="cust-email">{order.user?.email}</span>
                                    </div>
                                    <span className="order-date-mod">{new Date(order.createdAt).toLocaleDateString()}</span>
                                    <span className="order-total-mod">S/ {order.total.toFixed(2)}</span>
                                    <div>
                                        <span className="status-badge" style={{
                                            backgroundColor: `${statusColor(order.status)}15`,
                                            color: statusColor(order.status)
                                        }}>
                                            {statusLabel(order.status)}
                                        </span>
                                    </div>
                                    <div className="order-actions-mod">
                                        <button title="Ver Detalle" className="action-btn-circle"><Eye size={16} /></button>
                                        <button title="Generar Ticket" className="action-btn-circle"><Download size={16} /></button>
                                        <button title="Marcar como Enviado" className="action-btn-circle"><Truck size={16} /></button>
                                        <button className="action-btn-circle"><MoreVertical size={16} /></button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .orders-section { display: flex; flex-direction: column; gap: 28px; animation: slideUp 0.6s; }
                .section-header { display: flex; justify-content: space-between; align-items: center; }
                .section-header h2 { font-size: 24px; font-weight: 900; letter-spacing: -0.5px; }
                
                .header-filters { display: flex; gap: 10px; background: rgba(0,0,0,0.03); padding: 5px; border-radius: 14px; }
                .pill-btn {
                    padding: 8px 16px; border: none; border-radius: 10px; background: transparent;
                    color: #64748b; font-weight: 700; font-size: 13px; cursor: pointer; transition: 0.3s;
                }
                .pill-btn.active { background: white; color: #0f172a; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }

                .orders-table-wrapper { background: white; border-radius: 24px; overflow: hidden; border: 1px solid rgba(0,0,0,0.05); }
                .orders-table-header {
                    display: grid; grid-template-columns: 1fr 2fr 1fr 1fr 1fr 1.5fr; padding: 20px 28px;
                    background: #f8fafc; border-bottom: 2px solid rgba(0,0,0,0.02);
                    font-size: 11px; font-weight: 900; color: #94a3b8; text-transform: uppercase;
                }
                .order-row-mod {
                    display: grid; grid-template-columns: 1fr 2fr 1fr 1fr 1fr 1.5fr; padding: 20px 28px;
                    align-items: center; border-bottom: 1px solid rgba(0,0,0,0.02); transition: 0.3s;
                }
                .order-row-mod:hover { background: #f8fafc; }
                
                .order-id-mod { font-family: monospace; font-weight: 800; color: #64748b; }
                .order-customer-mod { display: flex; flex-direction: column; }
                .cust-name { font-weight: 800; font-size: 15px; color: #0f172a; }
                .cust-email { font-size: 12px; color: #94a3b8; font-weight: 600; }
                .order-date-mod { font-weight: 700; color: #64748b; font-size: 14px; }
                .order-total-mod { font-weight: 900; color: #0f172a; font-size: 15px; }

                .status-badge { 
                    padding: 6px 12px; border-radius: 10px; font-size: 11px; font-weight: 800; 
                    text-transform: uppercase; letter-spacing: 0.5px;
                }

                .order-actions-mod { display: flex; gap: 8px; }
                .action-btn-circle {
                    width: 34px; height: 34px; border-radius: 50%; border: 1px solid #e2e8f0;
                    display: flex; align-items: center; justify-content: center; background: white;
                    color: #64748b; cursor: pointer; transition: 0.3s;
                }
                .action-btn-circle:hover { border-color: #0f172a; color: #0f172a; transform: scale(1.1); }

                .empty-orders { padding: 80px; text-align: center; color: #94a3b8; font-weight: 700; }

                @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
}
