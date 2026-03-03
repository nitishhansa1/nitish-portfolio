'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { signOut } from 'next-auth/react';
import { motion } from 'framer-motion';
import {
    Home,
    Briefcase,
    Code2,
    User,
    MessageSquare,
    LogOut
} from 'lucide-react'; // Make sure to install lucide-react if you haven't

const navigation = [
    { name: 'Dashboard', href: '/admin', icon: Home },
    { name: 'Projects', href: '/admin/projects', icon: Briefcase },
    { name: 'Experience', href: '/admin/experience', icon: User },
    { name: 'Skills', href: '/admin/skills', icon: Code2 },
    { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
];

export default function AdminLayout({ children }) {
    const pathname = usePathname();

    // Don't show sidebar on login page
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-[#0B0F14] text-white flex">
            {/* Sidebar navigation */}
            <aside className="w-64 border-r border-white/10 bg-black/20 backdrop-blur-xl flex flex-col hidden md:flex">
                <div className="p-6">
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
                        Portfolio Admin
                    </h2>
                </div>

                <nav className="flex-1 px-4 space-y-2 mt-4">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors relative ${isActive ? 'text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="active-nav"
                                        className="absolute inset-0 bg-white/10 border border-white/10 rounded-lg"
                                        initial={false}
                                        transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <Icon size={20} className="relative z-10" />
                                <span className="relative z-10 font-medium">{item.name}</span>
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="flex items-center gap-3 px-4 py-3 w-full text-left text-white/60 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <LogOut size={20} />
                        <span className="font-medium">Sign Out</span>
                    </button>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-y-auto">
                <div className="p-8 max-w-6xl mx-auto">
                    {children}
                </div>
            </main>

            {/* Mobile nav indicator (placeholder) */}
            <div className="md:hidden fixed bottom-4 left-4 right-4 bg-black/80 border border-white/10 rounded-2xl p-4 flex justify-between z-50 backdrop-blur-lg">
                {navigation.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link key={item.name} href={item.href} className={`p-2 rounded-xl ${isActive ? 'bg-white/10 text-white' : 'text-white/50'}`}>
                            <Icon size={20} />
                        </Link>
                    )
                })}
            </div>
        </div>
    );
}
