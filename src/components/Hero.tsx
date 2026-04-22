'use client';
import React from 'react';
import { ArrowRight, Sparkles, Star, ShieldCheck } from 'lucide-react';

export default function Hero() {
  const [isMen, setIsMen] = React.useState(false);

  React.useEffect(() => {
    const checkTheme = () => {
      setIsMen(document.body.classList.contains('men-theme'));
    };
    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const content = isMen ? {
    emoji: '',
    title: 'Cuidado Facial ',
    highlight: 'Avanzado',
    subtitle: 'Fórmulas clínicas de alta eficacia diseñadas para la piel masculina. Simplicidad, calidad y resultados reales.',
    cta: 'Explorar Colección',
    secondaryCta: 'Descubrir Rutinas',
    image: '/men-hero.png',
    gradient: 'linear-gradient(135deg, #f0f7ff 0%, #e0f2fe 100%)'
  } : {
    emoji: '',
    title: 'Ciencia y ',
    highlight: 'Bienestar',
    subtitle: 'Nuestra prioridad es la salud de tu piel. Formulaciones avanzadas con ingredientes premium para resultados visibles.',
    cta: 'Explorar Colecciones',
    secondaryCta: 'Nuestra Ciencia',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?q=80&w=1200',
    gradient: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)'
  };

  return (
    <section className="hero">
      <div className="container hero-content">
        <div className="hero-text animate-up">
          <div className="badge-premium">
            <Sparkles size={16} />
            <span>Nueva Colección 2026</span>
          </div>

          <h1 className="hero-title">
            {content.title}
            <span className="text-gradient">{content.highlight}</span>
          </h1>

          <p className="hero-subtitle">
            {content.subtitle}
          </p>

          <div className="hero-actions">
            <a href="#productos" className="btn-premium-v4 btn-grad">
              {content.cta} <ArrowRight size={20} />
            </a>
            <a href="#nosotros" className="btn-premium-v4 btn-ghost">
              {content.secondaryCta}
            </a>
          </div>

          <div className="hero-trust">
            <div className="trust-item">
              <div className="trust-icon bg-rose">
                <ShieldCheck size={20} />
              </div>
              <span>Testeado Dermatológicamente</span>
            </div>
            <div className="trust-item">
              <div className="trust-icon bg-blue">
                <Star size={20} />
              </div>
              <span>4.9/5 Calificación Real</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero {
          display: flex;
          align-items: center;
          padding: 160px 0 80px;
          position: relative;
          background: var(--white);
          overflow: hidden;
        }
        .hero::before {
          content: '';
          position: absolute;
          top: -100px;
          right: -100px;
          width: 500px;
          height: 500px;
          background: var(--primary-light);
          border-radius: 50%;
          filter: blur(100px);
          opacity: 0.6;
          z-index: 1;
        }
        .hero::after {
          content: '';
          position: absolute;
          bottom: -100px;
          left: -100px;
          width: 400px;
          height: 400px;
          background: var(--primary-light);
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.4;
          z-index: 1;
        }
        .hero-content {
          width: 100%;
          max-width: 900px;
          margin: 0 auto;
          position: relative;
          z-index: 2;
        }
        
        .badge-premium {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: var(--primary-light);
          color: var(--primary-dark);
          border-radius: 30px;
          font-weight: 800;
          font-size: 13px;
          margin-bottom: 24px;
          letter-spacing: 0.02em;
        }
        .hero-title {
          font-size: clamp(48px, 8vw, 84px);
          margin-bottom: 24px;
          line-height: 0.95;
          font-weight: 900;
          letter-spacing: -3px;
          color: var(--fg);
        }
        .hero-subtitle {
          font-size: 20px;
          color: var(--slate-500);
          max-width: 650px;
          margin-bottom: 40px;
          line-height: 1.5;
          font-weight: 500;
        }
        .hero-actions {
          display: flex;
          gap: 16px;
          margin-bottom: 54px;
        }
        
        .hero-trust {
          display: flex;
          align-items: center;
          gap: 40px;
          color: var(--slate-600);
        }
        .trust-item {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 14px;
          font-weight: 600;
        }
        .trust-icon {
          width: 40px;
          height: 40px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        @media (max-width: 768px) {
          .hero { padding: 120px 0 40px; }
          .hero-title { font-size: clamp(42px, 12vw, 56px); letter-spacing: -1.5px; }
          .hero-subtitle { font-size: 16px; }
          .hero-actions { flex-direction: column; gap: 12px; margin-bottom: 40px; }
          .hero-trust { flex-direction: column; align-items: flex-start; gap: 20px; }
        }
      `}</style>
    </section>
  );
}
