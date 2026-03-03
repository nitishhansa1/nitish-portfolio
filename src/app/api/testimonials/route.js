import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { auth } from '@/lib/auth';

// Public GET - Retrieve all testimonials
export async function GET() {
    try {
        const testimonials = await prisma.testimonial.findMany({
            orderBy: { order: 'asc' },
        });
        return NextResponse.json(testimonials);
    } catch (error) {
        console.error('[TESTIMONIALS_GET]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}

// Protected POST - Create a new testimonial
export async function POST(req) {
    try {
        const session = await auth();
        if (!session?.user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const json = await req.json();
        const testimonial = await prisma.testimonial.create({
            data: json,
        });

        return NextResponse.json(testimonial);
    } catch (error) {
        console.error('[TESTIMONIALS_POST]', error);
        return new NextResponse('Internal Error', { status: 500 });
    }
}
