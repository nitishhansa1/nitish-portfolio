import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';

// Protected PUT - Update a skill
export async function PUT(req, { params }) {
    try {
        const session = await auth();
        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { id } = await params;
        const json = await req.json();

        const skill = await prisma.skill.update({
            where: { id },
            data: json,
        });

        return NextResponse.json(skill);
    } catch (error) {
        console.error('[SKILLS_PUT]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

// Protected DELETE - Delete a skill
export async function DELETE(req, { params }) {
    try {
        const session = await auth();
        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { id } = await params;

        const skill = await prisma.skill.delete({
            where: { id },
        });

        return NextResponse.json(skill);
    } catch (error) {
        console.error('[SKILLS_DELETE]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
