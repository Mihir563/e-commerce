import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [], // Array to store favorite items
};

const addToCartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addCart: (state, action) => {
            const itemExists = state.items.find((item) => item.id === action.payload.id);
            if (!itemExists) state.items.push(action.payload);
        },
        removeCart: (state, action) => {
            state.items = state.items.filter((item) => item.id !== action.payload.id);
        }
    }
})

export const { addCart, removeCart } = addToCartSlice.actions

export default addToCartSlice.reducer