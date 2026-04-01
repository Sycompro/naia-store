'use client';
import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Search, Filter, ChevronDown, SlidersHorizontal } from 'lucide-react';
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

export default function ProductosPage() {
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

        // Observer for theme changes to sync gender filter
        const observer = new MutationObserver(() => {
            const isMenTheme = document.body.classList.contains('men-theme');
            setCurrentGender(isMenTheme ? 'MALE' : 'FEMALE');
        });

        observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

        // Initial sync
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
            setProducts(data);
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
        <main className="catalog-page">
            <Navbar />

            <div className="catalog-hero">
                <div className="container">
                    <h1 className="catalog-title">
                        {currentGender === 'FEMALE' ? 'Catálogo de Belleza' : 'Cuidado Masculino'}
                    </h1>
                    <p className="catalog-subtitle">Explora nuestra selección premium para tu cuidado diario.</p>
                </div>
            </div>

            <div className="container catalog-container">
                <div className="catalog-controls glass">
                    <div className="search-box">
                        <Search className="search-icon" size={20} />
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    <div className="filter-group">
                        <span className="filter-label"><SlidersHorizontal size={18} /> Filtros:</span>
                        <div className="category-chips">
                            {['Todas', 'Facial', 'Capilar', 'Corporal'].map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat)}
                                    className={`chip ${selectedCategory === cat ? 'active' : ''}`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="products-grid">
                    {loading ? (
                        <div className="loader-container"><div className="loader"></div></div>
                    ) : filteredProducts.length > 0 ? (
                        filteredProducts.map(product => (
                            <div key={product.id} className="catalog-product-card glass">
                                <div className="product-badge">
                                    {product.presentation}
                                </div>
                                <div className="product-image-container">
                                    <img src={product.imageUrl} alt={product.name} className="product-image" />
                                    <div className="product-overlay">
                                        <button className="btn-quick-view" onClick={() => addToCart(product as any)}>Añadir</button>
                                    </div>
                                </div>
                                <div className="product-info">
                                    <span className="product-category">{product.category}</span>
                                    <h3 className="product-name">{product.name}</h3>
                                    <div className="product-prices">
                                        <span className="price-unit">${product.unitPrice.toFixed(2)}</span>
                                        <span className="price-wholesale">Mayorista: ${product.wholesalePrice.toFixed(2)}</span>
                                    </div>
                                    <button className="btn-share-card" onClick={() => handleShare(product)}>Compartir</button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="no-results">
                            <h3>No se encontraron productos</h3>
                            <p>Intenta con otros filtros o términos de búsqueda.</p>
                        </div>
                    )}
                </div>
            </div>

            {selectedProduct && isShareModalOpen && (
                <ShareModal
                    isOpen={isShareModalOpen}
                    onClose={() => setIsShareModalOpen(false)}
                    productName={selectedProduct.name}
                    productPrice={selectedProduct.unitPrice}
                    productUrl={`${window.location.origin}/productos/${selectedProduct.id}`}
                />
            )}

            <style jsx>{`
        .catalog-page { padding-top: 100px; min-height: 100vh; background: var(--bg); }
        .catalog-hero {
          background: linear-gradient(135deg, var(--primary-light), var(--bg));
          padding: 60px 0;
          text-align: center;
          margin-bottom: 40px;
        }
        .catalog-title { font-size: 48px; font-weight: 900; margin-bottom: 10px; color: var(--fg); }
        .catalog-subtitle { font-size: 18px; color: #666; max-width: 600px; margin: 0 auto; }
        
        .catalog-controls {
          display: flex;
          flex-direction: column;
          gap: 20px;
          padding: 25px;
          border-radius: 20px;
          margin-bottom: 40px;
        }
        
        .search-box {
          position: relative;
          width: 100%;
        }
        .search-icon { position: absolute; left: 15px; top: 50%; transform: translateY(-50%); color: #999; }
        .search-input {
          width: 100%;
          padding: 15px 15px 15px 50px;
          border-radius: 12px;
          border: 1px solid rgba(0,0,0,0.1);
          background: rgba(255,255,255,0.5);
          font-size: 16px;
          outline: none;
          transition: all 0.3s;
        }
        .search-input:focus { border-color: var(--primary); box-shadow: 0 0 0 4px var(--primary-light); }
        
        .filter-group { display: flex; align-items: center; gap: 20px; flex-wrap: wrap; }
        .filter-label { font-weight: 700; display: flex; align-items: center; gap: 8px; color: var(--fg); }
        .category-chips { display: flex; gap: 10px; flex-wrap: wrap; }
        .chip {
          padding: 10px 20px;
          border-radius: 30px;
          border: 1px solid rgba(0,0,0,0.1);
          background: white;
          cursor: pointer;
          transition: all 0.3s;
          font-weight: 500;
        }
        .chip.active { background: var(--primary); color: white; border-color: var(--primary); box-shadow: 0 4px 12px var(--primary-light); }
        
        .products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 30px;
          padding-bottom: 80px;
        }
        
        .catalog-product-card {
          border-radius: 24px;
          padding: 15px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
        }
        .catalog-product-card:hover { transform: translateY(-10px); }
        
        .product-badge {
          position: absolute;
          top: 25px;
          right: 25px;
          background: var(--primary);
          color: white;
          padding: 4px 12px;
          border-radius: 10px;
          font-size: 12px;
          font-weight: 700;
          z-index: 2;
        }
        
        .product-image-container {
          width: 100%;
          aspect-ratio: 1;
          border-radius: 18px;
          overflow: hidden;
          margin-bottom: 20px;
          position: relative;
        }
        .product-image { width: 100%; height: 100%; object-fit: cover; transition: transform 0.5s; }
        .catalog-product-card:hover .product-image { transform: scale(1.1); }
        
        .product-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: all 0.3s;
        }
        .catalog-product-card:hover .product-overlay { opacity: 1; }
        
        .btn-quick-view {
          background: white;
          color: var(--fg);
          padding: 12px 25px;
          border-radius: 12px;
          font-weight: 700;
          border: none;
          cursor: pointer;
          transform: translateY(20px);
          transition: all 0.3s;
        }
        .catalog-product-card:hover .btn-quick-view { transform: translateY(0); }
        
        .product-info { padding: 10px 5px; }
        .product-category { font-size: 12px; font-weight: 700; color: var(--primary); text-transform: uppercase; letter-spacing: 1px; }
        .product-name { font-size: 20px; font-weight: 800; margin: 5px 0 10px; color: var(--fg); }
        .product-prices { display: flex; flex-direction: column; gap: 4px; margin-bottom: 15px; }
        .price-unit { font-size: 22px; font-weight: 900; color: var(--fg); }
        .price-wholesale { font-size: 13px; color: #666; font-weight: 500; }
        
        .btn-share-card {
          width: 100%;
          padding: 12px;
          border-radius: 12px;
          border: 1px solid rgba(0,0,0,0.1);
          background: rgba(255,255,255,0.5);
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s;
        }
        .btn-share-card:hover { background: var(--primary-light); color: var(--primary); }
        
        .loader-container { grid-column: 1/-1; display: flex; justify-content: center; padding: 100px 0; }
        .no-results { grid-column: 1/-1; text-align: center; padding: 100px 0; }
        
        @media (min-width: 768px) {
          .catalog-controls { flex-direction: row; align-items: center; justify-content: space-between; }
          .search-box { max-width: 400px; }
        }
      `}</style>
        </main>
    );
}
