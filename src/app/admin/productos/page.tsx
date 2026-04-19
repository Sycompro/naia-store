'use client';
export const dynamic = 'force-dynamic';
import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Plus, Tag, AlertCircle, Package, ChevronRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

// Components
import AdminInventory from '@/components/admin/AdminInventory';
import ProductModal from '@/components/admin/ProductModal';
import AdminPageHeader from '@/components/admin/AdminPageHeader';

function ProductsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const activeTab = searchParams.get('tab') || 'inventario';

    // Inventory States
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
    const [searchTerm, setSearchTerm] = useState('');
    const [savingStock, setSavingStock] = useState<number | null>(null);

    // Categories States
    const [categories, setCategories] = useState<any[]>([]);
    const [categoriesLoading, setCategoriesLoading] = useState(false);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);

    // Debounced search for inventory
    useEffect(() => {
        if (activeTab !== 'inventario') return;
        const timer = setTimeout(() => {
            fetchProducts(1, searchTerm);
        }, 500);
        return () => clearTimeout(timer);
    }, [searchTerm]);

    // Handle pagination and other tabs
    useEffect(() => {
        if (activeTab === 'inventario') {
            // Only fetch if not searching or if page changed
            fetchProducts(pagination.page, searchTerm);
        } else if (activeTab === 'categorias') {
            fetchCategories();
        } else if (activeTab === 'stock-bajo') {
            fetchLowStockProducts();
        }
    }, [activeTab, pagination.page]);

    // --- INVENTORY LOGIC ---
    const fetchProducts = async (page: number, search: string = '') => {
        setLoading(true);
        try {
            let url = `/api/products?page=${page}&pageSize=12`;
            if (search) url += `&search=${encodeURIComponent(search)}`;

            const res = await fetch(url);
            if (res.status === 403) { router.push('/admin/login'); return; }
            if (res.ok) {
                const data = await res.json();
                const normalized = data.products || [];
                setProducts(normalized);
                setPagination({
                    page,
                    totalPages: data.pagination.totalPages || 1
                });
            }
        } catch (e) { console.error(e); } finally { setLoading(false); }
    };

    // --- CATEGORIES LOGIC ---
    const fetchCategories = async () => {
        setCategoriesLoading(true);
        try {
            const res = await fetch('/api/admin/categories');
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch (e) { } finally { setCategoriesLoading(false); }
    };

    // --- LOW STOCK LOGIC ---
    const fetchLowStockProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/products?stockBelow=5&pageSize=100`);
            if (res.ok) {
                const data = await res.json();
                const normalized = data.products || [];
                setProducts(normalized);
            }
        } catch (e) { } finally { setLoading(false); }
    };

    // --- SHARED ACTIONS ---
    const handleAdjustStock = (id: number, amount: number) => {
        setProducts(prev => prev.map(p =>
            p.id === id ? { ...p, stock: Math.max(0, p.stock + amount) } : p
        ));
    };

    const handleUpdateStock = async (id: number) => {
        const product = products.find(p => p.id === id);
        if (!product) return;
        setSavingStock(id);
        try {
            const res = await fetch('/api/products', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, stock: product.stock })
            });
            if (res.ok && activeTab === 'stock-bajo' && product.stock > 5) {
                setProducts(prev => prev.filter(p => p.id !== id));
            }
        } catch (e) { } finally { setSavingStock(null); }
    };

    const handleDeleteProduct = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar este producto?')) return;
        try {
            const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
            if (res.ok) setProducts(prev => prev.filter(p => p.id !== id));
        } catch (e) { }
    };

    const handleSaveProduct = async (formData: any) => {
        const method = editingProduct ? 'PATCH' : 'POST';
        const body = editingProduct ? { ...formData, id: editingProduct.id } : formData;
        try {
            const res = await fetch('/api/products', {
                method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
            });
            if (res.ok) {
                setIsModalOpen(false);
                setEditingProduct(null);
                if (activeTab === 'inventario') fetchProducts(pagination.page);
                else fetchLowStockProducts();
            }
        } catch (e) { }
    };

    const setTab = (tab: string) => router.push(`/admin/productos?tab=${tab}`);
    return (
        <div className="admin-productos-page animate-entrance">
            <AdminPageHeader
                title="Catálogo & Stock"
                breadcrumb={[{ label: 'Admin', href: '/admin' }, { label: 'Productos' }]}
                actions={activeTab === 'inventario' && (
                    <button className="add-btn-premium" onClick={() => { setEditingProduct(null); setIsModalOpen(true); }}>
                        <Plus size={18} /> Nuevo Producto
                    </button>
                )}
            />

            <div className="settings-nav-tabs mt-8 mb-7">
                <button className={`tab-item ${activeTab === 'inventario' ? 'active' : ''}`} onClick={() => setTab('inventario')}>
                    <Package size={18} /><span>Inventario</span>
                </button>
                <button className={`tab-item ${activeTab === 'categorias' ? 'active' : ''}`} onClick={() => setTab('categorias')}>
                    <Tag size={18} /><span>Categorías</span>
                </button>
                <button className={`tab-item ${activeTab === 'stock-bajo' ? 'active' : ''}`} onClick={() => setTab('stock-bajo')}>
                    <AlertCircle size={18} /><span>Stock Bajo</span>
                </button>
            </div>

            {activeTab === 'categorias' ? (
                <div className="categories-grid animate-fade-in">
                    {categoriesLoading ? (
                        <div className="p-20 flex justify-center"><Loader2 className="animate-spin text-primary" /></div>
                    ) : (
                        categories.map((cat, idx) => (
                            <div key={idx} className="category-card-premium">
                                <div className="category-icon-box"><Tag size={24} /></div>
                                <div className="category-info">
                                    <h3>{cat.category}</h3>
                                    <p>{cat._count._all} Productos registrados</p>
                                </div>
                                <button className="view-btn" onClick={() => {
                                    setSearchTerm(cat.category);
                                    setTab('inventario');
                                }}>
                                    <ChevronRight size={20} />
                                </button>
                            </div>
                        ))
                    )}
                </div>
            ) : (
                <div className="inventory-wrapper animate-fade-in">
                    <AdminInventory
                        products={products}
                        loading={loading}
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        onAdjustStock={handleAdjustStock}
                        onUpdateStock={handleUpdateStock}
                        onEditProduct={(p) => { setEditingProduct(p); setIsModalOpen(true); }}
                        onDeleteProduct={handleDeleteProduct}
                        onAddProduct={() => { setEditingProduct(null); setIsModalOpen(true); }}
                    />

                    {activeTab === 'inventario' && pagination.totalPages > 1 && (
                        <div className="pagination-wrapper mt-10">
                            <div className="pagination-controls-admin">
                                <button className="p-nav-btn" disabled={pagination.page <= 1} onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}>Anterior</button>
                                <span className="page-indicator">Página {pagination.page} de {pagination.totalPages}</span>
                                <button className="p-nav-btn" disabled={pagination.page >= pagination.totalPages} onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}>Siguiente</button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveProduct}
                editingProduct={editingProduct}
            />

            <style jsx>{`
                .admin-productos-page { max-width: 1400px; margin: 0 auto; }
                .settings-nav-tabs { 
                    display: flex; gap: 8px; background: #f1f5f9; padding: 6px; 
                    border-radius: 18px; width: fit-content; margin-bottom: 35px;
                    border: 1px solid #e2e8f0;
                }
                .tab-item { display: flex; align-items: center; gap: 10px; padding: 12px 24px; border-radius: 14px; border: none; background: none; color: #64748b; font-weight: 800; font-size: 14px; cursor: pointer; transition: 0.3s; }
                .tab-item:hover { color: #ec4899; }
                .tab-item.active { background: #ec4899; color: white; box-shadow: 0 10px 20px rgba(236, 72, 153, 0.2); }
                
                .categories-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 25px; }
                .category-card-premium { 
                    display: flex; align-items: center; gap: 20px; padding: 30px; 
                    background: #fff; border: 1px solid #f1f5f9; border-radius: 24px; 
                    transition: 0.3s; box-shadow: 0 10px 30px -10px rgba(0,0,0,0.02);
                }
                .category-card-premium:hover { transform: translateY(-5px); box-shadow: 0 20px 40px -10px rgba(0,0,0,0.05); }
                .category-icon-box { 
                    width: 54px; height: 54px; background: #fdf2f8; border-radius: 16px; 
                    display: flex; align-items: center; justify-content: center; color: #ec4899; 
                    border: 1px solid #fce7f3; 
                }
                .category-info h3 { font-size: 20px; font-weight: 950; color: #1e293b; margin: 0 0 4px 0; letter-spacing: -0.5px; }
                .category-info p { font-size: 13px; font-weight: 600; color: #94a3b8; }
                .view-btn { width: 44px; height: 44px; border-radius: 14px; background: #f8fafc; border: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: center; color: #64748b; cursor: pointer; transition: 0.3s; margin-left: auto; }
                .category-card-premium:hover .view-btn { background: #ec4899; color: #fff; border-color: #ec4899; }

                .add-btn-premium { 
                    background: #1e293b; color: white; border: none; padding: 12px 24px; 
                    border-radius: 14px; font-weight: 800; display: flex; align-items: center; 
                    gap: 10px; cursor: pointer; transition: 0.3s; 
                    box-shadow: 0 10px 20px rgba(30, 41, 59, 0.1);
                }
                .add-btn-premium:hover { background: #0f172a; transform: translateY(-2px); }

                .pagination-wrapper { display: flex; justify-content: center; margin-top: 40px; }
                .pagination-controls-admin { 
                    display: flex; align-items: center; gap: 20px; background: #fff; 
                    padding: 8px 12px; border-radius: 20px; border: 1px solid #f1f5f9;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.02);
                }
                .page-indicator { font-size: 14px; font-weight: 800; color: #1e293b; min-width: 140px; text-align: center; }
                .p-nav-btn { 
                    background: #f8fafc; border: 1px solid #f1f5f9; padding: 10px 20px; 
                    border-radius: 14px; color: #64748b; cursor: pointer; font-size: 13px; font-weight: 800; transition: 0.3s; 
                }
                .p-nav-btn:hover:not(:disabled) { background: #1e293b; color: white; border-color: #1e293b; }
                .p-nav-btn:disabled { opacity: 0.4; cursor: not-allowed; }
                @keyframes entrance { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .animate-entrance { animation: entrance 0.6s ease-out; }
            `}</style>tyle>
        </div>
    );
}

export default function ProductosPage() {
    return (
        <Suspense fallback={<div className="p-10 text-center">Cargando Productos...</div>}>
            <ProductsContent />
        </Suspense>
    );
}
