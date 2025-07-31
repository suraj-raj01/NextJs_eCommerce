import { NextResponse ,NextRequest} from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


/**
 * @swagger
 * tags:
 *   name: Sales
 *   description: API for managing sales
 */

/**
 * @swagger
* /api/vendor/selling:
 *   get:
 *     summary: Get total sales statistics
 *     tags: [Sales]
 *     responses:
 *       200:
 *         description: Returns total quantity sold, total revenue, and breakdown by product
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalProductsSold:
 *                   type: number
 *                 totalRevenue:
 *                   type: number
 *                 productStats:
 *                   type: object
 *                   additionalProperties:
 *                     type: object
 *                     properties:
 *                       quantity:
 *                         type: number
 *                       revenue:
 *                         type: number
 *       500:
 *         description: Failed to fetch sell data
 */


// Get all order items
export async function GET() {
  try {
    // Get all order items
    const orderItems = await prisma.orderItem.findMany({
      include: {
        product: {
          select: {
            name: true,
            price: true
          }
        }
      }
    });

    let totalQuantity = 0;
    let totalRevenue = 0;

    const productStats: Record<string, { quantity: number, revenue: number }> = {};

    for (const item of orderItems) {
      const { quantity, price, product } = item;

      totalQuantity += quantity;
      totalRevenue += quantity * price;

      const productName = product.name;

      if (!productStats[productName]) {
        productStats[productName] = {
          quantity: 0,
          revenue: 0
        };
      }

      productStats[productName].quantity += quantity;
      productStats[productName].revenue += quantity * price;
    }

    return NextResponse.json({
      totalProductsSold: totalQuantity,
      totalRevenue,
      productStats
    });

  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch sell data' }, { status: 500 });
  }
}


/**
 * @swagger
* /api/vendor/selling:
 *   post:
 *     summary: Get sales statistics between two dates
 *     tags: [Sales]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - startDate
 *               - endDate
 *             properties:
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Returns filtered sales data within the given date range
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalProductsSold:
 *                   type: number
 *                 totalRevenue:
 *                   type: number
 *                 productStats:
 *                   type: object
 *                   additionalProperties:
 *                     type: object
 *                     properties:
 *                       quantity:
 *                         type: number
 *                       revenue:
 *                         type: number
 *       400:
 *         description: Missing startDate or endDate
 *       500:
 *         description: Failed to fetch sell data
 */



// Selling Between Dates
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { startDate, endDate } = body;

    if (!startDate || !endDate) {
      return NextResponse.json(
        { error: 'startDate and endDate are required' },
        { status: 400 }
      );
    }

    const parsedStartDate = new Date(startDate);
    const parsedEndDate = new Date(endDate);

    const orderItems = await prisma.orderItem.findMany({
      where: {
        order: {
          createdAt: {
            gte: parsedStartDate,
            lte: parsedEndDate,
          },
        },
      },
      include: {
        product: {
          select: {
            name: true,
            price: true,
          },
        },
      },
    });

    let totalQuantity = 0;
    let totalRevenue = 0;

    const productStats: Record<string, { quantity: number; revenue: number }> = {};

    for (const item of orderItems) {
      const { quantity, price, product } = item;

      totalQuantity += quantity;
      totalRevenue += quantity * price;

      const productName = product.name;

      if (!productStats[productName]) {
        productStats[productName] = { quantity: 0, revenue: 0 };
      }

      productStats[productName].quantity += quantity;
      productStats[productName].revenue += quantity * price;
    }

    return NextResponse.json({
      totalProductsSold: totalQuantity,
      totalRevenue,
      productStats,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch sell data' }, { status: 500 });
  }
}

