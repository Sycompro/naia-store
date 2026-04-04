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
        <div className="settings-section">
            <div className="section-header">
                <h2>Configuración del Sistema</h2>
                <button
                    className={`save-settings-btn ${saving ? 'opacity-70' : ''}`}
                    onClick={handleSave}
                    disabled={saving}
                >
                    {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {saving ? 'Guardando...' : 'Guardar Cambios'}
                </button>
            </div>

            <div className="settings-grid">
                {/* General Store Info */}
                <div className="settings-card glass-premium animate-slide-up">
                    <div className="card-title">
                        <Globe size={18} /> Información de la Tienda
                    </div>
                    <div className="settings-form">
                        <div className="form-group">
                            <label>Nombre de la Empresa</label>
                            <input
                                type="text"
                                value={settings?.storeName || ''}
                                onChange={(e) => updateField('storeName', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Email de Soporte</label>
                            <input
                                type="email"
                                value={settings?.supportEmail || ''}
                                onChange={(e) => updateField('supportEmail', e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Dirección Principal</label>
                            <input
                                type="text"
                                value={settings?.mainAddress || ''}
                                onChange={(e) => updateField('mainAddress', e.target.value)}
                            />
                        </div>
                    </div>
                </div>

                {/* WhatsApp Integration */}
                <div className="settings-card glass-premium animate-slide-up" style={{ animationDelay: '0.1s' }}>
                    <div className="card-title">
                        <MessageSquare size={18} /> Integración WhatsApp Cloud API
                    </div>
                    <div className="whatsapp-status-box">
                        <div className="status-indicator">
                            <div className={`dot ${settings?.whatsappStatus === 'Conectado' ? 'pulse' : 'bg-red-500'}`}></div>
                            <span>Estado: <b>{settings?.whatsappStatus || 'Desconectado'}</b></span>
                        </div>
                        <div className="api-info">
                            <div className="info-item">
                                <label>Phone ID:</label>
                                <input
                                    className="minimal-input"
                                    type="text"
                                    value={settings?.whatsappPhoneId || ''}
                                    placeholder="...4567"
                                    onChange={(e) => updateField('whatsappPhoneId', e.target.value)}
                                />
                            </div>
                            <div className="info-item">
                                <label>Verify Token:</label>
                                <input
                                    className="minimal-input"
                                    type="text"
                                    value={settings?.whatsappVerifyToken || ''}
                                    placeholder="naia_secret_2024"
                                    onChange={(e) => updateField('whatsappVerifyToken', e.target.value)}
                                />
                            </div>
                        </div>
                        <button className="reconnect-btn">Probar Conexión</button>
                    </div>
                </div>

                {/* Security & Roles */}
                <div className="settings-card glass-premium animate-slide-up" style={{ animationDelay: '0.2s' }}>
                    <div className="card-title">
                        <Shield size={18} /> Seguridad y Accesos
                    </div>
                    <div className="security-settings">
                        <div className="security-item">
                            <div className="sec-text">
                                <span className="sec-label">Autenticación de 2 Factores</span>
                                <span className="sec-desc">Añade una capa extra de seguridad a tu cuenta.</span>
                            </div>
                            <div
                                className={`toggle ${settings?.twoFactorAuth ? 'active' : ''}`}
                                onClick={() => updateField('twoFactorAuth', !settings?.twoFactorAuth)}
                            ></div>
                        </div>
                        <div className="security-item">
                            <div className="sec-text">
                                <span className="sec-label">Logs de Actividad</span>
                                <span className="sec-desc">Ver quién ha accedido al panel recientemente.</span>
                            </div>
                            <button className="view-logs-btn">Ver Logs</button>
                        </div>
                    </div>
                </div>

                {/* Notifications */}
                <div className="settings-card glass-premium animate-slide-up" style={{ animationDelay: '0.3s' }}>
                    <div className="card-title">
                        <Bell size={18} /> Notificaciones
                    </div>
                    <div className="notification-options">
                        <label className="checkbox-wrap">
                            <input
                                type="checkbox"
                                checked={settings?.notifyOrderWS || false}
                                onChange={(e) => updateField('notifyOrderWS', e.target.checked)}
                            />
                            <span>Notificar nuevos pedidos vía WhatsApp</span>
                        </label>
                        <label className="checkbox-wrap">
                            <input
                                type="checkbox"
                                checked={settings?.notifyLowStockEmail || false}
                                onChange={(e) => updateField('notifyLowStockEmail', e.target.checked)}
                            />
                            <span>Alertas de stock bajo por Email</span>
                        </label>
                        <label className="checkbox-wrap">
                            <input
                                type="checkbox"
                                checked={settings?.weeklySalesSummary || false}
                                onChange={(e) => updateField('weeklySalesSummary', e.target.checked)}
                            />
                            <span>Resumen de ventas semanal</span>
                        </label>
                    </div>
                </div>
            </div>

            {/* Toast NOTIFICATION UI */}
            {toast && (
                <div className={`toast-notification glass-premium animate-toast ${toast.type}`}>
                    {toast.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    <span>{toast.message}</span>
                </div>
            )}

            <style jsx>{`
                .settings-section { display: flex; flex-direction: column; gap: 28px; }
                .section-header { display: flex; justify-content: space-between; align-items: center; }
                .section-header h2 { font-size: 24px; font-weight: 900; letter-spacing: -0.5px; color: #f8fafc; }

                .save-settings-btn { 
                    display: flex; align-items: center; gap: 8px; padding: 12px 24px; 
                    background: white; color: #0f172a; border: none; border-radius: 16px;
                    font-weight: 900; cursor: pointer; transition: 0.3s;
                }
                .save-settings-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(255,255,255,0.1); }
                .save-settings-btn:disabled { opacity: 0.7; cursor: not-allowed; }

                .settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
                
                .settings-card { 
                    padding: 24px; border-radius: 24px; background: rgba(255,255,255,0.03); 
                    display: flex; flex-direction: column; gap: 20px;
                    border: 1px solid rgba(255,255,255,0.05);
                }
                .card-title { display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 16px; color: #f1f5f9; }

                .settings-form { display: flex; flex-direction: column; gap: 16px; }
                .form-group { display: flex; flex-direction: column; gap: 8px; }
                .form-group label { font-size: 12px; font-weight: 800; color: #64748b; text-transform: uppercase; }
                .form-group input { 
                    padding: 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); 
                    font-weight: 600; color: #f8fafc; background: rgba(255,255,255,0.05); font-family: inherit;
                    transition: 0.3s;
                }
                .form-group input:focus { border-color: white; outline: none; background: rgba(255,255,255,0.08); }

                .whatsapp-status-box { 
                    padding: 20px; background: rgba(255,255,255,0.02); border-radius: 18px; 
                    display: flex; flex-direction: column; gap: 16px;
                    border: 1px solid rgba(255,255,255,0.05);
                }
                .status-indicator { display: flex; align-items: center; gap: 10px; font-size: 14px; color: #94a3b8; }
                .dot { width: 10px; height: 10px; border-radius: 50%; background: #22c55e; }
                .pulse { animation: pulseAnim 2s infinite; }
                @keyframes pulseAnim { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.5); opacity: 0.5; } 100% { transform: scale(1); opacity: 1; } }
                
                .api-info { display: flex; flex-direction: column; gap: 8px; }
                .info-item { display: flex; flex-direction: column; gap: 6px; font-size: 12px; }
                .info-item label { font-weight: 800; color: #64748b; }
                .minimal-input { 
                    background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 8px 12px; 
                    border-radius: 10px; font-weight: 700; color: #f8fafc; outline: none;
                }
                .minimal-input:focus { border-color: white; }

                .reconnect-btn { 
                    width: 100%; padding: 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1);
                    background: rgba(255,255,255,0.05); color: #f8fafc; font-weight: 800; cursor: pointer; transition: 0.3s;
                }
                .reconnect-btn:hover { background: white; color: #0f172a; }

                .security-item { display: flex; justify-content: space-between; align-items: center; }
                .sec-text { display: flex; flex-direction: column; gap: 2px; }
                .sec-label { font-weight: 800; font-size: 14px; color: #f1f5f9; }
                .sec-desc { font-size: 12px; color: #64748b; font-weight: 500; }

                .toggle { width: 44px; height: 24px; border-radius: 12px; background: rgba(255,255,255,0.1); position: relative; cursor: pointer; transition: 0.3s; }
                .toggle::after { content: ''; position: absolute; left: 4px; top: 4px; width: 16px; height: 16px; border-radius: 50%; background: white; transition: 0.3s; }
                .toggle.active { background: #22c55e; }
                .toggle.active::after { left: 24px; }

                .view-logs-btn { 
                    padding: 8px 16px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.1); 
                    background: rgba(255,255,255,0.05); font-size: 12px; font-weight: 800; cursor: pointer; color: #f8fafc;
                }

                .notification-options { display: flex; flex-direction: column; gap: 14px; }
                .checkbox-wrap { display: flex; align-items: center; gap: 12px; cursor: pointer; font-size: 14px; font-weight: 600; color: #94a3b8; }
                .checkbox-wrap input { width: 18px; height: 18px; border-radius: 6px; cursor: pointer; accent-color: white; }

                .toast-notification {
                    position: fixed; bottom: 30px; right: 30px; padding: 16px 24px;
                    border-radius: 20px; display: flex; align-items: center; gap: 12px;
                    color: #0f172a; font-weight: 800; box-shadow: 0 20px 40px rgba(0,0,0,0.4);
                    z-index: 1000;
                }
                .toast-notification.success { background: white; }
                .toast-notification.error { background: #ef4444; color: white; }

                @media (max-width: 1000px) { .settings-grid { grid-template-columns: 1fr; } }
                @media (max-width: 600px) { .section-header { flex-direction: column; align-items: stretch; gap: 15px; } }

                .animate-slide-up { animation: slideUp 0.6s backwards; }
                .animate-toast { animation: toastIn 0.4s cubic-bezier(0.1, 0.7, 0.1, 1); }
                .animate-spin { animation: spin 1s linear infinite; }

                @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes toastIn { from { transform: translateX(50px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

                @media (max-width: 1000px) { .settings-grid { grid-template-columns: 1fr; } }
            `}</style>
        </div>
    );
}
