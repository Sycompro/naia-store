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
                .premium-mesh { background-image: radial-gradient(at 0% 0%, rgba(var(--primary-rgb), 0.05) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(var(--primary-rgb), 0.05) 0px, transparent 50%); background-color: #f8fafc; }
                :global(.men-theme) .premium-mesh { background-color: #0f172a; }
                
                .b2b-layout { min-height: 100vh; color: var(--fg); padding-bottom: 80px; }
                .b2b-header { padding: 95px 0 20px; background: linear-gradient(to bottom, rgba(var(--primary-rgb), 0.03), transparent); border-bottom: 1px solid rgba(0,0,0,0.03); }
                :global(.men-theme) .b2b-header { border-bottom-color: rgba(255,255,255,0.05); }

                .header-content { display: flex; justify-content: space-between; align-items: flex-end; max-width: 1150px; margin: 0 auto; }
                .premium-tag { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; color: var(--primary); margin-bottom: 8px; display: block; }
                .b2b-title { font-size: 34px; font-weight: 900; margin-bottom: 5px; line-height: 1.1; letter-spacing: -1px; }
                .b2b-subtitle { color: var(--slate-500); max-width: 600px; font-size: 15px; font-weight: 500; }

                .b2b-search-wrapper { position: relative; width: 320px; border-radius: 50px; background: var(--white); box-shadow: 0 2px 10px rgba(0,0,0,0.04); display: flex; align-items: center; padding: 0; overflow: hidden; border: 1px solid rgba(0,0,0,0.05); }
                :global(.men-theme) .b2b-search-wrapper { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.05); }
                .b2b-search-icon { display: flex; align-items: center; justify-content: center; padding-left: 15px; color: var(--primary); }
                .b2b-search-input { flex: 1; padding: 10px 15px 10px 10px; border: none; background: transparent; color: var(--fg); font-size: 13px; font-weight: 600; outline: none; box-shadow: none; }
                .b2b-search-wrapper:focus-within { border-color: rgba(var(--primary-rgb), 0.3); box-shadow: 0 0 0 2px rgba(var(--primary-rgb), 0.1); }

                .b2b-main { display: flex; justify-content: center; padding-top: 5px; }
                
                .b2b-panel { width: 100%; max-width: 1150px; background: var(--white); border-radius: 20px; padding: 25px; box-shadow: 0 10px 40px rgba(0,0,0,0.03); border: 1px solid rgba(0,0,0,0.04); margin-bottom: 120px; }
                :global(.men-theme) .b2b-panel { background: rgba(255,255,255,0.02); border-color: rgba(255,255,255,0.05); }

                .b2b-toolbar { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid rgba(0,0,0,0.05); }
                :global(.men-theme) .b2b-toolbar { border-bottom-color: rgba(255,255,255,0.05); }
                .toolbar-stats { font-size: 12px; font-weight: 700; color: var(--slate-500); }
                .btn-sds { background: none; border: 1px solid var(--slate-200); padding: 6px 12px; border-radius: 50px; font-size: 11px; font-weight: 700; display: flex; align-items: center; gap: 6px; cursor: pointer; transition: all 0.2s; color: var(--slate-600); }
                .btn-sds:hover { background: var(--slate-100); color: var(--fg); }
                :global(.men-theme) .btn-sds { border-color: rgba(255,255,255,0.1); color: var(--slate-400); }
                :global(.men-theme) .btn-sds:hover { background: rgba(255,255,255,0.05); color: white; }

                .b2b-table-wrapper { width: 100%; overflow-x: auto; -webkit-overflow-scrolling: touch; padding-bottom: 5px; }
                .b2b-table { width: 100%; border-collapse: separate; border-spacing: 0; min-width: 800px; text-align: left; font-size: 13px; }
                .b2b-table th { padding: 0 10px 15px; font-weight: 800; color: var(--slate-400); text-transform: uppercase; font-size: 10px; letter-spacing: 1px; border-bottom: 1px solid rgba(0,0,0,0.05); white-space: nowrap; }
                :global(.men-theme) .b2b-table th { border-bottom-color: rgba(255,255,255,0.05); }
                
                .grid-row { transition: all 0.2s; border-bottom: 1px solid rgba(0,0,0,0.03); }
                :global(.men-theme) .grid-row { border-bottom-color: rgba(255,255,255,0.03); }
                .grid-row td { padding: 15px 10px; vertical-align: middle; border: none; }
                
                .grid-row:hover { background: rgba(var(--primary-rgb), 0.02); }
                :global(.men-theme) .grid-row:hover { background: rgba(255,255,255,0.03); }
                
                .row-selected { background: rgba(var(--primary-rgb), 0.04) !important; box-shadow: inset 3px 0 0 var(--primary); }

                .sku-badge { font-family: 'Courier New', monospace; font-size: 11px; color: var(--slate-500); background: var(--slate-100); padding: 4px 8px; border-radius: 6px; font-weight: 800; letter-spacing: 0.5px; display: inline-block; white-space: nowrap; }
                :global(.men-theme) .sku-badge { background: rgba(0,0,0,0.3); color: var(--slate-400); }
                
                .product-name-flex { display: flex; align-items: center; gap: 8px; }
                .name-cell strong { font-weight: 800; font-size: 13px; color: var(--fg); line-height: 1.2; display: block; max-width: 180px; }
                .active-dot { width: 6px; height: 6px; background: var(--primary); border-radius: 50%; box-shadow: 0 0 6px var(--primary-light); flex-shrink: 0; }
                
                .cat-pill { padding: 3px 8px; border-radius: 50px; background: rgba(0,0,0,0.04); font-size: 9px; font-weight: 800; text-transform: uppercase; color: var(--slate-600); display: inline-block; white-space: nowrap; }
                :global(.men-theme) .cat-pill { background: rgba(255,255,255,0.05); color: var(--slate-300); }
                
                .text-slate { color: var(--slate-500); font-weight: 600; font-size: 12px; }
                .sds-link { display: inline-flex; align-items: center; justify-content: center; gap: 4px; color: var(--slate-400); font-weight: 800; text-decoration: none; font-size: 10px; transition: color 0.2s; white-space: nowrap; }
                .sds-link:hover { color: var(--primary); }
                
                .price-cell { font-weight: 900; font-size: 14px; color: var(--fg); white-space: nowrap; }
                
                .stock-wrapper { display: inline-flex; align-items: center; justify-content: center; gap: 4px; font-size: 10px; font-weight: 800; text-transform: uppercase; color: var(--slate-600); background: #f0fdf4; padding: 3px 8px; border-radius: 50px; border: 1px solid rgba(16,185,129,0.1); white-space: nowrap; }
                .dot { width: 5px; height: 5px; border-radius: 50%; flex-shrink: 0; }
                .bg-green { background: #10b981; box-shadow: 0 0 6px rgba(16,185,129,0.6); }

                .qty-pill { display: inline-flex; align-items: center; background: var(--slate-100); border-radius: 50px; overflow: hidden; height: 32px; width: 90px; transition: all 0.3s; border: 1px solid rgba(0,0,0,0.05); }
                :global(.men-theme) .qty-pill { background: rgba(0,0,0,0.2); border-color: rgba(255,255,255,0.05); }
                .qty-active { background: var(--white); border-color: var(--primary); box-shadow: 0 4px 12px rgba(var(--primary-rgb), 0.15); }
                :global(.men-theme) .qty-active { background: rgba(var(--primary-rgb), 0.1); border-color: var(--primary); }
                
                .qty-pill button { flex: 1; background: transparent; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; height: 100%; transition: all 0.2s; color: var(--slate-500); }
                .qty-pill button:hover { color: var(--primary); background: rgba(var(--primary-rgb), 0.05); }
                .qty-pill input { width: 30px; text-align: center; border: none; background: transparent; font-weight: 900; font-size: 13px; color: var(--fg); outline: none; }
                .qty-pill input::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }

                /* Integrated Panel Footer */
                .b2b-panel-footer { background: #0f172a; border-radius: 12px; padding: 12px 20px; margin-top: 15px; display: flex; justify-content: space-between; align-items: center; box-shadow: 0 10px 30px rgba(0,0,0,0.15), 0 0 0 1px rgba(255,255,255,0.05); color: white; position: sticky; bottom: 15px; z-index: 100; }
                :global(.men-theme) .b2b-panel-footer { background: #000; box-shadow: 0 10px 30px rgba(255,255,255,0.05), 0 0 0 1px rgba(255,255,255,0.1); }

                .floating-info { display: flex; flex-direction: column; justify-content: center; }
                .floating-qty { font-size: 10px; color: var(--slate-400); font-weight: 800; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 0px; }
                .floating-total { font-size: 18px; font-weight: 900; color: white; display: flex; align-items: baseline; gap: 4px; line-height: 1; }
                .floating-total span { font-size: 10px; color: var(--primary-light); font-weight: 700; opacity: 0.8;}

                .floating-buttons { display: flex; gap: 10px; align-items: center; }
                .btn-view-selected { background: transparent; border: 1px solid rgba(255,255,255,0.15); color: white; padding: 0 15px; height: 36px; border-radius: 8px; font-weight: 700; cursor: pointer; transition: all 0.2s; font-size: 12px; display: flex; align-items: center; }
                .btn-view-selected:hover { background: rgba(255,255,255,0.08); border-color: rgba(255,255,255,0.3); }
                
                .btn-action-pill { padding: 0 20px; height: 36px; font-size: 12px; letter-spacing: 0.5px; border-radius: 8px; text-transform: uppercase; font-weight: 900; background: linear-gradient(135deg, var(--primary) 0%, #ec4899 100%); border: none; box-shadow: 0 5px 12px rgba(var(--primary-rgb), 0.3); display: flex; align-items: center; justify-content: center; gap: 6px; color: white; cursor: pointer; transition: all 0.3s; }
                .btn-action-pill:hover { transform: translateY(-1px); box-shadow: 0 8px 15px rgba(var(--primary-rgb), 0.4); }

                /* RFQ Modal Styles */
                .rfq-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.85); z-index: 3000; display: flex; align-items: center; justify-content: center; backdrop-filter: blur(12px); }
                .rfq-modal { background: var(--white); width: 95%; max-width: 600px; border-radius: 28px; padding: 45px; position: relative; box-shadow: 0 40px 100px rgba(0,0,0,0.4); border: 1px solid rgba(255,255,255,0.1); }
                :global(.men-theme) .rfq-modal { background: #0f172a; border-color: rgba(255,255,255,0.08); }
                .close-rfq { position: absolute; top: 24px; right: 24px; background: rgba(0,0,0,0.05); border: none; width: 36px; height: 36px; border-radius: 50%; font-size: 20px; color: var(--slate-400); cursor: pointer; display: flex; align-items: center; justify-content: center; transition: 0.3s; }
                .close-rfq:hover { background: var(--fg); color: var(--bg); transform: rotate(90deg); }
                
                .rfq-modal-header { display: flex; gap: 24px; align-items: center; margin-bottom: 35px; }
                .rfq-icon-box { width: 64px; height: 64px; background: rgba(var(--primary-rgb), 0.1); color: var(--primary); border-radius: 18px; display: flex; align-items: center; justify-content: center; }
                .rfq-modal h3 { font-size: 22px; font-weight: 950; color: var(--fg); margin-bottom: 6px; letter-spacing: -0.8px; line-height: 1.1; }
                .rfq-subtitle { font-size: 14px; color: var(--slate-500); font-weight: 600; }
                
                .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
                .span-2 { grid-column: span 2; }
                
                .input-group label { display: block; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 1.2px; color: var(--slate-500); margin-bottom: 10px; padding-left: 4px; }
                .input-with-icon { position: relative; display: flex; align-items: center; background: var(--slate-50); border: 1px solid var(--slate-200); border-radius: 14px; padding: 0 18px; transition: all 0.3s; }
                :global(.men-theme) .input-with-icon { background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.08); }
                .input-with-icon:focus-within { border-color: var(--fg); box-shadow: 0 0 0 4px rgba(0,0,0,0.03); background: var(--white); }
                :global(.men-theme) .input-with-icon:focus-within { background: rgba(255,255,255,0.08); border-color: white; }
                
                .input-with-icon svg { color: var(--slate-400); margin-right: 12px; opacity: 0.7; }
                .input-with-icon input, .input-with-icon select { flex: 1; height: 50px; border: none; background: transparent; font-size: 14px; font-weight: 700; color: var(--fg); outline: none; width: 100%; }
                
                .btn-massive-v2 { height: 58px; width: 100%; font-size: 15px; font-weight: 950; text-transform: uppercase; letter-spacing: 1.5px; border-radius: 16px; background: var(--fg); color: var(--bg); transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275); border: none; cursor: pointer; margin-top: 10px; }
                .btn-massive-v2:hover { transform: translateY(-3px); box-shadow: 0 15px 35px rgba(0,0,0,0.2); }
                :global(.men-theme) .btn-massive-v2 { background: var(--primary); color: white; box-shadow: 0 10px 25px rgba(var(--primary-rgb), 0.4); }

                .rfq-disclaimer { font-size: 11px; color: var(--slate-400); text-align: center; margin-top: 25px; line-height: 1.6; font-weight: 600; max-width: 80%; margin-left: auto; margin-right: auto; }
                
                .rfq-success { text-align: center; padding: 40px 0; }
                .success-icon { width: 64px; height: 64px; background: #22c55e; color: white; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; margin: 0 auto 20px; }

                /* Mobile Optimizations */
                @media (max-width: 900px) {
                    .header-content { flex-direction: column; align-items: flex-start; gap: 20px; }
                }
                
                @media (max-width: 768px) {
                    .b2b-header { padding: 110px 0 30px; }
                    .b2b-title { font-size: 32px; }
                    .b2b-table-wrapper { padding: 0 20px; }
                    .form-row { grid-template-columns: 1fr; }
                    .rfq-modal { padding: 25px; width: 95%; max-height: 90vh; overflow-y: auto; }
                    .qty-pill { width: 90px; }
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
