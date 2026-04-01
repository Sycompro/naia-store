'use client';
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin, Send, Globe, Share2 } from 'lucide-react';

export default function ContactoPage() {
    return (
        <main className="contacto-page">
            <Navbar />

            <section className="contact-hero">
                <div className="container">
                    <h1>Estamos para <span className="text-gradient">Escucharte</span></h1>
                    <p>¿Tienes dudas o sugerencias? Escríbenos y nuestro equipo te responderá lo antes posible.</p>
                </div>
            </section>

            <section className="contact-container container">
                <div className="contact-grid">
                    <div className="contact-info">
                        <div className="info-card glass">
                            <div className="icon-box"><Mail /></div>
                            <div>
                                <h3>Email</h3>
                                <p>hola@naiabeauty.com</p>
                            </div>
                        </div>

                        <div className="info-card glass">
                            <div className="icon-box"><Phone /></div>
                            <div>
                                <h3>Teléfono</h3>
                                <p>+51 944 399 377</p>
                            </div>
                        </div>

                        <div className="info-card glass">
                            <div className="icon-box"><MapPin /></div>
                            <div>
                                <h3>Ubicación</h3>
                                <p>Lima, Perú</p>
                            </div>
                        </div>

                        <div className="social-connect glass">
                            <h3>Síguenos</h3>
                            <div className="social-btns">
                                <a href="#"><Globe /></a>
                                <a href="#"><Share2 /></a>
                            </div>
                        </div>
                    </div>

                    <div className="contact-form-container glass">
                        <form className="contact-form">
                            <div className="form-group">
                                <label>Nombre Completo</label>
                                <input type="text" placeholder="Ej: Maria García" />
                            </div>
                            <div className="form-group">
                                <label>Correo Electrónico</label>
                                <input type="email" placeholder="maria@ejemplo.com" />
                            </div>
                            <div className="form-group">
                                <label>Asunto</label>
                                <select>
                                    <option>Consulta de Productos</option>
                                    <option>Ventas al Mayor</option>
                                    <option>Soporte Técnico</option>
                                    <option>Otros</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Mensaje</label>
                                <textarea rows={5} placeholder="Escribe aquí tu mensaje..."></textarea>
                            </div>
                            <button type="submit" className="btn-submit">
                                Enviar Mensaje <Send size={18} />
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            <Footer />

            <style jsx>{`
        .contacto-page { padding-top: 100px; background: var(--bg); }
        .contact-hero { text-align: center; padding: 80px 20px 60px; }
        .contact-hero h1 { font-size: 48px; font-weight: 900; margin-bottom: 15px; }
        .contact-hero p { color: var(--slate-500); font-size: 16px; max-width: 550px; margin: 0 auto; }
        .text-gradient { background: linear-gradient(135deg, var(--primary), var(--primary-dark)); -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent; }
        
        .contact-grid { display: grid; grid-template-columns: 1fr 1.2fr; gap: 40px; padding-bottom: 80px; align-items: start; }
        
        .contact-info { display: flex; flex-direction: column; gap: 16px; }
        .info-card { padding: 24px; border-radius: 20px; display: flex; align-items: center; gap: 18px; background: var(--glass); border: 1px solid var(--glass-border); }
        .icon-box { width: 48px; height: 48px; min-width: 48px; background: var(--primary-light); color: var(--primary); border-radius: 14px; display: flex; align-items: center; justify-content: center; }
        :global(.men-theme) .icon-box { background: rgba(14, 165, 233, 0.15); }
        .info-card h3 { font-size: 16px; font-weight: 800; margin-bottom: 4px; color: var(--fg); }
        .info-card p { color: var(--slate-500); font-weight: 500; font-size: 14px; }
        
        .social-connect { padding: 24px; border-radius: 20px; text-align: center; background: var(--glass); border: 1px solid var(--glass-border); }
        .social-connect h3 { font-size: 16px; font-weight: 800; color: var(--fg); }
        .social-btns { display: flex; justify-content: center; gap: 12px; margin-top: 12px; }
        .social-btns a { width: 44px; height: 44px; border-radius: 12px; background: var(--bg); color: var(--fg); border: 1px solid var(--slate-200); display: flex; align-items: center; justify-content: center; transition: all 0.3s; }
        .social-btns a:hover { background: var(--primary); color: white; border-color: var(--primary); transform: rotate(10deg); }

        .contact-form-container { padding: 35px; border-radius: 24px; background: var(--glass); border: 1px solid var(--glass-border); }
        .contact-form { display: flex; flex-direction: column; gap: 18px; }
        .form-group { display: flex; flex-direction: column; gap: 6px; }
        .form-group label { font-weight: 700; font-size: 13px; margin-left: 4px; color: var(--fg); }
        .form-group input, .form-group select, .form-group textarea {
          padding: 14px;
          border-radius: 12px;
          border: 1px solid var(--slate-200);
          background: var(--bg);
          color: var(--fg);
          font-size: 15px;
          outline: none;
          transition: all 0.3s;
          font-family: inherit;
        }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: var(--primary); box-shadow: 0 0 0 3px var(--primary-light); }
        
        .btn-submit {
          padding: 16px;
          background: var(--primary);
          color: white;
          border-radius: 14px;
          font-weight: 800;
          font-size: 15px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s;
          margin-top: 8px;
        }
        .btn-submit:hover { opacity: 0.9; transform: translateY(-2px); box-shadow: 0 10px 20px var(--primary-light); }

        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr; }
          .contact-hero h1 { font-size: 36px; }
        }
      `}</style>
        </main>
    );
}
