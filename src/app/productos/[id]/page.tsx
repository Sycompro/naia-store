'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ShoppingBag, Heart, Share2, Shield, Truck, RotateCcw, Star, ChevronRight, Sparkles, FileText, MessageCircle, Circle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import ShareModal from '@/components/ShareModal';

interface Product {
    id: number;
    name: string;
    description: string;
    unitPrice: number;
    wholesalePrice: number;
    presentation: string;
    category: string;
    gender: string;
    imageUrl: string;
}

export default function ProductDetailPage() {
    const params = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'desc' | 'inci' | 'sds'>('desc');
    const [waNumber, setWaNumber] = useState('51936302523');
    const { addToCart } = useCart();

    useEffect(() => {
        if (params.id) {
            fetchProduct();
        }
        fetch('/api/settings')
            .then(res => res.json())
            .then(data => {
                if (data.buyWhatsAppNumber) setWaNumber(data.buyWhatsAppNumber);
            })
            .catch(console.error);
    }, [params.id]);

    const fetchProduct = async () => {
        try {
            const response = await fetch(`/api/products/${params.id}`);
            const data = await response.json();
            setProduct(data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching product:', error);
            setLoading(false);
        }
    };

    if (loading) return <div className="loader-page mesh-bg"><div className="p-loader"></div></div>;
    if (!product) return <div className="not-found mesh-bg"><h1>Producto no encontrado</h1><Link href="/productos" className="btn-premium-v4 btn-grad">Volver al catálogo</Link></div>;

    return (
        <main className="p-detail-wrapper mesh-bg">
            <Navbar />

            <div className="container p-detail-container">
                {/* Visual Side */}
                <div className="p-detail-visuals animate-up">
                    <div className="p-main-img-card glass-premium">
                        <img src={product.imageUrl} alt={product.name} className="p-main-img" />
                        <div className="p-img-badge glass-premium">
                            <Sparkles size={16} className="text-primary" /> 
                            <span>Auténtico Naia Store</span>
                        </div>
                    </div>
                </div>

                {/* Info Side */}
                <div className="p-detail-info animate-up" style={{ animationDelay: '0.15s' }}>
                    <div className="p-top-meta">
                        <div className="p-breadcrumb-pill glass-premium">
                            <Link href="/productos">Catálogo</Link>
                            <ChevronRight size={12} />
                            <span className="text-primary">{product.category}</span>
                        </div>
                        <div className="p-stock-pill">
                            <Circle size={8} fill="#10b981" color="#10b981" />
                            <span>En Stock</span>
                        </div>
                    </div>

                    <h1 className="p-detail-title section-title">{product.name}</h1>

                    <div className="p-rating-v5">
                        <div className="stars">
                            {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="#fbbf24" color="#fbbf24" />)}
                        </div>
                        <span className="p-rev-txt"><strong>4.9/5</strong> Basado en 84 opiniones</span>
                    </div>

                    <div className="p-detail-prices-v5 glass-premium">
                        <div className="price-item-v5">
                            <span className="p-l">Precio Unitario</span>
                            <span className="p-v">S/ {Number(product.unitPrice || 0).toFixed(2)}</span>
                        </div>
                        <div className="price-seg"></div>
                        <div className="price-item-v5 promo">
                            <span className="p-l">Precio Mayorista <span className="p-hint">(3+ uds)</span></span>
                            <span className="p-v text-gradient">S/ {Number(product.wholesalePrice || 0).toFixed(2)}</span>
                        </div>
                    </div>

                    <p className="p-intro-desc">{product.description.substring(0, 160)}...</p>

                    <div className="p-detail-actions-v5">
                        <div className="main-cta-group">
                            <button className="btn-premium-v4 btn-grad flex-1 h-64" onClick={() => addToCart(product as any)}>
                                <ShoppingBag size={22} /> <span>Agregar al Carrito</span>
                            </button>
                            <button 
                                className="btn-premium-v4 btn-wa flex-1 h-64"
                                onClick={() => {
                                    const msg = `Hola, vengo de la web y me interesa el producto: ${product.name}. ¿Me podrían dar más detalles?`;
                                    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, '_blank');
                                }}
                            >
                                <MessageCircle size={22} /> <span>Comprar ahora</span>
                            </button>
                        </div>
                        
                        <div className="secondary-cta-group">
                            <button className="p-circle-btn-v5 bg-violet" onClick={() => setIsShareModalOpen(true)} title="Compartir">
                                <Share2 size={22} />
                            </button>
                            <button className="p-circle-btn-v5" title="Favoritos">
                                <Heart size={22} />
                            </button>
                        </div>
                    </div>

                    <div className="p-info-tabs-v5">
                        <div className="tabs-header">
                            <button className={activeTab === 'desc' ? 'active' : ''} onClick={() => setActiveTab('desc')}>Descripción</button>
                            <button className={activeTab === 'inci' ? 'active' : ''} onClick={() => setActiveTab('inci')}>Uso & Detalles</button>
                            <button className={activeTab === 'sds' ? 'active' : ''} onClick={() => setActiveTab('sds')}>Confianza</button>
                        </div>
                        <div className="tabs-body glass-premium">
                            {activeTab === 'desc' && (
                                <div className="tab-pane animate-fade">
                                    <p>{product.description}</p>
                                    <ul className="spec-list">
                                        <li><strong>Presentación:</strong> {product.presentation}</li>
                                        <li><strong>Referencia:</strong> NAIA-{product.id}</li>
                                    </ul>
                                </div>
                            )}
                            {activeTab === 'inci' && (
                                <div className="tab-pane animate-fade">
                                    <p>Este producto ha sido seleccionado bajo los más altos estándares de calidad capilar y dermatológica.</p>
                                    <div className="inci-card">
                                        <div className="inci-label">Instrucciones:</div>
                                        <p>Aplicar uniformemente sobre la zona deseada. Para mejores resultados, usar 2 veces al día.</p>
                                    </div>
                                </div>
                            )}
                            {activeTab === 'sds' && (
                                <div className="tab-pane animate-fade">
                                    <div className="trust-grid">
                                        <div className="trust-item"><Shield size={18} /> <span>Garantía de Originalidad</span></div>
                                        <div className="trust-item"><Sparkles size={18} /> <span>Calidad de Salón</span></div>
                                    </div>
                                    <button className="btn-sds-premium mt-20">
                                        <FileText size={16} /> Descargar Ficha Técnica
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-perks-v5">
                        <div className="perk">
                            <div className="perk-icon"><Truck size={20} /></div>
                            <span>Envío Flash</span>
                        </div>
                        <div className="perk">
                            <div className="perk-icon"><Shield size={20} /></div>
                            <span>Pago Seguro</span>
                        </div>
                        <div className="perk">
                            <div className="perk-icon"><RotateCcw size={20} /></div>
                            <span>Garantía Naia</span>
                        </div>
                    </div>
                </div>
            </div>

            <ShareModal
                isOpen={isShareModalOpen}
                onClose={() => setIsShareModalOpen(false)}
                product={product}
            />

            <Footer />

            <style jsx>{`
                .p-detail-wrapper { padding-top: 150px; min-height: 100vh; padding-bottom: 80px; }
                .p-detail-container { display: grid; grid-template-columns: 1fr 1.1fr; gap: 80px; align-items: start; }

                .p-main-img-card { 
                    border-radius: 40px; 
                    padding: 40px; 
                    position: sticky;
                    top: 150px;
                    border: 1px solid rgba(255,255,255,0.4);
                }
                .p-main-img { 
                    width: 100%; border-radius: 24px; 
                    box-shadow: 0 30px 60px rgba(0,0,0,0.1);
                    transition: transform 0.6s cubic-bezier(0.19, 1, 0.22, 1);
                }
                .p-main-img-card:hover .p-main-img { transform: scale(1.05); }

                .p-img-badge {
                    position: absolute; bottom: 20px; left: 50%; transform: translateX(-50%);
                    white-space: nowrap; padding: 12px 24px; border-radius: 50px;
                    font-size: 13px; font-weight: 850; color: var(--fg);
                    display: flex; align-items: center; gap: 10px;
                    border: 1px solid rgba(255,255,255,0.5);
                }

                .p-detail-info { display: flex; flex-direction: column; gap: 35px; }

                .p-top-meta { display: flex; align-items: center; justify-content: space-between; }
                .p-breadcrumb-pill { display: flex; align-items: center; gap: 12px; padding: 10px 20px; border-radius: 50px; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: var(--slate-400); }
                .p-breadcrumb-pill :global(a) { color: inherit; text-decoration: none; }
                .p-breadcrumb-pill :global(a:hover) { color: var(--primary); }
                
                .p-stock-pill { display: flex; align-items: center; gap: 10px; font-size: 12px; font-weight: 900; color: #10b981; background: #f0fdf4; padding: 8px 16px; border-radius: 100px; border: 1px solid #dcfce7; }
                .p-stock-pill { display: flex; align-items: center; gap: 10px; font-size: 11px; font-weight: 900; color: #10b981; background: #f0fdf4; padding: 8px 16px; border-radius: 100px; border: 1px solid rgba(16, 185, 129, 0.1); text-transform: uppercase; letter-spacing: 0.5px; }

                .p-detail-title { font-size: 64px; line-height: 0.95; margin: 0; letter-spacing: -4px; font-weight: 950; background: linear-gradient(to bottom, #1e293b, #64748b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                
                .p-rating-v5 { display: flex; align-items: center; gap: 15px; }
                .stars { display: flex; gap: 2px; }
                .p-rev-txt { font-size: 14px; color: var(--slate-400); font-weight: 600; }
                .p-rev-txt strong { color: var(--fg); font-weight: 900; margin-right: 4px; border-bottom: 2px solid var(--primary-light); }

                .p-detail-prices-v5 { display: flex; padding: 30px; border-radius: 40px; align-items: center; border: 1px solid rgba(255,255,255,0.7); background: rgba(252, 250, 255, 0.4); }
                .price-item-v5 { flex: 1; display: flex; flex-direction: column; gap: 5px; }
                .price-item-v5 .p-l { font-size: 10px; font-weight: 950; color: var(--slate-400); text-transform: uppercase; letter-spacing: 1.5px; }
                .price-item-v5 .p-v { font-size: 42px; font-weight: 950; color: var(--fg); letter-spacing: -2px; }
                .price-item-v5 .p-hint { font-size: 9px; opacity: 0.6; font-weight: 800; background: var(--slate-100); padding: 2px 6px; border-radius: 4px; }
                .price-seg { width: 1px; height: 70px; background: linear-gradient(to bottom, transparent, var(--slate-200), transparent); margin: 0 40px; }

                .p-intro-desc { font-size: 18px; line-height: 1.7; color: var(--slate-600); font-weight: 500; margin: 0; position: relative; padding-left: 20px; border-left: 2px solid var(--primary-light); }

                .p-detail-actions-v5 { display: flex; flex-direction: column; gap: 20px; }
                .main-cta-group { display: flex; gap: 15px; }
                .h-64 { height: 72px !important; border-radius: 24px !important; font-size: 17px !important; letter-spacing: -0.5px; }
                
                .secondary-cta-group { display: flex; gap: 15px; }
                .p-circle-btn-v5 { 
                    width: 64px; height: 64px; border-radius: 20px;
                    border: 1px solid var(--slate-100); background: white;
                    display: flex; align-items: center; justify-content: center;
                    color: var(--slate-400); cursor: pointer; transition: 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                    box-shadow: 0 10px 30px rgba(0,0,0,0.03);
                }
                .p-circle-btn-v5:hover { transform: translateY(-6px) scale(1.05); border-color: var(--primary); color: var(--primary); box-shadow: 0 20px 40px rgba(var(--primary-h), 80%, 70%, 0.1); }
                .p-circle-btn-v5.bg-violet { color: #8b5cf6; border-color: #f5f3ff; background: #faf9ff; }
                .p-circle-btn-v5.bg-violet:hover { background: #8b5cf6; color: white; border-color: #8b5cf6; }

                .p-info-tabs-v5 { display: flex; flex-direction: column; gap: 15px; }
                .tabs-header { display: flex; gap: 15px; padding: 5px; background: rgba(0,0,0,0.03); width: fit-content; border-radius: 20px; border: 1px solid rgba(0,0,0,0.02); }
                .tabs-header button { 
                    padding: 12px 28px; border-radius: 16px; border: none;
                    background: transparent; color: var(--slate-500); font-weight: 850;
                    font-size: 13px; cursor: pointer; transition: 0.3s;
                }
                .tabs-header button.active { background: white; color: var(--fg); box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
                .tabs-body { padding: 40px; border-radius: 35px; border: 1px solid rgba(255,255,255,0.8); min-height: 200px; }
                .tab-pane p { font-size: 16px; line-height: 1.8; color: var(--slate-600); margin: 0; }
                
                .spec-list { list-style: none; padding: 0; margin: 30px 0 0; display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                .spec-list li { font-size: 14px; color: var(--slate-500); padding: 15px; background: rgba(0,0,0,0.02); border-radius: 15px; }
                .spec-list li strong { color: var(--fg); font-weight: 900; display: block; text-transform: uppercase; font-size: 10px; letter-spacing: 1px; color: var(--slate-400); margin-bottom: 5px; }

                .inci-card { margin-top: 30px; padding: 25px; background: rgba(var(--primary-h), 80%, 70%, 0.03); border-radius: 20px; border: 1px dashed var(--primary-light); }
                .inci-label { font-size: 11px; font-weight: 950; text-transform: uppercase; color: var(--primary); margin-bottom: 10px; letter-spacing: 1px; }

                .trust-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                .trust-item { display: flex; flex-direction: column; gap: 12px; padding: 25px; border-radius: 24px; background: white; border: 1px solid var(--slate-100); transition: 0.3s; }
                .trust-item:hover { transform: translateY(-5px); border-color: var(--primary-light); }
                .trust-item :global(svg) { color: #10b981; background: #f0fdf4; padding: 10px; width: 44px; height: 44px; border-radius: 14px; }
                .trust-item span { font-weight: 900; font-size: 15px; color: var(--fg); }

                .btn-sds-premium { width: 100%; height: 60px; border-radius: 20px; border: 1px solid var(--slate-100); background: white; font-weight: 900; font-size: 14px; display: flex; align-items: center; justify-content: center; gap: 12px; cursor: pointer; transition: 0.3s; box-shadow: 0 5px 15px rgba(0,0,0,0.02); }
                .btn-sds-premium:hover { border-color: var(--fg); background: var(--slate-50); transform: translateY(-2px); }

                .p-perks-v5 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 25px; margin-top: 20px; }
                .perk { display: flex; flex-direction: column; align-items: center; gap: 12px; text-align: center; padding: 20px; border-radius: 30px; background: rgba(255,255,255,0.3); border: 1px solid rgba(255,255,255,0.5); }
                .perk-icon { width: 56px; height: 56px; border-radius: 20px; background: white; display: flex; align-items: center; justify-content: center; color: var(--primary); box-shadow: 0 10px 20px rgba(0,0,0,0.03); }
                .perk span { font-size: 12px; font-weight: 900; color: var(--slate-500); text-transform: uppercase; letter-spacing: 1px; }

                @media (max-width: 1200px) {
                    .p-detail-container { gap: 40px; }
                    .p-detail-title { font-size: 52px; }
                }

                @media (max-width: 1100px) {
                    .p-detail-container { grid-template-columns: 1fr; gap: 50px; }
                    .p-main-img-card { position: relative; top: 0; padding: 25px; border-radius: 30px; }
                    .p-detail-title { font-size: 48px; }
                }

                @media (max-width: 600px) {
                    .p-detail-wrapper { padding-top: 110px; }
                    .p-detail-title { font-size: 42px; letter-spacing: -2px; }
                    .main-cta-group { flex-direction: column; }
                    .p-detail-prices-v5 { flex-direction: column; align-items: stretch; gap: 20px; padding: 25px; }
                    .price-seg { display: none; }
                    .p-perks-v5 { grid-template-columns: 1fr; }
                    .perk { flex-direction: row; gap: 20px; text-align: left; padding: 15px 25px; border-radius: 20px; }
                    .spec-list { grid-template-columns: 1fr; gap: 10px; }
                    .trust-grid { grid-template-columns: 1fr; }
                    .tabs-header { width: 100%; overflow-x: auto; flex-wrap: nowrap; padding: 8px; }
                    .tabs-header button { flex: 1; white-space: nowrap; padding: 10px 20px; }
                }
            `}</style>
        </main>
    );
}
