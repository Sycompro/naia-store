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
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
    { name: 'Productos', icon: <Package size={20} />, path: '/admin/productos' },
    { name: 'Pedidos', icon: <ShoppingBag size={20} />, path: '/admin/pedidos' },
    { name: 'Historias', icon: <ImageIcon size={20} />, path: '/admin/historias' },
    { name: 'Chat', icon: <MessageSquare size={20} />, path: '/admin/chat' },
    { name: 'Configuración', icon: <Settings size={20} />, path: '/admin/config' },
  ];

  return (
    <div className="admin-layout">
      {/* Sidebar */}
      <aside className="admin-sidebar glass">
        <div className="sidebar-header">
          <Link href="/" className="admin-logo">
            Naia<span>Admin</span>
          </Link>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`nav-item ${pathname === item.path ? 'active' : ''}`}
            >
              {item.icon}
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
        <header className="admin-header glass">
          <div className="header-left">
            <h1>{menuItems.find(i => i.path === pathname)?.name || 'Panel Admin'}</h1>
          </div>
          <div className="header-right">
            <div className="admin-profile">
              <div className="avatar">AD</div>
              <span>Administrador</span>
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
          background: #f8fafc;
          color: #0f172a;
          font-family: var(--font-main);
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
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-right: 1px solid rgba(255, 255, 255, 0.5);
          z-index: 100;
          box-shadow: 10px 0 30px rgba(0, 0, 0, 0.02);
        }
        .sidebar-header {
          padding: 0 10px 40px;
        }
        .admin-logo {
          font-size: 28px;
          font-weight: 900;
          color: #0f172a;
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
          color: #64748b;
          font-weight: 600;
          font-size: 15px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid transparent;
        }
        .nav-item:hover {
          background: rgba(255, 255, 255, 0.8);
          color: #0f172a;
          transform: translateX(5px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
        }
        .nav-item.active {
          background: #0f172a;
          color: white;
          box-shadow: 0 10px 25px rgba(15, 23, 42, 0.2);
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .nav-item .arrow {
          margin-left: auto;
          opacity: 0;
          transition: 0.3s;
        }
        .nav-item.active .arrow {
          opacity: 1;
          transform: rotate(90deg);
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
          background: rgba(239, 68, 68, 0.05);
          color: #ef4444;
          font-weight: 700;
          cursor: pointer;
          border-radius: 16px;
          transition: all 0.3s;
        }
        .logout-btn:hover {
          background: #ef4444;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(239, 68, 68, 0.2);
        }
        .admin-main {
          flex: 1;
          margin-left: 280px;
          padding: 40px;
          background: #f8fafc;
        }
        .admin-header {
          height: 80px;
          background: rgba(255, 255, 255, 0.6);
          backdrop-filter: blur(15px);
          border-radius: 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 30px;
          margin-bottom: 40px;
          border: 1px solid rgba(255, 255, 255, 0.8);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
        }
        .admin-header h1 {
          font-size: 24px;
          font-weight: 900;
          letter-spacing: -0.5px;
        }
        .admin-profile {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 8px 16px;
          background: white;
          border-radius: 14px;
          border: 1px solid rgba(0,0,0,0.05);
        }
        .avatar {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, #0f172a 0%, #334155 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 800;
          font-size: 14px;
          box-shadow: 0 8px 16px rgba(0,0,0,0.1);
        }
        .admin-profile span {
          font-weight: 700;
          font-size: 14px;
          color: #334155;
        }
        .admin-content {
          animation: slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
