import { NextResponse } from "next/server";
import User from "../../../../../backend/models/User";
import connectDB from "../../../../../backend/config/db";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

export async function POST(request) {
    try {
        await connectDB();

        const { email, password } = await request.json();
        console.log("Login attempt for email:", email); // Debug log

        // Find user by email
        const user = await User.findOne({ email });
        console.log("User found:", user ? "Yes" : "No"); // Debug log

        if (!user) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Check password
        console.log("Comparing passwords..."); // Debug log
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        console.log("Password match:", isPasswordMatch); // Debug log

        if (!isPasswordMatch) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Return user data (excluding password)
        return NextResponse.json({
            _id: user._id,
            name: user.name,
            email: user.email
        });

    } catch (error) {
        console.error("Login error:", error); // Debug log
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}