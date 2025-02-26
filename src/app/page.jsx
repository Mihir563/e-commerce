"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { ShoppingCart, Star, Heart, Loader2, X } from "lucide-react";
import Header from "./components/Header";
import { useDispatch, useSelector } from "react-redux";
import { removeFavorite, addFavorite, fetchFavorites } from "../store/favoritesSlice";
import { addCart, removeCart, fetchCart } from "../store/addToCartSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();
  const favorites = useSelector((state) => state.favorites.items);
  const cart = useSelector((state) => state.cart.items);
  const user = typeof window !== 'undefined' ? localStorage.getItem("user") : null;
  const parsedUser = user ? JSON.parse(user) : null;

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  const userId = parsedUser?._id;

  // Enhanced toast notifications
  const showToast = (name, action, type) => {
    const isAddAction = action.includes("added");

    toast.success(`${name} ${action}`, {
      position: "bottom-right",
      autoClose: 1500,
      theme: "dark",
      icon: type === "favorite"
        ? (isAddAction ? "❤️" : "💔")
        : (isAddAction ? "🛒" : "🗑️"),
      style: {
        background: "linear-gradient(#111827, #1f2937 ,#000)",
        color: "white",
        fontSize: "16px",
        fontWeight: "bold",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
      },
    });
  };

  // Toggle login modal
  const toggleLoginModal = () => {
    setShowLoginModal(!showLoginModal);
  };

  // Redirect to login page
  const handleLogin = () => {
    router.push('/auth/login');
    setShowLoginModal(false);
  };

  // Fetch products with error handling
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get("http://localhost:3000/api/products");
        setProducts(response.data);
        setFilteredProducts(response.data);
        setError(null);
      } catch (error) {
        setError("Failed to fetch products. Please try again later.");
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Fetch user data
  useEffect(() => {
    if (userId) {
      dispatch(fetchFavorites(userId));
      dispatch(fetchCart(userId));
    }
  }, [dispatch, userId]);

  // Reset page on filter
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredProducts]);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (showLoginModal && e.target.classList.contains('modal-overlay')) {
        setShowLoginModal(false);
      }
    };

    if (showLoginModal) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLoginModal]);

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const displayedProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage
  );

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Check item status
  const isFavorite = (id) => favorites.some((item) => item.id === id);
  const isCart = (id) => cart.some((item) => item.id === id);

  // Handle product click
  const handleProductClick = (productId) => {
    router.push(`/products/${productId}`);
  };

  if (error) {
    return (
      <>
        <Header
          favorites={favorites}
          cart={cart}
          products={[]}
          onSearch={setFilteredProducts}
          toggleLoginModal={toggleLoginModal}
        />
        <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
          <div className="flex items-center justify-center h-[50vh]">
            <div className="text-center text-white">
              <p className="text-xl">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Header
        favorites={favorites}
        products={products}
        onSearch={setFilteredProducts}
        cart={cart}
        toggleLoginModal={toggleLoginModal}
      />
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        {/* Hero Section */}
        <div className="relative overflow-hidden pt-10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-3xl animate-fadeIn transition-colors duration-500" />
          <div className="relative px-6 py-20">
            <div className="text-center max-w-4xl mx-auto animate-slideDown">
              <h1 className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 hover:bg-gradient-to-l duration-300">
                Future of Shopping
              </h1>
              <p className="text-xl text-gray-300 mt-6 animate-fadeIn delay-200">
                Experience the next generation of online shopping with our
                curated collection
              </p>
            </div>
          </div>
        </div>

        {/* Product Grid */}
        <div className="px-6 py-12">
          {isLoading ? (
            <div className="flex justify-center items-center h-[40vh]">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
              {displayedProducts.length > 0 ? (
                displayedProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="group relative animate-fadeInUp bg-gradient-to-b from-sky-950 via-blue-950 to-slate-900 rounded-2xl p-6 border shadow-xl transition-all duration-700 hover:-translate-y-2 hover:shadow-3xl hover:bg-gradient-to-br"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="">
                      {/* Product Image + Favorite Button */}
                      <div
                        className="relative overflow-hidden rounded-xl aspect-square mb-6 cursor-pointer"
                        onClick={() => handleProductClick(product._id)}
                      >
                        <img
                          src={product.image}
                          alt={product.title}
                          className="object-fill  w-full h-full rounded-md transition-transform duration-300 "
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!userId) {
                              setShowLoginModal(true);
                              return;
                            }
                            const action = isFavorite(product.id)
                              ? removeFavorite({ userId, productId: product._id })
                              : addFavorite({ userId, product });
                            dispatch(action);
                            showToast(
                              product.title,
                              isFavorite(product.id) ? "removed from favorites" : "added to favorites",
                              "favorite"
                            );
                          }}
                          className="absolute top-3 right-3 p-2 rounded-full bg-white/10 hover:bg-white/20"
                        >
                          <Heart
                            className={`w-5 h-5 ${isFavorite(product.id)
                              ? "fill-blue-500 text-blue-500"
                              : "text-blue-500"
                              }`}
                          />
                        </button>
                      </div>

                      {/* Product Details */}
                      <div className="space-y-3">
                        <div className="flex items-center">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${i < Math.floor(product.rating?.rate || 0)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-600"
                                  }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-400 ml-2">
                            ({product.rating?.count || 0})
                          </span>
                        </div>

                        <h2
                          className="font-semibold text-xl leading-tight text-white cursor-pointer hover:text-blue-400 transition-colors"
                          onClick={() => handleProductClick(product._id)}
                        >
                          {product.title.length > 40
                            ? `${product.title.substring(0, 40)}...`
                            : product.title}
                        </h2>

                        <div className="flex items-center justify-between">
                          <p className="text-2xl font-bold text-blue-400">
                            ${product.price}
                          </p>
                          <button
                            onClick={() => {
                              if (!userId) {
                                setShowLoginModal(true);
                                return;
                              }
                              const action = isCart(product.id)
                                ? removeCart({ userId, productId: product._id })
                                : addCart({ userId, product });
                              dispatch(action);
                              showToast(
                                product.title,
                                isCart(product.id) ? "removed from cart" : "added to cart",
                                "cart"
                              );
                            }}
                            className="p-3 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                          >
                            <ShoppingCart
                              className={`h-5 w-5 ${isCart(product.id)
                                ? "fill-blue-500 text-blue-500"
                                : "text-blue-500"
                                }`}
                            />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="col-span-full text-center text-white text-xl">
                  No products found.
                </div>
              )}
            </div>
          )}

          {/* Pagination Controls */}
          {!isLoading && displayedProducts.length > 0 && (
            <div className="flex justify-center items-center mt-8 space-x-4">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50 hover:bg-gray-600 transition-colors"
              >
                Previous
              </button>
              <span className="text-white">
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50 hover:bg-gray-600 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>

        {/* Login Modal */}
        {showLoginModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay bg-white/0 backdrop-blur-sm">
            <div className="bg-gradient-to-br from-sky-950 to-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden ">
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
                        <h3 className="text-white font-medium">Manage Orders</h3>
                        <p className="text-gray-400 text-sm">Track and manage your orders easily</p>
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
                  <div className="pt-4 space-y-3">
                    <button
                      onClick={handleLogin}
                      className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors"
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

        <ToastContainer />
      </main>
    </>
  );
}