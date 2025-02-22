import connectDB from '../../../../../../backend/config/db'
import Product from '../../../../../../backend/models/Product'
import { NextResponse } from "next/server";

export async function GET(req, { params }) {
    await connectDB();
    let { category } = params;

    if (!category) {
        return NextResponse.json({ success: false, error: "Category is required" }, { status: 400 });
    }

    try {
        // Decode URL & handle special characters (e.g., spaces, apostrophes)
        category = decodeURIComponent(category);

        // Case-insensitive search for category
        const products = await Product.find({ category: { $regex: new RegExp(category, "i") } });

        if (products.length === 0) {
            return NextResponse.json({ success: false, error: "No products found for this category" }, { status: 404 });
        }

        return NextResponse.json({ success: true, products });
    } catch (error) {
        return NextResponse.json({ success: false, error: "Internal Server Error", "message": error.message }, { status: 500 });
    }
}