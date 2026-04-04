'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Image as ImageIcon, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function AdminHistorias() {
    const [stories, setStories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const router = useRouter();

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        imageUrl: '',
        gender: 'FEMALE',
    });
    const [editingStory, setEditingStory] = useState<any>(null);

    useEffect(() => {
        fetchStories();
    }, []);

    useEffect(() => {
        if (editingStory) {
            setFormData({
                title: editingStory.title.replace('[MALE] ', ''),
                imageUrl: editingStory.imageUrl,
                gender: editingStory.gender
            });
        } else {
            setFormData({ title: '', imageUrl: '', gender: 'FEMALE' });
        }
    }, [editingStory]);

    const fetchStories = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/stories');
            const data = await res.json();
            setStories(data);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = editingStory ? 'PATCH' : 'POST';
        const url = editingStory ? `/api/stories/${editingStory.id}` : '/api/stories';

        // Ensure manual gender logic if needed for title (legacy support)
        let finalTitle = formData.title;
        if (formData.gender === 'MALE' && !finalTitle.includes('[MALE]')) {
            finalTitle = `[MALE] ${finalTitle}`;
        }

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...formData, title: finalTitle }),
        });

        if (res.ok) {
            setShowModal(false);
            setEditingStory(null);
            fetchStories();
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('¿Eliminar esta historia?')) {
            await fetch(`/api/stories/${id}`, { method: 'DELETE' });
            fetchStories();
        }
    };

    const openEditModal = (story: any) => {
        setEditingStory(story);
        setShowModal(true);
    };

    const openAddModal = () => {
        setEditingStory(null);
        setShowModal(true);
    };

    return (
        <div className="stories-admin">
            <div className="admin-toolbar glass-premium">
                <div className="toolbar-info">
                    <p>Muestra ofertas y novedades en el carrusel superior de la tienda.</p>
                </div>
                <button className="add-history-btn" onClick={openAddModal}>
                    <Plus size={18} /> Nueva Historia
                </button>
            </div>

            <div className="stories-grid">
                {loading ? (
                    <div className="loading-grid">Cargando historias...</div>
                ) : stories.length === 0 ? (
                    <div className="empty-state glass-premium">
                        <ImageIcon size={48} />
                        <p>No hay historias publicadas aún.</p>
                    </div>
                ) : stories.map((story) => (
                    <div key={story.id} className="story-card-premium transition-all">
                        <div className="story-preview-container">
                            <div className="story-preview-img" style={{ backgroundImage: `url(${story.imageUrl})` }}></div>
                            <div className="story-overlay">
                                <div className="overlay-top">
                                    <button className="icon-btn-s edit" onClick={() => openEditModal(story)}><Plus size={16} style={{ transform: 'rotate(45deg)' }} /></button>
                                </div>
                                <div className="overlay-bottom">
                                    <div className="gender-tag">{story.gender === 'MALE' ? 'Él' : 'Ella'}</div>
                                    <button className="icon-btn-s delete" onClick={() => handleDelete(story.id)}><Trash2 size={16} /></button>
                                </div>
                            </div>
                        </div>
                        <div className="story-item-info">
                            <strong>{story.title.replace('[MALE] ', '')}</strong>
                            <span className="date">{new Date(story.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content glass-premium animate-fade-in">
                        <div className="modal-header">
                            <div>
                                <h3>{editingStory ? 'Editar Historia' : 'Nueva Historia'}</h3>
                                <p>Publica una nueva novedad en el carrusel</p>
                            </div>
                            <button className="close-modal" onClick={() => { setShowModal(false); setEditingStory(null); }}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="admin-form">
                            <div className="form-group">
                                <label>Título / Categoría</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ej: Ofertas, Nuevo Serum, Kit Verano"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Género / Tema</label>
                                    <select
                                        value={formData.gender}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                    >
                                        <option value="FEMALE">Ella (Femenino)</option>
                                        <option value="MALE">Él (Masculino)</option>
                                    </select>
                                </div>
                            </div>
                            <div className="form-group">
                                <label>URL de Imagen o Vídeo</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="https://images.unsplash.com..."
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                />
                            </div>

                            {formData.imageUrl && (
                                <div className="image-preview">
                                    <span>Previsualización:</span>
                                    <div className="preview-img" style={{ backgroundImage: `url(${formData.imageUrl})` }}></div>
                                </div>
                            )}

                            <div className="form-actions">
                                <button type="button" className="btn-cancel" onClick={() => { setShowModal(false); setEditingStory(null); }}>Cancelar</button>
                                <button type="submit" className="btn-save-story">{editingStory ? 'Actualizar' : 'Publicar Ahora'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style jsx>{`
        .stories-admin { display: flex; flex-direction: column; gap: 32px; animation: slideUp 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
        .admin-toolbar { 
            padding: 28px; border-radius: 24px; display: flex; justify-content: space-between; align-items: center;
            background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05);
        }
        .toolbar-info p { color: #94a3b8; font-size: 15px; font-weight: 600; }
        
        .add-history-btn {
            background: white; color: #0f172a; border: none; padding: 12px 24px; border-radius: 16px;
            font-weight: 900; display: flex; align-items: center; gap: 10px; cursor: pointer; transition: 0.3s;
        }
        .add-history-btn:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(255,255,255,0.1); }

        .stories-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 28px; }
        .story-card-premium { 
            background: rgba(255,255,255,0.03); border-radius: 28px; padding: 12px;
            border: 1px solid rgba(255,255,255,0.05); transition: 0.4s;
        }
        .story-card-premium:hover { background: rgba(255,255,255,0.06); transform: translateY(-5px); }
        
        .story-preview-container {
            width: 100%; height: 320px; border-radius: 20px; overflow: hidden; position: relative;
        }
        .story-preview-img { width: 100%; height: 100%; background-size: cover; background-position: center; transition: 0.6s cubic-bezier(0.4, 0, 0.2, 1); }
        .story-card-premium:hover .story-preview-img { transform: scale(1.1); }
        
        .story-overlay {
            position: absolute; inset: 0; background: linear-gradient(to top, rgba(15,23,42,0.8), transparent);
            padding: 16px; display: flex; flex-direction: column; justify-content: space-between;
            opacity: 0; transition: 0.3s;
        }
        .story-card-premium:hover .story-overlay { opacity: 1; }
        
        .overlay-top, .overlay-bottom { display: flex; justify-content: space-between; align-items: center; }
        .icon-btn-s {
            width: 36px; height: 36px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.2);
            display: flex; align-items: center; justify-content: center; backdrop-filter: blur(4px);
            color: white; cursor: pointer; transition: 0.3s;
        }
        .icon-btn-s.edit { background: rgba(255,255,255,0.1); }
        .icon-btn-s.delete { background: rgba(239,68,68,0.2); color: #ef4444; border-color: rgba(239,68,68,0.3); }
        .icon-btn-s:hover { transform: scale(1.1); background: white; color: #0f172a; }
        .icon-btn-s.delete:hover { background: #ef4444; color: white; }

        .gender-tag { background: white; color: #0f172a; padding: 4px 10px; border-radius: 8px; font-size: 10px; font-weight: 900; text-transform: uppercase; }
        .story-item-info { padding: 16px 8px; display: flex; flex-direction: column; gap: 4px; }
        .story-item-info strong { font-size: 16px; color: #f1f5f9; font-weight: 800; }
        .story-item-info .date { font-size: 12px; color: #64748b; font-weight: 600; }

        .empty-state { grid-column: 1 / -1; padding: 80px; display: flex; flex-direction: column; align-items: center; gap: 16px; color: #475569; }
        .loading-grid { grid-column: 1 / -1; padding: 40px; text-align: center; color: #94a3b8; font-weight: 700; }

        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.8); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 20px; }
        .modal-content { width: 100%; max-width: 480px; padding: 32px; border-radius: 32px; background: #0f172a; border: 1px solid rgba(255,255,255,0.1); }
        .modal-header h3 { font-size: 24px; font-weight: 900; color: white; margin-bottom: 4px; }
        .modal-header p { font-size: 14px; color: #64748b; font-weight: 600; }
        .close-modal { background: rgba(255,255,255,0.05); border: none; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; color: #94a3b8; display: flex; align-items: center; justify-content: center; }

        .admin-form { display: flex; flex-direction: column; gap: 20px; margin-top: 24px; }
        .form-group label { font-size: 11px; font-weight: 900; color: #64748b; text-transform: uppercase; margin-bottom: 8px; display: block; }
        .form-group input, .form-group select { width: 100%; padding: 12px 16px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.1); background: rgba(255,255,255,0.03); color: white; font-weight: 600; outline: none; }
        .form-group input:focus { border-color: white; }
        
        .preview-img { width: 100%; height: 200px; border-radius: 20px; background-size: cover; background-position: center; border: 1px solid rgba(255,255,255,0.1); margin-top: 10px; }
        
        .form-actions { display: flex; justify-content: flex-end; gap: 16px; margin-top: 10px; }
        .btn-cancel { background: none; border: none; color: #94a3b8; font-weight: 700; cursor: pointer; }
        .btn-save-story { background: white; color: #0f172a; border: none; padding: 12px 24px; border-radius: 14px; font-weight: 900; cursor: pointer; transition: 0.3s; }
        .btn-save-story:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(255,255,255,0.1); }

        .animate-fade-in { animation: fadeIn 0.4s cubic-bezier(0.1, 0.7, 0.1, 1); }
        @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
        </div>
    );
}
