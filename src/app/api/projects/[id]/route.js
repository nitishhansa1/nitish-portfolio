import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';

// Protected PUT - Update a project
export async function PUT(req, { params }) {
    try {
        const session = await auth();
        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { id } = await params;
        const json = await req.json();

        const project = await prisma.project.update({
            where: { id },
            data: json,
        });

        return NextResponse.json(project);
    } catch (error) {
        console.error('[PROJECTS_PUT]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

// Protected DELETE - Delete a project
export async function DELETE(req, { params }) {
    try {
        const session = await auth();
        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { id } = await params;

        const project = await prisma.project.delete({
            where: { id },
        });

        return NextResponse.json(project);
    } catch (error) {
        console.error('[PROJECTS_DELETE]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
