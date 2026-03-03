import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';

// Public GET - Retrieve all experience
export async function GET() {
    try {
        const experience = await prisma.experience.findMany({
            orderBy: { order: 'asc' },
        });
        return NextResponse.json(experience);
    } catch (error) {
        console.error('[EXPERIENCE_GET]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

// Protected POST - Create a new experience
export async function POST(req) {
    try {
        const session = await auth();
        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const json = await req.json();
        const experience = await prisma.experience.create({
            data: json,
        });

        return NextResponse.json(experience);
    } catch (error) {
        console.error('[EXPERIENCE_POST]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
