'use client';
import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User, Check, CheckCheck } from 'lucide-react';

interface LocalMessage {
    id: string;
    content: string;
    sender: 'USER' | 'ADMIN';
    createdAt: string;
}

export default function FloatingChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<LocalMessage[]>([]);
    const [input, setInput] = useState('');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerName, setCustomerName] = useState('');
    const [showForm, setShowForm] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const savedPhone = localStorage.getItem('naia_chat_phone');
        const savedName = localStorage.getItem('naia_chat_name');
        if (savedPhone) {
            setCustomerPhone(savedPhone);
            setCustomerName(savedName || '');
            setShowForm(false);
            fetchMessages(savedPhone);
        }
    }, []);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isOpen]);

    const fetchMessages = async (phone: string) => {
        try {
            const res = await fetch(`/api/chat/messages?phone=${phone}`);
            const data = await res.json();
            if (Array.isArray(data)) setMessages(data);
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const handleFormSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (customerPhone.length < 9) return;
        localStorage.setItem('naia_chat_phone', customerPhone);
        localStorage.setItem('naia_chat_name', customerName);
        setShowForm(false);
        fetchMessages(customerPhone);
    };

    const handleSend = async () => {
        if (!input.trim()) return;

        const newMessage = {
            content: input,
            sender: 'USER' as const,
            phone: customerPhone,
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
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="floating-chat-container">
            {isOpen ? (
                <div className="chat-window glass-premium animate-entrance">
                    <div className="chat-header">
                        <div className="chat-header-info">
                            <div className="chat-avatar">
                                <MessageCircle size={20} />
                                <div className="online-indicator" />
                            </div>
                            <div>
                                <h4>Soporte Naia</h4>
                                <span>En línea</span>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="close-btn"><X size={20} /></button>
                    </div>

                    <div className="chat-messages" ref={scrollRef}>
                        {showForm ? (
                            <div className="chat-auth-form">
                                <p>Déjanos tu WhatsApp para empezar a chatear.</p>
                                <form onSubmit={handleFormSubmit}>
                                    <input
                                        type="text"
                                        placeholder="Tu Nombre"
                                        value={customerName}
                                        onChange={e => setCustomerName(e.target.value)}
                                        required
                                    />
                                    <input
                                        type="tel"
                                        placeholder="WhatsApp (ej. 987654321)"
                                        value={customerPhone}
                                        onChange={e => setCustomerPhone(e.target.value)}
                                        required
                                    />
                                    <button type="submit" className="btn-premium btn-primary-v3">Iniciar Chat</button>
                                </form>
                            </div>
                        ) : (
                            <>
                                <div className="system-msg">
                                    <p>¡Hola! {customerName}. Cuéntanos ¿en qué podemos ayudarte hoy?</p>
                                </div>
                                {messages.map((msg, i) => (
                                    <div key={msg.id || i} className={`message-bubble ${msg.sender.toLowerCase()}`}>
                                        <p>{msg.content}</p>
                                        <div className="msg-info">
                                            <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            {msg.sender === 'USER' && <CheckCheck size={14} className="status-icon" />}
                                        </div>
                                    </div>
                                ))}
                            </>
                        )}
                    </div>

                    {!showForm && (
                        <div className="chat-input-area">
                            <input
                                type="text"
                                placeholder="Escribe un mensaje..."
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyPress={e => e.key === 'Enter' && handleSend()}
                            />
                            <button onClick={handleSend} className="send-btn">
                                <Send size={20} />
                            </button>
                        </div>
                    )}
                </div>
            ) : (
                <button className="chat-trigger-btn glass-premium" onClick={() => setIsOpen(true)}>
                    <MessageCircle size={30} />
                    <span className="notification-badge">1</span>
                </button>
            )}

            <style jsx>{`
                .floating-chat-container {
                    position: fixed;
                    bottom: 30px;
                    right: 30px;
                    z-index: 10000;
                    font-family: var(--font-main);
                }
                .chat-trigger-btn {
                    width: 65px;
                    height: 65px;
                    border-radius: 50%;
                    background: var(--fg) !important;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 8px 32px rgba(0,0,0,0.2);
                    border: none;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    position: relative;
                }
                .chat-trigger-btn:hover {
                    transform: scale(1.1) rotate(5deg);
                }
                .notification-badge {
                    position: absolute;
                    top: -5px;
                    right: -5px;
                    background: var(--primary);
                    color: white;
                    font-size: 11px;
                    font-weight: 700;
                    padding: 4px 8px;
                    border-radius: 20px;
                    border: 2px solid white;
                }
                .chat-window {
                    width: 360px;
                    height: 500px;
                    border-radius: 24px;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    box-shadow: 0 20px 50px rgba(0,0,0,0.2);
                    border: 1px solid rgba(255,255,255,0.4);
                }
                .chat-header {
                    background: var(--fg);
                    padding: 20px;
                    color: white;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                .chat-header-info {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .chat-avatar {
                    width: 40px;
                    height: 40px;
                    background: rgba(255,255,255,0.1);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                }
                .online-indicator {
                    position: absolute;
                    bottom: -2px;
                    right: -2px;
                    width: 10px;
                    height: 10px;
                    background: #10b981;
                    border-radius: 50%;
                    border: 2px solid var(--fg);
                }
                .chat-header h4 { margin: 0; font-size: 15px; font-weight: 700; }
                .chat-header span { font-size: 12px; opacity: 0.7; }
                .close-btn { background: none; border: none; color: white; cursor: pointer; opacity: 0.5; }
                .close-btn:hover { opacity: 1; }

                .chat-messages {
                    flex: 1;
                    padding: 20px;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                    background: rgba(255,255,255,0.5);
                }
                .chat-auth-form {
                    text-align: center;
                    margin-top: 40px;
                }
                .chat-auth-form p { font-size: 14px; color: var(--slate-500); margin-bottom: 20px; font-weight: 500; }
                .chat-auth-form form { display: flex; flex-direction: column; gap: 10px; }
                .chat-auth-form input {
                    padding: 12px;
                    border-radius: 12px;
                    border: 1px solid var(--slate-200);
                    font-family: inherit;
                }
                
                .message-bubble {
                    max-width: 80%;
                    padding: 10px 14px;
                    border-radius: 18px;
                    font-size: 14px;
                    line-height: 1.4;
                    position: relative;
                }
                .message-bubble.user {
                    align-self: flex-end;
                    background: var(--primary);
                    color: white;
                    border-bottom-right-radius: 4px;
                }
                .message-bubble.admin {
                    align-self: flex-start;
                    background: white;
                    color: var(--fg);
                    border-bottom-left-radius: 4px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.05);
                }
                .msg-info {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    gap: 4px;
                    font-size: 10px;
                    margin-top: 4px;
                    opacity: 0.8;
                }
                .system-msg {
                    text-align: center;
                    background: rgba(0,0,0,0.03);
                    padding: 10px;
                    border-radius: 12px;
                    font-size: 12px;
                    color: var(--slate-500);
                }

                .chat-input-area {
                    padding: 15px 20px;
                    display: flex;
                    gap: 10px;
                    background: white;
                    border-top: 1px solid var(--slate-100);
                }
                .chat-input-area input {
                    flex: 1;
                    border: none;
                    background: var(--slate-50);
                    padding: 10px 15px;
                    border-radius: 12px;
                    outline: none;
                }
                .send-btn {
                    background: var(--primary);
                    color: white;
                    border: none;
                    width: 40px;
                    height: 40px;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: transform 0.2s;
                }
                .send-btn:hover { transform: scale(1.05); }

                @media (max-width: 480px) {
                    .chat-window {
                        position: fixed;
                        inset: 0;
                        width: 100%;
                        height: 100%;
                        border-radius: 0;
                    }
                }
            `}</style>
        </div>
    );
}
