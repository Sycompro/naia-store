'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ShoppingBag, Heart, Share2, Shield, Truck, RotateCcw, Star } from 'lucide-react';
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

    if (loading) return <div className="loader-page"><div className="loader"></div></div>;
    if (!product) return <div className="not-found">Producto no encontrado</div>;

    return (
        <main className="product-detail-page">
            <Navbar />

            <div className="container detail-container">
                <div className="product-visuals">
                    <div className="main-image-card glass">
                        <img src={product.imageUrl} alt={product.name} />
                    </div>
                </div>

                <div className="product-content">
                    <div className="breadcrumb">
                        Productos / {product.gender === 'FEMALE' ? 'Ella' : 'Él'} / {product.category}
                    </div>
                    <h1 className="product-title">{product.name}</h1>
                    <div className="rating">
                        {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="var(--primary)" color="var(--primary)" />)}
                        <span>(12 reseñas)</span>
                    </div>

                    <div className="prices-section">
                        <div className="price-unit">${product.unitPrice.toFixed(2)}</div>
                        <div className="price-wholesale">
                            Precio Mayorista: <strong>${product.wholesalePrice.toFixed(2)}</strong> (Desde 3 unid.)
                        </div>
                    </div>

                    <p className="product-description">{product.description}</p>

                    <div className="presentation-tag">
                        Presentación: <strong>{product.presentation}</strong>
                    </div>

                    <div className="actions">
                        <button className="btn-add-cart" onClick={() => addToCart(product as any)}>
                            Añadir al Carrito <ShoppingBag size={20} />
                        </button>
                        <button className="btn-icon-detail" onClick={() => setIsShareModalOpen(true)}>
                            <Share2 size={22} />
                        </button>
                        <button className="btn-icon-detail">
                            <Heart size={22} />
                        </button>
                    </div>

                    <div className="benefits-grid">
                        <div className="benefit-item">
                            <Truck size={20} />
                            <span>Envío Express</span>
                        </div>
                        <div className="benefit-item">
                            <Shield size={20} />
                            <span>Garantía de Calidad</span>
                        </div>
                        <div className="benefit-item">
                            <RotateCcw size={20} />
                            <span>Devolución 30 días</span>
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
        .product-detail-page { padding-top: 120px; background: var(--bg); min-height: 100vh; }
        .detail-container { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; padding-bottom: 80px; }
        
        .main-image-card { border-radius: 40px; overflow: hidden; padding: 20px; aspect-ratio: 1; display: flex; align-items: center; justify-content: center; }
        .main-image-card img { width: 100%; height: 100%; object-fit: cover; border-radius: 24px; }
        
        .product-content { display: flex; flex-direction: column; gap: 20px; }
        .breadcrumb { font-size: 14px; color: #888; font-weight: 500; }
        .product-title { font-size: 48px; font-weight: 900; color: var(--fg); line-height: 1.1; }
        .rating { display: flex; align-items: center; gap: 8px; font-size: 14px; color: #666; }
        
        .prices-section { padding: 25px; border-radius: 20px; background: var(--primary-light); display: flex; flex-direction: column; gap: 10px; }
        .price-unit { font-size: 36px; font-weight: 900; color: var(--fg); }
        .price-wholesale { font-size: 15px; color: #444; }
        .price-wholesale strong { color: var(--primary-dark); font-size: 18px; }
        
        .product-description { font-size: 18px; line-height: 1.6; color: #555; }
        .presentation-tag { font-size: 16px; background: white; padding: 10px 20px; border-radius: 12px; border: 1px solid rgba(0,0,0,0.05); display: inline-block; width: fit-content; }
        
        .actions { display: flex; gap: 15px; margin-top: 20px; }
        .btn-add-cart { flex: 1; padding: 18px; background: var(--primary); color: white; border-radius: 16px; border: none; font-weight: 800; font-size: 18px; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 12px; transition: all 0.3s; }
        .btn-add-cart:hover { transform: translateY(-3px); box-shadow: 0 10px 30px var(--primary-light); }
        
        .btn-icon-detail { width: 60px; height: 60px; border-radius: 16px; border: 1px solid rgba(0,0,0,0.1); background: white; color: var(--fg); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.3s; }
        .btn-icon-detail:hover { background: var(--primary-light); color: var(--primary); border-color: var(--primary); }
        
        .benefits-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 15px; border-top: 1px solid rgba(0,0,0,0.05); padding-top: 30px; margin-top: 20px; }
        .benefit-item { display: flex; flex-direction: column; align-items: center; gap: 10px; text-align: center; font-size: 12px; font-weight: 700; color: #888; }
        
        .loader-page { height: 100vh; display: flex; align-items: center; justify-content: center; }
        
        @media (max-width: 992px) {
          .detail-container { grid-template-columns: 1fr; gap: 40px; }
          .product-title { font-size: 36px; }
        }
      `}</style>
        </main>
    );
}
