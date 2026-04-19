'use client';
import React from 'react';

interface AdminCardProps {
    children: React.ReactNode;
    title?: string;
    description?: string;
    actions?: React.ReactNode;
    icon?: React.ReactNode;
    className?: string;
    padding?: string;
}

export default function AdminCard({ children, title, description, actions, icon, className = '', padding }: AdminCardProps) {
    return (
        <div className={`admin-card glass-premium-admin ${className}`}>
            {(title || actions || icon) && (
                <div className="card-header-admin">
                    <div className="header-info-with-icon">
                        {icon && <div className="card-icon-container-admin">{icon}</div>}
                        <div className="header-text-admin">
                            {title && <h3 className="card-title-admin">{title}</h3>}
                            {description && <p className="card-desc-admin">{description}</p>}
                        </div>
                    </div>
                    {actions && <div className="card-actions-admin">{actions}</div>}
                </div>
            )}
            <div className="card-body-admin" style={padding !== undefined ? { padding } : {}}>
                {children}
            </div>

            <style jsx>{`
                .admin-card {
                    background: #fff;
                    border: 1px solid #f1f5f9;
                    border-radius: 24px;
                    padding: 30px;
                    transition: all 0.3s ease;
                    box-shadow: 0 10px 30px -5px rgba(0,0,0,0.02), 0 4px 10px -2px rgba(0,0,0,0.01);
                }
                .admin-card:hover {
                    box-shadow: 0 20px 40px -10px rgba(0,0,0,0.05);
                    transform: translateY(-2px);
                }
                .card-header-admin {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 25px;
                    gap: 15px;
                }
                .header-info-with-icon {
                    display: flex;
                    gap: 18px;
                    align-items: flex-start;
                }
                .card-icon-container-admin {
                    width: 42px;
                    height: 42px;
                    border-radius: 12px;
                    background: #f8fafc;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #1e293b;
                    border: 1px solid #f1f5f9;
                    flex-shrink: 0;
                }
                .header-text-admin {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                .card-title-admin {
                    font-size: 20px;
                    font-weight: 800;
                    color: #1e293b;
                    margin: 0;
                    letter-spacing: -0.5px;
                }
                .card-desc-admin {
                    font-size: 14px;
                    color: #94a3b8;
                    font-weight: 500;
                }
                .card-actions-admin {
                    display: flex;
                    gap: 12px;
                }
                .card-body-admin {
                    width: 100%;
                }
            `}</style>
        </div>
    );
}
