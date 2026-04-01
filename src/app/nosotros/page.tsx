'use client';
import React from 'react';
import Navbar from '@/components/Navbar';
import { Sparkles, Heart, Shield, Users, Star } from 'lucide-react';

export default function NosotrosPage() {
    return (
        <main className="nosotros-page">
            <Navbar />

            <section className="about-hero">
                <div className="container">
                    <span className="badge">Nuestra Esencia</span>
                    <h1>Belleza con <span className="text-gradient">Propósito</span></h1>
                    <p className="lead">Naia nació para redefinir el cuidado personal, combinando la naturaleza con la ciencia de alta gama.</p>
                </div>
            </section>

            <section className="about-content container">
                <div className="about-grid">
                    <div className="about-text glass">
                        <h2 className="section-title">Nuestra Historia</h2>
                        <p>
                            Naia comenzó con un sueño simple: hacer que los productos de belleza de alta calidad sean accesibles sin comprometer la pureza de sus ingredientes. Lo que empezó como un pequeño taller de cuidado capilar se ha transformado en una marca líder que celebra la belleza en todas sus formas.
                        </p>
                        <p>
                            Creemos que el cuidado personal es un acto de amor propio. Por eso, cada fórmula de Naia es probada y perfeccionada para ofrecer resultados visibles desde el primer uso.
                        </p>
                    </div>
                    <div className="about-image-card glass">
                        <div className="about-image-placeholder">
                            <Sparkles size={60} className="floating-icon" />
                        </div>
                    </div>
                </div>
            </section>

            <section className="values container">
                <h2 className="text-center section-title">Nuestros Valores</h2>
                <div className="values-grid">
                    {[
                        { icon: <Heart />, title: 'Pasión', desc: 'Amamos lo que hacemos y se refleja en cada envase.' },
                        { icon: <Shield />, title: 'Pureza', desc: 'Ingredientes seleccionados con los más altos estándares.' },
                        { icon: <Users />, title: 'Inclusión', desc: 'Belleza diseñada para ella y para él por igual.' },
                        { icon: <Star />, title: 'Calidad', desc: 'Resultados premium que superan las expectativas.' }
                    ].map((v, i) => (
                        <div key={i} className="value-item glass">
                            <div className="value-icon">{v.icon}</div>
                            <h3>{v.title}</h3>
                            <p>{v.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section className="mission-vision container">
                <div className="mv-grid">
                    <div className="mv-card glass">
                        <h2>Misión</h2>
                        <p>Empoderar a las personas a través de un cuidado personal consciente, ofreciendo soluciones de belleza innovadoras y de alta calidad que realcen su confianza natural.</p>
                    </div>
                    <div className="mv-card glass primary-bg">
                        <h2>Visión</h2>
                        <p>Ser el referente mundial en cosmética dual, liderando el mercado con productos sostenibles, eficaces y que celebren la autenticidad de cada individuo.</p>
                    </div>
                </div>
            </section>

            <style jsx>{`
        .nosotros-page { padding-top: 100px; padding-bottom: 100px; background: var(--bg); color: var(--fg); }
        .about-hero { text-align: center; padding: 100px 20px; background: linear-gradient(135deg, var(--primary-light), transparent); margin-bottom: 60px; }
        .badge { background: var(--primary); color: white; padding: 5px 15px; border-radius: 20px; font-size: 14px; font-weight: 700; display: inline-block; margin-bottom: 20px; }
        .about-hero h1 { font-size: 64px; font-weight: 900; margin-bottom: 20px; letter-spacing: -2px; }
        .text-gradient { background: linear-gradient(135deg, var(--primary), var(--primary-dark)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .lead { font-size: 20px; color: var(--slate-500); max-width: 700px; margin: 0 auto; }

        .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 80px; align-items: center; }
        .about-text { padding: 40px; border-radius: 32px; font-size: 18px; line-height: 1.8; color: var(--slate-500); }
        .section-title { font-size: 36px; font-weight: 800; margin-bottom: 25px; color: var(--fg); }
        .about-image-card { height: 400px; border-radius: 32px; display: flex; align-items: center; justify-content: center; background: var(--glass); }
        .about-image-placeholder { width: 100%; height: 100%; background: var(--slate-100); border-radius: 20px; display: flex; align-items: center; justify-content: center; }
        .men-theme .about-image-placeholder { background: rgba(0,0,0,0.4); }
        .floating-icon { color: var(--primary); animation: float 3s ease-in-out infinite; }
        
        @keyframes float { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-20px); } }

        .values-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 20px; margin-top: 40px; margin-bottom: 80px; }
        .value-item { padding: 30px; border-radius: 24px; text-align: center; transition: transform 0.3s; }
        .value-item:hover { transform: translateY(-10px); }
        .value-icon { width: 50px; height: 50px; background: var(--primary-light); color: var(--primary); border-radius: 12px; display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; }
        .value-item h3 { font-size: 22px; font-weight: 700; margin-bottom: 10px; }
        
        .mission-vision { margin-top: 60px; }
        .mv-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
        .mv-card { padding: 50px; border-radius: 32px; height: 100%; }
        .mv-card h2 { font-size: 32px; font-weight: 800; margin-bottom: 20px; }
        .mv-card.primary-bg { background: var(--primary); color: white; }
        .mv-card.primary-bg h2 { color: white; }
        
        @media (max-width: 768px) {
          .about-hero h1 { font-size: 40px; }
          .about-grid, .mv-grid { grid-template-columns: 1fr; }
        }
      `}</style>
        </main>
    );
}
