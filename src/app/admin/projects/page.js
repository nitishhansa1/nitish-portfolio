'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Edit2, Trash2, X, Check, Loader2 } from 'lucide-react';

export default function ProjectsAdmin() {
    const [projects, setProjects] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [currentProject, setCurrentProject] = useState(null);

    useEffect(() => {
        fetchProjects();
    }, []);

    const fetchProjects = async () => {
        try {
            const res = await fetch('/api/projects');
            const data = await res.json();
            setProjects(data);
        } catch (error) {
            console.error('Failed to fetch projects:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this project?')) return;

        try {
            const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setProjects(projects.filter(p => p.id !== id));
            }
        } catch (error) {
            console.error('Failed to delete project:', error);
        }
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const isNew = !currentProject.id;
        const url = isNew ? '/api/projects' : `/api/projects/${currentProject.id}`;
        const method = isNew ? 'POST' : 'PUT';

        // Ensure tags is an array
        const dataToSave = {
            ...currentProject,
            tags: typeof currentProject.tags === 'string'
                ? currentProject.tags.split(',').map(t => t.trim()).filter(Boolean)
                : currentProject.tags
        };

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dataToSave),
            });

            if (res.ok) {
                await fetchProjects();
                setIsEditing(false);
                setCurrentProject(null);
            }
        } catch (error) {
            console.error('Failed to save project:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const openEditor = (project = { title: '', description: '', image: '', link: '', github: '', tags: '', order: 0 }) => {
        setCurrentProject({
            ...project,
            tags: Array.isArray(project.tags) ? project.tags.join(', ') : project.tags
        });
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
                <h1 className="text-3xl font-bold">Projects</h1>
                <button
                    onClick={() => openEditor()}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                >
                    <Plus size={20} />
                    New Project
                </button>
            </div>

            {isEditing ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 border border-white/10 rounded-2xl p-6"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold">{currentProject.id ? 'Edit Project' : 'New Project'}</h2>
                        <button onClick={() => setIsEditing(false)} className="text-white/50 hover:text-white">
                            <X size={24} />
                        </button>
                    </div>

                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-white/70 mb-1">Title *</label>
                                <input
                                    required
                                    type="text"
                                    value={currentProject.title}
                                    onChange={e => setCurrentProject({ ...currentProject, title: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-white/70 mb-1">Order (Sort)</label>
                                <input
                                    type="number"
                                    value={currentProject.order}
                                    onChange={e => setCurrentProject({ ...currentProject, order: parseInt(e.target.value) || 0 })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-white/70 mb-1">Description *</label>
                            <textarea
                                required
                                rows={4}
                                value={currentProject.description}
                                onChange={e => setCurrentProject({ ...currentProject, description: e.target.value })}
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-blue-500"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-white/70 mb-1">Image URL</label>
                                <input
                                    type="text"
                                    value={currentProject.image || ''}
                                    onChange={e => setCurrentProject({ ...currentProject, image: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-white/70 mb-1">Tags (comma separated)</label>
                                <input
                                    type="text"
                                    value={currentProject.tags || ''}
                                    onChange={e => setCurrentProject({ ...currentProject, tags: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-blue-500"
                                    placeholder="React, Next.js, Framer Motion"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-white/70 mb-1">Live URL</label>
                                <input
                                    type="url"
                                    value={currentProject.link || ''}
                                    onChange={e => setCurrentProject({ ...currentProject, link: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-white/70 mb-1">GitHub URL</label>
                                <input
                                    type="url"
                                    value={currentProject.github || ''}
                                    onChange={e => setCurrentProject({ ...currentProject, github: e.target.value })}
                                    className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                            >
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check size={20} />}
                                Save Project
                            </button>
                        </div>
                    </form>
                </motion.div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {projects.map((project) => (
                        <div key={project.id} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                    <h3 className="text-xl font-bold">{project.title}</h3>
                                    <span className="text-xs font-mono bg-white/10 px-2 py-1 rounded">Order: {project.order}</span>
                                </div>
                                <p className="text-white/60 text-sm line-clamp-2 mb-3">{project.description}</p>
                                <div className="flex flex-wrap gap-2">
                                    {project.tags.map(tag => (
                                        <span key={tag} className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-2 w-full md:w-auto mt-4 md:mt-0">
                                <button
                                    onClick={() => openEditor(project)}
                                    className="flex-1 md:flex-none px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Edit2 size={16} /> Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(project.id)}
                                    className="flex-1 md:flex-none px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded-lg flex items-center justify-center gap-2 transition-colors"
                                >
                                    <Trash2 size={16} /> Delete
                                </button>
                            </div>
                        </div>
                    ))}
                    {projects.length === 0 && (
                        <div className="text-center p-12 bg-white/5 rounded-2xl border border-white/10 text-white/50">
                            No projects found. Add your first project!
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
