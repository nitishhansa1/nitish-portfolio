import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';

// Public GET - Retrieve all projects
export async function GET() {
    try {
        const projects = await prisma.project.findMany({
            orderBy: { order: 'asc' },
        });
        return NextResponse.json(projects);
    } catch (error) {
        console.error('[PROJECTS_GET]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

// Protected POST - Create a new project
export async function POST(req) {
    try {
        const session = await auth();
        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const json = await req.json();
        const project = await prisma.project.create({
            data: json,
        });

        return NextResponse.json(project);
    } catch (error) {
        console.error('[PROJECTS_POST]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
