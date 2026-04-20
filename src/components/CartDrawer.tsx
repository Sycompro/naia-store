'use client';
import React from 'react';
import { ShoppingCart, X, Plus, Minus, Trash2, Send, ShieldCheck, Truck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function CartDrawer({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
    const { cart, updateQuantity, removeFromCart, totalAmount, isWholesaleActive, clearCart } = useCart();
    const router = useRouter();

    if (!isOpen) return null;

    const [isGuestFormOpen, setIsGuestFormOpen] = React.useState(false);
    const [guestInfo, setGuestInfo] = React.useState({ name: '', phone: '' });
    const [loading, setLoading] = React.useState(false);
    const { user } = useAuth();

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
                clearCart();
                onClose();
                router.push(`/checkout/success?orderId=${orderId}`);
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
            <div className="p-cart-drawer" onClick={e => e.stopPropagation()}>
                <div className="p-drawer-header">
                    <div className="header-top">
                        <h3 className="section-title">Tu <span className="text-gradient">Selección</span></h3>
                        <button onClick={onClose} className="p-close-btn"><X size={20} /></button>
                    </div>
                    {cart.length > 0 && (
                        <div className="p-items-count">
                            <span>{cart.reduce((acc, item) => acc + item.quantity, 0)} Productos seleccionados</span>
                        </div>
                    )}
                </div>

                <div className="p-drawer-content custom-scrollbar">
                    {cart.length === 0 ? (
                        <div className="p-empty-cart">
                            <div className="empty-icon">
                                <ShoppingCart size={48} strokeWidth={1} />
                            </div>
                            <h4>Tu carrito está vacío</h4>
                            <p>Parece que aún no has añadido nada a tu selección de belleza.</p>
                            <button onClick={onClose} className="btn-premium-v4 btn-grad mt-20">Explorar Catálogo</button>
                        </div>
                    ) : (
                        <div className="p-cart-items">
                            {cart.map((item) => (
                                <div key={item.id} className="p-cart-item animate-up">
                                    <div className="p-item-img" style={{ backgroundImage: `url(${item.imageUrl})` }}></div>
                                    <div className="p-item-info">
                                        <div className="p-item-top">
                                            <span className="p-item-cat">{item.category}</span>
                                            <button className="p-item-trash" onClick={() => removeFromCart(item.id)}><Trash2 size={16} /></button>
                                        </div>
                                        <h4>{item.name}</h4>
                                        <div className="p-item-bottom">
                                            <div className="p-item-price-wrap">
                                                <span className="p-item-price">S/ {(isWholesaleActive ? item.wholesalePrice : item.unitPrice).toFixed(2)}</span>
                                                {isWholesaleActive && <span className="p-tag-may">Mayorista</span>}
                                            </div>
                                            <div className="p-item-qty">
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
                    <div className="p-drawer-footer">
                        <div className="shipping-progress">
                            <p className="progress-text">
                                {totalAmount >= 150 
                                    ? "✨ Envío Premium Gratuito Desbloqueado" 
                                    : <>Estás a <strong>S/ {(150 - totalAmount).toFixed(2)}</strong> de envío gratis</>}
                            </p>
                            <div className="progress-bar-bg">
                                <div className="progress-fill" style={{ width: `${Math.min(100, (totalAmount / 150) * 100)}%` }}></div>
                            </div>
                        </div>

                        {isGuestFormOpen && !user && (
                            <div className="guest-form animate-up">
                                <h4>Datos de Entrega</h4>
                                <div className="form-group">
                                    <input
                                        type="text"
                                        placeholder="Tu nombre completo"
                                        value={guestInfo.name}
                                        onChange={e => setGuestInfo({ ...guestInfo, name: e.target.value })}
                                        className="premium-input"
                                    />
                                    <input
                                        type="tel"
                                        placeholder="WhatsApp (ej: 999 123 456)"
                                        value={guestInfo.phone}
                                        onChange={e => setGuestInfo({ ...guestInfo, phone: e.target.value })}
                                        className="premium-input"
                                    />
                                </div>
                            </div>
                        )}
                        
                        <div className="p-total-area">
                            <div className="p-total-row">
                                <div className="total-l">
                                    <span>Total a pagar</span>
                                    {isWholesaleActive && <span className="wholesale-hint">¡Precio mayorista aplicado!</span>}
                                </div>
                                <span className="p-total-price">S/ {totalAmount.toFixed(2)}</span>
                            </div>
                            
                            <button
                                className="btn-premium-v4 btn-grad w-full checkout-btn"
                                onClick={handleWhatsAppCheckout}
                                disabled={loading}
                            >
                                <span>{loading ? 'Procesando...' : (isGuestFormOpen && !user ? 'Confirmar Pedido' : 'Finalizar Compra')}</span>
                                {!loading && <Send size={18} />}
                            </button>
                        </div>

                        <div className="trust-badges-cart">
                            <div className="trust-item"><ShieldCheck size={14} /> <span>Pago Seguro</span></div>
                            <div className="trust-item"><Truck size={14} /> <span>Envío Express</span></div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx>{`
                .p-cart-overlay {
                    position: fixed; inset: 0; background: rgba(0,0,0,0.4);
                    backdrop-filter: blur(4px); z-index: 2000;
                    display: flex; justify-content: flex-end;
                }
                .p-cart-drawer {
                    width: 100%; max-width: 440px; height: 100%;
                    background: var(--white);
                    display: flex; flex-direction: column;
                    box-shadow: -20px 0 60px rgba(0,0,0,0.15);
                    position: relative;
                }
                
                .p-drawer-header { padding: 40px 30px 20px; border-bottom: 1px solid var(--slate-100); }
                .header-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
                .p-close-btn { width: 44px; height: 44px; border-radius: 50%; border: none; background: var(--slate-50); display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s; color: var(--slate-400); }
                .p-close-btn:hover { background: var(--slate-100); color: var(--fg); transform: rotate(90deg); }
                .p-items-count { font-size: 13px; font-weight: 700; color: var(--slate-400); text-transform: uppercase; letter-spacing: 0.05em; }

                .p-drawer-content { flex: 1; overflow-y: auto; padding: 30px; }
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: var(--slate-200); border-radius: 10px; }

                .p-empty-cart { text-align: center; margin-top: 100px; padding: 0 20px; }
                .empty-icon { width: 100px; height: 100px; border-radius: 50%; margin: 0 auto 30px; display: flex; align-items: center; justify-content: center; background: var(--slate-50); color: var(--slate-300); }
                .p-empty-cart h4 { font-size: 22px; font-weight: 900; margin-bottom: 10px; letter-spacing: -0.5px; }
                .p-empty-cart p { color: var(--slate-400); font-size: 15px; font-weight: 500; line-height: 1.6; }
                .mt-20 { margin-top: 30px; }

                .p-cart-items { display: flex; flex-direction: column; gap: 16px; }
                .p-cart-item { padding: 12px; border-radius: 20px; display: flex; gap: 16px; background: var(--white); border: 1px solid var(--slate-50); box-shadow: var(--shadow-sm); transition: all 0.3s; }
                .p-cart-item:hover { box-shadow: var(--shadow-md); border-color: var(--slate-100); }
                .p-item-img { width: 100px; height: 100px; border-radius: 14px; background-size: cover; background-position: center; flex-shrink: 0; }
                .p-item-info { flex: 1; display: flex; flex-direction: column; justify-content: center; }
                .p-item-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px; }
                .p-item-cat { font-size: 10px; font-weight: 800; color: var(--primary); text-transform: uppercase; letter-spacing: 0.1em; }
                .p-item-trash { background: none; border: none; cursor: pointer; color: var(--slate-300); transition: 0.3s; }
                .p-item-trash:hover { color: #f43f5e; transform: scale(1.1); }
                
                .p-item-info h4 { font-size: 15px; font-weight: 800; margin: 0 0 12px; color: var(--fg); line-height: 1.3; }
                .p-item-bottom { display: flex; justify-content: space-between; align-items: flex-end; }
                .p-item-price-wrap { display: flex; flex-direction: column; gap: 4px; }
                .p-item-price { font-weight: 950; font-size: 18px; color: var(--fg); letter-spacing: -0.5px; }
                .p-tag-may { font-size: 9px; padding: 2px 6px; background: #ecfdf5; color: #10b981; border-radius: 4px; font-weight: 800; width: fit-content; border: 1px solid rgba(16, 185, 129, 0.1); }
                
                .p-item-qty { display: flex; align-items: center; gap: 12px; padding: 4px; border-radius: 12px; background: var(--slate-50); border: 1px solid var(--slate-100); }
                .p-item-qty button { width: 30px; height: 30px; border-radius: 8px; background: var(--white); border: 1px solid var(--slate-200); cursor: pointer; color: var(--fg); display: flex; align-items: center; justify-content: center; transition: 0.2s; box-shadow: var(--shadow-sm); }
                .p-item-qty button:active { transform: scale(0.9); }
                .p-item-qty span { font-size: 14px; font-weight: 800; min-width: 20px; text-align: center; }

                .p-drawer-footer { padding: 30px; background: var(--white); border-top: 1px solid var(--slate-100); box-shadow: 0 -10px 40px rgba(0,0,0,0.02); }
                .guest-form { margin-bottom: 25px; padding: 20px; border-radius: 20px; background: var(--slate-50); border: 1px solid var(--slate-100); }
                .guest-form h4 { font-size: 13px; font-weight: 800; margin-bottom: 15px; color: var(--slate-400); text-transform: uppercase; letter-spacing: 0.05em; }
                .form-group { display: flex; flex-direction: column; gap: 12px; }
                .premium-input { background: var(--white); border: 1px solid var(--slate-200); padding: 14px 18px; border-radius: 14px; font-size: 14px; font-weight: 600; outline: none; transition: 0.3s; }
                .premium-input:focus { border-color: var(--primary); box-shadow: 0 4px 15px rgba(var(--primary-h), 100%, 70%, 0.1); }

                .p-total-area { margin-bottom: 20px; }
                .p-total-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
                .total-l { display: flex; flex-direction: column; gap: 2px; }
                .total-l span:first-child { font-size: 14px; font-weight: 700; color: var(--slate-500); }
                .wholesale-hint { font-size: 12px; font-weight: 800; color: #10b981; }
                .p-total-price { font-size: 32px; font-weight: 950; color: var(--fg); letter-spacing: -1px; }
                
                .checkout-btn { height: 60px; font-size: 17px; border-radius: 18px; width: 100%; display: flex; align-items: center; justify-content: center; gap: 12px; }
                .w-full { width: 100%; }

                .shipping-progress { margin-bottom: 25px; }
                .progress-text { font-size: 12px; font-weight: 800; color: var(--slate-500); margin-bottom: 10px; text-transform: uppercase; letter-spacing: 0.05em; text-align: center; }
                .progress-text strong { color: var(--primary); }
                .progress-bar-bg { width: 100%; height: 8px; background: var(--slate-100); border-radius: 10px; overflow: hidden; }
                .progress-fill { height: 100%; background: var(--grad-primary); border-radius: 10px; transition: width 0.8s cubic-bezier(0.19, 1, 0.22, 1); }
                
                .trust-badges-cart { display: flex; justify-content: center; gap: 20px; margin-top: 15px; }
                .trust-item { display: flex; align-items: center; gap: 6px; color: var(--slate-400); font-size: 11px; font-weight: 700; }
                .trust-item :global(svg) { color: #10b981; opacity: 0.7; }

                @media (max-width: 500px) {
                    .p-cart-drawer { max-width: 100%; }
                    .p-drawer-header { padding: 30px 20px 15px; }
                    .p-drawer-content { padding: 20px; }
                    .p-drawer-footer { padding: 25px 20px; }
                }
            `}</style>

        </div>
    );
}
