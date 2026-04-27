'use client';
import React, { useState, useEffect } from 'react';
import { ShoppingCart, Heart, Share2, Info, Star, MessageCircle } from 'lucide-react';
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
  const [waNumber, setWaNumber] = useState('51944399377');

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

    // Fetch public settings
    fetch('/api/settings')
      .then(res => res.json())
      .then(data => {
        if (data.buyWhatsAppNumber) setWaNumber(data.buyWhatsAppNumber);
      })
      .catch(console.error);

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
          Colección <span className="text-gradient">{currentGender === 'FEMALE' ? 'Naia' : 'Noir'}</span>
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
          <div key={product.id} className="p-card glass-premium animate-fade">
            <Link href={`/productos/${product.id}`} className="p-img-link">
              <div className="p-img-v3" style={{ backgroundImage: `url(${product.imageUrl})` }}>
                <div className="p-overlay-v3">
                  <span className="btn-view-premium">Detalles</span>
                </div>
                <div className="p-badge-float">{product.presentation || 'Unidad'}</div>
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
                <button className="btn-premium-v4 btn-grad flex-1" onClick={() => addToCart(product)}>
                  <ShoppingCart size={18} /> <span>Agregar</span>
                </button>
                <button 
                  className="btn-premium-v4 btn-wa flex-1" 
                  onClick={() => {
                    const msg = `Hola, me interesa el producto ${product.name}. ¿Me podrían dar más información?`;
                    window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, '_blank');
                  }}
                >
                  <MessageCircle size={18} /> <span>Comprar</span>
                </button>
                <button className="p-action-btn-v4 bg-soft-rose" onClick={() => setSharingProduct(product)} title="Compartir">
                  <Share2 size={18} />
                </button>
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
          border: none;
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
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 30px;
        }
        
        .p-card { 
            padding: 12px 12px 16px; 
            border-radius: var(--radius-xl); 
            transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); 
            background: var(--bg);
            border: none;
            box-shadow: var(--shadow-premium);
            will-change: transform, box-shadow;
            transform: translateZ(0);
            backface-visibility: hidden;
            position: relative;
        }
        :global(.men-theme) .p-card {
            background: var(--glass);
            border-color: var(--glass-border);
        }
        .p-card:hover { transform: translateY(-8px) translateZ(0); box-shadow: var(--shadow-xl); }
        
        .p-img-link { 
            display: block; 
            border-radius: 28px; 
            overflow: hidden; 
            position: relative; 
            background: var(--slate-100); 
            transition: all 0.4s ease;
        }
        :global(.men-theme) .p-img-link { background: rgba(0,0,0,0.3); }
        .p-img-v3 { height: 260px; background-size: cover; background-position: center; transition: transform 0.6s ease; border-radius: 28px; }
        .p-card:hover .p-img-link {
            filter: drop-shadow(0 15px 30px var(--primary-light));
        }
        .p-card:hover .p-img-v3 { transform: scale(1.05); }
        
        .p-overlay-v3 {
            position: absolute; inset: 0; background: rgba(0,0,0,0.2); 
            display: flex; align-items: center; justify-content: center;
            opacity: 0; transition: all 0.3s;
            border-radius: 28px;
        }
        .p-card:hover .p-overlay-v3 { opacity: 1; }
        .btn-view-premium {
            padding: 10px 24px; background: white; color: black; border-radius: 30px;
            font-weight: 800; font-size: 13px; transform: translateY(15px); transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        .p-card:hover .btn-view-premium { transform: translateY(0); }
        
        .p-badge-float {
            position: absolute; top: 20px; right: 20px; 
            background: var(--primary); color: white; padding: 4px 10px;
            border-radius: 6px; font-size: 10px; font-weight: 900;
            letter-spacing: 0.5px;
            z-index: 5;
        }

        .p-info-v3 { padding: 18px 8px 8px; }
        .p-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
        .p-cat-v3 { font-size: 10px; font-weight: 700; color: var(--primary); text-transform: uppercase; letter-spacing: 1.5px; }
        .p-stars { font-size: 12px; font-weight: 800; color: #fbbf24; display: flex; align-items: center; gap: 4px; }
        
        .p-name-link-v3 { text-decoration: none !important; color: var(--fg) !important; display: block; }
        .p-name-link-v3 h3 { font-size: 18px; font-weight: 800; margin-bottom: 12px; line-height: 1.2; transition: color 0.2s; }
        .p-name-link-v3:hover h3 { color: var(--primary); }
        
        .p-prices-v3 { 
            padding: 14px 18px; 
            border-radius: 20px; 
            display: flex; 
            align-items: center; 
            justify-content: space-between; 
            margin-bottom: 18px; 
            background: white !important;
            border: 1px solid var(--slate-100) !important;
            box-shadow: 0 4px 15px rgba(0,0,0,0.04);
        }
        :global(.men-theme) .p-prices-v3 { 
            background: rgba(255,255,255,0.04) !important; 
            border-color: rgba(255,255,255,0.06) !important;
        }
        .p-price-item { display: flex; flex-direction: column; }
        .p-price-item.wholesale { align-items: flex-end; text-align: right; border: none !important; padding: 0 !important; margin: 0 !important; }
        .p-price-item .label { font-size: 11px; font-weight: 700; color: var(--slate-500); text-transform: none; margin-bottom: 2px; }
        .p-price-item .val { font-size: 16px; font-weight: 800; color: var(--fg); letter-spacing: -0.01em; }
        .p-price-item.wholesale .val { color: var(--primary-dark); }
        :global(.men-theme) .p-price-item.wholesale .val { color: var(--accent); }

        @media (max-width: 600px) {
          .p-grid { grid-template-columns: 1fr; gap: 20px; }
          .p-section { padding: 40px 20px; }
          .p-card { padding: 10px !important; }
          .p-img-v3 { height: 260px !important; }
          .p-name-link-v3 h3 { font-size: 16px; }
          .p-actions-v3 { flex-direction: row; flex-wrap: nowrap; overflow: visible; }
        }
      `}</style>

    </section>
  );
}
