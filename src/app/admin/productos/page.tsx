'use client';
import React, { useState, useEffect } from 'react';
import AdminInventory from '@/components/admin/AdminInventory';
import ProductModal from '@/components/admin/ProductModal';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProductosPage() {
    const router = useRouter();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, totalPages: 1 });
    const [searchTerm, setSearchTerm] = useState('');
    const [savingStock, setSavingStock] = useState<number | null>(null);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);

    useEffect(() => {
        fetchProducts(pagination.page);
    }, [pagination.page]);

    const fetchProducts = async (page: number) => {
        setLoading(true);
        try {
            const res = await fetch(`/api/products?page=${page}&pageSize=12`);
            if (res.status === 403) {
                router.push('/admin/login');
                return;
            }
            if (res.ok) {
                const data = await res.json();
                // Normalize for AdminInventory
                const normalized = (data.products || []).map((p: any) => ({
                    ...p,
                    price: p.unitPrice,
                    image: p.imageUrl
                }));
                setProducts(normalized);
                setPagination(prev => ({ ...prev, totalPages: data.pagination.totalPages }));
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

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
            if (res.ok) {
                // Success feedback if needed
            }
        } catch (e) {
            console.error(e);
        } finally {
            setSavingStock(null);
        }
    };

    const handleDeleteProduct = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar este producto?')) return;

        try {
            const res = await fetch(`/api/products?id=${id}`, { method: 'DELETE' });
            if (res.ok) {
                setProducts(prev => prev.filter(p => p.id !== id));
            }
        } catch (e) { }
    };

    const handleSaveProduct = async (formData: any) => {
        const method = editingProduct ? 'PATCH' : 'POST';
        const body = editingProduct ? { ...formData, id: editingProduct.id } : formData;

        try {
            const res = await fetch('/api/products', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });

            if (res.ok) {
                setIsModalOpen(false);
                setEditingProduct(null);
                fetchProducts(pagination.page);
            } else {
                const error = await res.json();
                alert(error.error || 'Error al guardar el producto');
            }
        } catch (e) {
            alert('Error de conexión');
        }
    };

    const openEditModal = (product: any) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const openAddModal = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    return (
        <div className="admin-productos-page animate-entrance">
            <AdminPageHeader
                title="Gestión de Inventario"
                breadcrumb={[{ label: 'Admin', href: '/admin' }, { label: 'Productos' }]}
                actions={
                    <button className="add-btn-premium" onClick={openAddModal}>
                        <Plus size={18} /> Nuevo Producto
                    </button>
                }
            />

            <AdminInventory
                products={products}
                loading={loading}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                onAdjustStock={handleAdjustStock}
                onUpdateStock={handleUpdateStock}
                onEditProduct={openEditModal}
                onDeleteProduct={handleDeleteProduct}
                onAddProduct={openAddModal}
            />

            {pagination.totalPages > 1 && (
                <div className="pagination-wrapper">
                    <div className="pagination-controls-admin">
                        <button
                            disabled={pagination.page <= 1}
                            onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                        >
                            Anterior
                        </button>
                        <span className="page-indicator">Página {pagination.page} de {pagination.totalPages}</span>
                        <button
                            disabled={pagination.page >= pagination.totalPages}
                            onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                        >
                            Siguiente
                        </button>
                    </div>
                </div>
            )}

            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveProduct}
                editingProduct={editingProduct}
            />

            <style jsx>{`
                .admin-productos-page {
                    max-width: 1600px;
                    margin: 0 auto;
                }
                .add-btn-premium {
                    background: white;
                    color: #0f172a;
                    border: none;
                    padding: 10px 24px;
                    border-radius: 14px;
                    font-weight: 800;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    cursor: pointer;
                    transition: 0.3s;
                    box-shadow: 0 10px 30px rgba(255,255,255,0.1);
                }
                .add-btn-premium:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 15px 40px rgba(255,255,255,0.2);
                }
                .pagination-wrapper {
                    display: flex;
                    justify-content: flex-end;
                    margin-top: 20px;
                }
                .pagination-controls-admin {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    background: rgba(255,255,255,0.03);
                    padding: 8px 16px;
                    border-radius: 16px;
                    border: 1px solid rgba(255,255,255,0.05);
                }
                .page-indicator {
                    font-size: 13px;
                    font-weight: 700;
                    color: #64748b;
                }
                button:not(.add-btn-premium) {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    padding: 8px 16px;
                    border-radius: 10px;
                    color: white;
                    cursor: pointer;
                    font-size: 13px;
                    font-weight: 700;
                    transition: 0.3s;
                }
                button:not(.add-btn-premium):hover:not(:disabled) {
                    background: rgba(255, 255, 255, 0.15);
                }
                button:disabled {
                    opacity: 0.3;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
}
