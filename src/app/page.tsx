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


      <style jsx global>{`
        .main-wrapper {
          position: relative;
        }
      `}</style>
      <FloatingChat />
    </main>
  );
}
