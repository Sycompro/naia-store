'use client';
import React from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Mail, Phone, MapPin, Send, Instagram, Facebook } from 'lucide-react';

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
                                <a href="#"><Instagram /></a>
                                <a href="#"><Facebook /></a>
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
        .contact-hero { text-align: center; padding: 80px 20px; background: linear-gradient(135deg, var(--primary-light), transparent); }
        .contact-hero h1 { font-size: 56px; font-weight: 900; margin-bottom: 20px; }
        .text-gradient { background: linear-gradient(135deg, var(--primary), var(--primary-dark)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
        
        .contact-grid { display: grid; grid-template-columns: 1fr 1.5fr; gap: 40px; margin-top: -40px; padding-bottom: 80px; }
        
        .contact-info { display: flex; flex-direction: column; gap: 20px; }
        .info-card { padding: 30px; border-radius: 24px; display: flex; align-items: center; gap: 20px; }
        .icon-box { width: 50px; height: 50px; background: var(--primary-light); color: var(--primary); border-radius: 12px; display: flex; align-items: center; justify-content: center; }
        .info-card h3 { font-size: 18px; font-weight: 700; margin-bottom: 5px; }
        .info-card p { color: #666; font-weight: 500; }
        
        .social-connect { padding: 30px; border-radius: 24px; text-align: center; }
        .social-btns { display: flex; justify-content: center; gap: 15px; margin-top: 15px; }
        .social-btns a { width: 45px; height: 45px; border-radius: 12px; background: white; color: var(--fg); border: 1px solid rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: center; transition: all 0.3s; }
        .social-btns a:hover { background: var(--primary); color: white; transform: rotate(10deg); }

        .contact-form-container { padding: 40px; border-radius: 32px; }
        .contact-form { display: flex; flex-direction: column; gap: 20px; }
        .form-group { display: flex; flex-direction: column; gap: 8px; }
        .form-group label { font-weight: 700; font-size: 14px; margin-left: 5px; color: var(--fg); }
        .form-group input, .form-group select, .form-group textarea {
          padding: 15px;
          border-radius: 12px;
          border: 1px solid rgba(0,0,0,0.1);
          background: rgba(255,255,255,0.7);
          font-size: 15px;
          outline: none;
          transition: all 0.3s;
          font-family: inherit;
        }
        .form-group input:focus, .form-group select:focus, .form-group textarea:focus { border-color: var(--primary); box-shadow: 0 0 0 4px var(--primary-light); }
        
        .btn-submit {
          padding: 18px;
          background: var(--primary);
          color: white;
          border-radius: 12px;
          font-weight: 800;
          font-size: 16px;
          border: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s;
          margin-top: 10px;
        }
        .btn-submit:hover { opacity: 0.9; transform: translateY(-2px); box-shadow: 0 10px 20px var(--primary-light); }

        @media (max-width: 768px) {
          .contact-grid { grid-template-columns: 1fr; margin-top: 20px; }
          .contact-hero h1 { font-size: 40px; }
        }
      `}</style>
        </main>
    );
}
