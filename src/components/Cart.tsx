// FILE: components/Cart.tsx
import { useCartStore } from "../store/cart-store";
import { Link } from 'react-router-dom';

interface CartProps {
    isCartOpen: boolean;
    setIsCartOpen: (isOpen: boolean) => void;
    showNotification: boolean;
    productName?: string; // Add this
}

export default function Cart({ isCartOpen, setIsCartOpen, showNotification }: CartProps) {
    const cartStore = useCartStore();

    return (
        <>
            {showNotification && (
                <div className="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in-out">
                    Đã thêm vào giỏ hàng!
                </div>
            )}
        </>
    );
}