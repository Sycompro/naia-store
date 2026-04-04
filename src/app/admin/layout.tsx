'use client';
import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Package, Image as ImageIcon, Settings, LogOut, ChevronRight, MessageSquare, ShoppingBag } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading: authLoading, logout } = useAuth();
  const [storeName, setStoreName] = React.useState('NaiaAdmin');
  const [unreadCount, setUnreadCount] = React.useState(0);
  const [isVerifying, setIsVerifying] = React.useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  const isLoginPage = pathname?.startsWith('/admin/login');

  React.useEffect(() => {
    setIsSidebarOpen(false);
  }, [pathname]);

  React.useEffect(() => {
    if (!authLoading) {
      if (!isLoginPage && (!user || user.role !== 'ADMIN')) {
        router.push('/admin/login');
      } else {
        setIsVerifying(false);
        if (!isLoginPage) fetchConfigs();
      }
    }
  }, [user, authLoading, pathname]);

  const fetchConfigs = async () => {
    try {
      // 1. Fetch Store Name
      const sRes = await fetch('/api/admin/settings');
      if (sRes.ok) {
        const data = await sRes.json();
        if (data.storeName) setStoreName(data.storeName.replace(' Beauty Store', ''));
      }

      // 2. Fetch Unread Chats
      const cRes = await fetch('/api/chat/messages/unread'); // We'll need this API
      if (cRes.ok) {
        const data = await cRes.json();
        setUnreadCount(data.count || 0);
      }
    } catch (e) { }
  };

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
    { name: 'Productos', icon: <Package size={20} />, path: '/admin/productos' },
    { name: 'Pedidos', icon: <ShoppingBag size={20} />, path: '/admin/pedidos' },
    { name: 'Historias', icon: <ImageIcon size={20} />, path: '/admin/historias' },
    { name: 'Chat', icon: <MessageSquare size={20} />, path: '/admin/chat', badge: unreadCount },
    { name: 'Configuración', icon: <Settings size={20} />, path: '/admin/config' },
  ];

  // Si es la página de login, renderizamos sin el marco administrativo
  if (isLoginPage) {
    return (
      <div className="admin-login-layout">
        {children}
        <style jsx>{`
          .admin-login-layout {
            min-height: 100vh;
            background: #0a0e17;
            display: flex;
            align-items: center;
            justify-content: center;
          }
        `}</style>
      </div>
    );
  }

  // Mientras verifica o carga el auth
  if (authLoading || (isVerifying && !isLoginPage)) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <style jsx>{`
          .admin-loading { height: 100vh; display: flex; align-items: center; justify-content: center; background: #0a0e17; }
          .spinner { width: 40px; height: 40px; border: 4px solid rgba(255,255,255,0.1); border-top-color: #fff; border-radius: 50%; animation: spin 1s linear infinite; }
          @keyframes spin { to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div className={`admin-layout ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      {/* Overlay para móviles */}
      <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>

      {/* Sidebar */}
      <aside className="admin-sidebar glass-dark">
        <div className="sidebar-header">
          <Link href="/" className="admin-logo">
            {storeName.split(' ')[0]}<span>{storeName.split(' ')[1] || 'Admin'}</span>
          </Link>
          <button className="mobile-close mobile-only" onClick={() => setIsSidebarOpen(false)}>
            <ChevronRight size={24} style={{ transform: 'rotate(180deg)' }} />
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`nav-item ${pathname === item.path ? 'active' : ''}`}
            >
              <div className="item-icon-wrap">
                {item.icon}
                {item.badge ? <span className="unread-dot animate-pulse-fast">{item.badge}</span> : null}
              </div>
              <span>{item.name}</span>
              <ChevronRight className="arrow" size={14} />
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main">
        <header className="admin-header glass-dark">
          <div className="header-left">
            <button className="mobile-menu-btn mobile-only" onClick={() => setIsSidebarOpen(true)}>
              <div className="menu-icon-line"></div>
              <div className="menu-icon-line"></div>
              <div className="menu-icon-line"></div>
            </button>
            <h1 className="animate-fade-in">{menuItems.find(i => i.path === pathname)?.name || 'Panel Admin'}</h1>
          </div>
          <div className="header-right">
            <div className="admin-profile glass-premium-dark">
              <div className="avatar shadow-premium">AD</div>
              <span className="desktop-only text-white">Administrador</span>
            </div>
          </div>
        </header>
        <section className="admin-content">
          {children}
        </section>
      </main>

      <style jsx>{`
        .admin-layout {
          display: flex;
          min-height: 100vh;
          background: #0a0e17;
          color: #f8fafc;
          font-family: var(--font-main);
          overflow-x: hidden;
        }
        
        .sidebar-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          backdrop-filter: blur(4px);
          z-index: 95;
          opacity: 0;
          transition: 0.3s;
          pointer-events: none;
        }

        .admin-sidebar {
          width: 280px;
          height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          display: flex;
          flex-direction: column;
          padding: 30px 20px;
          background: #0a0e17;
          border-right: 1px solid rgba(255, 255, 255, 0.05);
          z-index: 100;
          transition: transform 0.4s cubic-bezier(0.19, 1, 0.22, 1);
        }

        .glass-dark {
          background: rgba(10, 14, 23, 0.8) !important;
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .sidebar-header {
          padding: 0 10px 40px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .admin-logo {
          font-size: 28px;
          font-weight: 900;
          color: #f8fafc;
          text-decoration: none;
          letter-spacing: -0.5px;
        }
        .admin-logo span {
          color: var(--primary);
          background: linear-gradient(135deg, var(--primary) 0%, #ff4d94 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .sidebar-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 20px;
          border-radius: 16px;
          text-decoration: none;
          color: #94a3b8;
          font-weight: 600;
          font-size: 15px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid transparent;
        }
        .nav-item:hover {
          background: rgba(255, 255, 255, 0.05);
          color: #f8fafc;
          transform: translateX(5px);
        }
        .nav-item.active {
          background: linear-gradient(135deg, #334155 0%, #0f172a 100%);
          color: white;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .nav-item.active .arrow {
          opacity: 1;
          transform: rotate(90deg);
        }
        .item-icon-wrap { position: relative; display: flex; align-items: center; }
        .unread-dot {
          position: absolute; top: -8px; right: -8px;
          background: #ef4444; color: white; border-radius: 50%;
          width: 18px; height: 18px; font-size: 10px; font-weight: 900;
          display: flex; align-items: center; justify-content: center;
          border: 2px solid #0a0e17;
        }
        
        .sidebar-footer {
          margin-top: auto;
          padding-top: 20px;
        }
        .logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 20px;
          border: none;
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          font-weight: 700;
          cursor: pointer;
          border-radius: 16px;
          transition: all 0.3s;
        }
        .logout-btn:hover {
          background: #ef4444;
          color: white;
          box-shadow: 0 8px 20px rgba(239, 68, 68, 0.2);
        }

        .admin-main {
          flex: 1;
          margin-left: 280px;
          padding: 40px;
          background: #0a0e17;
          min-height: 100vh;
          transition: padding 0.3s;
        }

        .admin-header {
          height: 80px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 30px;
          margin-bottom: 40px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
        }
        
        .mobile-menu-btn {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
          padding: 10px;
          margin-right: 15px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          cursor: pointer;
        }
        .menu-icon-line {
          width: 22px;
          height: 2px;
          background: white;
          border-radius: 2px;
        }

        .admin-profile {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 8px 16px;
          border-radius: 14px;
        }
        .glass-premium-dark {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.08);
        }
        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: linear-gradient(135deg, var(--primary) 0%, #ff4d94 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 13px;
        }
        
        .mobile-only { display: none; }
        .desktop-only { display: flex; }

        @media (max-width: 1024px) {
          .admin-sidebar {
            transform: translateX(-100%);
          }
          .sidebar-open .admin-sidebar {
            transform: translateX(0);
          }
          .sidebar-open .sidebar-overlay {
            display: block;
            opacity: 1;
            pointer-events: auto;
          }
          .admin-main {
            margin-left: 0;
            padding: 24px 16px;
          }
          .mobile-only { display: flex; }
          .desktop-only { display: none; }
          .admin-header {
            padding: 0 16px;
            margin-bottom: 24px;
          }
          .admin-header h1 { font-size: 20px; }
        }
        
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in { animation: fadeIn 0.8s; }
        .admin-content { animation: slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
      `}</style>
    </div>
  );
}
