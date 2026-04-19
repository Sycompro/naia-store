'use client';
import React from 'react';
import { Mail, MapPin, Phone, Heart, Globe, Share2, Send } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  const InstagramIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
  );
  const FacebookIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
  );
  const TwitterIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.2-18 11.6 7.2 1.5 11-5.4 11-5.4-5.7-1.4-1.5-8.7-1.5-8.7A10.7 10.7 0 0 1 12 8s3.4-1.5 10-4z"></path></svg>
  );

  return (
    <footer className="p-footer mesh-bg">
      <div className="container">
        <div className="p-footer-grid">
          <div className="p-brand">
            <Link href="/" className="premium-logo mb-20">
              Naia
            </Link>
            <p className="p-tagline">Elevando tu belleza natural con ciencia avanzada y pasión por lo orgánico.</p>
            <div className="p-socials">
              <a href="#" className="p-social-btn glass-premium"><InstagramIcon /></a>
              <a href="#" className="p-social-btn glass-premium"><FacebookIcon /></a>
              <a href="#" className="p-social-btn glass-premium"><TwitterIcon /></a>
            </div>
          </div>

          <div className="p-footer-group">
            <h4 className="p-footer-title">Navegación</h4>
            <ul className="p-footer-links">
              <li><Link href="/productos">Catálogo Premium</Link></li>
              <li><Link href="/novedades">Novedades 2026</Link></li>
              <li><Link href="/nosotros">Nuestra Historia</Link></li>
              <li><Link href="/contacto">Centro de Ayuda</Link></li>
            </ul>
          </div>

          <div className="p-footer-group">
            <h4 className="p-footer-title">Categorías</h4>
            <ul className="p-footer-links">
              <li><Link href="/productos?cat=Facial">Cuidado Facial</Link></li>
              <li><Link href="/productos?cat=Capilar">Tratamiento Capilar</Link></li>
              <li><Link href="/productos?cat=Corporal">Bienestar Corporal</Link></li>
              <li><Link href="/productos?cat=Hombres">Colección Men</Link></li>
            </ul>
          </div>

          <div className="p-newsletter">
            <h4 className="p-footer-title">Privilegios VIP</h4>
            <p className="p-news-desc">Únete a nuestra lista exclusiva y recibe asesoría personalizada y ofertas límite.</p>
            <div className="p-news-form glass-premium">
              <input type="email" placeholder="tu@email.com" />
              <button className="p-news-btn"><Send size={18} /></button>
            </div>
          </div>
        </div>

        <div className="p-footer-bottom">
          <div className="p-copy">
            &copy; 2026 Naia Beauty Store. Diseñado con <Heart size={14} fill="currentColor" className="text-primary" /> para una experiencia única.
          </div>
          <div className="p-legal">
            <Link href="/privacidad">Privacidad</Link>
            <Link href="/terminos">Términos y Condiciones</Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .p-footer {
          padding: 100px 0 40px;
          background: #0f172a;
          color: white;
          position: relative;
          overflow: hidden;
        }
        .p-footer::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 1px;
          background: linear-gradient(to right, transparent, rgba(255,255,255,0.1), transparent);
        }
        .p-footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1.5fr;
          gap: 60px;
          margin-bottom: 80px;
        }
        .mb-20 { margin-bottom: 24px; display: inline-block; }
        
        .p-tagline {
          font-size: 15px;
          color: var(--slate-400);
          line-height: 1.6;
          margin-bottom: 32px;
          max-width: 300px;
        }
        .p-socials { display: flex; gap: 12px; }
        .p-social-btn {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          background: rgba(255,255,255,0.05);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .p-social-btn:hover {
          color: white;
          background: var(--primary);
          transform: translateY(-5px);
        }

        .p-footer-title {
          font-size: 16px;
          font-weight: 800;
          margin-bottom: 24px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: white;
        }
        .p-footer-links { list-style: none; padding: 0; }
        .p-footer-links li { margin-bottom: 12px; }
        .p-footer-links a {
          text-decoration: none;
          color: var(--slate-400);
          font-weight: 600;
          font-size: 14px;
          transition: all 0.3s;
        }
        .p-footer-links a:hover { color: var(--primary); transform: translateX(5px); display: inline-block; }

        .p-news-desc { font-size: 14px; color: var(--slate-400); margin-bottom: 24px; line-height: 1.5; }
        .p-news-form {
          display: flex;
          padding: 6px;
          border-radius: 14px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.05);
          gap: 8px;
        }
        .p-news-form input {
          flex: 1;
          background: transparent;
          border: none;
          padding: 10px 15px;
          outline: none;
          font-weight: 600;
          font-size: 14px;
          color: white;
        }
        .p-news-btn {
          width: 44px;
          height: 44px;
          border-radius: 10px;
          border: none;
          background: var(--grad-primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
        }
        .p-news-btn:hover { transform: scale(1.05); filter: brightness(1.1); }

        .p-footer-bottom {
          padding-top: 40px;
          border-top: 1px solid rgba(255,255,255,0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
          font-weight: 500;
          color: var(--slate-500);
        }
        .text-primary { color: var(--primary); }
        .p-legal { display: flex; gap: 30px; }
        .p-legal a { text-decoration: none; color: var(--slate-500); transition: color 0.3s; }
        .p-legal a:hover { color: white; }

        @media (max-width: 1100px) {
          .p-footer-grid { grid-template-columns: 1fr 1fr; gap: 50px; }
        }
        @media (max-width: 600px) {
          .p-footer-grid { grid-template-columns: 1fr; gap: 40px; text-align: center; }
          .p-tagline { margin: 0 auto 32px; }
          .p-socials { justify-content: center; }
          .p-footer-bottom { flex-direction: column; text-align: center; gap: 20px; }
          .p-legal { justify-content: center; }
        }
      `}</style>
    </footer>
  );
}
