"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { ShoppingCart, Star, Heart } from "lucide-react";
import Header from "./components/Header";
import { useDispatch, useSelector } from "react-redux";
import { removeFavorite, addFavorite } from "../store/favoritesSlice";
import { addCart } from "../store/addToCartSlice";
import { ToastContainer, toast } from "react-toastify";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.items);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8; // Adjust the number of products per page

  // Toast notification for favorites
  const notify = (name) => {
    toast.success(`${name} added to favorites!`, {
      position: "bottom-right",
      autoClose: 1000,
      theme: "dark",
      icon: "❤️",
    });
  };

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("https://fakestoreapi.com/products");
        setProducts(response.data);
        setFilteredProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  // Handle search/filter
  useEffect(() => {
    setCurrentPage(1); // Reset to first page when filtering
  }, [filteredProducts]);

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
    }
  };

  // Check if a product is in favorites
  const isFavorite = (id) => favorites.some((item) => item.id === id);

  return (
    <>
      <Header
        favorites={favorites}
        products={products}
        onSearch={setFilteredProducts}
      />
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black hover">
        {/* Hero Section */}
        <div className="relative overflow-hidden pt-10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-3xl animate-fadeIn  " />
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {displayedProducts.length > 0 ? (
              displayedProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="group relative animate-fadeInUp"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="bg-gradient-to-b from-sky-950 via-blue-950 to-slate-900 rounded-2xl p-6 border shadow-xl transition-all duration-700 hover:-translate-y-2 hover:shadow-3xl hover:bg-gradient-to-br">
                    {/* Product Image + Favorite Button */}
                    <div className="relative overflow-hidden rounded-xl aspect-square mb-6">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="object-cover w-full h-full rounded-md transition-transform duration-300"
                      />
                      <button
                        onClick={() => {
                          dispatch(
                            isFavorite(product.id)
                              ? removeFavorite(product)
                              : addFavorite(product)
                          );
                          notify(product.title);
                        }}
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/10 hover:bg-white/20"
                      >
                        <Heart
                          className={`w-5 h-5 ${
                            isFavorite(product.id)
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
                              className={`w-4 h-4 ${
                                i < Math.floor(product.rating?.rate || 0)
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

                      <h2 className="font-semibold text-xl leading-tight text-white">
                        {product.title.length > 40
                          ? `${product.title.substring(0, 40)}...`
                          : product.title}
                      </h2>

                      <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold text-blue-400">
                          ${product.price}
                        </p>
                        <button
                          onClick={() => dispatch(addCart(product))}
                          className="bg-blue-600 hover:bg-blue-500 p-3 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
                        >
                          <ShoppingCart className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-white">No products found.</p>
            )}
          </div>

          {/* Pagination Controls */}
          <div className="flex justify-center items-center mt-8 space-x-4">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-white">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-700 text-white rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
        <ToastContainer />
      </main>
    </>
  );
}
