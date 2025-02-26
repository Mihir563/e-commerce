"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { removeFavorite, fetchFavorites } from "../../store/favoritesSlice";
import { removeCart, fetchCart } from "../../store/addToCartSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Header from "../components/Header";
import DeleteAccount from "../components/DeleteAccount";
import { GiHand } from "react-icons/gi";
import {
  Heart,
  LogOut,
  CircleX,
  Edit2,
  X,
  Check,
  LogIn,
  ShoppingCart,
  User,
  Star,
  Box,
  Sparkles,
  CreditCard,
  Home,
  Mail,
} from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

export default function UserPage() {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");
  const [showEmptyState, setShowEmptyState] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
  });

  const router = useRouter();
  const dispatch = useDispatch();

  // Fetch user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setUserId(storedUser._id);
      setEditForm({
        name: storedUser.name,
        email: storedUser.email,
      });
    }
    setIsLoading(false);
  }, []);

  // Redux states
  const favorites = useSelector((state) => state.favorites.items);
  const cart = useSelector((state) => state.cart.items);

  // Fetch favorites & cart when userId is available
  useEffect(() => {
    if (userId) {
      dispatch(fetchFavorites(userId));
      dispatch(fetchCart(userId));
    }
  }, [dispatch, userId]);

  // Handle empty states with animation after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowEmptyState(true);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Handle edit form changes
  const handleEditChange = (e) => {
    setEditForm({
      ...editForm,
      [e.target.name]: e.target.value,
    });
  };

  // Handle edit form submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post("/api/auth/update", editForm);

      if (response.data.user) {
        // Update localStorage
        const updatedUser = response.data.user;
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);

        setIsEditing(false);
        toast.success("Profile updated successfully!", {
          position: "bottom-right",
          theme: "dark",
          icon: "✨",
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to update profile", {
        position: "bottom-right",
        theme: "dark",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Logged out successfully!", {
      position: "bottom-right",
      autoClose: 1000,
      theme: "dark",
      icon: "👋",
    });
    setTimeout(() => router.push("/auth/login"), 1000);
  };

  // Delete account function
  const handleDeleteAccount = async () => {
    try {
      const response = await axios.delete("/api/auth/update", {
        data: { userId },
      });

      localStorage.removeItem("user");
      toast.success("Account deleted successfully", {
        position: "bottom-right",
        theme: "dark",
      });
      setTimeout(() => router.push("/auth/login"), 1500);
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to delete account", {
        position: "bottom-right",
        theme: "dark",
      });
    }
  };

  // Handle login redirect
  const handleLoginRedirect = () => {
    router.push("/auth/login");
  };

  const handleProductClick = (productId) => {
    router.push(`/products/${productId}`);
  };

  // Calculate total cart price
  const cartTotal = cart
    .reduce((total, item) => {
      return total + (item?.productId?.price || 0);
    }, 0)
    .toFixed(2);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <>
      <Header favorites={favorites} cart={cart} />
      <main className="min-h-screen bg-gradient-to-br pt-10 from-gray-900 via-gray-800 to-black relative z-10 overflow-hidden">
        {/* Animated background elements */}
        <div className="absolute top-1/3 left-1/5 w-40 h-40 rounded-full bg-blue-500/20 animate-float-slow"></div>
        <div className="absolute top-2/3 left-1/2 w-32 h-32 rounded-full bg-blue-600/20 animate-float-fast"></div>
        <div className="absolute top-1/6 right-1/2 w-48 h-48 rounded-full bg-indigo-500/20 animate-float-reverse"></div>
        <div className="absolute top-1/4 right-1/6 w-36 h-36 rounded-full bg-red-500/20 animate-float-zigzag"></div>
        {/* <div className="absolute bottom-1/3 left-1/4 w-44 h-44 rounded-full bg-green-500/20 animate-float-wavy"></div> */}
        <div className="absolute top-1/5 right-1/4 w-38 h-38 rounded-full bg-yellow-500/20 animate-float-circular"></div>
        <div className="absolute bottom-1/4 left-1/3 w-50 h-50 rounded-full bg-teal-500/20 animate-float-expand-contract"></div>
        <div className="absolute bottom-1/6 right-1/3 w-50 h-50 overflow-hidden rounded-full bg-purple-500/20 animate-float-expand-contract"></div>

        {/* Fancy glowing line */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient-x"></div>

        <div className="max-w-5xl mx-auto py-12 px-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
              <div className="w-16 h-16 border-t-4 border-b-4 border-blue-500 rounded-full animate-spin"></div>
              <p className="text-white mt-4 text-xl">
                Loading your dashboard...
              </p>
            </div>
          ) : user ? (
            <>
              {/* User Dashboard */}
              <div className="bg-gradient-to-b from-sky-950 via-blue-950 to-slate-900 rounded-2xl p-8 border border-blue-800/30 shadow-2xl backdrop-blur-sm relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-60 h-60 bg-indigo-500/10 rounded-full blur-3xl"></div>

                {isEditing ? (
                  <form
                    onSubmit={handleEditSubmit}
                    className="space-y-6 relative z-10"
                  >
                    <h2 className="text-3xl font-bold text-white mb-6 flex items-center">
                      <Edit2 className="w-6 h-6 mr-2 text-blue-400" /> Edit Your
                      Profile
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-white text-lg">Name</label>
                        <input
                          type="text"
                          name="name"
                          value={editForm.name}
                          onChange={handleEditChange}
                          className="w-full px-4 py-3 rounded-lg bg-gray-800/80 text-white border border-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                          disabled={isLoading}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-white text-lg">
                          Email
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={editForm.email}
                          onChange={handleEditChange}
                          className="w-full px-4 py-3 rounded-lg bg-gray-800/80 text-white border border-gray-700 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                          disabled={isLoading}
                        />
                      </div>
                    </div>
                    <div className="flex gap-4 mt-6">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30"
                      >
                        <Check className="w-5 h-5" /> Save Changes
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsEditing(false);
                          setEditForm({
                            name: user.name,
                            email: user.email,
                          });
                        }}
                        className="bg-gray-700 hover:bg-gray-600 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-300"
                      >
                        <X className="w-5 h-5" /> Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
                      <div className="space-y-4">
                        <div className="inline-flex items-center bg-blue-500/10 px-4 py-2 rounded-full border border-blue-400/20">
                          <Sparkles className="w-5 h-5 text-blue-400 mr-2" />
                          <span className="text-blue-300">
                            Account Dashboard
                          </span>
                        </div>
                        <h1 className="text-4xl font-bold text-white capitalize flex items-center">
                          <span className="mr-3">
                            Welcome back, {user.name}
                          </span>
                              <span className="inline-block scale-x-[-1] ">
                                <GiHand className="text-[#E0AC69] z-0 animate-wave" />
                              </span>

                        </h1>
                        <p className="text-lg text-gray-300 flex items-center">
                          <Mail className="w-5 h-5 mr-2 text-blue-400" />{" "}
                          {user.email}
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-gray-400">
                          <span className="inline-block w-3 h-3 bg-green-500 rounded-full "></span>
                          <span>Premium Member</span>
                        </div>
                      </div>
                      <div className="flex gap-3 flex-wrap">
                        <button
                          onClick={() => setIsEditing(true)}
                          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20"
                        >
                          <Edit2 className="w-5 h-5" /> Edit Profile
                        </button>
                        <button
                          onClick={handleLogout}
                          className="cursor-pointer bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20"
                        >
                          <LogOut className="w-5 h-5" /> Logout
                        </button>
                        <DeleteAccount onDeleteAccount={handleDeleteAccount} />
                      </div>
                    </div>

                    {/* Dashboard Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                      <div className="bg-gradient-to-br from-blue-900/60 to-indigo-900/60 rounded-xl p-4 border border-blue-800/30 backdrop-blur-sm shadow-lg transition-transform hover:transform hover:scale-101">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-300 text-sm">
                              Favorite Items
                            </p>
                            <h3 className="text-2xl font-bold text-white">
                              {favorites.length}
                            </h3>
                          </div>
                          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <Heart className="w-6 h-6 text-blue-400" />
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-blue-900/60 to-indigo-900/60 rounded-xl p-4 border border-blue-800/30 backdrop-blur-sm shadow-lg transition-transform hover:transform hover:scale-101">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-300 text-sm">Cart Items</p>
                            <h3 className="text-2xl font-bold text-white">
                              {cart.length}
                            </h3>
                          </div>
                          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <ShoppingCart className="w-6 h-6 text-blue-400" />
                          </div>
                        </div>
                      </div>

                      <div className="bg-gradient-to-br from-blue-900/60 to-indigo-900/60 rounded-xl p-4 border border-blue-800/30 backdrop-blur-sm shadow-lg transition-transform hover:transform hover:scale-101">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-gray-300 text-sm">
                              Total Cart Value
                            </p>
                            <h3 className="text-2xl font-bold text-white">
                              ${cartTotal}
                            </h3>
                          </div>
                          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <CreditCard className="w-6 h-6 text-blue-400" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Tab navigation */}
              <div className="flex mt-10 space-x-2 border-b border-gray-800 pb-2">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`px-4 py-2 rounded-t-lg flex items-center gap-2 transition-all duration-300 ${
                    activeTab === "profile"
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white border-b-2 border-blue-400"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  <User className="w-5 h-5" /> Profile
                </button>
                <button
                  onClick={() => setActiveTab("favorites")}
                  className={`px-4 py-2 rounded-t-lg flex items-center gap-2 transition-all duration-300 ${
                    activeTab === "favorites"
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white border-b-2 border-blue-400"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  <Heart className="w-5 h-5" /> Favorites
                </button>
                <button
                  onClick={() => setActiveTab("cart")}
                  className={`px-4 py-2 rounded-t-lg flex items-center gap-2 transition-all duration-300 ${
                    activeTab === "cart"
                      ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white border-b-2 border-blue-400"
                      : "text-gray-400 hover:text-gray-200"
                  }`}
                >
                  <ShoppingCart className="w-5 h-5" /> Cart
                </button>
              </div>

              {/* Tab content */}
              <AnimatePresence mode="wait">
                {activeTab === "profile" && (
                  <motion.div
                    key="profile"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6"
                  >
                    <div className="bg-gradient-to-b from-sky-950/80 via-blue-950/80 to-slate-900/80 rounded-2xl p-6 border border-blue-800/30 shadow-xl backdrop-blur-sm">
                      <h2 className="text-2xl text-white font-semibold mb-4 flex items-center">
                        <User className="w-5 h-5 mr-2 text-blue-400" /> Account
                        Information
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div>
                            <p className="text-gray-400 text-sm">Full Name</p>
                            <p className="text-white text-lg">{user.name}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">
                              Email Address
                            </p>
                            <p className="text-white text-lg">{user.email}</p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">
                              Member Since
                            </p>
                            <p className="text-white text-lg">January 2023</p>
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <p className="text-gray-400 text-sm">
                              Account Status
                            </p>
                            <p className="text-green-400 text-lg flex items-center">
                              <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>{" "}
                              Active
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">
                              Membership Tier
                            </p>
                            <p className="text-blue-400 text-lg flex items-center">
                              <Star className="w-4 h-4 mr-2 fill-blue-400 text-blue-400" />{" "}
                              Premium
                            </p>
                          </div>
                          <div>
                            <p className="text-gray-400 text-sm">
                              Total Orders
                            </p>
                            <p className="text-white text-lg">12</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === "favorites" && (
                  <motion.div
                    key="favorites"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6"
                  >
                    <h2 className="text-2xl text-white font-semibold mb-4 flex items-center">
                      <Heart className="w-5 h-5 mr-2 text-blue-400" /> Your
                      Favorites
                    </h2>
                    {favorites.length > 0 ? (
                      <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-1 md:grid-cols-2 gap-6"
                      >
                        {favorites.map((item) => (
                          <motion.div
                            key={item?._id}
                            variants={itemVariants}
                            onClick={() => handleProductClick(item?._id)}
                            className="cursor-pointer group bg-gradient-to-b from-sky-950/80 via-blue-950/80 to-slate-900/80 rounded-2xl p-4 border border-blue-800/30 shadow-xl backdrop-blur-sm transition-all duration-500 hover:-translate-y-2 hover:shadow-3xl hover:shadow-blue-500/20 hover:bg-gradient-to-br hover:from-blue-900/80 hover:to-indigo-900/80"
                          >
                            <div className="flex items-center gap-4">
                              <div className="relative">
                                <img
                                  src={item?.image}
                                  alt={item?.title}
                                  className="size-20 rounded-lg object-cover transition-transform duration-500 group-hover:scale-110"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                              </div>
                              <div className="flex-1">
                                <h3 className="text-white group-hover:text-blue-300 font-medium transition-colors duration-300">
                                  {item?.title}
                                </h3>
                                <p className="text-blue-400 font-semibold mt-1 group-hover:text-blue-300 transition-colors duration-300">
                                  ${item?.price}
                                </p>
                                <div className="flex mt-2">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <Star
                                      key={star}
                                      className="w-4 h-4 fill-yellow-400 text-yellow-400"
                                    />
                                  ))}
                                </div>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (userId) {
                                    dispatch(
                                      removeFavorite({
                                        userId,
                                        productId: item?._id,
                                      })
                                    );
                                  }
                                }}
                                className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-800/50 hover:bg-red-500/20 transition-colors duration-300 group"
                              >
                                <Heart className="w-5 h-5 fill-blue-500 text-blue-500 group-hover:scale-110 transition-transform duration-300" />
                              </button>
                            </div>
                          </motion.div>
                        ))}
                      </motion.div>
                    ) : (
                      <AnimatePresence>
                        {showEmptyState && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-gradient-to-b from-sky-950/50 via-blue-950/50 to-slate-900/50 rounded-2xl p-10 border border-blue-800/30 text-center"
                          >
                            <div className="w-20 h-20 mx-auto bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                              <Heart className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl text-white font-medium mb-2">
                              No Favorites Yet
                            </h3>
                            <p className="text-gray-400 max-w-md mx-auto">
                              Browse our collection and add items to your
                              favorites to see them here.
                            </p>
                            <button
                              onClick={() => router.push("/products")}
                              className="mt-6 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg transition-all duration-300"
                            >
                              Explore Products
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </motion.div>
                )}

                {activeTab === "cart" && (
                  <motion.div
                    key="cart"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6"
                  >
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-2xl text-white font-semibold flex items-center">
                        <ShoppingCart className="w-5 h-5 mr-2 text-blue-400" />{" "}
                        Your Shopping Cart
                      </h2>
                      {cart.length > 0 && (
                        <div className="bg-blue-900/40 px-4 py-2 rounded-lg border border-blue-800/30">
                          <span className="text-gray-300">Total:</span>{" "}
                          <span className="text-white font-bold">
                            ${cartTotal}
                          </span>
                        </div>
                      )}
                    </div>
                    {cart.length > 0 ? (
                      <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-4"
                      >
                        {cart.map((item) => (
                          <motion.div
                            key={item?._id}
                            variants={itemVariants}
                            className="group bg-gradient-to-b from-sky-950/80 via-blue-950/80 to-slate-900/80 rounded-2xl p-4 border border-blue-800/30 shadow-xl backdrop-blur-sm transition-all duration-500 hover:shadow-blue-500/20 hover:border-blue-700/50"
                          >
                            <div className="flex items-center gap-4">
                              <div
                                className="relative cursor-pointer"
                                onClick={() =>
                                  handleProductClick(item?.productId?._id)
                                }
                              >
                                <img
                                  src={item?.productId?.image}
                                  alt={item?.productId?.title}
                                  className="size-20 rounded-lg object-cover transition-transform duration-500 group-hover:scale-105"
                                  loading="lazy"
                                />
                                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                              </div>
                              <div
                                className="flex-1 cursor-pointer"
                                onClick={() =>
                                  handleProductClick(item?.productId?._id)
                                }
                              >
                                <h3 className="text-white group-hover:text-blue-300 font-medium transition-colors duration-300">
                                  {item?.productId?.title}
                                </h3>
                                <p className="text-blue-400 font-semibold mt-1">
                                  ${item?.productId?.price}
                                </p>
                                <p className="text-gray-400 text-sm mt-1">
                                  Quantity: 1
                                </p>
                              </div>
                              <button
                                onClick={() => {
                                  if (userId) {
                                    dispatch(
                                      removeCart({
                                        userId,
                                        productId: item?.productId?._id,
                                      })
                                    );
                                    toast.success("Item removed from cart", {
                                      position: "bottom-right",
                                      theme: "dark",
                                      autoClose: 2000,
                                    });
                                  }
                                }}
                                className="h-10 w-10 flex items-center justify-center rounded-full bg-gray-800/50 hover:bg-red-500/20 transition-colors duration-300 group"
                              >
                                <CircleX className="w-5 h-5 text-gray-400 group-hover:text-red-500 transition-colors duration-300" />
                              </button>
                            </div>
                          </motion.div>
                        ))}

                        <div className="mt-6 flex justify-end">
                          <button
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-8 py-3 rounded-lg flex items-center 
                            gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30 transform hover:translate-y-1"
                          >
                            <CreditCard className="w-5 h-5" /> Proceed to
                            Checkout
                          </button>
                        </div>
                      </motion.div>
                    ) : (
                      <AnimatePresence>
                        {showEmptyState && (
                          <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.5 }}
                            className="bg-gradient-to-b from-sky-950/50 via-blue-950/50 to-slate-900/50 rounded-2xl p-10 border border-blue-800/30 text-center"
                          >
                            <div className="w-20 h-20 mx-auto bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                              <ShoppingCart className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-xl text-white font-medium mb-2">
                              Your Cart is Empty
                            </h3>
                            <p className="text-gray-400 max-w-md mx-auto">
                              Browse our collection and add products to your
                              cart to see them here.
                            </p>
                            <button
                              onClick={() => router.push("/products")}
                              className="mt-6 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg transition-all duration-300"
                            >
                              Explore Products
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          ) : (
            <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 bg-gradient-to-b from-sky-950/80 via-blue-950/80 to-slate-900/80 rounded-2xl border border-blue-800/30 shadow-2xl backdrop-blur-sm">
              <div className="w-20 h-20 mx-auto bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                <LogIn className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-2 text-center">
                Sign In Required
              </h2>
              <p className="text-gray-300 max-w-md text-center mb-8">
                Please sign in to view your account dashboard, favorites, and
                shopping cart.
              </p>
              <button
                onClick={handleLoginRedirect}
                className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/30"
              >
                <LogIn className="w-5 h-5" /> Sign In
              </button>
            </div>
          )}
        </div>
      </main>
      <ToastContainer />
    </>
  );
}
