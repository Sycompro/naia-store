'use client';
import React, { useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

function AdminLoginForm() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

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

            login(data.user);
            router.push('/admin');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-login-card animate-entrance">
            <header className="admin-login-header">
                <div className="security-badge-premium">
                    <ShieldCheck size={18} />
                    <span>Conexión Encriptada</span>
                </div>
                <h1>Naia<span>Admin</span></h1>
                <p>Centro de Control Administrativo</p>
            </header>

            <form onSubmit={handleSubmit} className="admin-login-form">
                {error && <div className="error-alert-premium">{error}</div>}

                <div className="form-group-premium">
                    <label><Mail size={14} /> Correo Electrónico</label>
                    <input
                        type="email"
                        placeholder="admin@naia.shop"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                </div>

                <div className="form-group-premium">
                    <label><Lock size={14} /> Contraseña</label>
                    <input
                        type="password"
                        placeholder="••••••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                </div>

                <button type="submit" className="login-btn-premium" disabled={loading}>
                    {loading ? 'Validando Acceso...' : 'Ingresar al Panel'}
                    {!loading && <ArrowRight size={20} />}
                </button>
            </form>

            <footer className="admin-login-footer">
                <span className="version-txt">Version 3.0.0 • Naia Cloud Enterprise</span>
            </footer>

            <style jsx>{`
                .admin-login-card {
                    width: 100%;
                    max-width: 460px;
                    padding: 60px 50px;
                    background: #fff;
                    border: 1px solid #f1f5f9;
                    border-radius: 40px;
                    box-shadow: 0 40px 100px -30px rgba(0,0,0,0.15);
                    position: relative;
                }
                .admin-login-header { text-align: center; margin-bottom: 40px; }
                
                .security-badge-premium {
                    display: inline-flex; align-items: center; gap: 8px;
                    padding: 8px 18px; background: #f0fdf4; border: 1px solid #dcfce7;
                    border-radius: 100px; color: #10b981; font-size: 11px; font-weight: 950;
                    text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 25px;
                }

                .admin-login-header h1 { font-size: 42px; font-weight: 950; color: #1e293b; letter-spacing: -2px; margin-bottom: 8px; }
                .admin-login-header h1 span { color: #ec4899; }
                .admin-login-header p { color: #94a3b8; font-size: 15px; font-weight: 700; }

                .admin-login-form { display: flex; flex-direction: column; gap: 25px; }
                
                .form-group-premium { display: flex; flex-direction: column; gap: 10px; }
                .form-group-premium label { font-size: 12px; font-weight: 800; color: #64748b; display: flex; align-items: center; gap: 8px; padding-left: 5px; text-transform: uppercase; letter-spacing: 0.05em; }
                .form-group-premium input {
                    padding: 18px 24px; background: #f8fafc; border: 1px solid #e2e8f0;
                    border-radius: 20px; color: #1e293b; font-size: 16px; font-weight: 800;
                    outline: none; transition: 0.3s;
                }
                .form-group-premium input:focus { border-color: #ec4899; background: #fff; box-shadow: 0 0 0 5px rgba(236, 72, 153, 0.05); }

                .login-btn-premium {
                    padding: 20px; background: #1e293b; color: #fff; border: none;
                    border-radius: 22px; font-size: 16px; font-weight: 950; cursor: pointer;
                    display: flex; align-items: center; justify-content: center; gap: 12px;
                    transition: 0.4s cubic-bezier(0.1, 0.7, 0.1, 1); margin-top: 10px;
                    box-shadow: 0 15px 35px rgba(30, 41, 59, 0.2);
                }
                .login-btn-premium:hover:not(:disabled) { transform: translateY(-4px); background: #000; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.25); }
                .login-btn-premium:disabled { opacity: 0.6; cursor: wait; }

                .error-alert-premium { background: #fff1f2; border: 1px solid #ffe4e6; color: #f43f5e; padding: 16px; border-radius: 18px; font-size: 14px; font-weight: 800; text-align: center; }

                .admin-login-footer { margin-top: 45px; text-align: center; }
                .version-txt { font-size: 11px; font-weight: 800; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.2em; }

                @keyframes entrance { from { opacity: 0; transform: translateY(40px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
                .animate-entrance { animation: entrance 1s cubic-bezier(0.2, 0.8, 0.2, 1); }
            `}</style>
        </div>
    );
}

export default function AdminLoginPage() {
    return (
        <main className="admin-auth-surface premium-mesh-bg">
            <Suspense fallback={<div className="premium-loader"></div>}>
                <AdminLoginForm />
            </Suspense>

            <style jsx global>{`
                .premium-mesh-bg {
                    background-color: #f8fafc;
                    background-image: 
                        radial-gradient(at 0% 0%, rgba(236, 72, 153, 0.03) 0px, transparent 50%),
                        radial-gradient(at 100% 100%, rgba(30, 41, 59, 0.03) 0px, transparent 50%);
                }
                .admin-auth-surface {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 30px;
                }
                .premium-loader {
                    width: 50px; height: 50px;
                    border: 4px solid #f1f5f9;
                    border-top-color: #ec4899;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </main>
    );
}
