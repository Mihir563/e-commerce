import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    reviews: [],
    loading: false,
    error: null,
    avgRating: 0,
    totalReviews: 0
};

// Fetch reviews for a product
export const fetchReviews = createAsyncThunk(
    "reviews/fetchReviews",
    async (productId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/api/reviews?productId=${productId}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || "Failed to fetch reviews");
        }
    }
);

// Add a new review
export const addReview = createAsyncThunk(
    "reviews/addReview",
    async ({ productId, userId, rating, comment }, { rejectWithValue }) => {
        try {
            const response = await axios.post("/api/reviews", {
                productId,
                userId,
                rating,
                comment
            });
            return response.data.review;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || "Failed to add review");
        }
    }
);

// Update a review
export const updateReview = createAsyncThunk(
    "reviews/updateReview",
    async ({ reviewId, userId, rating, comment }, { rejectWithValue }) => {
        try {
            const response = await axios.patch("/api/reviews", {
                reviewId,
                userId,
                rating,
                comment
            });
            return response.data.review;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || "Failed to update review");
        }
    }
);

// Delete a review
export const deleteReview = createAsyncThunk(
    "reviews/deleteReview",
    async ({ reviewId, userId }, { rejectWithValue }) => {
        try {
            const response = await axios.delete(`/api/reviews?reviewId=${reviewId}`, {
                data: { userId }
            });
            return response.data.reviewId;
        } catch (error) {
            return rejectWithValue(error.response?.data?.error || "Failed to delete review");
        }
    }
);

const reviewSlice = createSlice({
    name: "reviews",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch reviews
            .addCase(fetchReviews.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchReviews.fulfilled, (state, action) => {
                state.loading = false;
                state.reviews = action.payload.reviews;
                state.avgRating = action.payload.avgRating;
                state.totalReviews = action.payload.totalReviews;
            })
            .addCase(fetchReviews.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add review
            .addCase(addReview.pending, (state) => {
                state.error = null;
            })
            .addCase(addReview.fulfilled, (state, action) => {
                state.reviews.push(action.payload);
                state.totalReviews++;
                // Recalculate average rating
                state.avgRating = state.reviews.reduce((sum, review) => sum + review.rating, 0) / state.totalReviews;
            })
            // Update review
            .addCase(updateReview.pending, (state) => {
                state.error = null;
            })
            .addCase(updateReview.fulfilled, (state, action) => {
                const index = state.reviews.findIndex((review) => review._id === action.payload._id);
                if (index !== -1) {
                    state.reviews[index] = action.payload;
                    // Recalculate average rating
                    state.avgRating = state.reviews.reduce((sum, review) => sum + review.rating, 0) / state.totalReviews;
                }
            })
            // Delete review
            .addCase(deleteReview.pending, (state) => {
                state.error = null;
            })
            .addCase(deleteReview.fulfilled, (state, action) => {
                state.reviews = state.reviews.filter((review) => review._id !== action.payload);
                state.totalReviews--;
                // Recalculate average rating
                state.avgRating = state.totalReviews > 0
                    ? state.reviews.reduce((sum, review) => sum + review.rating, 0) / state.totalReviews
                    : 0;
            });
    },
});

export default reviewSlice.reducer; 