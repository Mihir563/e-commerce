import { NextResponse } from "next/server";
import Chat from "../../../../backend/models/Chat";
import dotenv from "dotenv";
import connectDB from "../../../../backend/config/db";

dotenv.config();
connectDB();

export async function POST(req) {
    try {
        await connectDB();
        const body = await req.json();
        let { userId, messages } = body;

        if (!userId || !messages || !Array.isArray(messages) || messages.length === 0) {
            return NextResponse.json({ error: "Valid userId and messages are required" }, { status: 400 });
        }

        // Use `$setOnInsert` to explicitly add `userId` only when inserting a new document
        const chat = await Chat.findOneAndUpdate(
            { userId }, // Query by userId
            {
                $addToSet: { messages: { $each: messages } }, // Prevents duplicate messages
                $setOnInsert: { userId } // Ensures userId is set when inserting
            },
            { new: true, upsert: true }
        );

        return NextResponse.json({ success: true, chat }, { status: 200 });
    } catch (error) {
        console.error("Error in saveChat API:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}


// Retrieve All Chats
export async function GET() {
    try {
        await connectDB();
        const chats = await Chat.find().sort({ createdAt: -1 }); // Get all chats, newest first
        return NextResponse.json({ success: true, chats }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
