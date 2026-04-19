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
            <div className="p-share-modal animate-up" onClick={(e) => e.stopPropagation()}>
                <div className="p-modal-header">
                    <div className="p-modal-title">
                        <Share2 size={24} className="text-grad-v4" />
                        <h3 className="section-title">Comparte <span className="text-gradient">Belleza</span></h3>
                    </div>
                    <button onClick={onClose} className="p-close-btn"><X size={18} /></button>
                </div>

                <div className="p-product-preview">
                    <div className="p-preview-img" style={{ backgroundImage: `url(${product.imageUrl})` }}></div>
                    <div className="p-preview-info">
                        <h4>{product.name}</h4>
                        <div className="p-preview-tag"><Sparkles size={12} /> {product.category}</div>
                    </div>
                </div>

                <div className="p-share-grid">
                    {shareLinks.map((link) => (
                        <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="p-share-option">
                            <div className="p-icon-box" style={{ backgroundColor: link.color + '10', color: link.color }}>
                                {link.icon}
                            </div>
                            <span>{link.name}</span>
                        </a>
                    ))}
                </div>

                <div className="p-copy-area">
                    <input type="text" readOnly value={shareUrl} />
                    <button onClick={handleCopy} className={`p-copy-btn ${copied ? 'copied' : ''}`}>
                        {copied ? <Check size={16} /> : <Copy size={16} />}
                        <span>{copied ? '¡Copiado!' : 'Copiar Link'}</span>
                    </button>
                </div>
            </div>

            <style jsx>{`
                .p-share-overlay {
                    position: fixed; inset: 0; background: rgba(0,0,0,0.4);
                    backdrop-filter: blur(4px); z-index: 3000;
                    display: flex; align-items: center; justify-content: center; padding: 20px;
                }
                .p-share-modal {
                    width: 100%; max-width: 440px; padding: 40px; border-radius: 32px;
                    background: var(--white); box-shadow: 0 30px 60px rgba(0,0,0,0.2);
                }
                .p-modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; }
                .p-modal-title { display: flex; align-items: center; gap: 15px; }
                .p-modal-title h3 { font-size: 22px; font-weight: 800; margin: 0; letter-spacing: -0.5px; }
                .p-close-btn { width: 38px; height: 38px; border-radius: 50%; border: none; background: var(--slate-50); display: flex; align-items: center; justify-content: center; color: var(--slate-400); cursor: pointer; transition: 0.3s; }
                .p-close-btn:hover { color: var(--fg); background: var(--slate-100); transform: rotate(90deg); }

                .p-product-preview { display: flex; gap: 18px; padding: 18px; border-radius: 20px; margin-bottom: 30px; background: var(--slate-50); border: 1px solid var(--slate-100); }
                .p-preview-img { width: 70px; height: 70px; border-radius: 12px; background-size: cover; background-position: center; flex-shrink: 0; box-shadow: var(--shadow-sm); }
                .p-preview-info { display: flex; flex-direction: column; justify-content: center; gap: 6px; }
                .p-preview-info h4 { font-size: 16px; font-weight: 800; margin: 0; color: var(--fg); }
                .p-preview-tag { display: flex; align-items: center; gap: 6px; font-size: 11px; font-weight: 800; color: var(--primary); text-transform: uppercase; letter-spacing: 0.1em; }

                .p-share-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 35px; }
                .p-share-option { display: flex; flex-direction: column; align-items: center; gap: 12px; text-decoration: none; color: var(--fg); transition: 0.3s; }
                .p-share-option:hover { transform: translateY(-5px); }
                .p-icon-box { width: 68px; height: 68px; border-radius: 22px; display: flex; align-items: center; justify-content: center; transition: 0.3s; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
                .p-share-option:hover .p-icon-box { box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
                .p-share-option span { font-size: 13px; font-weight: 800; color: var(--slate-500); }

                .p-copy-area { display: flex; padding: 8px; border-radius: 18px; gap: 10px; align-items: center; background: var(--slate-50); border: 1px solid var(--slate-100); }
                .p-copy-area input { flex: 1; border: none; background: transparent; font-size: 13px; font-weight: 600; color: var(--slate-500); padding-left: 15px; outline: none; }
                .p-copy-btn { 
                    display: flex; align-items: center; gap: 10px; padding: 12px 24px; border-radius: 14px; border: none;
                    background: var(--fg); color: white; font-size: 13px; font-weight: 800; cursor: pointer; transition: 0.3s;
                }
                .p-copy-btn.copied { background: #10b981; }
                .p-copy-btn:hover { transform: scale(1.02); opacity: 0.9; }

                .text-grad-v4 { color: var(--primary); }
            `}</style>

        </div>
    );
}
