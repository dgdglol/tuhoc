'use client';

import React, { useState } from 'react';

// Định nghĩa kiểu dữ liệu cho sản phẩm
export interface Product {
    id: number;
    name: string;
    price: number;
}

// Định nghĩa kiểu dữ liệu cho sản phẩm trong giỏ hàng (có thêm số lượng)
export interface CartItem extends Product {
    quantity: number;
}

// Các props mà HOC sẽ cung cấp cho Component được bọc
export interface CartProps {
    cartItems: CartItem[];
    addToCart: (product: Product) => void;
    removeFromCart: (productId: number) => void;
    totalPrice: number;
}

const withCart = <P extends object>(
    WrappedComponent: React.ComponentType<P & CartProps>
) => {
    return function WithCart(props: P) {
        const [cartItems, setCartItems] = useState<CartItem[]>([]);

        // Logic thêm vào giỏ hàng
        const addToCart = (product: Product) => {
            setCartItems((prevItems) => {
                const existingItem = prevItems.find((item) => item.id === product.id);
                if (existingItem) {
                    // Nếu đã có thì tăng số lượng
                    return prevItems.map((item) =>
                        item.id === product.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                }
                // Nếu chưa có thì thêm mới với số lượng là 1
                return [...prevItems, { ...product, quantity: 1 }];
            });
        };

        // Logic xóa/giảm bớt khỏi giỏ hàng
        const removeFromCart = (productId: number) => {
            setCartItems((prevItems) => {
                const existingItem = prevItems.find((item) => item.id === productId);
                if (existingItem && existingItem.quantity > 1) {
                    // Nếu số lượng > 1 thì giảm đi 1
                    return prevItems.map((item) =>
                        item.id === productId
                            ? { ...item, quantity: item.quantity - 1 }
                            : item
                    );
                }
                // Nếu số lượng là 1 thì xóa luôn khỏi mảng
                return prevItems.filter((item) => item.id !== productId);
            });
        };

        // Tính tổng tiền
        const totalPrice = cartItems.reduce(
            (total, item) => total + item.price * item.quantity,
            0
        );

        return (
            <WrappedComponent
                cartItems={cartItems}
                addToCart={addToCart}
                removeFromCart={removeFromCart}
                totalPrice={totalPrice}
                {...props}
            />
        );
    };
};

export default withCart;
