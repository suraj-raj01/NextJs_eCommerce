import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET all plantypes
export async function GET() {
    try {
        const plantypes = await prisma.plantype.findMany();
        return NextResponse.json(plantypes);
    } catch (error) {
        console.error('GET Plantypes Error:', error);
        return NextResponse.json({ error: 'Failed to fetch plantypes' }, { status: 500 });
    }
}

// POST - Create a new plantype
export async function POST(req: Request) {
    const body = await req.json();
    const { type, typecheck } = body;

    try {
        const newPlantype = await prisma.plantype.create({
            data: {
                type,
                typecheck,
            },
        });

        return NextResponse.json({
            message: 'Plantype created successfully',
            data: newPlantype,
        });
    } catch (error) {
        console.error('POST Plantype Error:', error);
        return NextResponse.json({ error: 'Failed to create plantype' }, { status: 500 });
    }
}

