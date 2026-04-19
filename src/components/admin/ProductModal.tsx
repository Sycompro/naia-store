'use client';
import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Image as ImageIcon, ChevronDown, Tag, User as UserIcon } from 'lucide-react';
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
        stock: '0'
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
                    stock: editingProduct.stock?.toString() || '0'
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
                    stock: '0'
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
            <div className="modal-container glass-premium animate-fade-in">
                <div className="modal-header">
                    <div className="title-area">
                        <h3>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h3>
                        <p className="subtitle-lite">Personaliza los detalles de tu catálogo</p>
                    </div>
                    <button className="close-btn" onClick={onClose}><X size={18} /></button>
                </div>

                <form onSubmit={handleSubmit} className="product-form">
                    <div className="form-main-compact">
                        <aside className="image-side">
                            <div className="image-management-box">
                                <label className="field-label-min">Imagen del Producto</label>
                                {formData.imageUrl ? (
                                    <div className="preview-main-compact">
                                        <img src={formData.imageUrl} alt="Preview" className="img-fit" />
                                        <button
                                            type="button"
                                            className="remove-img-btn-compact"
                                            onClick={() => setFormData({ ...formData, imageUrl: '' })}
                                        >
                                            <X size={12} />
                                        </button>
                                    </div>
                                ) : (
                                    <label htmlFor="product-file" className="upload-placeholder-compact">
                                        <ImageIcon size={24} strokeWidth={1} />
                                        <span>Subir Imagen</span>
                                    </label>
                                )}
                                <input
                                    type="file"
                                    id="product-file"
                                    className="hidden-file-node"
                                    onChange={handleFileUpload}
                                    accept="image/*"
                                />
                                <label htmlFor="product-file" className="action-btn-lite-compact">
                                    {uploading ? 'Subiendo...' : 'Cambiar Imagen'}
                                </label>
                            </div>
                        </aside>

                        <div className="fields-side">
                            <div className="form-row-compact">
                                <div className="form-group-compact">
                                    <label className="field-label-min">Nombre del Producto</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        placeholder="Nombre del producto"
                                        required
                                    />
                                </div>
                                <div className="form-group-compact">
                                    <label className="field-label-min">Código de Barras</label>
                                    <input
                                        type="text"
                                        value={formData.barcode}
                                        onChange={e => setFormData({ ...formData, barcode: e.target.value })}
                                        placeholder="EAN-13 / UPC"
                                    />
                                </div>
                            </div>

                            <div className="form-row-compact">
                                <div className="form-group-compact">
                                    <div className="label-with-action">
                                        <label className="field-label-min">Categoría</label>
                                        <button
                                            type="button"
                                            className="inline-toggle-btn"
                                            onClick={() => setIsAddingNew(!isAddingNew)}
                                        >
                                            {isAddingNew ? 'Ver Lista' : '+ Nueva'}
                                        </button>
                                    </div>
                                    {isAddingNew ? (
                                        <input
                                            type="text"
                                            value={formData.category}
                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                            placeholder="Nombre de categoría"
                                            autoFocus
                                            className="new-cat-input"
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
                                <div className="form-group-compact">
                                    <label className="field-label-min">Género</label>
                                    <CustomSelect
                                        value={formData.gender}
                                        onChange={val => setFormData({ ...formData, gender: val })}
                                        icon={UserIcon}
                                        options={[
                                            { value: 'FEMALE', label: 'Ella' },
                                            { value: 'MALE', label: 'Él' },
                                            { value: 'UNISEX', label: 'Unisex' }
                                        ]}
                                    />
                                </div>
                            </div>

                            <div className="form-group-compact">
                                <label className="field-label-min">Descripción</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Breve descripción..."
                                />
                            </div>

                            <div className="form-row-compact">
                                <div className="form-group-compact">
                                    <label className="field-label-min">Precio Unitario (S/)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.unitPrice}
                                        onChange={e => setFormData({ ...formData, unitPrice: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group-compact">
                                    <label className="field-label-min">Precio Mayorista (S/)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.wholesalePrice}
                                        onChange={e => setFormData({ ...formData, wholesalePrice: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer-compact">
                        <button type="button" className="cancel-link-compact" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="save-btn-premium-compact" disabled={uploading}>
                            {uploading ? 'Cargando...' : <><Save size={16} /> {editingProduct ? 'Actualizar' : 'Guardar'}</>}
                        </button>
                    </div>
                </form>
            </div>

            <style jsx>{`
                .modal-overlay {
                    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                    background: rgba(0,0,0,0.85); backdrop-filter: blur(12px);
                    display: flex; align-items: center; justify-content: center; z-index: 10000;
                    padding: 16px;
                }
                .modal-container {
                    width: 100%; max-width: 700px; background: #0f172a;
                    border: 1px solid rgba(255,255,255,0.12); border-radius: 24px; padding: 20px;
                    box-shadow: 0 50px 100px -20px rgba(0,0,0,0.7);
                    position: relative;
                }
                .modal-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; padding-bottom: 12px; border-bottom: 1px solid rgba(255,255,255,0.05); }
                .title-area h3 { font-size: 18px; font-weight: 950; color: white; letter-spacing: -0.5px; }
                .subtitle-lite { font-size: 11px; color: #64748b; font-weight: 700; margin-top: 2px; }
                .close-btn { background: rgba(255,255,255,0.05); border: none; color: #94a3b8; width: 28px; height: 28px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.3s; }
                .close-btn:hover { background: white; color: #0f172a; transform: rotate(90deg); }
 
                .form-main-compact { display: flex; gap: 24px; }
                .image-side { width: 180px; flex-shrink: 0; }
                .fields-side { flex: 1; display: flex; flex-direction: column; gap: 14px; }
 
                .field-label-min { font-size: 9px; font-weight: 950; color: #64748b; text-transform: uppercase; letter-spacing: 0.8px; margin-bottom: 6px; display: block; }
                .label-with-action { display: flex; justify-content: space-between; align-items: center; }
                .inline-toggle-btn { background: none; border: none; font-size: 9px; font-weight: 950; color: white; cursor: pointer; opacity: 0.4; transition: 0.2s; text-transform: uppercase; }
                .inline-toggle-btn:hover { opacity: 1; color: white; }
 
                .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                .form-group-modern { display: flex; flex-direction: column; gap: 8px; }
                .form-group-modern.full { grid-column: span 2; }
                .form-group-modern label { font-size: 11px; font-weight: 800; color: var(--slate-500); text-transform: uppercase; letter-spacing: 1px; padding-left: 2px; }
                .form-group-modern input, .form-group-modern textarea { 
                    padding: 12px 16px; border-radius: 12px; border: 1px solid var(--slate-200); 
                    background: var(--bg); color: var(--fg); font-size: 14px; font-weight: 600; outline: none; transition: 0.2s; 
                    width: 100%; height: 48px;
                }
                .form-group-modern textarea { height: auto; min-height: 100px; }
                .form-group-modern input:focus, .form-group-modern textarea:focus { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-light); }
                :global(.men-theme) .form-group-modern input, :global(.men-theme) .form-group-modern textarea { background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.08); }
                :global(.men-theme) .form-group-modern input:focus, :global(.men-theme) .form-group-modern textarea:focus { border-color: white; }
 
                .form-group-compact { display: flex; flex-direction: column; }
                .form-row-compact { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
 
                .form-group-compact input, .form-group-compact select, .form-group-compact textarea {
                    background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08);
                    padding: 8px 12px; border-radius: 10px; color: white; font-weight: 600; outline: none; transition: 0.2s;
                    font-family: inherit; font-size: 12px;
                }
                .new-cat-input { border-color: rgba(255,255,255,0.3) !important; background: rgba(255,255,255,0.05) !important; }
 
                .custom-dropdown { position: relative; width: 100%; }
                .dropdown-trigger {
                    background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08);
                    padding: 8px 12px; border-radius: 10px; color: white; font-weight: 600; cursor: pointer;
                    display: flex; justify-content: space-between; align-items: center; font-size: 12px;
                    transition: 0.2s;
                }
                .dropdown-trigger:hover, .dropdown-trigger.active { border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.05); }
                .chevron { transition: 0.3s; opacity: 0.6; }
                .chevron.rotate { transform: rotate(180deg); opacity: 1; }
 
                .dropdown-menu {
                    position: absolute; top: calc(100% + 6px); left: 0; width: 100%;
                    background: #1e293b; border: 1px solid rgba(255,255,255,0.12);
                    border-radius: 12px; overflow: hidden; z-index: 100;
                    box-shadow: 0 20px 40px rgba(0,0,0,0.4); backdrop-filter: blur(16px);
                    max-height: 200px; overflow-y: auto;
                    scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.2) transparent;
                }
                .dropdown-menu::-webkit-scrollbar { width: 4px; }
                .dropdown-menu::-webkit-scrollbar-track { background: transparent; }
                .dropdown-menu::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 10px; }
                .dropdown-menu::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.25); }
                .dropdown-item {
                    padding: 10px 14px; font-size: 12px; font-weight: 700; color: #94a3b8;
                    cursor: pointer; transition: 0.2s;
                }
                .dropdown-item:hover { background: rgba(255,255,255,0.06); color: white; }
                .dropdown-item.selected { background: white; color: #0f172a; }
 
                .animate-slide-down { animation: slideDown 0.3s cubic-bezier(0.1, 0.7, 0.1, 1); }
                @keyframes slideDown { from { opacity: 0; transform: translateY(-4px); } to { opacity: 1; transform: translateY(0); } }
 
                .form-group-compact input:focus, .form-group-compact select:focus, .form-group-compact textarea:focus { border-color: rgba(255,255,255,0.3); background: rgba(255,255,255,0.05); }
                .form-group-compact textarea { height: 60px; resize: none; }
 
                /* Hide native number spinners */
                input[type=number]::-webkit-inner-spin-button, 
                input[type=number]::-webkit-outer-spin-button { 
                  -webkit-appearance: none; 
                  margin: 0; 
                }
                input[type=number] { -moz-appearance: textfield; }
 
                /* Hide native file node */
                .hidden-file-node { display: none; }
 
                /* Image Compact */
                .image-management-box { display: flex; flex-direction: column; gap: 10px; }
                .preview-main-compact {
                    position: relative; width: 100%; height: 180px; border-radius: 16px; 
                    overflow: hidden; border: 1px solid rgba(255,255,255,0.1); background: #000;
                }
                .preview-main-compact img { width: 100%; height: 100%; object-fit: cover; }
                
                .remove-img-btn-compact {
                    position: absolute; top: 8px; right: 8px; width: 22px; height: 22px;
                    border-radius: 50%; background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);
                    border: none; color: white; cursor: pointer;
                    display: flex; align-items: center; justify-content: center; transition: 0.2s;
                }
 
                .upload-placeholder-compact {
                    width: 100%; height: 180px; border-radius: 16px; 
                    background: rgba(255,255,255,0.02); border: 2px dashed rgba(255,255,255,0.08);
                    display: flex; flex-direction: column; align-items: center; justify-content: center;
                    gap: 8px; color: #475569; cursor: pointer; transition: 0.3s;
                }
                .upload-placeholder-compact:hover { border-color: rgba(255,255,255,0.2); color: white; }
                .upload-placeholder-compact span { font-weight: 800; font-size: 11px; }
 
                .action-btn-lite-compact {
                    text-align: center; background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.08); padding: 8px; border-radius: 10px;
                    color: white; font-size: 10px; font-weight: 950; cursor: pointer; transition: 0.2s;
                    text-transform: uppercase;
                }
                .action-btn-lite-compact:hover { background: white; color: #0f172a; }
 
                .modal-footer-compact { margin-top: 20px; display: flex; justify-content: flex-end; align-items: center; gap: 20px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.05); }
                .cancel-link-compact { background: none; border: none; color: #64748b; font-weight: 800; cursor: pointer; font-size: 12px; }
                .save-btn-premium-compact { background: white; color: #0f172a; border: none; padding: 10px 24px; border-radius: 12px; font-weight: 950; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: 0.3s; font-size: 13px; }
                .save-btn-premium-compact:hover { transform: translateY(-2px); box-shadow: 0 10px 30px rgba(255,255,255,0.1); }
 
                .animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.1, 0.7, 0.1, 1); }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
 
                @media (max-width: 600px) {
                    .form-main-compact { flex-direction: column; }
                    .image-side { width: 100%; }
                    .modal-container { height: 100vh; max-height: none; border-radius: 0; overflow-y: auto; }
                }
            `}</style>
        </div>
    );
}
