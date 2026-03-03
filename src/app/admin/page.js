import { prisma } from '@/lib/db';
import { Briefcase, Code2, User, MessageSquare } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboard() {
    // Fetch high-level stats
    const [projectCount, experienceCount, skillCount, unreadMessages] = await Promise.all([
        prisma.project.count(),
        prisma.experience.count(),
        prisma.skill.count(),
        prisma.contactMessage.count({ where: { read: false } }),
    ]);

    const recentMessages = await prisma.contactMessage.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
    });

    const stats = [
        { title: 'Projects', value: projectCount, icon: Briefcase, color: 'text-blue-400', bg: 'bg-blue-400/10' },
        { title: 'Experience', value: experienceCount, icon: User, color: 'text-purple-400', bg: 'bg-purple-400/10' },
        { title: 'Skills', value: skillCount, icon: Code2, color: 'text-green-400', bg: 'bg-green-400/10' },
        { title: 'Unread Msgs', value: unreadMessages, icon: MessageSquare, color: 'text-red-400', bg: 'bg-red-400/10' },
    ];

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold">Dashboard Overview</h1>
                <p className="text-white/60 mt-2">Welcome back to your portfolio admin.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat) => {
                    const Icon = stat.icon;
                    return (
                        <div key={stat.title} className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-start justify-between">
                            <div>
                                <p className="text-white/60 font-medium">{stat.title}</p>
                                <h3 className="text-3xl font-bold mt-2">{stat.value}</h3>
                            </div>
                            <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                                <Icon size={24} />
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Recent Activity */}
            <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <h2 className="text-xl font-bold">Recent Messages</h2>
                    <Link href="/admin/messages" className="text-sm text-blue-400 hover:text-blue-300">
                        View All
                    </Link>
                </div>

                {recentMessages.length === 0 ? (
                    <div className="p-8 text-center text-white/50">
                        No recent messages.
                    </div>
                ) : (
                    <div className="divide-y divide-white/10">
                        {recentMessages.map((msg) => (
                            <div key={msg.id} className="p-6 hover:bg-white-[0.02] transition-colors relative flex items-start gap-4">
                                {!msg.read && (
                                    <span className="w-2 h-2 rounded-full bg-blue-500 mt-2 flex-shrink-0" />
                                )}
                                <div className={msg.read ? 'pl-6' : ''}>
                                    <div className="flex items-baseline justify-between mb-1">
                                        <h4 className="font-semibold">{msg.name}</h4>
                                        <span className="text-xs text-white/40">
                                            {new Date(msg.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <p className="text-sm text-white/60 mb-2">{msg.email}</p>
                                    <p className="text-white/80 line-clamp-2">{msg.message}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
