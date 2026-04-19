'use client';
import React, { useState, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { LogIn, Mail, Lock, ArrowRight, CheckCircle, Sparkles } from 'lucide-react';
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

            // Restricción de rol en el login público
            if (data.user.role === 'ADMIN') {
                setError('Esta es una cuenta administrativa. Por favor, use el portal de gestión oficial.');
                setLoading(false);
                return;
            }

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
        <div className="auth-card-premium animate-up">
            <div className="auth-header-v4">
                <div className="auth-icon-premium">
                    <LogIn size={28} strokeWidth={2} />
                </div>
                <h1 className="section-title">Ingreso <span className="text-gradient">Premium</span></h1>
                <p>Bienvenido de nuevo a tu santuario de belleza.</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form-v4">
                {registered && (
                    <div className="auth-success-v4 animate-fade">
                        <CheckCircle size={18} />
                        <span>¡Registro exitoso! Ya puedes ingresar.</span>
                    </div>
                )}
                {error && <div className="auth-error-v4 animate-fade">{error}</div>}

                <div className="p-input-v4">
                    <label><Mail size={14} /> Correo Electrónico</label>
                    <input
                        type="email"
                        placeholder="tu@correo.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                </div>

                <div className="p-input-v4">
                    <label><Lock size={14} /> Contraseña</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                </div>

                <button type="submit" className="btn-premium-v4 btn-grad w-half" disabled={loading}>
                    <span>{loading ? 'Entrando...' : 'Entrar ahora'}</span>
                    {!loading && <ArrowRight size={20} />}
                </button>
            </form>

            <div className="auth-footer-v4">
                ¿Aún no tienes cuenta Naia? <Link href="/auth/register">Crea una aquí <Sparkles size={14} /></Link>
            </div>

            <style jsx>{`
                .auth-card-premium {
                    width: 100%;
                    max-width: 460px;
                    padding: 60px 45px;
                    background: var(--white);
                    border-radius: 32px;
                    box-shadow: 0 40px 80px rgba(0,0,0,0.1);
                    border: 1px solid var(--slate-100);
                }
                .auth-header-v4 { text-align: center; margin-bottom: 40px; }
                .auth-icon-premium {
                    width: 70px; height: 70px;
                    background: var(--slate-50);
                    color: var(--primary);
                    border-radius: 22px;
                    display: flex; align-items: center; justify-content: center;
                    margin: 0 auto 25px;
                    box-shadow: var(--shadow-sm);
                    border: 1px solid var(--slate-100);
                }
                .auth-header-v4 h1 { font-size: 38px; letter-spacing: -1.5px; margin-bottom: 8px; }
                .auth-header-v4 p { color: var(--slate-400); font-weight: 500; font-size: 15px; }

                .auth-form-v4 { display: flex; flex-direction: column; gap: 25px; }
                .p-input-v4 { display: flex; flex-direction: column; gap: 8px; }
                .p-input-v4 label { font-size: 12px; font-weight: 800; color: var(--slate-400); text-transform: uppercase; letter-spacing: 0.05em; display: flex; align-items: center; gap: 8px; padding-left: 4px; }
                .p-input-v4 input {
                    padding: 16px 20px;
                    border-radius: 16px;
                    border: 1px solid var(--slate-200);
                    background: var(--slate-50);
                    color: var(--fg);
                    font-size: 15px;
                    font-weight: 600;
                    outline: none;
                    transition: 0.3s;
                }
                .p-input-v4 input:focus {
                    border-color: var(--primary);
                    background: var(--white);
                    box-shadow: 0 4px 15px rgba(0,0,0,0.05);
                }

                .auth-error-v4 { background: #fef2f2; color: #ef4444; padding: 15px; border-radius: 14px; font-size: 13px; font-weight: 700; text-align: center; border: 1px solid rgba(239, 68, 68, 0.1); }
                .auth-success-v4 { background: #f0fdf4; color: #16a34a; padding: 15px; border-radius: 14px; font-size: 13px; font-weight: 700; text-align: center; display: flex; align-items: center; justify-content: center; gap: 10px; border: 1px solid rgba(22, 163, 74, 0.1); }

                .w-half { width: 100%; height: 60px; margin-top: 5px; }

                .auth-footer-v4 { margin-top: 35px; text-align: center; font-size: 14px; color: var(--slate-400); font-weight: 600; }
                .auth-footer-v4 :global(a) { color: var(--primary); font-weight: 800; text-decoration: none; margin-left: 5px; transition: 0.3s; }
                .auth-footer-v4 :global(a:hover) { opacity: 0.8; }

                @media (max-width: 480px) {
                    .auth-card-premium { padding: 40px 25px; border-radius: 24px; }
                    .auth-header-v4 h1 { font-size: 32px; }
                }
            `}</style>
        </div>
    );
}

export default function LoginPage() {
    return (
        <main className="p-auth-wrapper white-bg">
            <Navbar />
            <div className="p-auth-content">
                <Suspense fallback={<div className="p-loader"></div>}>
                    <LoginForm />
                </Suspense>
            </div>
            <Footer />

            <style jsx>{`
                .p-auth-wrapper { min-height: 100vh; display: flex; flex-direction: column; background: var(--white); }
                .p-auth-content {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 140px 20px 100px;
                }
                .p-loader {
                    width: 40px;
                    height: 40px;
                    border: 4px solid var(--slate-100);
                    border-top-color: var(--primary);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                @keyframes spin { to { transform: rotate(360deg); } }
            `}</style>
        </main>
    );
}
