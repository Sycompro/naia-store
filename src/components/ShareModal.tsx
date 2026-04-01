'use client';
import React, { useState } from 'react';
import { X, Copy, Check, MessageCircle, Send, Globe, Share2, Sparkles } from 'lucide-react';

type ShareModalProps = {
    isOpen: boolean;
    onClose: () => void;
    product: any;
};

export default function ShareModal({ isOpen, onClose, product }: ShareModalProps) {
    const [copied, setCopied] = useState(false);

    if (!isOpen || !product) return null;

    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/productos/${product.id}` : '';
    const shareText = `¡Mira este producto en Naia: ${product.name}! ✨`;

    const handleCopy = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const shareLinks = [
        {
            name: 'WhatsApp',
            icon: <Send size={24} />,
            color: '#25D366',
            url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`
        },
        {
            name: 'Facebook',
            icon: <MessageCircle size={24} />,
            color: '#1877F2',
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`
        },
        {
            name: 'Twitter',
            icon: <Globe size={24} />,
            color: '#1DA1F2',
            url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`
        },
    ];

    return (
        <div className="p-share-overlay animate-fade" onClick={onClose}>
            <div className="p-share-modal glass-premium scale-in" onClick={(e) => e.stopPropagation()}>
                <div className="p-modal-header">
                    <div className="p-modal-title">
                        <Share2 size={20} className="text-primary" />
                        <h3>Compartir</h3>
                    </div>
                    <button onClick={onClose} className="p-close-btn glass-premium"><X size={18} /></button>
                </div>

                <div className="p-product-preview glass-premium">
                    <div className="p-preview-img" style={{ backgroundImage: `url(${product.imageUrl})` }}></div>
                    <div className="p-preview-info">
                        <h4>{product.name}</h4>
                        <div className="p-preview-tag"><Sparkles size={12} /> {product.category}</div>
                    </div>
                </div>

                <div className="p-share-grid">
                    {shareLinks.map((link) => (
                        <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="p-share-option">
                            <div className="p-icon-box" style={{ backgroundColor: link.color + '15', color: link.color }}>
                                {link.icon}
                            </div>
                            <span>{link.name}</span>
                        </a>
                    ))}
                </div>

                <div className="p-copy-area glass-premium">
                    <input type="text" readOnly value={shareUrl} />
                    <button onClick={handleCopy} className={`p-copy-btn ${copied ? 'copied' : ''}`}>
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        <span>{copied ? '¡Listo!' : 'Copiar'}</span>
                    </button>
                </div>
            </div>

            <style jsx>{`
                .p-share-overlay {
                    position: fixed; inset: 0; background: rgba(0,0,0,0.3);
                    backdrop-filter: blur(8px); z-index: 3000;
                    display: flex; align-items: center; justify-content: center; padding: 20px;
                }
                .p-share-modal {
                    width: 100%; max-width: 420px; padding: 35px; border-radius: var(--radius-xl);
                }
                .p-modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 25px; }
                .p-modal-title { display: flex; align-items: center; gap: 12px; }
                .p-modal-title h3 { font-size: 20px; font-weight: 800; }
                .p-close-btn { width: 40px; height: 40px; border-radius: 50%; border: none; display: flex; align-items: center; justify-content: center; color: var(--slate-400); cursor: pointer; transition: all 0.3s; }
                .p-close-btn:hover { color: var(--primary); transform: rotate(90deg); }

                .p-product-preview { display: flex; gap: 18px; padding: 15px; border-radius: 20px; margin-bottom: 30px; }
                .p-preview-img { width: 64px; height: 64px; border-radius: 14px; background-size: cover; background-position: center; flex-shrink: 0; }
                .p-preview-info { display: flex; flex-direction: column; justify-content: center; gap: 6px; }
                .p-preview-info h4 { font-size: 16px; font-weight: 800; margin: 0; }
                .p-preview-tag { display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 800; color: var(--primary); text-transform: uppercase; }

                .p-share-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 35px; }
                .p-share-option { display: flex; flex-direction: column; align-items: center; gap: 12px; text-decoration: none; color: var(--fg); transition: all 0.3s; }
                .p-share-option:hover { transform: translateY(-5px); }
                .p-icon-box { width: 64px; height: 64px; border-radius: 20px; display: flex; align-items: center; justify-content: center; transition: all 0.3s; }
                .p-share-option span { font-size: 13px; font-weight: 800; }

                .p-copy-area { display: flex; padding: 8px; border-radius: 20px; gap: 10px; align-items: center; }
                .p-copy-area input { flex: 1; border: none; background: transparent; font-size: 13px; font-weight: 600; color: var(--slate-400); padding-left: 10px; outline: none; }
                .p-copy-btn { 
                    display: flex; align-items: center; gap: 10px; padding: 10px 20px; border-radius: 14px; border: none;
                    background: var(--fg); color: white; font-size: 13px; font-weight: 800; cursor: pointer; transition: all 0.3s;
                }
                .p-copy-btn.copied { background: #10b981; }
                .p-copy-btn:hover { opacity: 0.9; transform: scale(1.02); }

                .scale-in { animation: scaleIn 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
                @keyframes scaleIn { from { opacity: 0; transform: scale(0.9); } to { opacity: 1; transform: scale(1); } }
                .text-primary { color: var(--primary); }
            `}</style>
        </div>
    );
}
