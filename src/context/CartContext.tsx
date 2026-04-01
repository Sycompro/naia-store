'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';

type CartItem = {
    id: number;
    name: string;
    unitPrice: number;
    wholesalePrice: number;
    imageUrl: string;
    quantity: number;
    presentation: string;
};

type CartContextType = {
    cart: CartItem[];
    addToCart: (product: any) => void;
    removeFromCart: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    totalItems: number;
    totalAmount: number;
    isWholesaleActive: boolean;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
    const [cart, setCart] = useState<CartItem[]>([]);

    // Load cart from localStorage
    useEffect(() => {
        const savedCart = localStorage.getItem('naia-cart');
        if (savedCart) {
            setCart(JSON.parse(savedCart));
        }
    }, []);

    // Save cart to localStorage
    useEffect(() => {
        localStorage.setItem('naia-cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product: any) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === product.id);
            if (existingItem) {
                return prevCart.map((item) =>
                    item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
                );
            }
            return [
                ...prevCart,
                {
                    id: product.id,
                    name: product.name,
                    unitPrice: product.unitPrice,
                    wholesalePrice: product.wholesalePrice,
                    imageUrl: product.imageUrl,
                    presentation: product.presentation,
                    quantity: 1,
                },
            ];
        });
    };

    const removeFromCart = (productId: number) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    };

    const updateQuantity = (productId: number, quantity: number) => {
        if (quantity <= 0) {
            removeFromCart(productId);
            return;
        }
        setCart((prevCart) =>
            prevCart.map((item) =>
                item.id === productId ? { ...item, quantity } : item
            )
        );
    };

    const clearCart = () => setCart([]);

    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

    // Logic: Wholesale price applies if total items >= 6 or if an item has >= 3 units
    const isWholesaleActive = totalItems >= 6 || cart.some(item => item.quantity >= 3);

    const totalAmount = cart.reduce((sum, item) => {
        const price = isWholesaleActive ? item.wholesalePrice : item.unitPrice;
        return sum + price * item.quantity;
    }, 0);

    return (
        <CartContext.Provider value={{
            cart, addToCart, removeFromCart, updateQuantity, clearCart,
            totalItems, totalAmount, isWholesaleActive
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
