import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import connectDB from "../../../../../backend/config/db";
import User from "../../../../../backend/models/User";
import bcrypt from "bcryptjs";

export const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email", placeholder: "you@example.com" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                try {
                    await connectDB();

                    // Find user by email
                    const user = await User.findOne({ email: credentials.email });
                    
                    if (!user) {
                        throw new Error("Invalid email or password");
                    }

                    // Check password
                    const isMatch = await user.matchPassword(credentials.password);
                    
                    if (!isMatch) {
                        throw new Error("Invalid email or password");
                    }

                    // Return user object without password
                    return {
                        id: user._id.toString(),
                        name: user.name,
                        email: user.email
                    };
                } catch (error) {
                    throw new Error(error.message);
                }
            },
        }),
    ],
    callbacks: {
        async session({ session, token }) {
            if (session?.user) {
                session.user.id = token.sub;
            }
            return session;
        },
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/auth/signin",
    },
};


const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };