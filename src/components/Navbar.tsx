'use client';
import React, { useState, useEffect } from 'react';
import { ShoppingBag, Menu, User, Sparkles, Moon, Sun, Search, Heart, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import CartDrawer from './CartDrawer';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState<'woman' | 'man'>('woman');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const { totalItems } = useCart();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
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
    <nav className={`navbar ${isScrolled ? 'scrolled glass' : ''}`}>
      <div className="container nav-content">
        <div className="nav-left">
          <Menu className="mobile-menu" />
          <Link href="/" className="logo">
            Naia<span className="logo-heart">❤</span>
          </Link>
        </div>

        <div className="nav-center desktop-only">
          <Link href="/productos" className="nav-link">Productos</Link>
          <Link href="/novedades" className="nav-link">Novedades</Link>
          <Link href="/nosotros" className="nav-link">Nosotros</Link>
          <Link href="/contacto" className="nav-link">Contacto</Link>
        </div>

        <div className="nav-right">
          <button onClick={toggleTheme} className={`theme-toggle ${theme}`}>
            {theme === 'woman' ? 'Ella' : 'Él'}
          </button>

          <div className="nav-actions">
            <button className="nav-icon-btn cart-btn" onClick={() => setIsCartOpen(true)}>
              <ShoppingBag size={22} />
              {totalItems > 0 && <span className="cart-badge">{totalItems}</span>}
            </button>

            {user ? (
              <div className="user-nav">
                <span className="user-name desktop-only">{user.name || 'Usuario'}</span>
                <button onClick={logout} className="logout-btn">
                  <User className="nav-icon" />
                  <span className="logout-tooltip">Cerrar Sesión</span>
                </button>
              </div>
            ) : (
              <Link href="/auth/login" className="login-link">
                <User className="nav-icon" />
              </Link>
            )}
          </div>

          <button className="nav-icon-btn mobile-only"><Menu size={22} /></button>
        </div>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

      <style jsx>{`
        .cart-btn { position: relative; background: none; border: none; cursor: pointer; color: var(--fg); }
        .cart-badge {
          position: absolute;
          top: -5px;
          right: -5px;
          background: var(--primary);
          color: white;
          font-size: 10px;
          font-weight: 700;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 2px solid white;
        }
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 80px;
          display: flex;
          align-items: center;
          z-index: 1000;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          background: transparent;
        }
        .navbar.scrolled {
          height: 70px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .nav-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
        }
        .logo {
          font-size: 28px;
          font-weight: 800;
          color: var(--primary);
          text-decoration: none;
          letter-spacing: -1px;
          display: flex;
          align-items: center;
        }
        .logo-heart {
          font-size: 18px;
          margin-left: 2px;
          color: var(--primary-dark);
        }
        .nav-link {
          margin: 0 20px;
          text-decoration: none;
          color: var(--fg);
          font-weight: 500;
          font-size: 15px;
          transition: color 0.3s;
          position: relative;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          bottom: -5px;
          left: 0;
          width: 0;
          height: 2px;
          background: var(--primary);
          transition: width 0.3s;
        }
        .nav-link:hover::after {
          width: 100%;
        }
        .nav-right {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .nav-icon {
          width: 22px;
          height: 22px;
          cursor: pointer;
          color: var(--fg);
          transition: transform 0.3s;
        }
        .nav-icon:hover {
          transform: translateY(-2px);
          color: var(--primary);
        }
        .theme-toggle {
          padding: 6px 16px;
          border-radius: 20px;
          border: 2px solid var(--primary);
          background: transparent;
          color: var(--primary);
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s;
        }
        .theme-toggle.man {
          background: var(--primary);
          color: white;
        }
        .cart-wrapper {
          position: relative;
        }
        .cart-count {
          position: absolute;
          top: -8px;
          right: -8px;
          background: var(--primary-dark);
          color: white;
          font-size: 10px;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
        }
        .desktop-only {
          display: none;
        }
        @media (min-width: 768px) {
          .desktop-only {
            display: flex;
          }
          .mobile-menu {
            display: none;
          }
        }
      `}</style>
    </nav>
  );
}
