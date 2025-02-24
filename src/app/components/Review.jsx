import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchReviews, addReview, updateReview, deleteReview } from "../../store/reviewSlice";
import { Loader2, Trash, Edit, Star } from "lucide-react";
import { toast } from "react-toastify";

const StarRating = ({ rating, setRating }) => (
    <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
            <button
                key={star}
                onClick={() => setRating(star)}
                className={`transition-colors ${star <= rating ? "text-yellow-400 " : "text-gray-500"}`}
            >
                <Star className={`w-5 h-5 transition-colors ${star <= rating ? "text-yellow-400 fill-yellow-400" : "text-gray-500"}`} />
            </button>
        ))}
    </div>
);

const ReviewSection = ({ productId, userId }) => {
    const dispatch = useDispatch();
    const [rating, setRating] = useState(5);
    const [reviewText, setReviewText] = useState("");
    const [editingReview, setEditingReview] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(null);
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Get reviews from Redux store
    const { reviews = [], loading } = useSelector((state) =>
        state.review || { reviews: [], loading: false }
    );

    // Filter reviews for current product only once
    const productReviews = reviews.filter(review => review.productId === productId);

    useEffect(() => {
        let mounted = true;

        const loadReviews = async () => {
            if (!productId) return;

            try {
                const result = await dispatch(fetchReviews(productId)).unwrap();
                if (!mounted) return;
            } catch (err) {
                if (!mounted) return;
                console.error("Error fetching reviews:", err);
                setError(err.message || "Failed to fetch reviews");
                toast.error("Failed to load reviews");
            }
        };

        loadReviews();

        return () => {
            mounted = false;
        };
    }, [dispatch, productId]);

    const handleDeleteReview = async (reviewId) => {
        if (!reviewId || !userId) {
            toast.error("Unable to delete review");
            return;
        }

        setDeleteLoading(reviewId);
        try {
            await dispatch(deleteReview({ reviewId, userId })).unwrap();
            toast.success("Review deleted successfully!");
            // No need to fetch reviews again, Redux state should update automatically
        } catch (err) {
            console.error("Delete error:", err);
            toast.error(err.message || "Failed to delete review");
        } finally {
            setDeleteLoading(null);
        }
    };

    const handleAddOrUpdateReview = async (e) => {
        e.preventDefault();
        if (!reviewText.trim()) {
            toast.warning("Please enter a review comment");
            return;
        }

        setIsSubmitting(true);
        try {
            if (editingReview) {
                await dispatch(updateReview({
                    reviewId: editingReview._id,
                    rating,
                    comment: reviewText.trim(),
                    userId
                })).unwrap();
                toast.success("Review updated successfully!");
                setEditingReview(null);
            } else {
                await dispatch(addReview({
                    productId,
                    userId,
                    rating,
                    comment: reviewText.trim()
                })).unwrap();
                toast.success("Review added successfully!");
            }
            setReviewText("");
            setRating(5);
        } catch (err) {
            console.error("Review operation failed:", err);
            toast.error(err.message || "Failed to process review");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (review) => {
        setEditingReview(review);
        setReviewText(review.comment);
        setRating(review.rating);
    };

    return (
        <div className="mt-10 px-6">
            <h2 className="text-2xl font-semibold text-white mb-4">Reviews</h2>

            <form onSubmit={handleAddOrUpdateReview} className="bg-gray-800 p-4 rounded-xl">
                <textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    className="w-full p-2 rounded-lg bg-gray-900 text-white"
                    placeholder="Write a review..."
                />
                <StarRating rating={rating} setRating={setRating} />

                <button
                    type="submit"
                    className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-500 flex items-center gap-2 disabled:opacity-50"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? (
                        <Loader2 className="animate-spin w-5 h-5" />
                    ) : (
                        editingReview ? "Update Review" : "Submit Review"
                    )}
                </button>
            </form>

            <div className="mt-6 space-y-4">
                {loading ? (
                    <div className="flex justify-center">
                        <Loader2 className="animate-spin w-8 h-8 text-blue-500" />
                    </div>
                ) : productReviews.length > 0 ? (
                    productReviews.map((review) => (
                        <div key={review._id} className="bg-gray-700 p-4 rounded-lg text-white">
                            <div className="flex justify-between items-start">
                                <div className="space-y-2">
                                    <p className="text-sm text-gray-300 font-bold">
                                        {review.userId?.name || "Anonymous"}
                                    </p>
                                    <div className="text-sm text-gray-300 flex gap-2 items-center">Rating: <StarRating rating={review.rating} /></div>
                                    <p>{review.comment}</p>
                                </div>
                                {review.userId?._id === userId && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(review)}
                                            className="text-yellow-400 hover:text-yellow-300"
                                            type="button"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteReview(review._id)}
                                            className="text-red-500 hover:text-red-400"
                                            disabled={deleteLoading === review._id}
                                            type="button"
                                        >
                                            {deleteLoading === review._id ? (
                                                <Loader2 className="animate-spin w-5 h-5" />
                                            ) : (
                                                <Trash className="w-5 h-5" />
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-400">No reviews yet</p>
                )}
            </div>
        </div>
    );
};

export default ReviewSection;