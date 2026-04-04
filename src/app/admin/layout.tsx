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

  const [openMenus, setOpenMenus] = React.useState<string[]>([]);

  const toggleSubMenu = (name: string) => {
    setOpenMenus(prev =>
      prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]
    );
  };

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
    {
      name: 'Productos',
      icon: <Package size={20} />,
      path: '/admin/productos',
      subItems: [
        { name: 'Inventario', path: '/admin/productos' },
        { name: 'Categorías', path: '/admin/categorias' },
        { name: 'Stock Bajo', path: '/admin/productos?filter=low-stock' },
      ]
    },
    {
      name: 'Pedidos',
      icon: <ShoppingBag size={20} />,
      path: '/admin/pedidos',
      subItems: [
        { name: 'Todos los Pedidos', path: '/admin/pedidos' },
        { name: 'Pendientes', path: '/admin/pedidos?status=pendiente' },
      ]
    },
    { name: 'Historias', icon: <ImageIcon size={20} />, path: '/admin/historias' },
    { name: 'Chat', icon: <MessageSquare size={20} />, path: '/admin/chat', badge: unreadCount },
    {
      name: 'Configuración',
      icon: <Settings size={20} />,
      path: '/admin/config',
      subItems: [
        { name: 'General', path: '/admin/config' },
        { name: 'WhatsApp API', path: '/admin/config#whatsapp' },
        { name: 'Seguridad', path: '/admin/config#security' },
      ]
    },
  ];

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

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
      <div className="sidebar-overlay" onClick={() => setIsSidebarOpen(false)}></div>

      <aside className="admin-sidebar glass-sidebar">
        <div className="sidebar-header">
          <Link href="/admin" className="admin-logo">
            Naia<span className="text-white opacity-40">Admin</span>
          </Link>
          <button className="mobile-close mobile-only" onClick={() => setIsSidebarOpen(false)}>
            <ChevronRight size={24} style={{ transform: 'rotate(180deg)' }} />
          </button>
        </div>

        <nav className="sidebar-nav custom-scrollbar">
          {menuItems.map((item) => {
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isOpen = openMenus.includes(item.name);
            const isActive = pathname === item.path || item.subItems?.some(s => s.path === pathname);

            return (
              <div key={item.name} className="menu-group">
                <div
                  className={`nav-item ${isActive ? 'active' : ''} ${hasSubItems ? 'has-sub' : ''}`}
                  onClick={() => hasSubItems ? toggleSubMenu(item.name) : router.push(item.path)}
                >
                  <div className="item-icon-wrap">
                    {item.icon}
                    {item.badge ? <span className="unread-dot">{item.badge}</span> : null}
                  </div>
                  <span className="item-label">{item.name}</span>
                  {hasSubItems && (
                    <ChevronRight
                      className={`arrow-transition ${isOpen ? 'rotate-90' : ''}`}
                      size={16}
                    />
                  )}
                </div>

                {hasSubItems && (
                  <div className={`sub-menu-container ${isOpen ? 'expanded' : ''}`}>
                    {item.subItems?.map(sub => (
                      <Link
                        key={sub.name}
                        href={sub.path}
                        className={`sub-item ${pathname === sub.path ? 'sub-active' : ''}`}
                      >
                        <div className="sub-dot"></div>
                        <span>{sub.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-card-mini">
            <div className="avatar-mini">AD</div>
            <div className="user-info-mini">
              <span className="user-name-mini">Administrador</span>
              <span className="user-role-mini">Super Admin</span>
            </div>
          </div>
          <button className="logout-btn-minimal" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <header className="admin-header glass-header">
          <div className="header-left">
            <button className="mobile-menu-btn mobile-only" onClick={() => setIsSidebarOpen(true)}>
              <div className="menu-icon-line"></div>
              <div className="menu-icon-line"></div>
              <div className="menu-icon-line"></div>
            </button>
            <h1 className="animate-fade-in">{menuItems.find(i => i.path === pathname || i.subItems?.some(s => s.path === pathname))?.name || 'Panel Admin'}</h1>
          </div>
          <div className="header-right desktop-only">
            <div className="admin-profile glass-status">
              <div className="avatar shadow-premium">AD</div>
              <div className="flex flex-col ml-3">
                <span className="text-white text-[11px] font-bold opacity-60 uppercase tracking-tighter">Server Status</span>
                <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse"></div>
                  Online
                </span>
              </div>
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
          background: #020617;
          color: #f8fafc;
          font-family: inherit;
          overflow-x: hidden;
        }
        
        .sidebar-overlay {
          display: none;
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.7);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 95;
          opacity: 0;
          transition: 0.3s;
          pointer-events: none;
        }

        .admin-sidebar {
          width: 300px;
          height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          display: flex;
          flex-direction: column;
          padding: 30px 20px;
          z-index: 100;
          transition: transform 0.5s cubic-bezier(0.19, 1, 0.22, 1);
        }

        .glass-sidebar {
          background: rgba(15, 23, 42, 0.6);
          backdrop-filter: blur(30px);
          -webkit-backdrop-filter: blur(30px);
          border-right: 1px solid rgba(255, 255, 255, 0.05);
        }

        .sidebar-header {
          padding: 0 10px 45px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .admin-logo {
          font-size: 30px;
          font-weight: 950;
          color: #fff;
          text-decoration: none;
          letter-spacing: -1.5px;
        }

        .sidebar-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 6px;
          overflow-y: auto;
          margin: 0 -10px;
          padding: 0 10px;
        }

        .menu-group {
            margin-bottom: 4px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 18px;
          border-radius: 18px;
          text-decoration: none;
          color: #64748b;
          font-weight: 700;
          font-size: 15px;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid transparent;
        }
        
        .nav-item:hover {
          background: rgba(255, 255, 255, 0.03);
          color: #cbd5e1;
          transform: translateX(4px);
        }
        
        .nav-item.active {
          background: rgba(255, 255, 255, 0.07);
          color: #fff;
          border-color: rgba(255, 255, 255, 0.1);
        }

        .item-icon-wrap { position: relative; display: flex; align-items: center; }
        .unread-dot {
          position: absolute; top: -10px; right: -10px;
          background: #ef4444; color: white; border-radius: 20px;
          min-width: 20px; height: 20px; font-size: 10px; font-weight: 950;
          display: flex; align-items: center; justify-content: center;
          border: 3px solid #0f172a;
          padding: 0 4px;
        }

        .item-label { flex: 1; }

        .arrow-transition {
            color: #475569;
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .rotate-90 { transform: rotate(90deg); color: #fff; }

        .sub-menu-container {
            overflow: hidden;
            max-height: 0;
            transition: max-height 0.5s cubic-bezier(0.19, 1, 0.22, 1);
            padding-left: 36px;
            display: flex;
            flex-direction: column;
            gap: 4px;
        }
        .sub-menu-container.expanded {
            max-height: 500px;
            margin-top: 4px;
            margin-bottom: 12px;
        }

        .sub-item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 10px 16px;
            border-radius: 12px;
            color: #475569;
            text-decoration: none;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.2s;
        }
        .sub-item:hover {
            color: #fff;
            background: rgba(255, 255, 255, 0.03);
            transform: translateX(3px);
        }
        .sub-item.sub-active {
            color: #fff;
            background: rgba(255, 255, 255, 0.05);
        }

        .sub-dot {
            width: 4px;
            height: 4px;
            background: currentColor;
            border-radius: 50%;
            opacity: 0.4;
        }

        .sidebar-footer {
          margin-top: auto;
          padding-top: 20px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }

        .user-card-mini {
            background: rgba(0, 0, 0, 0.2);
            padding: 15px;
            border-radius: 20px;
            display: flex;
            align-items: center;
            gap: 12px;
            border: 1px solid rgba(255, 255, 255, 0.03);
        }
        .avatar-mini {
            width: 38px;
            height: 38px;
            border-radius: 12px;
            background: #1e293b;
            color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 800;
            font-size: 14px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        .user-info-mini {
            display: flex;
            flex-direction: column;
        }
        .user-name-mini { font-size: 14px; font-weight: 700; color: #fff; }
        .user-role-mini { font-size: 11px; font-weight: 600; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; }

        .logout-btn-minimal {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 14px;
          background: rgba(239, 68, 68, 0.05);
          color: #ef4444;
          font-weight: 750;
          border: 1px solid rgba(239, 68, 68, 0.1);
          border-radius: 18px;
          cursor: pointer;
          transition: all 0.3s;
          font-size: 14px;
        }
        .logout-btn-minimal:hover {
          background: #ef4444;
          color: white;
          box-shadow: 0 8px 20px rgba(239, 68, 68, 0.2);
          transform: translateY(-2px);
        }

        .admin-main {
          flex: 1;
          margin-left: 300px;
          padding: 40px;
          min-height: 100vh;
          transition: 0.3s;
        }

        .glass-header {
            background: rgba(15, 23, 42, 0.4);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
        }
        .admin-header {
          height: 85px;
          border-radius: 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 35px;
          margin-bottom: 40px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
        }

        .glass-status {
            background: rgba(255, 255, 255, 0.03);
            border: 1px solid rgba(255, 255, 255, 0.05);
            padding: 8px 18px;
            border-radius: 18px;
        }
        
        @media (max-width: 1024px) {
          .admin-sidebar { transform: translateX(-100%); width: 280px; }
          .sidebar-open .admin-sidebar { transform: translateX(0); }
          .sidebar-open .sidebar-overlay { display: block; opacity: 1; pointer-events: auto; }
          .admin-main { margin-left: 0; padding: 25px 15px; }
          .mobile-only { display: flex; }
          .desktop-only { display: none; }
          .admin-header { padding: 0 20px; margin-bottom: 30px; }
        }

        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }
      `}</style>
    </div>
  );
}
