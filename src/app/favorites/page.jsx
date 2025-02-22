'use client'

import React from 'react';
import { useDispatch, useSelector } from "react-redux";
import { ShoppingCart, Star, Heart, ArrowLeft } from "lucide-react";
import { removeFavorite } from "../../store/favoritesSlice";
import { addCart, removeCart } from "../../store/addToCartSlice";
import Header from '../components/Header';
import Link from 'next/link';

const RATING_ARRAY = [...Array(5)];
const EMPTY_STATE_MESSAGE = "Your favorites list is empty";
const EMPTY_STATE_CTA = "Continue Shopping";
const TITLE = "Your Favorites";
const SUBTITLE_WITH_ITEMS = "Collection of your most loved items";
const SUBTITLE_EMPTY = "Start adding items to your favorites!";

const FavoritesPage = () => {
    const dispatch = useDispatch();
    const favorites = useSelector((state) => state.favorites.items);
    const cart = useSelector((state) => state.cart.items);
    const user = localStorage.getItem("user");
    const parsedUser = JSON.parse(user);
    const userId = parsedUser?._id;

    const handleRemoveFavorite = (userId, id) => {
        dispatch(removeFavorite({userId, productId: id}));
    };

    const isCart = (id) => cart.some((item) => item.id === id);

    const subtitle = favorites.length > 0 ? SUBTITLE_WITH_ITEMS : SUBTITLE_EMPTY;

    return (
        <>
            <Header favorites={favorites} cart={cart} />
            <main className="min-h-screen bg-gradient-to-br pt-10 from-gray-900 via-gray-800 to-black text-white">
                <div className="relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-pink-500/20 to-purple-500/20 backdrop-blur-3xl animate-fadeIn" />
                    <div className="relative px-6 py-20 text-center max-w-4xl mx-auto animate-slideDown">
                        <h1 className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400">
                            {TITLE}
                        </h1>
                        <p className="text-xl text-gray-300 mt-6 animate-fadeIn delay-200">{subtitle}</p>
                    </div>
                </div>
                <div className="px-6 py-12">
                    {favorites.length === 0 ? (
                        <div className="text-center py-20 animate-fadeIn">
                            <p className="text-2xl text-gray-400 mb-8">{EMPTY_STATE_MESSAGE}</p>
                            <Link href="/" className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 px-8 rounded-full text-lg shadow-lg shadow-blue-500/25 hover:shadow-blue-500/50 transition-all duration-300 hover:scale-105 active:scale-95">
                                <ArrowLeft className="w-5 h-5" />
                                {EMPTY_STATE_CTA}
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
                            {favorites.map((product, index) => (
                                <div key={product.id} className="group relative animate-fadeInUp" style={{ animationDelay: `${index * 50}ms` }}>
                                    <div className="bg-gray-800/50 backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 shadow-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl">
                                        <div className="relative overflow-hidden rounded-xl aspect-square mb-6">
                                            <img src={product.image} alt={product.title} className="object-fill w-full h-full transition-transform duration-300" loading="lazy" />
                                            <button onClick={() => {handleRemoveFavorite(userId,product._id);
                                            }} className="absolute top-3 right-3 p-2 rounded-full bg-white/10 backdrop-blur-md hover:bg-white/20 transition-colors duration-200">
                                                <Heart className="w-5 h-5 fill-blue-500 text-blue-500" />
                                            </button>
                                        </div>
                                        <div className="space-y-3">
                                            <div className="flex items-center">
                                                <div className="flex items-center gap-1">
                                                    {RATING_ARRAY.map((_, i) => (
                                                        <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating?.rate || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`} />
                                                    ))}
                                                </div>
                                                <span className="text-sm text-gray-400 ml-2">({product.rating?.count || 0})</span>
                                            </div>
                                            <h2 className="font-semibold text-lg leading-tight">
                                                {product.title.length > 40 ? `${product.title.substring(0, 40)}...` : product.title}
                                            </h2>
                                            <div className="flex items-center justify-between">
                                                <p className="text-2xl font-bold text-blue-400">${product.price}</p>
                                                <button onClick={() => dispatch(isCart(product.id) ? removeCart(product) : addCart(product))} className="bg-blue-600 hover:bg-blue-500 p-3 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95">
                                                    <ShoppingCart className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </>
    );
};

export default FavoritesPage;