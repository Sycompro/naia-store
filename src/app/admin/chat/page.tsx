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
    Image as ImageIcon,
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
        const interval = setInterval(fetchConversations, 10000); // Poll every 10s
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
            const interval = setInterval(() => fetchMessages(selectedId), 5000); // Poll messages every 5s
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
                return; // Silence and wait for checkAuth to redirect
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
            fetchConversations(); // Update sidebar
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
                title="Centro de Mensajería"
                breadcrumb={[{ label: 'Admin', href: '/admin' }, { label: 'Chat' }]}
            />

            <div className="admin-chat-layout-wrapper">
                <div className="admin-chat-layout">
                    {/* Sidebar */}
                    <div className={`chat-sidebar ${selectedId ? 'hide-mobile' : ''}`}>
                        <div className="sidebar-header">
                            <div className="admin-profile">
                                <div className="avatar-placeholder">A</div>
                                <h2>Mensajes Naia</h2>
                            </div>
                            <div className="header-actions">
                                <MessageSquare size={20} />
                                <MoreVertical size={20} />
                            </div>
                        </div>

                        <div className="search-box">
                            <div className="search-inner">
                                <Search size={18} />
                                <input
                                    type="text"
                                    placeholder="Buscar un chat o número"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button className="filter-btn"><Filter size={18} /></button>
                        </div>

                        <div className="conversations-list">
                            {loading ? (
                                <div className="loading-state">Cargando chats...</div>
                            ) : filteredConversations.length === 0 ? (
                                <div className="empty-chat-state-premium">
                                    <MessageSquare size={40} strokeWidth={1} />
                                    <p>No hay conversaciones activas</p>
                                    <button
                                        className="seed-trigger-btn"
                                        onClick={async () => {
                                            await fetch('/api/chat/seed', { method: 'POST' });
                                            fetchConversations();
                                        }}
                                    >
                                        Generar Chats de Prueba
                                    </button>
                                </div>
                            ) : (
                                filteredConversations.map(conv => (
                                    <div
                                        key={conv.id}
                                        className={`conv-item ${selectedId === conv.id ? 'active' : ''}`}
                                        onClick={() => setSelectedId(conv.id)}
                                    >
                                        <div className="avatar-circle">
                                            <User size={24} />
                                        </div>
                                        <div className="conv-info">
                                            <div className="conv-top">
                                                <span className="conv-name">{conv.name || conv.phone}</span>
                                                <span className="conv-time">
                                                    {new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <div className="conv-bottom">
                                                <p className="conv-last-msg">{conv.lastMessage || 'Empieza a chatear...'}</p>
                                                {conv.unreadCount > 0 && (
                                                    <span className="unread-badge">{conv.unreadCount}</span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Chat Area */}
                    <div className={`chat-main ${!selectedId ? 'hide-mobile' : ''}`}>
                        {selectedId && activeConv ? (
                            <>
                                <div className="chat-main-header">
                                    <div className="header-left">
                                        <button className="back-btn" onClick={() => setSelectedId(null)}>
                                            <ChevronLeft size={24} />
                                        </button>
                                        <div className="avatar-circle">
                                            <User size={24} />
                                        </div>
                                        <div className="header-user-info">
                                            <h3>{activeConv.name || activeConv.phone}</h3>
                                            <span>{activeConv.phone}</span>
                                        </div>
                                    </div>
                                    <div className="header-actions">
                                        <Phone size={20} />
                                        <Search size={20} />
                                        <MoreVertical size={20} />
                                    </div>
                                </div>

                                <div className="chat-content" ref={scrollRef}>
                                    <div className="encryption-notice">
                                        <p>🔒 Los mensajes están protegidos y sincronizados con WhatsApp Cloud API.</p>
                                    </div>
                                    {messages.map((msg, i) => (
                                        <div key={msg.id || i} className={`msg-row ${msg.sender === 'ADMIN' ? 'sent' : 'received'}`}>
                                            <div className="msg-bubble-admin">
                                                <p>{msg.content}</p>
                                                <div className="msg-meta">
                                                    <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                    {msg.sender === 'ADMIN' && <CheckCheck size={14} />}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="chat-footer">
                                    <div className="footer-actions">
                                        <Smile size={24} />
                                        <Paperclip size={24} />
                                    </div>
                                    <div className="input-container">
                                        <input
                                            type="text"
                                            placeholder="Escribe un mensaje"
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                        />
                                    </div>
                                    <button className="send-btn-admin" onClick={handleSend} disabled={!input.trim()}>
                                        <Send size={24} />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="chat-placeholder">
                                <div className="placeholder-content">
                                    <MessageSquare size={80} strokeWidth={1} />
                                    <h1>Naia Chat Central</h1>
                                    <p>Selecciona una conversación para empezar a responder a tus clientes.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .admin-chat-page-root {
                    display: flex;
                    flex-direction: column;
                    height: calc(100vh - 120px);
                    animation: fadeIn 0.5s ease-out;
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .admin-chat-layout-wrapper {
                    flex: 1;
                    min-height: 0;
                    padding-bottom: 20px;
                }
                .admin-chat-layout {
                    display: flex;
                    height: 100%;
                    background: rgba(15, 23, 42, 0.4);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 24px;
                    overflow: hidden;
                    box-shadow: 0 40px 100px rgba(0,0,0,0.4);
                    backdrop-filter: blur(20px);
                }

                /* Sidebar */
                .chat-sidebar {
                    width: 360px;
                    background: rgba(15, 23, 42, 0.4);
                    backdrop-filter: blur(40px);
                    -webkit-backdrop-filter: blur(40px);
                    border-right: 1px solid rgba(255, 255, 255, 0.05);
                    display: flex;
                    flex-direction: column;
                }
                .sidebar-header {
                    padding: 24px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid rgba(255,255,255,0.03);
                }
                .admin-profile { display: flex; align-items: center; gap: 14px; }
                .admin-profile h2 { font-size: 19px; font-weight: 900; color: white; letter-spacing: -0.5px; }
                .avatar-placeholder {
                    width: 40px; height: 40px; background: white; color: #0f172a;
                    border-radius: 12px; display: flex; align-items: center; justify-content: center;
                    font-weight: 900; box-shadow: 0 8px 20px rgba(255,255,255,0.1);
                }
                .header-actions { display: flex; gap: 18px; color: #64748b; cursor: pointer; }

                .search-box { padding: 16px 20px; display: flex; gap: 12px; }
                .search-inner {
                    flex: 1; background: rgba(255,255,255,0.03); border-radius: 14px;
                    display: flex; align-items: center; padding: 0 14px; gap: 12px; color: #64748b;
                    border: 1px solid rgba(255,255,255,0.05); transition: 0.3s;
                }
                .search-inner:focus-within { border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.06); }
                .search-inner input {
                    background: none; border: none; padding: 12px 0; outline: none; width: 100%;
                    font-size: 14px; font-weight: 600; color: white;
                }
                .filter-btn { 
                    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px;
                    display: flex; align-items: center; justify-content: center; width: 44px;
                    color: #64748b; cursor: pointer; transition: 0.3s;
                }
                .filter-btn:hover { color: white; border-color: white; }

                .conversations-list { flex: 1; overflow-y: auto; padding: 8px; }
                .conversations-list::-webkit-scrollbar { width: 4px; }
                .conversations-list::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.05); border-radius: 10px; }

                .conv-item {
                    padding: 16px; display: flex; gap: 14px; cursor: pointer;
                    border-radius: 20px; transition: all 0.4s cubic-bezier(0.1, 0.7, 0.1, 1);
                    margin-bottom: 4px; border: 1px solid transparent;
                }
                .conv-item:hover { background: rgba(255, 255, 255, 0.03); transform: translateX(5px); }
                .conv-item.active { 
                    background: rgba(255, 255, 255, 0.07);
                    border-color: rgba(255, 255, 255, 0.05);
                    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
                }
                .empty-chat-state-premium {
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    padding: 40px 20px; color: #475569; text-align: center; gap: 12px;
                }
                .empty-chat-state-premium p { font-size: 14px; font-weight: 700; }
                .seed-trigger-btn {
                    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
                    color: white; padding: 10px 20px; border-radius: 12px; font-weight: 800; cursor: pointer; transition: 0.3s;
                }
                .seed-trigger-btn:hover { background: white; color: #0f172a; }
                .avatar-circle {
                    width: 52px; height: 52px; background: rgba(255,255,255,0.03); border-radius: 16px;
                    display: flex; align-items: center; justify-content: center; color: #475569;
                    flex-shrink: 0; transition: 0.4s; border: 1px solid rgba(255,255,255,0.05);
                }
                .active .avatar-circle { background: white; color: #0f172a; box-shadow: 0 8px 16px rgba(255,255,255,0.1); }
                .conv-info { flex: 1; overflow: hidden; display: flex; flex-direction: column; justify-content: center; }
                .conv-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
                .conv-name { font-weight: 900; font-size: 15px; color: #f1f5f9; letter-spacing: -0.2px; }
                .conv-time { font-size: 11px; font-weight: 800; color: #475569; }
                .conv-bottom { display: flex; justify-content: space-between; align-items: center; }
                .conv-last-msg {
                    font-size: 13px; color: #64748b; white-space: nowrap; font-weight: 600;
                    overflow: hidden; text-overflow: ellipsis; max-width: 180px;
                }
                .active .conv-last-msg { color: #94a3b8; }
                .unread-badge {
                    background: #10b981; color: white; font-size: 10px; font-weight: 950;
                    min-width: 18px; height: 18px; border-radius: 8px;
                    display: flex; align-items: center; justify-content: center; padding: 0 5px;
                    box-shadow: 0 4px 10px rgba(16, 185, 129, 0.3);
                }

                /* Chat Main Area */
                .chat-main { flex: 1; display: flex; flex-direction: column; background: rgba(15, 23, 42, 0.2); position: relative; }
                .chat-main::before {
                    content: ''; position: absolute; inset: 0;
                    background: url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png');
                    opacity: 0.05; pointer-events: none; invert: 1;
                }

                .chat-main-header {
                    padding: 20px 32px; background: rgba(15, 23, 42, 0.4); 
                    backdrop-filter: blur(20px); display: flex;
                    justify-content: space-between; align-items: center; z-index: 10;
                    border-bottom: 1px solid rgba(255,255,255,0.03);
                }
                .header-left { display: flex; align-items: center; gap: 18px; }
                .header-user-info h3 { font-size: 18px; font-weight: 900; margin: 0; color: white; letter-spacing: -0.5px; }
                .header-user-info span { font-size: 12px; font-weight: 700; color: #475569; }
                .back-btn { display: none; background: none; border: none; cursor: pointer; color: #64748b; }

                .chat-content {
                    flex: 1; overflow-y: auto; padding: 40px 10%;
                    display: flex; flex-direction: column; gap: 20px; z-index: 5;
                }
                .encryption-notice { text-align: center; margin-bottom: 32px; }
                .encryption-notice p {
                    display: inline-block; background: rgba(255,255,255,0.02); 
                    padding: 10px 20px; border-radius: 12px; font-size: 11px; 
                    font-weight: 800; color: #64748b; border: 1px solid rgba(255,255,255,0.05);
                    backdrop-filter: blur(4px);
                }

                .msg-row { display: flex; width: 100%; }
                .msg-row.sent { justify-content: flex-end; }
                .msg-row.received { justify-content: flex-start; }

                .msg-bubble-admin {
                    max-width: 65%; padding: 16px 20px; border-radius: 24px;
                    font-size: 15px; font-weight: 600; position: relative; 
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1); line-height: 1.6;
                }
                .sent .msg-bubble-admin { 
                    background: white; color: #0f172a; border-bottom-right-radius: 6px; 
                }
                .received .msg-bubble-admin { 
                    background: rgba(255,255,255,0.05); color: #f1f5f9; border-bottom-left-radius: 6px; 
                    border: 1px solid rgba(255,255,255,0.05); backdrop-filter: blur(10px);
                }

                .msg-meta {
                    display: flex; align-items: center; gap: 8px; font-size: 10px; margin-top: 8px; opacity: 0.5; font-weight: 950;
                }
                .sent .msg-meta { justify-content: flex-end; color: #0f172a; }
                .received .msg-meta { color: #94a3b8; }

                .chat-footer {
                    padding: 24px 32px; background: rgba(15, 23, 42, 0.4); 
                    backdrop-filter: blur(20px); display: flex;
                    align-items: center; gap: 20px; z-index: 10;
                    border-top: 1px solid rgba(255,255,255,0.03);
                }
                .footer-actions { display: flex; gap: 20px; color: #475569; }
                .input-container { 
                    flex: 1; background: rgba(255,255,255,0.03); border-radius: 18px; 
                    padding: 6px 24px; border: 1px solid rgba(255,255,255,0.05);
                    transition: 0.3s;
                }
                .input-container:focus-within { background: rgba(255,255,255,0.06); border-color: rgba(255,255,255,0.1); }
                .input-container input {
                    width: 100%; border: none; padding: 12px 0; outline: none; 
                    font-size: 15px; font-weight: 600; color: white; background: none;
                }
                .send-btn-admin { 
                    width: 54px; height: 54px; border-radius: 18px; border: none;
                    background: rgba(255,255,255,0.03); color: #475569; cursor: pointer;
                    display: flex; align-items: center; justify-content: center; transition: 0.4s;
                }
                .send-btn-admin:not(:disabled) { 
                    background: white; color: #0f172a; 
                    box-shadow: 0 15px 30px rgba(0,0,0,0.3);
                }
                .send-btn-admin:hover:not(:disabled) { transform: translateY(-3px) scale(1.05); }

                .chat-placeholder {
                    flex: 1; display: flex; align-items: center; justify-content: center;
                    background: rgba(15, 23, 42, 0.1);
                }
                .placeholder-content { text-align: center; color: #475569; max-width: 450px; padding: 40px; }
                .placeholder-content h1 { font-size: 36px; font-weight: 950; color: white; margin: 28px 0 12px; letter-spacing: -1.5px; }
                .placeholder-content p { font-size: 16px; font-weight: 700; line-height: 1.6; color: #64748b; }

                @media (max-width: 1100px) { .chat-sidebar { width: 320px; } }
                @media (max-width: 900px) {
                    .admin-chat-page-root { height: calc(100vh - 100px); }
                    .chat-sidebar { width: 100%; }
                    .chat-sidebar.hide-mobile { display: none; }
                    .chat-main.hide-mobile { display: none; }
                    .back-btn { display: block; }
                    .chat-content { padding: 30px 20px; }
                }
            `}</style>
        </div>
    );
}
