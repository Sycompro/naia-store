'use client';
export const dynamic = 'force-dynamic';
import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Image as ImageIcon, X, Edit2, Play, User as UserIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import AdminPageHeader from '@/components/admin/AdminPageHeader';
import AdminCard from '@/components/admin/AdminCard';
import CustomSelect from '@/components/CustomSelect';

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
    const [uploading, setUploading] = useState(false);
    const [editingStory, setEditingStory] = useState<any>(null);
    const [slides, setSlides] = useState<any[]>([]);
    const [loadingSlides, setLoadingSlides] = useState(false);

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/admin/stories/groups');
            const data = await res.json();
            setStories(data);
        } finally {
            setLoading(false);
        }
    };

    const fetchSlides = async (groupId: number) => {
        setLoadingSlides(true);
        try {
            const res = await fetch(`/api/admin/stories/slides?groupId=${groupId}`);
            const data = await res.json();
            setSlides(data);
        } finally {
            setLoadingSlides(false);
        }
    };

    const isVideo = (url: string) => {
        if (!url) return false;
        const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov'];
        return videoExtensions.some(ext => url.toLowerCase().endsWith(ext)) || url.includes('/video/upload');
    };

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

    const handleUploadSlide = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !editingStory) return;

        setUploading(true);
        const data = new FormData();
        data.set('file', file);

        try {
            const res = await fetch('/api/admin/upload', { method: 'POST', body: data });
            const result = await res.json();

            if (result.url) {
                const newSlide = {
                    groupId: editingStory.id,
                    mediaUrl: result.url,
                    type: isVideo(result.url) ? 'VIDEO' : 'IMAGE',
                    order: slides.length
                };

                const saveRes = await fetch('/api/admin/stories/slides', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newSlide)
                });

                if (saveRes.ok) fetchSlides(editingStory.id);
            }
        } catch (error) {
            console.error('Slide upload error:', error);
        } finally {
            setUploading(false);
        }
    };

    const handleDeleteSlide = async (slideId: number) => {
        if (!confirm('¿Eliminar esta diapositiva?')) return;
        const res = await fetch(`/api/admin/stories/slides/${slideId}`, { method: 'DELETE' });
        if (res.ok && editingStory) fetchSlides(editingStory.id);
    };

    const handleMoveSlide = async (slideId: number, direction: 'up' | 'down') => {
        const index = slides.findIndex(s => s.id === slideId);
        if ((direction === 'up' && index === 0) || (direction === 'down' && index === slides.length - 1)) return;

        const newSlides = [...slides];
        const swapIndex = direction === 'up' ? index - 1 : index + 1;
        [newSlides[index], newSlides[swapIndex]] = [newSlides[swapIndex], newSlides[index]];

        await Promise.all(newSlides.map((s, i) =>
            fetch(`/api/admin/stories/slides/${s.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order: i })
            })
        ));

        if (editingStory) fetchSlides(editingStory.id);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const method = editingStory ? 'PATCH' : 'POST';
        const url = editingStory ? `/api/admin/stories/groups/${editingStory.id}` : '/api/admin/stories/groups';

        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: formData.title,
                thumbnailUrl: formData.imageUrl,
                gender: formData.gender
            }),
        });

        if (res.ok) {
            setShowModal(false);
            setEditingStory(null);
            fetchStories();
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm('¿Eliminar este grupo de historias? Se eliminarán todas sus diapositivas.')) {
            await fetch(`/api/admin/stories/groups/${id}`, { method: 'DELETE' });
            fetchStories();
        }
    };

    const openEditModal = (story: any) => {
        setFormData({
            title: story.name,
            imageUrl: story.thumbnailUrl,
            gender: story.gender
        });
        setEditingStory(story);
        fetchSlides(story.id);
        setShowModal(true);
    };

    const openAddModal = () => {
        setFormData({ title: '', imageUrl: '', gender: 'FEMALE' });
        setEditingStory(null);
        setSlides([]);
        setShowModal(true);
    };

    return (
        <div className="admin-stories-page animate-entrance">
            <AdminPageHeader
                title="Historias e Impacto"
                breadcrumb={[{ label: 'Admin', href: '/admin' }, { label: 'Contenido Visual' }]}
                actions={
                    <button className="add-btn-premium" onClick={openAddModal}>
                        <Plus size={18} /> Crear Historia
                    </button>
                }
            />

            <div className="stories-view-container">
                {loading ? (
                    <div className="loading-state-full">
                        <div className="loader-pulse"></div>
                        <span>Organizando historias...</span>
                    </div>
                ) : stories.length === 0 ? (
                    <div className="empty-stories-splash">
                        <div className="splash-icon"><ImageIcon size={64} strokeWidth={1} /></div>
                        <h3>No hay historias activas</h3>
                        <p>Las historias ayudan a captar la atención de tus clientes con novedades visuales.</p>
                        <button className="cta-btn-premium" onClick={openAddModal}>Publicar la primera</button>
                    </div>
                ) : (
                    <div className="stories-grid-premium">
                        {stories.map((story) => (
                            <AdminCard key={story.id} padding="0" className="story-card-wrapper">
                                <div className="story-thumb-area">
                                    <div className="thumb-image" style={{ backgroundImage: `url(${story.thumbnailUrl})` }}></div>
                                    <div className="category-pill-premium">{story.gender === 'MALE' ? 'Caballeros' : 'Damas'}</div>
                                    <div className="slides-count-pill">{story._count?.slides || 0} Slides</div>
                                    
                                    <div className="story-overlay-actions">
                                        <button className="action-circle-edit" onClick={() => openEditModal(story)}><Edit2 size={16} /></button>
                                        <button className="action-circle-del" onClick={() => handleDelete(story.id)}><Trash2 size={16} /></button>
                                    </div>
                                </div>
                                <div className="story-footer-info">
                                    <span className="story-name-title">{story.name}</span>
                                    <span className="story-meta-date">{new Date(story.createdAt).toLocaleDateString()}</span>
                                </div>
                            </AdminCard>
                        ))}
                    </div>
                )}
            </div>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-container-modern animate-modal-in">
                        <header className="modal-header-premium">
                            <div className="title-box">
                                <h3>{editingStory ? 'Gestionar Historia' : 'Nueva Campaña Visual'}</h3>
                                <p>Crea una secuencia de contenidos para el carrusel principal.</p>
                            </div>
                            <button className="btn-close-modal" onClick={() => { setShowModal(false); setEditingStory(null); }}><X size={22} /></button>
                        </header>

                        <form onSubmit={handleSubmit} className="premium-form-layout">
                            <div className="form-main-fields">
                                <div className="image-preview-side">
                                    <label className="label-lite">Portada (Círculo)</label>
                                    <div className="thumbnail-upload-box">
                                        {formData.imageUrl ? (
                                            <div className="thumb-preview-circle">
                                                <img src={formData.imageUrl} alt="Thumbnail" />
                                                <button type="button" className="btn-remove-thumb" onClick={() => setFormData({ ...formData, imageUrl: '' })}><X size={12} /></button>
                                            </div>
                                        ) : (
                                            <label htmlFor="thumb-input" className="thumb-placeholder-circle">
                                                <ImageIcon size={24} color="#ec4899" />
                                                <span>Imagen</span>
                                            </label>
                                        )}
                                        <input type="file" id="thumb-input" className="hidden-node" onChange={handleFileUpload} accept="image/*" />
                                    </div>
                                </div>

                                <div className="text-fields-side">
                                    <div className="form-item-premium">
                                        <label className="label-lite">Título de la Historia</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Ej: Ofertas de Verano"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        />
                                    </div>
                                    <div className="form-item-premium">
                                        <label className="label-lite">Segmento</label>
                                        <CustomSelect
                                            value={formData.gender}
                                            onChange={(val) => setFormData({ ...formData, gender: val })}
                                            icon={UserIcon}
                                            options={[
                                                { value: 'FEMALE', label: 'Línea Damas' },
                                                { value: 'MALE', label: 'Línea Caballeros' }
                                            ]}
                                        />
                                    </div>
                                </div>
                            </div>

                            {editingStory && (
                                <div className="slides-manager-premium">
                                    <div className="manager-header">
                                        <h4>Contenidos de la Historia</h4>
                                        <label htmlFor="slide-input" className="btn-add-slide-premium">
                                            <Plus size={16} /> Añadir Slide
                                        </label>
                                        <input type="file" id="slide-input" className="hidden-node" onChange={handleUploadSlide} accept="image/*,video/*" />
                                    </div>

                                    <div className="slides-grid-mini">
                                        {loadingSlides ? (
                                            <div className="loading-slides-txt">Cargando secuencias...</div>
                                        ) : slides.length === 0 ? (
                                            <div className="empty-slides-txt">Aún no has añadido diapositivas a este grupo.</div>
                                        ) : (
                                            slides.map((slide, index) => (
                                                <div key={slide.id} className="slide-card-mini">
                                                    <div className="preview-mini-wrap">
                                                        {slide.type === 'VIDEO' ? (
                                                            <video src={slide.mediaUrl} className="vid-mini" muted playsInline />
                                                        ) : (
                                                            <div className="img-mini" style={{ backgroundImage: `url(${slide.mediaUrl})` }}></div>
                                                        )}
                                                        <div className="order-tag">#{index + 1}</div>
                                                        <button type="button" className="btn-del-slide" onClick={() => handleDeleteSlide(slide.id)}><Trash2 size={12} /></button>
                                                    </div>
                                                    <div className="slide-move-actions">
                                                        <button type="button" onClick={() => handleMoveSlide(slide.id, 'up')} disabled={index === 0}>↑</button>
                                                        <button type="button" onClick={() => handleMoveSlide(slide.id, 'down')} disabled={index === slides.length - 1}>↓</button>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            )}

                            <div className="modal-footer-premium">
                                <button type="button" className="btn-cancel-premium" onClick={() => { setShowModal(false); setEditingStory(null); }}>Cancelar</button>
                                <button type="submit" className="btn-save-premium" disabled={uploading}>
                                    {uploading ? 'Procesando...' : editingStory ? 'Confirmar Cambios' : 'Crear Historia'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style jsx>{`
                .admin-stories-page { max-width: 1400px; margin: 0 auto; }
                
                .add-btn-premium {
                    background: #1e293b; color: white; border: none; padding: 12px 24px; border-radius: 16px;
                    font-weight: 900; display: flex; align-items: center; gap: 10px; cursor: pointer; transition: 0.3s;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.1);
                }
                .add-btn-premium:hover { transform: translateY(-2px); background: #0f172a; }

                .stories-view-container { margin-top: 40px; }
                .loading-state-full { padding: 100px; display: flex; flex-direction: column; align-items: center; gap: 20px; color: #94a3b8; font-weight: 800; }
                .loader-pulse { width: 40px; height: 40px; border-radius: 50%; background: #ec4899; animation: pulse 1.5s infinite; }
                @keyframes pulse { 0% { transform: scale(0.8); opacity: 0.5; } 50% { transform: scale(1.2); opacity: 0.2; } 100% { transform: scale(0.8); opacity: 0.5; } }

                .empty-stories-splash { padding: 100px; display: flex; flex-direction: column; align-items: center; text-align: center; color: #94a3b8; }
                .splash-icon { width: 120px; height: 120px; background: #f8fafc; border-radius: 40px; display: flex; align-items: center; justify-content: center; margin-bottom: 30px; border: 1px solid #f1f5f9; color: #cbd5e1; }
                .empty-stories-splash h3 { font-size: 24px; font-weight: 950; color: #1e293b; letter-spacing: -0.8px; margin-bottom: 12px; }
                .empty-stories-splash p { font-size: 15px; font-weight: 700; max-width: 350px; line-height: 1.6; margin-bottom: 30px; }
                .cta-btn-premium { background: #ec4899; color: white; border: none; padding: 14px 30px; border-radius: 16px; font-weight: 900; cursor: pointer; transition: 0.3s; }

                .stories-grid-premium { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 30px; }
                .story-card-wrapper { transition: 0.4s cubic-bezier(0.1, 0.7, 0.1, 1); border: 1px solid #f1f5f9 !important; }
                .story-card-wrapper:hover { transform: translateY(-10px); box-shadow: 0 30px 60px rgba(0,0,0,0.08) !important; }

                .story-thumb-area { width: 100%; height: 320px; position: relative; overflow: hidden; background: #1e293b; }
                .thumb-image { width: 100%; height: 100%; background-size: cover; background-position: center; transition: 0.6s; }
                .story-card-wrapper:hover .thumb-image { transform: scale(1.1); opacity: 0.7; }

                .category-pill-premium { position: absolute; top: 15px; left: 15px; background: #fff; color: #ec4899; padding: 6px 14px; border-radius: 100px; font-size: 11px; font-weight: 950; text-transform: uppercase; z-index: 5; }
                .slides-count-pill { position: absolute; top: 15px; right: 15px; background: rgba(0,0,0,0.4); backdrop-filter: blur(8px); color: #fff; padding: 6px 14px; border-radius: 100px; font-size: 11px; font-weight: 900; z-index: 5; }

                .story-overlay-actions { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; gap: 15px; opacity: 0; transition: 0.3s; z-index: 10; }
                .story-card-wrapper:hover .story-overlay-actions { opacity: 1; }
                .action-circle-edit, .action-circle-del { width: 50px; height: 50px; border-radius: 50%; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.3s; }
                .action-circle-edit { background: #fff; color: #1e293b; }
                .action-circle-del { background: #f43f5e; color: #fff; }
                .action-circle-edit:hover, .action-circle-del:hover { transform: scale(1.15); }

                .story-footer-info { padding: 20px; display: flex; flex-direction: column; gap: 4px; background: #fff; }
                .story-name-title { font-size: 16px; font-weight: 900; color: #1e293b; letter-spacing: -0.3px; }
                .story-meta-date { font-size: 12px; font-weight: 800; color: #94a3b8; }

                /* Modal Section */
                .modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(12px); display: flex; align-items: center; justify-content: center; z-index: 10000; padding: 20px; }
                .modal-container-modern { width: 100%; max-width: 600px; background: #fff; border-radius: 32px; padding: 40px; box-shadow: 0 50px 100px rgba(0,0,0,0.15); }
                .modal-header-premium { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; }
                .title-box h3 { font-size: 24px; font-weight: 950; color: #1e293b; letter-spacing: -1px; margin: 0; }
                .title-box p { font-size: 14px; font-weight: 700; color: #94a3b8; margin-top: 4px; }
                .btn-close-modal { background: #f8fafc; border: 1px solid #f1f5f9; width: 44px; height: 44px; border-radius: 14px; cursor: pointer; color: #94a3b8; display: flex; align-items: center; justify-content: center; transition: 0.3s; }
                .btn-close-modal:hover { background: #fee2e2; color: #ef4444; border-color: #fecaca; transform: rotate(90deg); }

                .premium-form-layout { display: flex; flex-direction: column; gap: 30px; }
                .form-main-fields { display: flex; gap: 30px; }
                .image-preview-side { width: 140px; flex-shrink: 0; text-align: center; }
                .text-fields-side { flex: 1; display: flex; flex-direction: column; gap: 20px; }

                .label-lite { font-size: 11px; font-weight: 900; color: #cbd5e1; text-transform: uppercase; letter-spacing: 0.1em; display: block; margin-bottom: 10px; }
                .thumb-preview-circle { width: 120px; height: 120px; border-radius: 50%; overflow: hidden; position: relative; border: 3px solid #f1f5f9; box-shadow: 0 10px 20px rgba(0,0,0,0.05); }
                .thumb-preview-circle img { width: 100%; height: 100%; object-fit: cover; }
                .thumb-placeholder-circle { width: 120px; height: 120px; border-radius: 50%; border: 2px dashed #f1f5f9; background: #f8fafc; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; cursor: pointer; color: #94a3b8; font-size: 12px; font-weight: 800; transition: 0.3s; }
                .thumb-placeholder-circle:hover { border-color: #ec4899; color: #ec4899; background: #fdf2f8; }
                
                .btn-remove-thumb { position: absolute; bottom: 0; right: 0; width: 30px; height: 30px; border-radius: 50%; background: #f43f5e; border: none; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; }

                .form-item-premium input { width: 100%; padding: 14px 18px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; font-size: 14px; font-weight: 800; color: #1e293b; outline: none; transition: 0.3s; }
                .form-item-premium input:focus { border-color: #ec4899; background: #fff; box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.05); }

                .slides-manager-premium { background: #fcfcfc; border: 1px solid #f1f5f9; border-radius: 24px; padding: 25px; }
                .manager-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
                .manager-header h4 { font-size: 15px; font-weight: 900; color: #1e293b; margin: 0; }
                .btn-add-slide-premium { background: #ec4899; color: white; padding: 8px 16px; border-radius: 12px; font-size: 12px; font-weight: 900; cursor: pointer; display: flex; align-items: center; gap: 8px; box-shadow: 0 5px 15px rgba(236, 72, 153, 0.2); }

                .slides-grid-mini { display: grid; grid-template-columns: repeat(auto-fill, minmax(110px, 1fr)); gap: 15px; max-height: 220px; overflow-y: auto; padding: 5px; }
                .slide-card-mini { background: #fff; border: 1px solid #f1f5f9; border-radius: 16px; padding: 8px; box-shadow: 0 4px 10px rgba(0,0,0,0.02); }
                .preview-mini-wrap { width: 100%; height: 120px; border-radius: 12px; overflow: hidden; position: relative; background: #000; margin-bottom: 8px; }
                .img-mini, .vid-mini { width: 100%; height: 100%; background-size: cover; background-position: center; object-fit: cover; }
                .order-tag { position: absolute; top: 6px; left: 6px; background: #fff; color: #1e293b; font-size: 10px; font-weight: 950; padding: 2px 6px; border-radius: 6px; }
                .btn-del-slide { position: absolute; top: 6px; right: 6px; width: 22px; height: 22px; border-radius: 50%; background: #f43f5e; border: none; color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; }
                .slide-move-actions { display: flex; justify-content: center; gap: 4px; }
                .slide-move-actions button { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; width: 24px; height: 24px; font-size: 11px; font-weight: 950; color: #94a3b8; cursor: pointer; }
                
                .modal-footer-premium { display: flex; justify-content: space-between; align-items: center; margin-top: 10px; }
                .btn-cancel-premium { background: none; border: none; color: #94a3b8; font-weight: 800; cursor: pointer; }
                .btn-save-premium { background: #1e293b; color: #fff; border: none; padding: 14px 35px; border-radius: 16px; font-weight: 950; cursor: pointer; transition: 0.3s; box-shadow: 0 10px 30px rgba(0,0,0,0.1); }
                .btn-save-premium:hover { transform: translateY(-3px); background: #000; }

                .hidden-node { display: none; }
                @keyframes modalIn { from { opacity: 0; transform: scale(0.9) translateY(30px); } to { opacity: 1; transform: scale(1) translateY(0); } }
                .animate-modal-in { animation: modalIn 0.5s cubic-bezier(0.1, 0.7, 0.1, 1); }
                @keyframes entrance { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
}
