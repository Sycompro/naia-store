'use client';
import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Package, Image as ImageIcon, Settings, LogOut, ChevronRight } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const menuItems = [
        { name: 'Dashboard', icon: <LayoutDashboard size={20} />, path: '/admin' },
        { name: 'Productos', icon: <Package size={20} />, path: '/admin/productos' },
        { name: 'Historias', icon: <ImageIcon size={20} />, path: '/admin/historias' },
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
                    <button className="logout-btn">
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
          background: #F0F2F5;
          color: #1A1A1A;
        }
        .admin-sidebar {
          width: 260px;
          height: 100vh;
          position: fixed;
          left: 0;
          top: 0;
          display: flex;
          flex-direction: column;
          padding: 20px;
          border-right: 1px solid rgba(0,0,0,0.05);
          z-index: 100;
        }
        .sidebar-header {
          padding: 20px 0 40px;
        }
        .admin-logo {
          font-size: 24px;
          font-weight: 800;
          color: var(--primary);
          text-decoration: none;
        }
        .admin-logo span {
          color: #333;
          font-weight: 400;
          margin-left: 5px;
        }
        .sidebar-nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border-radius: 12px;
          text-decoration: none;
          color: #555;
          font-weight: 500;
          transition: all 0.3s;
        }
        .nav-item:hover {
          background: rgba(255, 126, 179, 0.05);
          color: var(--primary);
        }
        .nav-item.active {
          background: var(--primary);
          color: white;
          box-shadow: 0 4px 12px rgba(255, 126, 179, 0.3);
        }
        .nav-item .arrow {
          margin-left: auto;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .nav-item:hover .arrow, .nav-item.active .arrow {
          opacity: 1;
        }
        .sidebar-footer {
          padding-top: 20px;
          border-top: 1px solid rgba(0,0,0,0.05);
        }
        .logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          border: none;
          background: transparent;
          color: #ff4d4d;
          font-weight: 600;
          cursor: pointer;
          border-radius: 12px;
          transition: background 0.3s;
        }
        .logout-btn:hover {
          background: rgba(255, 77, 77, 0.05);
        }
        .admin-main {
          flex: 1;
          margin-left: 260px;
          padding: 30px;
        }
        .admin-header {
          height: 70px;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          margin-bottom: 30px;
        }
        .admin-header h1 {
          font-size: 20px;
          font-weight: 700;
        }
        .admin-profile {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: var(--primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 14px;
        }
        .admin-content {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
        </div>
    );
}
