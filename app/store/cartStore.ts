// store/cartStore.ts
import Swal from 'sweetalert2';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware'

interface Product {
    id: string;
    name: string;
    price: number;
    defaultImage?: string;
    description?: string;
    stock: number
    color: string[]
    images: string[];
    rating: number;
}

interface CartItem extends Product {
    quantity: number;
}

interface CartState {
    items: CartItem[];
    likes: CartItem[];
    addItem: (product: Product) => void;
    removeItem: (productId: string) => void;
    likeItem: (product: Product) => void;
    removeLikes: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    updateLikeQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            likes: [],
            addItem: (product) => {
                set((state) => {
                    const existingItem = state.items.find((item) => item.id === product.id);

                    if (existingItem) {
                        // Show message that item is already in cart
                        Swal.fire({
                            title: 'Already in Cart!',
                            text: `${product.name} is already added to your cart`,
                            icon: 'info',
                            timer: 2000,
                            showConfirmButton: false,
                            toast: true,
                            position: 'top-end'
                        });
                        return state;
                    } else {
                        // Show success message for new item
                        Swal.fire({
                            title: 'Added to Cart!',
                            text: `${product.name} has been added to your cart`,
                            icon: 'success',
                            timer: 2000,
                            showConfirmButton: false,
                            toast: true,
                            position: 'top-end'
                        });

                        return {
                            items: [...state.items, { ...product, quantity: 1 }],
                        };
                    }
                });
            },

            removeItem: (productId) => {
                set((state) => {
                    const removedItem = state.items.find(item => item.id === productId);

                    // Show removal message
                    if (removedItem) {
                        Swal.fire({
                            title: 'Removed!',
                            text: `${removedItem.name} has been removed from cart`,
                            icon: 'success',
                            timer: 2000,
                            showConfirmButton: false,
                            toast: true,
                            position: 'top-end'
                        });
                    }

                    return {
                        items: state.items.filter((item) => item.id !== productId),
                    };
                });
            },

            likeItem: (product) => {
                set((state) => {
                    const existingItem = state.likes.find((item) => item.id === product.id);

                    if (existingItem) {
                        // Show message that item is already in cart
                        Swal.fire({
                            title: 'Already in Cart!',
                            text: `${product.name} is already added to your like item`,
                            icon: 'info',
                            timer: 2000,
                            showConfirmButton: false,
                            toast: true,
                            position: 'top-end'
                        });
                        return state;
                    } else {
                        // Show success message for new item
                        Swal.fire({
                            title: 'Added to Like',
                            text: `${product.name || "Product "} has been added to your like items`,
                            icon: 'success',
                            timer: 2000,
                            showConfirmButton: false,
                            toast: true,
                            position: 'top-end'
                        });

                        return {
                            likes: [...state.likes, { ...product, quantity: 1 }],
                        };
                    }
                });
            },

            removeLikes: (productId) => {
                set((state) => {
                    const removedItem = state.likes.find(item => item.id === productId);

                    // Show removal message
                    if (removedItem) {
                        Swal.fire({
                            title: 'Like Removed!',
                            text: `${removedItem.name || "Product "} has been removed from like items`,
                            icon: 'success',
                            timer: 2000,
                            showConfirmButton: false,
                            toast: true,
                            position: 'top-end'
                        });
                    }

                    return {
                        likes: state.likes.filter((item) => item.id !== productId),
                    };
                });
            },

            updateQuantity: (productId, quantity) => {
                set((state) => {
                    const item = state.items.find(item => item.id === productId);

                    if (quantity === 0) {
                        // Show removal confirmation
                        Swal.fire({
                            title: 'Are you sure?',
                            text: `Remove ${item?.name} from cart?`,
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#d33',
                            cancelButtonColor: '#3085d6',
                            confirmButtonText: 'Yes, remove it!'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                // Remove item if quantity is 0 and confirmed
                                set((state) => ({
                                    items: state.items.filter((item) => item.id !== productId),
                                }));

                                Swal.fire({
                                    title: 'Removed!',
                                    text: `${item?.name} has been removed from cart`,
                                    icon: 'success',
                                    timer: 1500,
                                    showConfirmButton: false
                                });
                            }
                        });

                        // Don't update quantity to 0, let the confirmation handle removal
                        return state;
                    } else {
                        // Show quantity update message
                        if (item) {
                            Swal.fire({
                                title: 'Quantity Updated!',
                                text: `${item.name} quantity set to ${quantity}`,
                                icon: 'success',
                                timer: 1500,
                                showConfirmButton: false,
                                toast: true,
                                position: 'top-end'
                            });
                        }

                        return {
                            items: state.items.map((item) =>
                                item.id === productId ? { ...item, quantity } : item
                            ),
                        };
                    }
                });
            },

              updateLikeQuantity: (productId, quantity) => {
                set((state) => {
                    const item = state.likes.find(item => item.id === productId);

                    if (quantity === 0) {
                        // Show removal confirmation
                        Swal.fire({
                            title: 'Are you sure?',
                            text: `Remove ${item?.name} from cart?`,
                            icon: 'warning',
                            showCancelButton: true,
                            confirmButtonColor: '#d33',
                            cancelButtonColor: '#3085d6',
                            confirmButtonText: 'Yes, remove it!'
                        }).then((result) => {
                            if (result.isConfirmed) {
                                // Remove item if quantity is 0 and confirmed
                                set((state) => ({
                                    likes: state.likes.filter((item) => item.id !== productId),
                                }));

                                Swal.fire({
                                    title: 'Removed!',
                                    text: `${item?.name} has been removed from cart`,
                                    icon: 'success',
                                    timer: 1500,
                                    showConfirmButton: false
                                });
                            }
                        });

                        // Don't update quantity to 0, let the confirmation handle removal
                        return state;
                    } else {
                        // Show quantity update message
                        if (item) {
                            Swal.fire({
                                title: 'Quantity Updated!',
                                text: `${item.name} quantity set to ${quantity}`,
                                icon: 'success',
                                timer: 1500,
                                showConfirmButton: false,
                                toast: true,
                                position: 'top-end'
                            });
                        }

                        return {
                            likes: state.likes.map((item) =>
                                item.id === productId ? { ...item, quantity } : item
                            ),
                        };
                    }
                });
            },

            clearCart: () => {
                Swal.fire({
                    title: 'Are you sure?',
                    text: "You won't be able to revert this!",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Yes, clear cart!'
                }).then((result) => {
                    if (result.isConfirmed) {
                        set({ items: [] });

                        Swal.fire({
                            title: 'Cart Cleared!',
                            text: 'Your cart has been emptied',
                            icon: 'success',
                            timer: 2000,
                            showConfirmButton: false
                        });
                    }
                });
            },
        }),
        {
            name: 'cart-storage',
            storage: createJSONStorage(() => localStorage), // use localStorage
            version: 1,
            migrate: (persistedState: any, version: number) => {
                if (version === 0) {
                    return persistedState;
                }
                return persistedState;
            },
        }
    )
);