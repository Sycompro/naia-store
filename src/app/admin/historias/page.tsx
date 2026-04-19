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

    // Form State reset is handled in openEditModal and openAddModal

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

        // Update orders in DB
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
        setEditingStory(null);
        setSlides([]);
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
                                    <div className="story-img" style={{ backgroundImage: `url(${story.thumbnailUrl})` }}></div>
                                    <div className="story-badges">
                                        <div className="gender-pill">{story.gender === 'MALE' ? 'Él' : 'Ella'}</div>
                                        <div className="slides-pill">{story._count?.slides || 0} Slides</div>
                                    </div>
                                    <div className="story-actions-overlay">
                                        <button className="circle-btn-edit" onClick={() => openEditModal(story)}><Edit2 size={16} /></button>
                                        <button className="circle-btn-delete" onClick={() => handleDelete(story.id)}><Trash2 size={16} /></button>
                                    </div>
                                </div>
                                <div className="story-meta-footer">
                                    <span className="story-title-txt">{story.name}</span>
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
                                    <CustomSelect
                                        value={formData.gender}
                                        onChange={(val) => setFormData({ ...formData, gender: val })}
                                        icon={UserIcon}
                                        options={[
                                            { value: 'FEMALE', label: 'Ella (Femenino)' },
                                            { value: 'MALE', label: 'Él (Masculino)' }
                                        ]}
                                    />
                                </div>
                                <div className="form-group-modern full">
                                    <label>Archivo de Imagen o Vídeo</label>
                                    <div className="upload-input-wrap">
                                        <input
                                            type="file"
                                            id="file-upload"
                                            className="hidden-file-input"
                                            onChange={handleFileUpload}
                                            accept="image/*,video/*"
                                        />
                                        <label htmlFor="file-upload" className="custom-upload-trigger">
                                            {uploading ? (
                                                <>Subiendo archivo...</>
                                            ) : (
                                                <>{formData.imageUrl ? 'Cambiar Archivo' : 'Seleccionar Imagen/Vídeo'}</>
                                            )}
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {formData.imageUrl && (
                                <div className="preview-wrap-modern">
                                    <div className="preview-label">Imagen de Círculo (Miniatura)</div>
                                    <div className="preview-img-box mini-circle">
                                        <div className="preview-img-actual" style={{ backgroundImage: `url(${formData.imageUrl})` }}></div>
                                    </div>
                                </div>
                            )}

                            {editingStory && (
                                <div className="slides-manager-section animate-fade-in">
                                    <div className="section-header-modern">
                                        <div className="section-info">
                                            <h4>Diapositivas del Grupo</h4>
                                            <p>{slides.length} contenidos en secuencia</p>
                                        </div>
                                        <div className="section-action">
                                            <input type="file" id="slide-upload" className="hidden-file-input" onChange={handleUploadSlide} accept="image/*,video/*" />
                                            <label htmlFor="slide-upload" className="btn-add-slide-mini">
                                                <Plus size={14} /> Añadir
                                            </label>
                                        </div>
                                    </div>

                                    {loadingSlides ? (
                                        <div className="loading-slides-mini">Cargando diapositivas...</div>
                                    ) : slides.length === 0 ? (
                                        <div className="empty-slides-mini">Este grupo no tiene diapositivas aún.</div>
                                    ) : (
                                        <div className="slides-list-admin-mini">
                                            {slides.map((slide, index) => (
                                                <div key={slide.id} className="slide-item-admin-mini glass-card">
                                                    <div className="slide-preview-mini">
                                                        {slide.type === 'VIDEO' ? (
                                                            <div className="video-preview-mini">
                                                                <video src={slide.mediaUrl} muted playsInline className="preview-vid" />
                                                                <Play size={10} className="vid-icon" />
                                                            </div>
                                                        ) : (
                                                            <div className="img-preview-mini" style={{ backgroundImage: `url(${slide.mediaUrl})` }}></div>
                                                        )}
                                                        <div className="slide-order-badge">#{index + 1}</div>
                                                    </div>
                                                    <div className="slide-controls-mini">
                                                        <div className="move-btns">
                                                            <button type="button" onClick={() => handleMoveSlide(slide.id, 'up')} disabled={index === 0}>↑</button>
                                                            <button type="button" onClick={() => handleMoveSlide(slide.id, 'down')} disabled={index === slides.length - 1}>↓</button>
                                                        </div>
                                                        <button type="button" className="btn-delete-slide-mini" onClick={() => handleDeleteSlide(slide.id)}>
                                                            <Trash2 size={12} />
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div className="form-footer-modern">
                                <button type="button" className="btn-cancel-modern" onClick={() => { setShowModal(false); setEditingStory(null); }}>Cancelar</button>
                                <button type="submit" className="btn-submit-modern" disabled={uploading}>
                                    {uploading ? 'Cargando...' : editingStory ? 'Guardar Cambios' : 'Crear Grupo'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <style jsx>{`
                .admin-stories-page { display: flex; flex-direction: column; gap: 28px; animation: fadeIn 0.4s ease-out; }
                
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
                
                .story-image-wrap { width: 100%; height: 280px; position: relative; overflow: hidden; border-radius: 20px 20px 0 0; background: #000; }
                .video-container-admin { width: 100%; height: 100%; position: relative; }
                .story-img { width: 100%; height: 100%; background-size: cover; background-position: center; transition: 0.6s cubic-bezier(0.1, 0.7, 0.1, 1); }
                .story-video-preview { width: 100%; height: 100%; object-fit: cover; transition: 0.6s; opacity: 0.8; }
                .story-card-admin:hover .story-img { transform: scale(1.1); }
                .story-card-admin:hover .story-video-preview { transform: scale(1.05); opacity: 1; }
                
                .video-icon-indicator {
                  position: absolute; top: 12px; right: 12px; width: 24px; height: 24px;
                  background: rgba(0,0,0,0.5); backdrop-filter: blur(4px); border-radius: 50%;
                  display: flex; align-items: center; justify-content: center; z-index: 5;
                }

                .story-badges { position: absolute; top: 12px; left: 12px; z-index: 5; display: flex; flex-direction: column; gap: 6px; }
                .gender-pill { background: rgba(0,0,0,0.6); backdrop-filter: blur(8px); color: white; padding: 4px 10px; border-radius: 8px; font-size: 10px; font-weight: 900; text-transform: uppercase; width: fit-content; }
                .slides-pill { background: white; color: black; padding: 4px 10px; border-radius: 8px; font-size: 10px; font-weight: 900; text-transform: uppercase; width: fit-content; }

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
                .preview-img-box { width: 100%; height: 260px; border-radius: 20px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); background: #000; }
                .preview-img-actual { width: 100%; height: 100%; background-size: cover; background-position: center; }
                .full-preview-video { width: 100%; height: 100%; object-fit: contain; }

                .hidden-file-input { display: none; }
                .custom-upload-trigger {
                    display: flex; align-items: center; justify-content: center; padding: 16px;
                    border: 2px dashed rgba(255,255,255,0.1); border-radius: 16px;
                    color: white; font-weight: 800; cursor: pointer; transition: 0.3s;
                }
                .custom-upload-trigger:hover { background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.3); }
                
                .form-footer-modern { display: flex; justify-content: flex-end; gap: 16px; margin-top: 16px; }
                .btn-cancel-modern { background: none; border: none; color: #64748b; font-weight: 800; cursor: pointer; }
                .btn-submit-modern {
                    background: white; color: #0f172a; border: none; padding: 14px 32px; border-radius: 16px;
                    font-weight: 950; cursor: pointer; transition: 0.3s;
                }
                .btn-submit-modern:hover { transform: translateY(-3px); box-shadow: 0 15px 35px rgba(0,0,0,0.3); }

                .preview-img-box.mini-circle { width: 80px; height: 80px; border-radius: 50%; border: 3px solid white; box-shadow: 0 5px 15px rgba(0,0,0,0.2); }
                
                .slides-manager-section { margin-top: 32px; padding-top: 24px; border-top: 1px solid rgba(255,255,255,0.05); }
                .section-header-modern { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
                .section-info h4 { font-size: 16px; font-weight: 800; color: white; margin: 0; }
                .section-info p { font-size: 12px; color: #64748b; margin: 2px 0 0; font-weight: 600; }
                
                .btn-add-slide-mini {
                    background: rgba(255,255,255,0.1); color: white; padding: 6px 14px; border-radius: 8px;
                    font-size: 12px; font-weight: 800; cursor: pointer; display: flex; align-items: center; gap: 6px;
                    transition: 0.2s;
                }
                .btn-add-slide-mini:hover { background: white; color: black; }

                .slides-list-admin-mini { display: grid; grid-template-columns: repeat(auto-fill, minmax(130px, 1fr)); gap: 16px; max-height: 300px; overflow-y: auto; padding-right: 8px; }
                .slides-list-admin-mini::-webkit-scrollbar { width: 4px; }
                .slides-list-admin-mini::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 4px; }
                
                .slide-item-admin-mini { border-radius: 16px; padding: 10px; border: 1px solid rgba(255,255,255,0.05); }
                .slide-preview-mini { position: relative; width: 100%; height: 140px; border-radius: 12px; overflow: hidden; background: #000; margin-bottom: 8px; }
                .img-preview-mini, .video-preview-mini { width: 100%; height: 100%; background-size: cover; background-position: center; }
                .preview-vid { width: 100%; height: 100%; object-fit: cover; }
                .vid-icon { position: absolute; top: 8px; right: 8px; color: white; }
                .slide-order-badge { position: absolute; top: 8px; left: 8px; background: white; color: black; font-size: 10px; font-weight: 900; padding: 2px 6px; border-radius: 4px; }
                
                .slide-controls-mini { display: flex; justify-content: space-between; align-items: center; }
                .move-btns { display: flex; gap: 4px; }
                .move-btns button { 
                  background: rgba(255,255,255,0.05); border: none; color: white; width: 22px; height: 22px; 
                  border-radius: 4px; font-size: 10px; cursor: pointer; 
                }
                .move-btns button:hover:not(:disabled) { background: rgba(255,255,255,0.2); }
                .move-btns button:disabled { opacity: 0.3; cursor: not-allowed; }
                
                .btn-delete-slide-mini { background: #ef4444; border: none; color: white; padding: 5px; border-radius: 6px; cursor: pointer; transition: 0.2s; }
                .btn-delete-slide-mini:hover { transform: scale(1.1); }

                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
}
