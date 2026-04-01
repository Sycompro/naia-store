'use client';
import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

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
    emoji: '🕴️',
    title: 'Cuidado Facial para el ',
    highlight: 'Hombre Moderno',
    subtitle: 'Rutinas simplificadas, resultados potentes. Tecnología avanzada en skincare masculino.',
    cta: 'Ver Colección',
    secondaryCta: 'Asesoría VIP',
    image: '/men-hero.png'
  } : {
    emoji: '✨',
    title: 'Descubre tu Brillo ',
    highlight: 'Natural',
    subtitle: 'Productos premium diseñados para resaltar tu belleza única con ingredientes de alta gama.',
    cta: 'Comprar Ahora',
    secondaryCta: 'Ver Catálogo',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?q=80&w=1200'
  };

  return (
    <section className="hero">
      <div className="container hero-content">
        <div className="hero-text animate-fade">
          <div className="badge">
            <Sparkles size={16} />
            <span>{content.emoji} Nueva Colección 2026</span>
          </div>
          <h1>{content.title}<span className="highlight">{content.highlight}</span></h1>
          <p>
            {content.subtitle}
          </p>
          <div className="hero-btns">
            <a href="#productos" className="btn btn-primary">
              {content.cta} <ArrowRight size={18} />
            </a>
            <a href="#nosotros" className="btn btn-outline">{content.secondaryCta}</a>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-blob"></div>
          <div className="hero-img-card glass animate-fade" style={{
            animationDelay: '0.2s',
            backgroundImage: `url(${content.image})`
          }}>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero {
          min-height: 80vh;
          display: flex;
          align-items: center;
          padding-top: 40px;
          position: relative;
          overflow: hidden;
        }
        .hero-content {
          display: grid;
          grid-template-columns: 1.2fr 0.8fr;
          align-items: center;
          gap: 60px;
        }
        .badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: var(--secondary);
          color: var(--primary-dark);
          border-radius: 30px;
          font-size: 14px;
          font-weight: 700;
          margin-bottom: 24px;
        }
        h1 {
          font-size: clamp(40px, 8vw, 64px);
          line-height: 1.1;
          font-weight: 800;
          margin-bottom: 24px;
          color: var(--fg);
        }
        .highlight {
          color: var(--primary);
          background: linear-gradient(120deg, var(--secondary) 0%, var(--secondary) 100%);
          background-repeat: no-repeat;
          background-size: 100% 30%;
          background-position: 0 88%;
        }
        p {
          font-size: 18px;
          color: #666;
          max-width: 500px;
          margin-bottom: 40px;
          line-height: 1.6;
        }
        .hero-btns {
          display: flex;
          gap: 20px;
        }
        .btn-outline {
          border: 2px solid var(--primary);
          color: var(--primary);
          background: transparent;
        }
        .btn-outline:hover {
          background: var(--primary);
          color: white;
        }
        .hero-visual {
          position: relative;
          height: 400px;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .hero-blob {
          position: absolute;
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, var(--secondary) 0%, transparent 70%);
          filter: blur(40px);
          opacity: 0.6;
          z-index: -1;
        }
        .hero-img-card {
          width: 300px;
          height: 450px;
          border-radius: 24px;
          transform: rotate(5deg);
          box-shadow: var(--shadow);
          background: url('https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=600&h=800&auto=format&fit=crop');
          background-size: cover;
          background-position: center;
        }
        @media (max-width: 768px) {
          .hero-content {
            grid-template-columns: 1fr;
            text-align: center;
          }
          p { margin: 0 auto 30px; }
          .hero-btns { justify-content: center; }
          .hero-visual { display: none; }
        }
      `}</style>
    </section>
  );
}
