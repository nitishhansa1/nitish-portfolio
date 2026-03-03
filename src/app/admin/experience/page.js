'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Check, Loader2 } from 'lucide-react';

export default function ExperienceAdmin() {
    const [experiences, setExperiences] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentExp, setCurrentExp] = useState(null);

    useEffect(() => {
        fetchExperiences();
    }, []);

    const fetchExperiences = async () => {
        try {
            const res = await fetch('/api/experience');
            const data = await res.json();
            setExperiences(data);
        } catch (error) {
            console.error('Failed to fetch experiences:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this experience?')) return;

        try {
            const res = await fetch(`/api/experience/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setExperiences(experiences.filter(e => e.id !== id));
            }
        } catch (error) {
            console.error('Failed to delete experience:', error);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const isNew = !currentExp.id;
        const url = isNew ? '/api/experience' : `/api/experience/${currentExp.id}`;
        const method = isNew ? 'POST' : 'PUT';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentExp),
            });

            if (res.ok) {
                await fetchExperiences();
                setIsEditing(false);
                setCurrentExp(null);
            }
        } catch (error) {
            console.error('Failed to save experience:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const openEditor = (exp = { role: '', company: '', duration: '', description: '', order: 0 }) => {
        setCurrentExp(exp);
        setIsEditing(true);
    };

    if (isLoading && !isEditing) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Experience</h1>
                <button
                    onClick={() => openEditor()}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} />
                    Add Experience
                </button>
            </div>

            {isEditing ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">{currentExp.id ? 'Edit Experience' : 'New Experience'}</h2>
                        <button onClick={() => setIsEditing(false)} className="text-white/50 hover:text-white">
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-white/70 mb-1">Role *</label>
                                <input
                                    required
                                    type="text"
                                    value={currentExp.role}
                                    onChange={e => setCurrentExp({ ...currentExp, role: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-white/70 mb-1">Company *</label>
                                <input
                                    required
                                    type="text"
                                    value={currentExp.company}
                                    onChange={e => setCurrentExp({ ...currentExp, company: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-white/70 mb-1">Duration *</label>
                                <input
                                    required
                                    type="text"
                                    value={currentExp.duration}
                                    onChange={e => setCurrentExp({ ...currentExp, duration: e.target.value })}
                                    placeholder="e.g. 2021 - Present"
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-white/70 mb-1">Order (Sort)</label>
                                <input
                                    type="number"
                                    value={currentExp.order}
                                    onChange={e => setCurrentExp({ ...currentExp, order: parseInt(e.target.value) || 0 })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-white/70 mb-1">Description *</label>
                            <textarea
                                required
                                rows={4}
                                value={currentExp.description}
                                onChange={e => setCurrentExp({ ...currentExp, description: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-purple-500"
                            />
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check size={20} />}
                                Save Experience
                            </button>
                        </div>
                    </form>
                </motion.div>
            ) : (
                <div className="space-y-4">
                    {experiences.map((exp) => (
                        <div key={exp.id} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                            <div className="flex-1">
                                <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 mb-2">
                                    <h3 className="text-xl font-bold">{exp.role}</h3>
                                    <span className="hidden md:inline text-white/30">•</span>
                                    <span className="text-purple-400 font-medium">{exp.company}</span>
                                    <span className="text-xs font-mono bg-white/10 px-2 py-1 rounded md:ml-auto">Order: {exp.order}</span>
                                </div>
                                <p className="text-sm font-mono text-white/50 mb-3">{exp.duration}</p>
                                <p className="text-white/70 text-sm whitespace-pre-wrap">{exp.description}</p>
                            </div>
                            <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
                                <button
                                    onClick={() => openEditor(exp)}
                                    className="flex-1 md:flex-none px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Edit2 size={16} /> Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(exp.id)}
                                    className="flex-1 md:flex-none px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Trash2 size={16} /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                    {experiences.length === 0 && (
                        <div className="text-center p-12 bg-white/5 rounded-2xl border border-white/10 text-white/50">
                            No experience entries found. Add your work history!
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
