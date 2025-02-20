import { NextResponse } from "next/server";
import User from "../../../../../backend/models/User";
import connectDB from "../../../../../backend/config/db";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

export async function POST(req) {
    try {
        await connectDB();
        const { name, email, password } = await req.json();

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        const newUser = new User({ name, email, password });
        await newUser.save();

        return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
    } catch (error) {
        console.error("Signup Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }

    
}
