'use client';
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, User, Sparkles, X, LogOut, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState<'woman' | 'man'>('woman');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'woman' ? 'man' : 'woman';
    setTheme(newTheme);
    document.body.classList.toggle('men-theme');
  };

  return (
    <>
      <nav className={`nav-v3 ${isScrolled ? 'scrolled' : ''}`}>
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
                <div className="p-user-menu">
                  <button className="p-user-btn glass-premium">
                    <User size={20} strokeWidth={2.5} />
                    <span className="p-user-name desktop-only">{user?.name?.split(' ')[0] || 'Invitado'}</span>
                  </button>
                  <div className="p-user-dropdown glass-premium">
                    <Link href="/perfil" className="dropdown-item">Mi Perfil <ChevronRight size={14} /></Link>
                    <button onClick={logout} className="dropdown-item logout">Cerrar Sesión <LogOut size={14} /></button>
                  </div>
                </div>
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
        :global(body.stories-open) .nav-v3 {
          display: none !important;
        }
        .nav-v3.scrolled {
          padding: 8px 0;
        }
        .nav-container {
          max-width: 1300px;
          margin: 0 auto;
          height: 80px;
          border-radius: 50px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 40px;
          width: 94%;
          transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
          pointer-events: auto;
        }
        .nav-v3.scrolled .nav-container {
          width: 96%;
          height: 64px;
          box-shadow: 0 10px 40px rgba(0,0,0,0.12);
        }
        
        .premium-logo {
          font-size: 32px !important;
          font-weight: 800 !important;
          color: var(--fg) !important;
          text-decoration: none !important;
          letter-spacing: 2px !important;
          display: flex !important;
          align-items: center !important;
          gap: 2px;
          text-transform: uppercase;
          font-style: italic;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          z-index: 10;
          line-height: 1;
        }
        .premium-logo:hover {
          letter-spacing: 5px !important;
          transform: scale(1.02);
        }
        .logo-text {
          display: inline-block;
          font-size: 32px;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.05));
        }
        .logo-highlight {
          background: linear-gradient(135deg, var(--primary), var(--primary-dark, #c2185b));
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .logo-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--primary), var(--primary-dark, #c2185b));
          display: inline-block;
          margin-left: 2px;
          box-shadow: 0 0 15px var(--primary-light);
          animation: logoPulse 3s ease-in-out infinite;
          align-self: center;
          margin-bottom: 0;
        }
        @keyframes logoPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.8); }
        }
        
        .nav-center {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .p-nav-link {
          padding: 8px 18px;
          text-decoration: none;
          color: var(--fg);
          font-weight: 700;
          font-size: 13px;
          border-radius: 20px;
          background: rgba(0,0,0,0.03);
          border: 1px solid var(--slate-200);
          transition: all 0.3s;
        }
        .men-theme .p-nav-link {
          background: rgba(255,255,255,0.05);
          border-color: rgba(255,255,255,0.05);
          color: var(--slate-200);
        }
        .p-nav-link:hover {
          background: var(--fg);
          color: var(--bg);
          border-color: var(--fg);
          transform: translateY(-2px);
        }
        .nav-divider {
          width: 1px;
          height: 18px;
          background: var(--slate-200);
          margin: 0 10px;
        }

        .nav-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        
        .p-theme-toggle {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 74px;
          background: var(--slate-100);
          border: none;
          padding: 5px 6px;
          border-radius: 30px;
          cursor: pointer;
          font-weight: 800;
          font-size: 13px;
          transition: all 0.4s;
          color: var(--slate-500);
        }
        .p-theme-toggle span {
          flex: 1;
          text-align: center;
        }
        .toggle-sphere {
          width: 26px;
          height: 26px;
          background: var(--primary);
          border-radius: 50%;
          box-shadow: 0 3px 8px rgba(0,0,0,0.1);
          transition: transform 0.4s;
        }
        .p-theme-toggle.man {
          flex-direction: row-reverse;
        }
        .p-theme-toggle.man .toggle-sphere {
          background: var(--primary);
        }

        .p-actions {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .p-icon-btn {
          position: relative;
          background: none;
          border: none;
          cursor: pointer;
          color: var(--fg);
          transition: all 0.3s;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .p-icon-btn:hover {
          color: var(--primary);
          transform: translateY(-2px);
        }
        .p-badge {
          position: absolute;
          top: -8px;
          right: -8px;
          background: var(--primary);
          color: white;
          font-size: 10px;
          font-weight: 900;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid var(--white);
        }

        .p-user-menu {
          position: relative;
        }
        .p-user-btn {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 6px 14px;
          border-radius: 30px;
          border: none;
          cursor: pointer;
          font-weight: 800;
          font-size: 13px;
          color: var(--fg);
          transition: all 0.3s;
        }
        .p-user-name { max-width: 80px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        
        .p-user-dropdown {
          position: absolute;
          top: 130%;
          right: 0;
          width: 180px;
          padding: 10px;
          border-radius: 20px;
          opacity: 0;
          visibility: hidden;
          transform: translateY(10px);
          transition: all 0.3s;
        }
        .p-user-menu:hover .p-user-dropdown {
          opacity: 1;
          visibility: visible;
          transform: translateY(0);
        }
        .dropdown-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 15px;
          border-radius: 12px;
          text-decoration: none;
          color: var(--fg);
          font-weight: 700;
          font-size: 14px;
          transition: all 0.2s;
          width: 100%;
          border: none;
          background: none;
          cursor: pointer;
        }
        .dropdown-item:hover {
          background: rgba(0,0,0,0.04);
        }
        .dropdown-item.logout { color: #f43f5e; }

        .mobile-only { display: none; }
        .desktop-only { display: flex; }

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
          .nav-container { padding: 0 15px 0 25px; }
          .p-theme-toggle { padding: 4px; width: 44px; height: 44px; justify-content: center; }
          .p-theme-toggle span { display: none; }
          .p-theme-toggle.man .toggle-sphere { transform: none; }
          .p-actions { gap: 10px; }
        }
      `}</style>
    </>
  );
}
