'use client';
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Share2, Info, Star } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import ShareModal from './ShareModal';

export default function ProductSection() {
  const { addToCart } = useCart();
  const [sharingProduct, setSharingProduct] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentGender, setCurrentGender] = useState('FEMALE');

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const checkTheme = () => {
      const isMen = document.body.classList.contains('men-theme');
      setCurrentGender(isMen ? 'MALE' : 'FEMALE');
    };

    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const filteredProducts = products.filter(p => p.gender === currentGender);

  return (
    <section id="productos" className="p-section container">
      <div className="p-header animate-entrance">
        <h2 className="p-title">
          Catálogo <span className="text-gradient">{currentGender === 'FEMALE' ? 'Exclusivo' : 'Masculino'}</span>
        </h2>
        <p className="p-subtitle">Selección de productos con los más altos estándares de calidad y ciencia de vanguardia.</p>
      </div>

      <div className="p-grid">
        {loading ? (
          [1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="p-skeleton glass-premium"></div>
          ))
        ) : filteredProducts.length === 0 ? (
          <div className="p-empty glass-premium">
            <p>Próximamente más productos para {currentGender === 'FEMALE' ? 'ella' : 'él'}.</p>
          </div>
        ) : filteredProducts.map((product) => (
          <div key={product.id} className="p-card glass-premium animate-fade">
            <Link href={`/productos/${product.id}`} className="p-img-wrapper">
              <div className="p-img" style={{ backgroundImage: `url(${product.imageUrl})` }}>
                <div className="p-badges-v3">
                  {product.isBestSeller && <span className="p-badge-v3">Top Seller</span>}
                  <span className="p-badge-v3 glass">New</span>
                </div>
              </div>
            </Link>

            <button className="p-wishlist glass-premium"><Heart size={18} /></button>

            <div className="p-body">
              <div className="p-meta">
                <span className="p-cat">{product.category}</span>
                <div className="p-rating"><Star size={12} fill="currentColor" /> <span>4.9</span></div>
              </div>

              <Link href={`/productos/${product.id}`} className="p-name-v3">
                <h3>{product.name}</h3>
              </Link>
              <p className="p-desc">{product.presentation}</p>

              <div className="p-price-v3 glass-premium">
                <div className="price-item">
                  <span className="l">Unitario</span>
                  <span className="v">${product.unitPrice.toFixed(2)}</span>
                </div>
                <div className="price-divider"></div>
                <div className="price-item wholesale">
                  <span className="l">Mayorista</span>
                  <span className="v">${product.wholesalePrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="p-footer-v3">
                <button
                  className="btn-premium btn-primary-v3 p-add"
                  onClick={() => addToCart(product)}
                >
                  <ShoppingCart size={18} /> Agregar
                </button>
                <div className="p-actions-v3">
                  <button className="p-mini-btn glass-premium" onClick={() => setSharingProduct(product)}><Share2 size={18} /></button>
                  <Link href={`/productos/${product.id}`} className="p-mini-btn glass-premium"><Info size={18} /></Link>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <ShareModal
        isOpen={!!sharingProduct}
        onClose={() => setSharingProduct(null)}
        product={sharingProduct}
      />

      <style jsx>{`
        .p-section { padding: 80px 0; }
        .p-header { text-align: center; margin-bottom: 60px; }
        .p-title { font-size: 42px; margin-bottom: 15px; }
        .p-subtitle { color: var(--slate-500); font-size: 16px; font-weight: 500; max-width: 600px; margin: 0 auto; }
        
        .p-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 35px;
          min-height: 400px;
        }
        .p-skeleton { height: 500px; border-radius: var(--radius-xl); animation: pulse 1.5s infinite; }
        @keyframes pulse { 0%, 100% { opacity: 0.5; } 50% { opacity: 1; } }

        .p-card {
          border-radius: var(--radius-xl);
          padding: 12px;
          transition: all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          position: relative;
        }
        .p-card:hover { transform: translateY(-12px); box-shadow: var(--shadow-xl); }
        
        .p-img-wrapper { display: block; border-radius: var(--radius-lg); overflow: hidden; }
        .p-img {
          height: 280px;
          background-size: cover;
          background-position: center;
          position: relative;
          transition: transform 0.8s cubic-bezier(0.19, 1, 0.22, 1);
        }
        .p-card:hover .p-img { transform: scale(1.08); }
        
        .p-badges-v3 { position: absolute; top: 15px; left: 15px; display: flex; gap: 8px; }
        .p-badge-v3 {
          padding: 6px 12px;
          background: var(--primary);
          color: white;
          font-size: 10px;
          font-weight: 900;
          border-radius: 50px;
          text-transform: uppercase;
        }
        .p-badge-v3.glass { background: rgba(255,255,255,0.25); backdrop-filter: blur(4px); color: white; border: 1px solid rgba(255,255,255,0.3); }

        .p-wishlist {
          position: absolute;
          top: 25px;
          right: 25px;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--slate-400);
          cursor: pointer;
          transition: all 0.3s;
          z-index: 10;
        }
        .p-wishlist:hover { color: #f43f5e; transform: scale(1.1); }

        .p-body { padding: 20px 10px 10px; }
        .p-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .p-cat { font-size: 11px; font-weight: 800; color: var(--primary); text-transform: uppercase; letter-spacing: 0.1em; }
        .p-rating { display: flex; align-items: center; gap: 5px; font-size: 12px; font-weight: 700; color: #fbbf24; }
        
        .p-name-v3 { text-decoration: none; color: var(--fg); }
        .p-name-v3 h3 { font-size: 20px; font-weight: 800; margin-bottom: 8px; line-height: 1.2; transition: color 0.3s; }
        .p-name-v3:hover h3 { color: var(--primary); }
        
        .p-desc { font-size: 14px; color: var(--slate-400); font-weight: 500; margin-bottom: 20px; }
        
        .p-price-v3 { padding: 15px; border-radius: var(--radius-md); display: flex; align-items: center; margin-bottom: 25px; }
        .price-item { flex: 1; display: flex; flex-direction: column; }
        .price-item .l { font-size: 10px; font-weight: 800; color: var(--slate-400); text-transform: uppercase; margin-bottom: 4px; }
        .price-item .v { font-size: 18px; font-weight: 900; color: var(--fg); }
        .price-item.wholesale .v { color: var(--primary-dark); }
        .price-divider { width: 1px; height: 30px; background: var(--slate-200); margin: 0 15px; }

        .p-footer-v3 { display: flex; flex-direction: column; gap: 12px; }
        .p-add { width: 100%; justify-content: center; padding: 16px; border-radius: 16px; }
        .p-actions-v3 { display: flex; gap: 10px; justify-content: center; }
        .p-mini-btn {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--fg);
          cursor: pointer;
          transition: all 0.3s;
        }
        .p-mini-btn:hover { color: var(--primary); transform: translateY(-3px); }

        @media (max-width: 600px) {
          .p-title { font-size: 32px; }
          .p-grid { gap: 20px; }
        }
      `}</style>
    </section>
  );
}
