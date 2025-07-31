import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


/**
 * @swagger
* /api/vendor/vendor/order/{id}:
 *   get:
 *     summary: Get an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Order ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 status:
 *                   type: string
 *                 customer:
 *                   type: object
 *                   properties:
 *                     id: { type: string }
 *                     name: { type: string }
 *                     email: { type: string }
 *                     phone: { type: string }
 *                     address: { type: string }
 *                     state: { type: string }
 *                     city: { type: string }
 *                 orderItems:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       quantity: { type: integer }
 *                       price: { type: number }
 *                       product:
 *                         type: object
 *                         properties:
 *                           id: { type: string }
 *                           name: { type: string }
 *                           price: { type: number }
 *       404:
 *         description: Order not found
 *       500:
 *         description: Internal server error
 */


// GET One Order by ID
export async function GET(req: NextRequest, context: any) {
  try {
    const name = (context.params.id);
    const order = await prisma.order.findUnique({
      where: { id: name },
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
        orderItems: {
          include: { product: true },
        },
      },
    });

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Get order by ID error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


/**
 * @swagger
* /api/vendor/vendor/order/{id}:
 *   patch:
 *     summary: Update an order's status or confirmation
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Order ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *               confirmed:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Order updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 */



// UPDATE Order 
export async function PATCH(req: NextRequest, context: any) {
  try {
    const name = (context.params.id);
    const orderId = name;
    const { status, confirmed } = await req.json();

    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status, confirmed },
    });

    return NextResponse.json({ message: 'Order updated' });
  } catch (error) {
    console.error('Update order error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


/**
 * @swagger
* /api/vendor/vendor/order/{id}:
 *   delete:
 *     summary: Delete an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Order ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal server error
 */



// DELETE Order
export async function DELETE(req: NextRequest, context: any) {
  try {
    const orderId = context.params.id;

    // Clean up related records
    await prisma.complaint.deleteMany({ where: { orderId } });
    await prisma.deliveryTracking.deleteMany({ where: { orderId } });
    await prisma.refundRequest.deleteMany({ where: { orderId } });
    await prisma.returnRequest.deleteMany({ where: { orderId } });
    await prisma.orderItem.deleteMany({ where: { orderId } });

    // Delete order
    await prisma.order.delete({ where: { id: orderId } });

    return NextResponse.json({ message: 'Order deleted successfully' });
  } catch (error) {
    console.error('Delete order error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

