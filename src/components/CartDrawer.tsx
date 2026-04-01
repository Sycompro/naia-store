'use client';
import React from 'react';
import { ShoppingCart, X, Plus, Minus, Trash2, Send } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartDrawer({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const { cart, updateQuantity, removeFromCart, totalAmount, isWholesaleActive } = useCart();

    if (!isOpen) return null;

    const handleWhatsAppCheckout = () => {
        const message = `*Nuevo Pedido Naia*%0A%0A` +
            cart.map(item => `- ${item.name} x${item.quantity} (${isWholesaleActive ? 'May.' : 'Unit.'})`).join('%0A') +
            `%0A%0A*Total: $${totalAmount.toFixed(2)}*`;
        window.open(`https://wa.me/51944399377?text=${message}`, '_blank');
    };

    return (
        <div className="cart-overlay animate-fade">
            <div className="cart-drawer glass shadow-lg">
                <div className="drawer-header">
                    <h3>Tu Carrito</h3>
                    <button onClick={onClose} className="close-btn"><X size={24} /></button>
                </div>

                <div className="drawer-content">
                    {cart.length === 0 ? (
                        <div className="empty-cart">
                            <ShoppingCart size={48} />
                            <p>Tu carrito está vacío</p>
                            <button onClick={onClose} className="btn btn-primary">Ver Productos</button>
                        </div>
                    ) : (
                        <div className="cart-items">
                            {cart.map((item) => (
                                <div key={item.id} className="cart-item">
                                    <div className="item-img" style={{ backgroundImage: `url(${item.imageUrl})` }}></div>
                                    <div className="item-details">
                                        <h4>{item.name}</h4>
                                        <span className="item-price">
                                            ${(isWholesaleActive ? item.wholesalePrice : item.unitPrice).toFixed(2)}
                                            {isWholesaleActive && <span className="may-tag">May.</span>}
                                        </span>
                                        <div className="item-qty">
                                            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={14} /></button>
                                            <span>{item.quantity}</span>
                                            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={14} /></button>
                                            <button className="del-item" onClick={() => removeFromCart(item.id)}><Trash2 size={14} /></button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="drawer-footer">
                        <div className="total-row">
                            <span>Total Estimado</span>
                            <span className="total-price">${totalAmount.toFixed(2)}</span>
                        </div>
                        {isWholesaleActive && <p className="wholesale-msg">¡Precio Mayorista Aplicado! ✨</p>}
                        <button className="btn btn-primary full-width checkout-btn" onClick={handleWhatsAppCheckout}>
                            Pedir por WhatsApp <Send size={18} />
                        </button>
                    </div>
                )}
            </div>

            <style jsx>{`
        .cart-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.4);
          backdrop-filter: blur(4px);
          z-index: 2000;
          display: flex;
          justify-content: flex-end;
        }
        .cart-drawer {
          width: 100%;
          max-width: 400px;
          height: 100%;
          background: white;
          display: flex;
          flex-direction: column;
          box-shadow: -10px 0 30px rgba(0,0,0,0.1);
        }
        .drawer-header {
          padding: 20px;
          border-bottom: 1px solid #eee;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .drawer-header h3 { font-size: 20px; font-weight: 700; margin: 0; }
        .close-btn { background: none; border: none; cursor: pointer; color: #666; }
        
        .drawer-content { flex: 1; overflow-y: auto; padding: 20px; }
        .empty-cart { text-align: center; margin-top: 100px; color: #888; }
        .empty-cart p { margin: 15px 0 25px; }

        .cart-items { display: flex; flex-direction: column; gap: 20px; }
        .cart-item { display: flex; gap: 15px; align-items: center; }
        .item-img { width: 70px; height: 70px; border-radius: 12px; background-size: cover; background-position: center; border: 1px solid #eee; }
        .item-details { flex: 1; }
        .item-details h4 { margin: 0 0 5px; font-size: 14px; }
        .item-price { font-weight: 700; color: var(--primary-dark); font-size: 15px; display: flex; align-items: center; gap: 5px; }
        .may-tag { background: #EBF5FF; color: #007bff; font-size: 10px; padding: 2px 6px; border-radius: 4px; }
        
        .item-qty { display: flex; align-items: center; gap: 10px; margin-top: 8px; }
        .item-qty button { width: 24px; height: 24px; border: 1px solid #ddd; border-radius: 6px; background: white; cursor: pointer; display: flex; align-items: center; justify-content: center; }
        .item-qty span { font-size: 14px; font-weight: 600; min-width: 20px; text-align: center; }
        .del-item { margin-left: auto; color: #ff4d4d; border-color: #ff4d4d !important; }

        .drawer-footer { padding: 20px; border-top: 1px solid #eee; }
        .total-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
        .total-row span:first-child { color: #666; }
        .total-price { font-size: 24px; font-weight: 800; color: #1a1a1a; }
        .wholesale-msg { color: #10b981; font-size: 12px; text-align: center; margin-bottom: 10px; font-weight: 600; }
        .checkout-btn { gap: 10px; padding: 16px; font-size: 16px; border-radius: 14px; }
      `}</style>
        </div>
    );
}
