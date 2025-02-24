import { configureStore } from "@reduxjs/toolkit";
import favoritesReducer from "./favoritesSlice";
import cartReducer from './addToCartSlice'
import reviewReducer from './reviewSlice'

export const store = configureStore({
    reducer: {
        favorites: favoritesReducer,
        cart: cartReducer,
        review:reviewReducer,
    },
});
