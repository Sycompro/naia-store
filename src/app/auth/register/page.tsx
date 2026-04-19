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
        <main className="p-auth-wrapper white-bg">
            <Navbar />
            <div className="p-auth-content">
                <div className="auth-card-premium animate-up">
                    <div className="auth-header-v4">
                        <div className="auth-icon-premium">
                            <UserPlus size={28} strokeWidth={2} />
                        </div>
                        <h1 className="section-title">Crear <span className="text-gradient">Cuenta</span></h1>
                        <p>Únete a la élite de la belleza premium.</p>
                    </div>

                    <form onSubmit={handleSubmit} className="auth-form-v4">
                        {error && <div className="auth-error-v4 animate-fade">{error}</div>}

                        <div className="p-input-v4">
                            <label><User size={14} /> Nombre Completo</label>
                            <input
                                type="text"
                                placeholder="Tu nombre y apellido"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                required
                            />
                        </div>

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
                            <span>{loading ? 'Creando cuenta...' : 'Registrarme ahora'}</span>
                            {!loading && <ArrowRight size={20} />}
                        </button>
                    </form>

                    <div className="auth-footer-v4">
                        ¿Ya tienes cuenta Naia? <Link href="/auth/login">Inicia Sesión aquí</Link>
                    </div>
                </div>
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
                .auth-card-premium {
                    width: 100%;
                    max-width: 480px;
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

                .auth-form-v4 { display: flex; flex-direction: column; gap: 20px; }
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
                .w-half { width: 100%; height: 60px; margin-top: 10px; }

                .auth-footer-v4 { margin-top: 35px; text-align: center; font-size: 14px; color: var(--slate-400); font-weight: 600; }
                .auth-footer-v4 :global(a) { color: var(--primary); font-weight: 800; text-decoration: none; margin-left: 5px; transition: 0.3s; }
                .auth-footer-v4 :global(a:hover) { opacity: 0.8; }

                @media (max-width: 480px) {
                    .auth-card-premium { padding: 40px 25px; border-radius: 24px; }
                    .auth-header-v4 h1 { font-size: 32px; }
                }
            `}</style>
        </main>

        </main>
    );
}
