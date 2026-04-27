'use client';
import React from 'react';
import {
    DollarSign,
    ShoppingBag,
    Users,
    Package,
    TrendingUp,
    Clock,
    RefreshCw,
    Circle,
    ArrowUpRight,
    ArrowDownRight
} from 'lucide-react';
import AdminCard from './AdminCard';

interface AdminDashboardProps {
    stats: any;
    maxSale: number;
    statusColor: (status: string) => string;
    statusLabel: (status: string) => string;
    onRefresh: () => void;
    refreshing: boolean;
}

export default function AdminDashboard({
    stats,
    maxSale,
    statusColor,
    statusLabel,
    onRefresh,
    refreshing
}: AdminDashboardProps) {
    return (
        <div className="dashboard-view-container">
            {/* Stats Overview */}
            <div className="stats-grid-modern">
                <div className="stat-card-deep">
                    <div className="stat-header">
                        <div className="icon-box v-bg"><DollarSign size={20} /></div>
                        <span className="label">Ventas Totales</span>
                    </div>
                    <div className="stat-value">S/ {(stats?.totalRevenue || 0).toLocaleString()}</div>
                    <div className="stat-footer-alt">
                        <span className={`trend ${stats?.revenueTrend >= 0 ? 'pos' : 'neg'}`}>
                            {stats?.revenueTrend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            {stats?.revenueTrend !== undefined ? `${Number(stats.revenueTrend).toFixed(1)}%` : '0%'}
                        </span>
                        <span className="period">crecimiento mensual</span>
                    </div>
                </div>

                <div className="stat-card-deep">
                    <div className="stat-header">
                        <div className="icon-box p-bg"><ShoppingBag size={20} /></div>
                        <span className="label">Pedidos Activos</span>
                    </div>
                    <div className="stat-value">{stats?.totalOrders || 0}</div>
                    <div className="stat-footer-alt">
                        <span className="trend pos">
                            {stats?.recentOrders?.filter((o: any) => {
                                const d = new Date(o.createdAt);
                                const today = new Date();
                                return d.getDate() === today.getDate() && d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear();
                            }).length || 0} hoy
                        </span>
                        <span className="period">Nuevos ingresos</span>
                    </div>
                </div>

                <div className="stat-card-deep">
                    <div className="stat-header">
                        <div className="icon-box b-bg"><Users size={20} /></div>
                        <span className="label">Clientes</span>
                    </div>
                    <div className="stat-value">{stats?.totalUsers || 0}</div>
                    <div className="stat-footer-alt">
                        <span className="trend pos">
                            +{stats?.recentOrders?.length || 0}
                        </span>
                        <span className="period">Usuarios registrados</span>
                    </div>
                </div>

                <div className="stat-card-deep">
                    <div className="stat-header">
                        <div className="icon-box o-bg"><Package size={20} /></div>
                        <span className="label">Inventario</span>
                    </div>
                    <div className="stat-value">{stats?.totalProducts || 0}</div>
                    <div className="stat-footer-alt">
                        <span className="trend neg"><ArrowDownRight size={14} /> {stats?.lowStock.length || 0} bajo stock</span>
                        <span className="period">Alertas de stock</span>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid-content">
                {/* Sales Chart */}
                <AdminCard
                    title="Rendimiento de Ventas"
                    description="Ventas brutas mensuales del presente año."
                    actions={<button className="period-btn-alt">{new Date().getFullYear()}</button>}
                >
                    <div className="chart-container-modern">
                        <div className="chart-bars">
                            {stats?.monthlySales.map((m: any, i: number) => (
                                <div key={i} className="bar-col">
                                    <div className="bar-track">
                                        <div
                                            className="bar-fill"
                                            style={{ height: `${Math.max((m.total / maxSale) * 100, 8)}%` }}
                                        >
                                            <div className="bar-value">S/ {Number(m.total).toFixed(0)}</div>
                                        </div>
                                    </div>
                                    <span className="bar-label">{m.month.substring(0, 3)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </AdminCard>

                {/* Recent Activity */}
                <AdminCard
                    title="Pedidos Recientes"
                    description="Últimos movimientos registrados en tienda."
                    actions={<button className="text-btn">Ver Detalle</button>}
                >
                    <div className="activity-list">
                        {stats?.recentOrders.length === 0 ? (
                            <div className="empty-state">Sin actividad reciente</div>
                        ) : (
                            stats?.recentOrders.slice(0, 5).map((order: any) => (
                                <div key={order.id} className="activity-item">
                                    <div className="item-avatar">{order.user?.name?.charAt(0) || 'U'}</div>
                                    <div className="item-info">
                                        <span className="name">{order.user?.name || 'Cliente Externo'}</span>
                                        <span className="meta">{new Date(order.createdAt).toLocaleDateString()} • #{order.id}</span>
                                    </div>
                                    <div className="item-amount">
                                        <span className="price">S/ {Number(order.total).toFixed(2)}</span>
                                        <span className="status-mini" style={{ color: statusColor(order.status) } as any}>
                                            {statusLabel(order.status)}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </AdminCard>
            </div>

            <style jsx>{`
                .dashboard-view-container { display: flex; flex-direction: column; gap: 30px; }

                .stats-grid-modern {
                    display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px;
                }
                .stat-card-deep {
                    background: #fff;
                    border: 1px solid #f1f5f9;
                    border-radius: 24px; padding: 25px;
                    display: flex; flex-direction: column; gap: 12px;
                    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.03);
                    transition: 0.3s;
                }
                .stat-card-deep:hover { transform: translateY(-3px); box-shadow: 0 20px 40px -15px rgba(0,0,0,0.06); }

                .stat-header { display: flex; align-items: center; gap: 12px; }
                .icon-box {
                    width: 40px; height: 40px; border-radius: 12px;
                    display: flex; align-items: center; justify-content: center;
                    font-weight: 800;
                }
                .v-bg { background: #f5f3ff; color: #8b5cf6; }
                .p-bg { background: #fdf2f8; color: #ec4899; }
                .b-bg { background: #eff6ff; color: #3b82f6; }
                .o-bg { background: #fffbeb; color: #f59e0b; }

                .label { font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em; }
                .stat-value { font-size: 28px; font-weight: 900; color: #1e293b; letter-spacing: -1px; line-height: 1; }
                .stat-footer-alt { display: flex; align-items: center; justify-content: space-between; margin-top: 5px; }
                .trend { font-size: 11px; font-weight: 800; display: flex; align-items: center; gap: 4px; }
                .trend.pos { color: #10b981; }
                .trend.neg { color: #f43f5e; }
                .period { font-size: 11px; font-weight: 600; color: #94a3b8; }

                .dashboard-grid-content { display: grid; grid-template-columns: 1.6fr 1fr; gap: 30px; }
                
                .period-btn-alt {
                    background: #f1f5f9; color: #64748b; border: none; padding: 6px 14px;
                    border-radius: 10px; font-size: 11px; font-weight: 800;
                }
                .text-btn { background: none; border: none; color: #ec4899; font-size: 12px; font-weight: 800; cursor: pointer; }

                .chart-container-modern { height: 280px; margin-top: 15px; }
                .chart-bars { display: flex; gap: 15px; height: 100%; align-items: flex-end; }
                .bar-col { flex: 1; display: flex; flex-direction: column; gap: 15px; align-items: center; }
                .bar-track { width: 100%; height: 220px; display: flex; align-items: flex-end; justify-content: center; }
                .bar-fill {
                    width: 100%; max-width: 40px; border-radius: 100px;
                    background: linear-gradient(180deg, #ec4899 0%, #f472b6 100%);
                    position: relative; transition: 1s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .bar-fill:hover { transform: scaleX(1.1); filter: brightness(1.1); }
                .bar-value {
                    position: absolute; top: -30px; left: 50%; transform: translateX(-50%);
                    font-size: 10px; font-weight: 900; opacity: 0; transition: 0.3s; color: #1e293b; white-space: nowrap;
                }
                .bar-fill:hover .bar-value { opacity: 1; top: -35px; }
                .bar-label { font-size: 11px; font-weight: 800; color: #94a3b8; text-transform: uppercase; }

                .activity-list { display: flex; flex-direction: column; gap: 15px; }
                .activity-item {
                    display: flex; align-items: center; gap: 15px; padding: 15px;
                    background: #f8fafc; border-radius: 18px; border: 1px solid #f1f5f9;
                    transition: 0.2s;
                }
                .activity-item:hover { transform: translateX(5px); background: #fdf2f8; border-color: #fce7f3; }

                .item-avatar {
                    width: 42px; height: 42px; border-radius: 14px; background: #fff;
                    display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 15px;
                    color: #ec4899; border: 1px solid #f1f5f9;
                }
                .item-info { flex: 1; display: flex; flex-direction: column; }
                .item-info .name { font-size: 14px; font-weight: 800; color: #1e293b; }
                .item-info .meta { font-size: 12px; font-weight: 600; color: #94a3b8; }
                .item-amount { display: flex; flex-direction: column; align-items: flex-end; }
                .item-amount .price { font-size: 15px; font-weight: 900; color: #1e293b; }
                .status-mini { font-size: 10px; font-weight: 900; text-transform: uppercase; }
                .empty-state { padding: 40px; text-align: center; color: #94a3b8; font-weight: 600; font-style: italic; }

                @media (max-width: 1300px) {
                    .stats-grid-modern { grid-template-columns: repeat(2, 1fr); }
                    .dashboard-grid-content { grid-template-columns: 1fr; }
                }
                @media (max-width: 480px) {
                    .stats-grid-modern { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
}
