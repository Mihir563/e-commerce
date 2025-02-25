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
import { Heart, LogOut, CircleX, Edit2, X, Check, LogIn, Cat, Shell, Squircle, Squirrel } from "lucide-react";
import axios from "axios";

export default function UserPage() {
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
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
    });
    setTimeout(() => router.push("/auth/login"), 1000);
  };

  // Delete account function
  const handleDeleteAccount = async () => {
    try {
      const response = await axios.delete("/api/auth/update", {
        data: { userId }
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

  return (
    <>
      <Header favorites={favorites} cart={cart} />
      <main className="min-h-screen bg-gradient-to-br pt-10 from-gray-900 via-gray-800 to-black relative z-10">
        <div className="absolute top-1/3 left-1/5 w-40 h-40 rounded-full bg-blue-500/20 animate-float-slow"></div>
        <div className="absolute top-2/3 left-1/2 w-32 h-32 rounded-full bg-blue-600/20 animate-float-fast"></div>
        <div className="absolute top-1/6 right-1/2 w-48 h-48 rounded-full bg-indigo-500/20 animate-float-reverse"></div>

        {/* New Floating Elements */}
        <div className="absolute top-1/4 right-1/6 w-36 h-36 rounded-full bg-red-500/20 animate-float-zigzag"></div>
        <div className="absolute bottom-1/3 left-1/4 w-44 h-44 rounded-full bg-green-500/20 animate-float-wavy"></div>
        <div className="absolute top-1/5 right-1/4 w-38 h-38 rounded-full bg-yellow-500/20 animate-float-circular"></div>

        <div className="absolute bottom-1/4 left-1/3 w-50 h-50 rounded-full bg-teal-500/20 animate-float-expand-contract"></div>
        <div className="absolute bottom-1/6 right-1/3 w-50 h-50 overflow-hidden rounded-full bg-teal-500/20 animate-float-expand-contract"></div>  

        <div className="max-w-4xl mx-auto py-12 px-6">
          {isLoading ? (
            <p className="text-white text-center mt-10">Loading...</p>
          ) : user ? (
            <>
              {/* User Profile Section */}
              <div className="bg-gradient-to-b from-sky-950 via-blue-950 to-slate-900 rounded-2xl p-6 border shadow-xl">
                {isEditing ? (
                  <form onSubmit={handleEditSubmit} className="space-y-4">
                    <div>
                      <label className="block text-white mb-2">Name</label>
                      <input
                        type="text"
                        name="name"
                        value={editForm.name}
                        onChange={handleEditChange}
                        className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
                        disabled={isLoading}
                      />
                    </div>
                    <div>
                      <label className="block text-white mb-2">Email</label>
                      <input
                        type="email"
                        name="email"
                        value={editForm.email}
                        onChange={handleEditChange}
                        className="w-full px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
                        disabled={isLoading}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200"
                      >
                        <Check className="w-5 h-5" /> Save
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
                        className="bg-gray-600 hover:bg-gray-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200"
                      >
                        <X className="w-5 h-5" /> Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-4xl font-bold text-white capitalize">
                        Welcome, {user.name} 👋
                      </h1>
                      <p className="text-lg text-gray-300 mt-2">Email: {user.email}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setIsEditing(true)}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200"
                      >
                        <Edit2 className="w-5 h-5" /> Edit Profile
                      </button>
                          <button
                            onClick={handleLogout}
                            className="cursor-pointer bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200"
                          >
                            <LogOut className="w-5 h-5" /> Logout
                          </button>
                      <DeleteAccount onDeleteAccount={handleDeleteAccount} />
                    </div>
                  </div>
                )}
              </div>

              {/* Favorites Section */}
              <div className="mt-10">
                <h2 className="text-2xl text-white">Your Favorites ❤️</h2>
                {favorites.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                    {favorites.map((item) => (
                      <div
                        key={item?._id}
                        onClick={() => handleProductClick(item?._id)}
                        className=" cursor-pointer bg-gradient-to-b flex justify-between gap-2 items-center from-sky-950 via-blue-950 to-slate-900 rounded-2xl p-6 border shadow-xl transition-all duration-700 hover:-translate-y-2 hover:shadow-3xl hover:bg-gradient-to-br "
                      >
                        <img
                          src={item?.image}
                          alt={item?.title}
                          className="size-20 rounded-lg"
                          loading="lazy"
                        />
                        <div className="text-white hover:text-blue-500">
                          {item?.title}
                          <p className="text-blue-500 font-semibold">
                            price: ${item?.price}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            if (userId) {
                              dispatch(removeFavorite({ userId, productId: item?._id }));
                            }
                          }}
                        >
                          <Heart className="w-5 h-5 fill-blue-500 text-blue-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 mt-2">No favorite items yet.</p>
                )}
              </div>

              {/* Cart Section */}
              <div className="mt-10">
                <h2 className="text-2xl text-white">Your Cart 🛒</h2>
                {cart.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
                    {cart.map((item) => (
                      <div
                        key={item?._id}
                        onClick={() => handleProductClick(item?.productId?._id)}
                        className=" cursor-pointer bg-gradient-to-b flex justify-between items-center gap-2 from-sky-950 via-blue-950 to-slate-900 rounded-2xl p-6 border shadow-xl transition-all duration-700 hover:-translate-y-2 hover:shadow-3xl hover:bg-gradient-to-br"
                      >
                        <img
                          src={item?.productId?.image}
                          alt={item?.productId?.title}
                          className="size-20 rounded-lg"
                          loading="lazy"
                        />
                        <div className="text-white hover:text-blue-500 ">
                          {item?.productId?.title}
                          <p className="text-blue-500 font-semibold">
                            price: ${item?.productId?.price}
                          </p>
                        </div>
                        <button
                          onClick={() => {
                            if (userId) {
                              dispatch(removeCart({ userId, productId: item?.productId?._id }));
                            }
                          }}
                          className="text-blue-500 hover:text-blue-400 flex justify-center items-center gap-4"
                        >
                          <span>Remove From Cart</span>
                          <CircleX className="w-10 h-10" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 mt-2">No items in cart yet.</p>
                )}
              </div>
            </>
          ) : (
                <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-8 text-center opacity-0 animate-fadeIn relative z-10">
                  {/* Floating background bubbles */}
                  <div className="absolute top-1/4 left-1/4 w-40 h-40 rounded-full bg-blue-500/20 animate-float-slow"></div>
                  <div className="absolute top-3/4 left-1/2 w-60 h-60 rounded-full bg-purple-500/20 animate-float-medium"></div>
                  <div className="absolute top-1/2 left-3/4 w-32 h-32 rounded-full bg-blue-600/20 animate-float-fast"></div>
                  <div className="absolute top-1/4 right-1/4 w-48 h-48 rounded-full bg-indigo-500/20 animate-float-reverse"></div>

                  {/* New Floating Elements */}
                  <div className="absolute top-1/6 right-1/6 w-36 h-36 rounded-full bg-red-500/20 animate-float-zigzag"></div>
                  <div className="absolute bottom-1/4 left-1/6 w-44 h-44 rounded-full bg-green-500/20 animate-float-wavy"></div>
                  <div className="absolute top-1/5 right-1/5 w-38 h-38 rounded-full bg-yellow-500/20 animate-float-circular"></div>
                  <div className="absolute bottom-1/5 right-1/4 w-50 h-50 rounded-full bg-teal-500/20 animate-float-expand-contract"></div>  

                  {/* Title with gradient */}
                  <div className="relative inline-block">
                    <div className="absolute -inset-1 rounded-lg blur opacity-30 bg-gradient-to-r from-blue-500 to-purple-600 animate-pulse"></div>
                    <h1 className="relative text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 mb-2">
                      Welcome to Your Profile
                    </h1>
                  </div>

                  <p className="text-xl text-gray-300 max-w-md transform translate-y-4 opacity-0 animate-slideUp">
                    Please log in to access your personalized dashboard, favorites, and shopping cart
                  </p>

                  <div className="relative group mt-8 transform translate-y-4 opacity-0 animate-slideUp animation-delay-300">
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg blur opacity-50 group-hover:opacity-75 transition duration-500"></div>
                    <button
                      onClick={handleLoginRedirect}
                      className="relative bg-blue-700 hover:bg-blue-600 text-white px-10 py-4 rounded-lg flex items-center gap-3 transition-all duration-300 transform hover:scale-105 group-hover:shadow-xl text-lg"
                    >
                      <LogIn className="w-6 h-6 animate-bounce" />
                      <span>Login Now</span>
                    </button>
                  </div>
                </div>
          )}
        </div>
        <ToastContainer />
      </main>
    </>
  );
}