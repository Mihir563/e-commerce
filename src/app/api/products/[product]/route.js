import { NextResponse } from "next/server";
import Product from "../../../../../backend/models/Product";
import connectDB from "../../../../../backend/config/db";

export async function GET(request, { params }) {
    try {
        await connectDB();
        const { product } = params;
        const productData = await Product.findById(product);

        if (!productData) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        return NextResponse.json(productData);
    } catch (error) {
        console.error("Error fetching product:", error);
        return NextResponse.json(
            { error: "Server error", message: error.message },
            { status: 500 }
        );
    }
}
