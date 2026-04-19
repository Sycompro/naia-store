'use client';
import React from 'react';
import { Search, Edit2, Trash2 } from 'lucide-react';
import AdminCard from './AdminCard';

interface AdminInventoryProps {
    products: any[];
    loading: boolean;
    searchTerm: string;
    setSearchTerm: (val: string) => void;
    onAdjustStock: (id: number, amount: number) => void;
    onUpdateStock: (id: number) => void;
    onEditProduct: (product: any) => void;
    onDeleteProduct: (id: number) => void;
    onAddProduct: () => void;
}

export default function AdminInventory({
    products,
    loading,
    searchTerm,
    setSearchTerm,
    onAdjustStock,
    onUpdateStock,
    onEditProduct,
    onDeleteProduct,
    onAddProduct
}: AdminInventoryProps) {

    const filteredProducts = products;

    return (
        <div className="inventory-section">
            <AdminCard
                title="Gestión de Inventario"
                description="Control de existencias, precios y estados de catálogo."
                actions={
                    <div className="search-box-admin">
                        <Search size={18} color="#94a3b8" />
                        <input
                            type="text"
                            placeholder="Buscar por nombre o código..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                }
            >
                <div className="table-responsive">
                    <div className="inventory-table-new">
                        <div className="table-head">
                            <div className="col-idx">#</div>
                            <div className="col-ref">Ref</div>
                            <div className="col-name">Producto</div>
                            <div className="col-barcode">Código</div>
                            <div className="col-id">ID</div>
                            <div className="col-cat">Categoría</div>
                            <div className="col-price text-right">Precio</div>
                            <div className="col-stock text-center">Stock</div>
                            <div className="col-actions text-right">Acciones</div>
                        </div>
                        <div className="table-list">
                            {loading ? (
                                <div className="state-row">Sincronizando con base de datos...</div>
                            ) : filteredProducts.length === 0 ? (
                                <div className="state-row">No se encontraron productos coincidentes</div>
                            ) : (
                                filteredProducts.map((p, idx) => (
                                    <div key={p.id} className="row-item-admin">
                                        <div className="col-idx">
                                            <span className="idx-txt">{idx + 1}</span>
                                        </div>
                                        <div className="col-ref">
                                            <div className="thumb-wrap">
                                                <img
                                                    src={p.imageUrl || '/placeholder.png'}
                                                    alt=""
                                                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=100&auto=format&fit=crop'; }}
                                                />
                                            </div>
                                        </div>
                                        <div className="col-name">
                                            <span className="name-txt">{p.name}</span>
                                        </div>
                                        <div className="col-barcode">
                                            <span className="barcode-txt">{p.barcode || '---'}</span>
                                        </div>
                                        <div className="col-id">
                                            <span className="id-txt">{String(p.id).substring(0, 6)}</span>
                                        </div>
                                        <div className="col-cat">
                                            <span className="badge-modern">{p.category || 'Sin Categoría'}</span>
                                        </div>
                                        <div className="col-price text-right unit-price-txt">S/ {Number(p.unitPrice || 0).toFixed(2)}</div>
                                        <div className="col-stock text-center">
                                            <div className="stock-ui-compact">
                                                <button onClick={() => onAdjustStock(p.id, -1)} className="stock-btn-min">-</button>
                                                <span className={`stock-val-min ${p.stock <= 5 ? 'critical' : ''}`}>{p.stock}</span>
                                                <button onClick={() => onAdjustStock(p.id, 1)} className="stock-btn-min">+</button>
                                                <button className="sync-btn-lite" onClick={() => onUpdateStock(p.id)}>Sincronizar</button>
                                            </div>
                                        </div>
                                        <div className="col-actions">
                                            <button className="btn-icon-admin edit" onClick={() => onEditProduct(p)} title="Editar"><Edit2 size={16} /></button>
                                            <button className="btn-icon-admin del" onClick={() => onDeleteProduct(p.id)} title="Eliminar"><Trash2 size={16} /></button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </AdminCard>

            <style jsx>{`
                .inventory-section { display: flex; flex-direction: column; gap: 20px; }
                .search-box-admin {
                    display: flex; align-items: center; gap: 12px; padding: 12px 20px;
                    background: #f8fafc; border: 1px solid #e2e8f0;
                    border-radius: 16px; width: 400px; transition: 0.3s;
                }
                .search-box-admin:focus-within { border-color: #ec4899; background: #fff; box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.05); }
                .search-box-admin input {
                    border: none; outline: none; background: none; color: #1e293b; flex: 1; font-size: 14px; font-weight: 700;
                }
                .search-box-admin input::placeholder { color: #94a3b8; }

                .table-responsive { width: 100%; overflow-x: auto; margin-top: 5px; }
                .inventory-table-new { min-width: 1000px; }
                
                .table-head {
                    display: grid; grid-template-columns: 30px 50px 1.5fr 110px 70px 1fr 100px 1.8fr 120px; gap: 20px;
                    padding: 15px 10px; border-bottom: 2px solid #f1f5f9;
                    font-size: 11px; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em;
                    align-items: center;
                }
                
                .row-item-admin {
                    display: grid; grid-template-columns: 30px 50px 1.5fr 110px 70px 1fr 100px 1.8fr 120px; gap: 20px;
                    padding: 18px 10px; border-bottom: 1px solid #f8fafc;
                    align-items: center; transition: 0.2s;
                }
                .row-item-admin:hover { background: #fdf2f8; }

                .thumb-wrap { width: 42px; height: 42px; border-radius: 12px; overflow: hidden; border: 1px solid #f1f5f9; background: #fff; }
                .thumb-wrap img { width: 100%; height: 100%; object-fit: cover; }
                .idx-txt { font-size: 12px; color: #cbd5e1; font-weight: 800; }
                .barcode-txt { font-size: 11px; color: #64748b; font-weight: 700; font-family: 'JetBrains Mono', monospace; }
                .name-txt { font-weight: 800; font-size: 15px; color: #1e293b; letter-spacing: -0.3px; }
                .id-txt { font-size: 12px; color: #94a3b8; font-weight: 700; font-family: monospace; }

                .badge-modern { 
                    padding: 6px 12px; border-radius: 100px; background: #f1f5f9; 
                    color: #475569; font-size: 11px; font-weight: 800; border: 1px solid #e2e8f0; 
                }

                .unit-price-txt { font-size: 15px; font-weight: 900; color: #1e293b; }

                .stock-ui-compact { display: flex; align-items: center; justify-content: center; gap: 8px; }
                .stock-btn-min { 
                    width: 26px; height: 26px; border-radius: 8px; background: #fff;
                    border: 1px solid #e2e8f0; color: #1e293b; font-weight: 900; cursor: pointer;
                    display: flex; align-items: center; justify-content: center; font-size: 16px; transition: 0.2s;
                }
                .stock-btn-min:hover { background: #1e293b; color: #fff; border-color: #1e293b; }
                .stock-val-min { font-weight: 900; color: #1e293b; width: 20px; text-align: center; font-size: 14px; }
                .stock-val-min.critical { color: #f43f5e; font-weight: 950; }
                
                .sync-btn-lite {
                    padding: 6px 12px; border-radius: 10px; background: #ec4899; border: none;
                    color: white; font-size: 10px; font-weight: 800; cursor: pointer; transition: 0.2s;
                    text-transform: uppercase; margin-left: 5px;
                    box-shadow: 0 4px 10px rgba(236, 72, 153, 0.2);
                }
                .sync-btn-lite:hover { background: #db2777; transform: translateY(-1px); }

                .btn-icon-admin {
                    width: 38px; height: 38px; border-radius: 12px; display: flex; align-items: center; justify-content: center;
                    background: #fff; border: 1px solid #e2e8f0; color: #64748b; cursor: pointer; transition: 0.3s;
                }
                .btn-icon-admin:hover { border-color: #ec4899; color: #ec4899; background: #fdf2f8; }
                .btn-icon-admin.del:hover { background: #fff1f2; color: #f43f5e; border-color: #fecdd3; }

                .col-actions { display: flex; gap: 8px; justify-content: flex-end; }
                .text-right { text-align: right; }
                .state-row { padding: 60px; text-align: center; color: #94a3b8; font-weight: 700; font-size: 15px; }
            `}</style>
        </div>
    );
}
