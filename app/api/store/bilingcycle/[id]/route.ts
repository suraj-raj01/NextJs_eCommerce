import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// PATCH - Update a billingcycle by ID
export async function PATCH(req: Request, context:any) {
    const body = await req.json();
    const id = context.params.id;

    if (!id) {
        return NextResponse.json({ error: 'ID is required for update' }, { status: 400 });
    }

    try {
        const updated = await prisma.billingcycle.update({
            where: { id },
            data: {...body},
        });

        return NextResponse.json({
            message: 'billingcycle updated successfully',
            data: updated,
        });
    } catch (error) {
        console.error('PUT billingcycle Error:', error);
        return NextResponse.json({ error: 'Failed to update billingcycle' }, { status: 500 });
    }
}

// DELETE - Delete a billingcycle by ID
export async function DELETE(req: NextRequest,context:any) {
    const id = context.params.id;

    if (!id) {
        return NextResponse.json({ error: 'ID is required for delete' }, { status: 400 });
    }

    try {
        await prisma.billingcycle.delete({ where: { id } });
        return NextResponse.json({ message: 'billingcycle deleted successfully' });
    } catch (error) {
        console.error('DELETE billingcycle Error:', error);
        return NextResponse.json({ error: 'Failed to delete billingcycle' }, { status: 500 });
    }
}

// search biling cycle
export async function POST(req: NextRequest, context: any) {
  const id = context.params.id;

  if (!id) {
    return NextResponse.json({ error: "Bilingcycle ID is required" }, { status: 400 });
  }

  try {
   const data = await prisma.billingcycle.findMany({ where: { 
        OR:[
            {type:{contains:id}},
            {id:{contains:id}}
        ]
    } });

    return NextResponse.json({data:data});
  } catch (error) {
    console.error("Error deleting plan:", error);
    return NextResponse.json({ error: "Failed to delete bilingcycle" }, { status: 500 });
  }
}
