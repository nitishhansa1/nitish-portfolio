'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Check, Loader2 } from 'lucide-react';

export default function TestimonialsAdmin() {
    const [testimonials, setTestimonials] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentTestimonial, setCurrentTestimonial] = useState(null);

    useEffect(() => {
        fetchTestimonials();
    }, []);

    const fetchTestimonials = async () => {
        try {
            const res = await fetch('/api/testimonials');
            const data = await res.json();
            setTestimonials(data);
        } catch (error) {
            console.error('Failed to fetch testimonials:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this testimonial?')) return;

        try {
            const res = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setTestimonials(testimonials.filter(t => t.id !== id));
            }
        } catch (error) {
            console.error('Failed to delete testimonial:', error);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const isNew = !currentTestimonial.id;
        const url = isNew ? '/api/testimonials' : `/api/testimonials/${currentTestimonial.id}`;
        const method = isNew ? 'POST' : 'PUT';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentTestimonial),
            });

            if (res.ok) {
                await fetchTestimonials();
                setIsEditing(false);
                setCurrentTestimonial(null);
            }
        } catch (error) {
            console.error('Failed to save testimonial:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const openEditor = (testimonial = { author: '', role: '', content: '', avatar: '', order: 0 }) => {
        setCurrentTestimonial(testimonial);
        setIsEditing(true);
    };

    if (isLoading && !isEditing) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Testimonials</h1>
                <button
                    onClick={() => openEditor()}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} />
                    Add Testimonial
                </button>
            </div>

            {isEditing ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">{currentTestimonial.id ? 'Edit Testimonial' : 'New Testimonial'}</h2>
                        <button onClick={() => setIsEditing(false)} className="text-white/50 hover:text-white">
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-white/70 mb-1">Author Name *</label>
                                <input
                                    required
                                    type="text"
                                    value={currentTestimonial.author}
                                    onChange={e => setCurrentTestimonial({ ...currentTestimonial, author: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-orange-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-white/70 mb-1">Role & Company *</label>
                                <input
                                    required
                                    type="text"
                                    value={currentTestimonial.role}
                                    onChange={e => setCurrentTestimonial({ ...currentTestimonial, role: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-orange-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-white/70 mb-1">Quote/Content *</label>
                            <textarea
                                required
                                rows={4}
                                value={currentTestimonial.content}
                                onChange={e => setCurrentTestimonial({ ...currentTestimonial, content: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-orange-500"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-white/70 mb-1">Avatar URL</label>
                                <input
                                    type="text"
                                    value={currentTestimonial.avatar || ''}
                                    onChange={e => setCurrentTestimonial({ ...currentTestimonial, avatar: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-orange-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-white/70 mb-1">Order (Sort)</label>
                                <input
                                    type="number"
                                    value={currentTestimonial.order}
                                    onChange={e => setCurrentTestimonial({ ...currentTestimonial, order: parseInt(e.target.value) || 0 })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-orange-500"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check size={20} />}
                                Save Testimonial
                            </button>
                        </div>
                    </form>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {testimonials.map((test) => (
                        <div key={test.id} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col justify-between">
                            <div>
                                <p className="text-white/80 italic mb-6">"{test.content}"</p>

                                <div className="flex items-center gap-4">
                                    {test.avatar ? (
                                        <img src={test.avatar} alt={test.author} className="w-12 h-12 rounded-full object-cover bg-white/10" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center text-white font-bold text-lg">
                                            {test.author.charAt(0)}
                                        </div>
                                    )}
                                    <div>
                                        <h4 className="font-bold">{test.author}</h4>
                                        <p className="text-sm text-white/50">{test.role}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-2 mt-6 pt-6 border-t border-white/5">
                                <span className="text-xs font-mono bg-white/5 px-2 py-1 rounded inline-flex items-center justify-center mr-auto">
                                    Order: {test.order}
                                </span>
                                <button
                                    onClick={() => openEditor(test)}
                                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-sm rounded-lg flex items-center gap-2 transition-colors"
                                >
                                    <Edit2 size={14} /> Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(test.id)}
                                    className="px-3 py-1.5 bg-red-500/20 text-red-400 hover:bg-red-500/30 text-sm rounded-lg flex items-center gap-2 transition-colors"
                                >
                                    <Trash2 size={14} /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                    {testimonials.length === 0 && (
                        <div className="col-span-full text-center p-12 bg-white/5 rounded-2xl border border-white/10 text-white/50">
                            No testimonials found.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
