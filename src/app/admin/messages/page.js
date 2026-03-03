'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, CheckCircle2, Circle, Loader2, Trash2 } from 'lucide-react';

export default function MessagesAdmin() {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        try {
            const res = await fetch('/api/contact');
            const data = await res.json();
            setMessages(data);
        } catch (error) {
            console.error('Failed to fetch messages:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this message?')) return;

        try {
            const res = await fetch(`/api/contact/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setMessages(messages.filter(m => m.id !== id));
            }
        } catch (error) {
            console.error('Failed to delete message:', error);
        }
    };

    const toggleReadStatus = async (id, currentStatus) => {
        try {
            const res = await fetch(`/api/contact/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ read: !currentStatus }),
            });

            if (res.ok) {
                setMessages(messages.map(m =>
                    m.id === id ? { ...m, read: !currentStatus } : m
                ));
            }
        } catch (error) {
            console.error('Failed to update message status:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    const unreadCount = messages.filter(m => !m.read).length;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-3">
                        Messages
                        {unreadCount > 0 && (
                            <span className="bg-blue-500 text-white text-sm px-2.5 py-0.5 rounded-full font-medium">
                                {unreadCount} new
                            </span>
                        )}
                    </h1>
                    <p className="text-white/50 mt-1">Manage contact form submissions</p>
                </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                {messages.length === 0 ? (
                    <div className="p-12 text-center text-white/50">
                        No messages yet. They will appear here when someone contacts you.
                    </div>
                ) : (
                    <div className="divide-y divide-white/10">
                        {messages.map((msg) => (
                            <motion.div
                                key={msg.id}
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className={`p-6 transition-colors ${msg.read ? 'bg-transparent' : 'bg-blue-500/5'}`}
                            >
                                <div className="flex flex-col md:flex-row md:items-start gap-4 justify-between">
                                    <div className="flex items-start gap-4 flex-1">
                                        <button
                                            onClick={() => toggleReadStatus(msg.id, msg.read)}
                                            className={`mt-1 flex-shrink-0 transition-colors ${msg.read ? 'text-white/30 hover:text-white/60' : 'text-blue-400 hover:text-blue-300'}`}
                                            title={msg.read ? "Mark as unread" : "Mark as read"}
                                        >
                                            {msg.read ? <CheckCircle2 size={24} /> : <Circle size={24} className="fill-blue-400/20" />}
                                        </button>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col md:flex-row md:items-center gap-2 mb-1">
                                                <h3 className={`text-lg ${msg.read ? 'text-white/80 font-medium' : 'text-white font-bold'}`}>
                                                    {msg.name}
                                                </h3>
                                                <a href={`mailto:${msg.email}`} className="text-sm text-blue-400 hover:underline">
                                                    {msg.email}
                                                </a>
                                                <span className="text-sm text-white/40 md:ml-auto">
                                                    {new Date(msg.createdAt).toLocaleString(undefined, {
                                                        dateStyle: 'medium',
                                                        timeStyle: 'short'
                                                    })}
                                                </span>
                                            </div>
                                            <div className={`mt-3 p-4 rounded-xl ${msg.read ? 'bg-white/5' : 'bg-blue-400/5 border border-blue-400/10'}`}>
                                                <p className={`whitespace-pre-wrap text-sm ${msg.read ? 'text-white/60' : 'text-white/90'}`}>
                                                    {msg.message}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 md:pl-4 md:border-l border-white/10 md:ml-2">
                                        <button
                                            onClick={() => handleDelete(msg.id)}
                                            className="p-2 text-red-400/50 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors ml-12 md:ml-0"
                                            title="Delete message"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
