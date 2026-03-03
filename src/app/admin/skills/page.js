'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Check, Loader2 } from 'lucide-react';

export default function SkillsAdmin() {
    const [skills, setSkills] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentSkill, setCurrentSkill] = useState(null);

    // Group skills by category for display
    const groupedSkills = skills.reduce((acc, skill) => {
        if (!acc[skill.category]) acc[skill.category] = [];
        acc[skill.category].push(skill);
        return acc;
    }, {});

    useEffect(() => {
        fetchSkills();
    }, []);

    const fetchSkills = async () => {
        try {
            const res = await fetch('/api/skills');
            const data = await res.json();
            setSkills(data);
        } catch (error) {
            console.error('Failed to fetch skills:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this skill?')) return;

        try {
            const res = await fetch(`/api/skills/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setSkills(skills.filter(s => s.id !== id));
            }
        } catch (error) {
            console.error('Failed to delete skill:', error);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const isNew = !currentSkill.id;
        const url = isNew ? '/api/skills' : `/api/skills/${currentSkill.id}`;
        const method = isNew ? 'POST' : 'PUT';

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(currentSkill),
            });

            if (res.ok) {
                await fetchSkills();
                setIsEditing(false);
                setCurrentSkill(null);
            }
        } catch (error) {
            console.error('Failed to save skill:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const openEditor = (skill = { name: '', category: '', icon: '', level: 50, order: 0 }) => {
        setCurrentSkill(skill);
        setIsEditing(true);
    };

    if (isLoading && !isEditing) {
        return (
            <div className="flex justify-center items-center h-64">
                <Loader2 className="w-8 h-8 animate-spin text-green-500" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Skills</h1>
                <button
                    onClick={() => openEditor()}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} />
                    Add Skill
                </button>
            </div>

            {isEditing ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">{currentSkill.id ? 'Edit Skill' : 'New Skill'}</h2>
                        <button onClick={() => setIsEditing(false)} className="text-white/50 hover:text-white">
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-white/70 mb-1">Name *</label>
                                <input
                                    required
                                    type="text"
                                    value={currentSkill.name}
                                    onChange={e => setCurrentSkill({ ...currentSkill, name: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-white/70 mb-1">Category *</label>
                                <input
                                    required
                                    type="text"
                                    value={currentSkill.category}
                                    onChange={e => setCurrentSkill({ ...currentSkill, category: e.target.value })}
                                    placeholder="e.g. Frontend, Backend, Tools"
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-green-500"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm text-white/70 mb-1">Level (1-100)</label>
                                <input
                                    type="number"
                                    min="1"
                                    max="100"
                                    value={currentSkill.level || ''}
                                    onChange={e => setCurrentSkill({ ...currentSkill, level: parseInt(e.target.value) || null })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-white/70 mb-1">Icon URL</label>
                                <input
                                    type="text"
                                    value={currentSkill.icon || ''}
                                    onChange={e => setCurrentSkill({ ...currentSkill, icon: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-green-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-white/70 mb-1">Order (Sort)</label>
                                <input
                                    type="number"
                                    value={currentSkill.order}
                                    onChange={e => setCurrentSkill({ ...currentSkill, order: parseInt(e.target.value) || 0 })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-green-500"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check size={20} />}
                                Save Skill
                            </button>
                        </div>
                    </form>
                </motion.div>
            ) : (
                <div className="space-y-8">
                    {Object.entries(groupedSkills).map(([category, categorySkills]) => (
                        <div key={category} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                            <h2 className="text-xl font-bold mb-4 text-green-400">{category}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {categorySkills.sort((a, b) => a.order - b.order).map((skill) => (
                                    <div key={skill.id} className="bg-black/40 border border-white/5 p-4 rounded-xl flex items-center justify-between group hover:border-white/20 transition-colors">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-semibold">{skill.name}</h3>
                                                <span className="text-xs font-mono bg-white/10 px-2 py-0.5 rounded ml-auto mr-2">Order: {skill.order}</span>
                                            </div>
                                            {skill.level && (
                                                <div className="w-full bg-white/10 rounded-full h-1.5 mt-2 overflow-hidden">
                                                    <div className="bg-green-500 h-full rounded-full" style={{ width: `${skill.level}%` }} />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex gap-2 ml-4">
                                            <button
                                                onClick={() => openEditor(skill)}
                                                className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                                            >
                                                <Edit2 size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(skill.id)}
                                                className="p-2 text-red-400/50 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    {skills.length === 0 && (
                        <div className="text-center p-12 bg-white/5 rounded-2xl border border-white/10 text-white/50">
                            No skills found. Add your technical stack!
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
