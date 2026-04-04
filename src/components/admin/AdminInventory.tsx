'use client';
import React from 'react';
import { Search, AlertTriangle, Filter, Plus, Edit2, Trash2 } from 'lucide-react';

interface AdminInventoryProps {
    products: any[];
    loading: boolean;
    searchTerm: string;
    setSearchTerm: (val: string) => void;
    onAdjustStock: (id: string, amount: number) => void;
    onUpdateStock: (id: string) => void;
    onEditProduct: (product: any) => void;
    onDeleteProduct: (id: string) => void;
}

export default function AdminInventory({
    products,
    loading,
    searchTerm,
    setSearchTerm,
    onAdjustStock,
    onUpdateStock,
    onEditProduct,
    onDeleteProduct
}: AdminInventoryProps) {

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="inventory-section">
            <div className="inventory-header">
                <div className="search-box">
                    <Search size={20} color="#94a3b8" />
                    <input
                        type="text"
                        placeholder="Buscar por nombre o categoría..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="header-actions">
                    <button className="filter-btn-inv"><Filter size={18} /> Filtros</button>
                    <button className="add-btn-inv"><Plus size={18} /> Nuevo Producto</button>
                </div>
            </div>

            <div className="inventory-table glass-premium">
                <div className="table-header">
                    <span>Producto</span>
                    <span>Categoría</span>
                    <span>Género</span>
                    <span>Precio</span>
                    <span>Stock</span>
                    <span>Acciones</span>
                </div>
                <div className="table-body">
                    {loading ? (
                        <div className="loading-row">Consultando inventario...</div>
                    ) : filteredProducts.length === 0 ? (
                        <div className="empty-row">No se encontraron productos.</div>
                    ) : (
                        filteredProducts.map(p => (
                            <div key={p.id} className="table-row">
                                <div className="product-cell">
                                    <img src={p.image || '/placeholder.png'} alt={p.name} className="product-thumb" />
                                    <div className="product-info">
                                        <span className="p-name">{p.name}</span>
                                        <span className="p-id">ID: {String(p.id).substring(0, 8)}</span>
                                    </div>
                                </div>
                                <div className="category-cell">
                                    <span className="cat-badge">{p.category || 'N/A'}</span>
                                </div>
                                <div>{p.gender === 'ELLA' ? 'Femenino' : 'Masculino'}</div>
                                <div className="price-cell">S/ {p.price.toFixed(2)}</div>
                                <div className="stock-cell">
                                    <div className="stock-controls">
                                        <button onClick={() => onAdjustStock(p.id, -1)} className="adj-btn">-</button>
                                        <input
                                            type="number"
                                            value={p.stock}
                                            readOnly
                                            className="stock-input"
                                        />
                                        <button onClick={() => onAdjustStock(p.id, 1)} className="adj-btn">+</button>
                                    </div>
                                    {p.stock <= 5 && (
                                        <span className="low-stock-warning">
                                            <AlertTriangle size={12} /> Stock Bajo
                                        </span>
                                    )}
                                </div>
                                <div className="action-cell">
                                    <button className="save-btn" onClick={() => onUpdateStock(p.id)}>Guardar</button>
                                    <button className="icon-btn" onClick={() => onEditProduct(p)}><Edit2 size={16} /></button>
                                    <button className="icon-btn delete" onClick={() => onDeleteProduct(p.id)}><Trash2 size={16} /></button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <style jsx>{`
                .inventory-section { display: flex; flex-direction: column; gap: 24px; animation: slideUp 0.6s; }
                .inventory-header { display: flex; justify-content: space-between; align-items: center; gap: 20px; }
                
                .search-box {
                    display: flex; align-items: center; gap: 12px; padding: 12px 20px;
                    border-radius: 18px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1);
                    flex: 1; max-width: 600px;
                }
                .search-box input { border: none; outline: none; flex: 1; font-weight: 600; color: #f8fafc; background: transparent; font-family: inherit; }
                
                .header-actions { display: flex; gap: 12px; }
                .filter-btn-inv, .add-btn-inv {
                    display: flex; align-items: center; gap: 8px; padding: 12px 20px;
                    border-radius: 16px; font-weight: 800; font-size: 14px; cursor: pointer; transition: 0.3s;
                }
                .filter-btn-inv { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: #94a3b8; }
                .add-btn-inv { background: white; border: none; color: #0f172a; font-weight: 900; }
                .add-btn-inv:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(255,255,255,0.1); }

                .inventory-table { 
                    background: rgba(255,255,255,0.03); border-radius: 24px; 
                    overflow-x: auto; border: 1px solid rgba(255,255,255,0.05); 
                }
                .table-content { min-width: 800px; }
                
                .table-header { 
                    background: rgba(255,255,255,0.05); border-bottom: 1px solid rgba(255,255,255,0.05);
                    display: grid; grid-template-columns: 2.5fr 1fr 1fr 1fr 1.5fr 1.5fr; padding: 18px 28px;
                    font-size: 11px; font-weight: 900; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;
                }
                .table-row {
                    display: grid; grid-template-columns: 2.5fr 1fr 1fr 1fr 1.5fr 1.5fr; padding: 18px 28px;
                    align-items: center; border-bottom: 1px solid rgba(255,255,255,0.02); transition: 0.3s;
                }
                .table-row:hover { background: rgba(255,255,255,0.05); }
                .product-cell { display: flex; align-items: center; gap: 16px; }
                .product-thumb { width: 44px; height: 44px; border-radius: 10px; object-fit: cover; border: 1px solid rgba(255,255,255,0.1); }
                .p-name { font-weight: 800; font-size: 15px; color: #f1f5f9; }
                .p-id { font-size: 11px; color: #64748b; font-weight: 600; }

                .cat-badge { 
                    padding: 4px 10px; border-radius: 8px; background: rgba(255,255,255,0.1); 
                    color: #e2e8f0; font-size: 11px; font-weight: 800; text-transform: uppercase;
                }
                .price-cell { font-weight: 900; color: #f1f5f9; font-size: 15px; }

                .stock-controls { display: flex; align-items: center; gap: 8px; }
                .adj-btn { 
                    width: 32px; height: 32px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1);
                    display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.05); 
                    color: white; cursor: pointer; font-weight: 900;
                }
                .adj-btn:hover { background: rgba(255,255,255,0.2); }
                .stock-input {
                    padding: 8px; border-radius: 10px; border: 1px solid rgba(255,255,255,0.1); width: 45px;
                    text-align: center; font-weight: 900; font-family: inherit; background: rgba(255,255,255,0.05); color: white;
                }
                .low-stock-warning { color: #f87171; }

                .save-btn { background: #059669; }
                .icon-btn { 
                    width: 36px; height: 36px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);
                    display: flex; align-items: center; justify-content: center; background: rgba(255,255,255,0.05); 
                    color: #94a3b8; cursor: pointer;
                }
                .icon-btn.delete { color: #ef4444; }

                @media (max-width: 768px) {
                    .inventory-header { flex-direction: column; align-items: stretch; }
                    .search-box { max-width: none; }
                }
            `}</style>
        </div>
    );
}
