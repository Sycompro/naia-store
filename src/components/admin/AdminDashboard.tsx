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
                <div className="stat-card-deep glass-accent-v">
                    <div className="stat-header">
                        <div className="icon-box"><DollarSign size={20} /></div>
                        <span className="label">Ventas Totales</span>
                    </div>
                    <div className="stat-value">S/ {(stats?.totalRevenue || 0).toLocaleString()}</div>
                    <div className="stat-footer-alt">
                        <span className={`trend ${stats?.revenueTrend >= 0 ? 'pos' : 'neg'}`}>
                            {stats?.revenueTrend >= 0 ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                            {stats?.revenueTrend !== undefined ? `${stats.revenueTrend.toFixed(1)}%` : '0%'}
                        </span>
                        <span className="period">vs mes anterior</span>
                    </div>
                </div>

                <div className="stat-card-deep glass-accent-p">
                    <div className="stat-header">
                        <div className="icon-box"><ShoppingBag size={20} /></div>
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
                        <span className="period">Pedidos nuevos</span>
                    </div>
                </div>

                <div className="stat-card-deep glass-accent-b">
                    <div className="stat-header">
                        <div className="icon-box"><Users size={20} /></div>
                        <span className="label">Clientes</span>
                    </div>
                    <div className="stat-value">{stats?.totalUsers || 0}</div>
                    <div className="stat-footer-alt">
                        <span className="trend pos">
                            +{stats?.recentOrders?.length || 0}
                        </span>
                        <span className="period">Recientes</span>
                    </div>
                </div>

                <div className="stat-card-deep glass-accent-o">
                    <div className="stat-header">
                        <div className="icon-box"><Package size={20} /></div>
                        <span className="label">Inventario</span>
                    </div>
                    <div className="stat-value">{stats?.totalProducts || 0}</div>
                    <div className="stat-footer-alt">
                        <span className="trend neg"><ArrowDownRight size={14} /> {stats?.lowStock.length || 0} bajo stock</span>
                        <span className="period">Alertas</span>
                    </div>
                </div>
            </div>

            <div className="dashboard-grid-content">
                {/* Sales Chart */}
                <AdminCard
                    title="Ventas Mensuales"
                    description="Rendimiento comercial del periodo actual."
                    actions={<button className="period-btn-alt">Año {new Date().getFullYear()}</button>}
                >
                    <div className="chart-container-modern">
                        <div className="chart-bars">
                            {stats?.monthlySales.map((m: any, i: number) => (
                                <div key={i} className="bar-col">
                                    <div className="bar-track">
                                        <div
                                            className="bar-fill shadow-premium"
                                            style={{ height: `${Math.max((m.total / maxSale) * 100, 5)}%` }}
                                        >
                                            <div className="bar-value">S/ {m.total.toFixed(0)}</div>
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
                    title="Actividad Reciente"
                    description="Últimos pedidos realizados por tus clientes."
                    actions={<button className="text-btn">Ver todo</button>}
                >
                    <div className="activity-list">
                        {stats?.recentOrders.length === 0 ? (
                            <div className="empty-state">No hay pedidos registrados</div>
                        ) : (
                            stats?.recentOrders.slice(0, 5).map((order: any) => (
                                <div key={order.id} className="activity-item">
                                    <div className="item-avatar">{order.user?.name?.charAt(0) || 'U'}</div>
                                    <div className="item-info">
                                        <span className="name">{order.user?.name || 'Cliente Externo'}</span>
                                        <span className="meta">{new Date(order.createdAt).toLocaleDateString()} • Pedido #{order.id}</span>
                                    </div>
                                    <div className="item-amount">
                                        <span className="price">S/ {Number(order.total).toFixed(2)}</span>
                                        <span className="status-mini" style={{ '--sc': statusColor(order.status) } as any}>
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
                .dashboard-view-container { display: flex; flex-direction: column; gap: 20px; }

                .stats-grid-modern {
                    display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;
                }
                .stat-card-deep {
                    background: rgba(15, 23, 42, 0.4);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 16px; padding: 16px;
                    display: flex; flex-direction: column; gap: 8px;
                    position: relative; overflow: hidden;
                    transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .stat-card-deep:hover { transform: translateY(-5px); background: rgba(15, 23, 42, 0.6); }

                .stat-header { display: flex; align-items: center; gap: 12px; }
                .icon-box {
                    width: 32px; height: 32px; border-radius: 10px;
                    background: rgba(255, 255, 255, 0.03);
                    display: flex; align-items: center; justify-content: center;
                    color: white; border: 1px solid rgba(255, 255, 255, 0.05);
                }
                .label { font-size: 11px; font-weight: 800; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; }
                .stat-value { font-size: 1.5rem; font-weight: 950; color: white; letter-spacing: -0.03em; line-height: 1; }
                .stat-footer-alt { display: flex; align-items: center; justify-content: space-between; margin-top: 5px; }
                .trend { font-size: 11px; font-weight: 950; display: flex; align-items: center; gap: 4px; }
                .trend.pos { color: #10b981; }
                .trend.neg { color: #f43f5e; }
                .period { font-size: 11px; font-weight: 700; color: #334155; }

                .glass-accent-v::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 3px; background: #8b5cf6; }
                .glass-accent-p::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 3px; background: #ec4899; }
                .glass-accent-b::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 3px; background: #3b82f6; }
                .glass-accent-o::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 3px; background: #f59e0b; }

                .dashboard-grid-content { display: grid; grid-template-columns: 1.5fr 1fr; gap: 24px; }
                
                .period-btn-alt {
                    background: white; color: #0f172a; border: none; padding: 6px 12px;
                    border-radius: 8px; font-size: 10px; font-weight: 900;
                }
                .text-btn { background: none; border: none; color: #64748b; font-size: 11px; font-weight: 800; cursor: pointer; text-transform: uppercase; }

                .chart-container-modern { height: 260px; margin-top: 10px; }
                .chart-bars { display: flex; gap: 10px; height: 100%; align-items: flex-end; }
                .bar-col { flex: 1; display: flex; flex-direction: column; gap: 12px; align-items: center; }
                .bar-track { width: 100%; height: 200px; display: flex; align-items: flex-end; justify-content: center; }
                .bar-fill {
                    width: 100%; max-width: 45px; border-radius: 12px 12px 4px 4px;
                    background: linear-gradient(180deg, rgba(255,255,255,0.1), rgba(255,255,255,0.02));
                    border: 1px solid rgba(255,255,255,0.05); position: relative;
                    transition: height 1s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .bar-fill:hover { background: white; }
                .bar-value {
                    position: absolute; top: -30px; left: 50%; transform: translateX(-50%);
                    font-size: 10px; font-weight: 950; opacity: 0; transition: 0.3s; color: white;
                }
                .bar-fill:hover .bar-value { opacity: 1; top: -35px; }
                .bar-label { font-size: 11px; font-weight: 800; color: #475569; text-transform: uppercase; }

                .activity-list { display: flex; flex-direction: column; gap: 12px; }
                .activity-item {
                    display: flex; align-items: center; gap: 15px; padding: 12px;
                    background: rgba(255,255,255,0.02); border-radius: 16px; border: 1px solid rgba(255,255,255,0.03);
                    transition: 0.2s;
                }
                .activity-item:hover { background: rgba(255,255,255,0.05); }

                .item-avatar {
                    width: 38px; height: 38px; border-radius: 10px; background: rgba(255,255,255,0.05);
                    display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 14px;
                }
                .item-info { flex: 1; display: flex; flex-direction: column; }
                .item-info .name { font-size: 14px; font-weight: 800; color: white; }
                .item-info .meta { font-size: 11px; font-weight: 700; color: #475569; }
                .item-amount { display: flex; flex-direction: column; align-items: flex-end; }
                .item-amount .price { font-size: 14px; font-weight: 900; color: white; }
                .status-mini { font-size: 9px; font-weight: 950; text-transform: uppercase; color: var(--sc); }

                @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

                .animate-slide-up { animation: slideUp 0.6s backwards; }
                .animate-fade-in { animation: fadeIn 0.8s; }

                @media (max-width: 1300px) {
                    .stats-grid-modern { grid-template-columns: repeat(2, 1fr); }
                    .dashboard-grid-content { grid-template-columns: 1fr; }
                }
                @media (max-width: 768px) {
                    .stats-grid-modern { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
}
