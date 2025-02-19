import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    items: [], // Array to store favorite items
};

const favoritesSlice = createSlice({
    name: "favorites",
    initialState,
    reducers: {
        addFavorite: (state, action) => {
            // Add to favorites only if not already present
            const itemExists = state.items.find((item) => item.id === action.payload.id);
            if (!itemExists) {
                state.items.push(action.payload);
            }
        },
        removeFavorite: (state, action) => {
            // Remove item from favorites
            state.items = state.items.filter((item) => item.id !== action.payload.id);
        },
    },
});


// Export actions
export const { addFavorite, removeFavorite } = favoritesSlice.actions;



// Export reducer
export default favoritesSlice.reducer;
