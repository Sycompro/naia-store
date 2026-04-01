'use client';
import React from 'react';
import { ArrowRight, Star, ShieldCheck } from 'lucide-react';

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
    subtitle: 'Rutinas simplificadas, resultados potentes. Tecnología avanzada en skincare masculino de alta gama.',
    cta: 'Ver Colección',
    secondaryCta: 'Asesoría VIP',
    image: '/men-hero.png',
    gradient: 'linear-gradient(135deg, #334155 0%, #1e293b 100%)'
  } : {
    emoji: '✨',
    title: 'Descubre tu Brillo ',
    highlight: 'Natural',
    subtitle: 'Productos premium diseñados para resaltar tu belleza única. Ingredientes naturales con ciencia avanzada.',
    cta: 'Comprar Ahora',
    secondaryCta: 'Ver Catálogo',
    image: 'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?q=80&w=1200',
    gradient: 'linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%)'
  };

  return (
    <section className="hero mesh-bg">
      <div className="container hero-content">
        <div className="hero-text animate-entrance">
          <div className="badge-premium animate-fade">
            <span>Nueva Colección 2026</span>
          </div>

          <h1 className="hero-title">
            {content.title}
            <span className="text-gradient block">{content.highlight}</span>
          </h1>

          <p className="hero-subtitle">
            {content.subtitle}
          </p>

          <div className="hero-actions">
            <a href="#productos" className="btn-premium btn-primary-v3">
              {content.cta} <ArrowRight size={20} />
            </a>
            <a href="#nosotros" className="btn-outline-premium">
              {content.secondaryCta}
            </a>
          </div>

          <div className="hero-trust animate-fade" style={{ animationDelay: '0.4s' }}>
            <div className="trust-item">
              <ShieldCheck size={18} />
              <span>Dermatológicamente testeado</span>
            </div>
            <div className="trust-divider"></div>
            <div className="trust-item">
              <Star size={18} />
              <span>4.9/5 Calificación</span>
            </div>
          </div>
        </div>

        <div className="hero-visual animate-entrance" style={{ animationDelay: '0.2s' }}>
          <div className="visual-stack">
            <div className="main-card glass-premium">
              <div className="card-image" style={{ backgroundImage: `url(${content.image})` }}></div>
              <div className="card-footer">
                <div className="footer-info">
                  <span className="info-label">Producto Estrella</span>
                  <span className="info-name">Sérum Iluminador</span>
                </div>
                <div className="footer-tag">New</div>
              </div>
            </div>
            <div className="floating-element element-1">
              <div className="text-box">
                <span className="bold">100% Orgánico</span>
                <span className="small">Pureza certificada</span>
              </div>
            </div>
            <div className="floating-element element-2">
              <div className="user-avatars">
                <div className="avatar" style={{ backgroundColor: '#FFD2E5' }}></div>
                <div className="avatar" style={{ backgroundColor: '#E05A94' }}></div>
                <div className="avatar" style={{ backgroundColor: '#FF7EB3' }}></div>
              </div>
              <span className="avatar-text">+2k Clientes</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .hero {
          min-height: 95vh;
          display: flex;
          align-items: center;
          padding: 120px 0 80px;
          position: relative;
        }
        .hero-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          align-items: center;
          gap: 80px;
          position: relative;
          z-index: 2;
        }
        .badge-premium {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 10px 20px;
          background: var(--glass);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid var(--glass-border);
          border-radius: 50px;
          color: var(--primary);
          font-weight: 800;
          font-size: 13px;
          margin-bottom: 30px;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .hero-title {
          font-size: clamp(48px, 6vw, 84px);
          margin-bottom: 25px;
          line-height: 0.95;
        }
        .block { display: block; }
        .hero-subtitle {
          font-size: 20px;
          color: var(--slate-500);
          max-width: 550px;
          margin-bottom: 45px;
          line-height: 1.6;
        }
        .hero-actions {
          display: flex;
          gap: 20px;
          margin-bottom: 60px;
        }
        .btn-outline-premium {
          padding: 14px 28px;
          border-radius: var(--radius-md);
          font-weight: 700;
          border: 2px solid var(--slate-200);
          color: var(--fg);
          text-decoration: none;
          transition: all 0.3s;
          display: inline-flex;
          align-items: center;
          background: var(--bg);
        }
        .btn-outline-premium:hover {
          border-color: var(--primary);
          color: var(--primary);
          transform: translateY(-2px);
        }
        
        .hero-trust {
          display: flex;
          align-items: center;
          gap: 25px;
          color: var(--slate-400);
        }
        .trust-item {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 14px;
          font-weight: 600;
        }
        .trust-divider {
          width: 1px;
          height: 20px;
          background: var(--slate-200);
        }

        .hero-visual {
          position: relative;
          display: flex;
          justify-content: center;
        }
        .visual-stack {
          position: relative;
          width: 100%;
          max-width: 500px;
        }
        .main-card {
          padding: 15px;
          border-radius: var(--radius-xl);
          transform: rotate(-2deg);
          transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .main-card:hover { transform: rotate(0deg) scale(1.02); }
        .card-image {
          height: 550px;
          border-radius: var(--radius-lg);
          background-size: cover;
          background-position: center;
          margin-bottom: 20px;
        }
        .card-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0 10px 10px;
        }
        .info-label { font-size: 12px; color: var(--slate-400); display: block; }
        .info-name { font-size: 18px; font-weight: 800; color: var(--fg); }
        .footer-tag {
          padding: 6px 14px;
          background: var(--primary);
          color: white;
          border-radius: 50px;
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .floating-element {
          position: absolute;
          padding: 15px 25px;
          border-radius: 50px;
          display: flex;
          align-items: center;
          gap: 15px;
          z-index: 10;
          background: rgba(255,255,255,0.08);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.1);
        }
        .element-1 {
          top: -20px;
          right: -40px;
          animation: float 4s ease-in-out infinite;
        }
        .element-2 {
          bottom: 40px;
          left: -60px;
          animation: float 4s ease-in-out infinite reverse;
        }

        .icon-box {
          width: 44px;
          height: 44px;
          background: var(--primary-light);
          color: var(--primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .text-box { display: flex; flex-direction: column; }
        .bold { font-weight: 800; font-size: 14px; color: var(--fg); }
        .small { font-size: 12px; color: var(--slate-400); }

        .user-avatars { display: flex; }
        .avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 3px solid var(--white);
          margin-left: -12px;
        }
        .avatar:first-child { margin-left: 0; }
        .avatar-text { font-size: 14px; font-weight: 700; color: var(--fg); }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        @media (max-width: 1100px) {
          .hero-content { gap: 40px; }
          .element-1, .element-2 { display: none; }
        }

        @media (max-width: 768px) {
          .hero { padding-top: 100px; text-align: center; }
          .hero-content { grid-template-columns: 1fr; }
          .hero-subtitle { margin: 0 auto 40px; }
          .hero-actions { justify-content: center; }
          .hero-visual { margin-top: 40px; }
          .card-image { height: 400px; }
          .hero-trust { justify-content: center; }
        }
      `}</style>
    </section>
  );
}
