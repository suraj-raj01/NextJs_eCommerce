import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();



/**
 * @swagger
* /api/vendor/complaint/{id}:
 *   get:
 *     summary: Get a complaint by ID
 *     tags: [Complaints]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Complaint ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Complaint retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 complaint:
 *                   type: object
 *                   properties:
 *                     id: { type: string }
 *                     complaint: { type: string }
 *                     status: { type: string }
 *                     customer:
 *                       type: object
 *                       properties:
 *                         id: { type: string }
 *                         name: { type: string }
 *                         email: { type: string }
 *                         phone: { type: string }
 *                         address: { type: string }
 *                         state: { type: string }
 *                         city: { type: string }
 *                     order:
 *                       type: object
 *       404:
 *         description: Complaint not found
 *       500:
 *         description: Failed to fetch complaint
 */


// GET a complaint by ID
export async function GET(_req: NextRequest,context: any) {
  try {
    const name =(context.params.id);
    const complaint = await prisma.complaint.findUnique({
      where: { id:name },
      include: {
         customer: {      
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            address: true,
            state: true,
            city: true,
          },
        },
         order: true },
    });

    if (!complaint) {
      return NextResponse.json({ error: 'Complaint not found' }, { status: 404 });
    }

    return NextResponse.json({ complaint });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch complaint' }, { status: 500 });
  }
}


/**
 * @swagger
* /api/vendor/complaint/{id}:
 *   patch:
 *     summary: Update a complaint
 *     tags: [Complaints]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Complaint ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               complaint:
 *                 type: string
 *                 example: "Updated complaint text"
 *               status:
 *                 type: string
 *                 example: "resolved"
 *     responses:
 *       200:
 *         description: Complaint updated
 *       500:
 *         description: Failed to update complaint
 */

// UPDATE a complaint
export async function PATCH(req: NextRequest,context: any) {
  try {
      const name =(context.params.id);
    const { complaint, status } = await req.json();

    const updatedComplaint = await prisma.complaint.update({
      where: { id: name },
      data: { complaint, status },
    });

    return NextResponse.json({ message: 'Complaint updated' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update complaint' }, { status: 500 });
  }
}



/**
 * @swagger
* /api/vendor/complaint/{id}:
 *   delete:
 *     summary: Delete a complaint
 *     tags: [Complaints]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Complaint ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Complaint deleted
 *       500:
 *         description: Failed to delete complaint
 */


// DELETE a complaint
export async function DELETE(_req: NextRequest,context: any) {
  try {
      const name =(context.params.id);
    await prisma.complaint.delete({
      where: { id:name },
    });

    return NextResponse.json({ message: 'Complaint deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete complaint' }, { status: 500 });
  }
}
