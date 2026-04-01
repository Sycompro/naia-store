'use client';
import React from 'react';
import { Mail, MapPin, Phone, Heart, Globe, Share2, Instagram, Facebook, Twitter, Send } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="p-footer mesh-bg">
      <div className="container">
        <div className="p-footer-grid">
          <div className="p-brand">
            <Link href="/" className="premium-logo mb-20">
              Naia<span className="logo-sparkle">💖</span>
            </Link>
            <p className="p-tagline">Elevando tu belleza natural con ciencia avanzada y pasión por lo orgánico.</p>
            <div className="p-socials">
              <a href="#" className="p-social-btn glass-premium"><Instagram size={20} /></a>
              <a href="#" className="p-social-btn glass-premium"><Facebook size={20} /></a>
              <a href="#" className="p-social-btn glass-premium"><Twitter size={20} /></a>
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
          padding: 100px 0 50px;
          border-top: 1px solid var(--slate-100);
          position: relative;
          z-index: 10;
        }
        .p-footer-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr 1fr 1.5fr;
          gap: 60px;
          margin-bottom: 80px;
        }
        .mb-20 { margin-bottom: 20px; display: inline-block; }
        
        .p-tagline {
          font-size: 16px;
          color: var(--slate-500);
          line-height: 1.6;
          margin-bottom: 30px;
          max-width: 300px;
        }
        .p-socials { display: flex; gap: 15px; }
        .p-social-btn {
          width: 50px;
          height: 50px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--fg);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .p-social-btn:hover {
          color: var(--primary);
          transform: translateY(-5px) rotate(8deg);
          box-shadow: var(--shadow-lg);
        }

        .p-footer-title {
          font-size: 18px;
          font-weight: 800;
          margin-bottom: 30px;
          letter-spacing: -0.02em;
        }
        .p-footer-links { list-style: none; padding: 0; }
        .p-footer-links li { margin-bottom: 15px; }
        .p-footer-links a {
          text-decoration: none;
          color: var(--slate-500);
          font-weight: 600;
          font-size: 15px;
          transition: all 0.3s;
        }
        .p-footer-links a:hover { color: var(--primary); padding-left: 5px; }

        .p-news-desc { font-size: 14px; color: var(--slate-500); margin-bottom: 25px; line-height: 1.5; }
        .p-news-form {
          display: flex;
          padding: 6px;
          border-radius: 18px;
          gap: 10px;
        }
        .p-news-form input {
          flex: 1;
          background: transparent;
          border: none;
          padding: 10px 15px;
          outline: none;
          font-weight: 600;
          font-size: 14px;
        }
        .p-news-btn {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          border: none;
          background: var(--fg);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
        }
        .p-news-btn:hover { background: var(--primary); transform: scale(1.05); }

        .p-footer-bottom {
          padding-top: 40px;
          border-top: 1px solid var(--slate-100);
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 14px;
          font-weight: 600;
          color: var(--slate-400);
        }
        .text-primary { color: var(--primary); }
        .p-legal { display: flex; gap: 30px; }
        .p-legal a { text-decoration: none; color: var(--slate-400); transition: color 0.3s; }
        .p-legal a:hover { color: var(--primary); }

        @media (max-width: 1100px) {
          .p-footer-grid { grid-template-columns: 1fr 1fr; gap: 50px; }
        }
        @media (max-width: 600px) {
          .p-footer-grid { grid-template-columns: 1fr; gap: 40px; text-align: center; }
          .p-tagline { margin: 0 auto 30px; }
          .p-socials { justify-content: center; }
          .p-footer-bottom { flex-direction: column; text-align: center; gap: 20px; }
          .p-legal { justify-content: center; }
        }
      `}</style>
    </footer>
  );
}
