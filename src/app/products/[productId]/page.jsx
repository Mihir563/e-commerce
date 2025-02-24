"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCart, removeCart, fetchCart } from "../../../store/addToCartSlice";
import { ShoppingCart, Star, Heart, Loader2 } from "lucide-react";
import { useRouter, useParams } from "next/navigation";
import axios from "axios";
import Header from "../../components/Header";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import {
  addFavorite,
  removeFavorite,
  fetchFavorites,
} from "../../../store/favoritesSlice";

const ProductPage = () => {
  const router = useRouter();
  const params = useParams();
  const productId = params?.productId;
  const [productData, setProductData] = useState(null);
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart.items);
  const favorites = useSelector((state) => state.favorites.items);
  const user = localStorage.getItem("user");
  const parsedUser = JSON.parse(user);
  const userId = parsedUser?._id;
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);
  const [recommendationError, setRecommendationError] = useState(null);

  // Toast notifications
  const notify = (name, action) => {
    toast.success(`${name} ${action} favorites!`, {
      position: "bottom-right",
      autoClose: 1000,
      theme: "dark",
      icon: action === "added to" ? "❤️" : "💔",
      style: {
        background: "linear-gradient(#111827, #1f2937 ,#000)",
        color: "blue",
        fontSize: "16px",
        fontWeight: "bold",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
      },
    });
  };

  const addedToCart = (name) => {
    toast.success(`${name} added to Cart!`, {
      position: "bottom-right",
      autoClose: 1000,
      theme: "dark",
      icon: "🛒",
      style: {
        background: "linear-gradient(#111827, #1f2937 ,#000)",
        color: "blue",
        fontSize: "16px",
        fontWeight: "bold",
        borderRadius: "10px",
        boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
      },
    });
  };

  // Fetch recommendations function
  const fetchRecommendations = async (category) => {
    if (!category) return;

    setLoadingRecommendations(true);
    setRecommendationError(null);

    try {
      const response = await axios.get(
        `http://localhost:3000/api/products?category=${category}`
      );
      const filteredProducts = response.data
        .filter((item) => item._id !== productId) // Exclude current product
        .filter((item) => item.category === category) // Ensure only same category products
        .slice(0, 4); // Limit to 4 recommendations

      setRecommendedProducts(filteredProducts);
    } catch (error) {
      console.error("Error fetching recommendations:", error);
      setRecommendationError("Failed to load recommended products");
    } finally {
      setLoadingRecommendations(false);
    }
  };

  // Fetch product data and recommendations
  useEffect(() => {
    if (productId) {
      axios
        .get(`http://localhost:3000/api/products/${productId}`)
        .then((res) => {
          setProductData(res.data);
          fetchRecommendations(res.data.category);
        })
        .catch((err) => {
          setError(err.response?.data?.message || "Failed to fetch product");
        });
    }
  }, [productId]);

  // Fetch user data
  useEffect(() => {
    if (userId) {
      dispatch(fetchFavorites(userId));
      dispatch(fetchCart(userId));
    }
  }, [dispatch, userId]);

  const isFavorite = (id) => favorites.some((item) => item.id === id);
  const isCart = (id) => cart.some((item) => item.id === id);

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <Header favorites={favorites} cart={cart} />
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
      </div>
    );
  }

  // Loading state
  if (!productData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <Header favorites={favorites} cart={cart} />
        <div className="flex items-center justify-center h-[50vh]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin mx-auto" />
            <p className="text-gray-400 mt-4 text-lg">
              Loading product details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Recommended Products Component
  const RecommendedProducts = () => {
    if (loadingRecommendations) {
      return (
        <div className="mt-10 px-6">
          <h2 className="text-2xl font-semibold text-white mb-4">
            Recommended Products
          </h2>
          <div className="flex justify-center items-center h-40">
            <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
          </div>
        </div>
      );
    }

    if (recommendationError) {
      return (
        <div className="mt-10 px-6">
          <div className="text-center text-gray-400">{recommendationError}</div>
        </div>
      );
    }

    if (!recommendedProducts.length) {
      return null;
    }

    return (
      <div className="mt-10 px-6">
        <h2 className="text-2xl font-semibold text-white mb-4">
          More from {productData.category}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {recommendedProducts.map((product) => (
            <div
              key={product._id}
              className="bg-gradient-to-b from-sky-950 via-blue-950 to-slate-900 rounded-2xl p-6 border shadow-xl transition-all duration-700 hover:-translate-y-2 hover:shadow-3xl hover:bg-gradient-to-br"
            >
              <div className="aspect-square relative mb-3">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <h3 className="text-white text-lg font-semibold line-clamp-2 h-14 mb-2">
                {product.title}
              </h3>
              <p className="text-blue-400 text-xl font-bold mb-3">
                ${product.price}
              </p>
              <button
                onClick={() => router.push(`/products/${product._id}`)}
                className="w-full bg-blue-600 hover:bg-blue-500 text-white py-2 rounded-lg transition-colors duration-200"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Main render
  return (
    <>
      <Header favorites={favorites} cart={cart} />
          <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
        <div className="relative overflow-hidden pt-10">
                  <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-black backdrop-blur-3xl" />
          <div className="relative px-6 py-20">
            <div className="max-w-4xl mx-auto bg-gradient-to-b from-sky-950 via-blue-950 to-slate-900 rounded-2xl p-8 border shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="relative">
                  <div className="relative overflow-hidden rounded-xl aspect-square">
                    <img
                      src={productData.image}
                      alt={productData.title}
                      className="object-contain w-full h-full rounded-lg transition-transform duration-300"
                    />
                    <button
                      onClick={() => {
                        dispatch(
                          isFavorite(productData.id)
                            ? removeFavorite({
                                userId,
                                productId: productData._id,
                              })
                            : addFavorite({ userId, product: productData })
                        );
                        notify(
                          productData.title,
                          isFavorite(productData.id)
                            ? "removed from"
                            : "added to"
                        );
                      }}
                      className="absolute top-3 right-3 p-2 rounded-full bg-white/10 hover:bg-white/20"
                    >
                      <Heart
                        className={`w-5 h-5 ${
                          isFavorite(productData.id)
                            ? "fill-blue-500 text-blue-500"
                            : "text-blue-500"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  <h1 className="text-3xl font-bold text-white">
                    {productData.title}
                  </h1>
                  <p className="text-gray-300">{productData.description}</p>

                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < Math.floor(productData.rating?.rate || 0)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-600"
                        }`}
                      />
                    ))}
                    <span className="text-sm text-gray-400 ml-2">
                      ({productData.rating?.count || 0})
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-3xl font-bold text-blue-400">
                      ${productData.price}
                    </p>
                    <button
                      onClick={() => {
                        dispatch(
                          isCart(productData.id)
                            ? removeCart({ userId, productId: productData._id })
                            : addCart({ userId, product: productData })
                        );
                        addedToCart(productData.title);
                      }}
                      className="bg-blue-600 hover:bg-blue-500 p-3 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95 flex items-center gap-2"
                    >
                      <ShoppingCart
                        className={`w-5 h-5 ${
                          isCart(productData.id)
                            ? "fill-white text-white"
                            : "text-white"
                        }`}
                      />
                      {isCart(productData.id)
                        ? "Remove from Cart"
                        : "Add to Cart"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <RecommendedProducts />
          </div>
        </div>
        <ToastContainer />
      </main>
    </>
  );
};

export default ProductPage;
