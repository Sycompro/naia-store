'use client';
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Share2, Info } from 'lucide-react';
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
    <section id="productos" className="products-section container">
      <div className="section-header">
        <h2>Catálogo <span className="highlight">{currentGender === 'FEMALE' ? 'Femenino' : 'Masculino'}</span></h2>
        <p>Selección de productos con los más altos estándares de calidad.</p>
      </div>

      <div className="product-grid">
        {loading ? (
          <div className="loading-state">
            <p>Cargando catálogo premium...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="empty-state">
            <p>Próximamente más productos para {currentGender === 'FEMALE' ? 'ella' : 'él'}.</p>
          </div>
        ) : filteredProducts.map((product) => (
          <div key={product.id} className="product-card glass animate-fade">
            <Link href={`/productos/${product.id}`} className="product-image-link">
              <div className="product-image" style={{ backgroundImage: `url(${product.imageUrl})` }}>
                <div className="product-badges">
                  {product.isBestSeller && <span className="badge-mini">Top</span>}
                </div>
              </div>
            </Link>
            <button className="wishlist-btn"><Heart size={18} /></button>

            <div className="product-info">
              <span className="product-category">{product.category}</span>
              <Link href={`/productos/${product.id}`} className="product-name-link">
                <h3>{product.name}</h3>
              </Link>
              <p className="presentation">{product.presentation}</p>

              <div className="price-container">
                <div className="price-box">
                  <span className="price-label">Precio Unitario</span>
                  <span className="price-value">${product.unitPrice.toFixed(2)}</span>
                </div>
                <div className="price-box wholesale">
                  <span className="price-label">Mayorista</span>
                  <span className="price-value">${product.wholesalePrice.toFixed(2)}</span>
                </div>
              </div>

              <div className="card-actions">
                <button
                  className="btn btn-primary full-width"
                  onClick={() => addToCart(product)}
                >
                  <ShoppingCart size={18} /> Agregar
                </button>
                <div className="icon-btns">
                  <button className="icon-btn" onClick={() => setSharingProduct(product)}><Share2 size={18} /></button>
                  <Link href={`/productos/${product.id}`} className="icon-btn"><Info size={18} /></Link>
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
        .products-section {
          padding: 60px 0;
        }
        .section-header {
          text-align: center;
          margin-bottom: 50px;
        }
        .section-header h2 {
          font-size: 36px;
          margin-bottom: 10px;
        }
        .product-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 30px;
          min-height: 400px;
        }
        .loading-state, .empty-state {
            grid-column: 1 / -1;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 200px;
            font-size: 18px;
            color: #888;
        }
        .product-card {
          border-radius: 24px;
          overflow: hidden;
          transition: all 0.4s ease;
          position: relative;
        }
        .product-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1);
        }
        .product-image-link { display: block; text-decoration: none; }
        .product-name-link { text-decoration: none; color: inherit; }
        .product-name-link:hover h3 { color: var(--primary); }
        .product-image {
          height: 250px;
          background-size: cover;
          background-position: center;
          position: relative;
          padding: 15px;
        }
        .product-badges {
          display: flex;
          gap: 5px;
        }
        .badge-mini {
          background: var(--primary);
          color: white;
          font-size: 10px;
          font-weight: 700;
          padding: 4px 10px;
          border-radius: 12px;
          text-transform: uppercase;
        }
        .wishlist-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          background: white;
          border: none;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #666;
          transition: all 0.3s;
        }
        .wishlist-btn:hover {
            background: var(--primary);
            color: white;
        }
        .product-info {
          padding: 20px;
        }
        .product-category {
          font-size: 12px;
          color: var(--primary);
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
        }
        .product-info h3 {
          margin: 8px 0;
          font-size: 18px;
        }
        .presentation {
          font-size: 14px;
          color: #888;
          margin-bottom: 15px;
        }
        .price-container {
          display: flex;
          justify-content: space-between;
          background: var(--gray-100);
          padding: 12px;
          border-radius: 16px;
          margin-bottom: 20px;
        }
        .price-box {
          display: flex;
          flex-direction: column;
        }
        .price-label {
          font-size: 10px;
          color: #888;
          text-transform: uppercase;
          margin-bottom: 2px;
        }
        .price-value {
          font-size: 18px;
          font-weight: 800;
          color: var(--fg);
        }
        .wholesale .price-value {
          color: var(--primary-dark);
        }
        .card-actions {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .full-width {
            width: 100%;
            justify-content: center;
        }
        .icon-btns {
            display: flex;
            gap: 10px;
            justify-content: center;
        }
        .icon-btn {
            background: var(--gray-100);
            border: none;
            width: 40px;
            height: 40px;
            border-radius: 12px;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.3s;
        }
        .icon-btn:hover {
            background: var(--secondary);
            color: var(--primary-dark);
        }
      `}</style>
    </section>
  );
}
