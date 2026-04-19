'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Settings,
  LogOut,
  MessageSquare,
  Image as ImageIcon,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { logout } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const isLoginPage = pathname === '/admin/login';

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const res = await fetch('/api/chat/unread-count');
        if (res.ok) {
          const data = await res.json();
          setUnreadCount(data.count);
        }
      } catch (e) { }
    };
    if (!isLoginPage) {
      fetchUnread();
      const interval = setInterval(fetchUnread, 30000);
      return () => clearInterval(interval);
    }
  }, [isLoginPage, pathname]);

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={22} />, path: '/admin' },
    { name: 'Productos', icon: <Package size={22} />, path: '/admin/productos', hasArrow: true },
    { name: 'Pedidos', icon: <ShoppingBag size={22} />, path: '/admin/pedidos', hasArrow: true },
    { name: 'Historias', icon: <ImageIcon size={22} />, path: '/admin/historias' },
    { name: 'Chat', icon: <MessageSquare size={22} />, path: '/admin/chat', badge: unreadCount },
    { name: 'Configuración', icon: <Settings size={22} />, path: '/admin/config', hasArrow: true },
  ];

  const handleLogout = () => {
    logout();
    router.push('/admin/login');
  };

  if (isLoginPage) {
    return (
      <div style={{ minHeight: '100vh', background: '#fff' }}>
        {children}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: "'Outfit', sans-serif" }}>
      {/* Sidebar */}
      <aside style={{
        width: isCollapsed ? '90px' : '280px',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        background: '#fff',
        padding: isCollapsed ? '30px 15px' : '30px 20px',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 1000,
        borderRight: '1px solid #e2e8f0',
        boxShadow: '10px 0 30px rgba(0,0,0,0.02)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'space-between', marginBottom: '40px', padding: '0 10px' }}>
          {!isCollapsed && (
            <Link href="/admin" style={{ fontSize: '26px', fontWeight: 900, color: '#1e293b', letterSpacing: '-1.5px', textDecoration: 'none' }}>
              Naia<span style={{ color: '#ec4899' }}>.</span>
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
              width: '32px', height: '32px', borderRadius: '10px', background: '#f1f5f9', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', transition: '0.3s'
            }}
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </button>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto' }} className="custom-scrollbar-v3 text-sm">
          {menuItems.map((item) => {
            const isActive = pathname === item.path || (pathname.startsWith(item.path) && item.path !== '/admin');
            return (
              <Link
                key={item.name}
                href={item.path}
                className="admin-nav-item"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: isCollapsed ? '15px 0' : '12px 18px',
                  borderRadius: '14px',
                  color: isActive ? '#ec4899' : '#64748b',
                  background: isActive ? '#fdf2f8' : 'transparent',
                  fontWeight: isActive ? 800 : 600,
                  fontSize: '15px',
                  transition: '0.3s',
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  textDecoration: 'none',
                  position: 'relative'
                }}
              >
                <div style={{ position: 'relative', width: isCollapsed ? 'auto' : '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {item.icon}
                  {item.badge && item.badge > 0 ? (
                    <span style={{
                      position: 'absolute', top: '-6px', right: '-8px', background: '#f43f5e', color: '#fff', fontSize: '10px',
                      width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, border: '2px solid #fff'
                    }}>{item.badge}</span>
                  ) : null}
                </div>
                {!isCollapsed && <span style={{ marginLeft: '12px', flex: 1 }}>{item.name}</span>}
                {!isCollapsed && item.hasArrow && isActive && <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#ec4899' }}></div>}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '15px', paddingTop: '20px', borderTop: '1px solid #f1f5f9' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px', padding: isCollapsed ? '10px 0' : '12px',
            background: isCollapsed ? 'transparent' : '#f8fafc', borderRadius: '16px', justifyContent: isCollapsed ? 'center' : 'flex-start',
            border: '1px solid #f1f5f9'
          }}>
            <div style={{ 
                width: '40px', height: '40px', background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)', 
                borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', 
                fontWeight: 800, fontSize: '14px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
            }}>AD</div>
            {!isCollapsed && (
              <div style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <span style={{ fontSize: '14px', fontWeight: 800, color: '#1e293b', whiteSpace: 'nowrap' }}>Administrador</span>
                <span style={{ fontSize: '10px', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Panel Principal</span>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '14px',
              borderRadius: '16px', background: '#fff', color: '#64748b', border: '1px solid #e2e8f0',
              fontWeight: 700, cursor: 'pointer', transition: '0.3s', width: isCollapsed ? '48px' : '100%', margin: '0 auto', fontSize: '14px'
            }}
            className="logout-btn"
          >
            <LogOut size={18} />
            {!isCollapsed && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, marginLeft: isCollapsed ? '90px' : '280px', padding: '40px', transition: 'margin-left 0.3s' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
            {children}
        </div>
      </main>

      <style jsx global>{`
        .custom-scrollbar-v3::-webkit-scrollbar { width: 0; }
        .admin-nav-item:hover { color: #ec4899 !important; background: #fdf2f8 !important; transform: translateX(5px); }
        .logout-btn:hover { color: #f43f5e; border-color: #f43f5e; background: #fff5f5; }
        @font-face {
          font-family: 'Outfit';
          src: url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800;900&display=swap');
        }
      `}</style>
    </div>
  );
}
