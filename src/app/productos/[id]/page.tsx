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
    if (!product) return <div className="not-found mesh-bg"><h1>Producto no encontrado</h1><Link href="/productos" className="btn-premium-v4 btn-grad">Volver al catálogo</Link></div>;

    return (
        <main className="p-detail-wrapper white-bg">
            <Navbar />

            <div className="container p-detail-container">
                <div className="p-detail-visuals animate-up">
                    <div className="p-main-img-card">
                        <img src={product.imageUrl} alt={product.name} className="p-main-img" />
                        <div className="p-img-badge"><Sparkles size={16} /> Producto Original Naia</div>
                    </div>
                </div>

                <div className="p-detail-info animate-up" style={{ animationDelay: '0.15s' }}>
                    <div className="p-breadcrumb-v4">
                        <Link href="/productos">Catálogo</Link>
                        <ChevronRight size={14} />
                        <span>{product.category}</span>
                    </div>

                    <h1 className="p-detail-title section-title">{product.name}</h1>

                    <div className="p-detail-meta">
                        <div className="p-rating-v4">
                            {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="#fbbf24" color="#fbbf24" />)}
                            <span className="p-rev-count">4.9 (42 reseñas)</span>
                        </div>
                        <div className="p-stock-badge">Disponibilidad Inmediata</div>
                    </div>

                    <div className="p-detail-prices-v4">
                        <div className="price-box">
                            <span className="p-label-v4">Por Unidad</span>
                            <span className="p-val-v4">S/ {product.unitPrice.toFixed(2)}</span>
                        </div>
                        <div className="price-divider"></div>
                        <div className="price-box">
                            <span className="p-label-v4">Mayorista <span className="p-info-tag">(3+ unidades)</span></span>
                            <span className="p-val-v4 text-primary">S/ {product.wholesalePrice.toFixed(2)}</span>
                        </div>
                    </div>

                    <div className="p-tech-card">
                        <div className="tech-tabs">
                            <button className={activeTab === 'desc' ? 'active' : ''} onClick={() => setActiveTab('desc')}>Descripción</button>
                            <button className={activeTab === 'inci' ? 'active' : ''} onClick={() => setActiveTab('inci')}>Cuidado & Uso</button>
                            <button className={activeTab === 'sds' ? 'active' : ''} onClick={() => setActiveTab('sds')}>Certificaciones</button>
                        </div>
                        <div className="tech-content">
                            {activeTab === 'desc' && (
                                <div className="tab-fade">
                                    <p className="p-detail-desc">{product.description}</p>
                                    <div className="p-detail-spec">
                                        <div className="spec-item"><strong>Presentación:</strong> <span>{product.presentation}</span></div>
                                        <div className="spec-item"><strong>Categoría:</strong> <span>{product.category}</span></div>
                                    </div>
                                </div>
                            )}
                            {activeTab === 'inci' && (
                                <div className="tab-fade">
                                    <p className="inci-text">Nuestras fórmulas están diseñadas para maximizar resultados respetando el equilibrio natural de tu piel. <strong>Activos principales:</strong> Extractos botánicos, vitaminas esenciales y agentes de hidratación profunda.</p>
                                    <div className="inci-note">Apto para todo tipo de piel, incluyendo pieles sensibles.</div>
                                </div>
                            )}
                            {activeTab === 'sds' && (
                                <div className="tab-fade">
                                    <div className="cert-grid">
                                        <div className="cert-item"><Shield size={18} /> <span>Garantía de Calidad Naia</span></div>
                                        <div className="cert-item"><Heart size={18} /> <span>100% Sin Crueldad Animal</span></div>
                                    </div>
                                    <button className="btn-outline-v4 mt-20">
                                        <FileText size={16} /> Ficha Técnica Completa (PDF)
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="p-detail-actions">
                        <button className="btn-premium-v4 btn-grad flex-1 main-add-btn" onClick={() => addToCart(product as any)}>
                            <ShoppingBag size={20} /> Agregar al Carrito 
                        </button>
                        <div className="p-extra-btns">
                            <button className="p-icon-btn-v4-detail" onClick={() => setIsShareModalOpen(true)} title="Compartir">
                                <Share2 size={24} />
                            </button>
                            <button className="p-icon-btn-v4-detail" title="Favoritos">
                                <Heart size={24} />
                            </button>
                        </div>
                    </div>

                    <div className="p-detail-benefits">
                        <div className="benefit-card">
                            <Truck size={24} />
                            <span>Envío a todo el país</span>
                        </div>
                        <div className="benefit-card">
                            <Shield size={24} />
                            <span>Producto Garantizado</span>
                        </div>
                        <div className="benefit-card">
                            <RotateCcw size={24} />
                            <span>30 días para cambios</span>
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
                .p-detail-wrapper { padding-top: 140px; min-height: 100vh; background: var(--white); }
                .p-detail-container { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; padding-bottom: 120px; align-items: start; max-width: 1200px; }
                
                .p-main-img-card { 
                    border-radius: var(--radius-xl); 
                    position: relative;
                    background: var(--slate-50);
                    padding: 30px;
                    border: 1px solid var(--slate-100);
                    box-shadow: var(--shadow-xl);
                }
                .p-main-img { width: 100%; border-radius: var(--radius-lg); transition: 0.5s cubic-bezier(0.19, 1, 0.22, 1); }
                .p-main-img-card:hover .p-main-img { transform: scale(1.02); }
                .p-img-badge {
                    position: absolute; bottom: 30px; left: 30px;
                    padding: 10px 20px; border-radius: 50px;
                    font-size: 13px; font-weight: 800; color: var(--fg);
                    display: flex; align-items: center; gap: 10px;
                    background: var(--white);
                    box-shadow: var(--shadow-md);
                    border: 1px solid var(--slate-100);
                }

                .p-detail-info { display: flex; flex-direction: column; gap: 30px; }
                .p-breadcrumb-v4 { display: flex; align-items: center; gap: 10px; font-size: 13px; font-weight: 700; color: var(--slate-400); text-transform: uppercase; letter-spacing: 0.05em; }
                .p-breadcrumb-v4 :global(a) { color: var(--slate-400); text-decoration: none; transition: 0.3s; }
                .p-breadcrumb-v4 :global(a:hover) { color: var(--primary); }
                
                .p-detail-title { font-size: 52px; line-height: 1.1; margin: 0; }
                
                .p-detail-meta { display: flex; align-items: center; gap: 30px; }
                .p-rating-v4 { display: flex; align-items: center; gap: 8px; }
                .p-rev-count { font-size: 14px; color: var(--slate-400); font-weight: 600; }
                .p-stock-badge { padding: 6px 14px; background: #f0fdf4; color: #16a34a; border-radius: 10px; font-size: 12px; font-weight: 800; border: 1px solid rgba(22, 163, 74, 0.1); }

                .p-detail-prices-v4 { display: flex; padding: 25px; border-radius: var(--radius-xl); align-items: center; background: var(--slate-50); border: 1px solid var(--slate-100); }
                .price-box { flex: 1; display: flex; flex-direction: column; }
                .p-label-v4 { font-size: 11px; font-weight: 900; color: var(--slate-400); text-transform: uppercase; margin-bottom: 6px; letter-spacing: 0.05em; }
                .p-val-v4 { font-size: 32px; font-weight: 950; color: var(--fg); letter-spacing: -1px; }
                .p-info-tag { font-size: 10px; font-weight: 700; opacity: 0.7; }
                .price-divider { width: 1px; height: 50px; background: var(--slate-200); margin: 0 30px; }

                .p-tech-card { border-radius: 24px; border: 1px solid var(--slate-100); overflow: hidden; background: var(--white); box-shadow: var(--shadow-sm); }
                .tech-tabs { display: flex; background: var(--slate-50); border-bottom: 1px solid var(--slate-100); }
                .tech-tabs button { flex: 1; padding: 18px 10px; background: none; border: none; font-size: 13px; font-weight: 800; color: var(--slate-400); cursor: pointer; transition: 0.3s; position: relative; text-transform: uppercase; letter-spacing: 1px; }
                .tech-tabs button:hover { color: var(--fg); }
                .tech-tabs button.active { color: var(--primary); background: var(--white); }
                .tech-tabs button.active::after { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 3px; background: var(--primary); }
                
                .tech-content { padding: 30px; min-height: 160px; }
                .p-detail-desc { font-size: 16px; line-height: 1.7; color: var(--slate-500); font-weight: 500; margin-bottom: 20px; }
                .p-detail-spec { display: flex; flex-direction: column; gap: 10px; padding-top: 20px; border-top: 1px dashed var(--slate-200); }
                .spec-item { font-size: 14px; color: var(--slate-500); }
                .spec-item strong { color: var(--fg); font-weight: 800; margin-right: 8px; text-transform: uppercase; font-size: 12px; }

                .inci-text { font-size: 15px; line-height: 1.7; color: var(--slate-600); }
                .inci-note { margin-top: 20px; padding: 12px 18px; background: var(--slate-50); border-radius: 12px; font-size: 13px; color: var(--slate-500); font-weight: 600; border-left: 4px solid var(--primary); }

                .cert-grid { display: flex; flex-direction: column; gap: 15px; }
                .cert-item { display: flex; align-items: center; gap: 12px; font-size: 15px; font-weight: 700; color: var(--fg); }
                .cert-item :global(svg) { color: var(--primary); }
                .btn-outline-v4 { width: 100%; height: 48px; border-radius: 14px; border: 1px solid var(--slate-200); background: var(--white); color: var(--fg); font-weight: 800; display: flex; align-items: center; justify-content: center; gap: 10px; cursor: pointer; transition: 0.3s; }
                .btn-outline-v4:hover { border-color: var(--primary); color: var(--primary); transform: translateY(-2px); }

                .p-detail-actions { display: flex; gap: 20px; margin-top: 10px; align-items: center; }
                .main-add-btn { height: 64px; font-size: 18px; border-radius: 20px; transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1); }
                .main-add-btn:hover { transform: translateY(-4px) scale(1.02); box-shadow: 0 20px 40px rgba(var(--primary-h), 80%, 70%, 0.2); }
                .p-extra-btns { display: flex; gap: 15px; }
                .p-icon-btn-v4-detail { 
                    width: 64px; 
                    height: 64px; 
                    border-radius: 20px; 
                    border: 1px solid var(--slate-100); 
                    background: var(--white); 
                    display: flex; 
                    align-items: center; 
                    justify-content: center; 
                    color: var(--slate-400); 
                    cursor: pointer; 
                    transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1); 
                    box-shadow: var(--shadow-sm); 
                }
                .p-icon-btn-v4-detail:hover { 
                    border-color: var(--primary); 
                    color: var(--primary); 
                    transform: translateY(-4px); 
                    box-shadow: var(--shadow-md); 
                }

                .p-detail-benefits { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-top: 30px; }
                .benefit-card { padding: 25px 15px; border-radius: 24px; display: flex; flex-direction: column; align-items: center; gap: 12px; background: var(--slate-50); border: 1px solid var(--slate-100); color: var(--slate-500); font-size: 12px; font-weight: 800; text-align: center; }
                .benefit-card :global(svg) { color: var(--primary); opacity: 0.8; }

                .tab-fade { animation: fadeIn 0.4s ease-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }

                @media (max-width: 1100px) {
                    .p-detail-wrapper { padding-top: 100px; }
                    .p-detail-container { grid-template-columns: 1fr; gap: 50px; padding-bottom: 80px; }
                    .p-detail-title { font-size: 42px; }
                    .p-detail-actions { flex-direction: column; }
                    .p-extra-btns { order: 2; justify-content: center; }
                    .main-add-btn { order: 1; width: 100%; }
                }

                @media (max-width: 480px) {
                    .p-detail-prices-v4 { flex-direction: column; align-items: stretch; gap: 20px; }
                    .price-divider { display: none; }
                    .price-box { text-align: center; }
                }
            `}</style>
        </main>
    );
}
