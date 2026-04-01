'use client';
import React, { useState, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { LogIn, Mail, Lock, ArrowRight, CheckCircle } from 'lucide-react';
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
        <div className="auth-card glass animate-fade">
            <div className="auth-header">
                <div className="auth-icon"><LogIn size={32} /></div>
                <h1>Iniciar Sesión</h1>
                <p>Bienvenido de nuevo a tu paraíso de belleza.</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
                {registered && (
                    <div className="auth-success"><CheckCircle size={18} /> ¡Registro exitoso! Por favor inicia sesión.</div>
                )}
                {error && <div className="auth-error">{error}</div>}

                <div className="form-group">
                    <label><Mail size={16} /> Email</label>
                    <input
                        type="email"
                        placeholder="tu@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                </div>

                <div className="form-group">
                    <label><Lock size={16} /> Contraseña</label>
                    <input
                        type="password"
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />
                </div>

                <button type="submit" className="btn-auth" disabled={loading}>
                    {loading ? 'Entrando...' : 'Entrar'} <ArrowRight size={20} />
                </button>
            </form>

            <div className="auth-footer">
                ¿No tienes cuenta? <Link href="/auth/register">Regístrate gratis</Link>
            </div>
        </div>
    );
}

export default function LoginPage() {
    return (
        <main className="auth-page">
            <Navbar />
            <div className="container auth-container">
                <Suspense fallback={<div className="loader-container"><div className="loader"></div></div>}>
                    <LoginForm />
                </Suspense>
            </div>
            <Footer />

            <style jsx>{`
        .auth-page { padding-top: 120px; background: var(--bg); min-height: 100vh; }
        .auth-container { display: flex; justify-content: center; align-items: center; padding-bottom: 80px; }
        :global(.auth-card) { width: 100%; max-width: 450px; padding: 40px; border-radius: 32px; text-align: center; }
        :global(.auth-header) { margin-bottom: 30px; }
        :global(.auth-icon) { width: 64px; height: 64px; background: var(--primary-light); color: var(--primary); border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
        :global(.auth-card h1) { font-size: 32px; font-weight: 800; margin-bottom: 10px; }
        :global(.auth-card p) { color: #666; font-size: 15px; }

        :global(.auth-form) { text-align: left; display: flex; flex-direction: column; gap: 20px; }
        :global(.auth-error) { background: #fee2e2; color: #b91c1c; padding: 12px; border-radius: 12px; font-size: 14px; text-align: center; font-weight: 600; }
        :global(.auth-success) { background: #d1fae5; color: #065f46; padding: 12px; border-radius: 12px; font-size: 14px; text-align: center; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px; }
        
        :global(.form-group) { display: flex; flex-direction: column; gap: 8px; }
        :global(.form-group label) { font-weight: 700; font-size: 14px; display: flex; align-items: center; gap: 8px; color: var(--fg); margin-left: 5px; }
        :global(.form-group input) { padding: 15px; border-radius: 12px; border: 1px solid rgba(0,0,0,0.1); background: rgba(255,255,255,0.7); font-size: 15px; outline: none; transition: all 0.3s; }
        :global(.form-group input:focus) { border-color: var(--primary); box-shadow: 0 0 0 4px var(--primary-light); }

        :global(.btn-auth) { padding: 18px; background: var(--fg); color: white; border: none; border-radius: 16px; font-weight: 800; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.3s; margin-top: 10px; width: 100%; }
        :global(.btn-auth:hover) { background: var(--primary); transform: translateY(-2px); box-shadow: 0 10px 25px var(--primary-light); }
        :global(.btn-auth:disabled) { opacity: 0.7; cursor: not-allowed; }

        :global(.auth-footer) { margin-top: 25px; font-size: 14px; color: #666; text-align: center; }
        :global(.auth-footer a) { color: var(--primary); font-weight: 700; text-decoration: none; }
        
        .loader-container { padding: 100px 0; }
      `}</style>
        </main>
    );
}
