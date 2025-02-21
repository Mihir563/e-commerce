import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    items: [], // Array to store cart items
};

// Async thunk for fetching cart items
export const fetchCart = createAsyncThunk("cart/fetchCart", async (userId) => {
    const response = await axios.get(`/api/cart?userId=${userId}`);
    return response.data.items;
});

// Async thunk for adding to cart
export const addCart = createAsyncThunk("cart/addCart", async ({ userId, product }) => {
    await axios.post(`/api/cart`, { userId, productId: product._id, quantity: 1 });
    return product; // Return the added product
});

// Async thunk for removing from cart
export const removeCart = createAsyncThunk("cart/removeCart", async ({ userId, productId }) => {
    await axios.delete(`/api/cart`, { data: { userId, productId } });
    return productId; // Return the removed product ID
});

const addToCartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.items = action.payload;
            })
            .addCase(addCart.fulfilled, (state, action) => {
                const itemExists = state.items.find((item) => item._id === action.payload._id);
                if (!itemExists) state.items.push(action.payload);
            })
            .addCase(removeCart.fulfilled, (state, action) => {
                state.items = state.items.filter((item) => item.productId._id !== action.payload);
            });
    },
});

export default addToCartSlice.reducer;
