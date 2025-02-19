'use client';

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { removeFavorite, addFavorite } from "../../../../store/favoritesSlice";
import { addCart } from "../../../../store/addToCartSlice"; // Ensure this import exists

import axios from "axios";
import { ShoppingCart, Star, Heart } from "lucide-react";
import Header from "../../../components/Header";

export default function CategoryPage() {
  const params = useParams();
  const category = params?.category;
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.items);

  useEffect(() => {
    if (!category) return;

    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `https://fakestoreapi.com/products/category/${category}`
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching category:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  const isFavorite = (id) => favorites.some((item) => item.id === id);

  const formatCategory = (category) => {
    if (!category) return "";

    let decoded = decodeURIComponent(category);
    console.log(decoded);
    

    return decoded.toUpperCase()
  };
  

  return (
 <>
      <Header products={products} onSearch={setFilteredProducts} favorites={favorites} />
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
        {/* Hero Section */}
        <div className="relative overflow-hidden pt-10">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 backdrop-blur-3xl animate-fadeIn" />
          <div className="relative px-6 py-20 text-center max-w-4xl mx-auto animate-slideDown">
            <h1 className="text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r hover:bg-gradient-to-l from-blue-400 via-purple-400 to-pink-400">
              {formatCategory(category)}
            </h1>
            <p className="text-xl text-gray-300 mt-6 animate-fadeIn delay-200">
              Discover the latest in {formatCategory(category)}
            </p>
          </div>
        </div>

        {/* Product Grid */}
        <div className="px-6 py-12">
          {loading ? (
            <p className="text-center text-gray-300">Loading products...</p>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
                {(filteredProducts.length > 0 ? filteredProducts : products).map((product, index) => (

                <div
                  key={product.id}
                  className="group relative animate-fadeInUp"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="bg-gradient-to-b from-sky-950 via-blue-950 to-slate-900 
                  backdrop-blur-lg rounded-2xl p-6 border border-gray-700/50 shadow-xl
                  transition-all duration-700 ease-out 
                  hover:-translate-y-2 hover:shadow-3xl hover:bg-gradient-to-t">

                    {/* Product Image */}
                    <div className="relative overflow-hidden rounded-xl aspect-square mb-6">
                      <img
                        src={product.image}
                        alt={product.title}
                        className="object-cover rounded-md w-full h-full transition-transform duration-300"
                      />
                      {/* Favorite Button */}
                      <button
                        onClick={() =>
                          isFavorite(product.id)
                            ? dispatch(removeFavorite(product))
                            : dispatch(addFavorite(product))
                        }
                        className="absolute top-3 right-3 p-2 rounded-full bg-white/10 backdrop-blur-md 
                      hover:bg-white/20 transition-colors duration-200"
                      >
                        <Heart
                          className={`w-5 h-5 ${isFavorite(product.id) ? "fill-blue-500 text-blue-500" : "text-gray-500"
                            }`}
                        />
                      </button>
                    </div>

                    {/* Product Details */}
                    <div className="space-y-3">
                      {/* Ratings */}
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

                      {/* Title */}
                      <h2 className="font-semibold text-xl leading-tight text-white">
                        {product.title.length > 40 ? `${product.title.substring(0, 40)}...` : product.title}
                      </h2>

                      {/* Price & Cart Button */}
                      <div className="flex items-center justify-between">
                        <p className="text-2xl font-bold text-blue-400">${product.price}</p>
                        <button
                          onClick={() => dispatch(addCart(product))}
                          className="bg-blue-600 hover:bg-blue-500 p-3 rounded-xl transition-all duration-200 
                        hover:scale-105 active:scale-95"
                        >
                          <ShoppingCart className="w-5 h-5 transition-transform duration-200 group-hover:scale-110" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-300">No products found.</p>
          )}
        </div>
      </main>
 </>
  );
}
