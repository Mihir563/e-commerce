'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Copy, Send } from 'lucide-react';
import Header from '../components/Header';
import { useDispatch, useSelector } from "react-redux";

const CodeBlock = ({ code }) => {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative mt-4 rounded-lg overflow-hidden">
            <div className="absolute right-2 top-2">
                <button
                    onClick={copyToClipboard}
                    className="p-2 bg-black/40 rounded-lg hover:bg-gray-600 transition-colors"
                >
                    <Copy size={16} className={copied ? "text-green-400" : "text-gray-300"} />
                </button>
            </div>
            <pre className="bg-black/70 p-4 rounded-lg overflow-x-auto">
                <code className="text-sm text-gray-200">{code}</code>
            </pre>
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

    console.log(messages);
    

    return (
        <>
            <Header cart={cart} favorites={favorites} />
            <div className="flex flex-col w-full h-screen bg-gradient-to-br from-gray-900 via-sky-950 to-green-950 pt-10 relative z-10 overflow-hidden">
                <div className="absolute top-1/3 left-1/5 w-40 h-40 rounded-full bg-blue-500/20 animate-float-slow"></div>
                <div className="absolute top-2/3 left-1/2 w-32 h-32 rounded-full bg-blue-600/20 animate-float-fast"></div>
                <div className="absolute top-1/6 right-1/3 w-48 h-48 rounded-full bg-indigo-500/20 animate-float-reverse"></div>

                {/* New Floating Elements */}
                <div className="absolute top-1/4 right-1/6 w-36 h-36 rounded-full bg-red-500/20 animate-float-zigzag"></div>
                <div className="absolute bottom-1/3 left-1/4 w-44 h-44 rounded-full bg-green-500/20 animate-float-wavy"></div>
                <div className="absolute top-1/5 right-1/4 w-38 h-38 rounded-full bg-yellow-500/20 animate-float-circular"></div>

                <div className="absolute bottom-1/4 left-1/3 w-50 h-50 rounded-full bg-teal-500/20 animate-float-expand-contract"></div>
                <div className="absolute bottom-1/6 right-1/3 w-50 h-50 overflow-hidden rounded-full bg-teal-500/20 animate-float-expand-contract"></div>

                <div className="flex-1 overflow-y-auto p-6">
                    <h1 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400  hover:bg-gradient-to-l duration-300 sticky inset-0 ml-3">
                        Shopping Assistant AI
                    </h1>
                    <div className="max-w-3xl mx-auto ">
                        <div className="space-y-4">
                            {messages.map((message, index) => (
                                <Message key={index} role={message.role} content={message.content} />
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>
                </div>

                <div className="mb-5 p-4">
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
                </div>
            </div>
        </>
    );
}