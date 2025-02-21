import { NextResponse } from "next/server";
import Product from "../../../../backend/models/Product";
import connectDB from "../../../../backend/config/db";

export async function GET() {
    try {
        await connectDB();
        const products = await Product.find({});
        return NextResponse.json(products);
    } catch (error) {
        console.error("Error fetching products:", error);
        return NextResponse.json(
            { error: "Server error", message: error.message },
            { status: 500 }
        );
    }
}

export async function POST(request) {
    try {
        await connectDB();
        const body = await request.json();
        const newProduct = await Product.create(body);
        return NextResponse.json(newProduct);
    } catch (error) {
        console.error("Error creating product:", error);
        return NextResponse.json(
            { error: "Server error", message: error.message },
            { status: 500 }
        );
    }
}

export async function PUT(request) {
    try {
        await connectDB();
        const { id, ...updateData } = await request.json();
        const updatedProduct = await Product.findByIdAndUpdate(id, updateData, { new: true });
        return NextResponse.json(updatedProduct);
    } catch (error) {
        console.error("Error updating product:", error);
        return NextResponse.json(
            { error: "Server error", message: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(request) {
    try {
        await connectDB();
        const { id } = await request.json();
        await Product.findByIdAndDelete(id);
        return NextResponse.json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        return NextResponse.json(
            { error: "Server error", message: error.message },
            { status: 500 }
        );
    }
}
