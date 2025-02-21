import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    items: [], // Array to store favorite items
};

// Fetch favorites from API
export const fetchFavorites = createAsyncThunk("favorites/fetchFavorites", async (userId) => {
    const response = await axios.get(`/api/favorites?userId=${userId}`);
    return response.data.products; // Ensure the backend returns `products`
});

// Add a product to favorites
export const addFavorite = createAsyncThunk("favorites/addFavorite", async ({ userId, product }) => {
    await axios.post(`/api/favorites`, { userId, productId: product._id }); // Use `_id`
    return product; // Return full product object
});

// Remove a product from favorites
export const removeFavorite = createAsyncThunk("favorites/removeFavorite", async ({ userId, productId }) => {
    await axios.delete(`/api/favorites`, { data: { userId, productId } });
    return productId; // Return `_id` of removed product
});

const favoritesSlice = createSlice({
    name: "favorites",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFavorites.fulfilled, (state, action) => {
                state.items = action.payload; // Store full product objects
            })
            .addCase(addFavorite.fulfilled, (state, action) => {
                const itemExists = state.items.some((item) => item._id === action.payload._id);
                if (!itemExists) state.items.push(action.payload);
            })
            .addCase(removeFavorite.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item._id !== action.payload); // Match `_id`
            });
    },
});

export default favoritesSlice.reducer;
