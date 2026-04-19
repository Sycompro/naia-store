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
      <div style={{ minHeight: '100vh', background: '#020617' }}>
        {children}
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#020617', color: '#f8fafc', fontFamily: "'Outfit', sans-serif" }}>
      {/* Sidebar */}
      <aside style={{
        width: isCollapsed ? '90px' : '280px',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        background: '#050a14',
        padding: isCollapsed ? '25px 15px' : '25px 20px',
        display: 'flex',
        flexDirection: 'column',
        transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        zIndex: 1000,
        borderRight: '1px solid rgba(255,255,255,0.03)'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: isCollapsed ? 'center' : 'space-between', marginBottom: '35px', padding: '0 10px' }}>
          {!isCollapsed && (
            <Link href="/admin" style={{ fontSize: '24px', fontWeight: 800, color: '#fff', letterSpacing: '-1px' }}>
              Naia<span style={{ fontWeight: 300, opacity: 0.7 }}>Admin</span>
            </Link>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
              width: '38px', height: '38px', borderRadius: '10px', background: '#fff', border: 'none', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#050a14', boxShadow: '0 4px 12px rgba(255,255,255,0.1)'
            }}
          >
            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto' }} className="custom-scrollbar-v3">
          {menuItems.map((item) => {
            const isActive = pathname === item.path || (pathname.startsWith(item.path) && item.path !== '/admin');
            return (
              <Link
                key={item.name}
                href={item.path}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: isCollapsed ? '16px 0' : '14px 20px',
                  borderRadius: '16px',
                  color: isActive ? '#fff' : '#64748b',
                  background: isActive ? '#111827' : 'transparent',
                  fontWeight: 600,
                  fontSize: '16px',
                  transition: '0.2s',
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  border: isActive ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
                  position: 'relative'
                }}
              >
                <div style={{ position: 'relative', width: isCollapsed ? 'auto' : '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  {item.icon}
                  {item.badge && item.badge > 0 ? (
                    <span style={{
                      position: 'absolute', top: '-6px', right: '-8px', background: '#ef4444', color: '#fff', fontSize: '10px',
                      width: '18px', height: '18px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #050a14'
                    }}>{item.badge}</span>
                  ) : null}
                </div>
                {!isCollapsed && <span style={{ marginLeft: '12px', flex: 1 }}>{item.name}</span>}
                {!isCollapsed && item.hasArrow && <ChevronRight size={14} style={{ opacity: 0.3 }} />}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <div style={{
            display: 'flex', alignItems: 'center', gap: '12px', padding: isCollapsed ? '12px 0' : '16px',
            background: isCollapsed ? 'transparent' : '#0b1220', borderRadius: '20px', justifyContent: isCollapsed ? 'center' : 'flex-start'
          }}>
            <div style={{ width: '42px', height: '42px', background: '#1e293b', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>AD</div>
            {!isCollapsed && (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Administrador</span>
                <span style={{ fontSize: '10px', color: '#475569', fontWeight: 600 }}>SUPER ADMIN</span>
              </div>
            )}
          </div>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '16px',
              borderRadius: '20px', background: 'rgba(239, 68, 68, 0.05)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.1)',
              fontWeight: 700, cursor: 'pointer', transition: '0.2s', width: isCollapsed ? '50px' : '100%', margin: '0 auto'
            }}
          >
            <LogOut size={20} />
            {!isCollapsed && <span>Cerrar Sesión</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main style={{ flex: 1, marginLeft: isCollapsed ? '90px' : '280px', padding: '32px', transition: 'margin-left 0.3s' }}>
        {children}
      </main>

      <style jsx global>{`
        .custom-scrollbar-v3::-webkit-scrollbar { width: 0; }
        @font-face {
          font-family: 'Outfit';
          src: url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;800&display=swap');
        }
      `}</style>
    </div>
  );
}
