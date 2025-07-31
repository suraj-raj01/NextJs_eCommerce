'use client'

import React, { useEffect, useState } from 'react'
import { ColumnDef } from '@tanstack/react-table'
import { DataTable } from '../../vendor/components/dataTable'
import { Skeleton } from '../../../components/ui/skeleton';
import { useCartStore } from '../cartStore';

import { Button } from '../../../components/ui/button';
import Swal from 'sweetalert2';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Fixed type definition to match actual cart item structure
type CartItem = {
    id: string
    name: string
    price: number
    quantity: number
    defaultImage?: string
}

export default function Products() {
    const [page, setPage] = useState(1)
    const [pageCount, setPageCount] = useState(1)
    const [loading, setLoading] = useState(false)
    const [searchQuery, setSearchQuery] = useState<string>('')
    const cartItems = useCartStore((state) => state.items);
    const removeItem = useCartStore((state) => state.removeItem);
    const updateQuantity = useCartStore((state) => state.updateQuantity);

    const router = useRouter()

    const [token, setToken] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const storedToken = localStorage.getItem('user')
            if (storedToken) {
                try {
                    const parsed = JSON.parse(storedToken)
                    setToken(parsed?.token || '')
                } catch (error) {
                    console.error('Invalid token format in localStorage')
                    setToken('')
                }
            } else {
                setToken('')
            }
        }
    }, [token])

    if (!token) {
        return (
            <section>
                <div className="h-screen flex-col gap-2 items-center text-center justify-center content-center w-full">
                    <Button onClick={() => { router.push('/store/auth/login') }}>Login</Button>
                    <p className='font-bold text-center text-2xl'>Please login to view your cart</p>
                </div>
            </section>
        )
    }

    const handleAddToCart = (product: CartItem) => {
        removeItem(product?.id);
    };

    const handleUpdate = (productId: string, newQuantity: number) => {
        if (!productId) return;
        updateQuantity(productId, newQuantity);
    };

    const columns: ColumnDef<CartItem>[] = [
        {
            accessorKey: "defaultImage",
            header: "Product Image",
            cell: ({ getValue }) => {
                const imageUrl = getValue<string>();
                return imageUrl ? (
                    <img
                        src={imageUrl}
                        alt="Product"
                        className="w-12 h-12 object-cover rounded"
                    />
                ) : (
                    <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                        <span className="text-xs text-gray-500">No Image</span>
                    </div>
                );
            },
        },
        {
            accessorKey: "name",
            header: "Product Name",
        },
        {
            accessorKey: "price",
            header: "Product Price",
            cell: ({ getValue }) => `₹${getValue<number>().toFixed(2)}`,
        },
        {
            accessorKey: "quantity",
            header: "Product Quantity",
            cell: ({ row, getValue }) => {
                const quantity = getValue<number>();
                const product = row.original;

                const handleIncrement = () => {
                    handleUpdate(product.id, quantity + 1);
                };

                const handleDecrement = () => {
                    if (quantity > 1) {
                        handleUpdate(product.id, quantity - 1);
                    }
                };

                return (
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={handleDecrement}
                            disabled={quantity <= 1}
                            className="bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white px-2 py-1 rounded text-sm"
                        >
                            -
                        </Button>
                        <span className="min-w-[30px] text-center">{quantity}</span>
                        <Button
                            onClick={handleIncrement}
                            className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 rounded text-sm"
                        >
                            +
                        </Button>
                    </div>
                );
            },
        },
        {

            header: "Total Price",
            cell: ({ row }) => {
                const price = row.original.price;
                const quantity = row.original.quantity;
                const total = price * quantity;
                return `₹${total.toFixed(2)}`;
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex gap-2">
                    <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleAddToCart(row.original)}
                    >
                        Remove
                    </Button>
                </div>
            ),
        },
    ];

    const handleSearch = (query: string) => {
        setSearchQuery(query)
    }

    // Calculate total cart value
    const totalCartValue = cartItems.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);

    return (
        <div className="p-3 mt-3 h-auto">



            {cartItems.length != 0 ? (
                <DataTable
                    columns={columns}
                    data={cartItems || []}
                    pageCount={pageCount}
                    currentPage={page}
                    onPageChange={setPage}
                    onSearch={handleSearch}
                    isLoading={loading}
                />
            ) : (
                <div>
                    <div className="h-120 flex-col gap-2 items-center text-center justify-center content-center w-full">
                        <Button onClick={() => { router.back() }}>Back</Button>
                        <p className='font-bold text-center text-2xl'>Your cart is empty</p>
                    </div>
                </div>
            )}
            <div className="mt-4 h-40 flex items-center justify-end gap-5">
                <Button className="text-sm p-6 font-semibold mt-2 bg-green-700 text-white">
                    Total : ₹{totalCartValue.toFixed(2)}
                </Button>
                <Button className="text-sm p-6 font-semibold mt-2 bg-green-700 text-white">
                    <Link href="/store/payment"> Payment</Link>
                </Button>
            </div>
        </div>
    )
}

