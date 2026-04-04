'use client';
import React, { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck, Sparkles, ChevronLeft } from 'lucide-react';
import Link from 'next/link';

function AdminLoginForm() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error en login');

            if (data.user.role !== 'ADMIN') {
                throw new Error('Esta cuenta no tiene permisos de administrador.');
            }

            localStorage.setItem('user', JSON.stringify(data.user));
            router.push('/admin');
            setTimeout(() => window.location.reload(), 100);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-card glass-industrial animate-entrance">
            <div className="admin-login-header">
                <div className="admin-badge">
                    <ShieldCheck size={20} />
                    <span>Portal Seguro</span>
                </div>
                <h1>Naia<span>Admin</span></h1>
                <p>Ingrese sus credenciales de gestión para continuar</p>
            </div>

            <form onSubmit={handleSubmit} className="admin-login-form">
                {error && <div className="admin-error-box animate-fade">{error}</div>}

                <div className="admin-input-group">
                    <label><Mail size={14} /> Correo Electrónico</label>
                    <input
                        type="email"
                        placeholder="admin@naia.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                </div>

                <div className="admin-input-group">
                    <label><Lock size={14} /> Contraseña de Seguridad</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                </div>

                <button type="submit" className="admin-submit-btn" disabled={loading}>
                    {loading ? 'Verificando...' : 'Acceder al Panel'}
                    {!loading && <ArrowRight size={20} />}
                </button>
            </form>

            <div className="admin-login-footer">
                <Link href="/" className="back-to-site">
                    <ChevronLeft size={16} /> Volver al Sitio Público
                </Link>
                <div className="version-info">v2.4.0 Build 2026</div>
            </div>

            <style jsx>{`
                .admin-login-card {
                    width: 100%;
                    max-width: 480px;
                    padding: 60px 50px;
                    background: rgba(15, 23, 42, 0.8);
                    backdrop-filter: blur(25px);
                    -webkit-backdrop-filter: blur(25px);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    border-radius: 32px;
                    box-shadow: 0 40px 100px rgba(0, 0, 0, 0.4);
                }
                .admin-login-header {
                    margin-bottom: 40px;
                    text-align: center;
                }
                .admin-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 16px;
                    background: rgba(30, 41, 59, 0.5);
                    border: 1px solid rgba(148, 163, 184, 0.2);
                    border-radius: 100px;
                    color: #94a3b8;
                    font-size: 12px;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 24px;
                }
                .admin-login-header h1 {
                    font-size: 38px;
                    font-weight: 900;
                    color: white;
                    margin-bottom: 12px;
                    letter-spacing: -1px;
                }
                .admin-login-header h1 span {
                    color: var(--primary);
                    background: linear-gradient(135deg, #f472b6 0%, #db2777 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .admin-login-header p {
                    color: #94a3b8;
                    font-size: 15px;
                    font-weight: 500;
                }

                .admin-login-form {
                    display: flex;
                    flex-direction: column;
                    gap: 28px;
                }
                .admin-input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                }
                .admin-input-group label {
                    font-size: 13px;
                    font-weight: 700;
                    color: #64748b;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding-left: 4px;
                }
                .admin-input-group input {
                    padding: 18px;
                    background: rgba(30, 41, 59, 0.4);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 16px;
                    color: white;
                    font-size: 16px;
                    font-weight: 600;
                    outline: none;
                    transition: all 0.3s;
                }
                .admin-input-group input:focus {
                    background: rgba(30, 41, 59, 0.6);
                    border-color: var(--primary);
                    box-shadow: 0 0 0 4px rgba(244, 114, 182, 0.1);
                }
                .admin-submit-btn {
                    padding: 18px;
                    background: white;
                    color: #0f172a;
                    border: none;
                    border-radius: 18px;
                    font-size: 16px;
                    font-weight: 800;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .admin-submit-btn:hover:not(:disabled) {
                    transform: translateY(-3px);
                    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.2);
                    filter: brightness(1.1);
                }
                .admin-submit-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                .admin-error-box {
                    background: rgba(239, 68, 68, 0.1);
                    border: 1px solid rgba(239, 68, 68, 0.2);
                    color: #f87171;
                    padding: 16px;
                    border-radius: 14px;
                    font-size: 14px;
                    font-weight: 700;
                    text-align: center;
                }

                .admin-login-footer {
                    margin-top: 40px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 13px;
                    font-weight: 600;
                }
                .back-to-site {
                    color: #64748b;
                    text-decoration: none;
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    transition: 0.3s;
                }
                .back-to-site:hover {
                    color: white;
                }
                .version-info {
                    color: #475569;
                    letter-spacing: 0.5px;
                }

                .animate-entrance {
                    animation: entrance 0.8s cubic-bezier(0.2, 0.8, 0.2, 1);
                }
                @keyframes entrance {
                    from { opacity: 0; transform: translateY(30px) scale(0.98); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .animate-fade {
                    animation: fadeIn 0.4s ease;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
            `}</style>
        </div>
    );
}

export default function AdminLoginPage() {
    return (
        <main className="admin-auth-wrapper dark-mesh-bg">
            <Suspense fallback={<div className="admin-loader"></div>}>
                <AdminLoginForm />
            </Suspense>

            <style jsx global>{`
                .dark-mesh-bg {
                    background-color: #020617;
                    background-image: 
                        radial-gradient(at 0% 0%, rgba(30, 58, 138, 0.15) 0px, transparent 50%),
                        radial-gradient(at 100% 100%, rgba(131, 24, 67, 0.1) 0px, transparent 50%),
                        radial-gradient(at 100% 0%, rgba(15, 23, 42, 1) 0px, transparent 50%);
                }
                .admin-auth-wrapper {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 20px;
                }
                .admin-loader {
                    width: 40px;
                    height: 40px;
                    border: 4px solid rgba(255, 255, 255, 0.05);
                    border-top-color: var(--primary);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </main>
    );
}
