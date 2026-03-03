import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';

// Protected PUT - Update an experience
export async function PUT(req, { params }) {
    try {
        const session = await auth();
        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { id } = await params;
        const json = await req.json();

        const experience = await prisma.experience.update({
            where: { id },
            data: json,
        });

        return NextResponse.json(experience);
    } catch (error) {
        console.error('[EXPERIENCE_PUT]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

// Protected DELETE - Delete an experience
export async function DELETE(req, { params }) {
    try {
        const session = await auth();
        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { id } = await params;

        const experience = await prisma.experience.delete({
            where: { id },
        });

        return NextResponse.json(experience);
    } catch (error) {
        console.error('[EXPERIENCE_DELETE]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
