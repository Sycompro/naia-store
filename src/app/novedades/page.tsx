'use client';
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Sparkles, Calendar, ArrowRight, Zap } from 'lucide-react';

export default function NovedadesPage() {
    const news = [
        {
            title: 'Nueva Línea Facial Ácido Hialurónico',
            date: '25 Mayo, 2026',
            desc: 'Descubre nuestra fórmula más avanzada para una hidratación 24/7.',
            tag: 'Lanzamiento'
        },
        {
            title: 'Taller de Cuidado Capilar en Lima',
            date: '15 Junio, 2026',
            desc: 'Aprende a cuidar tu cabello con nuestros expertos. Cupos limitados.',
            tag: 'Evento'
        },
        {
            title: 'Apertura de Nuestra Nueva Tienda Online',
            date: '1 Mayo, 2026',
            desc: 'Estamos felices de presentarte nuestra nueva plataforma interactiva.',
            tag: 'Noticia'
        }
    ];

    return (
        <main className="novedades-page-v3">
            <Navbar />

            <section className="n-hero mesh-bg">
                <div className="container n-hero-content animate-entrance">
                    <span className="n-tag">Portal de Novedades</span>
                    <h1>Lo Último en <span className="text-gradient">Naia</span></h1>
                    <p>Mantente al día con nuestros lanzamientos exclusivos, eventos presenciales y avances cosméticos.</p>
                </div>
            </section>

            <section className="n-body container">
                <div className="n-featured glass-premium animate-fade">
                    <div className="n-feat-info">
                        <span className="n-badge-featured">Destacado</span>
                        <h2>Colección Brillo de Verano 2026</h2>
                        <p>La espera terminó. Presentamos nuestra colección más avanzada del año diseñada para proteger y realzar tu piel durante la temporada de mayor impacto solar.</p>
                        <button className="n-btn">Leer Historia Completa <ArrowRight size={16} /></button>
                    </div>
                    <div className="n-feat-img"></div>
                </div>

                <div className="n-grid">
                    {news.map((item, index) => (
                        <article key={index} className="n-card glass-premium animate-fade">
                            <div className="n-img-wrapper">
                                <span className="n-card-badge">{item.tag}</span>
                            </div>
                            <div className="n-content">
                                <div className="n-meta">
                                    <span className="n-date"><Calendar size={12} strokeWidth={2.5} /> {item.date}</span>
                                </div>
                                <h3>{item.title}</h3>
                                <p>{item.desc}</p>
                                <a href="#" className="n-link">Continuar leyendo <ArrowRight size={14} /></a>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <Footer />

            <style jsx>{`
                .novedades-page-v3 { min-height: 100vh; }
                .n-hero { padding: 150px 0 80px; text-align: center; position: relative; }
                .n-hero-content { position: relative; z-index: 10; }
                
                .n-tag { 
                    font-size: 13px; font-weight: 800; color: var(--primary); text-transform: uppercase; 
                    letter-spacing: 0.2em; margin-bottom: 20px; display: block;
                }
                .n-hero h1 { font-size: clamp(40px, 8vw, 65px); font-weight: 900; margin-bottom: 20px; line-height: 1.1; letter-spacing: -1.5px; }
                .n-hero p { font-size: 18px; color: var(--slate-500); max-width: 650px; margin: 0 auto; line-height: 1.6; font-weight: 500; }
                
                .n-body { padding-bottom: 100px; }
                
                .n-featured {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    border-radius: var(--radius-xl);
                    overflow: hidden;
                    margin-top: -40px;
                    margin-bottom: 70px;
                    position: relative;
                    z-index: 20;
                    box-shadow: var(--shadow-lg);
                }
                .n-feat-info { padding: 60px; display: flex; flex-direction: column; justify-content: center; }
                .n-badge-featured { 
                    align-self: flex-start; background: var(--fg); color: var(--bg); padding: 6px 16px; 
                    border-radius: 30px; font-size: 12px; font-weight: 800; margin-bottom: 25px; text-transform: uppercase; letter-spacing: 1px;
                }
                .men-theme .n-badge-featured { background: var(--primary); color: white; }
                .n-feat-info h2 { font-size: 40px; font-weight: 900; margin-bottom: 20px; color: var(--fg); line-height: 1.1; letter-spacing: -1px; }
                .n-feat-info p { font-size: 17px; color: var(--slate-500); margin-bottom: 35px; line-height: 1.6; font-weight: 500; }
                
                .n-btn { 
                    align-self: flex-start; background: var(--primary); color: white; padding: 14px 28px; 
                    border-radius: 14px; font-weight: 800; font-size: 14px; border: none; cursor: pointer; 
                    display: flex; align-items: center; gap: 10px; transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .n-btn:hover { background: var(--primary-dark); transform: translateX(8px); }
                
                .n-feat-img { background: var(--slate-100); min-height: 400px; }
                .men-theme .n-feat-img { background: rgba(0,0,0,0.3); }

                .n-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 35px; }
                .n-card { border-radius: var(--radius-xl); overflow: hidden; transition: all 0.4s ease; padding: 10px; }
                .n-card:hover { transform: translateY(-8px); box-shadow: var(--shadow-xl); }
                
                .n-img-wrapper { height: 220px; background: var(--slate-100); border-radius: var(--radius-lg); position: relative; }
                .men-theme .n-img-wrapper { background: rgba(0,0,0,0.3); }
                
                .n-card-badge { 
                    position: absolute; top: 15px; left: 15px; background: white; color: black; 
                    padding: 6px 14px; border-radius: 8px; font-size: 11px; font-weight: 900; text-transform: uppercase;
                }
                
                .n-content { padding: 25px 15px 15px; display: flex; flex-direction: column; height: 100%; }
                .n-meta { margin-bottom: 12px; }
                .n-date { font-size: 12px; font-weight: 800; color: var(--slate-400); display: flex; align-items: center; gap: 6px; text-transform: uppercase; }
                
                .n-content h3 { font-size: 22px; font-weight: 800; margin-bottom: 15px; color: var(--fg); line-height: 1.3; transition: color 0.3s; }
                .n-card:hover h3 { color: var(--primary); }
                .n-content p { color: var(--slate-500); font-size: 15px; margin-bottom: 25px; line-height: 1.6; font-weight: 500; flex: 1; }
                
                .n-link { 
                    color: var(--primary); font-weight: 800; font-size: 14px; text-decoration: none; 
                    display: inline-flex; align-items: center; gap: 8px; transition: all 0.3s; width: max-content;
                }
                .n-link:hover { gap: 12px; }

                @media (max-width: 900px) {
                    .n-featured { grid-template-columns: 1fr; margin-top: -20px; }
                    .n-feat-img { min-height: 250px; order: -1; }
                    .n-feat-info { padding: 40px 30px; }
                    .n-hero h1 { font-size: 36px; }
                }
            `}</style>
        </main>
    );
}
