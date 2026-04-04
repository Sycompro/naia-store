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
                ) : stories.length === 0 ? (
                    <div className="empty-state glass">
                        <ImageIcon size={48} />
                        <p>No hay historias publicadas aún.</p>
                    </div>
                ) : stories.map((story) => (
                    <div key={story.id} className="story-card glass transition-all">
                        <div className="story-preview-container">
                            <div className="story-preview-img" style={{ backgroundImage: `url(${story.imageUrl})` }}></div>
                            <div className="story-overlay">
                                <button className="btn-icon delete" onClick={() => handleDelete(story.id)} title="Eliminar"><Trash2 size={16} /></button>
                                <div className="gender-tag">{story.gender === 'MALE' ? 'Él' : 'Ella'}</div>
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
                    <div className="modal-content glass animate-fade">
                        <div className="modal-header">
                            <div>
                                <h3>Nueva Historia</h3>
                                <p>Publica una nueva novedad</p>
                            </div>
                            <button className="close-modal" onClick={() => setShowModal(false)}><X size={20} /></button>
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
                                <button type="button" className="btn btn-outline" onClick={() => setShowModal(false)}>Cancelar</button>
                                <button type="submit" className="btn btn-primary">Publicar Ahora</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style jsx>{`
        .stories-admin { display: flex; flex-direction: column; gap: 30px; padding-bottom: 50px; }
        .admin-toolbar { 
            padding: 24px; 
            border-radius: 20px; 
            display: flex; 
            justify-content: space-between; 
            align-items: center;
            background: rgba(255,255,255,0.7);
            border: 1px solid rgba(255,255,255,0.3);
        }
        .toolbar-info p { color: var(--slate-500); font-size: 15px; font-weight: 500; }
        
        .stories-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 24px; }
        .story-card { 
            border-radius: 24px; 
            overflow: hidden; 
            padding: 12px; 
            background: white;
            box-shadow: 0 4px 20px rgba(0,0,0,0.05);
        }
        .story-preview-container {
            width: 100%;
            height: 250px;
            border-radius: 18px;
            overflow: hidden;
            position: relative;
        }
        .story-preview-img {
            width: 100%;
            height: 100%;
            background-size: cover;
            background-position: center;
            transition: transform 0.5s;
        }
        .story-card:hover .story-preview-img { transform: scale(1.1); }
        .story-overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: linear-gradient(to top, rgba(0,0,0,0.4), transparent);
            padding: 12px;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            opacity: 0;
            transition: 0.3s;
        }
        .story-card:hover .story-overlay { opacity: 1; }
        .btn-icon.delete { background: #ff4d4d; color: white; border: none; width: 32px; height: 32px; border-radius: 10px; display: flex; align-items: center; justify-content: center; cursor: pointer; align-self: flex-end; }
        .gender-tag { background: white; color: black; padding: 4px 10px; border-radius: 8px; font-size: 11px; font-weight: 800; text-transform: uppercase; align-self: flex-start; }
        
        .story-item-info { padding: 12px 4px; display: flex; flex-direction: column; gap: 4px; }
        .story-item-info strong { font-size: 15px; color: var(--fg); font-weight: 700; }
        .story-item-info .date { font-size: 12px; color: var(--slate-400); }

        .empty-state { grid-column: 1 / -1; padding: 80px; display: flex; flex-direction: column; align-items: center; gap: 15px; color: var(--slate-400); text-align: center; border-style: dashed; }
        
        .modal-overlay { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 2000; padding: 20px; backdrop-filter: blur(5px); }
        .modal-content { width: 100%; max-width: 450px; padding: 32px; border-radius: 30px; background: white; }
        .modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 24px; }
        .modal-header h3 { font-size: 22px; font-weight: 800; color: var(--fg); }
        .modal-header p { font-size: 14px; color: var(--slate-400); }
        .close-modal { background: var(--slate-100); border: none; width: 36px; height: 36px; border-radius: 50%; cursor: pointer; color: var(--slate-500); display: flex; align-items: center; justify-content: center; transition: 0.3s; }
        .close-modal:hover { background: var(--slate-200); color: black; }
        
        .admin-form { display: flex; flex-direction: column; gap: 18px; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group label { font-size: 12px; font-weight: 700; color: var(--slate-500); text-transform: uppercase; letter-spacing: 0.05em; }
        .form-group input, .form-group select { padding: 12px 16px; border-radius: 12px; border: 1px solid var(--slate-200); outline: none; transition: 0.3s; background: var(--slate-50); }
        .form-group input:focus { border-color: var(--primary); background: white; box-shadow: 0 0 0 4px var(--primary-light); }
        .form-row { display: grid; grid-template-columns: 1fr; gap: 18px; }
        
        .image-preview { display: flex; flex-direction: column; gap: 8px; }
        .image-preview span { font-size: 12px; font-weight: 700; color: var(--slate-500); }
        .preview-img { width: 100%; height: 180px; border-radius: 15px; background-size: cover; background-position: center; border: 2px solid var(--primary-light); }
        
        .form-actions { display: flex; justify-content: flex-end; gap: 12px; margin-top: 15px; }
        .btn { padding: 12px 24px; border-radius: 12px; font-weight: 700; cursor: pointer; transition: 0.3s; border: none; }
        .btn-primary { background: var(--fg); color: white; }
        .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(0,0,0,0.15); }
        .btn-outline { background: white; border: 1px solid var(--slate-200); color: var(--slate-600); }
        .btn-outline:hover { background: var(--slate-50); }
      `}</style>
        </div>
    );
}
