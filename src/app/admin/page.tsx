'use client';
import React, { useState, useEffect } from 'react';
import { Package, Users, TrendingUp, DollarSign, AlertTriangle, Clock, ChevronDown, ChevronUp, Search, ShoppingBag, BarChart3, Boxes } from 'lucide-react';

interface StatsData {
    totalProducts: number;
    totalUsers: number;
    totalOrders: number;
    totalRevenue: number;
    monthlySales: { month: string; total: number; count: number }[];
    lowStock: { id: number; name: string; stock: number; category: string }[];
    recentOrders: { id: number; total: number; status: string; createdAt: string; user: { name: string; email: string }; items: { name: string; quantity: number }[] }[];
    products: { id: number; name: string; stock: number; category: string; unitPrice: number; imageUrl: string }[];
}

export default function AdminPage() {
    const [stats, setStats] = useState<StatsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeView, setActiveView] = useState<'dashboard' | 'inventario'>('dashboard');
    const [searchTerm, setSearchTerm] = useState('');
    const [stockUpdates, setStockUpdates] = useState<Record<number, number>>({});
    const [savingStock, setSavingStock] = useState<number | null>(null);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/admin/stats');
            if (res.ok) {
                const data = await res.json();
                setStats(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const updateStock = async (productId: number, newStock: number) => {
        setSavingStock(productId);
        try {
            const res = await fetch('/api/products', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: productId, stock: newStock })
            });
            if (res.ok) {
                await fetchStats();
                setStockUpdates(prev => { const u = { ...prev }; delete u[productId]; return u; });
            }
        } catch (e) {
            console.error(e);
        } finally {
            setSavingStock(null);
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

    const maxSale = stats?.monthlySales ? Math.max(...stats.monthlySales.map(m => m.total), 1) : 1;

    const filteredProducts = stats?.products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const stockLevel = (stock: number) => {
        if (stock <= 0) return { label: 'Agotado', color: '#ef4444', bg: 'rgba(239,68,68,0.1)' };
        if (stock < 10) return { label: 'Bajo', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' };
        return { label: 'OK', color: '#10b981', bg: 'rgba(16,185,129,0.1)' };
    };

    if (loading) {
        return (
            <div className="loading-state">
                <div className="spinner" />
                <p>Cargando dashboard...</p>
                <style jsx>{`
                    .loading-state { display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 400px; gap: 16px; color: var(--slate-500); }
                    .spinner { width: 40px; height: 40px; border: 3px solid var(--glass-border); border-top-color: var(--primary); border-radius: 50%; animation: spin 0.8s linear infinite; }
                    @keyframes spin { to { transform: rotate(360deg); } }
                `}</style>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            {/* Navigation Tabs */}
            <div className="admin-tabs">
                <button className={`admin-tab ${activeView === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveView('dashboard')}>
                    <BarChart3 size={18} /> Dashboard
                </button>
                <button className={`admin-tab ${activeView === 'inventario' ? 'active' : ''}`} onClick={() => setActiveView('inventario')}>
                    <Boxes size={18} /> Inventario
                </button>
            </div>

            {activeView === 'dashboard' && (
                <>
                    {/* Stats Cards */}
                    <div className="stats-grid">
                        <div className="stat-card glass">
                            <div className="stat-icon" style={{ background: 'rgba(255,126,179,0.15)', color: '#FF7EB3' }}>
                                <Package size={22} />
                            </div>
                            <div className="stat-info">
                                <span className="stat-label">Productos</span>
                                <span className="stat-value">{stats?.totalProducts || 0}</span>
                            </div>
                        </div>
                        <div className="stat-card glass">
                            <div className="stat-icon" style={{ background: 'rgba(161,140,209,0.15)', color: '#a18cd1' }}>
                                <Users size={22} />
                            </div>
                            <div className="stat-info">
                                <span className="stat-label">Clientes</span>
                                <span className="stat-value">{stats?.totalUsers || 0}</span>
                            </div>
                        </div>
                        <div className="stat-card glass">
                            <div className="stat-icon" style={{ background: 'rgba(79,172,254,0.15)', color: '#4facfe' }}>
                                <ShoppingBag size={22} />
                            </div>
                            <div className="stat-info">
                                <span className="stat-label">Pedidos</span>
                                <span className="stat-value">{stats?.totalOrders || 0}</span>
                            </div>
                        </div>
                        <div className="stat-card glass">
                            <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.15)', color: '#10b981' }}>
                                <DollarSign size={22} />
                            </div>
                            <div className="stat-info">
                                <span className="stat-label">Ingresos</span>
                                <span className="stat-value">S/ {(stats?.totalRevenue || 0).toFixed(0)}</span>
                            </div>
                        </div>
                    </div>

                    <div className="dashboard-grid">
                        {/* Sales Chart */}
                        <div className="chart-card glass">
                            <h3><TrendingUp size={18} /> Ventas Mensuales</h3>
                            <div className="chart-body">
                                {stats?.monthlySales.map((m, i) => (
                                    <div key={i} className="chart-bar-wrapper">
                                        <div className="chart-bar-container">
                                            <div
                                                className="chart-bar"
                                                style={{ height: `${Math.max((m.total / maxSale) * 100, 4)}%` }}
                                            />
                                        </div>
                                        <span className="chart-label">{m.month}</span>
                                        <span className="chart-value">S/{m.total.toFixed(0)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Recent Orders */}
                        <div className="orders-card glass">
                            <h3><Clock size={18} /> Pedidos Recientes</h3>
                            <div className="orders-list">
                                {stats?.recentOrders.length === 0 ? (
                                    <p className="empty-text">Sin pedidos aún</p>
                                ) : (
                                    stats?.recentOrders.slice(0, 5).map(order => (
                                        <div key={order.id} className="order-row">
                                            <div className="order-row-info">
                                                <span className="order-row-name">{order.user?.name || order.user?.email}</span>
                                                <span className="order-row-items">{order.items?.length || 0} items</span>
                                            </div>
                                            <div className="order-row-right">
                                                <span className="order-row-total">S/ {order.total.toFixed(2)}</span>
                                                <span className="order-row-status" style={{ color: statusColor(order.status), borderColor: statusColor(order.status) }}>
                                                    {statusLabel(order.status)}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Low Stock Alerts */}
                    {stats && stats.lowStock.length > 0 && (
                        <div className="alert-card glass">
                            <h3><AlertTriangle size={18} color="#f59e0b" /> Alerta de Stock Bajo</h3>
                            <div className="alert-items">
                                {stats.lowStock.map(p => (
                                    <div key={p.id} className="alert-item">
                                        <span>{p.name}</span>
                                        <span className="alert-stock" style={{ color: p.stock <= 0 ? '#ef4444' : '#f59e0b' }}>
                                            {p.stock} unidades
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}

            {activeView === 'inventario' && (
                <div className="inventory-section">
                    <div className="inventory-header">
                        <div className="search-box glass">
                            <Search size={18} />
                            <input
                                placeholder="Buscar producto o categoría..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="inventory-summary">
                            <span className="inv-count">{filteredProducts.length} productos</span>
                        </div>
                    </div>

                    <div className="inventory-table glass">
                        <div className="table-header">
                            <span className="col-name">Producto</span>
                            <span className="col-category">Categoría</span>
                            <span className="col-price">Precio</span>
                            <span className="col-stock">Stock</span>
                            <span className="col-status">Estado</span>
                            <span className="col-actions">Ajustar</span>
                        </div>
                        {filteredProducts.map(product => {
                            const level = stockLevel(stockUpdates[product.id] !== undefined ? stockUpdates[product.id] : product.stock);
                            const currentStock = stockUpdates[product.id] !== undefined ? stockUpdates[product.id] : product.stock;
                            const hasChanged = stockUpdates[product.id] !== undefined;
                            return (
                                <div key={product.id} className="table-row">
                                    <span className="col-name product-name-cell">
                                        {product.imageUrl && <img src={product.imageUrl} alt="" className="product-thumb" />}
                                        {product.name}
                                    </span>
                                    <span className="col-category">{product.category}</span>
                                    <span className="col-price">S/ {product.unitPrice.toFixed(2)}</span>
                                    <span className="col-stock">
                                        <input
                                            type="number"
                                            className="stock-input"
                                            value={currentStock}
                                            min={0}
                                            onChange={(e) => setStockUpdates(prev => ({ ...prev, [product.id]: parseInt(e.target.value) || 0 }))}
                                        />
                                    </span>
                                    <span className="col-status">
                                        <span className="stock-badge" style={{ color: level.color, background: level.bg }}>
                                            {level.label}
                                        </span>
                                    </span>
                                    <span className="col-actions">
                                        <div className="action-btns">
                                            <button className="adj-btn" onClick={() => {
                                                const newVal = Math.max(0, currentStock - 1);
                                                setStockUpdates(prev => ({ ...prev, [product.id]: newVal }));
                                            }}><ChevronDown size={16} /></button>
                                            <button className="adj-btn" onClick={() => {
                                                setStockUpdates(prev => ({ ...prev, [product.id]: currentStock + 1 }));
                                            }}><ChevronUp size={16} /></button>
                                            {hasChanged && (
                                                <button
                                                    className="save-stock-btn"
                                                    onClick={() => updateStock(product.id, currentStock)}
                                                    disabled={savingStock === product.id}
                                                >
                                                    {savingStock === product.id ? '...' : '✓'}
                                                </button>
                                            )}
                                        </div>
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            <style jsx>{`
                .admin-dashboard { display: flex; flex-direction: column; gap: 24px; }

                .admin-tabs {
                    display: flex; gap: 8px; background: var(--glass); border-radius: 14px;
                    padding: 4px; border: 1px solid var(--glass-border);
                }
                .admin-tab {
                    flex: 1; padding: 10px 16px; border: none; border-radius: 10px;
                    background: transparent; cursor: pointer; font-weight: 700;
                    font-size: 14px; display: flex; align-items: center; justify-content: center;
                    gap: 8px; transition: all 0.3s; color: var(--slate-500); font-family: inherit;
                }
                .admin-tab.active { background: var(--primary); color: white; box-shadow: 0 4px 12px var(--primary-light); }

                .stats-grid {
                    display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;
                }
                .stat-card {
                    padding: 20px; border-radius: 18px; display: flex;
                    align-items: center; gap: 16px;
                }
                .stat-icon {
                    width: 48px; height: 48px; border-radius: 14px;
                    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
                }
                .stat-info { display: flex; flex-direction: column; }
                .stat-label { font-size: 13px; color: var(--slate-500); font-weight: 600; }
                .stat-value { font-size: 24px; font-weight: 900; color: var(--fg); }

                .dashboard-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 20px; }

                .chart-card, .orders-card, .alert-card { padding: 24px; border-radius: 20px; }
                .chart-card h3, .orders-card h3, .alert-card h3 {
                    display: flex; align-items: center; gap: 8px; font-size: 16px;
                    font-weight: 800; margin-bottom: 20px; color: var(--fg);
                }

                .chart-body {
                    display: flex; gap: 12px; align-items: flex-end; height: 180px;
                    padding-top: 10px;
                }
                .chart-bar-wrapper {
                    flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6px;
                }
                .chart-bar-container {
                    width: 100%; height: 140px; display: flex; align-items: flex-end;
                    justify-content: center;
                }
                .chart-bar {
                    width: 70%; border-radius: 8px 8px 2px 2px;
                    background: linear-gradient(180deg, var(--primary) 0%, var(--primary-dark, var(--primary)) 100%);
                    min-height: 4px; transition: height 0.5s ease;
                }
                .chart-label { font-size: 11px; font-weight: 700; color: var(--slate-500); }
                .chart-value { font-size: 10px; color: var(--primary); font-weight: 800; }

                .orders-list { display: flex; flex-direction: column; gap: 10px; }
                .order-row {
                    display: flex; justify-content: space-between; align-items: center;
                    padding: 12px; background: var(--bg); border-radius: 12px;
                }
                .order-row-info { display: flex; flex-direction: column; gap: 2px; }
                .order-row-name { font-weight: 700; font-size: 14px; color: var(--fg); }
                .order-row-items { font-size: 12px; color: var(--slate-500); }
                .order-row-right { display: flex; flex-direction: column; align-items: flex-end; gap: 4px; }
                .order-row-total { font-weight: 800; font-size: 14px; color: var(--fg); }
                .order-row-status {
                    font-size: 11px; font-weight: 700; padding: 2px 8px;
                    border-radius: 12px; border: 1px solid;
                }
                .empty-text { color: var(--slate-500); font-style: italic; text-align: center; padding: 20px; }

                .alert-card { border-left: 4px solid #f59e0b; }
                .alert-items { display: flex; flex-direction: column; gap: 10px; }
                .alert-item {
                    display: flex; justify-content: space-between; padding: 10px 12px;
                    background: var(--bg); border-radius: 10px; font-size: 14px; color: var(--fg);
                }
                .alert-stock { font-weight: 800; }

                /* Inventory */
                .inventory-header { display: flex; justify-content: space-between; align-items: center; gap: 16px; }
                .search-box {
                    display: flex; align-items: center; gap: 10px; padding: 10px 16px;
                    border-radius: 14px; flex: 1; max-width: 400px;
                }
                .search-box input {
                    border: none; background: transparent; outline: none; font-size: 14px;
                    width: 100%; color: var(--fg); font-family: inherit;
                }
                .inv-count { font-size: 14px; color: var(--slate-500); font-weight: 600; }

                .inventory-table { border-radius: 20px; overflow: hidden; }
                .table-header, .table-row {
                    display: grid; grid-template-columns: 2fr 1fr 0.8fr 0.8fr 0.7fr 1fr;
                    padding: 14px 20px; align-items: center; gap: 8px;
                }
                .table-header {
                    font-size: 12px; font-weight: 800; text-transform: uppercase;
                    letter-spacing: 0.5px; color: var(--slate-500);
                    border-bottom: 1px solid var(--glass-border);
                }
                .table-row {
                    font-size: 14px; color: var(--fg); border-bottom: 1px solid var(--glass-border);
                    transition: background 0.2s;
                }
                .table-row:hover { background: var(--bg); }
                .table-row:last-child { border-bottom: none; }

                .product-name-cell { display: flex; align-items: center; gap: 10px; font-weight: 600; }
                .product-thumb { width: 32px; height: 32px; border-radius: 8px; object-fit: cover; }

                .stock-input {
                    width: 60px; padding: 6px 8px; border-radius: 8px; border: 1px solid var(--glass-border);
                    text-align: center; font-size: 14px; font-weight: 700;
                    background: var(--bg); color: var(--fg); font-family: inherit;
                }
                .stock-input:focus { border-color: var(--primary); outline: none; }

                .stock-badge {
                    padding: 3px 10px; border-radius: 8px; font-size: 11px; font-weight: 800;
                }

                .action-btns { display: flex; gap: 4px; align-items: center; }
                .adj-btn {
                    width: 28px; height: 28px; border-radius: 8px; border: 1px solid var(--glass-border);
                    background: var(--bg); color: var(--fg); cursor: pointer;
                    display: flex; align-items: center; justify-content: center;
                    transition: all 0.2s;
                }
                .adj-btn:hover { border-color: var(--primary); color: var(--primary); }
                .save-stock-btn {
                    padding: 4px 10px; border-radius: 8px; border: none;
                    background: var(--primary); color: white; cursor: pointer;
                    font-weight: 800; font-size: 14px;
                    transition: all 0.2s;
                }
                .save-stock-btn:hover { opacity: 0.9; }

                @media (max-width: 900px) {
                    .stats-grid { grid-template-columns: repeat(2, 1fr); }
                    .dashboard-grid { grid-template-columns: 1fr; }
                    .table-header, .table-row { grid-template-columns: 2fr 1fr 1fr 0.8fr; }
                    .col-category, .col-status { display: none; }
                }
                @media (max-width: 600px) {
                    .stats-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
}
