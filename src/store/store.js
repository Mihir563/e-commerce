import { configureStore } from "@reduxjs/toolkit";
import favoritesReducer from "./favoritesSlice";
import cartReducer from './addToCartSlice'

export const store = configureStore({
    reducer: {
        favorites: favoritesReducer,
        cart: cartReducer,
    },
});
