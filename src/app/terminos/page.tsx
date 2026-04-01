'use client';
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Scale, HeartHandshake, CreditCard, HelpCircle } from 'lucide-react';

export default function TerminosPage() {
    return (
        <main className="legal-page mesh-bg">
            <Navbar />

            <div className="container legal-container animate-entrance">
                <header className="legal-header">
                    <div className="legal-icon-wrapper glass-premium">
                        <Scale size={40} className="text-primary" />
                    </div>
                    <h1 className="text-gradient">Términos y Condiciones</h1>
                    <p className="legal-date">Última actualización: 1 de Abril, 2026</p>
                </header>

                <div className="legal-content glass-premium">
                    <section className="legal-section">
                        <div className="section-title">
                            <HeartHandshake size={20} />
                            <h2>Tu Satisfacción es Primero</h2>
                        </div>
                        <p>Al utilizar Naia Beauty Store, aceptas nuestros términos de servicio. Nos comprometemos a entregarte productos de la más alta calidad y un servicio al cliente excepcional.</p>
                    </section>

                    <section className="legal-section">
                        <div className="section-title">
                            <CreditCard size={20} />
                            <h2>Pagos y Transacciones</h2>
                        </div>
                        <p>Todas las transacciones se procesan de manera segura. Los precios mostrados están en dólares americanos ($) e incluyen el detalle de precio unitario y mayorista cuando aplica.</p>
                    </section>

                    <section className="legal-section">
                        <div className="section-title">
                            <HelpCircle size={20} />
                            <h2>Envíos y Reclamaciones</h2>
                        </div>
                        <p>Realizamos envíos prioritarios para asegurar que tus productos lleguen en perfectas condiciones. Cualquier reclamación debe ser notificada dentro de las 48 horas posteriores a la recepción.</p>
                    </section>

                    <footer className="legal-footer-note">
                        <p>Cualquier duda adicional, nuestro equipo legal está a tu disposición en <a href="mailto:hola@naia.com" className="text-primary">hola@naia.com</a></p>
                    </footer>
                </div>
            </div>

            <Footer />

            <style jsx>{`
                .legal-page { padding-top: 140px; min-height: 100vh; }
                .legal-container { max-width: 900px; padding-bottom: 100px; }
                
                .legal-header { text-align: center; margin-bottom: 60px; }
                .legal-icon-wrapper { 
                    width: 80px; height: 80px; border-radius: 24px; 
                    margin: 0 auto 25px; display: flex; align-items: center; justify-content: center;
                }
                .legal-header h1 { font-size: 48px; margin-bottom: 10px; }
                .legal-date { font-size: 14px; color: var(--slate-400); font-weight: 700; text-transform: uppercase; letter-spacing: 0.1em; }

                .legal-content { padding: 50px; border-radius: 30px; }
                .legal-section { margin-bottom: 40px; }
                .section-title { display: flex; align-items: center; gap: 15px; margin-bottom: 15px; color: var(--primary); }
                .section-title h2 { font-size: 22px; font-weight: 800; color: var(--fg); }
                
                .legal-section p { font-size: 17px; line-height: 1.7; color: var(--slate-500); font-weight: 500; }
                
                .legal-footer-note { 
                    margin-top: 60px; padding-top: 30px; 
                    border-top: 1px solid var(--slate-100); text-align: center; 
                    font-size: 15px; color: var(--slate-400); font-weight: 600;
                }
                .text-primary { color: var(--primary); text-decoration: none; font-weight: 800; }

                @media (max-width: 600px) {
                    .legal-header h1 { font-size: 32px; }
                    .legal-content { padding: 30px 20px; }
                }
            `}</style>
        </main>
    );
}
