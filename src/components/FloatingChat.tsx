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
    const [isMen, setIsMen] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const checkTheme = () => {
            setIsMen(document.body.classList.contains('men-theme'));
        };
        checkTheme();
        const observer = new MutationObserver(checkTheme);
        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
        return () => observer.disconnect();
    }, []);

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
                    bottom: calc(30px + var(--safe-bottom));
                    right: calc(30px + var(--safe-right));
                    z-index: 10000;
                    font-family: var(--font-main);
                }
                .chat-trigger-btn {
                    width: 65px;
                    height: 65px;
                    border-radius: 50%;
                    background: ${isMen ? '#1e293b' : 'var(--fg)'} !important;
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    box-shadow: 0 12px 40px rgba(0,0,0,0.3);
                    border: none;
                    cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    position: relative;
                }
                .chat-trigger-btn:hover {
                    transform: scale(1.1) rotate(10deg);
                    box-shadow: 0 15px 50px rgba(0,0,0,0.4);
                }
                .notification-badge {
                    position: absolute;
                    top: -2px;
                    right: -2px;
                    background: var(--primary);
                    color: white;
                    font-size: 11px;
                    font-weight: 800;
                    padding: 4px 8px;
                    border-radius: 20px;
                    border: 2px solid ${isMen ? '#0f172a' : 'white'};
                    box-shadow: 0 2px 8px rgba(0,0,0,0.2);
                }
                .chat-window {
                    width: 380px;
                    height: 550px;
                    border-radius: 28px;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    box-shadow: var(--shadow-xl);
                    border: 1px solid rgba(0,0,0,0.05);
                    background: var(--white);
                }
                .chat-header {
                    background: var(--white);
                    padding: 24px 20px;
                    color: var(--fg);
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid var(--slate-100);
                }
                .chat-header-info {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }
                .chat-avatar {
                    width: 44px;
                    height: 44px;
                    background: var(--grad-soft);
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                }
                .online-indicator {
                    position: absolute;
                    bottom: -2px;
                    right: -2px;
                    width: 12px;
                    height: 12px;
                    background: #10b981;
                    border-radius: 50%;
                    border: 2.5px solid var(--white);
                    box-shadow: 0 0 10px rgba(16, 185, 129, 0.4);
                }
                .chat-header h4 { margin: 0; font-size: 16px; font-weight: 800; letter-spacing: -0.02em; color: var(--fg); }
                .chat-header span { font-size: 12px; color: var(--slate-400); font-weight: 600; }
                .close-btn { 
                    background: var(--slate-50); 
                    border: none; 
                    color: var(--slate-400); 
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer; 
                    transition: all 0.3s; 
                }
                .close-btn:hover { background: var(--slate-100); color: var(--fg); transform: rotate(90deg); }

                .chat-messages {
                    flex: 1;
                    padding: 24px 20px;
                    overflow-y: auto;
                    display: flex;
                    flex-direction: column;
                    gap: 14px;
                    background: var(--slate-50);
                }
                .chat-auth-form {
                    text-align: center;
                    padding: 20px 10px;
                }
                .chat-auth-form p { 
                    font-size: 15px; 
                    color: ${isMen ? '#94a3b8' : 'var(--slate-500)'}; 
                    margin-bottom: 24px; 
                    font-weight: 600;
                    line-height: 1.4;
                    padding: 0 20px;
                }
                .chat-auth-form form { display: flex; flex-direction: column; gap: 14px; }
                .chat-auth-form input {
                    padding: 14px 18px;
                    border-radius: 16px;
                    border: 1px solid ${isMen ? 'rgba(255,255,255,0.1)' : 'var(--slate-200)'};
                    background: ${isMen ? 'rgba(255,255,255,0.05)' : 'white'};
                    color: ${isMen ? 'white' : 'var(--fg)'};
                    font-family: inherit;
                    font-size: 14px;
                    transition: all 0.3s;
                    outline: none;
                }
                .chat-auth-form input:focus {
                    border-color: var(--primary);
                    background: var(--white);
                    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
                }
                
                .message-bubble {
                    max-width: 85%;
                    padding: 14px 18px;
                    border-radius: 18px;
                    font-size: 14px;
                    line-height: 1.5;
                    position: relative;
                }
                .message-bubble.user {
                    align-self: flex-end;
                    background: var(--grad-primary);
                    color: white;
                    border-bottom-right-radius: 4px;
                }
                .message-bubble.admin {
                    align-self: flex-start;
                    background: var(--white);
                    color: var(--fg);
                    border-bottom-left-radius: 4px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.02);
                    border: 1px solid var(--slate-100);
                }
                .msg-info {
                    display: flex;
                    align-items: center;
                    justify-content: flex-end;
                    gap: 6px;
                    font-size: 11px;
                    margin-top: 6px;
                    opacity: 0.6;
                }
                .system-msg {
                    text-align: center;
                    background: var(--slate-100);
                    padding: 14px;
                    border-radius: 18px;
                    font-size: 13px;
                    color: var(--slate-500);
                    font-weight: 500;
                    margin-bottom: 12px;
                }

                .chat-input-area {
                    padding: 24px 20px;
                    display: flex;
                    gap: 12px;
                    background: var(--white);
                    border-top: 1px solid var(--slate-100);
                }
                .chat-input-area input {
                    flex: 1;
                    border: 1px solid var(--slate-100);
                    background: var(--slate-50);
                    color: var(--fg);
                    padding: 12px 20px;
                    border-radius: 16px;
                    outline: none;
                    font-family: inherit;
                    font-size: 14px;
                    transition: all 0.3s;
                }
                .chat-input-area input:focus {
                    background: var(--white);
                    border-color: var(--primary);
                    box-shadow: 0 4px 20px rgba(0,0,0,0.05);
                }
                .send-btn {
                    background: var(--grad-primary);
                    color: white;
                    border: none;
                    width: 48px;
                    height: 48px;
                    border-radius: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .send-btn:hover { 
                    transform: scale(1.1) translateY(-3px);
                    box-shadow: 0 10px 25px rgba(var(--primary-h), 100%, 70%, 0.3);
                }

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
