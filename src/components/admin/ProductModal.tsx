'use client';
import React, { useState, useEffect } from 'react';
import { X, Save, Image as ImageIcon, Tag, User as UserIcon } from 'lucide-react';
import CustomSelect from '@/components/CustomSelect';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (product: any) => void;
    editingProduct?: any;
}

export default function ProductModal({ isOpen, onClose, onSave, editingProduct }: ProductModalProps) {
    const [formData, setFormData] = useState({
        barcode: '',
        name: '',
        description: '',
        unitPrice: '',
        wholesalePrice: '',
        presentation: 'Unidad',
        category: 'General',
        gender: 'FEMALE',
        imageUrl: '',
        stock: '0',
        minStock: '5'
    });
    const [uploading, setUploading] = useState(false);
    const [categories, setCategories] = useState<string[]>(['General', 'Labios', 'Rostro', 'Ojos', 'Kits']);
    const [isAddingNew, setIsAddingNew] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/admin/categories');
                if (res.ok) {
                    const data = await res.json();
                    const names = data.map((c: any) => c.category);
                    const unique = Array.from(new Set(['General', 'Labios', 'Rostro', 'Ojos', 'Kits', ...names]));
                    setCategories(unique);
                }
            } catch (e) { console.error('Error fetching categories:', e); }
        };

        if (isOpen) {
            fetchCategories();
            setIsAddingNew(false);
            if (editingProduct) {
                setFormData({
                    barcode: editingProduct.barcode || '',
                    name: editingProduct.name || '',
                    description: editingProduct.description || '',
                    unitPrice: editingProduct.unitPrice?.toString() || '',
                    wholesalePrice: editingProduct.wholesalePrice?.toString() || '',
                    presentation: editingProduct.presentation || 'Unidad',
                    category: editingProduct.category || 'General',
                    gender: editingProduct.gender || 'FEMALE',
                    imageUrl: editingProduct.imageUrl || '',
                    stock: editingProduct.stock?.toString() || '0',
                    minStock: editingProduct.minStock?.toString() || '5'
                });
            } else {
                setFormData({
                    barcode: '',
                    name: '',
                    description: '',
                    unitPrice: '',
                    wholesalePrice: '',
                    presentation: 'Unidad',
                    category: 'General',
                    gender: 'FEMALE',
                    imageUrl: '',
                    stock: '0',
                    minStock: '5'
                });
            }
        }
    }, [editingProduct, isOpen]);

    if (!isOpen) return null;

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const data = new FormData();
        data.set('file', file);

        try {
            const res = await fetch('/api/admin/upload', {
                method: 'POST',
                body: data
            });
            const result = await res.json();
            if (result.url) {
                setFormData({ ...formData, imageUrl: result.url });
            }
        } catch (error) {
            console.error('Upload error:', error);
            alert('Error al subir el archivo');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container animate-fade-in">
                <div className="modal-header">
                    <div className="title-area">
                        <h3>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h3>
                        <p className="subtitle-lite">Completa la información del producto para el catálogo</p>
                    </div>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="product-form">
                    <div className="form-main-layout">
                        <aside className="image-side">
                            <label className="field-label-premium">Imagen del Producto</label>
                            <div className="image-management-box">
                                {formData.imageUrl ? (
                                    <div className="preview-main">
                                        <img src={formData.imageUrl} alt="Preview" className="img-fit" />
                                        <button
                                            type="button"
                                            className="remove-img-btn"
                                            onClick={() => setFormData({ ...formData, imageUrl: '' })}
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ) : (
                                    <label htmlFor="product-file" className="upload-placeholder">
                                        <div className="icon-circle"><ImageIcon size={28} /></div>
                                        <span>Subir Imagen</span>
                                        <p>JPG, PNG, WebP</p>
                                    </label>
                                )}
                                <input
                                    type="file"
                                    id="product-file"
                                    className="hidden-file-node"
                                    onChange={handleFileUpload}
                                    accept="image/*"
                                />
                                {formData.imageUrl && (
                                    <label htmlFor="product-file" className="change-img-btn">
                                        {uploading ? 'Cargando...' : 'Cambiar Imagen'}
                                    </label>
                                )}
                            </div>
                        </aside>

                        <div className="fields-side">
                            <div className="form-grid-2">
                                <div className="form-group-premium">
                                    <label className="field-label-premium">Nombre del Producto</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Ej: Labial Matte Intenso"
                                        required
                                    />
                                </div>
                                <div className="form-group-premium">
                                    <label className="field-label-premium">Código de Barras</label>
                                    <input
                                        type="text"
                                        value={formData.barcode}
                                        onChange={e => setFormData({ ...formData, barcode: e.target.value })}
                                        placeholder="Código EAN o SKU"
                                    />
                                </div>
                            </div>

                            <div className="form-grid-2">
                                <div className="form-group-premium">
                                    <div className="label-with-action">
                                        <label className="field-label-premium">Categoría</label>
                                        <button
                                            type="button"
                                            className="inline-toggle-btn"
                                            onClick={() => setIsAddingNew(!isAddingNew)}
                                        >
                                            {isAddingNew ? 'Seleccionar' : '+ Nueva'}
                                        </button>
                                    </div>
                                    {isAddingNew ? (
                                        <input
                                            type="text"
                                            value={formData.category} // Reuse category for adding new
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                            placeholder="Nombre de la categoría"
                                            autoFocus
                                        />
                                    ) : (
                                        <CustomSelect
                                            value={formData.category}
                                            onChange={val => setFormData({ ...formData, category: val })}
                                            icon={Tag}
                                            options={categories.map(cat => ({ value: cat, label: cat }))}
                                        />
                                    )}
                                </div>
                                <div className="form-group-premium">
                                    <label className="field-label-premium">Género / Segmento</label>
                                    <CustomSelect
                                        value={formData.gender}
                                        onChange={val => setFormData({ ...formData, gender: val })}
                                        icon={UserIcon}
                                        options={[
                                            { value: 'FEMALE', label: 'Damas' },
                                            { value: 'MALE', label: 'Caballeros' },
                                            { value: 'UNISEX', label: 'Unisex' }
                                        ]}
                                    />
                                </div>
                            </div>

                            <div className="form-group-premium">
                                <label className="field-label-premium">Descripción Detallada</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Describe los beneficios y características del producto..."
                                />
                            </div>

                            <div className="form-grid-3">
                                <div className="form-group-premium">
                                    <label className="field-label-premium">Precio Venta (S/)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.unitPrice}
                                        onChange={e => setFormData({ ...formData, unitPrice: e.target.value })}
                                        className="price-input"
                                        required
                                    />
                                </div>
                                <div className="form-group-premium">
                                    <label className="field-label-premium">Precio Mayorista (S/)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.wholesalePrice}
                                        onChange={e => setFormData({ ...formData, wholesalePrice: e.target.value })}
                                        className="price-input"
                                        required
                                    />
                                </div>
                                <div className="form-group-premium">
                                    <label className="field-label-premium">Stock Inicial</label>
                                    <input
                                        type="number"
                                        value={formData.stock}
                                        onChange={e => setFormData({ ...formData, stock: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer-premium">
                        <button type="button" className="cancel-btn" onClick={onClose}>Cancelar</button>
                        <div className="footer-actions">
                            <button type="submit" className="save-btn-premium" disabled={uploading}>
                                <Save size={18} /> {uploading ? 'Guardando...' : editingProduct ? 'Actualizar Producto' : 'Crear Producto'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            <style jsx>{`
                .modal-overlay {
                    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                    background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(12px);
                    display: flex; align-items: center; justify-content: center; z-index: 10000;
                    padding: 20px;
                }
                .modal-container {
                    width: 100%; max-width: 900px; background: #fff;
                    border: 1px solid #f1f5f9; border-radius: 32px; padding: 40px;
                    box-shadow: 0 40px 80px -20px rgba(0,0,0,0.15);
                    position: relative;
                }
                .modal-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 35px; }
                .title-area h3 { font-size: 24px; font-weight: 950; color: #1e293b; letter-spacing: -0.8px; margin: 0; }
                .subtitle-lite { font-size: 14px; color: #64748b; font-weight: 600; margin-top: 4px; }
                
                .close-btn { 
                    background: #f8fafc; border: 1px solid #f1f5f9; color: #64748b; width: 44px; height: 44px; 
                    border-radius: 14px; cursor: pointer; display: flex; align-items: center; justify-content: center; 
                    transition: 0.3s; 
                }
                .close-btn:hover { background: #fee2e2; color: #ef4444; border-color: #fecaca; transform: rotate(90deg); }

                .form-main-layout { display: flex; gap: 40px; }
                .image-side { width: 260px; flex-shrink: 0; }
                .fields-side { flex: 1; display: flex; flex-direction: column; gap: 20px; }

                .field-label-premium { font-size: 11px; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px; display: block; padding-left: 2px; }
                .label-with-action { display: flex; justify-content: space-between; align-items: center; }
                .inline-toggle-btn { background: #fdf2f8; border: 1px solid #fce7f3; font-size: 10px; font-weight: 900; color: #ec4899; padding: 2px 10px; border-radius: 100px; cursor: pointer; transition: 0.2s; }
                .inline-toggle-btn:hover { background: #ec4899; color: #fff; }

                .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                .form-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 20px; }

                .form-group-premium input, .form-group-premium textarea {
                    width: 100%; padding: 14px 18px; border-radius: 16px; border: 1px solid #e2e8f0;
                    background: #f8fafc; color: #1e293b; font-size: 14px; font-weight: 800; outline: none; transition: 0.3s;
                }
                .form-group-premium input:focus, .form-group-premium textarea:focus { border-color: #ec4899; background: #fff; box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.05); }
                .form-group-premium textarea { height: 120px; resize: none; }

                .image-management-box { margin-top: 10px; }
                .preview-main {
                    position: relative; width: 100%; height: 260px; border-radius: 20px; 
                    overflow: hidden; border: 1px solid #f1f5f9; background: #fff;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.05);
                }
                .preview-main img { width: 100%; height: 100%; object-fit: cover; }
                .remove-img-btn { position: absolute; top: 12px; right: 12px; width: 32px; height: 32px; border-radius: 50%; background: rgba(255,255,255,0.9); border: none; color: #ef4444; cursor: pointer; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 10px rgba(0,0,0,0.1); }
                
                .upload-placeholder {
                    width: 100%; height: 260px; border-radius: 20px; background: #f8fafc; border: 2px dashed #e2e8f0;
                    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 12px;
                    color: #94a3b8; cursor: pointer; transition: 0.3s;
                }
                .upload-placeholder:hover { border-color: #ec4899; background: #fdf2f8; color: #ec4899; }
                .icon-circle { width: 64px; height: 64px; border-radius: 20px; background: #fff; display: flex; align-items: center; justify-content: center; color: #cbd5e1; box-shadow: 0 4px 12px rgba(0,0,0,0.02); }
                .upload-placeholder span { font-size: 14px; font-weight: 800; }
                .upload-placeholder p { font-size: 11px; font-weight: 700; margin: 0; }

                .change-img-btn { margin-top: 15px; display: block; text-align: center; background: #1e293b; color: #fff; padding: 12px; border-radius: 14px; font-size: 12px; font-weight: 800; cursor: pointer; transition: 0.3s; }
                .change-img-btn:hover { background: #0f172a; transform: translateY(-2px); }

                .modal-footer-premium { margin-top: 40px; display: flex; justify-content: space-between; align-items: center; padding-top: 25px; border-top: 1px solid #f1f5f9; }
                .cancel-btn { background: none; border: none; color: #94a3b8; font-weight: 800; cursor: pointer; font-size: 14px; }
                .cancel-btn:hover { color: #1e293b; }
                .save-btn-premium { background: #ec4899; color: #fff; border: none; padding: 15px 35px; border-radius: 16px; font-weight: 900; display: flex; align-items: center; gap: 10px; cursor: pointer; transition: 0.3s; box-shadow: 0 15px 30px rgba(236, 72, 153, 0.25); }
                .save-btn-premium:hover { transform: translateY(-3px); box-shadow: 0 20px 40px rgba(236, 72, 153, 0.3); }

                @keyframes fadeIn { from { opacity: 0; transform: scale(0.95) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
                .animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.1, 0.7, 0.1, 1); }

                @media (max-width: 850px) {
                    .form-main-layout { flex-direction: column; }
                    .image-side { width: 100%; }
                    .modal-container { padding: 25px; border-radius: 0; height: 100vh; max-height: none; overflow-y: auto; }
                }

                input[type=number]::-webkit-inner-spin-button, 
                input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
                .hidden-file-node { display: none; }
            `}</style>
        </div>
    );
}
