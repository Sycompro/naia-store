'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, Search, Filter, X } from 'lucide-react';

export default function AdminProductos() {
    const [products, setProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingProduct, setEditingProduct] = useState<any>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        unitPrice: '',
        wholesalePrice: '',
        presentation: 'Unidad',
        category: 'Facial',
        gender: 'FEMALE',
        imageUrl: ''
    });

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        const res = await fetch('/api/products');
        const data = await res.json();
        setProducts(data);
        setLoading(false);
    };

    const handleOpenModal = (product: any = null) => {
        if (product) {
            setEditingProduct(product);
            setFormData({
                name: product.name,
                unitPrice: product.unitPrice.toString(),
                wholesalePrice: product.wholesalePrice.toString(),
                presentation: product.presentation,
                category: product.category,
                gender: product.gender,
                imageUrl: product.imageUrl
            });
        } else {
            setEditingProduct(null);
            setFormData({
                name: '',
                unitPrice: '',
                wholesalePrice: '',
                presentation: 'Unidad',
                category: 'Facial',
                gender: 'FEMALE',
                imageUrl: ''
            });
        }
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = editingProduct ? 'PUT' : 'POST';
        const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            setShowModal(false);
            fetchProducts();
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('¿Estás seguro de eliminar este producto?')) {
            await fetch(`/api/products/${id}`, { method: 'DELETE' });
            fetchProducts();
        }
    };

    return (
        <div className="product-admin">
            <div className="admin-toolbar glass">
                <div className="search-bar">
                    <Search size={18} />
                    <input type="text" placeholder="Buscar productos..." />
                </div>
                <div className="toolbar-actions">
                    <button className="btn btn-outline"><Filter size={18} /> Filtrar</button>
                    <button className="btn btn-primary" onClick={() => handleOpenModal()}>
                        <Plus size={18} /> Nuevo Producto
                    </button>
                </div>
            </div>

            <div className="product-table-container glass">
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Imagen</th>
                            <th>Nombre</th>
                            <th>Categoría</th>
                            <th>Género</th>
                            <th>Precio Unit.</th>
                            <th>Precio May.</th>
                            <th>Presentación</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={8} align="center">Cargando productos...</td></tr>
                        ) : products.map((product) => (
                            <tr key={product.id}>
                                <td>
                                    <div className="table-img" style={{ backgroundImage: `url(${product.imageUrl})` }}></div>
                                </td>
                                <td>
                                    <div className="table-name">
                                        <strong>{product.name}</strong>
                                        <span>ID: {product.id}</span>
                                    </div>
                                </td>
                                <td><span className="badge-tag">{product.category}</span></td>
                                <td>{product.gender === 'FEMALE' ? 'Ella' : 'Él'}</td>
                                <td>${product.unitPrice.toFixed(2)}</td>
                                <td>${product.wholesalePrice.toFixed(2)}</td>
                                <td>{product.presentation}</td>
                                <td>
                                    <div className="table-actions">
                                        <button className="action-icon edit" onClick={() => handleOpenModal(product)}><Edit size={16} /></button>
                                        <button className="action-icon delete" onClick={() => handleDelete(product.id)}><Trash2 size={16} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content glass animate-fade">
                        <div className="modal-header">
                            <h3>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h3>
                            <button onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="admin-form">
                            <div className="form-group">
                                <label>Nombre del Producto</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Precio Unitario</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={formData.unitPrice}
                                        onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Precio Mayorista</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        required
                                        value={formData.wholesalePrice}
                                        onChange={(e) => setFormData({ ...formData, wholesalePrice: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Categoría</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="Facial">Facial</option>
                                        <option value="Capilar">Capilar</option>
                                        <option value="Sets">Sets</option>
                                        <option value="Accesorios">Accesorios</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Género</label>
                                    <select
                                        value={formData.gender}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                    >
                                        <option value="FEMALE">Ella</option>
                                        <option value="MALE">Él</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>Presentación (Ej: Unidad 30ml, Caja, Litro)</label>
                                <input
                                    type="text"
                                    value={formData.presentation}
                                    onChange={(e) => setFormData({ ...formData, presentation: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>URL de Imagen</label>
                                <input
                                    type="text"
                                    placeholder="https://..."
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                />
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancelar</button>
                                <button type="submit" className="btn btn-primary">{editingProduct ? 'Guardar Cambios' : 'Crear Producto'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style jsx>{`
        .product-admin { display: flex; flex-direction: column; gap: 24px; }
        .admin-toolbar { padding: 16px; border-radius: 16px; display: flex; justify-content: space-between; align-items: center; }
        .search-bar { display: flex; align-items: center; gap: 10px; background: #fff; padding: 8px 16px; border-radius: 10px; width: 300px; border: 1px solid #eee; }
        .search-bar input { border: none; outline: none; width: 100%; font-size: 14px; }
        .toolbar-actions { display: flex; gap: 12px; }
        .product-table-container { border-radius: 16px; overflow-x: auto; background: white; }
        .admin-table { width: 100%; border-collapse: collapse; font-size: 14px; min-width: 800px; }
        .admin-table th { text-align: left; padding: 16px; background: rgba(0,0,0,0.02); color: #666; font-weight: 600; border-bottom: 1px solid #eee; }
        .admin-table td { padding: 16px; border-bottom: 1px solid #eee; }
        .table-img { width: 48px; height: 48px; border-radius: 8px; background-size: cover; background-position: center; }
        .table-name { display: flex; flex-direction: column; }
        .table-name span { font-size: 10px; color: #888; }
        .badge-tag { background: var(--secondary); color: var(--primary-dark); padding: 4px 10px; border-radius: 30px; font-size: 11px; font-weight: 700; }
        .table-actions { display: flex; gap: 8px; }
        .action-icon { width: 32px; height: 32px; border-radius: 8px; border: 1px solid #eee; background: white; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.3s; }
        .action-icon.edit:hover { background: #EBF5FF; color: #007bff; }
        .action-icon.delete:hover { background: #FFF5F5; color: #ff4d4d; }
        
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
        .modal-content { width: 100%; max-width: 500px; padding: 30px; border-radius: 24px; background: white; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .modal-header h3 { font-size: 20px; font-weight: 700; color: #333; }
        .modal-header button { background: none; border: none; cursor: pointer; color: #888; }
        
        .admin-form { display: flex; flex-direction: column; gap: 16px; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group label { font-size: 13px; font-weight: 600; color: #555; }
        .form-group input, .form-group select { padding: 10px 14px; border-radius: 10px; border: 1px solid #ddd; outline: none; transition: border 0.3s; }
        .form-group input:focus { border-color: var(--primary); }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
        .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 10px; }
      `}</style>
        </div>
    );
}
