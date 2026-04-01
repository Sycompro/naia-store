'use client';
import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { UserPlus, Mail, Lock, User, ArrowRight } from 'lucide-react';
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
        <main className="auth-page">
            <Navbar />
            <div className="container auth-container">
                <div className="auth-card glass animate-fade">
                    <div className="auth-header">
                        <div className="auth-icon"><UserPlus size={32} /></div>
                        <h1>Crear Cuenta</h1>
                        <p>Únete a la experiencia Naia hoy mismo.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form">
                        {error && <div className="auth-error">{error}</div>}

                        <div className="form-group">
                            <label><User size={16} /> Nombre</label>
                            <input
                                type="text"
                                placeholder="Tu nombre completo"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

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
                            {loading ? 'Registrando...' : 'Registrarse'} <ArrowRight size={20} />
                        </button>
                    </form>

                    <div className="auth-footer">
                        ¿Ya tienes cuenta? <Link href="/auth/login">Inicia Sesión</Link>
                    </div>
                </div>
            </div>
            <Footer />

            <style jsx>{`
        .auth-page { padding-top: 120px; background: var(--bg); min-height: 100vh; }
        .auth-container { display: flex; justify-content: center; align-items: center; padding-bottom: 80px; }
        .auth-card { width: 100%; max-width: 450px; padding: 40px; border-radius: 32px; text-align: center; }
        .auth-header { margin-bottom: 30px; }
        .auth-icon { width: 64px; height: 64px; background: var(--primary-light); color: var(--primary); border-radius: 20px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
        .auth-card h1 { font-size: 32px; font-weight: 800; margin-bottom: 10px; }
        .auth-card p { color: #666; font-size: 15px; }

        .auth-form { text-align: left; display: flex; flex-direction: column; gap: 20px; }
        .auth-error { background: #fee2e2; color: #b91c1c; padding: 12px; border-radius: 12px; font-size: 14px; text-align: center; font-weight: 600; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-group label { font-weight: 700; font-size: 14px; display: flex; align-items: center; gap: 8px; color: var(--fg); margin-left: 5px; }
        .form-group input { padding: 15px; border-radius: 12px; border: 1px solid rgba(0,0,0,0.1); background: rgba(255,255,255,0.7); font-size: 15px; outline: none; transition: all 0.3s; }
        .form-group input:focus { border-color: var(--primary); box-shadow: 0 0 0 4px var(--primary-light); }

        .btn-auth { padding: 18px; background: var(--primary); color: white; border: none; border-radius: 16px; font-weight: 800; font-size: 16px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 10px; transition: all 0.3s; margin-top: 10px; }
        .btn-auth:hover { transform: translateY(-2px); box-shadow: 0 10px 25px var(--primary-light); }
        .btn-auth:disabled { opacity: 0.7; cursor: not-allowed; }

        .auth-footer { margin-top: 25px; font-size: 14px; color: #666; }
        .auth-footer a { color: var(--primary); font-weight: 700; text-decoration: none; }
      `}</style>
        </main>
    );
}
