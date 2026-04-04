'use client';
import React, { useState, useEffect } from 'react';
import { X, Save, Image as ImageIcon } from 'lucide-react';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (product: any) => void;
    editingProduct?: any;
}

export default function ProductModal({ isOpen, onClose, onSave, editingProduct }: ProductModalProps) {
    const [formData, setFormData] = useState({
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

    useEffect(() => {
        if (editingProduct) {
            setFormData({
                name: editingProduct.name || '',
                description: editingProduct.description || '',
                unitPrice: editingProduct.unitPrice?.toString() || editingProduct.price?.toString() || '',
                wholesalePrice: editingProduct.wholesalePrice?.toString() || '',
                presentation: editingProduct.presentation || 'Unidad',
                category: editingProduct.category || 'General',
                gender: editingProduct.gender || 'FEMALE',
                imageUrl: editingProduct.imageUrl || editingProduct.image || '',
                stock: editingProduct.stock?.toString() || '0'
            });
        } else {
            setFormData({
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
    }, [editingProduct, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container glass-premium animate-fade-in">
                <div className="modal-header">
                    <h3>{editingProduct ? 'Editar Producto' : 'Nuevo Producto'}</h3>
                    <button className="close-btn" onClick={onClose}><X size={20} /></button>
                </div>

                <form onSubmit={handleSubmit} className="product-form">
                    <div className="form-main">
                        <div className="form-column">
                            <div className="form-group">
                                <label>Nombre del Producto</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="Ej: Labial Matte Pro"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Descripción</label>
                                <textarea
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Detalles del producto..."
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Precio Unitario (S/)</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={formData.unitPrice}
                                        onChange={e => setFormData({ ...formData, unitPrice: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Precio Mayorista (S/)</label>
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

                        <div className="form-column">
                            <div className="form-group">
                                <label>URL de Imagen</label>
                                <input
                                    type="text"
                                    value={formData.imageUrl}
                                    onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                                    placeholder="https://..."
                                />
                                {formData.imageUrl ? (
                                    <div className="preview-container">
                                        <img src={formData.imageUrl} alt="Preview" />
                                    </div>
                                ) : (
                                    <div className="preview-placeholder">
                                        <ImageIcon size={32} />
                                        <span>Sin imagen</span>
                                    </div>
                                )}
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Categoría</label>
                                    <select
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        <option value="General">General</option>
                                        <option value="Labios">Labios</option>
                                        <option value="Rostro">Rostro</option>
                                        <option value="Ojos">Ojos</option>
                                        <option value="Kits">Kits</option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Género</label>
                                    <select
                                        value={formData.gender}
                                        onChange={e => setFormData({ ...formData, gender: e.target.value })}
                                    >
                                        <option value="FEMALE">Ella</option>
                                        <option value="MALE">Él</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="cancel-link" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="save-full-btn">
                            <Save size={18} /> {editingProduct ? 'Actualizar' : 'Guardar Producto'}
                        </button>
                    </div>
                </form>
            </div>

            <style jsx>{`
                .modal-overlay {
                    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
                    background: rgba(0,0,0,0.7); backdrop-filter: blur(8px);
                    display: flex; align-items: center; justify-content: center; z-index: 1000;
                    padding: 20px;
                }
                .modal-container {
                    width: 100%; max-width: 800px; background: rgba(15, 23, 42, 0.95);
                    border: 1px solid rgba(255,255,255,0.1); border-radius: 28px; padding: 32px;
                    box-shadow: 0 40px 100px rgba(0,0,0,0.5);
                }
                .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
                .modal-header h3 { font-size: 22px; font-weight: 900; color: white; letter-spacing: -0.5px; }
                .close-btn { background: rgba(255,255,255,0.05); border: none; color: #94a3b8; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.3s; }
                .close-btn:hover { background: rgba(255,255,255,0.2); color: white; }

                .form-main { display: grid; grid-template-columns: 1.2fr 1fr; gap: 32px; }
                .form-column { display: flex; flex-direction: column; gap: 20px; }
                .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }

                .form-group { display: flex; flex-direction: column; gap: 8px; }
                .form-group label { font-size: 11px; font-weight: 900; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
                .form-group input, .form-group select, .form-group textarea {
                    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1);
                    padding: 12px 16px; border-radius: 14px; color: white; font-weight: 600; outline: none; transition: 0.3s;
                    font-family: inherit;
                }
                .form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: white; background: rgba(255,255,255,0.08); }
                .form-group textarea { height: 100px; resize: none; }

                .preview-container { margin-top: 12px; width: 100%; aspect-ratio: 16/9; border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); }
                .preview-container img { width: 100%; height: 100%; object-fit: cover; }
                .preview-placeholder { margin-top: 12px; width: 100%; aspect-ratio: 16/9; border-radius: 16px; border: 2px dashed rgba(255,255,255,0.1); display: flex; flex-direction: column; align-items: center; justify-content: center; color: #475569; gap: 8px; }

                .modal-footer { margin-top: 32px; display: flex; justify-content: flex-end; align-items: center; gap: 24px; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 24px; }
                .cancel-link { background: none; border: none; color: #94a3b8; font-weight: 700; cursor: pointer; font-size: 14px; }
                .cancel-link:hover { color: white; }
                .save-full-btn { background: white; color: #0f172a; border: none; padding: 14px 32px; border-radius: 16px; font-weight: 900; display: flex; align-items: center; gap: 10px; cursor: pointer; transition: 0.3s; }
                .save-full-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(255,255,255,0.1); }

                .animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.1, 0.7, 0.1, 1); }
                @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }

                @media (max-width: 768px) {
                    .form-main { grid-template-columns: 1fr; }
                    .modal-container { padding: 20px; }
                }
            `}</style>
        </div>
    );
}
