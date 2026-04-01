'use client';
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Image as ImageIcon, X } from 'lucide-react';

export default function AdminHistorias() {
    const [stories, setStories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        title: '',
        imageUrl: '',
        gender: 'FEMALE',
    });

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        const res = await fetch('/api/stories');
        const data = await res.json();
        setStories(data);
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/stories', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            setShowModal(false);
            fetchStories();
            setFormData({ title: '', imageUrl: '', gender: 'FEMALE' });
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('¿Eliminar esta historia?')) {
            await fetch(`/api/stories/${id}`, { method: 'DELETE' });
            fetchStories();
        }
    };

    return (
        <div className="stories-admin">
            <div className="admin-toolbar glass">
                <div className="toolbar-info">
                    <p>Muestra ofertas y novedades en el carrusel superior de la tienda.</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <Plus size={18} /> Nueva Historia
                </button>
            </div>

            <div className="stories-grid">
                {loading ? (
                    <p>Cargando historias...</p>
                ) : stories.map((story) => (
                    <div key={story.id} className="story-card glass">
                        <div className="story-preview" style={{ backgroundImage: `url(${story.imageUrl})` }}>
                            <button className="delete-story" onClick={() => handleDelete(story.id)}><X size={14} /></button>
                        </div>
                        <div className="story-info">
                            <strong>{story.title}</strong>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content glass animate-fade">
                        <div className="modal-header">
                            <h3>Nueva Historia</h3>
                            <button onClick={() => setShowModal(false)}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="admin-form">
                            <div className="form-group">
                                <label>Título (Destino/Categoría)</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ej: Ofertas, Facial, Kit Verano"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>URL de Imagen</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="https://..."
                                    value={formData.imageUrl}
                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                />
                            </div>
                            <div className="form-group">
                                <label>Género</label>
                                <select
                                    value={formData.gender}
                                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                >
                                    <option value="FEMALE">Ella (Femenino)</option>
                                    <option value="MALE">Él (Masculino)</option>
                                </select>
                            </div>
                            <div className="form-actions">
                                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancelar</button>
                                <button type="submit" className="btn btn-primary">Publicar Historia</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style jsx>{`
        .stories-admin { display: flex; flex-direction: column; gap: 24px; }
        .admin-toolbar { padding: 20px; border-radius: 16px; display: flex; justify-content: space-between; align-items: center; }
        .toolbar-info h2 { font-size: 24px; font-weight: 800; margin-bottom: 5px; color: var(--fg); }
        .toolbar-info p { color: var(--slate-500); font-size: 14px; }
        
        .stories-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); gap: 20px; }
        .story-card { border-radius: 20px; overflow: hidden; padding: 10px; text-align: center; }
        .story-preview { width: 100px; height: 100px; border-radius: 50%; margin: 0 auto 10px; background-size: cover; background-position: center; border: 3px solid var(--primary); position: relative; }
        .delete-story { position: absolute; top: -5px; right: -5px; background: #ff4d4d; color: white; border: none; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; cursor: pointer; box-shadow: 0 4px 8px rgba(0,0,0,0.2); }
        
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; }
        .modal-content { width: 100%; max-width: 400px; padding: 30px; border-radius: 24px; background: white; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .modal-header h3 { font-size: 20px; font-weight: 700; }
        .modal-header button { background: none; border: none; cursor: pointer; color: var(--slate-400); }
        
        .admin-form { display: flex; flex-direction: column; gap: 16px; }
        .story-info { padding: 15px; display: flex; flex-direction: column; gap: 5px; }
        .story-info strong { font-size: 14px; color: var(--fg); }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group label { font-size: 13px; font-weight: 600; color: var(--slate-600); }
        .form-group input { padding: 10px 14px; border-radius: 10px; border: 1px solid #ddd; outline: none; }
        .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 10px; }
      `}</style>
        </div>
    );
}
