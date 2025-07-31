import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { stat } from 'fs';
const prisma = new PrismaClient();


/**
 * @swagger
* /api/vendor/deliverytracking/{id}:
 *   get:
 *     summary: Get delivery tracking record by ID or Order ID
 *     tags: [DeliveryTracking]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: DeliveryTracking ID or Order ID
 *     responses:
 *       200:
 *         description: Delivery tracking found
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id: { type: string }
 *                   orderId: { type: string }
 *                   status: { type: string }
 *                   location: { type: string }
 *                   createdAt: { type: string, format: date-time }
 *                   updatedAt: { type: string, format: date-time }
 *                   order:
 *                     type: object
 *                     description: Related order details
 *       404:
 *         description: Delivery tracking not found
 *       500:
 *         description: Internal server error
 * 
 *   patch:
 *     summary: Update a delivery tracking record
 *     tags: [DeliveryTracking]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: DeliveryTracking ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               location:
 *                 type: string
 *     responses:
 *       200:
 *         description: Delivery tracking updated
 *       404:
 *         description: Delivery tracking not found
 *       500:
 *         description: Internal server error
 * 
 *   delete:
 *     summary: Delete a delivery tracking record
 *     tags: [DeliveryTracking]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: DeliveryTracking ID
 *     responses:
 *       200:
 *         description: Delivery tracking deleted successfully
 *       500:
 *         description: Internal server error
 */


// GET One deliveryTracking by ID
export async function GET(req: NextRequest,context: any) {
  try {
      const name =(context.params.id);
    const deliveryTracking = await prisma.deliveryTracking.findMany({
      where: {
                 OR: [
          { id: name },
          { orderId: name}
        ]

       },
      include: {
        order: true,
      },
    });

    if (!deliveryTracking) return NextResponse.json({ error: 'deliveryTracking not found' }, { status: 404 });

    return NextResponse.json(deliveryTracking);
  } catch (error) {
    console.error('Get deliveryTracking by ID error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


// UPDATE deliveryTracking 
export async function PATCH(req: NextRequest,context: any) {
  try {
      const name =(context.params.id);
    const deliveryTrackingId = name;
    let { status='',location='' } = await req.json();
    if(status == '' || location=='' ) {
      const mydata = await prisma.deliveryTracking.findUnique({
        where: { id: deliveryTrackingId },
      });
      if (!mydata) {
        return NextResponse.json({ error: 'deliveryTracking not found' }, { status: 404 });
      }
 if(status == '') {
        status = mydata.status;
      }
      if(location == '') {
        location = mydata.location;
      }
    }

    const updateddeliveryTracking = await prisma.deliveryTracking.update({
      where: { id: deliveryTrackingId },
      data: { status ,location },
    });

    return NextResponse.json({ message: 'deliveryTracking updated' });
  } catch (error) {
    console.error('Update deliveryTracking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// DELETE deliveryTracking
export async function DELETE(req: NextRequest,context: any) {
  try {
      const name =(context.params.id);
    const deliveryTrackingId = name;

    await prisma.deliveryTracking.delete({ where: { id: deliveryTrackingId } });

    return NextResponse.json({ message: 'deliveryTracking deleted successfully' });
  } catch (error) {
    console.error('Delete deliveryTracking error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
