'use client';
import React, { useState, useEffect, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Search, Plus, Minus, Send, FileText, Download, Building2, Shield, ShoppingBag, Hash, Briefcase, User, CreditCard } from 'lucide-react';
import Link from 'next/link';
import CustomSelect from '@/components/CustomSelect';

interface Product {
    id: number;
    name: string;
    description: string;
    wholesalePrice: number;
    presentation: string;
    category: string;
    barcode?: string;
}

function B2BContent() {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [orderQuantities, setOrderQuantities] = useState<Record<number, number>>({});
    const [loading, setLoading] = useState(true);
    const [isRFQOpen, setIsRFQOpen] = useState(false);
    const [rfqSuccess, setRfqSuccess] = useState(false);
    const [showOnlySelected, setShowOnlySelected] = useState(false);
    const [paymentCondition, setPaymentCondition] = useState('net30');

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await fetch('/api/products?limit=100');
            const data = await response.json();
            setProducts(data.products || []);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching products:', error);
            setLoading(false);
        }
    };

    const handleQuantityChange = (id: number, val: string) => {
        const num = parseInt(val, 10);
        if (isNaN(num) || num < 0) return;
        setOrderQuantities(prev => ({ ...prev, [id]: num }));
    };

    const increment = (id: number) => {
        setOrderQuantities(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    };

    const decrement = (id: number) => {
        setOrderQuantities(prev => {
            const current = prev[id] || 0;
            if (current <= 1) {
                const newQ = { ...prev };
                delete newQ[id];
                return newQ;
            }
            return { ...prev, [id]: current - 1 };
        });
    };

    const baseFiltered = products.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.barcode && p.barcode.includes(searchTerm))
    );

    const orderedItems = products.filter(p => orderQuantities[p.id] > 0);
    const displayProducts = showOnlySelected ? baseFiltered.filter(p => orderQuantities[p.id] > 0) : baseFiltered;

    const handleRFQSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setRfqSuccess(true);
        setTimeout(() => {
            setIsRFQOpen(false);
            setRfqSuccess(false);
            setOrderQuantities({});
        }, 4000);
    };

    const subtotal = orderedItems.reduce((sum, p) => sum + (p.wholesalePrice * orderQuantities[p.id]), 0);

    // Auto-disable filter if no items are selected
    useEffect(() => {
        if (orderedItems.length === 0 && showOnlySelected) {
            setShowOnlySelected(false);
        }
    }, [orderedItems.length, showOnlySelected]);

    return (
        <div className="b2b-layout premium-mesh">
            <div className="b2b-header">
                <div className="container">
                    <div className="header-content">
                        <div>
                            <span className="premium-tag"><Building2 size={14} style={{ display: 'inline', marginRight: 6 }} /> Naia Enterprise</span>
                            <h1 className="b2b-title">Portal de <span className="text-gradient">Distribuidores</span></h1>
                            <p className="b2b-subtitle">Sistema de adquisiciones B2B de alta frecuencia.</p>
                        </div>
                        <div className="b2b-search-wrapper">
                            <div className="b2b-search-icon">
                                <Search size={16} />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar SKU o nombre..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="b2b-search-input"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container b2b-main">
                <div className="b2b-panel animate-entrance">

                    <div className="b2b-toolbar">
                        <div className="toolbar-stats">
                            <span>{displayProducts.length} Productos {showOnlySelected ? 'Seleccionados' : 'Disponibles'}</span>
                        </div>
                        <div className="toolbar-actions">
                            <button className="btn-sds"><Download size={16} /> Catálogo PDF</button>
                        </div>
                    </div>

                    <div className="b2b-table-wrapper">
                        <table className="b2b-table">
                            <thead>
                                <tr>
                                    <th style={{ width: '12%' }}>SKU / COD</th>
                                    <th style={{ width: '25%' }}>Producto</th>
                                    <th className="text-center" style={{ width: '10%' }}>Categoría</th>
                                    <th className="text-center" style={{ width: '10%' }}>Formato</th>
                                    <th className="text-center" style={{ width: '8%' }}>Ficha Tec.</th>
                                    <th className="text-right" style={{ width: '12%' }}>Mayorista</th>
                                    <th className="text-center" style={{ width: '11%' }}>Inventario</th>
                                    <th className="text-center" style={{ width: '12%' }}>Unidades</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr><td colSpan={8} className="text-center py-10"><div className="p-loader mx-auto"></div></td></tr>
                                ) : displayProducts.length === 0 ? (
                                    <tr><td colSpan={8} className="text-center py-10"><div className="empty-quote-v2" style={{ color: 'var(--slate-400)' }}><ShoppingBag size={32} opacity={0.3} /><p>No se encontraron productos.</p></div></td></tr>
                                ) : displayProducts.map(product => {
                                    const qty = orderQuantities[product.id] || 0;
                                    const isSelected = qty > 0;
                                    return (
                                        <tr key={product.id} className={`grid-row ${isSelected ? 'row-selected' : ''}`}>
                                            <td className="sku-cell"><span className="sku-badge">{product.barcode || `NAIA-${product.id.toString().padStart(4, '0')}`}</span></td>
                                            <td className="name-cell">
                                                <div className="product-name-flex">
                                                    <strong>{product.name}</strong>
                                                    {isSelected && <span className="active-dot"></span>}
                                                </div>
                                            </td>
                                            <td className="text-center"><span className="cat-pill">{product.category}</span></td>
                                            <td className="text-slate text-center">{product.presentation}</td>
                                            <td className="text-center"><a href="#" className="sds-link"><FileText size={14} /> SDS</a></td>
                                            <td className="price-cell text-right">S/ {Number(product.wholesalePrice).toFixed(2)}</td>
                                            <td className="text-center">
                                                <div className="stock-wrapper">
                                                    <span className="dot bg-green"></span> <span>Stock Alto</span>
                                                </div>
                                            </td>
                                            <td className="text-center">
                                                <div className={`qty-pill ${isSelected ? 'qty-active' : ''}`}>
                                                    <button onClick={() => decrement(product.id)}><Minus size={14} /></button>
                                                    <input
                                                        type="number"
                                                        value={qty || ''}
                                                        onChange={(e) => handleQuantityChange(product.id, e.target.value)}
                                                        placeholder="0"
                                                    />
                                                    <button onClick={() => increment(product.id)}><Plus size={14} /></button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {orderedItems.length > 0 && (
                        <div className="b2b-panel-footer animate-entrance">
                            <div className="floating-info">
                                <div className="floating-qty">{orderedItems.length} SKUs Seleccionados</div>
                                <div className="floating-total">S/ {(subtotal * 1.18).toFixed(2)} <span>(Inc. IGV)</span></div>
                            </div>

                            <div className="floating-divider"></div>

                            <div className="floating-buttons">
                                <button className="btn-view-selected" onClick={() => setShowOnlySelected(!showOnlySelected)}>
                                    {showOnlySelected ? 'Ver Catálogo Completo' : 'Ver Sólo Seleccionados'}
                                </button>
                                <button className="btn-premium btn-action-pill" onClick={() => setIsRFQOpen(true)}>
                                    <Send size={16} /> Solicitar Cotización
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {
                isRFQOpen && (
                    <div className="rfq-modal-overlay">
                        <div className="rfq-modal glass-premium animate-entrance">
                            <button className="close-rfq" onClick={() => setIsRFQOpen(false)}>×</button>

                            {rfqSuccess ? (
                                <div className="rfq-success">
                                    <div className="success-icon">✓</div>
                                    <h3>Cotización Recibida</h3>
                                    <p>Su solicitud ha sido enviada al departamento corporativo. Su ejecutivo de cuenta se contactará en breve con la confirmación de la orden y validación de línea de crédito.</p>
                                </div>
                            ) : (
                                <>
                                    <div className="rfq-modal-header">
                                        <div className="rfq-icon-box"><Shield size={24} /></div>
                                        <div>
                                            <h3>Solicitud de Cotización Formal (RFQ)</h3>
                                            <p className="rfq-subtitle">Complete los datos corporativos para procesar la orden B2B.</p>
                                        </div>
                                    </div>

                                    <form onSubmit={handleRFQSubmit} className="rfq-form">
                                        <div className="form-grid">
                                            <div className="input-group">
                                                <label>RUC</label>
                                                <div className="input-with-icon">
                                                    <Hash size={14} />
                                                    <input type="text" required placeholder="Ej. 20123456789" />
                                                </div>
                                            </div>
                                            <div className="input-group">
                                                <label>Razón Social</label>
                                                <div className="input-with-icon">
                                                    <Briefcase size={14} />
                                                    <input type="text" required placeholder="Nombre legal de la empresa" />
                                                </div>
                                            </div>
                                            <div className="input-group span-2">
                                                <label>Nombre del Comprador Autorizado</label>
                                                <div className="input-with-icon">
                                                    <User size={14} />
                                                    <input type="text" required placeholder="Su nombre y apellido" />
                                                </div>
                                            </div>
                                            <div className="input-group span-2">
                                                <label>Condición de Pago Solicitada</label>
                                                <CustomSelect
                                                    value={paymentCondition}
                                                    onChange={setPaymentCondition}
                                                    icon={CreditCard}
                                                    options={[
                                                        { value: 'net30', label: 'Línea de Crédito a 30 Días (Net 30)' },
                                                        { value: 'transfer', label: 'Transferencia Bancaria Directa' },
                                                        { value: 'adv50', label: 'Adelanto 50% / Contra-entrega 50%' },
                                                    ]}
                                                />
                                            </div>
                                        </div>
                                        <button type="submit" className="btn-premium btn-massive-v2 w-full mt-25">
                                            Transmitir Solicitud de Orden
                                        </button>
                                        <p className="rfq-disclaimer">Al enviar, declara que tiene autoridad legal para comprometer fondos de la organización citada.</p>
                                    </form>
                                </>
                            )}
                        </div>
                    </div>
                )
            }

            <style jsx>{`
                .premium-mesh { 
                    background-image: 
                        radial-gradient(at 0% 0%, rgba(236, 72, 153, 0.03) 0px, transparent 50%), 
                        radial-gradient(at 100% 100%, rgba(30, 41, 59, 0.03) 0px, transparent 50%); 
                    background-color: #f8fafc; 
                }
                
                .b2b-layout { min-height: 100vh; color: #1e293b; padding-bottom: 120px; }
                .b2b-header { padding: 110px 0 40px; background: linear-gradient(to bottom, #fff, transparent); border-bottom: 1px solid #f1f5f9; }

                .header-content { display: flex; justify-content: space-between; align-items: center; max-width: 1200px; margin: 0 auto; padding: 0 20px; }
                .premium-tag { font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 2.5px; color: #ec4899; margin-bottom: 10px; display: flex; align-items: center; }
                .b2b-title { font-size: 40px; font-weight: 950; margin-bottom: 8px; line-height: 1; letter-spacing: -2px; color: #1e293b; }
                .text-gradient { background: linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
                .b2b-subtitle { color: #64748b; max-width: 600px; font-size: 16px; font-weight: 600; }

                .b2b-search-wrapper { position: relative; width: 340px; border-radius: 20px; background: #fff; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.05); display: flex; align-items: center; padding: 0; overflow: hidden; border: 1px solid #e2e8f0; transition: 0.3s; }
                .b2b-search-icon { display: flex; align-items: center; justify-content: center; padding-left: 18px; color: #94a3b8; }
                .b2b-search-input { flex: 1; padding: 12px 18px 12px 12px; border: none; background: transparent; color: #1e293b; font-size: 14px; font-weight: 700; outline: none; }
                .b2b-search-wrapper:focus-within { border-color: #ec4899; box-shadow: 0 10px 30px -5px rgba(236, 72, 153, 0.1); }

                .container { width: 100%; max-width: 1200px; margin: 0 auto; }
                .b2b-main { padding-top: 30px; padding-bottom: 100px; }
                
                .b2b-panel { width: 100%; background: #fff; border-radius: 32px; padding: 35px; box-shadow: 0 25px 60px -15px rgba(0,0,0,0.04); border: 1px solid #f1f5f9; }

                .b2b-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 30px; padding-bottom: 15px; border-bottom: 1px solid #f1f5f9; }
                .toolbar-stats { font-size: 13px; font-weight: 800; color: #64748b; letter-spacing: -0.2px; }
                .btn-sds { background: #f8fafc; border: 1px solid #e2e8f0; padding: 8px 18px; border-radius: 14px; font-size: 12px; font-weight: 850; display: flex; align-items: center; gap: 8px; cursor: pointer; transition: 0.3s; color: #475569; }
                .btn-sds:hover { transform: translateY(-2px); border-color: #cbd5e1; background: #fff; box-shadow: 0 5px 15px rgba(0,0,0,0.05); }

                .b2b-table-wrapper { width: 100%; overflow: hidden; border-radius: 16px; }
                .b2b-table { width: 100%; border-collapse: separate; border-spacing: 0; min-width: 800px; text-align: left; }
                .b2b-table th { padding: 18px 12px; font-weight: 900; color: #94a3b8; text-transform: uppercase; font-size: 11px; letter-spacing: 1.5px; border-bottom: 1px solid #f1f5f9; }
                
                .grid-row { transition: 0.3s; border-bottom: 1px solid #f8fafc; }
                .grid-row td { padding: 22px 12px; vertical-align: middle; border-bottom: 1px solid #f8fafc; }
                
                .grid-row:hover { background: #fafafa; transform: scale(1.002); }
                .row-selected { background: #fdf2f8 !important; }
                .row-selected { border-left: 4px solid #ec4899; }

                .sku-badge { font-family: 'JetBrains Mono', 'Courier New', monospace; font-size: 12px; color: #64748b; background: #f1f5f9; padding: 5px 10px; border-radius: 10px; font-weight: 800; letter-spacing: -0.2px; }
                
                .product-name-flex { display: flex; align-items: center; gap: 10px; }
                .name-cell strong { font-weight: 900; font-size: 14px; color: #1e293b; line-height: 1.2; letter-spacing: -0.4px; }
                .active-dot { width: 8px; height: 8px; background: #ec4899; border-radius: 50%; box-shadow: 0 0 10px rgba(236, 72, 153, 0.4); }
                
                .cat-pill { padding: 4px 10px; border-radius: 8px; background: #f1f5f9; font-size: 10px; font-weight: 900; text-transform: uppercase; color: #475569; letter-spacing: 0.5px; }
                
                .text-slate { color: #94a3b8; font-weight: 700; font-size: 13px; }
                .sds-link { display: inline-flex; align-items: center; gap: 6px; color: #475569; font-weight: 850; text-decoration: none; font-size: 11px; background: #f1f5f9; padding: 5px 12px; border-radius: 50px; transition: 0.2s; }
                .sds-link:hover { background: #ec4899; color: #fff; }
                
                .price-cell { font-weight: 950; font-size: 15px; color: #1e293b; letter-spacing: -0.5px; }
                
                .stock-wrapper { display: inline-flex; align-items: center; gap: 8px; font-size: 11px; font-weight: 900; text-transform: uppercase; color: #10b981; background: #f0fdf4; padding: 5px 12px; border-radius: 100px; border: 1px solid #dcfce7; }
                .dot { width: 6px; height: 6px; border-radius: 50%; }
                .bg-green { background: #10b981; box-shadow: 0 0 10px rgba(16,185,129,0.3); }

                .qty-pill { display: inline-flex; align-items: center; background: #f1f5f9; border-radius: 14px; overflow: hidden; height: 38px; width: 100px; border: 1px solid transparent; transition: 0.3s; }
                .qty-active { border-color: #ec4899; background: #fff; box-shadow: 0 8px 20px -5px rgba(236, 72, 153, 0.15); }
                
                .qty-pill button { flex: 1; background: transparent; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; height: 100%; transition: 0.2s; color: #64748b; }
                .qty-pill button:hover { color: #ec4899; background: #fdf2f8; }
                .qty-pill input { width: 34px; text-align: center; border: none; background: transparent; font-weight: 950; font-size: 15px; color: #1e293b; outline: none; }

                /* Integrated Panel Footer - Style Crystal */
                .b2b-panel-footer { 
                    background: rgba(30, 41, 59, 0.95); 
                    backdrop-filter: blur(20px);
                    border-radius: 24px; 
                    padding: 18px 35px; 
                    margin-top: 15px; 
                    display: flex; 
                    justify-content: space-between; 
                    align-items: center; 
                    box-shadow: 0 20px 50px rgba(0,0,0,0.15); 
                    color: white; 
                    position: sticky; 
                    bottom: 30px; 
                    z-index: 100;
                    border: 1px solid rgba(255,255,255,0.1);
                    max-width: 1100px;
                    margin-left: auto;
                    margin-right: auto;
                    animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                }
                @keyframes slideUp { from { transform: translateY(50px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

                .floating-info { display: flex; flex-direction: column; }
                .floating-qty { font-size: 11px; color: #94a3b8; font-weight: 850; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 2px; }
                .floating-total { font-size: 24px; font-weight: 950; color: white; display: flex; align-items: baseline; gap: 6px; letter-spacing: -1px; }
                .floating-total span { font-size: 12px; color: #ec4899; font-weight: 900; }

                .floating-buttons { display: flex; gap: 15px; align-items: center; }
                .btn-view-selected { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.15); color: white; padding: 0 24px; height: 48px; border-radius: 16px; font-weight: 850; cursor: pointer; transition: 0.3s; font-size: 13px; }
                .btn-view-selected:hover { background: rgba(255,255,255,0.1); border-color: #ec4899; }
                
                .btn-action-pill { padding: 0 30px; height: 48px; font-size: 13px; letter-spacing: 0.5px; border-radius: 16px; text-transform: uppercase; font-weight: 950; background: #ec4899; border: none; box-shadow: 0 10px 25px rgba(236, 72, 153, 0.4); display: flex; align-items: center; justify-content: center; gap: 10px; color: white; cursor: pointer; transition: 0.3s; }
                .btn-action-pill:hover { transform: translateY(-4px) scale(1.02); box-shadow: 0 15px 35px rgba(236, 72, 153, 0.5); background: #db2777; }

                /* Premium RFQ Modal */
                .rfq-modal-overlay { position: fixed; inset: 0; background: rgba(15, 23, 42, 0.6); z-index: 3000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(20px); }
                .rfq-modal { background: #fff; width: 95%; max-width: 600px; border-radius: 40px; padding: 50px; position: relative; box-shadow: 0 50px 100px -20px rgba(0,0,0,0.25); border: 1px solid #f1f5f9; }
                .close-rfq { position: absolute; top: 30px; right: 30px; background: #f8fafc; border: 1px solid #f1f5f9; width: 44px; height: 44px; border-radius: 50%; font-size: 24px; color: #94a3b8; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.3s; }
                .close-rfq:hover { background: #ec4899; color: #fff; transform: rotate(90deg); border-color: #ec4899; }
                
                .rfq-modal-header { display: flex; gap: 28px; align-items: center; margin-bottom: 40px; }
                .rfq-icon-box { width: 72px; height: 72px; background: #fdf2f8; color: #ec4899; border-radius: 24px; display: flex; align-items: center; justify-content: center; border: 1px solid #fce7f3; }
                .rfq-modal h3 { font-size: 26px; font-weight: 950; color: #1e293b; margin-bottom: 6px; letter-spacing: -1.2px; line-height: 1.1; }
                .rfq-subtitle { font-size: 15px; color: #64748b; font-weight: 700; }
                
                .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; }
                .span-2 { grid-column: span 2; }
                
                .input-group label { display: block; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 1.5px; color: #94a3b8; margin-bottom: 12px; padding-left: 4px; }
                .input-with-icon { position: relative; display: flex; align-items: center; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 18px; padding: 0 20px; transition: 0.3s; }
                .input-with-icon:focus-within { border-color: #ec4899; box-shadow: 0 0 0 6px rgba(236, 72, 153, 0.05); background: #fff; }
                
                .input-with-icon svg { color: #cbd5e1; margin-right: 15px; }
                .input-with-icon input, .input-with-icon select { flex: 1; height: 56px; border: none; background: transparent; font-size: 15px; font-weight: 800; color: #1e293b; outline: none; width: 100%; }
                
                .btn-massive-v2 { height: 64px; width: 100%; font-size: 16px; font-weight: 950; text-transform: uppercase; letter-spacing: 2px; border-radius: 20px; background: #1e293b; color: #fff; transition: 0.4s; border: none; cursor: pointer; margin-top: 15px; box-shadow: 0 15px 35px rgba(30, 41, 59, 0.2); }
                .btn-massive-v2:hover { transform: translateY(-4px); background: #000; box-shadow: 0 20px 45px rgba(0,0,0,0.3); }

                .rfq-disclaimer { font-size: 12px; color: #94a3b8; text-align: center; margin-top: 30px; line-height: 1.6; font-weight: 700; max-width: 85%; margin-left: auto; margin-right: auto; }
                
                .rfq-success { text-align: center; padding: 50px 0; }
                .success-icon { width: 80px; height: 80px; background: #10b981; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 40px; margin: 0 auto 30px; box-shadow: 0 20px 40px rgba(16,185,129,0.3); }

                /* P-Loader and others */
                .p-loader { width: 40px; height: 40px; border: 3px solid #f1f5f9; border-top-color: #ec4899; border-radius: 50%; animation: spin 1s linear infinite; }
                @keyframes spin { to { transform: rotate(360deg); } }

                @media (max-width: 1000px) {
                    .b2b-header { padding: 130px 0 50px; }
                    .header-content { flex-direction: column; align-items: flex-start; gap: 30px; }
                    .b2b-search-wrapper { width: 100%; }
                    .b2b-panel-footer { margin: 0 20px; width: calc(100% - 40px); bottom: 20px; }
                }
                
                @media (max-width: 768px) {
                    .b2b-title { font-size: 30px; }
                    .b2b-panel { padding: 20px; border-radius: 20px; }
                    .form-grid { grid-template-columns: 1fr; gap: 15px; }
                    .rfq-modal { padding: 30px; }
                    .floating-total { font-size: 20px; }
                    .btn-action-pill { padding: 0 20px; }
                }
            `}</style>
        </div >
    );
}

export default function B2BPage() {
    return (
        <main>
            <Navbar />
            <Suspense fallback={<div className="container" style={{ paddingTop: '200px' }}>Iniciando Portal B2B...</div>}>
                <B2BContent />
            </Suspense>
            <Footer />
        </main>
    );
}
