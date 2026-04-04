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
            <section className="about-hero mesh-bg">
                <div className="container">
                    <span className="badge">Nuestra Esencia</span>
                    <h1>Belleza con <span className="text-gradient">Propósito</span></h1>
                    <p className="lead">Naia nació para redefinir el cuidado personal, combinando la naturaleza con la ciencia de alta gama.</p>
                </div>
            </section>

            {/* Stats Bar */}
            <section className="container">
                <div className="stats-bar">
                    {stats.map((s, i) => (
                        <div key={i} className="stat-item">
                            <span className="stat-number">{s.number}</span>
                            <span className="stat-label">{s.label}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Historia */}
            <section className="about-content container">
                <div className="about-grid">
                    <div className="about-text-block">
                        <h2 className="section-title">Nuestra Historia</h2>
                        <p>
                            Naia comenzó con un sueño simple: hacer que los productos de belleza de alta calidad sean accesibles sin comprometer la pureza de sus ingredientes.
                        </p>
                        <p>
                            Lo que empezó como un pequeño taller de cuidado capilar se ha transformado en una marca líder que celebra la belleza en todas sus formas.
                        </p>
                        <p>
                            Creemos que el cuidado personal es un acto de amor propio. Por eso, cada fórmula de Naia es probada y perfeccionada para ofrecer resultados visibles desde el primer uso.
                        </p>
                    </div>
                    <div className="about-highlights">
                        <div className="highlight-card">
                            <span className="highlight-year">2024</span>
                            <h3>Fundación</h3>
                            <p>Naia nace en Lima, Perú, con la visión de democratizar el cuidado premium.</p>
                        </div>
                        <div className="highlight-card">
                            <span className="highlight-year">2025</span>
                            <h3>Expansión</h3>
                            <p>Lanzamos la línea masculina y alcanzamos más de 2,000 clientes recurrentes.</p>
                        </div>
                        <div className="highlight-card accent">
                            <span className="highlight-year">2026</span>
                            <h3>Innovación</h3>
                            <p>Nueva colección con tecnología de bioactivos y formulaciones de próxima generación.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Valores */}
            <section className="values container">
                <h2 className="text-center section-title">Nuestros Valores</h2>
                <div className="values-grid">
                    {values.map((v, i) => (
                        <div key={i} className="value-item">
                            <div className="value-icon">{v.icon}</div>
                            <h3>{v.title}</h3>
                            <p>{v.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Misión y Visión */}
            <section className="mission-vision container">
                <div className="mv-grid">
                    <div className="mv-card">
                        <div className="mv-icon"><TargetIcon /></div>
                        <h2>Misión</h2>
                        <p>Empoderar a las personas a través de un cuidado personal consciente, ofreciendo soluciones de belleza innovadoras y de alta calidad que realcen su confianza natural.</p>
                    </div>
                    <div className="mv-card primary-bg">
                        <div className="mv-icon"><EyeIcon /></div>
                        <h2>Visión</h2>
                        <p>Ser el referente en cosmética dual, liderando el mercado con productos sostenibles, eficaces y que celebren la autenticidad de cada individuo.</p>
                    </div>
                </div>
            </section>

            <Footer />

            <style jsx>{`
        .nosotros-page { padding-top: 100px; background: var(--bg); color: var(--fg); }
        
        .about-hero { text-align: center; padding: 80px 20px 60px; }
        .badge { background: var(--primary); color: white; padding: 6px 18px; border-radius: 20px; font-size: 12px; font-weight: 800; display: inline-block; margin-bottom: 20px; text-transform: uppercase; letter-spacing: 0.1em; }
        .about-hero h1 { font-size: 48px; font-weight: 900; margin-bottom: 16px; letter-spacing: -2px; }
        .text-gradient { background: linear-gradient(135deg, var(--primary), var(--primary-dark)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
        .lead { font-size: 17px; color: var(--slate-500); max-width: 600px; margin: 0 auto; line-height: 1.6; }

        /* Stats */
        .stats-bar { display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px; padding: 30px; border-radius: 24px; background: var(--glass); border: 1px solid var(--glass-border); backdrop-filter: blur(12px); margin-bottom: 60px; }
        .stat-item { text-align: center; }
        .stat-number { display: block; font-size: 28px; font-weight: 900; color: var(--primary); margin-bottom: 4px; }
        .stat-label { font-size: 12px; font-weight: 700; color: var(--slate-500); text-transform: uppercase; letter-spacing: 0.05em; }

        /* Historia */
        .about-content { margin-bottom: 80px; }
        .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: start; }
        .about-text-block { }
        .section-title { font-size: 32px; font-weight: 900; margin-bottom: 20px; color: var(--fg); }
        .about-text-block p { font-size: 16px; line-height: 1.8; color: var(--slate-500); margin-bottom: 16px; }
        .text-center { text-align: center; }

        .about-highlights { display: flex; flex-direction: column; gap: 16px; }
        .highlight-card { padding: 24px; border-radius: 20px; background: var(--glass); border: 1px solid var(--glass-border); backdrop-filter: blur(8px); transition: transform 0.3s; }
        .highlight-card:hover { transform: translateY(-4px); }
        .highlight-card.accent { background: var(--primary); border-color: var(--primary); }
        .highlight-card.accent h3, .highlight-card.accent p, .highlight-card.accent .highlight-year { color: white; }
        .highlight-year { font-size: 12px; font-weight: 900; color: var(--primary); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 6px; display: block; }
        .highlight-card h3 { font-size: 18px; font-weight: 800; margin-bottom: 6px; }
        .highlight-card p { font-size: 14px; color: var(--slate-500); line-height: 1.5; }

        /* Valores */
        .values { margin-bottom: 80px; }
        .values-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 40px; }
        .value-item { padding: 28px 20px; border-radius: 20px; text-align: center; transition: transform 0.3s; background: var(--glass); border: 1px solid var(--glass-border); backdrop-filter: blur(8px); }
        .value-item:hover { transform: translateY(-6px); }
        .value-icon { width: 48px; height: 48px; background: var(--primary-light); color: var(--primary); border-radius: 14px; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; }
        :global(.men-theme) .value-icon { background: rgba(14, 165, 233, 0.15); }
        .value-item h3 { font-size: 18px; font-weight: 800; margin-bottom: 8px; }
        .value-item p { font-size: 13px; color: var(--slate-500); line-height: 1.5; }
        
        /* Misión y Visión */
        .mission-vision { padding-bottom: 80px; }
        .mv-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .mv-card { padding: 40px; border-radius: 24px; background: var(--glass); border: 1px solid var(--glass-border); backdrop-filter: blur(8px); }
        .mv-icon { width: 48px; height: 48px; background: var(--primary-light); color: var(--primary); border-radius: 14px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; }
        :global(.men-theme) .mv-icon { background: rgba(14, 165, 233, 0.15); }
        .mv-card h2 { font-size: 28px; font-weight: 900; margin-bottom: 14px; }
        .mv-card p { font-size: 15px; color: var(--slate-500); line-height: 1.7; }
        .mv-card.primary-bg { background: var(--primary); border-color: var(--primary); }
        .mv-card.primary-bg h2, .mv-card.primary-bg p { color: white; }
        .mv-card.primary-bg .mv-icon { background: rgba(255,255,255,0.2); color: white; }
        
        @media (max-width: 900px) {
          .stats-bar { grid-template-columns: repeat(2, 1fr); }
          .values-grid { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 768px) {
          .nosotros-page { padding-top: 80px; }
          .about-hero { padding: 60px 20px 40px; }
          .about-hero h1 { font-size: 32px; }
          .about-grid, .mv-grid { grid-template-columns: 1fr; gap: 20px; }
          .stats-bar { grid-template-columns: repeat(2, 1fr); padding: 20px; gap: 15px; }
          .stat-number { font-size: 22px; }
          .stat-label { font-size: 10px; }
          .values-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .value-item { padding: 20px 15px; }
          .value-item h3 { font-size: 15px; }
          .value-item p { font-size: 12px; }
          .mv-card { padding: 30px 20px; }
        }
      `}</style>
        </main>
    );
}
