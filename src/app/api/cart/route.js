import connectDB from "../../../../backend/config/db";
import Cart from "../../../../backend/models/Cart";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

// ✅ Add to cart (or increase quantity)
export async function POST(req) {
    await connectDB();
    const { userId, productId, quantity } = await req.json();

    // Validate productId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return NextResponse.json({ success: false, error: "Invalid productId format" }, { status: 400 });
    }
    const validProductId = new mongoose.Types.ObjectId(productId);

    let cart = await Cart.findOne({ userId });
    if (!cart) {
        cart = new Cart({ userId, items: [{ productId: validProductId, quantity }] });
    } else {
        const item = cart.items.find(item => item.productId.toString() === productId);
        if (item) item.quantity += quantity;
        else cart.items.push({ productId: validProductId, quantity });
    }
    await cart.save();
    return NextResponse.json({ success: true, cart });
}

// ✅ Get cart items for a user
export async function GET(req) {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ success: false, error: "Missing userId" }, { status: 400 });
    }

    try {
        const cart = await Cart.findOne({ userId }).populate("items.productId");
        return NextResponse.json(cart || { items: [] });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// ✅ Update quantity of a product in cart
export async function PUT(req) {
    await connectDB();
    const { userId, productId, quantity } = await req.json();

    if (!userId || !productId || typeof quantity !== "number" || quantity < 1) {
        return NextResponse.json({ success: false, error: "Invalid input data" }, { status: 400 });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
        return NextResponse.json({ success: false, error: "Cart not found" }, { status: 404 });
    }

    const item = cart.items.find(item => item.productId.toString() === productId);
    if (!item) {
        return NextResponse.json({ success: false, error: "Product not in cart" }, { status: 404 });
    }

    item.quantity = quantity; // Update quantity
    await cart.save();
    return NextResponse.json({ success: true, cart });
}

// ✅ Remove a single product from cart
export async function DELETE(req) {
    await connectDB();
    const { userId, productId } = await req.json();

    if (!userId || !productId) {
        return NextResponse.json({ success: false, error: "Missing userId or productId" }, { status: 400 });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
        return NextResponse.json({ success: false, error: "Cart not found" }, { status: 404 });
    }

    cart.items = cart.items.filter(item => item.productId.toString() !== productId);
    await cart.save();
    return NextResponse.json({ success: true, cart });
}

// ✅ Clear entire cart for a user
export async function DELETE_ALL(req) {
    await connectDB();
    const { userId } = await req.json();

    if (!userId) {
        return NextResponse.json({ success: false, error: "Missing userId" }, { status: 400 });
    }

    let cart = await Cart.findOne({ userId });
    if (!cart) {
        return NextResponse.json({ success: false, error: "Cart not found" }, { status: 404 });
    }

    cart.items = []; // Empty the cart
    await cart.save();
    return NextResponse.json({ success: true, message: "Cart cleared" });
}
