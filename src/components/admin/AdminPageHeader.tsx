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
                            {idx < breadcrumb.length - 1 && <ChevronRight size={12} className="breadcrumb-sep" />}
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
                    margin-bottom: 20px;
                    padding: 0 5px;
                    list-style: none;
                }
                .admin-page-header :global(*) { list-style: none !important; }
                .header-content {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }
                .header-title {
                    font-size: 1.3rem;
                    font-weight: 950;
                    color: white;
                    margin: 0;
                    letter-spacing: -0.03em;
                }
                .breadcrumb-nav {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }
                .breadcrumb-link {
                    font-size: 10px;
                    font-weight: 800;
                    color: #64748b;
                    text-decoration: none;
                    text-transform: uppercase;
                    transition: 0.3s;
                }
                .breadcrumb-link:hover {
                    color: white;
                }
                .breadcrumb-current {
                    font-size: 10px;
                    font-weight: 800;
                    color: #94a3b8;
                    text-transform: uppercase;
                }
                .breadcrumb-sep {
                    color: #334155;
                }
                .header-actions {
                    display: flex;
                    gap: 12px;
                }
                @media (max-width: 768px) {
                    .admin-page-header {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 20px;
                    }
                }
            `}</style>
        </div>
    );
}
