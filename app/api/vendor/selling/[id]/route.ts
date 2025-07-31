import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();



/**
 * @swagger
* /api/vendor/selling/{id}:
 *   get:
 *     summary: Get sales report for a specific product
 *     tags: [Sales]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Product ID to fetch sales data for
 *     responses:
 *       200:
 *         description: Sales data for the specified product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 productId:
 *                   type: string
 *                 productName:
 *                   type: string
 *                 totalQuantitySold:
 *                   type: number
 *                 totalRevenue:
 *                   type: number
 *                 totalOrders:
 *                   type: number
 *                 orders:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       orderId:
 *                         type: string
 *                       date:
 *                         type: string
 *                         format: date-time
 *                       status:
 *                         type: string
 *                       quantity:
 *                         type: number
 *                       price:
 *                         type: number
 *                       revenue:
 *                         type: number
 *       500:
 *         description: Failed to fetch product sell report
 */


export async function GET(req: NextRequest,context: any) {
  try {
    const proId = (context.params.id);

    const orderItems = await prisma.orderItem.findMany({
      where: { productId:proId },
      include: {
        order: {
          select: {
            id: true,
            createdAt: true,
            status: true,
          },
        },
        product: {
          select: {
            name: true,
            price: true,
          },
        },
      },
    });

    if (orderItems.length === 0) {
      return NextResponse.json({
        productId:proId,
        productName: 'Unknown or not sold yet',
        totalQuantitySold: 0,
        totalRevenue: 0,
        totalOrders: 0,
        orders: [],
      });
    }

    let totalQuantity = 0;
    let totalRevenue = 0;

    const orderDetails = orderItems.map((item) => {
      const revenue = item.quantity * item.price;
      totalQuantity += item.quantity;
      totalRevenue += revenue;

      return {
        orderId: item.order.id,
        date: item.order.createdAt,
        status: item.order.status,
        quantity: item.quantity,
        price: item.price,
        revenue,
      };
    });

    return NextResponse.json({
      productId:proId,
      productName: orderItems[0].product.name,
      totalQuantitySold: totalQuantity,
      totalRevenue,
      totalOrders: orderItems.length,
      orders: orderDetails,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch product sell report' }, { status: 500 });
  }
}



