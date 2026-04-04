'use client';
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { UserPlus, Mail, Lock, User, ArrowRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const [formData, setFormData] = useState({ email: '', password: '', name: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || 'Error en registro');

            router.push('/auth/login?registered=true');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="p-auth-wrapper mesh-bg">
            <Navbar />
            <div className="p-auth-content">
                <div className="auth-card-premium glass-premium animate-entrance">
                    <div className="auth-header-v3">
                        <div className="auth-icon-premium">
                            <UserPlus size={28} strokeWidth={2.5} />
                        </div>
                        <h1 className="text-gradient">Crea tu Cuenta</h1>
                        <p>Únete a la elite de la belleza natural.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form-v3">
                        {error && <div className="auth-error-v3 animate-fade">{error}</div>}

                        <div className="p-input-group">
                            <label><User size={14} /> Nombre Completo</label>
                            <input
                                type="text"
                                placeholder="Tu nombre"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

                        <div className="p-input-group">
                            <label><Mail size={14} /> Email</label>
                            <input
                                type="email"
                                placeholder="tu@email.com"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                required
                            />
                        </div>

                        <div className="p-input-group">
                            <label><Lock size={14} /> Contraseña</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                required
                            />
                        </div>

                        <button type="submit" className="btn-premium btn-primary-v3 w-full" disabled={loading}>
                            {loading ? 'Procesando...' : 'Registrarse'}
                            {!loading && <ArrowRight size={20} />}
                        </button>
                    </form>

                    <div className="auth-footer-v3">
                        ¿Ya eres miembro? <Link href="/auth/login">Inicia Sesión</Link>
                    </div>
                </div>
            </div>
            <Footer />

            <style jsx>{`
                .p-auth-wrapper { min-height: 100vh; display: flex; flex-direction: column; }
                .p-auth-content {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 120px 20px 80px;
                }
                .w-full { width: 100%; justify-content: center; margin-top: 10px; }
                .auth-card-premium {
                    width: 100%;
                    max-width: 440px;
                    padding: 50px 40px;
                    border-radius: var(--radius-xl);
                    position: relative;
                }
                @media (max-width: 480px) {
                    .auth-card-premium { padding: 35px 25px; border-radius: 24px; }
                    .auth-header-v3 h1 { font-size: 28px; }
                    .auth-header-v3 { margin-bottom: 25px; }
                    .auth-form-v3 { gap: 16px; }
                    .p-input-group input { padding: 14px; }
                }
                .auth-header-v3 { margin-bottom: 35px; text-align: center; }
                .auth-icon-premium {
                    width: 60px;
                    height: 60px;
                    background: var(--primary-light);
                    color: var(--primary);
                    border-radius: 20px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 0 auto 20px;
                    box-shadow: var(--shadow-sm);
                }
                .auth-header-v3 h1 { font-size: 32px; margin-bottom: 10px; line-height: 1.1; }
                .auth-header-v3 p { color: var(--slate-500); font-size: 15px; font-weight: 500; }

                .auth-form-v3 { display: flex; flex-direction: column; gap: 20px; }
                .p-input-group { display: flex; flex-direction: column; gap: 8px; }
                .p-input-group label {
                    font-size: 13px;
                    font-weight: 800;
                    color: var(--slate-500);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding-left: 5px;
                }
                .p-input-group input {
                    padding: 16px;
                    border-radius: 16px;
                    border: 1px solid var(--slate-200);
                    background: var(--bg);
                    color: var(--fg);
                    font-size: 15px;
                    font-weight: 600;
                    outline: none;
                    transition: all 0.3s;
                }
                :global(.men-theme) .p-input-group input {
                    background: rgba(255,255,255,0.03);
                    border-color: rgba(255,255,255,0.08);
                }
                .p-input-group input:focus {
                    border-color: var(--primary);
                    background: var(--bg);
                    box-shadow: 0 0 0 4px var(--primary-light);
                }
                :global(.men-theme) .p-input-group input:focus {
                    background: rgba(255,255,255,0.05);
                    box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1);
                }

                .auth-error-v3 {
                    background: rgba(225, 29, 72, 0.1);
                    color: #e11d48;
                    padding: 14px;
                    border-radius: 12px;
                    font-size: 14px;
                    font-weight: 700;
                    text-align: center;
                    border: 1px solid rgba(225, 29, 72, 0.2);
                }

                .auth-footer-v3 {
                    margin-top: 30px;
                    font-size: 14px;
                    color: var(--slate-500);
                    font-weight: 600;
                    text-align: center;
                }
                .auth-footer-v3 :global(a) {
                    color: var(--primary);
                    font-weight: 800;
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    gap: 5px;
                    margin-left: 5px;
                    transition: all 0.3s;
                }
                .auth-footer-v3 :global(a:hover) {
                    opacity: 0.8;
                    transform: translateX(3px);
                }
            `}</style>
        </main>
    );
}
