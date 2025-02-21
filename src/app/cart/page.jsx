'use client'

import React, { useEffect, useMemo, useCallback } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { ShoppingCart, Trash, ArrowLeft } from "lucide-react";
import { removeCart, fetchCart } from "../../store/addToCartSlice";
import { fetchFavorites} from "../../store/favoritesSlice";

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
            className="group relative animate-fadeInUp"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 
                     shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                <div className="relative overflow-hidden rounded-xl aspect-square mb-6">
                    <img
                        src={product.image}
                        alt={product.title}
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
                        {product.title?.length > 40 ? `${product.title.substring(0, 40)}...` : product.title}
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

    const user = localStorage.getItem("user");
    const parsedUser = JSON.parse(user);
    const userId = parsedUser._id;

    const handleRemoveCartItem = useCallback((id) => {
        console.log(id);
        
        dispatch(removeCart({ userId, productId: id }));
    }, [dispatch, userId]);

    const subtitle = useMemo(() =>
        cart.length > 0 ? SUBTITLE_WITH_ITEMS : SUBTITLE_EMPTY,
        [cart.length]
    );

    const totalPrice = useMemo(() =>
        cart.reduce((sum, item) => sum + item.productId.price, 0).toFixed(2),
        [cart]
    );

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
        </>
    );
};

export default React.memo(CartPage);
