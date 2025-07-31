import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET all billingcycles
export async function GET() {
    try {
        const billingcycles = await prisma.billingcycle.findMany();
        return NextResponse.json({data:billingcycles});
    } catch (error) {
        console.error('GET billingcycles Error:', error);
        return NextResponse.json({ error: 'Failed to fetch billingcycles' }, { status: 500 });
    }
}

// POST - Create a new billingcycle
export async function POST(req: Request) {
    const body = await req.json();
    const { type, typecheck } = body;

    try {
        const newbillingcycle = await prisma.billingcycle.create({
            data: {
                type,
                typecheck,
            },
        });

        return NextResponse.json({
            message: 'billingcycle created successfully',
            data: newbillingcycle,
        });
    } catch (error) {
        console.error('POST billingcycle Error:', error);
        return NextResponse.json({ error: 'Failed to create billingcycle' }, { status: 500 });
    }
}

