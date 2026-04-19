'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { ShoppingBag, Heart, Share2, Shield, Truck, RotateCcw, Star, ChevronRight, Sparkles, FileText } from 'lucide-react';
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
    const { addToCart } = useCart();

    useEffect(() => {
        if (params.id) {
            fetchProduct();
        }
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
    if (!product) return <div className="not-found mesh-bg"><h1>Producto no encontrado</h1><Link href="/productos" className="btn-premium btn-primary-v3">Volver al catálogo</Link></div>;

    return (
        <main className="p-detail-wrapper mesh-bg">
            <Navbar />

            <div className="container p-detail-container">
                <div className="p-detail-visuals animate-entrance">
                    <div className="p-main-img-card glass-premium">
                        <img src={product.imageUrl} alt={product.name} className="p-main-img" />
                        <div className="p-img-badge glass-premium"><Sparkles size={16} /> Premium Quality</div>
                    </div>
                </div>

                <div className="p-detail-info animate-entrance" style={{ animationDelay: '0.2s' }}>
                    <div className="p-breadcrumb-v3">
                        <Link href="/productos">Productos</Link>
                        <ChevronRight size={14} />
                        <span>{product.category}</span>
                    </div>

                    <h1 className="p-detail-title text-gradient">{product.name}</h1>

                    <div className="p-detail-meta">
                        <div className="p-rating-v3">
                            {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#fbbf24" color="#fbbf24" />)}
                            <span className="p-rev-count">(24 reseñas verificadas)</span>
                        </div>
                        <div className="p-stock-tag">En Stock</div>
                    </div>

                    <div className="p-detail-prices-v3 glass-premium">
                        <div className="price-main">
                            <span className="p-label-v3">Precio Unitario</span>
                            <span className="p-val-v3">S/ {product.unitPrice.toFixed(2)}</span>
                        </div>
                        <div className="price-v-divider"></div>
                        <div className="price-secondary">
                            <span className="p-label-v3">Mayorista <span className="p-extra">(Desde 3 unid.)</span></span>
                            <span className="p-val-v3 wholesale">S/ {product.wholesalePrice.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="p-technical-room glass-premium">
                        <div className="t-tabs">
                            <button className={activeTab === 'desc' ? 'active' : ''} onClick={() => setActiveTab('desc')}>Visión General</button>
                            <button className={activeTab === 'inci' ? 'active' : ''} onClick={() => setActiveTab('inci')}>Composición INCI</button>
                            <button className={activeTab === 'sds' ? 'active' : ''} onClick={() => setActiveTab('sds')}>Certificaciones / SDS</button>
                        </div>
                        <div className="t-content">
                            {activeTab === 'desc' && (
                                <div className="t-desc">
                                    <p className="p-detail-desc">{product.description}</p>
                                    <div className="p-detail-feat">
                                        <span className="feat-label">Formato:</span>
                                        <span className="feat-value">{product.presentation}</span>
                                    </div>
                                </div>
                            )}
                            {activeTab === 'inci' && (
                                <div className="t-inci">
                                    <p className="inci-text"><strong>Activos Clínicos:</strong> Formulación base de Agua Purificada, Copolímeros de Acrilato, Niacinamida (5%), Ácido Hialurónico de peso molecular mixto (2%), Pantenol, Glicerina, Extracto biológico de Centella Asiática, Conservantes naturales.</p>
                                    <div className="t-inci-note">*Fórmula libre de parabenos, ftalatos y sulfatos (SLS/SLES). pH balanceado 5.5.</div>
                                </div>
                            )}
                            {activeTab === 'sds' && (
                                <div className="t-sds">
                                    <div className="sds-list">
                                        <div className="sds-item"><Shield size={18} className="text-primary" /> <span>ISO 22716 - Buenas Prácticas de Manufactura Cosmética (BPM)</span></div>
                                        <div className="sds-item"><Heart size={18} className="text-primary" /> <span>Certificación Cruelty-Free & Vegan (PETA)</span></div>
                                    </div>
                                    <button className="btn-outline-premium mt-15 sds-btn">
                                        <FileText size={16} /> Descargar Ficha de Seguridad (MSDS / SDS PDF)
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-detail-actions">
                        <button className="btn-premium btn-primary-v3 flex-1" onClick={() => addToCart(product as any)}>
                            Agregar al Carrito <ShoppingBag size={20} />
                        </button>
                        <div className="p-side-actions">
                            <button className="p-detail-icon-btn glass-premium" onClick={() => setIsShareModalOpen(true)}>
                                <Share2 size={22} />
                            </button>
                            <button className="p-detail-icon-btn glass-premium">
                                <Heart size={22} />
                            </button>
                        </div>
                    </div>

                    <div className="p-detail-benefits">
                        <div className="b-item glass-premium">
                            <Truck size={22} />
                            <span>Envío Prioritario</span>
                        </div>
                        <div className="b-item glass-premium">
                            <Shield size={22} />
                            <span>Garantía Naia</span>
                        </div>
                        <div className="b-item glass-premium">
                            <RotateCcw size={22} />
                            <span>Cambio Fácil</span>
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
                .p-detail-wrapper { padding-top: 130px; min-height: 100vh; }
                .p-detail-container { display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 80px; padding-bottom: 100px; align-items: start; }
                
                .p-main-img-card { 
                    border-radius: var(--radius-xl); 
                    padding: 20px; 
                    position: relative;
                    transition: transform 0.3s;
                }
                .p-main-img { width: 100%; border-radius: var(--radius-lg); box-shadow: var(--shadow-xl); }
                .p-img-badge {
                    position: absolute; bottom: 40px; left: 40px;
                    padding: 10px 20px; border-radius: 50px;
                    font-size: 13px; font-weight: 800; color: var(--fg);
                    display: flex; align-items: center; gap: 10px;
                }

                .p-detail-info { display: flex; flex-direction: column; gap: 25px; }
                .p-breadcrumb-v3 { display: flex; align-items: center; gap: 10px; font-size: 14px; font-weight: 700; color: var(--slate-400); }
                .p-breadcrumb-v3 :global(a) { color: var(--slate-400); text-decoration: none; transition: color 0.3s; }
                .p-breadcrumb-v3 :global(a:hover) { color: var(--primary); }
                
                .p-detail-title { font-size: clamp(36px, 5vw, 56px); line-height: 1.1; }
                
                .p-detail-meta { display: flex; align-items: center; justify-content: space-between; gap: 20px; }
                .p-rating-v3 { display: flex; align-items: center; gap: 10px; }
                .p-rev-count { font-size: 14px; color: var(--slate-400); font-weight: 600; }
                .p-stock-tag { padding: 4px 12px; background: #f0fdf4; color: #16a34a; border-radius: 8px; font-size: 12px; font-weight: 800; border: 1px solid rgba(22, 163, 74, 0.1); }

                .p-detail-prices-v3 { display: flex; padding: 25px; border-radius: var(--radius-xl); align-items: center; }
                .price-main, .price-secondary { flex: 1; display: flex; flex-direction: column; }
                .p-label-v3 { font-size: 11px; font-weight: 800; color: var(--slate-400); text-transform: uppercase; margin-bottom: 5px; }
                .p-val-v3 { font-size: 32px; font-weight: 900; color: var(--fg); }
                .p-val-v3.wholesale { color: var(--primary); }
                .p-extra { font-size: 9px; opacity: 0.7; }
                .price-v-divider { width: 1px; height: 40px; background: var(--slate-200); margin: 0 25px; }

                .p-technical-room { border-radius: var(--radius-xl); overflow: hidden; margin-bottom: 20px; }
                .t-tabs { display: flex; border-bottom: 1px solid var(--slate-200); }
                :global(.men-theme) .t-tabs { border-color: rgba(255,255,255,0.1); }
                .t-tabs button { flex: 1; padding: 15px 10px; background: none; border: none; font-size: 13px; font-weight: 800; color: var(--slate-400); cursor: pointer; transition: all 0.3s; position: relative; text-transform: uppercase; letter-spacing: 0.5px; }
                .t-tabs button:hover { color: var(--fg); background: rgba(0,0,0,0.02); }
                :global(.men-theme) .t-tabs button:hover { background: rgba(255,255,255,0.02); }
                .t-tabs button.active { color: var(--primary); }
                .t-tabs button.active::after { content: ''; position: absolute; bottom: -1px; left: 0; width: 100%; height: 3px; background: var(--primary); border-radius: 3px 3px 0 0; }
                
                .t-content { padding: 25px; min-height: 150px; }
                
                .p-detail-desc { font-size: 15px; line-height: 1.6; color: var(--slate-500); font-weight: 500; margin-bottom: 15px; }
                .p-detail-feat { display: flex; align-items: center; gap: 10px; padding-top: 15px; border-top: 1px dashed var(--slate-200); }
                :global(.men-theme) .p-detail-feat { border-color: rgba(255,255,255,0.1); }
                .feat-label { font-size: 13px; font-weight: 800; color: var(--slate-400); text-transform: uppercase; }
                .feat-value { font-size: 14px; font-weight: 900; color: var(--fg); }

                .inci-text { font-size: 14px; line-height: 1.7; color: var(--slate-600); }
                :global(.men-theme) .inci-text { color: var(--slate-300); }
                .inci-text strong { color: var(--fg); font-weight: 800; }
                .t-inci-note { margin-top: 15px; padding-top: 15px; border-top: 1px dashed var(--slate-200); font-size: 12px; color: var(--slate-400); font-weight: 600; font-style: italic; }
                :global(.men-theme) .t-inci-note { border-color: rgba(255,255,255,0.1); }

                .sds-list { display: flex; flex-direction: column; gap: 12px; margin-bottom: 20px; }
                .sds-item { display: flex; align-items: center; gap: 12px; font-size: 14px; font-weight: 700; color: var(--fg); }
                .text-primary { color: var(--primary); }
                .mt-15 { margin-top: 15px; }
                .sds-btn { width: 100%; justify-content: center; font-size: 13px; height: 44px; display: flex; align-items: center; gap: 8px; }

                .p-detail-actions { display: flex; gap: 15px; margin-top: 10px; }
                .flex-1 { flex: 1; justify-content: center; height: 60px; font-size: 18px; }
                .p-side-actions { display: flex; gap: 12px; }
                .p-detail-icon-btn { width: 60px; height: 60px; border-radius: 18px; border: none; display: flex; align-items: center; justify-content: center; color: var(--slate-500); cursor: pointer; transition: all 0.3s; }
                .p-detail-icon-btn:hover { color: var(--primary); transform: translateY(-3px); }

                .p-detail-benefits { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; margin-top: 20px; }
                .b-item { padding: 20px 10px; border-radius: 20px; display: flex; flex-direction: column; align-items: center; gap: 12px; color: var(--slate-500); font-size: 12px; font-weight: 800; }
                .b-item :global(svg) { color: var(--primary); }

                .p-loader { width: 50px; height: 50px; border: 4px solid var(--primary-light); border-top-color: var(--primary); border-radius: 50%; animation: spin 1s linear infinite; }
                .loader-page { height: 100vh; display: flex; align-items: center; justify-content: center; }
                @keyframes spin { to { transform: rotate(360deg); } }

                @media (max-width: 1100px) {
                    .p-detail-wrapper { padding-top: 100px; }
                    .p-detail-container { grid-template-columns: 1fr; gap: 35px; padding-bottom: 60px; }
                    .p-detail-title { font-size: clamp(32px, 8vw, 42px); }
                    .p-main-img-card { padding: 12px; border-radius: 20px; }
                    .p-img-badge { bottom: 20px; left: 20px; padding: 8px 16px; font-size: 11px; }
                    
                    .p-detail-prices-v3 { padding: 15px; gap: 15px; }
                    .p-val-v3 { font-size: 24px; }
                    .price-v-divider { margin: 0 15px; height: 30px; }
                    .p-detail-desc { font-size: 16px; }

                    .p-detail-actions { flex-direction: column; }
                    .p-side-actions { order: 2; justify-content: center; }
                    .flex-1 { order: 1; width: 100%; }

                    .p-detail-benefits { 
                        display: flex; 
                        overflow-x: auto; 
                        padding-bottom: 10px; 
                        margin: 10px -20px 0;
                        padding: 0 20px 15px;
                        gap: 12px;
                        scrollbar-width: none;
                    }
                    .p-detail-benefits::-webkit-scrollbar { display: none; }
                    .b-item { flex: 0 0 130px; padding: 15px 10px; background: rgba(255,255,255,0.05); }
                }

                @media (max-width: 480px) {
                    .p-detail-prices-v3 { flex-direction: column; align-items: stretch; }
                    .price-v-divider { display: none; }
                    .price-main, .price-secondary { text-align: center; }
                }
            `}</style>
        </main>
    );
}
