'use client';
export const dynamic = 'force-dynamic';
import React, { useState, useEffect } from 'react';
import AdminInventory from '@/components/admin/AdminInventory';
import ProductModal from '@/components/admin/ProductModal';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function StockBajoPage() {
    const router = useRouter();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [savingStock, setSavingStock] = useState<number | null>(null);

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);

    useEffect(() => {
        fetchLowStockProducts();
    }, []);

    const fetchLowStockProducts = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/products?stockBelow=5&pageSize=100`);
            if (res.status === 403) {
                router.push('/admin/login');
                return;
            }
            if (res.ok) {
                const data = await res.json();
                const normalized = (data.products || []).map((p: any) => ({
                    ...p,
                    price: p.unitPrice,
                    image: p.imageUrl
                }));
                setProducts(normalized);
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
                if (product.stock > 5) {
                    setProducts(prev => prev.filter(p => p.id !== id));
                }
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
        const method = 'PATCH';
        const body = { ...formData, id: editingProduct.id };
        try {
            const res = await fetch('/api/products', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            if (res.ok) {
                setIsModalOpen(false);
                setEditingProduct(null);
                fetchLowStockProducts();
            }
        } catch (e) { }
    };

    const openEditModal = (product: any) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    return (
        <div className="admin-productos-page animate-entrance">
            <AdminPageHeader
                title="Alertas de Stock Bajo"
                breadcrumb={[{ label: 'Admin', href: '/admin' }, { label: 'Productos', href: '/admin/productos' }, { label: 'Stock Bajo' }]}
                actions={
                    <div className="stock-alert-badge">
                        <AlertCircle size={16} />
                        <span>{products.length} Productos críticos</span>
                    </div>
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
                onAddProduct={() => { }}
            />

            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveProduct}
                editingProduct={editingProduct}
            />

            <style jsx>{`
                .admin-productos-page { max-width: 1600px; margin: 0 auto; }
                .stock-alert-badge {
                    background: rgba(244, 63, 94, 0.1);
                    color: #f43f5e;
                    padding: 8px 16px;
                    border-radius: 12px;
                    border: 1px solid rgba(244, 63, 94, 0.2);
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 13px;
                    font-weight: 800;
                }
            `}</style>
        </div>
    );
}
