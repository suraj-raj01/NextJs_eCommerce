

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


/**
 * @swagger
 * tags:
 *   name: Invoices
 *   description: API for managing invoices
 */

/**
 * @swagger
* /api/vendor/invoice:
 *   get:
 *     summary: Get all invoices with pagination
 *     tags: [Invoices]
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of records per page
 *     responses:
 *       200:
 *         description: A paginated list of invoices with customer and order details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                       customer:
 *                         type: object
 *                         properties:
 *                           id: { type: string }
 *                           name: { type: string }
 *                           email: { type: string }
 *                           phone: { type: string }
 *                           address: { type: string }
 *                           state: { type: string }
 *                           city: { type: string }
 *                       order:
 *                         type: object
 *                         description: Order details associated with the invoice
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 totalItems:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *       500:
 *         description: Failed to fetch invoices
 */


// GET all invoices
export async function GET(req: NextRequest) {
  try {
    // Extract page and limit from query params
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    // Fetch paginated invoices with customer and order data
    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        skip,
        take: limit,
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
          order: true,
        },
        orderBy: {
          createdAt: 'desc', // optional: sort latest first
        },
      }),
      prisma.invoice.count(), // total items for pagination
    ]);

    return NextResponse.json({
      data: invoices,
      page,
      limit,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching invoices:', error);
    return NextResponse.json({ error: 'Failed to fetch invoices' }, { status: 500 });
  }
}