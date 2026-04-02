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
                    height: calc(100vh - 120px);
                    background: #f0f2f5;
                    margin: -20px; /* Counter general admin padding */
                    border: 1px solid var(--slate-200);
                    border-radius: 12px;
                    overflow: hidden;
                    font-family: var(--font-main);
                }

                /* Sidebar */
                .chat-sidebar {
                    width: 380px;
                    background: white;
                    border-right: 1px solid var(--slate-200);
                    display: flex;
                    flex-direction: column;
                }
                .sidebar-header {
                    padding: 15px 20px;
                    background: #f0f2f5;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .admin-profile { display: flex; align-items: center; gap: 12px; }
                .admin-profile h2 { font-size: 16px; font-weight: 700; margin: 0; }
                .avatar-placeholder {
                    width: 40px; height: 40px; background: var(--fg); color: white;
                    border-radius: 50%; display: flex; align-items: center; justify-content: center;
                    font-weight: 800;
                }
                .header-actions { display: flex; gap: 20px; color: var(--slate-500); cursor: pointer; }

                .search-box {
                    padding: 10px 15px;
                    display: flex;
                    gap: 10px;
                    border-bottom: 1px solid #f0f2f5;
                }
                .search-inner {
                    flex: 1; background: #f0f2f5; border-radius: 8px;
                    display: flex; align-items: center; padding: 0 12px; gap: 10px; color: var(--slate-500);
                }
                .search-inner input {
                    background: none; border: none; padding: 8px 0; outline: none; width: 100%;
                    font-size: 14px;
                }
                .filter-btn { background: none; border: none; color: var(--slate-500); cursor: pointer; }

                .conversations-list { flex: 1; overflow-y: auto; }
                .conv-item {
                    padding: 15px 20px; display: flex; gap: 15px; cursor: pointer;
                    border-bottom: 1px solid #f6f6f6; transition: background 0.2s;
                }
                .conv-item:hover { background: #f5f6f6; }
                .conv-item.active { background: #ebebeb; }
                .avatar-circle {
                    width: 50px; height: 50px; background: var(--slate-200); border-radius: 50%;
                    display: flex; align-items: center; justify-content: center; color: var(--slate-400);
                    flex-shrink: 0;
                }
                .conv-info { flex: 1; overflow: hidden; }
                .conv-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
                .conv-name { font-weight: 600; font-size: 16px; color: var(--fg); }
                .conv-time { font-size: 12px; color: var(--slate-500); }
                .conv-bottom { display: flex; justify-content: space-between; align-items: center; }
                .conv-last-msg {
                    font-size: 13px; color: var(--slate-500); white-space: nowrap;
                    overflow: hidden; text-overflow: ellipsis; max-width: 200px;
                }
                .unread-badge {
                    background: #25d366; color: white; font-size: 11px; font-weight: 700;
                    min-width: 20px; height: 20px; border-radius: 10px;
                    display: flex; align-items: center; justify-content: center; padding: 0 6px;
                }

                /* Chat Main Area */
                .chat-main { flex: 1; display: flex; flex-direction: column; background: #e5ddd5; position: relative; }
                .chat-main::before {
                    content: ''; position: absolute; inset: 0;
                    background: url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png');
                    opacity: 0.06; pointer-events: none;
                }

                .chat-main-header {
                    padding: 10px 20px; background: #f0f2f5; display: flex;
                    justify-content: space-between; align-items: center; z-index: 10;
                }
                .header-left { display: flex; align-items: center; gap: 15px; }
                .header-user-info h3 { font-size: 16px; font-weight: 700; margin: 0; }
                .header-user-info span { font-size: 12px; color: var(--slate-500); }
                .back-btn { display: none; background: none; border: none; cursor: pointer; }

                .chat-content {
                    flex: 1; overflow-y: auto; padding: 20px 50px;
                    display: flex; flex-direction: column; gap: 10px; z-index: 5;
                }
                .encryption-notice {
                    text-align: center; margin-bottom: 20px;
                }
                .encryption-notice p {
                    display: inline-block; background: #fff5c4; padding: 6px 12px;
                    border-radius: 8px; font-size: 12px; color: #525252;
                }

                .msg-row { display: flex; width: 100%; margin-bottom: 2px; }
                .msg-row.sent { justify-content: flex-end; }
                .msg-row.received { justify-content: flex-start; }

                .msg-bubble-admin {
                    max-width: 65%; padding: 8px 12px; border-radius: 8px;
                    font-size: 14px; position: relative; box-shadow: 0 1px 2px rgba(0,0,0,0.1);
                }
                .sent .msg-bubble-admin { background: #dcf8c6; border-top-right-radius: 0; }
                .received .msg-bubble-admin { background: white; border-top-left-radius: 0; }

                .msg-meta {
                    display: flex; align-items: center; justify-content: flex-end;
                    gap: 4px; font-size: 10px; margin-top: 4px; opacity: 0.6;
                }

                .chat-footer {
                    padding: 10px 20px; background: #f0f2f5; display: flex;
                    align-items: center; gap: 15px; z-index: 10;
                }
                .footer-actions { display: flex; gap: 15px; color: var(--slate-500); }
                .input-container { flex: 1; background: white; border-radius: 10px; padding: 2px 15px; }
                .input-container input {
                    width: 100%; border: none; padding: 10px 0; outline: none; font-size: 15px;
                }
                .send-btn-admin { background: none; border: none; color: var(--slate-500); cursor: pointer; }
                .send-btn-admin:not(:disabled) { color: var(--primary); }

                .chat-placeholder {
                    flex: 1; display: flex; align-items: center; justify-content: center;
                    background: #f8fafc; border-bottom: 6px solid #25d366;
                }
                .placeholder-content { text-align: center; color: var(--slate-400); max-width: 400px; }
                .placeholder-content h1 { font-size: 32px; font-weight: 300; color: var(--slate-600); margin: 20px 0 10px; }
                .placeholder-content p { font-size: 14px; line-height: 1.6; }

                @media (max-width: 900px) {
                    .admin-chat-layout { height: 100vh; border-radius: 0; margin: -20px; }
                    .chat-sidebar { width: 100%; }
                    .chat-sidebar.hide-mobile { display: none; }
                    .chat-main.hide-mobile { display: none; }
                    .back-btn { display: block; }
                }
            `}</style>
        </div>
    );
}

// Wrap in AdminLayout would happen in a real setup, here we export the full page
