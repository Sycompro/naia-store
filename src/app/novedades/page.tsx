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
        <main className="novedades-page">
            <Navbar />

            <section className="news-hero">
                <div className="container">
                    <Zap size={48} className="zap-icon" />
                    <h1>Lo Último en <span className="text-gradient">Naia</span></h1>
                    <p>Mantente al día con nuestros lanzamientos exclusivos, eventos y consejos de belleza.</p>
                </div>
            </section>

            <section className="news-container container">
                <div className="featured-news glass">
                    <div className="featured-content">
                        <span className="featured-tag">Destacado</span>
                        <h2>Colección "Brillo de Verano 2026"</h2>
                        <p>La espera terminó. Presentamos nuestra colección más esperada del año diseñada para proteger y realzar tu piel durante la temporada de sol.</p>
                        <button className="btn-read">Leer Más <ArrowRight size={18} /></button>
                    </div>
                    <div className="featured-image">
                        <div className="placeholder-image"><Sparkles size={40} /></div>
                    </div>
                </div>

                <div className="news-grid">
                    {news.map((item, index) => (
                        <div key={index} className="news-card glass">
                            <div className="news-card-image">
                                <div className="placeholder-image-small"></div>
                            </div>
                            <div className="news-card-content">
                                <div className="news-meta">
                                    <span className="news-tag">{item.tag}</span>
                                    <span className="news-date"><Calendar size={14} /> {item.date}</span>
                                </div>
                                <h3>{item.title}</h3>
                                <p>{item.desc}</p>
                                <a href="#" className="read-link">Continuar leyendo</a>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <Footer />

            <style jsx>{`
        .novedades-page { padding-top: 100px; background: var(--bg); }
        .news-hero { text-align: center; padding: 100px 20px; background: linear-gradient(135deg, var(--primary-light), transparent); }
        .zap-icon { color: var(--primary); margin-bottom: 20px; animation: pulse 2s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.7; transform: scale(1.1); } }
        .news-hero h1 { font-size: 56px; font-weight: 900; margin-bottom: 20px; }
        .text-gradient { background: linear-gradient(135deg, var(--primary), var(--primary-dark)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        
        .featured-news {
          display: grid;
          grid-template-columns: 1.2fr 1fr;
          border-radius: 40px;
          overflow: hidden;
          margin-top: -60px;
          margin-bottom: 60px;
          min-height: 400px;
        }
        .featured-content { padding: 60px; display: flex; flex-direction: column; justify-content: center; align-items: flex-start; }
        .featured-tag { background: var(--primary); color: white; padding: 4px 15px; border-radius: 20px; font-size: 14px; font-weight: 700; margin-bottom: 20px; }
        .featured-news h2 { font-size: 42px; font-weight: 800; margin-bottom: 20px; color: var(--fg); }
        .featured-news p { font-size: 18px; color: #555; margin-bottom: 30px; line-height: 1.6; }
        .btn-read { background: var(--fg); color: white; padding: 15px 30px; border-radius: 12px; font-weight: 700; border: none; cursor: pointer; display: flex; align-items: center; gap: 10px; transition: all 0.3s; }
        .btn-read:hover { background: var(--primary); transform: translateX(10px); }
        
        .featured-image { background: linear-gradient(45deg, #fce4ec, #f3e5f5); display: flex; align-items: center; justify-content: center; }
        .placeholder-image { color: var(--primary); animation: rotate 10s linear infinite; }
        @keyframes rotate { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .news-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap: 30px; padding-bottom: 80px; }
        .news-card { border-radius: 28px; overflow: hidden; transition: transform 0.3s; }
        .news-card:hover { transform: translateY(-10px); }
        .news-card-image { height: 200px; background: #eee; }
        .placeholder-image-small { width: 100%; height: 100%; background: linear-gradient(to bottom right, #f8f9fa, #e9ecef); }
        
        .news-card-content { padding: 30px; }
        .news-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .news-tag { color: var(--primary); font-weight: 700; font-size: 13px; text-transform: uppercase; }
        .news-date { font-size: 13px; color: #888; display: flex; align-items: center; gap: 5px; }
        
        .news-card h3 { font-size: 24px; font-weight: 800; margin-bottom: 15px; color: var(--fg); }
        .news-card p { color: #666; font-size: 15px; margin-bottom: 20px; line-height: 1.5; }
        .read-link { color: var(--primary); font-weight: 700; text-decoration: none; border-bottom: 2px solid transparent; transition: all 0.3s; }
        .read-link:hover { border-bottom-color: var(--primary); padding-bottom: 2px; }

        @media (max-width: 768px) {
          .featured-news { grid-template-columns: 1fr; }
          .featured-content { padding: 40px; }
          .news-hero h1 { font-size: 40px; }
        }
      `}</style>
        </main>
    );
}
