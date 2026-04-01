'use client';
import React, { useState, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, CheckCircle } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

function LoginForm() {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const registered = searchParams.get('registered');

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

            localStorage.setItem('user', JSON.stringify(data.user));
            router.push('/');
            setTimeout(() => window.location.reload(), 100);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-card-premium glass-premium animate-entrance">
            <div className="auth-header-v3">
                <div className="auth-icon-premium">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><polyline points="10 17 15 12 10 7" /><line x1="15" y1="12" x2="3" y2="12" /></svg>
                </div>
                <h1>Bienveni<span className="text-gradient">do</span></h1>
                <p>Ingresa a tu paraíso de belleza personal.</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form-v3">
                {registered && (
                    <div className="auth-success-v3 animate-fade">
                        <CheckCircle size={18} />
                        <span>¡Registro exitoso! Ya puedes entrar.</span>
                    </div>
                )}
                {error && <div className="auth-error-v3 animate-fade">{error}</div>}

                <div className="p-input-group">
                    <label><Mail size={14} /> Email</label>
                    <input
                        type="email"
                        placeholder="ejemplo@naia.com"
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
                    {loading ? 'Verificando...' : 'Iniciar Sesión'}
                    {!loading && <ArrowRight size={20} />}
                </button>
            </form>

            <div className="auth-footer-v3">
                ¿Aún no eres parte? <Link href="/auth/register">Crea tu cuenta</Link>
            </div>

            <style jsx>{`
                .w-full { width: 100%; justify-content: center; margin-top: 10px; }
                .auth-card-premium {
                    width: 100%;
                    max-width: 440px;
                    padding: 50px 40px;
                    border-radius: var(--radius-xl);
                    position: relative;
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
                :global(.men-theme) .auth-icon-premium { background: rgba(14, 165, 233, 0.15); }
                .auth-header-v3 h1 { font-size: 36px; margin-bottom: 10px; color: var(--fg); }
                .auth-header-v3 p { color: var(--slate-500); font-size: 15px; font-weight: 500; }

                .auth-form-v3 { display: flex; flex-direction: column; gap: 24px; }
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
                .p-input-group input:focus {
                    border-color: var(--primary);
                    box-shadow: 0 0 0 3px var(--primary-light);
                }

                .auth-error-v3 {
                    background: #fff1f2;
                    color: #e11d48;
                    padding: 14px;
                    border-radius: 12px;
                    font-size: 14px;
                    font-weight: 700;
                    text-align: center;
                    border: 1px solid rgba(225, 29, 72, 0.1);
                }
                .auth-success-v3 {
                    background: #f0fdf4;
                    color: #16a34a;
                    padding: 14px;
                    border-radius: 12px;
                    font-size: 14px;
                    font-weight: 700;
                    text-align: center;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    border: 1px solid rgba(22, 163, 74, 0.1);
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
                }
            `}</style>
        </div>
    );
}

export default function LoginPage() {
    return (
        <main className="p-auth-wrapper mesh-bg">
            <Navbar />
            <div className="p-auth-content">
                <Suspense fallback={<div className="p-loader"></div>}>
                    <LoginForm />
                </Suspense>
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
                .p-loader {
                    width: 40px;
                    height: 40px;
                    border: 4px solid var(--primary-light);
                    border-top-color: var(--primary);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </main>
    );
}
