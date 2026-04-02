'use client';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Stories from '@/components/Stories';
import ProductSection from '@/components/ProductSection';
import Footer from '@/components/Footer';
import FloatingChat from '@/components/FloatingChat';
import { MessageCircle } from 'lucide-react';

export default function Home() {
  return (
    <main className="main-wrapper">
      <Navbar />
      <Stories />
      <Hero />
      <ProductSection />
      <Footer />

      {/* Floating WhatsApp Button */}
      <a
        href="https://wa.me/944399377?text=Hola,%20me%20gustaría%20saber%20más%20sobre%20tus%20productos%20de%20belleza"
        target="_blank"
        className="whatsapp-float glass"
      >
        <MessageCircle size={30} fill="currentColor" />
        <span className="wa-text">Chatea con nosotros</span>
      </a>

      <style jsx global>{`
        .main-wrapper {
          position: relative;
        }
        .whatsapp-float {
          position: fixed;
          bottom: 30px;
          right: 30px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 24px;
          border-radius: 40px;
          background: rgba(37, 211, 102, 0.9) !important;
          color: white !important;
          text-decoration: none;
          z-index: 1000;
          box-shadow: 0 8px 32px rgba(37, 211, 102, 0.3);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .whatsapp-float:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 12px 40px rgba(37, 211, 102, 0.5);
        }
        .wa-text {
          font-weight: 700;
          font-size: 14px;
        }
        @media (max-width: 600px) {
            .wa-text { display: none; }
            .whatsapp-float { padding: 12px; }
        }
      `}</style>
      <FloatingChat />
    </main>
  );
}
