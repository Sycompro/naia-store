'use client';
import React, { useState } from 'react';
import { X, Copy, Check, MessageCircle, Send, Globe } from 'lucide-react';

type ShareModalProps = {
    isOpen: boolean;
    onClose: () => void;
    product: any;
};

export default function ShareModal({ isOpen, onClose, product }: ShareModalProps) {
    const [copied, setCopied] = useState(false);

    if (!isOpen || !product) return null;

    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/#producto-${product.id}` : '';
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
        <div className="share-overlay animate-fade" onClick={onClose}>
            <div className="share-modal glass" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h3>Compartir Producto</h3>
                    <button onClick={onClose} className="close-btn"><X size={20} /></button>
                </div>

                <div className="product-preview">
                    <div className="preview-img" style={{ backgroundImage: `url(${product.imageUrl})` }}></div>
                    <div className="preview-info">
                        <h4>{product.name}</h4>
                        <p>{product.category}</p>
                    </div>
                </div>

                <div className="share-grid">
                    {shareLinks.map((link) => (
                        <a key={link.name} href={link.url} target="_blank" rel="noopener noreferrer" className="share-option">
                            <div className="icon-wrapper" style={{ backgroundColor: link.color + '15', color: link.color }}>
                                {link.icon}
                            </div>
                            <span>{link.name}</span>
                        </a>
                    ))}
                </div>

                <div className="copy-section">
                    <input type="text" readOnly value={shareUrl} />
                    <button onClick={handleCopy} className={copied ? 'copied' : ''}>
                        {copied ? <Check size={18} /> : <Copy size={18} />}
                        {copied ? '¡Copiado!' : 'Copiar'}
                    </button>
                </div>
            </div>

            <style jsx>{`
        .share-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.3);
          backdrop-filter: blur(8px);
          z-index: 3000;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        .share-modal {
          width: 100%;
          max-width: 400px;
          background: white;
          border-radius: 28px;
          padding: 30px;
          box-shadow: 0 20px 50px rgba(0,0,0,0.1);
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 25px;
        }
        .modal-header h3 { font-size: 18px; font-weight: 700; }
        .close-btn { background: none; border: none; cursor: pointer; color: #888; }
        
        .product-preview {
            display: flex;
            gap: 15px;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 16px;
            margin-bottom: 25px;
        }
        .preview-img { width: 60px; height: 60px; border-radius: 12px; background-size: cover; background-position: center; }
        .preview-info h4 { margin: 0 0 4px; font-size: 14px; }
        .preview-info p { margin: 0; font-size: 12px; color: #888; }

        .share-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-bottom: 25px;
        }
        .share-option {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          color: #2D3436;
          transition: transform 0.3s;
        }
        .share-option:hover { transform: translateY(-5px); }
        .icon-wrapper {
          width: 56px;
          height: 56px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .share-option span { font-size: 12px; font-weight: 600; }

        .copy-section {
            display: flex;
            gap: 10px;
            background: #f8f9fa;
            padding: 8px;
            border-radius: 14px;
            border: 1px solid #eee;
        }
        .copy-section input {
            flex: 1;
            border: none;
            background: transparent;
            font-size: 12px;
            color: #888;
            padding-left: 10px;
            outline: none;
        }
        .copy-section button {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 16px;
            border-radius: 10px;
            border: none;
            background: #1a1a1a;
            color: white;
            font-size: 12px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
        }
        .copy-section button.copied { background: #10b981; }
      `}</style>
        </div>
    );
}
