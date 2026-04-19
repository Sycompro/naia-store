'use client';
export const dynamic = 'force-dynamic';
import React, { useState, useEffect } from 'react';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import { Tag, Package, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function CategoriasPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/categories');
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="admin-categorias-page animate-entrance">
            <AdminPageHeader
                title="Categorías de Productos"
                breadcrumb={[{ label: 'Admin', href: '/admin' }, { label: 'Productos', href: '/admin/productos' }, { label: 'Categorías' }]}
            />

            {loading ? (
                <div className="flex justify-center p-20">
                    <div className="spinner"></div>
                </div>
            ) : (
                <div className="categories-grid">
                    {categories.map((cat, idx) => (
                        <div key={idx} className="category-card-premium glass-card">
                            <div className="category-icon-box">
                                <Tag size={24} />
                            </div>
                            <div className="category-info">
                                <h3>{cat.category}</h3>
                                <p>
                                    <Package size={14} />
                                    {cat._count._all} Productos
                                </p>
                            </div>
                            <Link href={`/admin/productos?search=${cat.category}`} className="view-btn">
                                <ChevronRight size={20} />
                            </Link>
                        </div>
                    ))}
                </div>
            )}

            <style jsx>{`
                .categories-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
                    gap: 20px;
                    margin-top: 10px;
                }
                .category-card-premium {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 24px;
                    background: rgba(255, 255, 255, 0.02);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 20px;
                    transition: 0.3s;
                    position: relative;
                    overflow: hidden;
                }
                .category-card-premium:hover {
                    background: rgba(255, 255, 255, 0.05);
                    transform: translateY(-5px);
                    border-color: rgba(255, 255, 255, 0.1);
                }
                .category-icon-box {
                    width: 54px;
                    height: 54px;
                    background: rgba(255, 255, 255, 0.03);
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
                }
                .category-info {
                    flex: 1;
                }
                .category-info h3 {
                    font-size: 1.1rem;
                    font-weight: 800;
                    color: white;
                    margin: 0 0 4px 0;
                }
                .category-info p {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 13px;
                    font-weight: 700;
                    color: #64748b;
                }
                .view-btn {
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                    background: rgba(255,255,255,0.05);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #475569;
                    transition: 0.3s;
                }
                .category-card-premium:hover .view-btn {
                    background: white;
                    color: #0f172a;
                }
                .spinner { width: 40px; height: 40px; border: 4px solid rgba(255,255,255,0.1); border-top-color: #fff; border-radius: 50%; animation: spin 1s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }
                @keyframes entrance { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                .animate-entrance { animation: entrance 0.6s ease-out; }
            `}</style>
        </div>
    );
}
