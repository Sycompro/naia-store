'use client';
import React from 'react';
import { ShoppingCart, X, Plus, Minus, Trash2, Send, Sparkles } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartDrawer({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const { cart, updateQuantity, removeFromCart, totalAmount, isWholesaleActive } = useCart();

    if (!isOpen) return null;

    const [isGuestFormOpen, setIsGuestFormOpen] = React.useState(false);
    const [guestInfo, setGuestInfo] = React.useState({ name: '', phone: '' });
    const [loading, setLoading] = React.useState(false);
    const { user } = { user: null }; // Mock or useAuth if available

    if (!isOpen) return null;

    const handleWhatsAppCheckout = async () => {
        if (!user && !isGuestFormOpen) {
            setIsGuestFormOpen(true);
            return;
        }

        if (isGuestFormOpen && (!guestInfo.name || !guestInfo.phone)) {
            alert('Por favor completa tu nombre y teléfono');
            return;
        }

        setLoading(true);
        try {
            // 1. Create Order in DB
            const orderRes = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    items: cart,
                    total: totalAmount,
                    customerName: user ? undefined : guestInfo.name,
                    customerPhone: user ? undefined : guestInfo.phone
                })
            });

            const orderData = await orderRes.json();

            if (orderRes.ok) {
                // 2. Open WhatsApp
                const orderId = orderData.order.id;
                const message = `*Nuevo Pedido Naia #${orderId}*%0A%0A` +
                    cart.map(item => `- ${item.name} x${item.quantity} (${isWholesaleActive ? 'May.' : 'Unit.'})`).join('%0A') +
                    `%0A%0A*Total: S/ ${totalAmount.toFixed(2)}*%0A%0A_ID de Seguimiento: ${orderId}_`;

                window.open(`https://wa.me/51944399377?text=${message}`, '_blank');
                onClose();
            } else {
                alert('Error al procesar el pedido. Intenta nuevamente.');
            }
        } catch (e) {
            console.error(e);
            alert('Error de conexión');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-cart-overlay animate-fade" onClick={onClose}>
            <div className="p-cart-drawer glass-premium" onClick={e => e.stopPropagation()}>
                <div className="p-drawer-header">
                    <div className="header-top">
                        <h3 className="text-gradient">Tu Selección</h3>
                        <button onClick={onClose} className="p-close-btn glass-premium"><X size={20} /></button>
                    </div>
                    {cart.length > 0 && (
                        <div className="p-items-count">
                            <span>{cart.reduce((acc, item) => acc + item.quantity, 0)} Productos</span>
                            <Sparkles size={14} className="text-primary" />
                        </div>
                    )}
                </div>

                <div className="p-drawer-content">
                    {cart.length === 0 ? (
                        <div className="p-empty-cart">
                            <div className="empty-icon glass-premium">
                                <ShoppingCart size={40} strokeWidth={1.5} />
                            </div>
                            <h4>Tu carrito espera ser llenado</h4>
                            <p>Explora nuestras colecciones y descubre tu próximo favorito.</p>
                            <button onClick={onClose} className="btn-premium btn-primary-v3 mt-20">Ver Catálogo</button>
                        </div>
                    ) : (
                        <div className="p-cart-items">
                            {cart.map((item) => (
                                <div key={item.id} className="p-cart-item glass-premium animate-fade">
                                    <div className="p-item-img" style={{ backgroundImage: `url(${item.imageUrl})` }}></div>
                                    <div className="p-item-info">
                                        <div className="p-item-top">
                                            <span className="p-item-cat">{item.category}</span>
                                            <button className="p-item-trash" onClick={() => removeFromCart(item.id)}><Trash2 size={16} /></button>
                                        </div>
                                        <h4>{item.name}</h4>
                                        <div className="p-item-bottom">
                                            <span className="p-item-price">
                                                S/ {(isWholesaleActive ? item.wholesalePrice : item.unitPrice).toFixed(2)}
                                                {isWholesaleActive && <span className="p-tag-may">Mayorista</span>}
                                            </span>
                                            <div className="p-item-qty glass-premium">
                                                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus size={14} /></button>
                                                <span>{item.quantity}</span>
                                                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus size={14} /></button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {cart.length > 0 && (
                    <div className="p-drawer-footer glass-premium">
                        {isGuestFormOpen && !user && (
                            <div className="guest-form animate-entrance">
                                <h4>Datos de Entrega</h4>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        placeholder="Nombre Completo"
                                        value={guestInfo.name}
                                        onChange={e => setGuestInfo({ ...guestInfo, name: e.target.value })}
                                        className="glass-input"
                                    />
                                    <input
                                        type="tel"
                                        placeholder="Teléfono / WhatsApp"
                                        value={guestInfo.phone}
                                        onChange={e => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                                        className="glass-input"
                                    />
                                </div>
                            </div>
                        )}
                        <div className="p-total-row">
                            <div className="total-l">
                                <span>Total Estimado</span>
                                {isWholesaleActive && <span className="wholesale-hint">¡Ahorro mayorista aplicado!</span>}
                            </div>
                            <span className="p-total-price">S/ {totalAmount.toFixed(2)}</span>
                        </div>
                        <button
                            className="btn-premium btn-primary-v3 w-full checkout-btn"
                            onClick={handleWhatsAppCheckout}
                            disabled={loading}
                        >
                            {loading ? 'Procesando...' : (isGuestFormOpen && !user ? 'Confirmar y Enviar' : 'Finalizar Pedido')}
                            {!loading && <Send size={18} />}
                        </button>
                        <p className="p-footer-note">Serás redirigido a WhatsApp para concretar tu pedido.</p>
                    </div>
                )}
            </div>

            <style jsx>{`
                .p-cart-overlay {
                    position: fixed; inset: 0; background: rgba(0,0,0,0.3);
                    backdrop-filter: blur(8px); z-index: 2000;
                    display: flex; justify-content: flex-end;
                }
                .p-cart-drawer {
                    width: 100%; max-width: 440px; height: 100%;
                    border-radius: var(--radius-xl) 0 0 var(--radius-xl);
                    display: flex; flex-direction: column;
                    border: none; border-left: 1px solid var(--glass-border);
                    box-shadow: -20px 0 50px rgba(0,0,0,0.15);
                }
                
                .p-drawer-header { padding: 30px; border-bottom: 1px solid var(--slate-100); }
                .header-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
                .header-top h3 { font-size: 24px; font-weight: 800; }
                .p-close-btn { width: 44px; height: 44px; border-radius: 50%; border: none; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s; }
                .p-close-btn:hover { background: var(--secondary); color: var(--primary); transform: rotate(90deg); }
                
                .p-items-count { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 700; color: var(--slate-400); }
                .text-primary { color: var(--primary); }

                .p-drawer-content { flex: 1; overflow-y: auto; padding: 30px; scrollbar-width: none; }
                .p-drawer-content::-webkit-scrollbar { display: none; }

                .p-empty-cart { text-align: center; margin-top: 80px; }
                .empty-icon { 
                    width: 100px; height: 100px; border-radius: 50%; margin: 0 auto 25px;
                    display: flex; align-items: center; justify-content: center;
                    color: var(--slate-400);
                }
                .p-empty-cart h4 { font-size: 20px; font-weight: 800; margin-bottom: 10px; }
                .p-empty-cart p { color: var(--slate-400); font-size: 15px; font-weight: 500; line-height: 1.5; }
                .mt-20 { margin-top: 25px; }

                .p-cart-items { display: flex; flex-direction: column; gap: 20px; }
                .p-cart-item { padding: 15px; border-radius: 20px; display: flex; gap: 18px; }
                .p-item-img { 
                    width: 90px; height: 90px; border-radius: 14px; 
                    background-size: cover; background-position: center; 
                    flex-shrink: 0; box-shadow: var(--shadow-sm);
                }
                .p-item-info { flex: 1; display: flex; flex-direction: column; justify-content: space-between; }
                .p-item-top { display: flex; justify-content: space-between; align-items: center; }
                .p-item-cat { font-size: 10px; font-weight: 800; color: var(--primary); text-transform: uppercase; letter-spacing: 0.05em; }
                .p-item-trash { background: none; border: none; cursor: pointer; color: var(--slate-300); transition: color 0.3s; }
                .p-item-trash:hover { color: #f43f5e; }
                
                .p-item-info h4 { font-size: 16px; font-weight: 800; margin: 4px 0 10px; line-height: 1.3; }
                .p-item-bottom { display: flex; justify-content: space-between; align-items: center; }
                .p-item-price { font-weight: 900; font-size: 17px; display: flex; align-items: center; gap: 8px; color: var(--fg); }
                .p-tag-may { font-size: 9px; padding: 3px 8px; background: var(--primary-light); color: var(--primary); border-radius: 4px; font-weight: 800; }
                
                .p-item-qty { display: flex; align-items: center; gap: 12px; padding: 5px; border-radius: 12px; }
                .p-item-qty button { 
                    width: 36px; height: 36px; border-radius: 10px;
                    background: rgba(0,0,0,0.03); border: none; cursor: pointer; color: var(--fg); 
                    display: flex; align-items: center; justify-content: center;
                    transition: 0.2s;
                }
                .p-item-qty button:active { transform: scale(0.9); background: var(--slate-100); }
                .p-item-qty span { font-size: 15px; font-weight: 800; min-width: 24px; text-align: center; }

                .p-drawer-footer { 
                    padding: 25px 20px calc(20px + var(--safe-bottom)); 
                    margin: 0 15px 15px; border-radius: 24px; 
                }
                .guest-form { margin-bottom: 20px; padding: 15px; border-radius: 16px; background: rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.05); }
                .guest-form h4 { font-size: 14px; font-weight: 800; margin-bottom: 12px; opacity: 0.8; }
                .form-group { display: flex; flex-direction: column; gap: 10px; }
                .glass-input {
                    background: rgba(255, 255, 255, 0.5);
                    border: 1px solid rgba(0,0,0,0.1);
                    padding: 12px 16px;
                    border-radius: 12px;
                    font-size: 14px;
                    font-weight: 600;
                    outline: none;
                    transition: all 0.3s;
                }
                .glass-input:focus { border-color: var(--primary); background: white; }

                .p-total-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
                .total-l { display: flex; flex-direction: column; }
                .total-l span:first-child { font-size: 13px; font-weight: 700; color: var(--slate-500); }
                .wholesale-hint { font-size: 11px; font-weight: 800; color: #10b981; }
                .p-total-price { font-size: 24px; font-weight: 950; color: var(--fg); }
                
                .checkout-btn { height: 56px; font-size: 16px; margin-bottom: 12px; border-radius: 18px; }
                .p-footer-note { font-size: 11px; text-align: center; color: var(--slate-400); font-weight: 600; opacity: 0.8; }
                .w-full { width: 100%; justify-content: center; }

                @media (max-width: 500px) {
                    .p-cart-drawer { max-width: 100%; border-radius: 0; }
                    .p-drawer-header { padding: 20px; }
                    .header-top h3 { font-size: 20px; }
                    .p-drawer-content { padding: 20px; }
                    .p-drawer-footer { margin: 0; border-radius: 30px 30px 0 0; padding: 25px 20px calc(25px + var(--safe-bottom)); box-shadow: 0 -10px 40px rgba(0,0,0,0.1); }
                }
            `}</style>
        </div>
    );
}
