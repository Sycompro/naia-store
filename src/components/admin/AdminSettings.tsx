'use client';
import React, { useState, useEffect, Suspense } from 'react';
import { Settings, Globe, Shield, Bell, Save, MessageSquare, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
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
                <Loader2 className="animate-spin text-primary" size={32} />
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
                    className={`save-btn-premium ${saving ? 'loading' : ''}`}
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
                                    <label>WhatsApp de Compra Directa</label>
                                    <input
                                        type="text"
                                        value={settings?.buyWhatsAppNumber || ''}
                                        placeholder="Ej: 51944399377"
                                        onChange={(e) => updateField('buyWhatsAppNumber', e.target.value)}
                                    />
                                    <span className="field-hint">Incluye el código de país sin el signo +</span>
                                </div>
                            </div>
                        </AdminCard>
                    </div>
                )}

                {activeTab === 'whatsapp' && (
                    <div className="tab-pane">
                        <AdminCard
                            title="WhatsApp Cloud API"
                            description="Configuración de mensajería automatizada y notificaciones."
                            actions={
                                <div className={`status-pill-lite ${settings?.whatsappStatus === 'Conectado' ? 'on' : 'off'}`}>
                                    <div className="status-dot"></div>
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
                                <button className="secondary-action-btn" onClick={handleCheckWhatsApp}>Verificar Integración</button>
                            </div>
                        </AdminCard>

                        <div className="mt-7">
                            <AdminCard
                                title="Notificaciones del Sistema"
                                description="Gestión de alertas automáticas para clientes y administradores."
                            >
                                <div className="check-settings-grid">
                                    <label className="checkbox-item-premium">
                                        <input
                                            type="checkbox"
                                            checked={settings?.notifyOrderWS || false}
                                            onChange={(e) => updateField('notifyOrderWS', e.target.checked)}
                                        />
                                        <div className="custom-check"></div>
                                        <span>Nuevos Pedidos vía WhatsApp</span>
                                    </label>
                                    <label className="checkbox-item-premium">
                                        <input
                                            type="checkbox"
                                            checked={settings?.notifyLowStockEmail || false}
                                            onChange={(e) => updateField('notifyLowStockEmail', e.target.checked)}
                                        />
                                        <div className="custom-check"></div>
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
                            title="Seguridad de Acceso"
                            description="Configuración avanzada para la protección de la cuenta administrativa."
                        >
                            <div className="security-settings-list">
                                <div className="toggle-item-premium">
                                    <div className="toggle-info">
                                        <b>Autenticación en Dos Pasos (2FA)</b>
                                        <span>Protege tu cuenta con una capa extra de seguridad.</span>
                                    </div>
                                    <div
                                        className={`premium-toggle-ui ${settings?.twoFactorAuth ? 'checked' : ''}`}
                                        onClick={() => updateField('twoFactorAuth', !settings?.twoFactorAuth)}
                                    >
                                        <div className="toggle-thumb-ui"></div>
                                    </div>
                                </div>
                                <button className="outline-btn-premium">Ver Historial de Accesos</button>
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
                .settings-container-premium { display: flex; flex-direction: column; position: relative; }
                
                .settings-nav-tabs {
                    display: flex; gap: 8px; background: #f1f5f9; 
                    padding: 6px; border-radius: 18px; border: 1px solid #e2e8f0;
                    width: fit-content; margin-bottom: 35px;
                }
                .tab-item {
                    display: flex; align-items: center; gap: 10px; padding: 12px 24px;
                    border-radius: 14px; border: none; background: none; color: #64748b;
                    font-weight: 800; font-size: 14px; cursor: pointer; transition: 0.3s;
                }
                .tab-item:hover { color: #ec4899; }
                .tab-item.active { background: #ec4899; color: white; box-shadow: 0 10px 20px rgba(236, 72, 153, 0.2); }

                .settings-header-fixed {
                    position: absolute; top: -85px; right: 0;
                }
                .save-btn-premium {
                    background: #1e293b; color: white; border: none; padding: 12px 28px; border-radius: 16px;
                    font-weight: 900; display: flex; align-items: center; gap: 12px; cursor: pointer; transition: 0.3s;
                    box-shadow: 0 10px 30px rgba(30, 41, 59, 0.1);
                }
                .save-btn-premium:hover { transform: translateY(-2px); background: #0f172a; }
                .save-btn-premium.loading { opacity: 0.7; cursor: wait; }

                .tab-pane { animation: slideUp 0.4s cubic-bezier(0.1, 0.7, 0.1, 1); }

                .settings-form-content { display: flex; flex-direction: column; gap: 20px; }
                .form-item-premium { display: flex; flex-direction: column; gap: 8px; }
                .form-item-premium label { font-size: 11px; font-weight: 900; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; padding-left: 2px; }
                .form-item-premium input {
                    background: #f8fafc; border: 1px solid #e2e8f0;
                    padding: 14px 18px; border-radius: 16px; color: #1e293b; font-weight: 800; outline: none; transition: 0.3s;
                    font-size: 14px;
                }
                .form-item-premium input:focus { border-color: #ec4899; background: #fff; box-shadow: 0 0 0 4px rgba(236, 72, 153, 0.05); }
                .field-hint { font-size: 11px; color: #94a3b8; font-weight: 700; margin-top: 4px; padding-left: 2px; }

                .api-dual-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                .secondary-action-btn {
                    padding: 14px; border-radius: 16px; border: 1px solid #e2e8f0;
                    background: #fff; color: #64748b; font-weight: 800; cursor: pointer; transition: 0.3s;
                    font-size: 13px;
                }
                .secondary-action-btn:hover { border-color: #ec4899; color: #ec4899; background: #fdf2f8; }

                .status-pill-lite {
                    display: flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 900; color: #10b981;
                    background: #f0fdf4; padding: 6px 14px; border-radius: 100px; border: 1px solid #dcfce7;
                }
                .status-pill-lite.off { color: #f43f5e; background: #fff1f2; border-color: #ffe4e6; }
                .status-dot { width: 6px; height: 6px; border-radius: 50%; background: currentColor; box-shadow: 0 0 10px currentColor; }

                .mt-7 { margin-top: 28px; }
                .security-settings-list { display: flex; flex-direction: column; gap: 25px; }
                .toggle-item-premium { display: flex; justify-content: space-between; align-items: center; }
                .toggle-info b { font-size: 16px; color: #1e293b; display: block; margin-bottom: 2px; letter-spacing: -0.3px; }
                .toggle-info span { font-size: 13px; color: #94a3b8; font-weight: 600; }

                .premium-toggle-ui {
                    width: 54px; height: 30px; border-radius: 100px; background: #e2e8f0;
                    position: relative; cursor: pointer; transition: 0.3s;
                }
                .toggle-thumb-ui {
                    position: absolute; left: 4px; top: 4px; width: 22px; height: 22px;
                    border-radius: 50%; background: #fff; transition: 0.4s cubic-bezier(0.1, 0.7, 0.1, 1);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                }
                .premium-toggle-ui.checked { background: #ec4899; }
                .premium-toggle-ui.checked .toggle-thumb-ui { left: 28px; }

                .outline-btn-premium {
                    width: 100%; padding: 14px; border-radius: 16px; border: 1px solid #e2e8f0;
                    background: #fff; color: #1e293b; font-weight: 800; cursor: pointer; transition: 0.3s;
                }
                .outline-btn-premium:hover { border-color: #1e293b; }

                .check-settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
                .checkbox-item-premium { display: flex; align-items: center; gap: 14px; cursor: pointer; color: #475569; font-weight: 800; font-size: 14px; }
                .checkbox-item-premium input { display: none; }
                .custom-check { width: 24px; height: 24px; border-radius: 8px; border: 2px solid #e2e8f0; position: relative; transition: 0.2s; background: #f8fafc; }
                .checkbox-item-premium input:checked + .custom-check { background: #ec4899; border-color: #ec4899; }
                .checkbox-item-premium input:checked + .custom-check::after { content: '✓'; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; color: #fff; font-weight: 900; font-size: 14px; }

                .premium-toast {
                    position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%);
                    background: #1e293b; color: #fff; padding: 16px 32px; border-radius: 24px;
                    display: flex; align-items: center; gap: 15px; font-weight: 800;
                    box-shadow: 0 30px 60px rgba(0,0,0,0.2); z-index: 5000;
                }
                .premium-toast.success { background: #1e293b; }
                .premium-toast.error { background: #f43f5e; }

                @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes toastIn { from { opacity: 0; transform: translate(-50%, 20px); } to { opacity: 1; transform: translate(-50%, 0); } }
                .animate-toast-in { animation: toastIn 0.4s cubic-bezier(0.1, 0.7, 0.1, 1); }
            `}</style>
        </div>
    );
}

export default function AdminSettings() {
    return (
        <Suspense fallback={<div className="p-10 text-center font-bold text-slate-400">Preparando Configuración...</div>}>
            <SettingsContent />
        </Suspense>
    );
}
