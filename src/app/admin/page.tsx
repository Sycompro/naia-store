'use client';
import React from 'react';
import { Package, Image as ImageIcon, Users, TrendingUp } from 'lucide-react';

export default function AdminPage() {
    const stats = [
        { name: 'Productos', value: '12', icon: <Package size={24} />, color: '#FF7EB3' },
        { name: 'Historias', value: '6', icon: <ImageIcon size={24} />, color: '#4facfe' },
        { name: 'Visitas', value: '1.2k', icon: <TrendingUp size={24} />, color: '#00f2fe' },
        { name: 'Clientes', value: '85', icon: <Users size={24} />, color: '#a18cd1' },
    ];

    return (
        <div className="dashboard-container">
            <div className="stats-grid">
                {stats.map((stat) => (
                    <div key={stat.name} className="stat-card glass">
                        <div className="stat-icon" style={{ backgroundColor: stat.color + '20', color: stat.color }}>
                            {stat.icon}
                        </div>
                        <div className="stat-info">
                            <span className="stat-label">{stat.name}</span>
                            <span className="stat-value">{stat.value}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-sections">
                <div className="section glass">
                    <h3>Actividad Reciente</h3>
                    <p className="placeholder">Próximamente: Registro de ventas y visitas en tiempo real.</p>
                </div>
                <div className="section glass">
                    <h3>Accesos Rápidos</h3>
                    <div className="quick-actions">
                        <button className="btn btn-primary">Añadir Producto</button>
                        <button className="btn btn-outline" style={{ borderColor: '#333', color: '#333' }}>Subir Historia</button>
                    </div>
                </div>
            </div>

            <style jsx>{`
        .dashboard-container {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 20px;
        }
        .stat-card {
          padding: 24px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          gap: 20px;
        }
        .stat-icon {
          width: 50px;
          height: 50px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .stat-info {
          display: flex;
          flex-direction: column;
        }
        .stat-label {
          font-size: 14px;
          color: #888;
        }
        .stat-value {
          font-size: 24px;
          font-weight: 800;
        }
        .dashboard-sections {
            display: grid;
            grid-template-columns: 1.5fr 1fr;
            gap: 20px;
        }
        .section {
            padding: 24px;
            border-radius: 20px;
            min-height: 200px;
        }
        .section h3 {
            margin-bottom: 20px;
            font-size: 18px;
        }
        .placeholder {
            color: #888;
            font-style: italic;
        }
        .quick-actions {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .btn-outline {
            border: 2px solid #333;
            background: transparent;
        }
      `}</style>
        </div>
    );
}
