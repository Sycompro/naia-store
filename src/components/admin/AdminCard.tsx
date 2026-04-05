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
                    background: rgba(255, 255, 255, 0.03);
                    border: 1px solid rgba(255, 255, 255, 0.05);
                    border-radius: 24px;
                    padding: 24px;
                    transition: all 0.3s ease;
                }
                .admin-card:hover {
                    border-color: rgba(255, 255, 255, 0.1);
                    background: rgba(255, 255, 255, 0.04);
                }
                .card-header-admin {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    margin-bottom: 24px;
                    gap: 16px;
                }
                .header-info-with-icon {
                    display: flex;
                    gap: 16px;
                    align-items: flex-start;
                }
                .card-icon-container-admin {
                    width: 40px;
                    height: 40px;
                    border-radius: 12px;
                    background: rgba(255, 255, 255, 0.05);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    border: 1px solid rgba(255, 255, 255, 0.1);
                    flex-shrink: 0;
                }
                .header-text-admin {
                    display: flex;
                    flex-direction: column;
                }
                .card-title-admin {
                    font-size: 1.1rem;
                    font-weight: 800;
                    color: white;
                    margin: 0;
                    letter-spacing: -0.02em;
                }
                .card-desc-admin {
                    font-size: 0.85rem;
                    color: #64748b;
                    margin-top: 4px;
                }
                .card-actions-admin {
                    display: flex;
                    gap: 8px;
                }
                .card-body-admin {
                    width: 100%;
                }
            `}</style>
        </div>
    );
}
