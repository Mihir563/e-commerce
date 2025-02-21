import connectDB from "../../../../backend/config/db";
import Favorite from "../../../../backend/models/Favorite";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(req) {
    await connectDB();
    const { userId, productId } = await req.json();

    // Validate and convert productId to ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        return NextResponse.json({ success: false, error: "Invalid productId format" }, { status: 400 });
    }
    const validProductId = new mongoose.Types.ObjectId(productId);

    let favorite = await Favorite.findOne({ userId });
    if (!favorite) {
        favorite = new Favorite({ userId, products: [validProductId] });
    } else {
        if (!favorite.products.some(id => id.toString() === productId)) {
            favorite.products.push(validProductId);
        }
    }
    await favorite.save();
    return NextResponse.json({ success: true, favorite });
}

export async function GET(req) {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    try {
        const favorite = await Favorite.findOne({ userId }).populate("products");
        return NextResponse.json(favorite || { products: [] });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function DELETE(req) {
    await connectDB();
    const { userId, productId } = await req.json();

    if (!userId || !productId) {
        return NextResponse.json({ success: false, error: "Missing userId or productId" }, { status: 400 });
    }

    let favorite = await Favorite.findOne({ userId });
    if (!favorite) {
        return NextResponse.json({ success: false, error: "Favorite not found" }, { status: 404 });
    }

    favorite.products = favorite.products.filter(id => id.toString() !== productId);
    await favorite.save();
    return NextResponse.json({ success: true, favorite });
}

// PUT - Update favorite list (e.g., replace products array)
export async function PUT(req) {
    await connectDB();
    const { userId, productIds } = await req.json();

    if (!userId || !Array.isArray(productIds)) {
        return NextResponse.json({ success: false, error: "Invalid userId or productIds" }, { status: 400 });
    }

    // Validate and convert productIds to ObjectId
    const validProductIds = productIds
        .filter(id => mongoose.Types.ObjectId.isValid(id))
        .map(id => new mongoose.Types.ObjectId(id));

    let favorite = await Favorite.findOne({ userId });
    if (!favorite) {
        favorite = new Favorite({ userId, products: validProductIds });
    } else {
        favorite.products = validProductIds;
    }

    await favorite.save();
    return NextResponse.json({ success: true, favorite });
}
