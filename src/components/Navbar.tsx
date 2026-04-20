'use client';
import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, Menu, User, X, Building2, Globe, 
  Share2, ChevronRight, Sparkle, LogOut, Search
} from 'lucide-react';
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
      <nav className="nav-elite">
        <div className="nav-blur-container glass-premium">
          <div className="nav-left">
            <Link href="/" className="premium-logo">
              {theme === 'woman' ? (
                <span className="logo-text">N<span className="logo-highlight">ai</span>a</span>
              ) : (
                <span className="logo-text">N<span className="logo-highlight">oi</span>r</span>
              )}
              <span className="logo-dot"></span>
            </Link>
          </div>

          <div className="nav-center desktop-only">
            <div className="links-wrapper">
              <Link href="/productos" className="elite-link">
                <span>Productos</span>
                <div className="link-indicator"></div>
              </Link>
              <Link href="/novedades" className="elite-link">
                <span>Novedades</span>
                <div className="link-indicator"></div>
              </Link>
              <div className="nav-v-divider"></div>
              <Link href="/nosotros" className="elite-link">
                <span>Nosotros</span>
                <div className="link-indicator"></div>
              </Link>
              <Link href="/contacto" className="elite-link">
                <span>Contacto</span>
                <div className="link-indicator"></div>
              </Link>
              <div className="nav-v-divider"></div>
              <Link href="/b2b" className="elite-link b2b-accent">
                <Building2 size={14} />
                <span>Portal B2B</span>
              </Link>
            </div>
          </div>

          <div className="nav-right">
            <button onClick={toggleTheme} className={`elite-theme-switch ${theme}`}>
              <div className="switch-knob">
                {theme === 'woman' ? <Sparkle size={10} /> : <div className="dark-dot"></div>}
              </div>
              <span className="switch-label">{theme === 'woman' ? 'Ella' : 'Él'}</span>
            </button>

            <div className="elite-actions">
              <button className="elite-icon-btn" onClick={() => setIsCartOpen(true)}>
                <ShoppingBag size={20} strokeWidth={2.5} />
                {totalItems > 0 && <span className="elite-badge">{totalItems}</span>}
              </button>

              {user ? (
                <Link href="/perfil" className="elite-user-btn">
                  <div className="user-avatar-mini">
                    <User size={16} />
                  </div>
                  <span className="desktop-only">{user?.name?.split(' ')[0]}</span>
                </Link>
              ) : (
                <Link href="/auth/login" className="elite-icon-btn">
                  <User size={20} strokeWidth={2.5} />
                </Link>
              )}

              <button className="elite-icon-btn mobile-only menu-trigger" onClick={() => setIsMobileMenuOpen(true)}>
                <Menu size={22} strokeWidth={2.5} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      {/* Mobile Full-Screen Elite Menu */}
      <div className={`elite-mobile-overlay ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="premium-logo sm">
             Naia<span className="logo-dot"></span>
          </Link>
          <button className="elite-close-btn" onClick={() => setIsMobileMenuOpen(false)}>
            <X size={28} />
          </button>
        </div>

        <div className="mobile-menu-body">
          {user && (
            <div className="mobile-user-greeting animate-fade-in">
              <span className="greeting-label">Bienvenido de nuevo</span>
              <h2 className="greeting-name">{user.name}</h2>
            </div>
          )}

          <div className="mobile-elite-links">
            <Link href="/productos" className="m-elite-link" onClick={() => setIsMobileMenuOpen(false)} style={{ animationDelay: '0.1s' }}>
              <span className="link-num">01</span>
              <span className="link-txt">Colección Premium</span>
              <ChevronRight size={20} className="link-arrow" />
            </Link>
            <Link href="/novedades" className="m-elite-link" onClick={() => setIsMobileMenuOpen(false)} style={{ animationDelay: '0.15s' }}>
              <span className="link-num">02</span>
              <span className="link-txt">Novedades Naia</span>
              <ChevronRight size={20} className="link-arrow" />
            </Link>
            <Link href="/b2b" className="m-elite-link accent-pink" onClick={() => setIsMobileMenuOpen(false)} style={{ animationDelay: '0.2s' }}>
              <span className="link-num">03</span>
              <span className="link-txt">Socios & Distribuidores</span>
              <ChevronRight size={20} className="link-arrow" />
            </Link>
            <Link href="/nosotros" className="m-elite-link" onClick={() => setIsMobileMenuOpen(false)} style={{ animationDelay: '0.25s' }}>
              <span className="link-num">04</span>
              <span className="link-txt">Nuestra Esencia</span>
              <ChevronRight size={20} className="link-arrow" />
            </Link>
            <Link href="/contacto" className="m-elite-link" onClick={() => setIsMobileMenuOpen(false)} style={{ animationDelay: '0.3s' }}>
              <span className="link-num">05</span>
              <span className="link-txt">Asesoría Directa</span>
              <ChevronRight size={20} className="link-arrow" />
            </Link>
          </div>
        </div>

        <div className="mobile-menu-footer">
          <div className="footer-socials">
            <a href="#" className="social-pill"><Globe size={18} /> Instagram</a>
            <a href="#" className="social-pill"><Share2 size={18} /> Facebook</a>
          </div>
          <div className="footer-meta">
            <span>© 2026 Naia - Beauty Science</span>
            {user ? (
               <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="m-logout-btn"><LogOut size={14} /> Cerrar Sesión</button>
            ) : (
               <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}>Ingresar al Portal</Link>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .nav-elite {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          padding: 20px 0;
          z-index: 1000;
          pointer-events: none;
        }
        .nav-blur-container {
          max-width: 1200px;
          margin: 0 auto;
          height: 68px;
          border-radius: 100px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 12px 0 32px;
          width: 95%;
          pointer-events: auto;
          transition: 0.4s cubic-bezier(0.19, 1, 0.22, 1);
        }
        
        .premium-logo {
          text-decoration: none;
          display: flex;
          align-items: center;
          gap: 2px;
          transition: 0.3s;
        }
        .logo-text { font-size: 28px; font-weight: 950; color: var(--fg); letter-spacing: -2px; }
        .logo-highlight { color: var(--primary); background: var(--grad-primary); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        .logo-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--primary); display: inline-block; margin-left: 2px; box-shadow: 0 0 10px rgba(var(--primary-h), 100%, 70%, 0.4); }
        .premium-logo.sm .logo-text { font-size: 24px; }

        .nav-center { display: flex; align-items: center; }
        .links-wrapper { display: flex; align-items: center; gap: 4px; }
        
        .elite-link {
          padding: 8px 18px;
          text-decoration: none;
          color: var(--slate-600);
          font-weight: 800;
          font-size: 13px;
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          transition: 0.3s;
          letter-spacing: -0.01em;
        }
        .elite-link:hover { color: var(--fg); }
        .link-indicator { width: 0; height: 2px; background: var(--primary); border-radius: 2px; position: absolute; bottom: 0; transition: 0.3s cubic-bezier(0.19, 1, 0.22, 1); opacity: 0; }
        .elite-link:hover .link-indicator { width: 12px; opacity: 1; }
        
        .b2b-accent { background: #fdf2f8; color: #ec4899; border-radius: 100px; gap: 8px; margin-left: 10px; padding: 10px 22px; }
        .b2b-accent:hover { background: #f9a8d4; color: white; transform: scale(1.02); }
        :global(.men-theme) .b2b-accent { background: rgba(37, 99, 235, 0.1); color: #3b82f6; }
        :global(.men-theme) .b2b-accent:hover { background: #3b82f6; color: white; }

        .nav-v-divider { width: 1px; height: 16px; background: rgba(0,0,0,0.06); margin: 0 10px; }
        :global(.men-theme) .nav-v-divider { background: rgba(255,255,255,0.08); }

        .nav-right { display: flex; align-items: center; gap: 12px; }
        
        .elite-theme-switch {
          display: flex; align-items: center; padding: 4px 12px 4px 6px; gap: 8px;
          background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 100px;
          cursor: pointer; transition: 0.4s;
        }
        :global(.men-theme) .elite-theme-switch { background: #1e293b; border-color: #334155; }
        .switch-knob { 
          width: 24px; height: 24px; background: white; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1); transition: 0.4s;
        }
        :global(.men-theme) .switch-knob { background: #0f172a; transform: translateX(0); }
        .switch-label { font-size: 11px; font-weight: 900; text-transform: uppercase; color: #64748b; letter-spacing: 0.5px; }
        :global(.men-theme) .switch-label { color: #94a3b8; }
        .dark-dot { width: 8px; height: 8px; background: #3b82f6; border-radius: 50%; box-shadow: 0 0 10px #3b82f6; }

        .elite-actions { display: flex; align-items: center; gap: 8px; }
        
        .elite-icon-btn {
          width: 44px; height: 44px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          background: transparent; border: none; cursor: pointer; color: var(--fg);
          transition: 0.3s; position: relative;
        }
        .elite-icon-btn:hover { background: #f8fafc; transform: scale(1.15); }
        :global(.men-theme) .elite-icon-btn:hover { background: rgba(255,255,255,0.05); }

        .elite-badge {
          position: absolute; top: 6px; right: 6px;
          background: var(--primary); color: white;
          font-size: 9px; font-weight: 950; min-width: 18px; height: 18px;
          border-radius: 20px; display: flex; align-items: center; justify-content: center;
          border: 2px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        :global(.men-theme) .elite-badge { border-color: #1e293b; }

        .elite-user-btn {
          display: flex; align-items: center; gap: 10px;
          padding: 4px 14px 4px 4px; background: #f1f5f9;
          border-radius: 100px; color: var(--fg); font-weight: 850;
          font-size: 13px; text-decoration: none; transition: 0.3s;
        }
        .user-avatar-mini { width: 34px; height: 34px; background: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--primary); }
        .elite-user-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
        :global(.men-theme) .elite-user-btn { background: #1e293b; }
        :global(.men-theme) .user-avatar-mini { background: #0f172a; color: #3b82f6; }

        /* Mobile Elite Full-Screen Menu */
        .elite-mobile-overlay {
          position: fixed; inset: 0; background: white; z-index: 5000;
          display: flex; flex-direction: column;
          transform: translateY(-100%); transition: transform 0.6s cubic-bezier(0.19, 1, 0.22, 1);
          padding: 30px;
        }
        :global(.men-theme) .elite-mobile-overlay { background: #0f172a; }
        .elite-mobile-overlay.open { transform: translateY(0); }

        .mobile-menu-header { display: flex; justify-content: space-between; align-items: center; height: 60px; margin-bottom: 40px; }
        .elite-close-btn { background: #f8fafc; border: none; width: 56px; height: 56px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: var(--fg); cursor: pointer; transition: 0.3s; }
        .elite-close-btn:hover { transform: rotate(90deg); background: #f1f5f9; }
        :global(.men-theme) .elite-close-btn { background: rgba(255,255,255,0.05); }

        .mobile-menu-body { flex: 1; display: flex; flex-direction: column; justify-content: center; }
        
        .mobile-user-greeting { margin-bottom: 50px; }
        .greeting-label { font-size: 13px; font-weight: 800; color: var(--primary); text-transform: uppercase; letter-spacing: 2px; }
        .greeting-name { font-size: 38px; font-weight: 950; color: var(--fg); letter-spacing: -2px; margin-top: 5px; }

        .mobile-elite-links { display: flex; flex-direction: column; gap: 15px; }
        .m-elite-link {
          display: flex; align-items: center; gap: 25px; padding: 25px 0;
          text-decoration: none; border-bottom: 1px solid #f1f5f9;
          transform: translateY(20px); opacity: 0;
          transition: 0.5s;
        }
        :global(.men-theme) .m-elite-link { border-bottom-color: rgba(255,255,255,0.05); }
        .open .m-elite-link { transform: translateY(0); opacity: 1; animation: slideUpElite 0.8s forwards; }
        @keyframes slideUpElite { to { transform: translateY(0); opacity: 1; } }

        .link-num { font-size: 12px; font-weight: 950; font-family: 'JetBrains Mono', monospace; color: var(--primary); opacity: 0.5; }
        .link-txt { font-size: 24px; font-weight: 950; color: var(--fg); flex: 1; letter-spacing: -1.2px; }
        .link-arrow { color: #cbd5e1; transition: 0.3s; }
        .m-elite-link:hover .link-txt { color: var(--primary); padding-left: 10px; }
        .m-elite-link:hover .link-arrow { transform: translateX(10px); color: var(--primary); }
        .m-elite-link.accent-pink .link-txt { color: #ec4899; }

        .mobile-menu-footer { margin-top: 50px; paddingTop: 30px; border-top: 1px solid #f1f5f9; }
        :global(.men-theme) .mobile-menu-footer { border-top-color: rgba(255,255,255,0.05); }

        .footer-socials { display: flex; gap: 15px; margin-bottom: 30px; }
        .social-pill { 
          display: flex; align-items: center; gap: 8px; padding: 12px 20px;
          background: #f8fafc; border-radius: 100px; font-size: 13px;
          font-weight: 900; color: #64748b; text-decoration: none;
        }
        :global(.men-theme) .social-pill { background: rgba(255,255,255,0.05); color: #94a3b8; }

        .footer-meta { display: flex; justify-content: space-between; align-items: center; font-size: 12px; font-weight: 800; color: #94a3b8; }
        .m-logout-btn { background: none; border: none; color: #f43f5e; font-weight: 950; display: flex; align-items: center; gap: 6px; cursor: pointer; }

        .animate-fade-in { animation: fadeIn 1s forwards; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

        .mobile-only { display: none; }
        .desktop-only { display: flex; }

        @media (max-width: 960px) {
           .desktop-only { display: none !important; }
           .mobile-only { display: flex !important; }
           .nav-blur-container { padding-right: 8px; height: 60px; border-radius: 50px; }
        }
      `}</style>
    </>
  );
}
