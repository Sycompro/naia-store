'use client';
import React, { useState } from 'react';
import { Settings, Globe, Shield, Bell, Save, MessageSquare, Info } from 'lucide-react';

export default function AdminSettings() {
    const [storeName, setStoreName] = useState('Naia Beauty Store');
    const [whatsappStatus, setWhatsappStatus] = useState('Conectado');

    return (
        <div className="settings-section">
            <div className="section-header">
                <h2>Configuración del Sistema</h2>
                <button className="save-settings-btn"><Save size={18} /> Guardar Cambios</button>
            </div>

            <div className="settings-grid">
                {/* General Store Info */}
                <div className="settings-card glass-premium">
                    <div className="card-title">
                        <Globe size={18} /> Información de la Tienda
                    </div>
                    <div className="settings-form">
                        <div className="form-group">
                            <label>Nombre de la Empresa</label>
                            <input
                                type="text"
                                value={storeName}
                                onChange={(e) => setStoreName(e.target.value)}
                            />
                        </div>
                        <div className="form-group">
                            <label>Email de Soporte</label>
                            <input type="email" value="soporte@naia.com" readOnly />
                        </div>
                        <div className="form-group">
                            <label>Dirección Principal</label>
                            <input type="text" value="Av. Principal 123, Lima, Perú" readOnly />
                        </div>
                    </div>
                </div>

                {/* WhatsApp Integration */}
                <div className="settings-card glass-premium">
                    <div className="card-title">
                        <MessageSquare size={18} /> Integración WhatsApp Cloud API
                    </div>
                    <div className="whatsapp-status-box">
                        <div className="status-indicator">
                            <div className="dot pulse"></div>
                            <span>Estado: <b>{whatsappStatus}</b></span>
                        </div>
                        <div className="api-info">
                            <div className="info-item">
                                <label>Phone ID:</label>
                                <code>...4567</code>
                            </div>
                            <div className="info-item">
                                <label>Verify Token:</label>
                                <code>naia_secret_2024</code>
                            </div>
                        </div>
                        <button className="reconnect-btn">Probar Conexión</button>
                    </div>
                </div>

                {/* Security & Roles */}
                <div className="settings-card glass-premium">
                    <div className="card-title">
                        <Shield size={18} /> Seguridad y Accesos
                    </div>
                    <div className="security-settings">
                        <div className="security-item">
                            <div className="sec-text">
                                <span className="sec-label">Autenticación de 2 Factores</span>
                                <span className="sec-desc">Añade una capa extra de seguridad a tu cuenta.</span>
                            </div>
                            <div className="toggle active"></div>
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
                <div className="settings-card glass-premium">
                    <div className="card-title">
                        <Bell size={18} /> Notificaciones
                    </div>
                    <div className="notification-options">
                        <label className="checkbox-wrap">
                            <input type="checkbox" defaultChecked />
                            <span>Notificar nuevos pedidos vía WhatsApp</span>
                        </label>
                        <label className="checkbox-wrap">
                            <input type="checkbox" defaultChecked />
                            <span>Alertas de stock bajo por Email</span>
                        </label>
                        <label className="checkbox-wrap">
                            <input type="checkbox" />
                            <span>Resumen de ventas semanal</span>
                        </label>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .settings-section { display: flex; flex-direction: column; gap: 28px; animation: slideUp 0.6s; }
                .section-header { display: flex; justify-content: space-between; align-items: center; }
                .section-header h2 { font-size: 24px; font-weight: 900; letter-spacing: -0.5px; }

                .save-settings-btn { 
                    display: flex; align-items: center; gap: 8px; padding: 12px 24px; 
                    background: #0f172a; color: white; border: none; border-radius: 16px;
                    font-weight: 800; cursor: pointer; transition: 0.3s;
                    box-shadow: 0 10px 20px rgba(15, 23, 42, 0.2);
                }
                .save-settings-btn:hover { transform: translateY(-2px); filter: brightness(1.2); }

                .settings-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
                
                .settings-card { 
                    padding: 24px; border-radius: 24px; background: white; 
                    display: flex; flex-direction: column; gap: 20px;
                }
                .card-title { display: flex; align-items: center; gap: 10px; font-weight: 800; font-size: 16px; color: #0f172a; }

                .settings-form { display: flex; flex-direction: column; gap: 16px; }
                .form-group { display: flex; flex-direction: column; gap: 8px; }
                .form-group label { font-size: 12px; font-weight: 800; color: #64748b; text-transform: uppercase; }
                .form-group input { 
                    padding: 12px; border-radius: 12px; border: 1px solid #e2e8f0; 
                    font-weight: 600; color: #0f172a; font-family: inherit;
                }

                .whatsapp-status-box { 
                    padding: 20px; background: #f8fafc; border-radius: 18px; 
                    display: flex; flex-direction: column; gap: 16px;
                }
                .status-indicator { display: flex; align-items: center; gap: 10px; font-size: 14px; }
                .dot { width: 10px; height: 10px; border-radius: 50%; background: #22c55e; }
                .pulse { animation: pulseAnim 2s infinite; }
                @keyframes pulseAnim { 0% { transform: scale(1); opacity: 1; } 50% { transform: scale(1.5); opacity: 0.5; } 100% { transform: scale(1); opacity: 1; } }
                
                .api-info { display: flex; flex-direction: column; gap: 8px; }
                .info-item { display: flex; justify-content: space-between; font-size: 12px; }
                .info-item label { font-weight: 800; color: #64748b; }
                .info-item code { background: #e2e8f0; padding: 2px 6px; border-radius: 4px; font-weight: 700; }

                .reconnect-btn { 
                    width: 100%; padding: 10px; border-radius: 12px; border: 1px solid #0f172a;
                    background: transparent; color: #0f172a; font-weight: 800; cursor: pointer; transition: 0.3s;
                }
                .reconnect-btn:hover { background: #0f172a; color: white; }

                .security-item { display: flex; justify-content: space-between; align-items: center; }
                .sec-text { display: flex; flex-direction: column; gap: 2px; }
                .sec-label { font-weight: 800; font-size: 14px; }
                .sec-desc { font-size: 12px; color: #64748b; font-weight: 500; }

                .toggle { width: 44px; height: 24px; border-radius: 12px; background: #e2e8f0; position: relative; cursor: pointer; }
                .toggle::after { content: ''; position: absolute; left: 4px; top: 4px; width: 16px; height: 16px; border-radius: 50%; background: white; transition: 0.3s; }
                .toggle.active { background: #0f172a; }
                .toggle.active::after { left: 24px; }

                .view-logs-btn { 
                    padding: 6px 14px; border-radius: 10px; border: 1px solid #e2e8f0; 
                    background: white; font-size: 12px; font-weight: 800; cursor: pointer;
                }

                .notification-options { display: flex; flex-direction: column; gap: 14px; }
                .checkbox-wrap { display: flex; align-items: center; gap: 12px; cursor: pointer; font-size: 14px; font-weight: 600; color: #334155; }
                .checkbox-wrap input { width: 18px; height: 18px; border-radius: 6px; cursor: pointer; }

                @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }

                @media (max-width: 1000px) { .settings-grid { grid-template-columns: 1fr; } }
            `}</style>
        </div>
    );
}
