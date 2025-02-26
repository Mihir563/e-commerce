'use client'

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { ShoppingCart, Trash, ArrowLeft, X, Heart, Star } from "lucide-react";
import { removeCart, fetchCart } from "../../store/addToCartSlice";
import { fetchFavorites} from "../../store/favoritesSlice";
import { useRouter } from "next/navigation";

import Header from '../components/Header';
import Link from 'next/link';

const EMPTY_STATE_MESSAGE = "Your cart is empty";
const EMPTY_STATE_CTA = "Shop Now";
const TITLE = "Your Cart";
const SUBTITLE_WITH_ITEMS = "Review your selected items before checkout";
const SUBTITLE_EMPTY = "Add items to your cart to proceed";


const CartItem = React.memo(({ product, index, onRemove }) => {
    const dispatch = useDispatch();
      const user = localStorage.getItem("user");
      const parsedUser = JSON.parse(user);
      const userId = parsedUser._id;
      useEffect(() => {
        dispatch(fetchFavorites(userId));
        dispatch(fetchCart(userId));
      }, [dispatch]);
    
    return (
        <div
            className="group relative animate-fadeInUp bg-gradient-to-b from-sky-950 via-blue-950 to-slate-900 hover:bg-gradient-to-t backdrop-blur-lg rounded-2xl p-6 border 
                     shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            <div className=" ">
                <div className="relative overflow-hidden rounded-xl aspect-square mb-6">
                    <img
                        src={product?.image}
                        alt={product?.title}
                        className="object-fill w-full h-full transition-transform duration-300"
                        loading="lazy"
                    />
                    <button
                        onClick={() => onRemove(product?._id)}
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/10 backdrop-blur-md 
                      hover:bg-white/20 transition-colors duration-200"
                    >
                        <Trash className="w-5 h-5 text-red-500" />
                    </button>
                </div>

                <div className="space-y-3">
                    <h2 className="font-semibold text-lg leading-tight">
                        {product?.title?.length > 40 ? `${product?.title?.substring(0, 40)}...` : product?.title}
                    </h2>
                    <p className="text-2xl font-bold text-blue-400">${product.price}</p>
                </div>
            </div>
        </div>
    );
});

const EmptyState = React.memo(() => (
    <div className="text-center py-20 animate-fadeIn">
        <p className="text-2xl text-gray-400 mb-8">{EMPTY_STATE_MESSAGE}</p>
        <Link
            href="/"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 
                text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg 
                shadow-blue-500/25 hover:shadow-blue-500/50 transition-all duration-300 
                hover:scale-105 active:scale-95"
        >
            <ArrowLeft className="w-5 h-5" />
            {EMPTY_STATE_CTA}
        </Link>
    </div>
));

const CartPage = () => {
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart.items);
    const [showLoginModal, setShowLoginModal] = useState(false);
    const router = useRouter();

    const user = localStorage.getItem("user");
    const parsedUser = JSON.parse(user);
    const userId = parsedUser?._id;

    const handleRemoveCartItem = useCallback((id) => {
        console.log(id);
        
        dispatch(removeCart({ userId, productId: id }));
    }, [dispatch, userId]);

    const subtitle = useMemo(() =>
        cart.length > 0 ? SUBTITLE_WITH_ITEMS : SUBTITLE_EMPTY,
        [cart.length]
    );

    const totalPrice = useMemo(() =>
        cart.reduce((sum, item) => sum + item?.productId?.price, 0).toFixed(2),
        [cart]
    );
    
    useEffect(() => {
        if (!user) {
            setShowLoginModal(true)
        }
        
    },[showLoginModal])

    const toggleLoginModal = () => setShowLoginModal((prev) => !prev)

    const handleLogin = (route) => {
        setShowLoginModal(false)
        router.push(route)
    }

    return (
        <>
            <Header cart={cart} />
            <main className="min-h-screen bg-gradient-to-br pt-10 from-gray-900 via-gray-800 to-black text-white">
                <div className="relative overflow-hidden pt-">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-3xl animate-fadeIn" />
                    <div className="relative px-6 py-20">
                        <div className="text-center max-w-4xl mx-auto animate-slideDown">
                            <h1 className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400">
                                {TITLE}
                            </h1>
                            <p className="text-xl text-gray-300 mt-6 animate-fadeIn delay-200">
                                {subtitle}
                            </p>
                        </div>
                    </div>
                </div>

                {cart.length === 0 ? (
                    <EmptyState />
                ) : (
                    <div className="px-6 py-12 max-w-7xl mx-auto">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {cart.map((product, index) => (
                                <CartItem key={index} product={product.productId} index={index} onRemove={handleRemoveCartItem} />
                            ))}
                        </div>
                        <div className="text-right text-2xl font-bold mt-10">
                            Total: <span className="text-blue-400">${totalPrice}</span>
                        </div>
                    </div>
                )}
            </main>
            {/* Login Modal */}
            {showLoginModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay bg-white/0 backdrop-blur-sm">
                    <div className="bg-gradient-to-br from-sky-950 to-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-fadeIn">
                        {/* Modal Header */}
                        <div className="flex justify-between items-center border-b border-blue-800/30 p-6 bg-sky-950">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Login</h2>
                                <p className="text-gray-300 mt-1">Access your account</p>
                            </div>
                            <button
                                onClick={toggleLoginModal}
                                className="p-2 rounded-full hover:bg-slate-800 transition-colors"
                            >
                                <X className="h-6 w-6 text-gray-300" />
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6">
                            <div className="space-y-6">
                                {/* Login Benefits */}
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <div className="bg-blue-500/10 p-2 rounded-full mr-3">
                                            <ShoppingCart className="h-5 w-5 text-blue-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-medium">Add to Cart</h3>
                                            <p className="text-gray-400 text-sm">Manage your Cart easily</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="bg-blue-500/10 p-2 rounded-full mr-3">
                                            <Heart className="h-5 w-5 text-blue-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-medium">Save Favorites</h3>
                                            <p className="text-gray-400 text-sm">Keep track of items you love</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="bg-blue-500/10 p-2 rounded-full mr-3">
                                            <Star className="h-5 w-5 text-blue-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-medium">Personalized Experience</h3>
                                            <p className="text-gray-400 text-sm">Get recommendations based on your preferences</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Buttons */}
                                <div className="pt-4 space-y-3 ">
                                    <button
                                        onClick={() => handleLogin('/')}
                                        className="w-[49%] py-3 px-4 bg-blue-200/20 border-2 text-white font-semibold rounded-lg transition-colors"
                                    >
                                        Go back
                                    </button>
                                    <button
                                        onClick={() => handleLogin('/auth/login')}
                                        className="w-[49%] ml-2 py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors"
                                    >
                                        Login / Sign Up
                                    </button>
                                    <p className="text-gray-400 text-center text-sm">
                                        By continuing, you agree to our Terms of Use and Privacy Policy
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default React.memo(CartPage);
