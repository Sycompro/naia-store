'use client';
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, User, Sparkles, X, LogOut, ChevronRight, Building2 } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const [theme, setTheme] = useState<'woman' | 'man'>('woman');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, logout } = useAuth();

  useEffect(() => {
    const savedTheme = localStorage.getItem('naia-theme') as 'woman' | 'man';
    if (savedTheme === 'man') {
      setTheme('man');
      document.body.classList.add('men-theme');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'woman' ? 'man' : 'woman';
    setTheme(newTheme);
    document.body.classList.toggle('men-theme');
    localStorage.setItem('naia-theme', newTheme);
  };

  return (
    <>
      <nav className="nav-v3">
        <div className="nav-container glass-premium">
          <div className="nav-left">
            <Link href="/" id="main-naia-logo" className="premium-logo" style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '2px', display: 'flex', alignItems: 'center', gap: '2px' }}>
              {theme === 'woman' ? (
                <span className="logo-text" style={{ fontSize: '32px' }}>N<span className="logo-highlight">ai</span>a</span>
              ) : (
                <span className="logo-text" style={{ fontSize: '32px' }}>N<span className="logo-highlight">oi</span>r</span>
              )}
              <span className="logo-dot" style={{ width: '8px', height: '8px', marginBottom: '0' }}></span>
            </Link>
          </div>

          <div className="nav-center desktop-only">
            <Link href="/productos" className="p-nav-link">Productos</Link>
            <Link href="/novedades" className="p-nav-link">Novedades</Link>
            <div className="nav-divider"></div>
            <Link href="/nosotros" className="p-nav-link">Nosotros</Link>
            <Link href="/contacto" className="p-nav-link">Contacto</Link>
            <div className="nav-divider"></div>
            <Link href="/b2b" className="p-nav-link b2b-link"><Building2 size={14} style={{ display: 'inline', marginRight: '4px', position: 'relative', top: '2px' }} /> Portal B2B</Link>
          </div>

          <div className="nav-right">
            <button onClick={toggleTheme} className={`p-theme-toggle ${theme}`}>
              <div className="toggle-sphere"></div>
              <span>{theme === 'woman' ? 'Ella' : 'Él'}</span>
            </button>

            <div className="p-actions">
              <button className="p-icon-btn" onClick={() => setIsCartOpen(true)}>
                <ShoppingBag size={22} strokeWidth={2.5} />
                {totalItems > 0 && <span className="p-badge">{totalItems}</span>}
              </button>

              {user ? (
                <Link href="/perfil" className="p-user-btn glass-premium" style={{ textDecoration: 'none' }}>
                  <User size={20} strokeWidth={2.5} />
                  <span className="p-user-name desktop-only">{user?.name?.split(' ')[0] || 'Invitado'}</span>
                </Link>
              ) : (
                <Link href="/auth/login" className="p-icon-btn">
                  <User size={22} strokeWidth={2.5} />
                </Link>
              )}

              <button className="p-icon-btn mobile-only" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu size={24} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Mobile Menu Overlay */}
      <div className={`mobile-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content glass-premium">
          <button className="close-menu" onClick={() => setIsMobileMenuOpen(false)}><X /></button>
          <div className="mobile-links">
            <Link href="/productos" onClick={() => setIsMobileMenuOpen(false)}>Productos</Link>
            <Link href="/novedades" onClick={() => setIsMobileMenuOpen(false)}>Novedades</Link>
            <Link href="/nosotros" onClick={() => setIsMobileMenuOpen(false)}>Nosotros</Link>
            <Link href="/contacto" onClick={() => setIsMobileMenuOpen(false)}>Contacto</Link>
            <Link href="/b2b" onClick={() => setIsMobileMenuOpen(false)} style={{ color: 'var(--primary)' }}>Portal B2B</Link>
            {user && <Link href="/perfil" onClick={() => setIsMobileMenuOpen(false)}>Mi Perfil</Link>}
          </div>
        </div>
      </div>

      <style jsx>{`
        .nav-v3 {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          padding: 12px 0;
          z-index: 1000;
          transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
          pointer-events: none;
        }
        .nav-container {
          max-width: 1300px;
          margin: 0 auto;
          height: 76px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          width: 96%;
          background: var(--white);
          border: 1px solid rgba(0,0,0,0.03);
          box-shadow: var(--shadow-lg);
          pointer-events: auto;
        }
        
        .premium-logo {
          font-size: 28px !important;
          font-weight: 900 !important;
          color: var(--fg) !important;
          text-decoration: none !important;
          letter-spacing: -1.5px !important;
          display: flex !important;
          align-items: center !important;
          gap: 2px;
          transition: all 0.4s;
          line-height: 1;
        }
        .premium-logo:hover {
          letter-spacing: -0.5px !important;
          transform: scale(1.02);
        }
        .logo-text {
          display: inline-block;
        }
        .logo-highlight {
          color: var(--primary);
          background: var(--grad-primary);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .logo-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--grad-primary);
          display: inline-block;
          margin-left: 1px;
          box-shadow: 0 0 10px rgba(var(--primary-h), 100%, 70%, 0.4);
        }
        
        .nav-center {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .p-nav-link {
          padding: 10px 20px;
          text-decoration: none;
          color: var(--slate-600);
          font-weight: 700;
          font-size: 14px;
          border-radius: 12px;
          transition: all 0.3s ease;
          letter-spacing: -0.01em;
        }
        .p-nav-link:hover {
          color: var(--primary);
          background: var(--primary-light);
          transform: translateY(-1px);
        }
        .nav-divider {
          width: 1px;
          height: 16px;
          background: var(--slate-200);
          margin: 0 4px;
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }
        
        .p-theme-toggle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 72px;
          background: var(--slate-50);
          border: 1px solid var(--slate-100);
          padding: 4px;
          border-radius: 30px;
          cursor: pointer;
          font-weight: 800;
          font-size: 11px;
          transition: all 0.4s;
          color: var(--slate-500);
        }
        .toggle-sphere {
          width: 24px;
          height: 24px;
          background: var(--grad-primary);
          border-radius: 50%;
          box-shadow: 0 2px 6px rgba(0,0,0,0.1);
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .p-theme-toggle.man span { color: var(--fg); }
        .p-theme-toggle span { flex: 1; text-align: center; }

        .p-actions {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .p-icon-btn {
          position: relative;
          background: var(--slate-50);
          border: none;
          width: 44px;
          height: 44px;
          border-radius: 14px;
          cursor: pointer;
          color: var(--fg);
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .p-icon-btn:hover {
          color: white;
          background: var(--fg);
          transform: translateY(-2px);
        }
        .p-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: var(--grad-primary);
          color: white;
          font-size: 10px;
          font-weight: 900;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--white);
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        }

        .p-user-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 16px;
          background: var(--slate-50);
          border-radius: 14px;
          color: var(--fg);
          font-weight: 700;
          font-size: 14px;
          transition: all 0.3s;
        }
        .p-user-btn:hover {
          background: var(--slate-100);
          transform: translateY(-2px);
        }

        .mobile-only { display: none; }
        .desktop-only { display: flex; }

        @media (max-width: 900px) {
          .nav-center { display: none; }
          .nav-container { height: 68px; padding: 0 20px; border-radius: 16px; width: 94%; }
          .premium-logo { font-size: 24px !important; }
          .mobile-only { display: flex; }
          .p-user-name { display: none; }
        }

        .mobile-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          z-index: 2000;
          opacity: 0;
          visibility: hidden;
          transition: all 0.3s;
          display: flex;
          justify-content: flex-end;
        }
        .mobile-overlay.open { opacity: 1; visibility: visible; }
        .mobile-menu-content {
          width: 280px;
          height: 100%;
          padding: 40px 30px;
          position: relative;
          transform: translateX(100%);
          transition: transform 0.4s cubic-bezier(0.19, 1, 0.22, 1);
        }
        .mobile-overlay.open .mobile-menu-content { transform: translateX(0); }
        .close-menu {
          position: absolute;
          top: 25px;
          right: 25px;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--fg);
        }
        .mobile-links {
          display: flex;
          flex-direction: column;
          gap: 25px;
          margin-top: 60px;
        }
        .mobile-links a {
          font-size: 24px;
          font-weight: 900;
          color: var(--fg);
          text-decoration: none;
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        @media (max-width: 768px) {
          .desktop-only { display: none; }
          .mobile-only { display: flex; }
          .nav-container { padding: 0 20px; height: 70px; border-radius: 35px; width: 92%; }
          .premium-logo { font-size: 24px !important; }
          .logo-text { font-size: 24px; }
          .p-theme-toggle { padding: 4px 5px; width: 62px; font-size: 11px; }
          .p-theme-toggle span { display: block; }
          .p-theme-toggle .toggle-sphere { width: 22px; height: 22px; }
          .p-theme-toggle.man .toggle-sphere { transform: none; }
          .p-actions { gap: 12px; }
        }
      `}</style>
    </>
  );
}
