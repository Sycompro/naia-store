'use client';
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Share2, Info, Star } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import ShareModal from './ShareModal';

export default function ProductSection() {
  const router = useRouter();
  const { addToCart } = useCart();
  const [sharingProduct, setSharingProduct] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentGender, setCurrentGender] = useState('FEMALE');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('Todas');
  const categories = ['Todas', 'Facial', 'Capilar', 'Corporal'];

  const fetchProducts = async (pageNum: number, gender: string, append = false, search = '') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products?page=${pageNum}&pageSize=8&gender=${gender}&search=${encodeURIComponent(search)}`);
      const data = await res.json();

      if (append) {
        setProducts(prev => [...prev, ...data.products]);
      } else {
        setProducts(data.products);
      }

      setHasMore(data.pagination.page < data.pagination.totalPages);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const checkTheme = () => {
      const isMen = document.body.classList.contains('men-theme');
      const newGender = isMen ? 'MALE' : 'FEMALE';
      if (newGender !== currentGender) {
        setCurrentGender(newGender);
        setPage(1);
        fetchProducts(1, newGender, false);
      }
    };

    checkTheme();
    const observer = new MutationObserver(checkTheme);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    // Initial fetch if empty
    if (products.length === 0) fetchProducts(1, currentGender, false, searchTerm);

    return () => observer.disconnect();
  }, [currentGender, searchTerm]);

  const loadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage, currentGender, true, searchTerm);
  };

  return (
    <section id="productos" className="p-section container">
      <div className="p-header animate-entrance">
        <h2 className="p-title">
          Catálogo <span className="text-gradient">{currentGender === 'FEMALE' ? 'Exclusivo' : 'Masculino'}</span>
        </h2>
        <p className="p-subtitle">Selección de productos con los más altos estándares de calidad y ciencia de vanguardia.</p>

        <div className="search-bar-wrap animate-entrance">
          <input
            type="text"
            placeholder="Buscar por nombre, categoría o marca..."
            className="search-input-premium glass-premium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="p-category-pills animate-entrance" style={{ animationDelay: '0.2s' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`cat-pill ${activeCategory === cat ? 'active' : ''} glass-premium`}
              onClick={() => {
                setActiveCategory(cat);
                if (cat !== 'Todos') {
                  setSearchTerm(cat);
                } else {
                  setSearchTerm('');
                }
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="p-grid">
        {loading && products.length === 0 ? (
          [1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="p-skeleton card-white" style={{ height: '400px' }}></div>
          ))
        ) : products.length === 0 ? (
          <div className="p-empty card-white" style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center' }}>
            <p>Próximamente más productos para {currentGender === 'FEMALE' ? 'ella' : 'él'}.</p>
          </div>
        ) : products.map((product) => (
          <div key={product.id} className="p-card animate-fade">
            <Link href={`/productos/${product.id}`} className="p-img-wrapper">
              <div className="p-img" style={{ backgroundImage: `url(${product.imageUrl})` }}>
                <div className="p-badges-v3">
                  {product.isBestSeller && <span className="p-badge-v3 promo">Best Seller</span>}
                  <span className="p-badge-v3">Premium</span>
                </div>
              </div>
            </Link>

            <button className="p-wishlist"><Heart size={18} /></button>

            <div className="p-body">
              <div className="p-meta">
                <span className="p-cat">{product.category}</span>
                <div className="p-rating"><Star size={12} fill="currentColor" /> <span>4.9</span></div>
              </div>

              <Link href={`/productos/${product.id}`} className="p-name-v3" style={{ textDecoration: 'none' }}>
                <h3>{product.name}</h3>
              </Link>
              <p className="p-desc">{product.presentation || product.description?.substring(0, 60) + '...'}</p>

              <div className="p-price-v3">
                <div className="price-item">
                  <span className="label">Unidad</span>
                  <span className="val">S/ {Number(product.unitPrice || 0).toFixed(2)}</span>
                </div>
                <div className="price-item wholesale">
                  <span className="label">Mayorista</span>
                  <span className="val">S/ {Number(product.wholesalePrice || 0).toFixed(2)}</span>
                </div>
              </div>

              <div className="p-actions-v3">
                <button
                  className="btn-premium-v4 btn-grad flex-1"
                  onClick={() => addToCart(product)}
                >
                  <ShoppingCart size={18} /> Agregar
                </button>
                <div className="p-extra-actions">
                  <button className="p-action-btn-v4 bg-soft-rose" onClick={() => setSharingProduct(product)} title="Compartir"><Share2 size={18} /></button>
                  <button className="p-action-btn-v4 bg-soft-blue" onClick={() => router.push(`/productos/${product.id}`)} title="Más información"><Info size={18} /></button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="p-load-more animate-fade">
          <button
            className="btn-outline-premium glass-premium"
            onClick={loadMore}
            disabled={loading}
          >
            {loading ? 'Cargando...' : 'Descubrir más productos'}
          </button>
        </div>
      )}

      <ShareModal
        isOpen={!!sharingProduct}
        onClose={() => setSharingProduct(null)}
        product={sharingProduct}
      />

      <style jsx>{`
        .p-section { padding: 40px 0 100px; border-top: 1px solid var(--slate-100); }
        .p-header { text-align: center; margin-bottom: 60px; }
        .p-title { font-size: 38px; margin-bottom: 15px; color: var(--fg); letter-spacing: -1.5px; }
        .p-subtitle { color: var(--slate-500); font-size: 16px; font-weight: 500; max-width: 600px; margin: 0 auto 40px; }
        
        .search-bar-wrap { max-width: 600px; margin: 0 auto; }
        .search-input-premium {
          width: 100%;
          padding: 16px 24px;
          border-radius: 16px;
          border: 1px solid var(--slate-100);
          background: var(--slate-50);
          color: var(--fg);
          font-weight: 600;
          outline: none;
          transition: 0.3s cubic-bezier(0.19, 1, 0.22, 1);
        }
        .search-input-premium:focus {
          border-color: var(--primary);
          background: var(--white);
          box-shadow: 0 4px 20px rgba(0,0,0,0.05);
          transform: translateY(-2px);
        }

        .p-category-pills {
          display: flex;
          justify-content: center;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 30px;
        }
        .cat-pill {
          padding: 8px 18px;
          border-radius: 12px;
          border: 1px solid var(--slate-100);
          background: var(--white);
          color: var(--slate-500);
          font-weight: 700;
          font-size: 13px;
          cursor: pointer;
          transition: all 0.3s;
        }
        .cat-pill:hover {
          color: var(--fg);
          border-color: var(--slate-300);
        }
        .cat-pill.active {
          background: var(--fg);
          color: white;
          border-color: var(--fg);
          box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }
        
        .p-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 30px;
        }
        
        .p-card {
          border-radius: 32px;
          padding: 12px;
          background: var(--white);
          border: 1px solid rgba(0,0,0,0.03);
          box-shadow: var(--shadow-premium);
          transition: all 0.5s cubic-bezier(0.19, 1, 0.22, 1);
          position: relative;
        }
        .p-card:hover {
          transform: translateY(-10px);
          box-shadow: var(--shadow-xl);
        }
        
        .p-img-wrapper { 
          display: block; 
          border-radius: 32px; 
          overflow: hidden;
          background: var(--slate-50);
        }
        .p-img {
          height: 280px;
          background-size: cover;
          background-position: center;
          transition: transform 0.8s cubic-bezier(0.19, 1, 0.22, 1);
          border-radius: 32px;
        }
        .p-card:hover .p-img { transform: scale(1.08); }
        
        .p-badges-v3 { position: absolute; top: 22px; left: 22px; display: flex; gap: 8px; z-index: 5; }
        .p-badge-v3 {
          padding: 4px 10px;
          background: var(--white);
          color: var(--fg);
          font-size: 10px;
          font-weight: 800;
          border-radius: 8px;
          text-transform: uppercase;
          box-shadow: 0 2px 6px rgba(0,0,0,0.05);
        }
        .p-badge-v3.promo { background: var(--grad-primary); color: white; }

        .p-wishlist {
          position: absolute;
          top: 22px;
          right: 22px;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: none;
          background: white;
          color: var(--slate-400);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.3s;
          z-index: 5;
          box-shadow: 0 2px 6px rgba(0,0,0,0.05);
        }
        .p-wishlist:hover { color: #f43f5e; transform: scale(1.1); }

        .p-body { padding: 18px 8px 8px; }
        .p-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; }
        .p-cat { font-size: 11px; font-weight: 800; color: var(--primary); text-transform: uppercase; letter-spacing: 0.1em; }
        .p-rating { display: flex; align-items: center; gap: 4px; font-size: 12px; font-weight: 700; color: #fbbf24; }
        
        .p-name-v3 h3 { font-size: 19px; font-weight: 800; margin-bottom: 8px; line-height: 1.2; color: var(--fg); letter-spacing: -0.5px; }
        .p-desc { font-size: 14px; color: var(--slate-400); font-weight: 500; margin-bottom: 20px; height: 40px; overflow: hidden; }
        
        .p-price-v3 { 
          padding: 16px; 
          border-radius: 18px; 
          display: flex; 
          align-items: center; 
          justify-content: space-between; 
          margin-bottom: 20px;
          background: var(--slate-50);
          border: 1px solid var(--slate-100);
        }
        .price-item { display: flex; flex-direction: column; }
        .price-item .label { font-size: 10px; font-weight: 800; color: var(--slate-400); margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.05em; }
        .price-item .val { font-size: 18px; font-weight: 900; color: var(--fg); letter-spacing: -0.5px; }
        .wholesale .val { color: var(--primary); }

        @media (max-width: 600px) {
          .p-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          .p-section { padding: 40px 0; }
          .p-card { padding: 8px; border-radius: 16px; }
          .p-img { height: 180px; }
          .p-name-v3 h3 { font-size: 14px; height: 34px; overflow: hidden; }
          .p-desc, .p-rating, .p-wishlist { display: none; }
          .p-price-v3 { flex-direction: column; align-items: flex-start; gap: 8px; padding: 10px; }
          .price-item .val { font-size: 15px; }
        }
      `}</style>

    </section>
  );
}
