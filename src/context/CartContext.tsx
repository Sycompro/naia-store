'use client';
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import type { CartItem as CartItemType } from '@/types';

interface AddToCartProduct {
    id: number;
    name: string;
    unitPrice: number;
    wholesalePrice: number;
    imageUrl?: string | null;
    presentation?: string;
    category?: string;
    gender?: string;
}

interface CartContextType {
    cart: CartItemType[];
    addToCart: (product: AddToCartProduct) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalAmount: number;
    isWholesaleActive: boolean;
    isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItemType[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        try {
            const savedCart = localStorage.getItem('naia-cart');
            if (savedCart) {
                const parsed = JSON.parse(savedCart);
                if (Array.isArray(parsed)) {
                    setCart(parsed);
                }
            }
        } catch (error) {
            console.error('Error loading cart:', error);
            localStorage.removeItem('naia-cart');
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        if (!isLoading) {
            localStorage.setItem('naia-cart', JSON.stringify(cart));
        }
    }, [cart, isLoading]);

    const addToCart = useCallback((product: AddToCartProduct) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === product.id);
            if (existingItem) {
                return prevCart.map((item) =>
                    item.id === product.id 
                        ? { ...item, quantity: Math.min(item.quantity + 1, 999) } 
                        : item
                );
            }
            const newItem: CartItemType = {
                id: product.id,
                name: product.name,
                unitPrice: product.unitPrice,
                wholesalePrice: product.wholesalePrice,
                imageUrl: product.imageUrl || '',
                presentation: product.presentation || 'Unidad',
                category: product.category || 'Belleza',
                gender: product.gender || 'Femenino',
                quantity: 1,
            };
            return [...prevCart, newItem];
        });
    }, []);

    const removeFromCart = useCallback((productId: number) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    }, []);

    const updateQuantity = useCallback((productId: number, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === productId 
                    ? { ...item, quantity: Math.min(quantity, 999) } 
                    : item
            )
        );
    }, [removeFromCart]);

    const clearCart = useCallback(() => {
        setCart([]);
        localStorage.removeItem('naia-cart');
    }, []);

    const totalItems = useMemo(() => 
        cart.reduce((sum, item) => sum + item.quantity, 0), 
        [cart]
    );

    const isWholesaleActive = useMemo(() => 
        totalItems >= 6 || cart.some(item => item.quantity >= 3),
        [totalItems, cart]
    );

    const totalAmount = useMemo(() => 
        cart.reduce((sum, item) => {
            const price = isWholesaleActive ? Number(item.wholesalePrice) : Number(item.unitPrice);
            return sum + (price * item.quantity);
        }, 0),
        [cart, isWholesaleActive]
    );

    return (
        <CartContext.Provider value={{
            cart, addToCart, removeFromCart, updateQuantity, clearCart,
            totalItems, totalAmount, isWholesaleActive, isLoading
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (context === undefined) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
