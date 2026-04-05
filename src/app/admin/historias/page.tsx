'use client';
export const dynamic = 'force-dynamic';
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Image as ImageIcon, X, Edit2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminCard from '@/components/admin/AdminCard';

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
        <div className="admin-stories-page animate-entrance">
            <AdminPageHeader
                title="Historias y Novedades"
                breadcrumb={[{ label: 'Admin', href: '/admin' }, { label: 'Historias' }]}
                actions={
                    <button className="add-history-btn-premium" onClick={openAddModal}>
                        <Plus size={18} /> Nueva Historia
                    </button>
                }
            />

            <div className="stories-grid-container">
                {loading ? (
                    <div className="loading-state-premium">Cargando historias...</div>
                ) : stories.length === 0 ? (
                    <AdminCard className="empty-stories-card">
                        <div className="empty-state-content">
                            <ImageIcon size={48} strokeWidth={1.5} />
                            <p>No hay historias publicadas aún.</p>
                            <button className="text-link-premium" onClick={openAddModal}>Publicar la primera</button>
                        </div>
                    </AdminCard>
                ) : (
                    <div className="stories-grid-premium">
                        {stories.map((story) => (
                            <AdminCard key={story.id} className="story-card-admin" padding="0">
                                <div className="story-image-wrap">
                                    <div className="story-img" style={{ backgroundImage: `url(${story.imageUrl})` }}></div>
                                    <div className="story-badges">
                                        <div className="gender-pill">{story.gender === 'MALE' ? 'Él' : 'Ella'}</div>
                                    </div>
                                    <div className="story-actions-overlay">
                                        <button className="circle-btn-edit" onClick={() => openEditModal(story)}><Edit2 size={16} /></button>
                                        <button className="circle-btn-delete" onClick={() => handleDelete(story.id)}><Trash2 size={16} /></button>
                                    </div>
                                </div>
                                <div className="story-meta-footer">
                                    <span className="story-title-txt">{story.title.replace('[MALE] ', '')}</span>
                                    <span className="story-date-txt">{new Date(story.createdAt).toLocaleDateString()}</span>
                                </div>
                            </AdminCard>
                        ))}
                    </div>
                )}
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content-premium glass-premium animate-fade-in">
                        <div className="modal-header-premium">
                            <div className="header-text">
                                <h3>{editingStory ? 'Editar Historia' : 'Nueva Historia'}</h3>
                                <p>Publica una novedad en el carrusel de la tienda</p>
                            </div>
                            <button className="close-modal-btn" onClick={() => { setShowModal(false); setEditingStory(null); }}><X size={20} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="admin-form-modern">
                            <div className="form-grid-modern">
                                <div className="form-group-modern full">
                                    <label>Título / Categoría</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Ej: Ofertas, Nuevo Serum, Kit Verano"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    />
                                </div>
                                <div className="form-group-modern">
                                    <label>Género / Tema</label>
                                    <select
                                        value={formData.gender}
                                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                    >
                                        <option value="FEMALE">Ella (Femenino)</option>
                                        <option value="MALE">Él (Masculino)</option>
                                    </select>
                                </div>
                                <div className="form-group-modern full">
                                    <label>URL de Imagen o Vídeo</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="https://images.unsplash.com..."
                                        value={formData.imageUrl}
                                        onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                    />
                                </div>
                            </div>

                            {formData.imageUrl && (
                                <div className="preview-wrap-modern">
                                    <div className="preview-label">Previsualización</div>
                                    <div className="preview-img-box" style={{ backgroundImage: `url(${formData.imageUrl})` }}></div>
                                </div>
                            )}

                            <div className="form-footer-modern">
                                <button type="button" className="btn-cancel-modern" onClick={() => { setShowModal(false); setEditingStory(null); }}>Cancelar</button>
                                <button type="submit" className="btn-submit-modern">{editingStory ? 'Actualizar' : 'Publicar Ahora'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style jsx>{`
                .admin-stories-page { display: flex; flex-direction: column; gap: 24px; animation: fadeIn 0.4s ease-out; }
                
                .add-history-btn-premium {
                    background: white; color: #0f172a; border: none; padding: 10px 20px; border-radius: 12px;
                    font-weight: 950; display: flex; align-items: center; gap: 10px; cursor: pointer; transition: 0.3s;
                }
                .add-history-btn-premium:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(255,255,255,0.1); }

                .stories-grid-container { min-height: 400px; }
                .loading-state-premium { padding: 80px; text-align: center; color: #64748b; font-weight: 800; font-size: 1.1rem; }

                .empty-stories-card { padding: 80px !important; }
                .empty-state-content { display: flex; flex-direction: column; align-items: center; gap: 16px; color: #475569; }
                .empty-state-content p { font-size: 16px; font-weight: 700; }
                .text-link-premium { background: none; border: none; color: white; font-weight: 900; text-decoration: underline; cursor: pointer; }

                .stories-grid-premium { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 24px; }
                
                .story-card-admin :global(.card-body-admin) { padding: 0; }
                
                .story-image-wrap { width: 100%; height: 280px; position: relative; overflow: hidden; border-radius: 20px 20px 0 0; }
                .story-img { width: 100%; height: 100%; background-size: cover; background-position: center; transition: 0.6s cubic-bezier(0.1, 0.7, 0.1, 1); }
                .story-card-admin:hover .story-img { transform: scale(1.1); }
                
                .story-badges { position: absolute; top: 12px; left: 12px; z-index: 5; }
                .gender-pill { background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); color: white; padding: 4px 10px; border-radius: 8px; font-size: 10px; font-weight: 900; text-transform: uppercase; }

                .story-actions-overlay {
                    position: absolute; inset: 0; background: linear-gradient(to top, rgba(15,23,42,0.8), transparent);
                    display: flex; align-items: center; justify-content: center; gap: 12px; opacity: 0; transition: 0.3s; z-index: 10;
                }
                .story-card-admin:hover .story-actions-overlay { opacity: 1; }
                
                .circle-btn-edit, .circle-btn-delete {
                    width: 44px; height: 44px; border-radius: 50%; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.3s;
                }
                .circle-btn-edit { background: white; color: #0f172a; }
                .circle-btn-delete { background: #ef4444; color: white; }
                .circle-btn-edit:hover, .circle-btn-delete:hover { transform: scale(1.15); }

                .story-meta-footer { padding: 16px; display: flex; flex-direction: column; gap: 4px; border-top: 1px solid rgba(255,255,255,0.03); }
                .story-title-txt { font-size: 14px; font-weight: 800; color: white; }
                .story-date-txt { font-size: 11px; font-weight: 700; color: #475569; }

                /* Modal */
                .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center; z-index: 5000; padding: 20px; }
                .modal-content-premium { width: 100%; max-width: 500px; padding: 32px; border-radius: 28px; background: #0f172a; border: 1px solid rgba(255,255,255,0.1); box-shadow: 0 40px 100px rgba(0,0,0,0.6); }
                .modal-header-premium { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px; }
                .header-text h3 { font-size: 24px; font-weight: 950; color: white; letter-spacing: -1px; margin-bottom: 4px; }
                .header-text p { font-size: 14px; color: #64748b; font-weight: 600; }
                .close-modal-btn { background: rgba(255,255,255,0.05); border: none; width: 40px; height: 40px; border-radius: 50%; cursor: pointer; color: #94a3b8; display: flex; align-items: center; justify-content: center; transition: 0.3s; }
                .close-modal-btn:hover { background: white; color: #0f172a; transform: rotate(90deg); }

                .admin-form-modern { display: flex; flex-direction: column; gap: 24px; }
                .form-grid-modern { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                .form-group-modern { display: flex; flex-direction: column; gap: 8px; }
                .form-group-modern.full { grid-column: 1 / -1; }
                .form-group-modern label { font-size: 11px; font-weight: 900; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px; }
                .form-group-modern input, .form-group-modern select {
                    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
                    padding: 14px 18px; border-radius: 14px; color: white; font-weight: 600; outline: none; transition: 0.2s;
                }
                .form-group-modern input:focus { border-color: rgba(255,255,255,0.3); }

                .preview-wrap-modern { margin-top: 10px; }
                .preview-label { font-size: 11px; font-weight: 900; color: #64748b; text-transform: uppercase; margin-bottom: 12px; }
                .preview-img-box { width: 100%; height: 220px; border-radius: 20px; background-size: cover; background-position: center; border: 1px solid rgba(255,255,255,0.1); }

                .form-footer-modern { display: flex; justify-content: flex-end; gap: 16px; margin-top: 16px; }
                .btn-cancel-modern { background: none; border: none; color: #64748b; font-weight: 800; cursor: pointer; }
                .btn-submit-modern {
                    background: white; color: #0f172a; border: none; padding: 14px 32px; border-radius: 16px;
                    font-weight: 950; cursor: pointer; transition: 0.3s;
                }
                .btn-submit-modern:hover { transform: translateY(-3px); box-shadow: 0 15px 35px rgba(0,0,0,0.3); }

                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
}
