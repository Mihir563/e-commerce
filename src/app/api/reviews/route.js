import connectDB from "../../../../backend/config/db";
import Review from "../../../../backend/models/Review";
import { NextResponse } from "next/server";

// Add a new review
export async function POST(req) {
    try {
        await connectDB();
        const { productId, userId, rating, comment } = await req.json();

        if (!productId || !userId || !rating || !comment) {
            return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 });
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json({ success: false, error: "Rating must be between 1 and 5" }, { status: 400 });
        }

        const review = new Review({ productId, userId, rating, comment });
        await review.save();

        // Populate the userId field before sending response
        const populatedReview = await Review.findById(review._id).populate("userId", "name");

        return NextResponse.json({ success: true, review: populatedReview }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message || "Internal Server Error" }, { status: 500 });
    }
}

// Get all reviews and calculate average rating
export async function GET(req) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const productId = searchParams.get("productId");

        if (!productId) {
            return NextResponse.json({ success: false, error: "Product ID is required" }, { status: 400 });
        }

        const reviews = await Review.find({ productId }).populate("userId", "name");

        const totalReviews = reviews.length;
        const avgRating = totalReviews > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / totalReviews : 0;

        return NextResponse.json({
            success: true,
            reviews,
            avgRating: parseFloat(avgRating.toFixed(1)),
            totalReviews
        }, { status: 200 });
    } catch (error) {
        console.error("Error fetching reviews:", error);
        return NextResponse.json({ success: false, error: error.message || "Internal Server Error" }, { status: 500 });
    }
}

// Update a review
export async function PATCH(req) {
    try {
        await connectDB();
        const { reviewId, userId, rating, comment } = await req.json();

        if (!reviewId || !userId || !rating || !comment) {
            return NextResponse.json({ success: false, error: "All fields are required" }, { status: 400 });
        }

        if (rating < 1 || rating > 5) {
            return NextResponse.json({ success: false, error: "Rating must be between 1 and 5" }, { status: 400 });
        }

        const review = await Review.findOneAndUpdate(
            { _id: reviewId, userId },
            { rating, comment },
            { new: true }
        ).populate("userId", "name");

        if (!review) {
            return NextResponse.json({ success: false, error: "Review not found or unauthorized" }, { status: 404 });
        }

        return NextResponse.json({ success: true, review }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message || "Internal Server Error" }, { status: 500 });
    }
}

// Delete a review
export async function DELETE(req) {
    try {
        await connectDB();
        const { searchParams } = new URL(req.url);
        const reviewId = searchParams.get("reviewId");
        const { userId } = await req.json();

        if (!reviewId || !userId) {
            return NextResponse.json({ success: false, error: "Review ID and User ID are required" }, { status: 400 });
        }

        const review = await Review.findOne({ _id: reviewId, userId });

        if (!review) {
            return NextResponse.json({ success: false, error: "Review not found or unauthorized" }, { status: 404 });
        }

        await Review.deleteOne({ _id: reviewId });

        return NextResponse.json({ success: true, reviewId }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ success: false, error: error.message || "Internal Server Error" }, { status: 500 });
    }
}