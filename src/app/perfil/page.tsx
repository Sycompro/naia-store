'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { User, Package, Clock, ChevronRight, Edit3, Save, ShoppingBag, AlertCircle, LogOut } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface OrderItem {
    name: string;
    quantity: number;
    price: number;
}

interface Order {
    id: number;
    items: OrderItem[];
    total: number;
    status: string;
    note: string | null;
    createdAt: string;
}

export default function PerfilPage() {
    const { user, loading: authLoading, login, logout } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [profile, setProfile] = useState({ name: '', phone: '' });
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'perfil' | 'pedidos'>('perfil');

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/auth/login');
        }
    }, [user, authLoading, router]);

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        try {
            const [profileRes, ordersRes] = await Promise.all([
                fetch('/api/profile'),
                fetch('/api/orders')
            ]);
            if (profileRes.ok) {
                const p = await profileRes.json();
                setProfile({ name: p.name || '', phone: p.phone || '' });
            }
            if (ordersRes.ok) {
                const o = await ordersRes.json();
                setOrders(o);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profile)
            });
            if (res.ok) {
                const data = await res.json();
                login({ ...user!, name: data.user.name });
                setEditing(false);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setSaving(false);
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

    const statusLabel = (status: string) => {
        switch (status) {
            case 'PENDIENTE': return 'Pendiente';
            case 'EN_PROCESO': return 'En Proceso';
            case 'ENTREGADO': return 'Entregado';
            case 'CANCELADO': return 'Cancelado';
            default: return status;
        }
    };

    if (authLoading || (!user && !authLoading)) {
        return null;
    }

    return (
        <main className="perfil-page">
            <Navbar />
            <section className="perfil-hero">
                <div className="container">
                    <div className="avatar-box">
                        <User size={40} />
                    </div>
                    <h1>{user?.name || 'Mi Cuenta'}</h1>
                    <p>{user?.email}</p>
                </div>
            </section>

            <section className="perfil-content container">
                <div className="tabs">
                    <button className={`tab ${activeTab === 'perfil' ? 'active' : ''}`} onClick={() => setActiveTab('perfil')}>
                        <User size={18} /> Mi Perfil
                    </button>
                    <button className={`tab ${activeTab === 'pedidos' ? 'active' : ''}`} onClick={() => setActiveTab('pedidos')}>
                        <Package size={18} /> Mis Pedidos
                    </button>
                </div>

                {activeTab === 'perfil' && (
                    <div className="profile-card glass">
                        <div className="card-header">
                            <h2>Información Personal</h2>
                            {!editing ? (
                                <button className="edit-btn" onClick={() => setEditing(true)}>
                                    <Edit3 size={16} /> Editar
                                </button>
                            ) : (
                                <button className="save-btn" onClick={handleSave} disabled={saving}>
                                    <Save size={16} /> {saving ? 'Guardando...' : 'Guardar'}
                                </button>
                            )}
                        </div>
                        <div className="profile-fields">
                            <div className="field">
                                <label>Nombre</label>
                                {editing ? (
                                    <input
                                        value={profile.name}
                                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                                        placeholder="Tu nombre"
                                    />
                                ) : (
                                    <span>{profile.name || 'Sin definir'}</span>
                                )}
                            </div>
                            <div className="field">
                                <label>Email</label>
                                <span>{user?.email}</span>
                            </div>
                            <div className="field">
                                <label>Teléfono</label>
                                {editing ? (
                                    <input
                                        value={profile.phone}
                                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                        placeholder="+51 999 999 999"
                                    />
                                ) : (
                                    <span>{profile.phone || 'Sin definir'}</span>
                                )}
                            </div>
                            <div className="field">
                                <label>Cuenta</label>
                                <span className="role-badge">{user?.role}</span>
                            </div>
                            <button className="logout-inline-btn" onClick={logout}>
                                <LogOut size={16} /> Cerrar Sesión
                            </button>
                        </div>
                    </div>
                )}

                {activeTab === 'pedidos' && (
                    <div className="orders-section">
                        {loading ? (
                            <div className="loading-card glass"><Clock size={24} /> Cargando pedidos...</div>
                        ) : orders.length === 0 ? (
                            <div className="empty-card glass">
                                <ShoppingBag size={48} strokeWidth={1} />
                                <h3>Sin pedidos aún</h3>
                                <p>Tus pedidos aparecerán aquí cuando realices una compra.</p>
                            </div>
                        ) : (
                            orders.map(order => (
                                <div key={order.id} className="order-card glass">
                                    <div className="order-header">
                                        <div className="order-id">
                                            <Package size={18} />
                                            <span>Pedido #{order.id}</span>
                                        </div>
                                        <div className="order-status" style={{ color: statusColor(order.status), borderColor: statusColor(order.status) }}>
                                            {statusLabel(order.status)}
                                        </div>
                                    </div>
                                    <div className="order-items">
                                        {order.items.map((item: OrderItem, i: number) => (
                                            <div key={i} className="order-item">
                                                <span>{item.name} × {item.quantity}</span>
                                                <span>S/ {(item.price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="order-footer">
                                        <span className="order-date">
                                            <Clock size={14} /> {new Date(order.createdAt).toLocaleDateString('es-PE')}
                                        </span>
                                        <span className="order-total">Total: S/ {order.total.toFixed(2)}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </section>

            <Footer />

            <style jsx>{`
                .perfil-page { padding-top: 100px; background: var(--bg); min-height: 100vh; }
                .perfil-hero {
                    text-align: center; padding: 60px 20px 40px;
                    background: linear-gradient(180deg, var(--primary-light) 0%, transparent 100%);
                }
                .avatar-box {
                    width: 80px; height: 80px; border-radius: 50%;
                    background: var(--primary); color: white;
                    display: flex; align-items: center; justify-content: center;
                    margin: 0 auto 16px; box-shadow: 0 8px 30px var(--primary-light);
                }
                .perfil-hero h1 { font-size: 32px; font-weight: 900; margin-bottom: 6px; color: var(--fg); }
                .perfil-hero p { color: var(--slate-500); font-size: 15px; }

                .perfil-content { max-width: 700px; padding-bottom: 80px; }

                .tabs {
                    display: flex; gap: 8px; margin-bottom: 24px;
                    background: var(--glass); border-radius: 16px; padding: 4px;
                    border: 1px solid var(--glass-border);
                }
                .tab {
                    flex: 1; padding: 12px; border-radius: 12px; border: none;
                    background: transparent; cursor: pointer; font-weight: 700;
                    font-size: 14px; display: flex; align-items: center; justify-content: center;
                    gap: 8px; transition: all 0.3s; color: var(--slate-500);
                    font-family: inherit;
                }
                .tab.active { background: var(--primary); color: white; box-shadow: 0 4px 15px var(--primary-light); }

                .profile-card { padding: 30px; border-radius: 24px; }
                .card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
                .card-header h2 { font-size: 20px; font-weight: 900; color: var(--fg); }
                .edit-btn, .save-btn {
                    display: flex; align-items: center; gap: 6px; padding: 8px 16px;
                    border-radius: 10px; border: 1px solid var(--slate-200);
                    background: var(--bg); color: var(--fg); cursor: pointer;
                    font-weight: 700; font-size: 13px; transition: all 0.3s;
                    font-family: inherit;
                }
                .save-btn { background: var(--primary); color: white; border-color: var(--primary); }
                .edit-btn:hover { border-color: var(--primary); color: var(--primary); }

                .profile-fields { display: flex; flex-direction: column; gap: 20px; }
                .field { display: flex; flex-direction: column; gap: 6px; }
                .field label { font-weight: 800; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px; color: var(--slate-500); }
                .field span { font-size: 16px; color: var(--fg); font-weight: 500; }
                .field input {
                    padding: 12px 16px; border-radius: 12px;
                    border: 1px solid var(--slate-200); background: var(--bg);
                    font-size: 15px; outline: none; color: var(--fg);
                    transition: all 0.3s; font-family: inherit;
                }
                .field input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-light); }
                .role-badge {
                    display: inline-block; padding: 4px 12px; border-radius: 8px;
                    background: var(--primary-light); color: var(--primary);
                    font-size: 12px; font-weight: 800; width: fit-content;
                }
                .logout-inline-btn {
                    margin-top: 30px;
                    width: 100%;
                    padding: 14px;
                    border-radius: 14px;
                    border: 1px solid #fee2e2;
                    background: #fff1f2;
                    color: #e11d48;
                    font-weight: 800;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    cursor: pointer;
                    transition: all 0.3s;
                    font-family: inherit;
                }
                .logout-inline-btn:hover {
                    background: #ffe4e6;
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(225, 29, 72, 0.1);
                }

                .orders-section { display: flex; flex-direction: column; gap: 16px; }
                .order-card { padding: 24px; border-radius: 20px; }
                .order-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
                .order-id { display: flex; align-items: center; gap: 8px; font-weight: 800; font-size: 15px; color: var(--fg); }
                .order-status {
                    padding: 4px 12px; border-radius: 20px; font-size: 12px;
                    font-weight: 800; border: 1.5px solid;
                }
                .order-items { display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px; }
                .order-item {
                    display: flex; justify-content: space-between; padding: 8px 12px;
                    background: var(--bg); border-radius: 10px; font-size: 14px; color: var(--fg);
                }
                .order-footer {
                    display: flex; justify-content: space-between; align-items: center;
                    padding-top: 12px; border-top: 1px solid var(--glass-border);
                }
                .order-date { display: flex; align-items: center; gap: 6px; font-size: 13px; color: var(--slate-500); }
                .order-total { font-weight: 900; font-size: 16px; color: var(--primary); }

                .empty-card {
                    text-align: center; padding: 60px 20px; border-radius: 24px;
                    color: var(--slate-500);
                }
                .empty-card h3 { margin-top: 16px; font-size: 18px; font-weight: 800; color: var(--fg); }
                .empty-card p { margin-top: 8px; font-size: 14px; }

                .loading-card {
                    display: flex; align-items: center; justify-content: center; gap: 12px;
                    padding: 40px; border-radius: 20px; color: var(--slate-500);
                    font-weight: 600;
                }

                @media (max-width: 600px) {
                    .perfil-hero h1 { font-size: 24px; }
                    .profile-card { padding: 20px; }
                    .order-card { padding: 16px; }
                }
            `}</style>
        </main>
    );
}
