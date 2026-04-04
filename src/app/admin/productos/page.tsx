'use client';
import React, { useState, useEffect } from 'react';
import AdminInventory from '@/components/admin/AdminInventory';
import ProductModal from '@/components/admin/ProductModal';
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
        <div className="admin-productos-page">
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
                <div className="pagination-controls">
                    <button
                        disabled={pagination.page <= 1}
                        onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                    >
                        Anterior
                    </button>
                    <span>Página {pagination.page} de {pagination.totalPages}</span>
                    <button
                        disabled={pagination.page >= pagination.totalPages}
                        onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                    >
                        Siguiente
                    </button>
                </div>
            )}

            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveProduct}
                editingProduct={editingProduct}
            />

            <style jsx>{`
                .pagination-controls {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 20px;
                    margin-top: 30px;
                    padding: 20px;
                    color: white;
                }
                button {
                    background: rgba(255, 255, 255, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    padding: 8px 20px;
                    border-radius: 8px;
                    color: white;
                    cursor: pointer;
                    transition: all 0.3s ease;
                }
                button:hover:not(:disabled) {
                    background: rgba(255, 255, 255, 0.2);
                    transform: translateY(-2px);
                }
                button:disabled {
                    opacity: 0.3;
                    cursor: not-allowed;
                }
                span {
                    font-size: 0.9rem;
                    opacity: 0.8;
                }
            `}</style>
        </div>
    );
}
