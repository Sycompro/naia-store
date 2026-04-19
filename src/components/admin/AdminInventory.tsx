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

    const filteredProducts = products;

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
                            <div className="col-idx">#</div>
                            <div className="col-ref">Ref</div>
                            <div className="col-name">Nombre</div>
                            <div className="col-barcode">Código</div>
                            <div className="col-id">ID</div>
                            <div className="col-cat">Categoría</div>
                            <div className="col-price text-right">Precio</div>
                            <div className="col-stock text-center">Stock</div>
                            <div className="col-actions text-right">Acciones</div>
                        </div>
                        <div className="table-list">
                            {loading ? (
                                <div className="state-row">Cargando catálogo...</div>
                            ) : filteredProducts.length === 0 ? (
                                <div className="state-row">Sin resultados para la búsqueda</div>
                            ) : (
                                filteredProducts.map((p, idx) => (
                                    <div key={p.id} className="row-item-admin">
                                        <div className="col-idx">
                                            <span className="idx-txt">{idx + 1}</span>
                                        </div>
                                        <div className="col-ref">
                                            <div className="thumb-wrap shadow-premium">
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
                                            <span className="badge-modern">{p.category || 'NA'}</span>
                                        </div>
                                        <div className="col-price text-right font-black text-white">S/ {Number(p.unitPrice || 0).toFixed(2)}</div>
                                        <div className="col-stock text-center">
                                            <div className="stock-ui-compact">
                                                <button onClick={() => onAdjustStock(p.id, -1)} className="stock-btn-min">-</button>
                                                <span className={`stock-val-min ${p.stock <= 5 ? 'critical' : ''}`}>{p.stock}</span>
                                                <button onClick={() => onAdjustStock(p.id, 1)} className="stock-btn-min">+</button>
                                                <button className="sync-btn-lite" onClick={() => onUpdateStock(p.id)}>Sincronizar</button>
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
                .inventory-table-new { min-width: 1000px; }
                
                .table-head {
                    display: grid; grid-template-columns: 24px 45px 1.5fr 110px 60px 1.2fr 80px 2fr 100px; gap: 24px;
                    padding: 12px 20px; border-bottom: 2px solid rgba(255,255,255,0.05);
                    font-size: 11px; font-weight: 950; color: #475569; text-transform: uppercase; letter-spacing: 0.18em;
                    align-items: center;
                }
                
                .row-item-admin {
                    display: grid; grid-template-columns: 24px 45px 1.5fr 110px 60px 1.2fr 80px 2fr 100px; gap: 24px;
                    padding: 10px 20px; border-bottom: 1px solid rgba(255,255,255,0.03);
                    align-items: center; transition: 0.2s;
                }
                .row-item-admin:hover { background: rgba(255,255,255,0.02); }

                .thumb-wrap { width: 34px; height: 34px; border-radius: 8px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); }
                .thumb-wrap img { width: 100%; height: 100%; object-fit: cover; }
                .idx-txt { font-size: 11px; color: #475569; font-weight: 900; font-family: monospace; }
                .barcode-txt { font-size: 11px; color: #94a3b8; font-weight: 800; font-family: monospace; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
                .name-txt { font-weight: 850; font-size: 14px; color: #f1f5f9; letter-spacing: -0.2px; line-height: 1.2; }
                .id-txt { font-size: 12px; color: #64748b; font-weight: 950; font-family: monospace; letter-spacing: 0.5px; }

                .badge-modern { padding: 4px 10px; border-radius: 8px; background: rgba(255,255,255,0.05); color: #94a3b8; font-size: 11px; font-weight: 850; border: 1px solid rgba(255,255,255,0.05); }

                .stock-ui-compact { display: flex; align-items: center; justify-content: center; gap: 6px; }
                .stock-btn-min { 
                    width: 20px; height: 20px; border-radius: 5px; background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.1); color: white; font-weight: 950; cursor: pointer;
                    display: flex; align-items: center; justify-content: center; font-size: 11px; transition: 0.2s;
                }
                .stock-btn-min:hover { background: white; color: #0f172a; }
                .stock-val-min { font-weight: 950; color: white; width: 18px; text-align: center; font-size: 12px; }
                .stock-val-min.critical { color: #f87171; text-shadow: 0 0 10px rgba(248, 113, 113, 0.3); }
                .sync-btn-lite {
                    padding: 3px 8px; border-radius: 6px; background: #059669; border: none;
                    color: white; font-size: 9px; font-weight: 950; cursor: pointer; transition: 0.2s;
                    text-transform: uppercase; margin-left: 4px;
                }
                .sync-btn-lite:hover { background: #10b981; transform: scale(1.05); }

                .btn-icon-admin {
                    width: 34px; height: 34px; border-radius: 10px; display: flex; align-items: center; justify-content: center;
                    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); color: #94a3b8; cursor: pointer; transition: 0.3s;
                }
                .btn-icon-admin:hover { background: rgba(255,255,255,0.1); color: white; }
                .btn-icon-admin.del:hover { background: rgba(239, 68, 68, 0.1); color: #f87171; border-color: rgba(239, 68, 68, 0.2); }

                .col-actions {
                    display: flex !important;
                    flex-direction: row !important;
                    justify-content: flex-end !important;
                    align-items: center !important;
                    gap: 8px !important;
                    flex-wrap: nowrap !important;
                }
                .text-right { text-align: right; }
                .state-row { padding: 40px; text-align: center; color: #475569; font-weight: 700; width: 100%; }
            `}</style>
        </div>
    );
}
