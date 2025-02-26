import connectDB from "../../../../../backend/config/db";
import { NextResponse } from "next/server";
import Chat from "../../../../../backend/models/Chat";

export async function GET(req) {
    try {
        await connectDB();
        const urlParts = req.nextUrl.pathname.split("/");
        const userId = urlParts[urlParts.length - 1]; // Extract userId from URL

        if (!userId) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const chat = await Chat.findOne({ userId });
        if (!chat) {
            return NextResponse.json({ message: "No chat history found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, chat: chat.messages || [] }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
