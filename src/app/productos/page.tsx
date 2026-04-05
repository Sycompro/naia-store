'use client';
import React, { useState, useEffect, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Search, Filter, ChevronDown, SlidersHorizontal, ShoppingCart, Share2, Star } from 'lucide-react';
import Link from 'next/link';
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
    isBestSeller: boolean;
}

function CatalogContent() {
    const [products, setProducts] = useState<Product[]>([]);
    const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('Todas');
    const [currentGender, setCurrentGender] = useState<'FEMALE' | 'MALE'>('FEMALE');
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const { addToCart } = useCart();

    useEffect(() => {
        fetchProducts();

        const observer = new MutationObserver(() => {
            const isMenTheme = document.body.classList.contains('men-theme');
            setCurrentGender(isMenTheme ? 'MALE' : 'FEMALE');
        });

        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

        if (document.body.classList.contains('men-theme')) {
            setCurrentGender('MALE');
        }

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        filterProducts();
    }, [searchTerm, selectedCategory, currentGender, products]);

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products');
            const data = await response.json();
            setProducts(data.products || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setLoading(false);
        }
    };

    const filterProducts = () => {
        let filtered = products.filter(p => p.gender === currentGender);

        if (selectedCategory !== 'Todas') {
            filtered = filtered.filter(p => p.category === selectedCategory);
        }

        if (searchTerm) {
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                p.description.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        setFilteredProducts(filtered);
    };

    const handleShare = (product: Product) => {
        setSelectedProduct(product);
        setIsShareModalOpen(true);
    };

    return (
        <div className="catalog-layout">
            <div className="catalog-hero-v3 mesh-bg">
                <div className="container">
                    <div className="hero-text-center animate-entrance">
                        <span className="premium-tag">Colección 2026</span>
                        <h1 className="catalog-title-v3">
                            Catálogo <span className="text-gradient">{currentGender === 'FEMALE' ? 'Exclusivo' : 'Evolución'}</span>
                        </h1>
                        <p className="catalog-subtitle-v3">Descubre la sinergia entre naturaleza y alta cosmética para tu cuidado diario.</p>
                    </div>
                </div>
            </div>

            <div className="container catalog-body">
                <div className="catalog-controls-v3 glass-premium animate-fade">
                    <div className="p-search-wrapper" style={{ position: 'relative', width: '100%', display: 'flex', alignItems: 'center' }}>
                        <Search className="search-icon-p" size={20} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--slate-400)', pointerEvents: 'none', zIndex: 10 }} />
                        <input
                            type="text"
                            placeholder="¿Qué buscas hoy?"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="p-search-input"
                            style={{ paddingLeft: '48px' }}
                        />
                    </div>

                    <div className="p-filter-group">
                        <div className="p-chips">
                            {['Todas', 'Facial', 'Capilar', 'Corporal'].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`p-chip ${selectedCategory === cat ? 'active' : ''}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-grid-v3">
                    {loading ? (
                        [1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} className="p-skeleton glass-premium"></div>
                        ))
                    ) : filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                            <div key={product.id} className="p-card glass-premium animate-fade">
                                <Link href={`/productos/${product.id}`} className="p-img-link">
                                    <div className="p-img-v3" style={{ backgroundImage: `url(${product.imageUrl})` }}>
                                        <div className="p-overlay-v3">
                                            <span className="btn-view-premium">Detalles</span>
                                        </div>
                                        <div className="p-badge-float">{product.presentation}</div>
                                    </div>
                                </Link>

                                <div className="p-info-v3">
                                    <div className="p-top">
                                        <span className="p-cat-v3">{product.category}</span>
                                        <div className="p-stars"><Star size={12} fill="currentColor" /> 4.9</div>
                                    </div>
                                    <Link href={`/productos/${product.id}`} className="p-name-link-v3">
                                        <h3>{product.name}</h3>
                                    </Link>

                                    <div className="p-prices-v3 glass-premium">
                                        <div className="p-price-item">
                                            <span className="label">Unidad</span>
                                            <span className="val">S/ {Number(product.unitPrice || 0).toFixed(2)}</span>
                                        </div>
                                        <div className="p-price-item wholesale">
                                            <span className="label">Mayorista</span>
                                            <span className="val">S/ {Number(product.wholesalePrice || 0).toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <div className="p-actions-v3">
                                        <button className="btn-premium btn-primary-v3 flex-1" onClick={() => addToCart(product as any)}>
                                            <ShoppingCart size={18} /> Agregar
                                        </button>
                                        <button className="p-icon-btn-v3 glass-premium" onClick={() => handleShare(product)}>
                                            <Share2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="p-empty-v3 glass-premium">
                            <h3>Sin resultados</h3>
                            <p>No encontramos productos que coincidan con tu búsqueda.</p>
                            <button className="btn-premium btn-primary-v3 mt-20" onClick={() => { setSearchTerm(''); setSelectedCategory('Todas'); }}>Limpiar Filtros</button>
                        </div>
                    )}
                </div>
            </div>

            {isShareModalOpen && selectedProduct && (
                <ShareModal
                    isOpen={isShareModalOpen}
                    onClose={() => setIsShareModalOpen(false)}
                    product={selectedProduct}
                />
            )}

            <style jsx>{`
                .catalog-layout { min-height: 100vh; }
                .catalog-hero-v3 { padding: 140px 0 60px; text-align: center; position: relative; }
                .premium-tag { 
                    font-size: 13px; font-weight: 800; color: var(--primary); text-transform: uppercase; 
                    letter-spacing: 0.2em; margin-bottom: 15px; display: block;
                }
                .catalog-title-v3 { font-size: clamp(38px, 6vw, 56px); margin-bottom: 15px; letter-spacing: -1px; }
                .catalog-subtitle-v3 { font-size: 16px; color: var(--slate-500); max-width: 600px; margin: 0 auto; font-weight: 500; }

                .catalog-body { padding-bottom: 100px; }
                
                .catalog-controls-v3 {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                    padding: 20px 25px;
                    border-radius: var(--radius-xl);
                    margin-bottom: 40px;
                    background: var(--bg);
                    border: 1px solid var(--slate-100);
                    box-shadow: var(--shadow-md);
                }
                :global(.men-theme) .catalog-controls-v3 {
                    border-color: var(--glass-border);
                    background: var(--glass);
                }
                
                .p-search-wrapper { position: relative; width: 100%; display: flex; align-items: center; }
                .search-icon-p { position: absolute; left: 20px; top: 50%; transform: translateY(-50%); color: var(--slate-400); pointer-events: none; z-index: 10; }
                .p-search-input {
                    width: 100%;
                    padding: 16px 20px 16px 52px;
                    border-radius: 18px;
                    border: 1px solid var(--slate-200);
                    background: var(--bg);
                    color: var(--fg);
                    font-size: 15px;
                    font-weight: 600;
                    outline: none;
                    transition: all 0.3s;
                    box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
                }
                :global(.men-theme) .p-search-input {
                    border-color: rgba(255,255,255,0.1);
                    color: white;
                }
                .p-search-input:focus { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-light); }

                .p-chips { 
                    display: flex; 
                    flex-wrap: nowrap !important;
                    gap: 12px; 
                    overflow-x: auto; 
                    padding: 12px 10px 22px;
                    scrollbar-width: none; /* Firefox */
                    -ms-overflow-style: none;  /* IE and Edge */
                    scroll-behavior: smooth;
                    -webkit-overflow-scrolling: touch;
                    width: 100%;
                }
                .p-chips::-webkit-scrollbar { display: none; } /* Chrome, Safari, Opera */
                
                .p-chip {
                    padding: 10px 22px;
                    border-radius: 50px;
                    border: 1px solid var(--slate-200);
                    background: var(--bg);
                    color: var(--slate-500);
                    font-weight: 700;
                    font-size: 14px;
                    white-space: nowrap;
                    cursor: pointer;
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                    flex-shrink: 0;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.02);
                }
                :global(.men-theme) .p-chip { 
                    border-color: rgba(255,255,255,0.08); 
                    background: rgba(255,255,255,0.03);
                    color: var(--slate-300); 
                }
                .p-chip:hover { border-color: var(--primary); color: var(--primary); transform: translateY(-1px); box-shadow: 0 4px 12px var(--primary-light); }
                .p-chip.active { 
                    background: var(--fg); 
                    color: var(--bg); 
                    border-color: var(--fg); 
                    box-shadow: 0 8px 20px rgba(0,0,0,0.15);
                    transform: scale(1.05);
                }

                .p-grid-v3 { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 30px; }
                .p-skeleton { height: 420px; border-radius: var(--radius-xl); animation: pulse 1.5s infinite; background: var(--slate-100); }
                :global(.men-theme) .p-skeleton { background: rgba(255,255,255,0.05); }
                
                .p-card { 
                    padding: 12px 12px 16px; 
                    border-radius: var(--radius-xl); 
                    transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
                    background: var(--bg);
                    border: 1px solid var(--slate-100);
                    box-shadow: var(--shadow-sm);
                    will-change: transform, box-shadow;
                    transform: translateZ(0);
                    backface-visibility: hidden;
                }
                :global(.men-theme) .p-card {
                    background: var(--glass);
                    border-color: var(--glass-border);
                }
                .p-card:hover { transform: translateY(-8px) translateZ(0); box-shadow: var(--shadow-xl); }
                
                .p-img-link { display: block; border-radius: 22px; overflow: hidden; position: relative; background: var(--slate-100); }
                :global(.men-theme) .p-img-link { background: rgba(0,0,0,0.3); }
                .p-img-v3 { height: 240px; background-size: cover; background-position: center; transition: transform 0.6s ease; border-radius: 22px; }
                .p-card:hover .p-img-v3 { transform: scale(1.05); }
                
                .p-overlay-v3 {
                    position: absolute; inset: 0; background: rgba(0,0,0,0.2); 
                    display: flex; align-items: center; justify-content: center;
                    opacity: 0; transition: all 0.3s;
                }
                .p-card:hover .p-overlay-v3 { opacity: 1; }
                .btn-view-premium {
                    padding: 10px 24px; background: white; color: black; border-radius: 30px;
                    font-weight: 800; font-size: 13px; transform: translateY(15px); transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                .p-card:hover .btn-view-premium { transform: translateY(0); }
                
                .p-badge-float {
                    position: absolute; top: 12px; right: 12px; 
                    background: var(--primary); color: white; padding: 4px 10px;
                    border-radius: 6px; font-size: 10px; font-weight: 900;
                    letter-spacing: 0.5px;
                }

                .p-info-v3 { padding: 18px 8px 8px; }
                .p-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
                .p-cat-v3 { font-size: 10px; font-weight: 800; color: var(--primary); text-transform: uppercase; letter-spacing: 1px; }
                .p-stars { font-size: 12px; font-weight: 800; color: #fbbf24; display: flex; align-items: center; gap: 4px; }
                
                .p-name-link-v3 { text-decoration: none !important; color: var(--fg) !important; display: block; }
                .p-name-link-v3 h3 { font-size: 18px; font-weight: 800; margin-bottom: 12px; line-height: 1.2; transition: color 0.2s; }
                .p-name-link-v3:hover h3 { color: var(--primary); }
                
                .p-prices-v3 { display: flex; padding: 10px; border-radius: 12px; margin-bottom: 18px; background: var(--slate-50); }
                :global(.men-theme) .p-prices-v3 { background: rgba(0,0,0,0.2); }
                .p-price-item { flex: 1; display: flex; flex-direction: column; }
                .p-price-item .label { font-size: 9px; color: var(--slate-400); font-weight: 800; text-transform: uppercase; }
                .p-price-item .val { font-size: 16px; font-weight: 900; color: var(--fg); }
                .p-price-item.wholesale { border-left: 1px solid var(--slate-200); padding-left: 12px; margin-left: 12px; }
                :global(.men-theme) .p-price-item.wholesale { border-color: rgba(255,255,255,0.08); }
                .p-price-item.wholesale .val { color: var(--primary-dark); }

                .p-actions-v3 { display: flex; gap: 8px; }
                .flex-1 { flex: 1; justify-content: center; }
                .p-icon-btn-v3 { 
                    width: 44px; height: 44px; border-radius: 12px; border: none; 
                    background: var(--slate-50); color: var(--fg);
                    display: flex; align-items: center; justify-content: center; 
                    cursor: pointer; transition: all 0.3s; 
                }
                :global(.men-theme) .p-icon-btn-v3 { background: rgba(255,255,255,0.05); color: white; }
                .p-icon-btn-v3:hover { color: var(--primary); transform: translateY(-2px); background: var(--primary-light); }

                .p-empty-v3 { padding: 60px; text-align: center; grid-column: 1/-1; border-radius: var(--radius-xl); background: var(--bg); border: 1px solid var(--slate-100); }
                :global(.men-theme) .p-empty-v3 { background: var(--glass); border-color: var(--glass-border); }
                .mt-20 { margin-top: 20px; }

                @media (min-width: 768px) {
                    .catalog-controls-v3 { flex-direction: row; align-items: center; justify-content: space-between; }
                }
            `}</style>
        </div>
    );
}

export default function ProductosPage() {
    return (
        <main className="catalog-page-wrapper">
            <Navbar />
            <Suspense fallback={<div className="container" style={{ paddingTop: '200px' }}>Cargando...</div>}>
                <CatalogContent />
            </Suspense>
            <Footer />
        </main>
    );
}
