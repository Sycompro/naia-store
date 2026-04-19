'use client';
import React from 'react';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface AdminPageHeaderProps {
    title: string;
    breadcrumb: { label: string; href?: string }[];
    actions?: React.ReactNode;
}

export default function AdminPageHeader({ title, breadcrumb, actions }: AdminPageHeaderProps) {
    return (
        <div className="admin-page-header animate-fade-in">
            <div className="header-content">
                <nav className="breadcrumb-nav">
                    {breadcrumb.map((item, idx) => (
                        <React.Fragment key={idx}>
                            {item.href ? (
                                <Link href={item.href} className="breadcrumb-link">{item.label}</Link>
                            ) : (
                                <span className="breadcrumb-current">{item.label}</span>
                            )}
                            {idx < breadcrumb.length - 1 && <ChevronRight size={10} className="breadcrumb-sep" />}
                        </React.Fragment>
                    ))}
                </nav>
                <h2 className="header-title">{title}</h2>
            </div>
            {actions && <div className="header-actions">{actions}</div>}

            <style jsx>{`
                .admin-page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    margin-bottom: 35px;
                    padding: 0;
                }
                .header-content {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }
                .header-title {
                    font-size: 32px;
                    font-weight: 950;
                    color: #1e293b;
                    margin: 0;
                    letter-spacing: -1.2px;
                    line-height: 1;
                }
                .breadcrumb-nav {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }
                .breadcrumb-link {
                    font-size: 11px;
                    font-weight: 800;
                    color: #94a3b8;
                    text-decoration: none;
                    text-transform: uppercase;
                    transition: 0.3s;
                    letter-spacing: 0.5px;
                }
                .breadcrumb-link:hover {
                    color: #ec4899;
                }
                .breadcrumb-current {
                    font-size: 11px;
                    font-weight: 800;
                    color: #1e293b;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }
                .breadcrumb-sep {
                    color: #cbd5e1;
                }
                .header-actions {
                    display: flex;
                    gap: 15px;
                }
                @media (max-width: 768px) {
                    .admin-page-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 25px;
                    }
                    .header-title { font-size: 28px; }
                }
            `}</style>
        </div>
    );
}
