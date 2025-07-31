'use client'
import axios from 'axios'
import { useParams } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import { Button } from '../../../../../../components/ui/button';
import { Heart, ShoppingCart, Star, Eye, Plus, Minus } from 'lucide-react';
import { useCartStore } from '../../../../cartStore';
import Swal from 'sweetalert2';
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

const ProductView = () => {
    const [loading, setLoading] = useState(true)
    const [product, setProduct] = useState({})

    const params = useParams();
    const id = params.id as string

    const fetchProduct = async () => {
        setLoading(true);
        try {
            const api = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'
            const response = await axios.get(`${api}/vendor/product/${id}`);
            setProduct(response?.data[0] || []);
            console.log('Products loaded:', response.data);
        } catch (error) {
            console.error('Error loading products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProduct();
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
                <span className="ml-3 text-gray-600">Loading ...</span>
            </div>
        );
    }

    return (
        <div className='p-3'>
             <div
                key={product.id}
                className="group relative flex flex-col md:flex-row rounded-md shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border"
            >
                {/* Product Image (Left) */}
                <div className="relative md:w-1/3 overflow-hidden">
                    {/* Badge */}
                    {product.badge && (
                        <div
                            className={`absolute top-4 left-4 z-20 ${getBadgeStyle(product.badge)} px-3 py-1.5 rounded-full text-xs font-semibold shadow-lg`}
                        >
                            {product.badge}
                        </div>
                    )}

                    <img
                        src={product?.defaultImage}
                        alt={product?.name}
                        className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                    />

                    {/* Quick Actions */}
                    <div className="absolute top-4 right-4 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                        <span
                            onClick={() => toggleLike(product)}
                            className="p-2.5 rounded-full transition-all bg-white duration-200 hover:scale-110 shadow-lg"
                        >
                            <Heart
                                size={18}
                                className={`${isProductLiked(product.id)
                                    ? 'text-red-500 fill-red-500'
                                    : 'text-gray-600 hover:text-red-500'
                                    } transition-colors`}
                            />
                        </span>
                        <Button
                            className="bg-white/90 backdrop-blur-sm hover:bg-white p-2.5 rounded-full transition-all duration-200 hover:scale-110 shadow-lg"
                            // onClick={() => { viewProduct(product.id) }}
                        >
                            <Eye size={18} className="text-gray-600 hover:text-blue-600 transition-colors" />
                        </Button>
                    </div>

                    {/* Category Tag */}
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-xs font-medium text-gray-700">{product.category}</span>
                    </div>
                </div>

                {/* Product Content (Right) */}
                <div className="md:w-1/2 p-6 flex flex-col justify-between">
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
                            <span className="text-sm ml-2 font-medium">{product.rating}</span>
                        </div>
                        <span className="text-sm">({product.reviews} reviews)</span>
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold mb-3 line-clamp-2 transition-colors">{product.name}</h3>

                    {/* Description */}
                    <p className="text-sm mb-4 line-clamp-2 leading-relaxed">{product.description}</p>

                    {/* Colors */}
                    <div className="flex items-center mb-4">
                        <span className="text-sm mr-3 font-medium">Colors:</span>
                        <div className="flex space-x-2">
                            {product?.colors?.map((color, index) => (
                                <div
                                    key={index}
                                    className="w-6 h-6 rounded-full border-2 transition-all duration-200 cursor-pointer hover:scale-110 shadow-sm"
                                    style={{ backgroundColor: color }}
                                    title={color}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Price & Stock */}
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold">${product.price}</span>
                            {product.originalPrice && (
                                <span className="text-sm line-through">${product.originalPrice}</span>
                            )}
                        </div>
                        <div className="text-right">
                            <span className={`text-sm font-semibold ${product.stock > 10
                                ? 'text-green-600'
                                : product.stock > 0
                                    ? 'text-yellow-600'
                                    : 'text-red-600'
                                }`}>
                                {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                            </span>
                        </div>
                    </div>

                    {/* Add to Cart */}
                    <Button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock === 0}
                        className="w-full flex items-center justify-center space-x-2 py-3 px-6 rounded-xl font-semibold transition-all duration-300"
                    >
                        <ShoppingCart size={18} />
                        <span>{product.stock > 0 ? 'Add to Cart' : 'Sold Out'}</span>
                    </Button>
                </div>
            </div>
        </div>
    )
}

export default ProductView