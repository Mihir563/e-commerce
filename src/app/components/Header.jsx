"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  ShoppingCart,
  Heart,
  Search,
  Menu,
  X,
  User,
  ShoppingBag,
  Brain
} from "lucide-react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { removeFavorite, addFavorite, fetchFavorites } from "../../store/favoritesSlice";
import { addCart, removeCart, fetchCart } from "../../store/addToCartSlice";

const Header = ({ favorites, products, onSearch, cart }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const categories = ["New Arrivals", "Men", "Women", "Accessories", "Sale"];
  const searchRef = useRef(null);
  const dispatch = useDispatch();
  const realfavorites = useSelector((state) => state.favorites.items);
  const realcart = useSelector((state) => state.cart.items);

  // Handle Search Input
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === "") {
      onSearch(products ?? []); // Show all products when input is empty
      return;
    }

    const filteredProducts = (products ?? []).filter((product) =>
      product?.title
        ?.toLowerCase()
        .split(" ")
        .join("")
        .split("-")
        .join("")
        .includes(term.toLowerCase())
    );

    console.log(filteredProducts);
    onSearch(filteredProducts);
  };

  useEffect(() => {
    if (isSearchOpen) {
      searchRef.current?.focus();
    } else {
      setSearchTerm(""); // Clear input when search is closed
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (isSearchOpen && searchRef.current) {
      searchRef.current.focus();
    }
  }, [isSearchOpen]);

  const user = localStorage.getItem("user");
  const parsedUser = JSON.parse(user);
  const userId = parsedUser._id;
  useEffect(() => {
    dispatch(fetchFavorites(userId));
    dispatch(fetchCart(userId));
  }, [dispatch]);


  return (
    <header className="fixed w-full z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center hover:scale-105 transition-transform duration-200">
            <ShoppingBag className="h-8 w-8 text-blue-400" />
            <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              FutureShop
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8  ">
            <Link
              href="/"
              className="text-gray-300 hover:text-white hover:-translate-y-0.5 transition-all duration-200"
            >
              Home
            </Link>
            <Link
              href="/products/category/men's clothing"
              className="text-gray-300 hover:text-white hover:-translate-y-0.5 transition-all duration-200"
            >
              Men's
            </Link>
            <Link
              href="/products/category/women's clothing"
              className="text-gray-300 hover:text-white hover:-translate-y-0.5 transition-all duration-200"
            >
              Women's
            </Link>
            <Link
              href="/products/category/electronics"
              className="text-gray-300 hover:text-white hover:-translate-y-0.5 transition-all duration-200"
            >
              Electronics
            </Link>
            <Link
              href="/products/category/jewelery"
              className="text-gray-300 hover:text-white hover:-translate-y-0.5 transition-all duration-200"
            >
              Jewelry
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative">
              <button
                onClick={() => setIsSearchOpen((prev) => !prev)}
                className="p-2 text-gray-300 hover:text-white hover:scale-110 transition-transform duration-200"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Search Input */}
              {isSearchOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-gray-800 rounded-lg shadow-xl p-2 animate-fadeIn">
                  <input
                    ref={searchRef}
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />

                  {/* Ask AI Button */}
                  <Link href='/ai' className="bg-blue-600 text-white px-4 py-2 rounded-lg">
                    🤖 Ask AI
                  </Link>

                </div>
              )}

            </div>

            {/* Favorites */}
            <button className="p-2 text-gray-300 hover:text-white hover:scale-110 transition-transform duration-200 relative">
              <Link href="/ai">
                <Brain className='w-5 h-5' />
              </Link>
            </button>
            <button className="p-2 text-gray-300 hover:text-white hover:scale-110 transition-transform duration-200 relative">
              <Link href="/favorites">
                <Heart className="h-5 w-5" />
              </Link>
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {realfavorites?.length}
                </span>

            </button>

            {/* Cart */}
            <button className="p-2 text-gray-300 hover:text-white hover:scale-110 transition-transform duration-200 relative">
              <Link href="/cart">
                <ShoppingCart className="h-5 w-5" />
              </Link>
              <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                {realcart?.length}
              </span>
            </button>

            {/* User */}
            <button className="p-2 text-gray-300 hover:text-white hover:scale-110 transition-transform duration-200">
              <Link href="/user">
                <User className="h-5 w-5" />
              </Link>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-300 hover:text-white transition-colors duration-200"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
