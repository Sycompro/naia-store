'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { Settings, Globe, Shield, Bell, Save, MessageSquare, Info, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import AdminCard from './AdminCard';

function SettingsContent() {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

    const searchParams = useSearchParams();
    const router = useRouter();
    const activeTab = searchParams.get('tab') || 'general';

    useEffect(() => {
        fetchSettings();
    }, []);

    const fetchSettings = async () => {
        try {
            const res = await fetch('/api/admin/settings');
            if (res.ok) {
                const data = await res.json();
                setSettings(data);
            }
        } catch (error) {
            console.error('Error fetching settings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/admin/settings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
            if (res.ok) {
                showToast('Configuración guardada exitosamente', 'success');
            } else {
                showToast('Error al guardar la configuración', 'error');
            }
        } catch (error) {
            showToast('Error de conexión', 'error');
        } finally {
            setSaving(false);
        }
    };

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    const updateField = (field: string, value: any) => {
        setSettings({ ...settings, [field]: value });
    };

    const setTab = (tab: string) => {
        router.push(`/admin/config?tab=${tab}`);
    };

    const handleCheckWhatsApp = async () => {
        try {
            const res = await fetch('/api/admin/whatsapp/check');
            const data = await res.json();
            if (data.status === 'Conectado') {
                updateField('whatsappStatus', 'Conectado');
                showToast('Integración verificada correctamente', 'success');
            } else {
                updateField('whatsappStatus', 'Desconectado');
                showToast(data.message || 'Error en la configuración', 'error');
            }
        } catch (error) {
            showToast('Error al conectar con el servidor', 'error');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="animate-spin text-slate-400" size={32} />
            </div>
        );
    }

    return (
        <div className="settings-container-premium">
            <div className="settings-nav-tabs">
                <button
                    className={`tab-item ${activeTab === 'general' ? 'active' : ''}`}
                    onClick={() => setTab('general')}
                >
                    <Globe size={18} />
                    <span>General</span>
                </button>
                <button
                    className={`tab-item ${activeTab === 'whatsapp' ? 'active' : ''}`}
                    onClick={() => setTab('whatsapp')}
                >
                    <MessageSquare size={18} />
                    <span>WhatsApp API</span>
                </button>
                <button
                    className={`tab-item ${activeTab === 'security' ? 'active' : ''}`}
                    onClick={() => setTab('security')}
                >
                    <Shield size={18} />
                    <span>Seguridad</span>
                </button>
            </div>

            <div className="settings-header-fixed">
                <button
                    className={`save-btn-floating ${saving ? 'loading' : ''}`}
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    <span>{saving ? 'Guardando...' : 'Guardar Cambios'}</span>
                </button>
            </div>

            <div className="settings-tab-content animate-fade-in">
                {activeTab === 'general' && (
                    <div className="tab-pane">
                        <AdminCard
                            title="Información de la Tienda"
                            description="Identidad visual y contacto principal de Naia."
                            icon={<Globe size={20} />}
                        >
                            <div className="settings-form-content">
                                <div className="form-item-premium">
                                    <label>Nombre Comercial</label>
                                    <input
                                        type="text"
                                        value={settings?.storeName || ''}
                                        placeholder="Ej: Naia Beauty Store"
                                        onChange={(e) => updateField('storeName', e.target.value)}
                                    />
                                </div>
                                <div className="form-item-premium">
                                    <label>Correo de Soporte</label>
                                    <input
                                        type="email"
                                        value={settings?.supportEmail || ''}
                                        placeholder="soporte@naia.com"
                                        onChange={(e) => updateField('supportEmail', e.target.value)}
                                    />
                                </div>
                            </div>
                        </AdminCard>
                    </div>
                )}

                {activeTab === 'whatsapp' && (
                    <div className="tab-pane">
                        <AdminCard
                            title="WhatsApp Cloud API"
                            description="Configuración de mensajería automatizada."
                            icon={<MessageSquare size={20} />}
                            actions={
                                <div className={`status-mini-tag ${settings?.whatsappStatus === 'Conectado' ? 'on' : 'off'}`}>
                                    <div className={`dot-mini ${settings?.whatsappStatus === 'Conectado' ? 'on' : 'off'}`}></div>
                                    {settings?.whatsappStatus || 'Desconectado'}
                                </div>
                            }
                        >
                            <div className="settings-form-content">
                                <div className="api-dual-grid">
                                    <div className="form-item-premium">
                                        <label>Phone ID</label>
                                        <input
                                            type="text"
                                            value={settings?.whatsappPhoneId || ''}
                                            placeholder="ID de teléfono de Meta"
                                            onChange={(e) => updateField('whatsappPhoneId', e.target.value)}
                                        />
                                    </div>
                                    <div className="form-item-premium">
                                        <label>Verify Token</label>
                                        <input
                                            type="text"
                                            value={settings?.whatsappVerifyToken || ''}
                                            placeholder="Token de verificación"
                                            onChange={(e) => updateField('whatsappVerifyToken', e.target.value)}
                                        />
                                    </div>
                                </div>
                                <button className="test-action-btn" onClick={handleCheckWhatsApp}>Verificar Integración</button>
                            </div>
                        </AdminCard>

                        <div className="mt-6">
                            <AdminCard
                                title="Notificaciones Automáticas"
                                description="Gestión de alertas del sistema."
                                icon={<Bell size={20} />}
                            >
                                <div className="check-settings-grid">
                                    <label className="standard-check">
                                        <input
                                            type="checkbox"
                                            checked={settings?.notifyOrderWS || false}
                                            onChange={(e) => updateField('notifyOrderWS', e.target.checked)}
                                        />
                                        <div className="check-box-custom"></div>
                                        <span>Nuevos Pedidos vía WhatsApp</span>
                                    </label>
                                    <label className="standard-check">
                                        <input
                                            type="checkbox"
                                            checked={settings?.notifyLowStockEmail || false}
                                            onChange={(e) => updateField('notifyLowStockEmail', e.target.checked)}
                                        />
                                        <div className="check-box-custom"></div>
                                        <span>Alertas de Stock por Email</span>
                                    </label>
                                </div>
                            </AdminCard>
                        </div>
                    </div>
                )}

                {activeTab === 'security' && (
                    <div className="tab-pane">
                        <AdminCard
                            title="Seguridad y Auditoría"
                            description="Control interno y protección de datos."
                            icon={<Shield size={20} />}
                        >
                            <div className="security-settings-list">
                                <div className="toggle-item-premium">
                                    <div className="toggle-info">
                                        <b>Autenticación 2FA</b>
                                        <span>Solicitar código adicional al ingresar.</span>
                                    </div>
                                    <div
                                        className={`premium-toggle-ui ${settings?.twoFactorAuth ? 'checked' : ''}`}
                                        onClick={() => updateField('twoFactorAuth', !settings?.twoFactorAuth)}
                                    >
                                        <div className="toggle-thumb-ui"></div>
                                    </div>
                                </div>
                                <button className="full-width-action-btn">Explorar Logs Administrativos</button>
                            </div>
                        </AdminCard>
                    </div>
                )}
            </div>

            {toast && (
                <div className={`premium-toast animate-toast-in ${toast.type}`}>
                    {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    <span>{toast.message}</span>
                </div>
            )}

            <style jsx>{`
                .settings-container-premium { display: flex; flex-direction: column; gap: 0px; animation: fadeIn 0.4s ease-out; position: relative; }
                
                .settings-nav-tabs {
                    display: flex; gap: 8px; background: rgba(15, 23, 42, 0.4); 
                    padding: 6px; border-radius: 16px; border: 1px solid rgba(255, 255, 255, 0.05);
                    width: fit-content; margin-bottom: 28px !important;
                }
                .tab-item {
                    display: flex; align-items: center; gap: 10px; padding: 10px 20px;
                    border-radius: 12px; border: none; background: none; color: #64748b;
                    font-weight: 800; font-size: 14px; cursor: pointer; transition: 0.3s;
                }
                .tab-item:hover { color: white; background: rgba(255,255,255,0.03); }
                .tab-item.active { background: white; color: #0f172a; box-shadow: 0 10px 20px rgba(0,0,0,0.2); }

                .settings-header-fixed {
                    position: absolute; top: -75px; right: 0;
                }
                .save-btn-floating {
                    background: white; color: #0f172a; border: none; padding: 10px 24px; border-radius: 14px;
                    font-weight: 900; display: flex; align-items: center; gap: 10px; cursor: pointer; transition: 0.3s;
                    box-shadow: 0 10px 30px rgba(0,0,0,0.2);
                }
                .save-btn-floating:hover { transform: translateY(-2px); filter: brightness(1.1); }
                .save-btn-floating.loading { opacity: 0.5; }

                .settings-tab-content { display: block; }
                .tab-pane { animation: slideUp 0.4s cubic-bezier(0.1, 0.7, 0.1, 1); }

                .settings-form-content { display: flex; flex-direction: column; gap: 12px; }
                .form-item-premium { display: flex; flex-direction: column; gap: 6px; }
                .form-item-premium label { font-size: 10px; font-weight: 950; color: #475569; text-transform: uppercase; letter-spacing: 0.8px; }
                .form-item-premium input {
                    background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);
                    padding: 10px 14px; border-radius: 12px; color: white; font-weight: 600; outline: none; transition: 0.2s;
                    font-size: 14px;
                }
                .form-item-premium input:focus { border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.04); }

                .api-dual-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
                .test-action-btn {
                    padding: 10px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.05);
                    background: rgba(255,255,255,0.02); color: #64748b; font-weight: 800; cursor: pointer; transition: 0.3s;
                    font-size: 13px;
                }
                .test-action-btn:hover { background: rgba(255,255,255,0.05); color: white; }

                .status-mini-tag {
                    display: flex; align-items: center; gap: 6px; font-size: 10px; font-weight: 900; color: #10b981;
                    background: rgba(16, 185, 129, 0.1); padding: 4px 10px; border-radius: 20px;
                }
                .dot-mini { width: 5px; height: 5px; border-radius: 50%; background: #10b981; box-shadow: 0 0 10px #10b981; }

                .mt-6 { margin-top: 24px; }
                .security-settings-list { display: flex; flex-direction: column; gap: 20px; }
                .toggle-item-premium { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; }
                .toggle-info b { font-size: 16px; color: white; display: block; margin-bottom: 2px; }
                .toggle-info span { font-size: 13px; color: #64748b; font-weight: 600; }

                .premium-toggle-ui {
                    width: 48px; height: 26px; border-radius: 13px; background: rgba(255,255,255,0.05);
                    position: relative; cursor: pointer; transition: 0.3s;
                }
                .toggle-thumb-ui {
                    position: absolute; left: 4px; top: 4px; width: 18px; height: 18px;
                    border-radius: 50%; background: #475569; transition: 0.3s;
                }
                .premium-toggle-ui.checked { background: white; }
                .premium-toggle-ui.checked .toggle-thumb-ui { left: 26px; background: #0f172a; }

                .full-width-action-btn {
                    width: 100%; padding: 14px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.05);
                    background: rgba(255,255,255,0.02); color: white; font-weight: 800; cursor: pointer; transition: 0.3s;
                }
                .full-width-action-btn:hover { background: rgba(255,255,255,0.05); }

                .check-settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                .standard-check { display: flex; align-items: center; gap: 14px; cursor: pointer; color: #94a3b8; font-weight: 700; }
                .standard-check input { display: none; }
                .check-box-custom { width: 22px; height: 22px; border-radius: 7px; border: 2px solid rgba(255,255,255,0.1); position: relative; transition: 0.2s; }
                .standard-check input:checked + .check-box-custom { background: white; border-color: white; }
                .standard-check input:checked + .check-box-custom::after { content: '✓'; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: #0f172a; font-weight: 900; font-size: 13px; }

                .premium-toast {
                    position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%);
                    background: white; color: #0f172a; padding: 14px 28px; border-radius: 20px;
                    display: flex; align-items: center; gap: 12px; font-weight: 900;
                    box-shadow: 0 30px 60px rgba(0,0,0,0.5); z-index: 5000;
                }

                @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
            `}</style>
        </div>
    );
}

export default function AdminSettings() {
    return (
        <Suspense fallback={<div className="p-10 text-center">Cargando Ajustes...</div>}>
            <SettingsContent />
        </Suspense>
    );
}
