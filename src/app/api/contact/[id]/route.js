import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';

// Protected PATCH - Mark a message as read/unread
export async function PATCH(req, { params }) {
    try {
        const session = await auth();
        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { id } = await params;
        const json = await req.json();

        const message = await prisma.contactMessage.update({
            where: { id },
            data: { read: json.read },
        });

        return NextResponse.json(message);
    } catch (error) {
        console.error('[CONTACT_PATCH]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

// Protected DELETE - Delete a message
export async function DELETE(req, { params }) {
    try {
        const session = await auth();
        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { id } = await params;

        const message = await prisma.contactMessage.delete({
            where: { id },
        });

        return NextResponse.json(message);
    } catch (error) {
        console.error('[CONTACT_DELETE]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
