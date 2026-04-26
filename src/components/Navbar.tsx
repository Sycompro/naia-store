'use client';
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, User, Sparkle, X, LogOut, ChevronRight, Building2, Heart, MessageCircle, Globe, Share2 } from 'lucide-react';
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
    } else {
      setTheme('woman');
      document.body.classList.remove('men-theme');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'woman' ? 'man' : 'woman';
    setTheme(newTheme);
    if (newTheme === 'man') {
      document.body.classList.add('men-theme');
    } else {
      document.body.classList.remove('men-theme');
    }
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
                <Link href="/perfil" className="p-user-btn glass-premium desktop-only" style={{ textDecoration: 'none' }}>
                  <User size={20} strokeWidth={2.5} />
                  <span className="p-user-name">{user?.name?.split(' ')[0] || 'Invitado'}</span>
                </Link>
              ) : (
                <Link href="/auth/login" className="p-icon-btn desktop-only">
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

      <div className={`mobile-overlay ${isMobileMenuOpen ? 'open' : ''}`} onClick={() => setIsMobileMenuOpen(false)}>
        <div className="mobile-menu-content" onClick={e => e.stopPropagation()}>
          <div className="mobile-menu-header">
            <Link href="/" className="premium-logo" onClick={() => setIsMobileMenuOpen(false)}>
              {theme === 'woman' ? 'Naia' : 'Noir'}<span>.</span>
            </Link>
            <button className="close-menu" onClick={() => setIsMobileMenuOpen(false)}><X size={24} /></button>
          </div>

          <div className="mobile-greeting">
            {user ? (
              <>
                <span className="welcome-small">Bienvenida de nuevo,</span>
                <h4 className="welcome-name">{user.name?.split(' ')[0]}</h4>
              </>
            ) : (
              <span className="welcome-small">Explora la belleza de Naia</span>
            )}
          </div>

          <div className="mobile-links">
            <button 
              className="mobile-menu-btn-link"
              onClick={() => {
                setIsMobileMenuOpen(false);
                setIsCartOpen(true);
              }}
            >
              <div className="mobile-link-row" style={{ '--i': 0.5 } as any}>
                <div className="link-content">
                  <ShoppingBag size={20} /> 
                  <span>Mi Carrito</span>
                  {totalItems > 0 && <span className="p-badge-inline">{totalItems}</span>}
                </div>
                <ChevronRight size={16} className="chevron" />
              </div>
            </button>

            <Link href="/productos" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="mobile-link-row" style={{ '--i': 1 } as any}>
                <div className="link-content"><ShoppingBag size={20} /> <span>Productos</span></div>
                <ChevronRight size={16} className="chevron" />
              </div>
            </Link>
            <Link href="/novedades" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="mobile-link-row" style={{ '--i': 2 } as any}>
                <div className="link-content"><Sparkle size={20} /> <span>Novedades</span></div>
                <ChevronRight size={16} className="chevron" />
              </div>
            </Link>
            <Link href="/nosotros" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="mobile-link-row" style={{ '--i': 3 } as any}>
                <div className="link-content"><Heart size={20} /> <span>Nosotros</span></div>
                <ChevronRight size={16} className="chevron" />
              </div>
            </Link>
            <Link href="/contacto" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="mobile-link-row" style={{ '--i': 4 } as any}>
                <div className="link-content"><MessageCircle size={20} /> <span>Contacto</span></div>
                <ChevronRight size={16} className="chevron" />
              </div>
            </Link>
            
            <div className="mobile-divider" style={{ '--i': 5 } as any}></div>
            
            <Link href="/b2b" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="mobile-link-row b2b-mobile-pill" style={{ '--i': 6 } as any}>
                <div className="link-content"><Building2 size={20} /> <span>Portal B2B</span></div>
                <span className="pro-tag">Distribuidor</span>
              </div>
            </Link>
            
            {user && (
              <Link href="/perfil" onClick={() => setIsMobileMenuOpen(false)}>
                <div className="mobile-link-row" style={{ '--i': 7 } as any}>
                  <div className="link-content"><User size={20} /> <span>Mi Perfil</span></div>
                  <ChevronRight size={16} className="chevron" />
                </div>
              </Link>
            )}
          </div>

          <div className="mobile-menu-footer">
            <div className="m-socials">
              <Globe size={18} />
              <Share2 size={18} />
            </div>
            <p>© 2026 Naia - Luxury Experience</p>
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
          .desktop-only { display: none; }
          .p-user-name { display: none; }
          .p-actions { gap: 10px; }
          .nav-right { gap: 12px; }
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
          background: #ffffff !important;
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
          .nav-container { padding: 0 12px; height: 60px; border-radius: 30px; width: 96%; }
          .premium-logo { font-size: 19px !important; }
          .logo-text { font-size: 19px; }
          .logo-dot { width: 4px; height: 4px; }
          .p-theme-toggle { padding: 4px; width: 50px; font-size: 0; }
          .p-theme-toggle span { display: none; }
          .p-theme-toggle .toggle-sphere { width: 20px; height: 20px; }
          .p-actions { gap: 10px; }
          .p-icon-btn { width: 40px; height: 40px; border-radius: 12px; }
          .p-icon-btn :global(svg) { width: 22px; height: 22px; }
          .nav-right { gap: 12px; }
          
          .mobile-menu-content {
            background: #ffffff !important;
            width: 85%;
            max-width: 320px;
            box-shadow: -10px 0 50px rgba(0,0,0,0.1);
            display: flex;
            flex-direction: column;
            padding: 30px;
            border-left: 1px solid rgba(0,0,0,0.05);
          }
          :global(.men-theme) .mobile-menu-content {
            background: #ffffff !important;
            border-left-color: rgba(0,0,0,0.05);
          }
          
          .mobile-menu-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 40px;
          }
          .mobile-greeting {
            margin-bottom: 30px;
          }
          .welcome-small {
            font-size: 12px;
            font-weight: 700;
            color: var(--slate-400);
            text-transform: uppercase;
            letter-spacing: 0.1em;
          }
          .welcome-name {
            font-size: 24px;
            font-weight: 900;
            color: var(--fg);
            margin: 0;
            letter-spacing: -1px;
          }

          .mobile-links {
            display: flex;
            flex-direction: column;
            gap: 12px;
            margin-top: 0;
            flex: 1;
          }
          .mobile-links a {
            text-decoration: none;
            display: block;
            width: 100%;
          }
          .mobile-link-row {
            display: flex !important;
            align-items: center !important;
            justify-content: space-between !important;
            padding: 16px 0;
            width: 100%;
            border-bottom: 1px solid rgba(0,0,0,0.03);
            color: var(--fg);
            opacity: 0;
            transform: translateX(20px);
            transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
            transition-delay: calc(var(--i) * 0.1s);
            flex-wrap: nowrap !important;
          }
          .mobile-overlay.open .mobile-link-row {
            opacity: 1;
            transform: translateX(0);
          }
          :global(.men-theme) .mobile-link-row {
            border-bottom-color: rgba(255,255,255,0.05);
          }
          
          .link-content {
            display: flex;
            align-items: center;
            gap: 15px;
            flex: 1;
            min-width: 0;
          }
          .link-content span {
            font-size: 18px;
            font-weight: 850;
            letter-spacing: -0.5px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          .chevron {
            color: var(--slate-300);
            transition: transform 0.3s;
            flex-shrink: 0;
          }
          .mobile-links a:active .chevron {
            transform: translateX(5px);
            color: var(--primary);
          }

          .mobile-divider {
            height: 1px;
            background: rgba(0,0,0,0.03);
            margin: 10px 0;
            opacity: 0;
            transition: opacity 0.5s;
            transition-delay: calc(var(--i) * 0.1s);
          }
          .mobile-overlay.open .mobile-divider { opacity: 1; }

          .mobile-menu-btn-link {
            background: none;
            border: none;
            padding: 0;
            width: 100%;
            text-align: left;
            cursor: pointer;
            font-family: inherit;
          }

          .p-badge-inline {
            background: var(--grad-primary);
            color: white;
            font-size: 10px;
            font-weight: 900;
            padding: 2px 8px;
            border-radius: 10px;
            margin-left: 8px;
          }

          .b2b-mobile-pill {
            background: var(--primary-light);
            padding: 16px !important;
            border-radius: 16px;
            border-bottom: none !important;
            color: var(--primary) !important;
          }
          .pro-tag {
            font-size: 10px;
            background: var(--primary);
            color: white;
            padding: 2px 8px;
            border-radius: 20px;
            font-weight: 800;
            text-transform: uppercase;
          }

          .mobile-menu-footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid rgba(0,0,0,0.03);
          }
          .m-socials {
            display: flex;
            gap: 20px;
            margin-bottom: 10px;
            color: var(--slate-400);
          }
          .mobile-menu-footer p {
            font-size: 11px;
            color: var(--slate-400);
            font-weight: 600;
          }
        }
      `}</style>
    </>
  );
}
