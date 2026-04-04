import './globals.css';
import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: {
    default: 'Naia | Beauty & Care Premium',
    template: '%s | Naia Store'
  },
  description: 'Eleva tu rutina de cuidado personal con productos premium de ciencia avanzada. Skincare y cuidado capilar diseñado para resaltar tu belleza natural.',
  keywords: ['skincare', 'belleza', 'cuidado facial', 'cuidado capilar', 'premium', 'cosmética', 'Naia'],
  openGraph: {
    title: 'Naia | Beauty & Care Premium',
    description: 'Productos premium diseñados para resaltar tu belleza única.',
    url: 'https://naia-store.vercel.app', // Placeholder
    siteName: 'Naia Store',
    locale: 'es_PE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Naia | Beauty & Care Premium',
    description: 'Cuidado personal de alta gama.',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className={outfit.variable}>
        <AuthProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
