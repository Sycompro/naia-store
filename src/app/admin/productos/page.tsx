'use client';
import React, { useState, useEffect } from 'react';
import AdminInventory from '@/components/admin/AdminInventory';
import { useRouter } from 'next/navigation';

export default function ProductosPage() {
    const router = useRouter();
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [savingStock, setSavingStock] = useState<string | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const res = await fetch('/api/products');
            if (res.status === 403) {
                router.push('/admin/login');
                return;
            }
            if (res.ok) {
                const data = await res.json();
                // Normalize for AdminInventory
                const normalized = data.map((p: any) => ({
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

    const handleAdjustStock = (id: string, amount: number) => {
        setProducts(prev => prev.map(p =>
            p.id === id ? { ...p, stock: Math.max(0, p.stock + amount) } : p
        ));
    };

    const handleUpdateStock = async (id: string) => {
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
                await fetchProducts();
            }
        } catch (e) {
            console.error(e);
        } finally {
            setSavingStock(null);
        }
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
                onEditProduct={(p) => console.log('Edit', p)}
                onDeleteProduct={(id) => console.log('Delete', id)}
            />
        </div>
    );
}
