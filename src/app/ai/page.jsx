'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Copy, Send, ShoppingCart, X, Heart, Star } from 'lucide-react';
import Header from '../components/Header';
import { useDispatch, useSelector } from "react-redux";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useRouter } from 'next/navigation';

const CodeBlock = ({ code }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative mt-4 rounded-lg overflow-hidden bg-gray-800">
            <div className="absolute right-2 top-2">
                <button
                    onClick={copyToClipboard}
                    className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
                >
                    <Copy size={16} className={copied ? "text-green-400" : "text-gray-300"} />
                </button>
            </div>
            <SyntaxHighlighter language="javascript" style={dracula} className="rounded-lg p-4">
                {code}
            </SyntaxHighlighter>
        </div>
    );
};
const formatResponse = (text) => {
    const parts = [];
    let currentPart = '';
    let inCodeBlock = false;

    text.split('\n').forEach((line) => {
        if (line.startsWith('```')) {
            if (inCodeBlock) {
                parts.push({ type: 'code', content: currentPart });
                currentPart = '';
            } else {
                if (currentPart) {
                    parts.push({ type: 'text', content: currentPart });
                }
                currentPart = '';
            }
            inCodeBlock = !inCodeBlock;
        } else {
            currentPart += (currentPart ? '\n' : '') + line;
        }
    });

    if (currentPart) {
        parts.push({ type: inCodeBlock ? 'code' : 'text', content: currentPart });
    }

    return parts;
};

const TextBlock = ({ content }) => {
    const formatTextWithBullets = (text) => {
        return text.split('\n').map((line, index) => {
            if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
                return (
                    <li key={index} className="ml-6 my-2">
                        {line.trim().substring(2)}
                    </li>
                );
            }
            return (
                <p key={index} className="my-2">
                    {line}
                </p>
            );
        });
    };

    return (
        <div className="prose prose-invert max-w-none ">
            {formatTextWithBullets(content)}
        </div>
    );
};

const Message = ({ role, content }) => {
    const formattedContent = formatResponse(content);
    
    return (
        <div className={`flex ${role === 'user' ? 'justify-end' : 'justify-start'} mb-3`}>
            <div className={`max-w-[80%]  text-gray-200 text-lg font-semibold border border-gray-500/80 ${role === 'user' ? 'bg-[#333369]' : 'bg-[#1e1c1c] '} rounded-lg p-3 h-auto`}>
                {formattedContent.map((part, index) => (
                    part.type === 'code' ?
                        <CodeBlock key={index} code={part.content} /> :
                        <TextBlock key={index} content={part.content} />
                ))}

            </div>
            
        </div>
    );
};

export default function AIChatGemini() {
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [userId, setUserId] = useState(null);
    const messagesEndRef = useRef(null);
    const dispatch = useDispatch();
    const favorites = useSelector((state) => state.favorites.items);
    const cart = useSelector((state) => state.cart.items);

    // Get userId from localStorage on component mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (user && user._id) {
                setUserId(user._id); 
                loadChatHistory(user._id);
            }
        }
    }, []);

    // Save chat history whenever messages change
    useEffect(() => {
        if (userId && messages.length > 0) {
            saveChatHistory();
        }
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Load chat history for the user
    const loadChatHistory = async (uid) => {
        try {
            console.log(uid);
            
            const res = await fetch(`/api/saveChat/${uid}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            console.log(res);
            
            if (res.ok) {
                const data = await res.json();
                console.log({data:data});
                if (data.chat && Array.isArray(data.chat)) {
                    setMessages(data.chat);
                    console.log({data:data});
                    
                }
            }
        } catch (error) {
            console.error("Error loading chat history:", error);
        }
    };

    // Save chat history to the API
    // Save only the last message to the API
    const saveChatHistory = async () => {
        if (!userId || messages.length === 0) return;

        try {
            const lastMessage = messages[messages.length - 1];
            console.log("Last message", lastMessage,"messages", messages)

            const res = await fetch("/api/saveChat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: userId,
                    messages: [lastMessage], // Send only the last message
                }),
            });

            if (!res.ok) {
                console.error("Failed to save last chat message");
            }
        } catch (error) {
            console.error("Error saving last chat message:", error);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        const userMessage = input;
        setLoading(true);
        
        setInput("");
        // Add user message immediately
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);

        try {
            const res = await fetch("/api/gemini", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ input: userMessage }),
            });

            const data = await res.json();
            if (res.ok) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.output }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: "Error: " + data.error }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: "Network Error: " + error.message }]);
        } finally {
            setLoading(false);
        }
    };

    const [showLoginModal, setShowLoginModal] = useState(false);
    const router = useRouter()
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const user = JSON.parse(localStorage.getItem('user') || 'null');
            if (!user || !user._id) {
                setShowLoginModal(true);
            }
        }
    }, []);


    const toggleLoginModal = () => setShowLoginModal((prev) => !prev)
    const handleLogin = (route) => {
        setShowLoginModal(false)
        router.push(route)
    }
    

    return (
        <>
            <Header cart={cart} favorites={favorites} />
            <div className="flex flex-col w-full h-screen bg-gradient-to-br from-gray-900 via-sky-950 to-green-950 pt-10 relative z-10 overflow-hidden">
                <div className="absolute inset-0 z-[-1] overflow-hidden">
                    {/* Glowing Background Layer */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-gray-900 to-black opacity-80"></div>

                    {/* Moving Light Effect with enhanced animation */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(0,150,255,0.4)_0%,transparent_60%)] animate-glow-move"></div>

                    {/* Additional rotating light overlay */}
                    {/* <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(120,0,255,0.2)_0%,transparent_70%)] animate-glow-rotate"></div> */}

                    {/* Floating Blurred Glows with enhanced animations */}
                    <div className="absolute top-1/4 right-2/3 w-60 h-60 bg-blue-500/30 blur-3xl rounded-full animate-glow-float animate-glow-pulse"></div>
                    <div className="absolute bottom-1/3 left-2/5 w-80 h-80 bg-purple-500/30 blur-3xl rounded-full animate-glow-float-reverse"></div>

                    {/* Additional glow elements */}
                    <div className="absolute top-1/2 right-1/3 w-40 h-40 bg-cyan-400/20 blur-3xl rounded-full animate-glow-float"></div>
                    <div className="absolute bottom-1/4 left-1/4 w-52 h-52 bg-indigo-600/25 blur-3xl rounded-full animate-glow-float-reverse animate-glow-pulse"></div>
                </div>



                <div className="flex-1 overflow-y-auto p-6 z-10">
                    <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400  hover:bg-gradient-to-l duration-300 sticky inset-0 ml-3 ">
                        Shopping Assistant AI
                    </h1>
                    <div className="max-w-3xl mx-auto tracking-tight font-nunito">
                        <div className="space-y-4">
                            {messages.map((message, index) => (
                                <Message key={index} role={message.role} content={message.content} />
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                </div>

                <div className="mb-5 p-4 z-10">
                    <div className="max-w-3xl mx-auto">
                        <form onSubmit={handleSubmit} className="flex gap-2">
                            <input
                                type="text"
                                className="flex-1 p-3 border border-gray-600 bg-transparent bg-opacity-0 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400"
                                placeholder="Ask something..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                disabled={loading}
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500"
                                disabled={loading}
                            >
                                {loading ? "Thinking..." : <Send size={20} />}
                            </button>
                        </form>
                    </div>
                    {showLoginModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center modal-overlay bg-white/0 backdrop-blur-sm">
                            <div className="bg-gradient-to-br from-sky-950 to-slate-900 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
                                {/* Modal Header */}
                                <div className="flex justify-between items-center border-b border-blue-800/30 p-6 bg-sky-950">
                                    <div>
                                        <h2 className="text-2xl font-bold text-white">Login</h2>
                                        <p className="text-gray-300 mt-1">Access your account</p>
                                    </div>
                                  
                                </div>

                                {/* Modal Body */}
                                <div className="p-6">
                                    <div className="space-y-6">
                                        {/* Login Benefits */}
                                        <div className="space-y-4">
                                            <div className="flex items-center">
                                                <div className="bg-blue-500/10 p-2 rounded-full mr-3">
                                                    <ShoppingCart className="h-5 w-5 text-blue-400" />
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-medium">Add to Cart</h3>
                                                    <p className="text-gray-400 text-sm">Manage your Cart easily</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="bg-blue-500/10 p-2 rounded-full mr-3">
                                                    <Heart className="h-5 w-5 text-blue-400" />
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-medium">Save Favorites</h3>
                                                    <p className="text-gray-400 text-sm">Keep track of items you love</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                <div className="bg-blue-500/10 p-2 rounded-full mr-3">
                                                    <Star className="h-5 w-5 text-blue-400" />
                                                </div>
                                                <div>
                                                    <h3 className="text-white font-medium">Personalized Experience</h3>
                                                    <p className="text-gray-400 text-sm">Get recommendations based on your preferences</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Buttons */}
                                        <div className="pt-4 space-y-3 ">
                                            <button
                                                onClick={() => handleLogin('/')}
                                                className="w-[49%] py-3 px-4 bg-blue-200/20 border-2 text-white font-semibold rounded-lg transition-colors"
                                            >
                                                Go back
                                            </button>
                                            <button
                                                onClick={() => handleLogin('/auth/login')}
                                                className="w-[49%] ml-2 py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors"
                                            >
                                                Login / Sign Up
                                            </button>
                                            <p className="text-gray-400 text-center text-sm">
                                                By continuing, you agree to our Terms of Use and Privacy Policy
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}