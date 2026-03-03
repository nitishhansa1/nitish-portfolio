import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';

// Protected PUT - Update a testimonial
export async function PUT(req, { params }) {
    try {
        const session = await auth();
        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { id } = await params;
        const json = await req.json();

        const testimonial = await prisma.testimonial.update({
            where: { id },
            data: json,
        });

        return NextResponse.json(testimonial);
    } catch (error) {
        console.error('[TESTIMONIALS_PUT]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

// Protected DELETE - Delete a testimonial
export async function DELETE(req, { params }) {
    try {
        const session = await auth();
        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { id } = await params;

        const testimonial = await prisma.testimonial.delete({
            where: { id },
        });

        return NextResponse.json(testimonial);
    } catch (error) {
        console.error('[TESTIMONIALS_DELETE]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
