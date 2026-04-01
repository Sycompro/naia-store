'use client';
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShieldCheck, Eye, Lock, FileText } from 'lucide-react';

export default function PrivacidadPage() {
    return (
        <main className="legal-page mesh-bg">
            <Navbar />

            <div className="container legal-container animate-entrance">
                <header className="legal-header">
                    <div className="legal-icon-wrapper glass-premium">
                        <ShieldCheck size={40} className="text-primary" />
                    </div>
                    <h1 className="text-gradient">Política de Privacidad</h1>
                    <p className="legal-date">Última actualización: 1 de Abril, 2026</p>
                </header>

                <div className="legal-content glass-premium">
                    <section className="legal-section">
                        <div className="section-title">
                            <Eye size={20} />
                            <h2>Información que Recopilamos</h2>
                        </div>
                        <p>En Naia Beauty Store, respetamos profundamente tu privacidad. Recopilamos información personal básica (nombre, correo electrónico, dirección de envío) únicamente para procesar tus pedidos y mejorar tu experiencia de compra.</p>
                    </section>

                    <section className="legal-section">
                        <div className="section-title">
                            <Lock size={20} />
                            <h2>Seguridad de tus Datos</h2>
                        </div>
                        <p>Implementamos los más altos estándares de seguridad y cifrado para proteger tus datos contra accesos no autorizados. Tu seguridad es nuestra prioridad absoluta en cada transacción.</p>
                    </section>

                    <section className="legal-section">
                        <div className="section-title">
                            <FileText size={20} />
                            <h2>Uso de Cookies</h2>
                        </div>
                        <p>Utilizamos cookies para personalizar contenido, anuncios y analizar nuestro tráfico de manera anónima, permitiéndonos ofrecerte recomendaciones más precisas y relevantes.</p>
                    </section>

                    <footer className="legal-footer-note">
                        <p>Si tienes dudas sobre nuestra política de privacidad, contáctanos en <a href="mailto:soporte@naia.com" className="text-primary">soporte@naia.com</a></p>
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
