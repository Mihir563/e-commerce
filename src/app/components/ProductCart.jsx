import { ShoppingCart, Star, Heart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { addFavorite, removeFavorite } from "../../store/favoritesSlice";
import { toast } from "react-toastify";

export default function ProductCart({ product }) {
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.favorites.items);

  const isFavorite = favorites.some((fav) => fav.id === product.id);

  const notify = (name) => {
    toast.success(`${name} added to favorites!`, {
      position: "top-right",
      autoClose: 1000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
      icon: "❤️",
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 max-w-7xl mx-auto">
      {product.length > 0 ? product.map((product, index) => (
        <div key={product.id} className="group relative animate-fadeInUp" style={{ animationDelay: `${index * 100}ms` }}>
          <div className="bg-gradient-to-b from-sky-950 via-blue-950 to-slate-900 rounded-2xl p-6 border shadow-xl transition-all duration-700 hover:-translate-y-2 hover:shadow-3xl">

            {/* Product Image + Favorite Button */}
            <div className="relative overflow-hidden rounded-xl aspect-square mb-6">
              <img src={product.image} alt={product.title} className="object-cover w-full h-full rounded-md transition-transform duration-300" />
              <button
                onClick={() => {
                  dispatch(isFavorite(product.id) ? removeFavorite(product) : addFavorite(product));
                  notify(product.title);
                }}
                className="absolute top-3 right-3 p-2 rounded-full bg-white/10 hover:bg-white/20"
              >
                <Heart className={`w-5 h-5 ${isFavorite(product.id) ? "fill-blue-500 text-blue-500" : "text-blue-500"}`} />
              </button>
            </div>

            {/* Product Details */}
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating?.rate || 0) ? "text-yellow-400 fill-yellow-400" : "text-gray-600"}`} />
                  ))}
                </div>
                <span className="text-sm text-gray-400 ml-2">({product.rating?.count || 0})</span>
              </div>

              <h2 className="font-semibold text-xl leading-tight text-white">
                {product.title.length > 40 ? `${product.title.substring(0, 40)}...` : product.title}
              </h2>

              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-blue-400">${product.price}</p>
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
      )) : <p className="text-center text-white">No products found.</p>}
    </div>
  );
}
