import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';

// Public POST - Submit a new contact message
export async function POST(req) {
    try {
        const json = await req.json();

        // Basic validation
        if (!json.name || !json.email || !json.message) {
            return new NextResponse('Missing required fields', { status: 400 });
        }

        const message = await prisma.contactMessage.create({
            data: {
                name: json.name,
                email: json.email,
                message: json.message,
            },
        });

        // TODO: Send email notification here (e.g. using Resend)

        return NextResponse.json({ success: true, id: message.id });
    } catch (error) {
        console.error('[CONTACT_POST]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

// Protected GET - Retrieve all contact messages
export async function GET() {
    try {
        const session = await auth();
        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const messages = await prisma.contactMessage.findMany({
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json(messages);
    } catch (error) {
        console.error('[CONTACT_GET]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
