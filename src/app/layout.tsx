import './globals.css';
import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';

const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
  title: 'Naia | Beauty & Care',
  description: 'Descubre tu mejor versión con Naia. Cuidado facial y capilar premium.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
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
