import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// PATCH - Update a plantype by ID
export async function PATCH(req: Request, context:any) {
    const body = await req.json();
    const id = context.params.id;
    const {type, typecheck } = body;
    console.log(id,body,"data")
    if (!id) {
        return NextResponse.json({ error: 'ID is required for update' }, { status: 400 });
    }

    try {
        const updated = await prisma.plantype.update({
            where: { id },
            data: { type:Number(type), typecheck },
        });

        return NextResponse.json({
            message: 'Plantype updated successfully',
            data: updated,
        });
    } catch (error) {
        console.error('PUT Plantype Error:', error);
        return NextResponse.json({ error: 'Failed to update plantype' }, { status: 500 });
    }
}

// DELETE - Delete a plantype by ID
export async function DELETE(req: NextRequest,context:any) {
    const id = context.params.id;

    if (!id) {
        return NextResponse.json({ error: 'ID is required for delete' }, { status: 400 });
    }

    try {
        await prisma.plantype.delete({ where: { id } });
        return NextResponse.json({ message: 'Plantype deleted successfully' });
    } catch (error) {
        console.error('DELETE Plantype Error:', error);
        return NextResponse.json({ error: 'Failed to delete plantype' }, { status: 500 });
    }
}

// search plan type

export async function POST(req: NextRequest, context: any) {
  const id = context.params.id;

  if (!id) {
    return NextResponse.json({ error: "plantype ID is required" }, { status: 400 });
  }

  try {
   const data = await prisma.plantype.findMany({ where: { 
        OR:[
            {id: { contains: id }}
        ]
    } });

    return NextResponse.json({data:data});
  } catch (error) {
    console.error("Error deleting plantype:", error);
    return NextResponse.json({ error: "Failed to delete plantype" }, { status: 500 });
  }
}
