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
import AdminLayout from '../layout'; // Assuming we want it inside admin layout

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

    useEffect(() => {
        fetchConversations();
        const interval = setInterval(fetchConversations, 10000); // Poll every 10s
        return () => clearInterval(interval);
    }, []);

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
        <div className="admin-chat-layout animate-entrance">
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
                        <div className="empty-state">No se encontraron chats.</div>
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

            <style jsx>{`
                .admin-chat-layout {
                    display: flex;
                    height: calc(100vh - 180px);
                    background: transparent;
                    border: 1px solid rgba(255, 255, 255, 0.4);
                    border-radius: 24px;
                    overflow: hidden;
                    font-family: var(--font-main);
                    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.05);
                    animation: slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1);
                }

                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                /* Sidebar */
                .chat-sidebar {
                    width: 380px;
                    background: rgba(255, 255, 255, 0.8);
                    backdrop-filter: blur(10px);
                    border-right: 1px solid rgba(0, 0, 0, 0.05);
                    display: flex;
                    flex-direction: column;
                }
                .sidebar-header {
                    padding: 20px 24px;
                    background: rgba(248, 250, 252, 0.5);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid rgba(0,0,0,0.02);
                }
                .admin-profile { display: flex; align-items: center; gap: 14px; }
                .admin-profile h2 { font-size: 18px; font-weight: 800; margin: 0; letter-spacing: -0.5px; }
                .avatar-placeholder {
                    width: 42px; height: 42px; background: #0f172a; color: white;
                    border-radius: 12px; display: flex; align-items: center; justify-content: center;
                    font-weight: 800; box-shadow: 0 4px 12px rgba(0,0,0,0.1);
                }
                .header-actions { display: flex; gap: 18px; color: #94a3b8; cursor: pointer; }

                .search-box {
                    padding: 16px 20px;
                    display: flex;
                    gap: 12px;
                    border-bottom: 1px solid rgba(0,0,0,0.03);
                }
                .search-inner {
                    flex: 1; background: white; border-radius: 14px;
                    display: flex; align-items: center; padding: 0 14px; gap: 12px; color: #94a3b8;
                    border: 1px solid rgba(0,0,0,0.05);
                }
                .search-inner input {
                    background: none; border: none; padding: 10px 0; outline: none; width: 100%;
                    font-size: 14px; font-weight: 600; color: #0f172a;
                }
                .filter-btn { 
                    background: white; border: 1px solid rgba(0,0,0,0.05); border-radius: 12px;
                    display: flex; align-items: center; justify-content: center; width: 42px;
                    color: #94a3b8; cursor: pointer; transition: 0.3s;
                }
                .filter-btn:hover { color: var(--primary); border-color: var(--primary); }

                .conversations-list { flex: 1; overflow-y: auto; padding: 8px; }
                .conv-item {
                    padding: 14px 16px; display: flex; gap: 14px; cursor: pointer;
                    border-radius: 18px; transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    margin-bottom: 4px;
                }
                .conv-item:hover { background: rgba(255, 255, 255, 0.6); transform: translateX(4px); }
                .conv-item.active { 
                    background: white; 
                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.04);
                }
                .avatar-circle {
                    width: 52px; height: 52px; background: #f1f5f9; border-radius: 16px;
                    display: flex; align-items: center; justify-content: center; color: #94a3b8;
                    flex-shrink: 0; transition: 0.3s;
                }
                .active .avatar-circle { background: #0f172a; color: white; }
                .conv-info { flex: 1; overflow: hidden; display: flex; flex-direction: column; justify-content: center; }
                .conv-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
                .conv-name { font-weight: 800; font-size: 15px; color: #0f172a; }
                .conv-time { font-size: 11px; font-weight: 700; color: #94a3b8; }
                .conv-bottom { display: flex; justify-content: space-between; align-items: center; }
                .conv-last-msg {
                    font-size: 13px; color: #64748b; white-space: nowrap; font-weight: 500;
                    overflow: hidden; text-overflow: ellipsis; max-width: 200px;
                }
                .active .conv-last-msg { color: #0f172a; }
                .unread-badge {
                    background: #25d366; color: white; font-size: 10px; font-weight: 900;
                    min-width: 18px; height: 18px; border-radius: 8px;
                    display: flex; align-items: center; justify-content: center; padding: 0 5px;
                    box-shadow: 0 4px 10px rgba(37, 211, 102, 0.3);
                }

                /* Chat Main Area */
                .chat-main { flex: 1; display: flex; flex-direction: column; background: #f8fafc; position: relative; }
                .chat-main::before {
                    content: ''; position: absolute; inset: 0;
                    background: url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png');
                    opacity: 0.04; pointer-events: none;
                }

                .chat-main-header {
                    padding: 16px 28px; background: rgba(255,255,255,0.8); 
                    backdrop-filter: blur(10px); display: flex;
                    justify-content: space-between; align-items: center; z-index: 10;
                    border-bottom: 1px solid rgba(0,0,0,0.03);
                }
                .header-left { display: flex; align-items: center; gap: 18px; }
                .header-user-info h3 { font-size: 17px; font-weight: 800; margin: 0; color: #0f172a; }
                .header-user-info span { font-size: 12px; font-weight: 600; color: #94a3b8; }
                .back-btn { display: none; background: none; border: none; cursor: pointer; color: #94a3b8; }

                .chat-content {
                    flex: 1; overflow-y: auto; padding: 30px 60px;
                    display: flex; flex-direction: column; gap: 14px; z-index: 5;
                }
                .encryption-notice { text-align: center; margin-bottom: 24px; }
                .encryption-notice p {
                    display: inline-block; background: rgba(255, 245, 196, 0.5); 
                    padding: 8px 16px; border-radius: 12px; font-size: 11px; 
                    font-weight: 800; color: #713f12; border: 1px solid rgba(255, 240, 150, 0.5);
                }

                .msg-row { display: flex; width: 100%; margin-bottom: 4px; }
                .msg-row.sent { justify-content: flex-end; }
                .msg-row.received { justify-content: flex-start; }

                .msg-bubble-admin {
                    max-width: 60%; padding: 12px 18px; border-radius: 20px;
                    font-size: 14px; font-weight: 500; position: relative; 
                    box-shadow: 0 4px 15px rgba(0,0,0,0.03); line-height: 1.5;
                }
                .sent .msg-bubble-admin { 
                    background: #0f172a; color: white; border-bottom-right-radius: 4px; 
                }
                .received .msg-bubble-admin { 
                    background: white; color: #0f172a; border-bottom-left-radius: 4px; 
                    border: 1px solid rgba(0,0,0,0.03);
                }

                .msg-meta {
                    display: flex; align-items: center; justify-content: flex-end;
                    gap: 6px; font-size: 10px; margin-top: 6px; opacity: 0.6; font-weight: 800;
                }

                .chat-footer {
                    padding: 16px 24px; background: rgba(255,255,255,0.8); 
                    backdrop-filter: blur(10px); display: flex;
                    align-items: center; gap: 18px; z-index: 10;
                    border-top: 1px solid rgba(0,0,0,0.03);
                }
                .footer-actions { display: flex; gap: 18px; color: #94a3b8; }
                .input-container { 
                    flex: 1; background: white; border-radius: 16px; 
                    padding: 4px 20px; border: 1px solid rgba(0,0,0,0.05);
                    box-shadow: 0 4px 10px rgba(0,0,0,0.02);
                }
                .input-container input {
                    width: 100%; border: none; padding: 10px 0; outline: none; 
                    font-size: 14px; font-weight: 600; color: #0f172a;
                }
                .send-btn-admin { 
                    width: 46px; height: 46px; border-radius: 14px; border: none;
                    background: #f1f5f9; color: #94a3b8; cursor: pointer;
                    display: flex; align-items: center; justify-content: center; transition: 0.3s;
                }
                .send-btn-admin:not(:disabled) { 
                    background: #0f172a; color: white; 
                    box-shadow: 0 10px 20px rgba(15, 23, 42, 0.2);
                }

                .chat-placeholder {
                    flex: 1; display: flex; align-items: center; justify-content: center;
                    background: white; border-bottom: 8px solid #0f172a;
                }
                .placeholder-content { text-align: center; color: #94a3b8; max-width: 400px; padding: 40px; }
                .placeholder-content h1 { font-size: 32px; font-weight: 900; color: #0f172a; margin: 24px 0 12px; letter-spacing: -1px; }
                .placeholder-content p { font-size: 15px; font-weight: 600; line-height: 1.6; }

                @media (max-width: 1100px) {
                    .chat-sidebar { width: 320px; }
                }

                @media (max-width: 900px) {
                    .admin-chat-layout { height: 100vh; border-radius: 0; margin: -20px; }
                    .chat-sidebar { width: 100%; }
                    .chat-sidebar.hide-mobile { display: none; }
                    .chat-main.hide-mobile { display: none; }
                    .back-btn { display: block; }
                    .chat-content { padding: 20px; }
                }
            `}</style>
        </div>
    );
}

// Wrap in AdminLayout would happen in a real setup, here we export the full page
