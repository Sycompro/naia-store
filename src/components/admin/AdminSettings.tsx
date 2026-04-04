'use client';
import React, { useState, useEffect } from 'react';
import { Settings, Globe, Shield, Bell, Save, MessageSquare, Info, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminSettings() {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);

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

    if (loading) {
        return (
            <div className="flex items-center justify-center p-20">
                <Loader2 className="animate-spin text-slate-400" size={32} />
            </div>
        );
    }

    return (
        <div className="settings-container">
            <div className="section-header">
                <div>
                    <h2>Configuración del Sistema</h2>
                    <p className="subtitle">Gestione la identidad de su tienda y las integraciones de seguridad.</p>
                </div>
                <button
                    className={`save-settings-btn-premium ${saving ? 'loading' : ''}`}
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                    <span>{saving ? 'Guardando cambios...' : 'Guardar Configuración'}</span>
                </button>
            </div>

            <div className="settings-grid-layout">
                {/* General Store Info */}
                <div className="settings-card-glass animate-slide-up" id="general">
                    <div className="card-header-premium">
                        <div className="icon-box"><Globe size={20} /></div>
                        <h3>Información General</h3>
                    </div>
                    <div className="settings-form-premium">
                        <div className="form-item">
                            <label>Nombre Comercial</label>
                            <input
                                type="text"
                                value={settings?.storeName || ''}
                                placeholder="Ej: Naia Beauty Store"
                                onChange={(e) => updateField('storeName', e.target.value)}
                            />
                        </div>
                        <div className="form-item">
                            <label>Correo de Soporte</label>
                            <input
                                type="email"
                                value={settings?.supportEmail || ''}
                                placeholder="soporte@naia.com"
                                onChange={(e) => updateField('supportEmail', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* WhatsApp Integration */}
                <div className="settings-card-glass animate-slide-up" id="whatsapp" style={{ animationDelay: '0.1s' }}>
                    <div className="card-header-premium">
                        <div className="icon-box whatsapp"><MessageSquare size={20} /></div>
                        <h3>WhatsApp Cloud API</h3>
                    </div>
                    <div className="whatsapp-control-panel">
                        <div className="status-banner">
                            <div className={`status-dot ${settings?.whatsappStatus === 'Conectado' ? 'online' : 'offline'}`}></div>
                            <span>Servicio: <b>{settings?.whatsappStatus || 'Desconectado'}</b></span>
                        </div>
                        <div className="api-fields-grid">
                            <div className="form-item">
                                <label>Phone ID</label>
                                <input
                                    type="text"
                                    value={settings?.whatsappPhoneId || ''}
                                    placeholder="ID de teléfono de Meta"
                                    onChange={(e) => updateField('whatsappPhoneId', e.target.value)}
                                />
                            </div>
                            <div className="form-item">
                                <label>Verify Token</label>
                                <input
                                    type="text"
                                    value={settings?.whatsappVerifyToken || ''}
                                    placeholder="Token de verificación"
                                    onChange={(e) => updateField('whatsappVerifyToken', e.target.value)}
                                />
                            </div>
                        </div>
                        <button className="test-conn-btn">Verificar Conexión</button>
                    </div>
                </div>

                {/* Security */}
                <div className="settings-card-glass animate-slide-up" id="security" style={{ animationDelay: '0.2s' }}>
                    <div className="card-header-premium">
                        <div className="icon-box security"><Shield size={20} /></div>
                        <h3>Seguridad y Control</h3>
                    </div>
                    <div className="security-list">
                        <div className="control-item">
                            <div className="control-info">
                                <h4>Autenticación 2FA</h4>
                                <p>Solicitar código adicional al ingresar.</p>
                            </div>
                            <div
                                className={`custom-toggle ${settings?.twoFactorAuth ? 'on' : ''}`}
                                onClick={() => updateField('twoFactorAuth', !settings?.twoFactorAuth)}
                            >
                                <div className="toggle-thumb"></div>
                            </div>
                        </div>
                        <div className="control-item">
                            <div className="control-info">
                                <h4>Logs Administrativos</h4>
                                <p>Registro histórico de todas las acciones.</p>
                            </div>
                            <button className="secondary-action-btn">Explorar Logs</button>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="settings-card-glass animate-slide-up" id="notifications" style={{ animationDelay: '0.3s' }}>
                    <div className="card-header-premium">
                        <div className="icon-box notifications"><Bell size={20} /></div>
                        <h3>Alertas de Sistema</h3>
                    </div>
                    <div className="notification-grid-p">
                        <label className="premium-check">
                            <input
                                type="checkbox"
                                checked={settings?.notifyOrderWS || false}
                                onChange={(e) => updateField('notifyOrderWS', e.target.checked)}
                            />
                            <div className="check-box-ui"></div>
                            <span>Pedidos vía WhatsApp</span>
                        </label>
                        <label className="premium-check">
                            <input
                                type="checkbox"
                                checked={settings?.notifyLowStockEmail || false}
                                onChange={(e) => updateField('notifyLowStockEmail', e.target.checked)}
                            />
                            <div className="check-box-ui"></div>
                            <span>Alertas Stock Bajo</span>
                        </label>
                    </div>
                </div>
            </div>

            {toast && (
                <div className={`premium-toast animate-toast-in ${toast.type}`}>
                    {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    <span>{toast.message}</span>
                </div>
            )}

            <style jsx>{`
                .settings-container { display: flex; flex-direction: column; gap: 40px; animation: fadeIn 0.8s cubic-bezier(0.1, 0.7, 0.1, 1); }
                .section-header { display: flex; justify-content: space-between; align-items: center; }
                .section-header h2 { font-size: 28px; font-weight: 950; letter-spacing: -1px; color: white; margin-bottom: 4px; }
                .subtitle { color: #64748b; font-size: 14px; font-weight: 600; }

                .save-settings-btn-premium {
                    background: white; color: #0f172a; border: none; padding: 14px 28px; border-radius: 16px;
                    font-weight: 900; display: flex; align-items: center; gap: 12px; cursor: pointer; transition: 0.4s;
                }
                .save-settings-btn-premium:hover { transform: translateY(-4px); box-shadow: 0 20px 40px rgba(255,255,255,0.1); }
                .save-settings-btn-premium.loading { opacity: 0.6; transform: none; }

                .settings-grid-layout { display: grid; grid-template-columns: repeat(2, 1fr); gap: 32px; }

                .settings-card-glass {
                    background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(40px);
                    border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 32px; padding: 32px;
                    display: flex; flex-direction: column; gap: 28px; transition: 0.4s;
                }
                .settings-card-glass:hover { border-color: rgba(255,255,255,0.1); background: rgba(15, 23, 42, 0.5); }

                .card-header-premium { display: flex; align-items: center; gap: 16px; }
                .icon-box {
                    width: 48px; height: 48px; border-radius: 14px; background: rgba(255,255,255,0.03);
                    display: flex; align-items: center; justify-content: center; color: #94a3b8;
                    border: 1px solid rgba(255,255,255,0.05);
                }
                .icon-box.whatsapp { color: #10b981; background: rgba(16, 185, 129, 0.05); }
                .icon-box.security { color: #3b82f6; background: rgba(59, 130, 246, 0.05); }
                .icon-box.notifications { color: #f59e0b; background: rgba(245, 158, 11, 0.05); }
                .card-header-premium h3 { font-size: 18px; font-weight: 900; color: white; letter-spacing: -0.3px; }

                .settings-form-premium { display: flex; flex-direction: column; gap: 20px; }
                .form-item { display: flex; flex-direction: column; gap: 10px; }
                .form-item label { font-size: 11px; font-weight: 900; color: #475569; text-transform: uppercase; letter-spacing: 0.5px; }
                .form-item input {
                    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
                    padding: 14px 18px; border-radius: 14px; color: white; font-weight: 600; outline: none; transition: 0.3s;
                }
                .form-item input:focus { background: rgba(255,255,255,0.06); border-color: white; }

                .whatsapp-control-panel { display: flex; flex-direction: column; gap: 24px; }
                .status-banner {
                    background: rgba(0,0,0,0.2); padding: 16px 20px; border-radius: 16px;
                    display: flex; align-items: center; gap: 12px; font-size: 14px; color: #94a3b8;
                    border: 1px solid rgba(255,255,255,0.03);
                }
                .status-dot { width: 10px; height: 10px; border-radius: 50%; }
                .status-dot.online { background: #10b981; box-shadow: 0 0 15px rgba(16, 185, 129, 0.5); animation: pulse 2s infinite; }
                .status-dot.offline { background: #ef4444; }

                .api-fields-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
                .test-conn-btn {
                    padding: 14px; border-radius: 14px; border: 1px solid rgba(255,255,255,0.1);
                    background: transparent; color: white; font-weight: 800; cursor: pointer; transition: 0.3s;
                }
                .test-conn-btn:hover { background: rgba(255,255,255,0.05); }

                .security-list { display: flex; flex-direction: column; gap: 24px; }
                .control-item { display: flex; justify-content: space-between; align-items: center; }
                .control-info h4 { font-size: 15px; font-weight: 800; color: #f1f5f9; margin-bottom: 2px; }
                .control-info p { font-size: 12px; color: #64748b; font-weight: 600; }

                .custom-toggle {
                    width: 48px; height: 26px; border-radius: 13px; background: rgba(255,255,255,0.05);
                    position: relative; cursor: pointer; transition: 0.4s cubic-bezier(0.1, 0.7, 0.1, 1);
                    border: 1px solid rgba(255,255,255,0.05);
                }
                .toggle-thumb {
                    position: absolute; left: 4px; top: 4px; width: 18px; height: 18px;
                    border-radius: 50%; background: #64748b; transition: 0.4s;
                }
                .custom-toggle.on { background: white; }
                .custom-toggle.on .toggle-thumb { left: 26px; background: #0f172a; }

                .secondary-action-btn {
                    padding: 10px 20px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);
                    background: rgba(255,255,255,0.03); color: white; font-size: 13px; font-weight: 800; cursor: pointer;
                }

                .notification-grid-p { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
                .premium-check { display: flex; align-items: center; gap: 12px; cursor: pointer; color: #94a3b8; font-weight: 600; font-size: 14px; }
                .premium-check input { display: none; }
                .check-box-ui { 
                    width: 22px; height: 22px; border-radius: 8px; border: 2px solid rgba(255,255,255,0.1); 
                    position: relative; transition: 0.3s;
                }
                .premium-check input:checked + .check-box-ui { background: white; border-color: white; }
                .premium-check input:checked + .check-box-ui::after { 
                    content: '✓'; position: absolute; inset: 0; display: flex; align-items: center; justify-content: center;
                    color: #0f172a; font-weight: 900; font-size: 12px;
                }

                .premium-toast {
                    position: fixed; bottom: 40px; left: 50%; transform: translateX(-50%);
                    background: white; color: #0f172a; padding: 16px 32px; border-radius: 24px;
                    display: flex; align-items: center; gap: 14px; font-weight: 900;
                    box-shadow: 0 30px 60px rgba(0,0,0,0.5); z-index: 5000;
                }
                .premium-toast.error { background: #ef4444; color: white; }

                @keyframes pulse { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.4); opacity: 0.4; } 100% { transform: scale(1); opacity: 1; } }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes toastIn { from { bottom: -20px; opacity: 0; } to { bottom: 40px; opacity: 1; } }

                @media (max-width: 1024px) { .settings-grid-layout { grid-template-columns: 1fr; } }
            `}</style>
        </div>
    );
}
