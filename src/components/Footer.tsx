'use client';
import React from 'react';
import { Instagram, Facebook, Twitter, Mail, MapPin, Phone, Heart } from 'lucide-react';
import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="main-footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-brand">
                        <Link href="/" className="footer-logo">
                            Naia<span className="logo-heart">❤</span>
                        </Link>
                        <p className="footer-tagline">Elevando tu belleza natural con ciencia y pasión.</p>
                        <div className="social-links">
                            <a href="#" className="social-icon"><Instagram size={20} /></a>
                            <a href="#" className="social-icon"><Facebook size={20} /></a>
                            <a href="#" className="social-icon"><Twitter size={20} /></a>
                        </div>
                    </div>

                    <div className="footer-links">
                        <h4>Navegación</h4>
                        <ul>
                            <li><Link href="/productos">Catálogo</Link></li>
                            <li><Link href="/novedades">Novedades</Link></li>
                            <li><Link href="/nosotros">Nuestra Historia</Link></li>
                            <li><Link href="/contacto">Contacto</Link></li>
                        </ul>
                    </div>

                    <div className="footer-links">
                        <h4>Categorías</h4>
                        <ul>
                            <li><Link href="/productos?cat=Facial">Cuidado Facial</Link></li>
                            <li><Link href="/productos?cat=Capilar">Cuidado Capilar</Link></li>
                            <li><Link href="/productos?cat=Corporal">Corporal</Link></li>
                            <li><Link href="/productos?cat=Hombres">Para Él</Link></li>
                        </ul>
                    </div>

                    <div className="footer-contact">
                        <h4>Suscríbete</h4>
                        <p>Recibe ofertas exclusivas y novedades.</p>
                        <div className="newsletter-box">
                            <input type="email" placeholder="tu-correo@ejemplo.com" />
                            <button>Unirse</button>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; 2026 Naia Beauty Store. Hecho con <Heart size={14} className="heart-icon" /> para ti.</p>
                    <div className="footer-legal">
                        <a href="#">Privacidad</a>
                        <a href="#">Términos</a>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .main-footer {
          background: white;
          padding: 80px 0 40px;
          border-top: 1px solid rgba(0,0,0,0.05);
          margin-top: 60px;
        }
        .footer-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 40px;
          margin-bottom: 60px;
        }
        .footer-logo {
          font-size: 32px;
          font-weight: 800;
          color: var(--primary);
          text-decoration: none;
          margin-bottom: 20px;
          display: block;
        }
        .logo-heart { color: var(--primary-dark); }
        .footer-tagline { color: #666; margin-bottom: 25px; line-height: 1.6; }
        .social-links { display: flex; gap: 15px; }
        .social-icon {
          width: 40px;
          height: 40px;
          background: var(--primary-light);
          color: var(--primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s;
        }
        .social-icon:hover { transform: translateY(-5px); background: var(--primary); color: white; }
        
        .footer-links h4, .footer-contact h4 { font-size: 18px; font-weight: 700; margin-bottom: 25px; color: var(--fg); }
        .footer-links ul { list-style: none; padding: 0; }
        .footer-links li { margin-bottom: 12px; }
        .footer-links a { text-decoration: none; color: #555; transition: color 0.3s; font-weight: 500; }
        .footer-links a:hover { color: var(--primary); }
        
        .newsletter-box {
          display: flex;
          margin-top: 20px;
          background: #f8f9fa;
          padding: 5px;
          border-radius: 12px;
          border: 1px solid rgba(0,0,0,0.05);
        }
        .newsletter-box input { border: none; background: transparent; padding: 10px 15px; width: 100%; outline: none; }
        .newsletter-box button {
          background: var(--primary);
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
          transition: opacity 0.3s;
        }
        .newsletter-box button:hover { opacity: 0.9; }

        .footer-bottom {
          padding-top: 40px;
          border-top: 1px solid rgba(0,0,0,0.05);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
          color: #888;
          font-size: 14px;
        }
        .heart-icon { color: #ff4d4d; vertical-align: middle; }
        .footer-legal { display: flex; gap: 20px; }
        .footer-legal a { color: #888; text-decoration: none; }
        
        @media (max-width: 768px) {
          .main-footer { padding: 60px 0 30px; }
          .footer-bottom { text-align: center; justify-content: center; }
        }
      `}</style>
        </footer>
    );
}
