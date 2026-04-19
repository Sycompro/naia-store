'use client';
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function NosotrosPage() {
    const HeartIcon = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" /></svg>
    );
    const ShieldIcon = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z" /></svg>
    );
    const UsersIcon = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
    );
    const StarIcon = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
    );
    const TargetIcon = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
    );
    const EyeIcon = () => (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2.062 12.348a1 1 0 0 1 0-.696 10.75 10.75 0 0 1 19.876 0 1 1 0 0 1 0 .696 10.75 10.75 0 0 1-19.876 0" /><circle cx="12" cy="12" r="3" /></svg>
    );

    const values = [
        { icon: <HeartIcon />, title: 'Pasión', desc: 'Amamos lo que hacemos y se refleja en cada fórmula que creamos.' },
        { icon: <ShieldIcon />, title: 'Pureza', desc: 'Ingredientes seleccionados con los más altos estándares de calidad.' },
        { icon: <UsersIcon />, title: 'Inclusión', desc: 'Belleza diseñada para ella y para él por igual, sin excepciones.' },
        { icon: <StarIcon />, title: 'Calidad', desc: 'Resultados premium que superan las expectativas de nuestros clientes.' }
    ];

    const stats = [
        { number: '+2,000', label: 'Clientes Satisfechos' },
        { number: '50+', label: 'Productos Premium' },
        { number: '4.9', label: 'Calificación Promedio' },
        { number: '100%', label: 'Ingredientes Naturales' }
    ];

    return (
        <main className="nosotros-page">
            <Navbar />

            {/* Hero */}
            <section className="about-hero">
                <div>
                    <span className="badge">Nuestra Esencia</span>
                    <h1>Belleza con <span className="text-gradient">Propósito</span></h1>
                    <p className="lead">Naia nació para redefinir el cuidado personal, combinando la naturaleza con la ciencia de alta gama.</p>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="container">
                <div className="stats-bar animate-up">
                    {stats.map((s, i) => (
                        <div key={i} className="stat-item">
                            <span className="stat-number">{s.number}</span>
                            <span className="stat-label">{s.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Historia goes here (already updated) */}

            <style jsx>{`
        .nosotros-page { background: var(--white); color: var(--fg); overflow-x: hidden; }
        
        .about-hero { text-align: center; padding: 160px 20px 80px; position: relative; }
        .about-hero::before {
          content: '';
          position: absolute;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 100%;
          height: 100%;
          background: radial-gradient(circle at center, var(--primary-light) 0%, transparent 70%);
          opacity: 0.5;
          z-index: 0;
        }
        .about-hero div { position: relative; z-index: 1; }
        .badge { background: var(--primary-light); color: var(--primary-dark); padding: 8px 20px; border-radius: 30px; font-size: 13px; font-weight: 800; display: inline-block; margin-bottom: 24px; text-transform: uppercase; letter-spacing: 0.1em; }
        .about-hero h1 { font-size: clamp(48px, 8vw, 72px); font-weight: 900; margin-bottom: 24px; letter-spacing: -3px; }
        .lead { font-size: 20px; color: var(--slate-500); max-width: 700px; margin: 0 auto; line-height: 1.6; font-weight: 500; }

        /* Stats */
        .stats-bar { 
          display: grid; 
          grid-template-columns: repeat(4, 1fr); 
          gap: 20px; 
          padding: 40px; 
          border-radius: 28px; 
          background: var(--white); 
          border: 1px solid var(--slate-100); 
          box-shadow: var(--shadow-lg); 
          margin-bottom: 100px; 
          margin-top: -40px;
          position: relative;
          z-index: 10;
        }
        .stat-item { text-align: center; }
        .stat-number { display: block; font-size: 32px; font-weight: 900; color: var(--fg); margin-bottom: 6px; letter-spacing: -1px; }
        .stat-label { font-size: 12px; font-weight: 700; color: var(--slate-400); text-transform: uppercase; letter-spacing: 0.1em; }

        /* Historia */
        .about-content { margin-bottom: 120px; }
        .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
        .section-title { font-size: 38px; font-weight: 900; margin-bottom: 30px; letter-spacing: -1.5px; }
        .about-text-block p { font-size: 17px; line-height: 1.8; color: var(--slate-500); margin-bottom: 24px; font-weight: 500; }
        
        .about-highlights { display: flex; flex-direction: column; gap: 20px; }
        .highlight-card { padding: 30px; border-radius: 24px; background: var(--slate-50); border: 1px solid var(--slate-100); transition: all 0.3s; }
        .highlight-card:hover { transform: translateX(10px); background: var(--white); border-color: var(--primary-light); box-shadow: var(--shadow-md); }
        .highlight-card.promo { background: var(--grad-soft); border-color: var(--primary-light); }
        .highlight-year { font-size: 13px; font-weight: 900; color: var(--primary); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 10px; display: block; }
        .highlight-card h3 { font-size: 20px; font-weight: 800; margin-bottom: 8px; letter-spacing: -0.5px; }
        .highlight-card p { font-size: 15px; color: var(--slate-500); line-height: 1.6; }

        /* Valores */
        .values { margin-bottom: 120px; }
        .values-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; margin-top: 60px; }
        .value-item { padding: 40px 30px; border-radius: 28px; text-align: left; transition: all 0.4s; background: var(--white); border: 1px solid var(--slate-50); box-shadow: var(--shadow-md); }
        .value-item:hover { transform: translateY(-10px); box-shadow: var(--shadow-lg); border-color: var(--slate-100); }
        .value-icon { width: 56px; height: 56px; margin-bottom: 24px; }
        .value-item h3 { font-size: 20px; font-weight: 800; margin-bottom: 12px; letter-spacing: -0.5px; }
        .value-item p { font-size: 15px; color: var(--slate-500); line-height: 1.7; }
        
        /* Misión y Visión */
        .mission-vision { padding-bottom: 120px; }
        .mv-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; }
        .mv-card { padding: 50px; border-radius: 32px; background: var(--slate-50); border: 1px solid var(--slate-100); }
        .mv-icon { width: 64px; height: 64px; margin-bottom: 30px; }
        .mv-card h2 { font-size: 32px; font-weight: 900; margin-bottom: 20px; letter-spacing: -1px; }
        .mv-card p { font-size: 17px; color: var(--slate-500); line-height: 1.7; font-weight: 500; }
        
        @media (max-width: 1000px) {
          .stats-bar { grid-template-columns: repeat(2, 1fr); padding: 30px; }
          .about-grid { grid-template-columns: 1fr; gap: 60px; }
          .values-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .about-hero { padding: 120px 20px 60px; }
          .about-hero h1 { font-size: 42px; }
          .stats-bar { margin-top: 0; margin-bottom: 60px; }
          .mv-grid { grid-template-columns: 1fr; gap: 24px; }
          .mv-card { padding: 40px 30px; }
        }
      `}</style>

        </main>
    );
}
