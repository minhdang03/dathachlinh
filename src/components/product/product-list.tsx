import { useState, useEffect } from 'react';
import { useCartStore } from "../../store/cart-store";
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Link } from 'react-router-dom';
import Cart from '../Cart';
import productsData from '../../data/products.json';
import categoriesData from '../../data/categories.json';

interface Category {
    id: string;
    name: string;
    slug: string;
}

interface Product {
    id: number;
    name: string;
    price: number;
    description?: string;
    image?: string;
    category_id?: string;
    category?: string;
}

export default function ProductList() {
    const cartStore = useCartStore();
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [activeCategory, setActiveCategory] = useState<string>('all');
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [searchTerm, setSearchTerm] = useState<string>('');

    useEffect(() => {
        loadInitialData();
    }, []); // Load initial data once

    useEffect(() => {
        const filtered = filterProductsByCategory();
        if (filtered) {
            setProducts(filtered);
        }
    }, [activeCategory]); // Update products when category changes

    const loadInitialData = () => {
        setCategories(categoriesData.categories);
        setProducts(productsData.products);
    };

    const filterProductsByCategory = () => {
        if (activeCategory === 'all') {
            return productsData.products;
        }
        return productsData.products.filter(
            product => product.category_id === activeCategory
        );
    };

    const handleAddToCart = (product: Product) => {
        cartStore.add({
            product: {
                ...product,
                id: product.id.toString()
            },
            product_id: `product_${product.id}`,
            quantity: 1
        });
        setIsCartOpen(true);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), 2000);
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // For grouped display in JSX:
    const groupedProducts = activeCategory === 'all' 
        ? productsData.products.reduce((acc: { [key: string]: Product[] }, product) => {
            const categoryName = categories.find(c => c.id === product.category_id)?.name || 'Khác';
            if (!acc[categoryName]) {
                acc[categoryName] = [];
            }
            acc[categoryName].push(product);
            return acc;
        }, {})
        : null;

    return (
        <div className="space-y-6 space-x-32">
            <div className="flex justify-center mb-4">
                <input
                    type="text"
                    placeholder="Tìm kiếm sản phẩm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="px-4 py-2 border rounded-lg w-full max-w-md"
                />
            </div>
            
            <div className="flex overflow-x-auto pb-2">
                <button
                    onClick={() => setActiveCategory('all')}
                    className={`px-4 py-2 mx-1 rounded-lg whitespace-nowrap ${
                        activeCategory === 'all'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                >
                    Tất cả
                </button>
                {categories.map((category) => (
                    <button
                        key={category.id}
                        onClick={() => setActiveCategory(category.id)}
                        className={`px-4 py-2 mx-1 rounded-lg whitespace-nowrap ${
                            activeCategory === category.id
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 hover:bg-gray-200'
                        }`}
                    >
                        {category.name}
                    </button>
                ))}
            </div>

            {activeCategory === 'all' ? (
                Object.entries(groupedProducts || {}).map(([categoryName, categoryProducts]) => (
                    <div key={categoryName} className="mb-8">
                        <h2 className="text-xl font-bold mb-4">{categoryName}</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {categoryProducts.map((product) => (
                                <div 
                                    key={product.id}
                                    className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                                >
                                    <div className="relative pb-[40%]">
                                        <LazyLoadImage
                                            src={product.image || '/placeholder.png'}
                                            alt={product.name}
                                            effect="blur"
                                            className="absolute top-0 left-0 w-full h-full object-cover"
                                            wrapperClassName="w-full"
                                        />
                                    </div>
                                    
                                    <div className="p-3">
                                        <h3 className="text-sm font-medium text-gray-800 mb-1 line-clamp-2">
                                            {product.name}
                                        </h3>
                                        
                                        <p className="text-base font-bold text-blue-600 mb-1">
                                            {product.price.toLocaleString('vi-VN')}đ
                                        </p>
                                        
                                        {product.description && (
                                            <p className="text-xs text-gray-600 mb-2 line-clamp-1">
                                                {product.description}
                                            </p>
                                        )}
                                        
                                        <button 
                                            onClick={() => handleAddToCart(product)}
                                            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-1.5 px-3 rounded text-sm transition-colors duration-300 flex items-center justify-center space-x-1"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                            </svg>
                                            <span>Thêm vào giỏ</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <div 
                            key={product.id}
                            className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
                        >
                            <div className="relative pb-[75%]">
                                <LazyLoadImage
                                    src={product.image || '/placeholder.png'}
                                    alt={product.name}
                                    effect="blur"
                                    className="absolute top-0 left-0 w-full h-full object-cover"
                                    wrapperClassName="w-full"
                                />
                            </div>
                            
                            <div className="p-3">
                                <h3 className="text-sm font-medium text-gray-800 mb-1 line-clamp-2">
                                    {product.name}
                                </h3>
                                
                                <p className="text-base font-bold text-blue-600 mb-1">
                                    {product.price.toLocaleString('vi-VN')}đ
                                </p>
                                
                                {product.description && (
                                    <p className="text-xs text-gray-600 mb-2 line-clamp-1">
                                        {product.description}
                                    </p>
                                )}
                                
                                <button 
                                    onClick={() => handleAddToCart(product)}
                                    className="w-full bg-blue-500 hover:bg-blue-600 text-white py-1.5 px-3 rounded text-sm transition-colors duration-300 flex items-center justify-center space-x-1"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
                                    </svg>
                                    <span>Thêm vào giỏ</span>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Cart isCartOpen={isCartOpen} setIsCartOpen={setIsCartOpen} showNotification={showNotification} />
        </div>
    );
}