'use client';
import React, { useState, useEffect, useRef } from 'react';
import {
    Search,
    MoreVertical,
    MessageSquare,
    User,
    Send,
    CheckCheck,
    ChevronLeft,
    Phone,
    Smile,
    Paperclip,
    Filter
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import AdminPageHeader from '@/components/admin/AdminPageHeader';

interface Conversation {
    id: string;
    phone: string;
    name: string | null;
    lastMessage: string | null;
    unreadCount: number;
    updatedAt: string;
    status: string;
}

interface Message {
    id: string;
    content: string;
    sender: 'USER' | 'ADMIN' | 'SYSTEM';
    createdAt: string;
    type: string;
}

export default function AdminChatPage() {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const scrollRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    useEffect(() => {
        checkAuth();
        fetchConversations();
        const interval = setInterval(fetchConversations, 10000);
        return () => clearInterval(interval);
    }, []);

    const checkAuth = async () => {
        try {
            const res = await fetch('/api/admin/stats');
            if (res.status === 403) {
                router.push('/admin/login');
                return;
            }
        } catch (e) { }
    };

    useEffect(() => {
        if (selectedId) {
            fetchMessages(selectedId);
            const interval = setInterval(() => fetchMessages(selectedId), 5000);
            return () => clearInterval(interval);
        }
    }, [selectedId]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const fetchConversations = async () => {
        try {
            const res = await fetch('/api/chat/conversations');
            if (res.status === 403) {
                setLoading(false);
                return;
            }
            const data = await res.json();
            if (Array.isArray(data)) setConversations(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching conversations:', error);
        }
    };

    const fetchMessages = async (id: string) => {
        try {
            const res = await fetch(`/api/chat/messages?conversationId=${id}`);
            if (res.status === 403) return;
            const data = await res.json();
            if (Array.isArray(data)) setMessages(data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleSend = async () => {
        if (!input.trim() || !selectedId) return;

        const currentConv = conversations.find(c => c.id === selectedId);
        if (!currentConv) return;

        const newMessage = {
            conversationId: selectedId,
            content: input,
            sender: 'ADMIN',
            phone: currentConv.phone,
            type: 'TEXT'
        };

        setInput('');

        try {
            const res = await fetch('/api/chat/messages', {
                method: 'POST',
                body: JSON.stringify(newMessage)
            });
            const savedMsg = await res.json();
            setMessages(prev => [...prev, savedMsg]);
            fetchConversations();
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const activeConv = conversations.find(c => c.id === selectedId);

    const filteredConversations = conversations.filter(c =>
        (c.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.includes(searchTerm)
    );

    return (
        <div className="admin-chat-page-root animate-entrance">
            <AdminPageHeader
                title="Centro de Atención"
                breadcrumb={[{ label: 'Admin', href: '/admin' }, { label: 'Mensajería' }]}
            />

            <div className="admin-chat-layout-wrapper">
                <div className="admin-chat-layout">
                    {/* Sidebar */}
                    <aside className={`chat-sidebar ${selectedId ? 'hide-mobile' : ''}`}>
                        <header className="sidebar-header">
                            <div className="sidebar-title-area">
                                <h2>Mis Chats</h2>
                                <span className="chats-count">{conversations.length} activos</span>
                            </div>
                            <div className="header-actions">
                                <button className="circle-action-btn"><MessageSquare size={18} /></button>
                                <button className="circle-action-btn"><MoreVertical size={18} /></button>
                            </div>
                        </header>

                        <div className="search-box">
                            <div className="search-inner-premium">
                                <Search size={18} color="#94a3b8" />
                                <input
                                    type="text"
                                    placeholder="Buscar cliente..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button className="filter-pill-btn"><Filter size={16} /></button>
                        </div>

                        <div className="conversations-list-premium">
                            {loading ? (
                                <div className="loading-state-chat">Sincronizando...</div>
                            ) : filteredConversations.length === 0 ? (
                                <div className="empty-chat-state-premium">
                                    <MessageSquare size={48} strokeWidth={1} color="#cbd5e1" />
                                    <p>No hay mensajes todavía</p>
                                    <button
                                        className="seed-btn-lite"
                                        onClick={async () => {
                                            await fetch('/api/chat/seed', { method: 'POST' });
                                            fetchConversations();
                                        }}
                                    >
                                        Sincronizar Datos Iniciales
                                    </button>
                                </div>
                            ) : (
                                filteredConversations.map(conv => (
                                    <div
                                        key={conv.id}
                                        className={`conv-item-premium ${selectedId === conv.id ? 'active' : ''}`}
                                        onClick={() => setSelectedId(conv.id)}
                                    >
                                        <div className="avatar-box">
                                            {conv.name ? conv.name.charAt(0).toUpperCase() : <User size={20} />}
                                        </div>
                                        <div className="conv-body">
                                            <div className="conv-header">
                                                <span className="client-name">{conv.name || conv.phone}</span>
                                                <span className="time-stamp">
                                                    {new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <div className="conv-footer">
                                                <p className="last-msg-preview">{conv.lastMessage || 'Nuevo contacto en espera...'}</p>
                                                {conv.unreadCount > 0 && <span className="unread-dot">{conv.unreadCount}</span>}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </aside>

                    {/* Chat Area */}
                    <main className={`chat-main-area ${!selectedId ? 'hide-mobile' : ''}`}>
                        {selectedId && activeConv ? (
                            <>
                                <header className="chat-area-header">
                                    <div className="client-profile">
                                        <button className="back-btn-mobile" onClick={() => setSelectedId(null)}>
                                            <ChevronLeft size={24} />
                                        </button>
                                        <div className="avatar-circle-header">
                                            {activeConv.name ? activeConv.name.charAt(0).toUpperCase() : <User size={20} />}
                                        </div>
                                        <div className="client-info-header">
                                            <h3>{activeConv.name || 'Cliente de WhatsApp'}</h3>
                                            <span>{activeConv.phone} • En línea</span>
                                        </div>
                                    </div>
                                    <div className="header-actions">
                                        <button className="circle-action-btn"><Phone size={18} /></button>
                                        <button className="circle-action-btn"><Search size={18} /></button>
                                        <button className="circle-action-btn"><MoreVertical size={18} /></button>
                                    </div>
                                </header>

                                <div className="chat-scroll-content" ref={scrollRef}>
                                    <div className="day-separator">Hoy</div>
                                    <div className="encryption-disclaimer">
                                        🔒 Los mensajes están protegidos y viajan a través de WhatsApp Cloud API.
                                    </div>
                                    {messages.map((msg, i) => (
                                        <div key={msg.id || i} className={`message-row ${msg.sender === 'ADMIN' ? 'sent' : 'received'}`}>
                                            <div className="message-bubble-premium">
                                                <p>{msg.content}</p>
                                                <div className="message-meta-footer">
                                                    <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    {msg.sender === 'ADMIN' && <CheckCheck size={14} className="status-icon" />}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <footer className="chat-footer-premium">
                                    <div className="tools-area">
                                        <button className="tool-btn"><Smile size={22} /></button>
                                        <button className="tool-btn"><Paperclip size={22} /></button>
                                    </div>
                                    <div className="chat-input-wrapper">
                                        <input
                                            type="text"
                                            placeholder="Escribe un mensaje aquí..."
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                        />
                                    </div>
                                    <button className="send-action-btn" onClick={handleSend} disabled={!input.trim()}>
                                        <Send size={22} />
                                    </button>
                                </footer>
                            </>
                        ) : (
                            <div className="chat-empty-splash">
                                <div className="splash-content">
                                    <div className="splash-icon-box">
                                        <MessageSquare size={64} color="#ec4899" strokeWidth={1.5} />
                                    </div>
                                    <h1>Naia Chat Admin</h1>
                                    <p>Gestiona todas tus conversaciones de WhatsApp desde un solo lugar. Selecciona un chat para responder a tus clientes.</p>
                                </div>
                            </div>
                        )}
                    </main>
                </div>
            </div>

            <style jsx>{`
                .admin-chat-page-root {
                    height: calc(100vh - 140px);
                    display: flex;
                    flex-direction: column;
                }
                .admin-chat-layout-wrapper {
                    flex: 1;
                    min-height: 0;
                    margin-top: 25px;
                }
                .admin-chat-layout {
                    display: flex;
                    height: 100%;
                    background: #fff;
                    border: 1px solid #f1f5f9;
                    border-radius: 32px;
                    overflow: hidden;
                    box-shadow: 0 40px 100px -30px rgba(0,0,0,0.06);
                }

                /* Sidebar Styles */
                .chat-sidebar {
                    width: 380px;
                    display: flex;
                    flex-direction: column;
                    border-right: 1px solid #f1f5f9;
                    background: #fff;
                }
                .sidebar-header {
                    padding: 30px 25px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .sidebar-title-area h2 { font-size: 24px; font-weight: 950; color: #1e293b; letter-spacing: -0.8px; margin: 0; }
                .chats-count { font-size: 13px; font-weight: 800; color: #94a3b8; }
                
                .circle-action-btn {
                    width: 40px; height: 40px; border-radius: 50%; border: none; background: #f8fafc;
                    display: flex; align-items: center; justify-content: center; color: #64748b; cursor: pointer; transition: 0.3s;
                }
                .circle-action-btn:hover { background: #fee2e2; color: #ec4899; }

                .search-box { padding: 0 25px 25px; display: flex; gap: 12px; }
                .search-inner-premium {
                    flex: 1; background: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0;
                    display: flex; align-items: center; padding: 0 16px; gap: 12px; transition: 0.3s;
                }
                .search-inner-premium:focus-within { border-color: #ec4899; background: #fff; box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.05); }
                .search-inner-premium input {
                    background: none; border: none; padding: 12px 0; outline: none; width: 100%;
                    font-size: 14px; font-weight: 800; color: #1e293b;
                }
                .filter-pill-btn {
                    background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px;
                    width: 46px; display: flex; align-items: center; justify-content: center; color: #64748b; cursor: pointer;
                }

                .conversations-list-premium { flex: 1; overflow-y: auto; padding: 0 12px 20px; }
                .conversations-list-premium::-webkit-scrollbar { width: 4px; }
                .conversations-list-premium::-webkit-scrollbar-thumb { background: #f1f5f9; border-radius: 10px; }

                .conv-item-premium {
                    padding: 16px 20px; display: flex; gap: 15px; border-radius: 20px; cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.1, 0.7, 0.1, 1); margin-bottom: 5px;
                }
                .conv-item-premium:hover { background: #fdf2f8; }
                .conv-item-premium.active { background: #1e293b; box-shadow: 0 15px 30px rgba(30, 41, 59, 0.1); }

                .avatar-box {
                    width: 54px; height: 54px; border-radius: 18px; background: #f1f5f9;
                    display: flex; align-items: center; justify-content: center;
                    font-weight: 950; font-size: 18px; color: #64748b; flex-shrink: 0; transition: 0.3s;
                }
                .active .avatar-box { background: rgba(255,255,255,0.1); color: #fff; }

                .conv-body { flex: 1; display: flex; flex-direction: column; justify-content: center; gap: 4px; overflow: hidden; }
                .conv-header { display: flex; justify-content: space-between; align-items: center; }
                .client-name { font-weight: 900; font-size: 15px; color: #1e293b; letter-spacing: -0.3px; }
                .active .client-name { color: #fff; }
                .time-stamp { font-size: 11px; font-weight: 800; color: #94a3b8; }
                .active .time-stamp { color: #64748b; }

                .conv-footer { display: flex; justify-content: space-between; align-items: center; }
                .last-msg-preview { font-size: 13px; font-weight: 600; color: #64748b; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 180px; }
                .active .last-msg-preview { color: #94a3b8; }
                .unread-dot { background: #ec4899; color: white; font-size: 10px; font-weight: 900; width: 18px; height: 18px; border-radius: 8px; display: flex; align-items: center; justify-content: center; }

                /* Main Chat Area Styles */
                .chat-main-area { flex: 1; display: flex; flex-direction: column; background: #fff; position: relative; }
                .chat-area-header {
                    padding: 20px 40px; border-bottom: 1px solid #f1f5f9; display: flex; justify-content: space-between; align-items: center;
                    background: rgba(255,255,255,0.9); backdrop-filter: blur(10px); z-index: 20;
                }
                .client-profile { display: flex; align-items: center; gap: 15px; }
                .avatar-circle-header { width: 48px; height: 48px; border-radius: 50%; background: #f8fafc; border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: center; font-weight: 950; color: #1e293b; }
                .client-info-header h3 { font-size: 18px; font-weight: 950; color: #1e293b; margin: 0; letter-spacing: -0.5px; }
                .client-info-header span { font-size: 12px; font-weight: 800; color: #10b981; }

                .chat-scroll-content { flex: 1; overflow-y: auto; padding: 40px 15%; display: flex; flex-direction: column; gap: 15px; background: #fcfcfc; }
                .day-separator { align-self: center; padding: 4px 16px; background: #f1f5f9; border-radius: 100px; font-size: 11px; font-weight: 900; color: #94a3b8; margin: 20px 0; }
                .encryption-disclaimer { align-self: center; text-align: center; max-width: 80%; font-size: 11px; font-weight: 700; color: #cbd5e1; margin-bottom: 30px; }

                .message-row { display: flex; width: 100%; margin-bottom: 2px; }
                .message-row.sent { justify-content: flex-end; }
                .message-row.received { justify-content: flex-start; }

                .message-bubble-premium {
                    max-width: 65%; padding: 14px 20px; border-radius: 20px; font-size: 15px; font-weight: 700; line-height: 1.5;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.02);
                }
                .sent .message-bubble-premium { background: #1e293b; color: #fff; border-bottom-right-radius: 4px; }
                .received .message-bubble-premium { background: #fff; color: #1e293b; border-bottom-left-radius: 4px; border: 1px solid #f1f5f9; }

                .message-meta-footer { display: flex; align-items: center; gap: 6px; font-size: 10px; font-weight: 900; margin-top: 6px; opacity: 0.6; }
                .sent .message-meta-footer { justify-content: flex-end; }
                .status-icon { color: #ec4899; }

                .chat-footer-premium { padding: 25px 40px; background: #fff; border-top: 1px solid #f1f5f9; display: flex; align-items: center; gap: 15px; z-index: 20; }
                .tool-btn { background: none; border: none; color: #cbd5e1; cursor: pointer; transition: 0.3s; }
                .tool-btn:hover { color: #ec4899; }
                
                .chat-input-wrapper { flex: 1; background: #f8fafc; border-radius: 16px; border: 1px solid #e2e8f0; padding: 0 20px; }
                .chat-input-wrapper input { width: 100%; border: none; padding: 14px 0; background: none; outline: none; font-size: 14px; font-weight: 800; color: #1e293b; }

                .send-action-btn {
                    width: 54px; height: 54px; border-radius: 18px; border: none; background: #f1f5f9; color: #cbd5e1;
                    display: flex; align-items: center; justify-content: center; cursor: pointer; transition: 0.3s;
                }
                .send-action-btn:not(:disabled) { background: #ec4899; color: #fff; box-shadow: 0 10px 20px rgba(236, 72, 153, 0.2); }
                .send-action-btn:hover:not(:disabled) { transform: translateY(-2px); }

                .chat-empty-splash { flex: 1; display: flex; align-items: center; justify-content: center; background: #fcfcfc; text-align: center; }
                .splash-content { max-width: 400px; padding: 40px; }
                .splash-icon-box { width: 120px; height: 120px; background: #fff; border-radius: 40px; display: flex; align-items: center; justify-content: center; margin: 0 auto 30px; box-shadow: 0 20px 50px rgba(236, 72, 153, 0.1); border: 1px solid #fdf2f8; }
                .splash-content h1 { font-size: 32px; font-weight: 950; color: #1e293b; letter-spacing: -1px; margin-bottom: 12px; }
                .splash-content p { font-size: 15px; font-weight: 800; color: #94a3b8; line-height: 1.6; }

                .back-btn-mobile { display: none; background: none; border: none; color: #64748b; cursor: pointer; }

                @keyframes entrance { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .animate-entrance { animation: entrance 0.6s cubic-bezier(0.1, 0.7, 0.1, 1); }

                @media (max-width: 1000px) {
                    .chat-sidebar { width: 320px; }
                    .chat-scroll-content { padding: 40px 5%; }
                }
                @media (max-width: 850px) {
                    .chat-sidebar.hide-mobile { display: none; }
                    .chat-main-area.hide-mobile { display: none; }
                    .chat-sidebar { width: 100%; }
                    .back-btn-mobile { display: block; }
                    .chat-area-header { padding: 15px 20px; }
                    .chat-footer-premium { padding: 15px 20px; }
                }
            `}</style>
        </div>
    );
}
