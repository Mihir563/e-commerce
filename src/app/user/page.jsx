"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { removeFavorite } from "../../store/favoritesSlice";
import { removeCart } from "../../store/addToCartSlice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Header from "../components/Header";
import {
  Heart,
  ShoppingCart,
  LogOut,
  LucideRemoveFormatting,
  Delete,
  DeleteIcon,
  CircleX,
} from "lucide-react";

export default function UserPage() {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();

  // Fetch user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    } else {
      toast.error("Please log in first.", {
        position: "bottom-right",
        autoClose: 1500,
        theme: "dark",
      });
      setTimeout(() => router.push("/login"), 1500);
    }
  }, []);

  // Redux states
  const favorites = useSelector((state) => state.favorites.items);
  const cart = useSelector((state) => state.cart.items);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Logged out successfully!", {
      position: "bottom-right",
      autoClose: 1000,
      theme: "dark",
    });
    setTimeout(() => router.push("auth/login"), 1000);
  };

  return (
    <>
      <Header favorites={favorites} cart={cart} />
      <main className="min-h-screen bg-gradient-to-br pt-10 from-gray-900 via-gray-800 to-black">
        <div className="max-w-4xl mx-auto py-12 px-6">
          {user ? (
            <>
              <h1 className="text-4xl font-bold text-white capitalize">
                Welcome, {user.name} 👋
              </h1>
              <p className="text-lg text-gray-300 mt-2">Email: {user.email}</p>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="mt-6 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all duration-200"
              >
                <LogOut className="w-5 h-5" /> Logout
              </button>

              {/* Favorite Items */}
              <div className="mt-10">
                <h2 className="text-2xl text-white">Your Favorites ❤️</h2>
                {favorites.length > 0 ? (
                  <div className="grid grid-cols-2 gap-6 mt-4">
                    {favorites.map((item) => (
                      <div
                        key={item.id}
                        className="bg-gradient-to-b flex justify-between gap-2 items-center from-sky-950 via-blue-950 to-slate-900 rounded-2xl p-6 border shadow-xl transition-all duration-700 hover:-translate-y-2 hover:shadow-3xl hover:bg-gradient-to-br"
                      >
                        <img
                          src={item.image}
                          alt=""
                          className="size-20 rounded-lg"
                        />
                        <p className="text-white">
                          {item.title}
                          <p className="text-blue-500 font-semibold">
                            price: ${item.price}
                          </p>
                        </p>
                        <button onClick={() => dispatch(removeFavorite(item))}>
                          <Heart
                            className={`w-5 h-5 fill-blue-500 text-blue-500`}
                          />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400 mt-2">No favorite items yet.</p>
                )}
              </div>

              {/* Cart Items */}
              <div className="mt-10">
                <h2 className="text-2xl text-white">Your Cart 🛒</h2>
                {cart.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 mt-4">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="bg-gradient-to-b flex justify-between items-center gap-2 from-sky-950 via-blue-950 to-slate-900 rounded-2xl p-6 border shadow-xl transition-all duration-700 hover:-translate-y-2 hover:shadow-3xl hover:bg-gradient-to-br"
                      >
                        <img
                          src={item.image}
                          alt="image"
                          className="size-20 rounded-lg"
                        />
                        <p className="text-white">
                          {item.title}
                          <p className="text-blue-500 font-semibold">
                            price: ${item.price}
                          </p>
                        </p>
                        <button
                          onClick={() => dispatch(removeCart(item))}
                          className="text-blue-500 hover:text-blue-400 flex justify-center items-center gap-4
                                                    "
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
            <p className="text-white text-center mt-10">Loading user data...</p>
          )}
        </div>

        <ToastContainer />
      </main>
    </>
  );
}
