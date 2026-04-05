'use client';
import React from 'react';
import { Search, AlertTriangle, Filter, Edit2, Trash2 } from 'lucide-react';
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

    const filteredProducts = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="inventory-section">
            <AdminCard
                title="Lista de Productos"
                description="Gestiona el stock, precios y visualización de tu catálogo."
                actions={
                    <div className="search-box-admin">
                        <Search size={18} color="#64748b" />
                        <input
                            type="text"
                            placeholder="Buscar productos..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                }
            >
                <div className="table-responsive">
                    <div className="inventory-table-new">
                        <div className="table-head">
                            <div className="col-prod">Producto</div>
                            <div className="col-cat">Categoría</div>
                            <div className="col-price text-right">Precio</div>
                            <div className="col-stock">Inventario</div>
                            <div className="col-actions text-right">Mantenimiento</div>
                        </div>
                        <div className="table-list">
                            {loading ? (
                                <div className="state-row">Cargando catálogo...</div>
                            ) : filteredProducts.length === 0 ? (
                                <div className="state-row">Sin resultados para la búsqueda</div>
                            ) : (
                                filteredProducts.map(p => (
                                    <div key={p.id} className="row-item-admin">
                                        <div className="col-prod flex items-center gap-4">
                                            <div className="thumb-wrap shadow-premium">
                                                <img src={p.image || '/placeholder.png'} alt="" />
                                            </div>
                                            <div className="info-wrap">
                                                <span className="name-txt">{p.name}</span>
                                                <span className="id-txt">ID {String(p.id).substring(0, 6)}</span>
                                            </div>
                                        </div>
                                        <div className="col-cat">
                                            <span className="badge-modern">{p.category || 'NA'}</span>
                                        </div>
                                        <div className="col-price text-right font-black text-white">S/ {Number(p.price || 0).toFixed(2)}</div>
                                        <div className="col-stock">
                                            <div className="stock-ui">
                                                <button onClick={() => onAdjustStock(p.id, -1)} className="stock-bit">-</button>
                                                <span className={`stock-val ${p.stock <= 5 ? 'critical' : ''}`}>{p.stock}</span>
                                                <button onClick={() => onAdjustStock(p.id, 1)} className="stock-bit">+</button>
                                                <button className="sync-btn" onClick={() => onUpdateStock(p.id)}>Sincronizar</button>
                                            </div>
                                        </div>
                                        <div className="col-actions flex justify-end gap-2">
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
                    display: flex; align-items: center; gap: 12px; padding: 10px 18px;
                    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
                    border-radius: 14px; width: 320px; transition: 0.3s;
                }
                .search-box-admin:focus-within { border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.06); }
                .search-box-admin input {
                    border: none; outline: none; background: none; color: white; flex: 1; font-size: 14px; font-weight: 600;
                }

                .table-responsive { width: 100%; overflow-x: auto; margin-top: 10px; }
                .inventory-table-new { min-width: 900px; }
                
                .table-head {
                    display: grid; grid-template-columns: 2.5fr 1fr 1fr 2fr 1fr;
                    padding: 12px 10px; border-bottom: 2px solid rgba(255,255,255,0.05);
                    font-size: 11px; font-weight: 950; color: #475569; text-transform: uppercase; letter-spacing: 0.05em;
                }
                
                .row-item-admin {
                    display: grid; grid-template-columns: 2.5fr 1fr 1fr 2fr 1fr;
                    padding: 14px 10px; border-bottom: 1px solid rgba(255,255,255,0.03);
                    align-items: center; transition: 0.2s;
                }
                .row-item-admin:hover { background: rgba(255,255,255,0.02); }

                .thumb-wrap { width: 44px; height: 44px; border-radius: 10px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); }
                .thumb-wrap img { width: 100%; height: 100%; object-fit: cover; }
                .info-wrap { display: flex; flex-direction: column; }
                .name-txt { font-weight: 800; font-size: 14px; color: #f1f5f9; }
                .id-txt { font-size: 10px; color: #475569; font-weight: 700; }

                .badge-modern { padding: 4px 10px; border-radius: 8px; background: rgba(255,255,255,0.05); color: #94a3b8; font-size: 11px; font-weight: 800; border: 1px solid rgba(255,255,255,0.05); }

                .stock-ui { display: flex; align-items: center; gap: 10px; }
                .stock-bit { 
                    width: 28px; height: 28px; border-radius: 8px; background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1); color: white; font-weight: 950; cursor: pointer;
                }
                .stock-val { font-weight: 900; color: white; width: 25px; text-align: center; font-size: 15px; }
                .stock-val.critical { color: #f87171; text-shadow: 0 0 10px rgba(248, 113, 113, 0.4); }
                .sync-btn {
                    padding: 6px 14px; border-radius: 10px; background: #059669; border: none;
                    color: white; font-size: 11px; font-weight: 900; cursor: pointer; transition: 0.2s;
                }
                .sync-btn:hover { background: #10b981; transform: scale(1.05); }

                .btn-icon-admin {
                    width: 34px; height: 34px; border-radius: 10px; display: flex; align-items: center; justify-content: center;
                    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: #94a3b8; cursor: pointer; transition: 0.3s;
                }
                .btn-icon-admin:hover { background: rgba(255,255,255,0.1); color: white; }
                .btn-icon-admin.del:hover { background: rgba(239, 68, 68, 0.1); color: #f87171; border-color: rgba(239, 68, 68, 0.2); }

                .text-right { text-align: right; }
                .state-row { padding: 40px; text-align: center; color: #475569; font-weight: 700; width: 100%; }
            `}</style>
        </div>
    );
}
