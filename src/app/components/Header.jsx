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
  Brain,
  ChevronDown
} from "lucide-react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { fetchFavorites } from "../../store/favoritesSlice";
import { fetchCart } from "../../store/addToCartSlice";

const Header = ({ favorites, products, onSearch, cart, categories }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isMobileCategoryOpen, setIsMobileCategoryOpen] = useState(false);
  const searchRef = useRef(null);
  const searchContainerRef = useRef(null);
  const categoryDropdownRef = useRef(null);
  const dispatch = useDispatch();
  const realFavorites = useSelector((state) => state.favorites.items);
  const realCart = useSelector((state) => state.cart.items);

  // Default categories if none are provided
  const defaultCategories = [
    { id: "men's clothing", name: "Men's" },
    { id: "women's clothing", name: "Women's" },
    { id: "electronics", name: "Electronics" },
    { id: "jewelery", name: "Jewelry" }
  ];

  // Use provided categories or fallback to defaults
  const displayCategories = categories || defaultCategories;

  // Close search and dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target)) {
        setIsCategoryDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle Search Input with debouncing
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    if (term.trim() === "") {
      setSearchResults([]);
      onSearch(products ?? []);
      return;
    }

    const filteredProducts = (products ?? []).filter((product) =>
      product?.title
        ?.toLowerCase()
        .includes(term.toLowerCase())
    );

    setSearchResults(filteredProducts.slice(0, 5)); // Show only top 5 results
    onSearch(filteredProducts);
  };

  useEffect(() => {
    if (isSearchOpen) {
      searchRef.current?.focus();
    } else {
      setSearchTerm("");
      setSearchResults([]);
    }
  }, [isSearchOpen]);

  // Fetch user data
  const user = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;
  const userId = parsedUser?._id;

  useEffect(() => {
    if (userId) {
      dispatch(fetchFavorites(userId));
      dispatch(fetchCart(userId));
    }
  }, [dispatch, userId]);

  return (
    <header className="fixed w-full z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center hover:scale-105 transition-transform duration-200">
            <ShoppingBag className="h-8 w-8 text-blue-400" />
            <span className="ml-2 text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              FutureShop
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              href="/"
              className="text-gray-300 hover:text-white hover:-translate-y-0.5 transition-all duration-200"
            >
              Home
            </Link>

            {/* Categories Dropdown */}
            <div className="relative" ref={categoryDropdownRef}>
              <button
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className="flex items-center text-gray-300 hover:text-white hover:-translate-y-0.5 transition-all duration-200"
              >
                Categories
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>

              {isCategoryDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-xl overflow-hidden  z-50">
                  {displayCategories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/products/category/${category.id}`}
                      className="block px-4 py-2 text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                      onClick={() => setIsCategoryDropdownOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="relative" ref={searchContainerRef}>
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-gray-300 hover:text-white hover:scale-110 transition-transform duration-200"
                title="Search"
              >
                <Search className="h-5 w-5" />
              </button>

              {/* Search Input and Results */}
              {isSearchOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-xl overflow-hidden">
                  <div className="p-2">
                    <input
                      ref={searchRef}
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="w-full bg-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>

                  {searchResults.length > 0 && (
                    <div className="max-h-64 overflow-y-auto border-t border-gray-700">
                      {searchResults.map((product) => (
                        <Link
                          key={product.id}
                          href={`/products/${product._id}`}
                          className="flex items-center gap-3 p-2 hover:bg-gray-700 transition-colors"
                          onClick={() => setIsSearchOpen(false)}
                        >
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white truncate">{product.title}</p>
                            <p className="text-sm text-blue-400">${product.price}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}

                  <div className="p-2 border-t border-gray-700">
                    <Link
                      href="/ai"
                      className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 transition-colors"
                      onClick={() => setIsSearchOpen(false)}
                    >
                      <Brain className="w-4 h-4" />
                      Ask AI Assistant
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* AI */}
            <Link
              href="/ai"
              className="p-2 text-gray-300 hover:text-white hover:scale-110 transition-transform duration-200 relative"
              title="AI Assistant"
            >
              <Brain className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 text-red-500 font-semibold text-xs">
                new
              </span>
            </Link>

            {/* Favorites */}
            <Link
              href="/favorites"
              className="p-2 text-gray-300 hover:text-white hover:scale-110 transition-transform duration-200 relative"
              title="Favorites"
            >
              <Heart className="h-5 w-5" />
              {realFavorites?.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {realFavorites.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              className="p-2 text-gray-300 hover:text-white hover:scale-110 transition-transform duration-200 relative"
              title="Cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {realCart?.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                  {realCart.length}
                </span>
              )}
            </Link>

            {/* User */}
            <Link
              href="/user"
              className="p-2 text-gray-300 hover:text-white hover:scale-110 transition-transform duration-200"
              title="Account"
            >
              <User className="h-5 w-5" />
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden sm:hidden p-2 text-gray-300 hover:text-white transition-colors duration-200"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-gray-700">
              <Link
                href="/"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>

              {/* Mobile Categories Menu */}
              <div className="relative">
                <div
                  className="flex items-center justify-between px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 cursor-pointer transition-colors"
                  onClick={() => setIsMobileCategoryOpen(!isMobileCategoryOpen)}
                >
                  <span>Categories</span>
                  <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isMobileCategoryOpen ? 'rotate-180' : ''}`} />
                </div>

                {isMobileCategoryOpen && (
                  <div className="bg-gray-800 rounded-md mt-1 overflow-hidden">
                    {displayCategories.map((category) => (
                      <Link
                        key={category.id}
                        href={`/products/category/${category.id}`}
                        className="block px-6 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                        onClick={() => {
                          setIsMobileCategoryOpen(false);
                          setIsMenuOpen(false);
                        }}
                      >
                        {category.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;