import connectToDB from "../../../../../backend/config/db";
import User from "../../../../../backend/models/User";
import Review from "../../../../../backend/models/Review";
import Favorite from "../../../../../backend/models/Favorite";
import Product from "../../../../../backend/models/Product";
import Cart from "../../../../../backend/models/Cart";
import { getServerSession } from "next-auth";
import { authOptions } from "../[...nextauth]/route"; 
import { NextResponse } from "next/server";

export async function POST(req) {
    await connectToDB();

    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email } = await req.json();

    if (!name || !email) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Check if email is already in use (if email is being changed)
    if (email !== session.user.email) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "Email already in use" }, { status: 409 });
        }
    }

    // Update user info
    const updatedUser = await User.findOneAndUpdate(
        { email: session.user.email },
        { name: name.trim(), email: email.trim() },
        { new: true, runValidators: true, select: "_id name email" }
    );

    if (!updatedUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Update username in related collections
    await Promise.all([
        Review.updateMany({ userId: updatedUser._id }, { username: name }),
        Favorite.updateMany({ userId: updatedUser._id }, { username: name }),
        Product.updateMany({ userId: updatedUser._id }, { username: name }),
        Cart.updateMany({ userId: updatedUser._id }, { username: name })
    ]);

    return NextResponse.json({ message: "Profile updated successfully", user: updatedUser }, { status: 200 });
}

export async function GET(req) {
    await connectToDB();

    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const user = await User.findById(session.user.id).select("_id name email");
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, user });
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

export async function PUT(req) {
    await connectToDB();

    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email } = await req.json();

    if (!name || !email) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }

    // Check if email is already in use
    if (email !== session.user.email) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "Email already in use" }, { status: 409 });
        }
    }

    const updatedUser = await User.findOneAndUpdate(
        { email: session.user.email },
        { name: name.trim(), email: email.trim() },
        { new: true, runValidators: true, select: "_id name email" }
    );

    if (!updatedUser) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Profile updated successfully", user: updatedUser }, { status: 200 });
}
export async function DELETE(req) {
    await connectToDB();

    const session = await getServerSession(authOptions);

    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        // Try finding the user by email instead of ID since emails are unique
        const user = await User.findOne({ email: session.user.email });

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        const userId = user._id; // Get the correct ID from the database

        // Delete related data
        await Promise.all([
            Review.deleteMany({ userId }),
            Favorite.deleteMany({ userId }),
            Product.deleteMany({ userId }),
            Cart.deleteMany({ userId })
        ]);

        // Delete the user
        await User.findByIdAndDelete(userId);

        return NextResponse.json({ message: "User profile deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error('Delete user error:', error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}