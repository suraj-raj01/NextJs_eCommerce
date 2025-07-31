'use client'
import { useState, useEffect, Key } from 'react'
import axios from 'axios';
import Image from 'next/image';
import { Button } from '../../../components/ui/button';
import { Heart, ShoppingCart, Star, Eye, Plus, Minus } from 'lucide-react';
import Swal from 'sweetalert2';
import { useCartStore } from '../cartStore';
import { useRouter } from 'next/navigation';
type Product = {
    [x: string]: any;
    id: string | number;
    defaultImage?: string;
    name: string;
    description?: string;
    price: number;
    stock: number
    color: string[]
    images: string[];
    rating: number;
};

const ProductGrid = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [products, setProducts] = useState<Product[]>([]);

    const loadingProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
            const response = await axios.get(`${api}/vendor/product`);
            setProducts(response?.data?.data || []);
            console.log('Products loaded:', response.data);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadingProducts();
    }, []);

    
    const likeItem = useCartStore((state) => state.likeItem);
    const removeLikes = useCartStore((state) => state.removeLikes);
    const likedItems = useCartStore((state) => state.likes); // Get liked items from store

    const toggleLike = (product: any) => {
        const isLiked = likedItems.some(item => item.id === product.id);
        if (isLiked) {
            removeLikes(product.id);
        } else {
            likeItem(product);
        }
    };
    
    const addItem = useCartStore((state) => state.addItem);
    console.log(localStorage.getItem('user'))
    const handleAddToCart = (product: any) => {
        if(!localStorage.getItem('user')){
            Swal.fire({
                title:"Please Login First"
            })
            useRouter().push("/auth/login");
        }
        addItem(product);
    };

    const getBadgeStyle = (badge: any) => {
        switch (badge) {
            case 'Best Seller':
                return 'bg-gradient-to-r from-orange-500 to-red-500';
            case 'New Arrival':
                return 'bg-gradient-to-r from-green-500 to-teal-500';
            case 'Sale':
                return 'bg-gradient-to-r from-purple-500 to-pink-500';
            default:
                return 'bg-gradient-to-r from-blue-500 to-indigo-500';
        }
    };

    const isProductLiked = (productId: string | number) => {
        return likedItems.some(item => item.id === productId);
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Loading products...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-64">
                <div className="text-center">
                    <div className="text-red-500 text-xl mb-2">⚠️</div>
                    <div className="text-red-600 font-medium">Error loading products</div>
                    <div className="text-gray-500 text-sm mt-1">{error}</div>
                </div>
            </div>
        );
    }

    const router = useRouter();
    const viewProduct=(id:any)=>{
        router.push(`/store/products/edit/view/${id}`)
    }

    return (
        <div className="min-h-screen ">
            <div className="container mx-auto px-4 py-12">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <div className="inline-block p-2 bg-blue-100 rounded-full mb-4">
                        <ShoppingCart className="w-8 h-8 text-blue-600" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Featured Products
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Discover our carefully curated collection of premium products designed to enhance your lifestyle
                    </p>
                </div>

                {/* Products Grid */}
                <div className="grid w-full grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="group relative  rounded-md shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border"
                        >
                            {/* Product Badge */}
                            {product.badge && (
                                <div className={`absolute top-4 left-4 z-20 ${getBadgeStyle(product.badge)} px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg`}>
                                    {product.badge}
                                </div>
                            )}

                            {/* Product Image */}
                            <div className="relative overflow-hidden rounded-md ">
                                <img
                                    src={product?.defaultImage}
                                    alt={product?.name}
                                    className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"

                                />

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                                {/* Quick Actions */}
                                <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                                    <span
                                        onClick={() => toggleLike(product)}
                                        className=" p-2.5 rounded-full transition-all bg-white duration-200 hover:scale-110 shadow-lg"
                                    >
                                        <Heart
                                            size={18}
                                            className={`${isProductLiked(product.id)
                                                ? 'text-red-500 fill-red-500'
                                                : 'text-gray-600 hover:text-red-500'
                                                } transition-colors`}
                                        />
                                    </span>
                                    <Button className="bg-white/90 backdrop-blur-sm hover:bg-white p-2.5 rounded-full transition-all duration-200 hover:scale-110 shadow-lg"
                                    onClick={()=>{viewProduct(product.id)}}
                                    >
                                        <Eye size={18} className="text-gray-600 hover:text-blue-600 transition-colors" />
                                    </Button>
                                </div>

                                {/* Category Tag */}
                                <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                                    <span className="text-xs font-medium text-gray-700">{product.category}</span>
                                </div>
                            </div>

                            {/* Product Info */}
                            <div className="p-6">
                                {/* Rating */}
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center space-x-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star
                                                key={i}
                                                size={16}
                                                className={`${i < Math.floor(product.rating)
                                                    ? 'text-yellow-400 fill-yellow-400'
                                                    : 'text-gray-300'
                                                    }`}
                                            />
                                        ))}
                                        <span className="text-sm  ml-2 font-medium">
                                            {product.rating}
                                        </span>
                                    </div>
                                    <span className="text-sm ">({product.reviews} reviews)</span>
                                </div>

                                {/* Product Name */}
                                <h3 className="text-xl font-bold mb-3 line-clamp-2  transition-colors">
                                    {product.name}
                                </h3>

                                {/* Description */}
                                <p className=" text-sm mb-4 line-clamp-2 leading-relaxed">
                                    {product.description}
                                </p>

                                {/* Colors */}
                                <div className="flex items-center mb-4">
                                    <span className="text-sm  mr-3 font-medium">Colors:</span>
                                    <div className="flex space-x-2">
                                        {product.colors.map((color: string, index: number) => (
                                            <div
                                                key={index}
                                                className="w-6 h-6 rounded-full border-2  transition-all duration-200 cursor-pointer hover:scale-110 shadow-sm"
                                                style={{ backgroundColor: color }}
                                                title={color}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Price and Stock */}
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-2xl font-bold ">
                                            ${product.price}
                                        </span>
                                        {product.originalPrice && (
                                            <span className="text-sm line-through">
                                                ${product.originalPrice}
                                            </span>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <span className={`text-sm font-semibold ${product.stock > 10 ? 'text-green-600' :
                                            product.stock > 0 ? 'text-yellow-600' : 'text-red-600'
                                            }`}>
                                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                                        </span>
                                    </div>
                                </div>

                                {/* Quantity Selector & Add to Cart */}
                                <div className="space-y-3">

                                    <Button
                                        onClick={() => handleAddToCart(product)}
                                        disabled={product.stock === 0}
                                        className={`w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-xl font-semibold transition-all duration-300 ${product.stock > 0
                                            ? ''
                                            : ''
                                            }`}
                                    >
                                        <ShoppingCart size={18} />
                                        <span>{product.stock > 0 ? 'Add to Cart' : 'Sold Out'}</span>
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Load More Section */}
                <div className="text-center mt-16">
                    <div className="inline-flex flex-col items-center space-y-4">
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductGrid;