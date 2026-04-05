'use client';
import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle2, ShoppingBag, ArrowRight, MessageCircle } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

function SuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const orderId = searchParams.get('orderId');

    return (
        <div className="success-page-container animate-fade">
            <div className="success-card glass-premium">
                <div className="success-icon-wrap">
                    <CheckCircle2 size={80} className="text-emerald-400" />
                </div>
                <h1 className="success-title">¡Pedido Recibido!</h1>
                <p className="success-msg">
                    Gracias por confiar en <strong>Naia Beauty Store</strong>. <br />
                    Tu orden <strong>#{orderId}</strong> ha sido registrada satisfactoriamente.
                </p>

                <div className="next-steps glass-premium">
                    <h3>¿Qué sigue ahora?</h3>
                    <div className="step-item">
                        <div className="step-num">1</div>
                        <p>Te contactaremos vía WhatsApp para coordinar el pago y la entrega.</p>
                    </div>
                    <div className="step-item">
                        <div className="step-num">2</div>
                        <p>Recibirás actualizaciones sobre el estado de tu envío en tiempo real.</p>
                    </div>
                </div>

                <div className="success-actions">
                    <button
                        className="btn-premium btn-primary-v3"
                        onClick={() => router.push('/productos')}
                    >
                        <ShoppingBag size={18} /> Seguir Comprando
                    </button>
                    <button
                        className="btn-outline-premium glass-premium"
                        onClick={() => window.open(`https://wa.me/51944399377?text=Hola, quiero consultar el estado de mi pedido #${orderId}`, '_blank')}
                    >
                        <MessageCircle size={18} /> Consultar WhatsApp
                    </button>
                </div>
            </div>

            <style jsx>{`
                .success-page-container {
                    padding: 120px 20px 80px;
                    min-height: 80vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .success-card {
                    max-width: 600px;
                    width: 100%;
                    padding: 60px 40px;
                    text-align: center;
                    border-radius: 40px;
                    box-shadow: var(--shadow-2xl);
                }
                .success-icon-wrap {
                    margin-bottom: 30px;
                    display: flex;
                    justify-content: center;
                    animation: scaleIn 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
                }
                @keyframes scaleIn {
                    from { transform: scale(0); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
                .success-title {
                    font-size: 36px;
                    font-weight: 950;
                    margin-bottom: 15px;
                    background: linear-gradient(to right, #fff, #94a3b8);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .success-msg {
                    font-size: 18px;
                    color: var(--slate-400);
                    line-height: 1.6;
                    margin-bottom: 40px;
                }
                .next-steps {
                    background: rgba(255,255,255,0.03);
                    padding: 30px;
                    border-radius: 24px;
                    margin-bottom: 40px;
                    text-align: left;
                }
                .next-steps h3 {
                    font-size: 16px;
                    font-weight: 800;
                    margin-bottom: 20px;
                    color: #fff;
                    text-transform: uppercase;
                    letter-spacing: 0.05em;
                }
                .step-item {
                    display: flex;
                    gap: 15px;
                    margin-bottom: 15px;
                    align-items: flex-start;
                }
                .step-num {
                    width: 24px;
                    height: 24px;
                    border-radius: 50%;
                    background: var(--primary);
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 12px;
                    font-weight: 950;
                    flex-shrink: 0;
                    margin-top: 2px;
                }
                .step-item p {
                    font-size: 14px;
                    color: var(--slate-300);
                    font-weight: 500;
                    line-height: 1.5;
                }
                .success-actions {
                    display: flex;
                    gap: 15px;
                    justify-content: center;
                }
                @media (max-width: 600px) {
                    .success-card { padding: 40px 20px; }
                    .success-actions { flex-direction: column; }
                    .btn-premium { width: 100%; justify-content: center; }
                }
            `}</style>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <main className="min-h-screen bg-deep">
            <Navbar />
            <Suspense fallback={<div className="p-100 text-center">Cargando...</div>}>
                <SuccessContent />
            </Suspense>
            <Footer />
        </main>
    );
}
