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
    Circle
} from 'lucide-react';

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
            {/* Welcome Header */}
            <div className="welcome-banner animate-fade-in">
                <div className="welcome-text">
                    <div className="flex items-center gap-3">
                        <h2>Vista General del Negocio</h2>
                        <div className="live-indicator">
                            <Circle size={8} fill="#22c55e" className="text-green-500 animate-pulse" />
                            <span>En Vivo</span>
                        </div>
                    </div>
                    <p>Monitorea tus ventas, clientes e inventario en tiempo real.</p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        className={`refresh-btn glass-premium ${refreshing ? 'spinning' : ''}`}
                        onClick={onRefresh}
                        disabled={refreshing}
                    >
                        <RefreshCw size={18} />
                        <span>{refreshing ? 'Sincronizando...' : 'Refrescar'}</span>
                    </button>
                    <div className="last-sync">
                        <Clock size={14} /> Actualizado: {new Date().toLocaleTimeString()}
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="stats-grid">
                <div className="stat-card glass-premium p-violet animate-slide-up" style={{ animationDelay: '0s' }}>
                    <div className="stat-content">
                        <div className="stat-main">
                            <span className="stat-label">Ingresos Totales</span>
                            <span className="stat-value">S/ {(stats?.totalRevenue || 0).toLocaleString()}</span>
                        </div>
                        <div className="stat-icon-wrapper">
                            <DollarSign size={24} />
                        </div>
                    </div>
                    <div className="stat-footer">
                        <span className="trend positive">+12.5% vs mes anterior</span>
                    </div>
                </div>

                <div className="stat-card glass-premium p-pink animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <div className="stat-content">
                        <div className="stat-main">
                            <span className="stat-label">Pedidos Realizados</span>
                            <span className="stat-value">{stats?.totalOrders || 0}</span>
                        </div>
                        <div className="stat-icon-wrapper">
                            <ShoppingBag size={24} />
                        </div>
                    </div>
                    <div className="stat-footer">
                        <span className="trend positive">+5 nuevos pedidos hoy</span>
                    </div>
                </div>

                <div className="stat-card glass-premium p-blue animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <div className="stat-content">
                        <div className="stat-main">
                            <span className="stat-label">Clientes Registrados</span>
                            <span className="stat-value">{stats?.totalUsers || 0}</span>
                        </div>
                        <div className="stat-icon-wrapper">
                            <Users size={24} />
                        </div>
                    </div>
                    <div className="stat-footer">
                        <span className="trend">Crecimiento orgánico</span>
                    </div>
                </div>

                <div className="stat-card glass-premium p-orange animate-slide-up" style={{ animationDelay: '0.3s' }}>
                    <div className="stat-content">
                        <div className="stat-main">
                            <span className="stat-label">Stock de Productos</span>
                            <span className="stat-value">{stats?.totalProducts || 0}</span>
                        </div>
                        <div className="stat-icon-wrapper">
                            <Package size={24} />
                        </div>
                    </div>
                    <div className="stat-footer">
                        <span className="trend negative">{stats?.lowStock.length || 0} con stock bajo</span>
                    </div>
                </div>
            </div>

            <div className="dashboard-main-grid">
                {/* Sales Chart */}
                <div className="chart-card glass-premium animate-fade-in" style={{ animationDelay: '0.4s' }}>
                    <div className="card-header">
                        <h3><TrendingUp size={18} /> Ventas Mensuales</h3>
                        <div className="card-actions">
                            <button className="period-btn active">Año Actual</button>
                        </div>
                    </div>
                    <div className="chart-container">
                        <div className="chart-body">
                            {stats?.monthlySales.map((m: any, i: number) => (
                                <div key={i} className="chart-column">
                                    <div className="bar-wrapper">
                                        <div
                                            className="bar"
                                            style={{ height: `${Math.max((m.total / maxSale) * 100, 8)}%` }}
                                        >
                                            <span className="bar-tooltip">S/ {m.total.toFixed(0)}</span>
                                        </div>
                                    </div>
                                    <span className="chart-label">{m.month.substring(0, 3)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="orders-card glass-premium animate-fade-in" style={{ animationDelay: '0.5s' }}>
                    <div className="card-header">
                        <h3><Clock size={18} /> Historial Reciente</h3>
                        <button className="view-all-btn">Ver todo</button>
                    </div>
                    <div className="orders-list">
                        {stats?.recentOrders.length === 0 ? (
                            <div className="empty-state">
                                <ShoppingBag size={40} />
                                <p>No hay pedidos recientes</p>
                            </div>
                        ) : (
                            stats?.recentOrders.slice(0, 6).map((order: any) => (
                                <div key={order.id} className="order-item">
                                    <div className="order-user-info">
                                        <div className="order-avatar">
                                            {(order.user?.name || 'C').charAt(0)}
                                        </div>
                                        <div className="order-details">
                                            <span className="order-name">{order.user?.name || order.user?.email}</span>
                                            <span className="order-time">{new Date(order.createdAt).toLocaleDateString()}</span>
                                        </div>
                                    </div>
                                    <div className="order-meta">
                                        <span className="order-amount">S/ {order.total.toFixed(2)}</span>
                                        <span className="order-badge" style={{
                                            backgroundColor: `${statusColor(order.status)}15`,
                                            color: statusColor(order.status)
                                        }}>
                                            {statusLabel(order.status)}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .dashboard-view-container { display: flex; flex-direction: column; gap: 32px; }

                .welcome-banner { display: flex; justify-content: space-between; align-items: center; }
                .welcome-text h2 { font-size: 28px; font-weight: 900; letter-spacing: -0.5px; margin: 0; color: #f8fafc; }
                .welcome-text p { color: #94a3b8; font-weight: 500; margin-top: 4px; }
                
                .live-indicator { 
                    display: flex; align-items: center; gap: 6px; 
                    background: rgba(34,197,94,0.1); color: #22c55e; 
                    padding: 4px 10px; border-radius: 20px;
                    font-size: 11px; font-weight: 800; text-transform: uppercase;
                }

                .refresh-btn { 
                    display: flex; align-items: center; gap: 10px; 
                    padding: 10px 20px; border-radius: 14px;
                    font-weight: 800; font-size: 14px; cursor: pointer; transition: 0.3s;
                    border: 1px solid rgba(255,255,255,0.05);
                    background: rgba(255,255,255,0.05);
                    color: white;
                }
                .refresh-btn:hover:not(:disabled) { transform: translateY(-2px); background: rgba(255,255,255,0.1); }
                .refresh-btn.spinning svg { animation: spin 1s linear infinite; }
                .refresh-btn:disabled { opacity: 0.6; cursor: not-allowed; }

                .last-sync { font-size: 12px; font-weight: 700; color: #64748b; display: flex; align-items: center; gap: 6px; }

                .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; }
                
                .stat-card {
                    padding: 24px; border-radius: 24px; display: flex; flex-direction: column;
                    gap: 16px; border: 1px solid rgba(255, 255, 255, 0.05);
                    transition: all 0.4s; position: relative; overflow: hidden;
                }
                .stat-card:hover { transform: translateY(-5px); box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2); }
                
                .stat-content { display: flex; justify-content: space-between; align-items: center; }
                .stat-main { display: flex; flex-direction: column; gap: 4px; }
                .stat-label { font-size: 14px; font-weight: 700; color: rgba(255,255,255,0.7); }
                .stat-value { font-size: 28px; font-weight: 900; color: white; letter-spacing: -1px; }
                
                .stat-icon-wrapper {
                    width: 54px; height: 54px; border-radius: 16px; background: rgba(255, 255, 255, 0.15);
                    display: flex; align-items: center; justify-content: center; color: white;
                }
                
                .stat-footer { font-size: 12px; font-weight: 700; color: rgba(255,255,255,0.8); }
                .trend.positive { color: #86efac; }
                .trend.negative { color: #fca5a5; }

                .p-violet { background: linear-gradient(135deg, #6d28d9 0%, #4c1d95 100%); }
                .p-pink { background: linear-gradient(135deg, #be123c 0%, #881337 100%); }
                .p-blue { background: linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%); }
                .p-orange { background: linear-gradient(135deg, #b45309 0%, #78350f 100%); }

                .dashboard-main-grid { display: grid; grid-template-columns: 1.4fr 1fr; gap: 24px; }

                .glass-premium {
                    background: rgba(255, 255, 255, 0.03); backdrop-filter: blur(10px);
                    border: 1px solid rgba(255, 255, 255, 0.05); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                    border-radius: 24px; padding: 28px;
                    color: white;
                }

                .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 28px; }
                .card-header h3 { display: flex; align-items: center; gap: 10px; font-size: 18px; font-weight: 800; color: #f1f5f9; }
                
                .period-btn { 
                    padding: 6px 14px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1);
                    background: rgba(255,255,255,0.05); font-size: 12px; font-weight: 700; cursor: pointer; color: #94a3b8;
                }
                .period-btn.active { background: white; color: #0f172a; border-color: white; }

                .chart-container { height: 260px; display: flex; align-items: flex-end; }
                .chart-body { display: flex; gap: 16px; width: 100%; height: 100%; align-items: flex-end; }
                .chart-column { flex: 1; display: flex; flex-direction: column; gap: 12px; align-items: center; }
                .bar-wrapper { width: 100%; height: 200px; display: flex; align-items: flex-end; justify-content: center; }
                .bar { 
                    width: 100%; max-width: 40px; border-radius: 12px 12px 4px 4px; 
                    background: linear-gradient(180deg, #334155 0%, #1e293b 100%);
                    position: relative; transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .bar:hover { filter: brightness(1.5); transform: scaleX(1.1); cursor: pointer; }
                .bar-tooltip {
                    position: absolute; top: -35px; left: 50%; transform: translateX(-50%);
                    background: white; color: #0f172a; padding: 4px 10px; border-radius: 8px;
                    font-size: 10px; font-weight: 900; opacity: 0; transition: 0.3s;
                    white-space: nowrap; pointer-events: none;
                }
                .bar:hover .bar-tooltip { opacity: 1; top: -45px; }
                .chart-label { font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; }

                .orders-list { display: flex; flex-direction: column; gap: 14px; }
                .order-item {
                    display: flex; justify-content: space-between; align-items: center;
                    padding: 16px; background: rgba(255,255,255,0.02); border-radius: 18px;
                    border: 1px solid rgba(255,255,255,0.05); transition: 0.3s;
                }
                .order-item:hover { background: rgba(255,255,255,0.05); transform: scale(1.02); }
                .order-avatar {
                    width: 42px; height: 42px; border-radius: 12px; background: rgba(255,255,255,0.05);
                    display: flex; align-items: center; justify-content: center;
                    font-weight: 800; color: white; font-size: 14px;
                }
                .order-name { font-weight: 800; font-size: 15px; color: #f1f5f9; }
                .order-time { font-size: 12px; color: #64748b; font-weight: 600; }
                .order-amount { font-weight: 900; font-size: 15px; color: #f1f5f9; }
                
                .view-all-btn { 
                    background: transparent; border: none; color: #a78bfa; 
                    font-weight: 800; font-size: 13px; cursor: pointer;
                }
                .empty-state { text-align: center; padding: 40px; color: #94a3b8; }

                @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
                @keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }
                
                .animate-slide-up { animation: slideUp 0.6s backwards; }
                .animate-fade-in { animation: fadeIn 0.8s; }
                .animate-pulse { animation: pulse 2s infinite; }
                @keyframes pulse { 0% { opacity: 1; transform: scale(1); } 50% { opacity: 0.5; transform: scale(1.2); } 100% { opacity: 1; transform: scale(1); } }

                @media (max-width: 1200px) {
                    .stats-grid { grid-template-columns: repeat(2, 1fr); }
                    .dashboard-main-grid { grid-template-columns: 1fr; }
                }
                @media (max-width: 600px) {
                    .stats-grid { grid-template-columns: 1fr; }
                    .welcome-banner { flex-direction: column; align-items: flex-start; gap: 20px; }
                }
            `}</style>
        </div>
    );
}
