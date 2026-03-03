import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';

// Public GET - Retrieve all skills
export async function GET() {
    try {
        const skills = await prisma.skill.findMany({
            orderBy: { order: 'asc' },
        });
        return NextResponse.json(skills);
    } catch (error) {
        console.error('[SKILLS_GET]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

// Protected POST - Create a new skill
export async function POST(req) {
    try {
        const session = await auth();
        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const json = await req.json();
        const skill = await prisma.skill.create({
            data: json,
        });

        return NextResponse.json(skill);
    } catch (error) {
        console.error('[SKILLS_POST]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
