import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * @swagger
 * tags:
 *   name: DeliveryTracking
 *   description: API for managing delivery tracking
 */

/**
 * @swagger
* /api/vendor/deliverytracking:
 *   get:
 *     summary: Get all delivery tracking records with pagination
 *     tags: [DeliveryTracking]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Current page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of records per page
 *     responses:
 *       200:
 *         description: A list of delivery tracking records
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
 *                       id: { type: string }
 *                       status: { type: string }
 *                       location: { type: string }
 *                       createdAt: { type: string, format: date-time }
 *                       updatedAt: { type: string, format: date-time }
 *                       orderId: { type: string }
 *                       order:
 *                         type: object
 *                         description: Associated order data
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total: { type: integer }
 *                     page: { type: integer }
 *                     limit: { type: integer }
 *                     totalPages: { type: integer }
 *       500:
 *         description: Server error
 */


// Get all delivery tracking records with pagination
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get('page') ?? '1', 10);
    const limit = parseInt(searchParams.get('limit') ?? '10', 10);

    const skip = (page - 1) * limit;

    // Get total count for pagination metadata
    const totalCount = await prisma.deliveryTracking.count();

    // Fetch paginated deliveryTrackings with related orderItem and order
    const deliveryTrackings = await prisma.deliveryTracking.findMany({
      include: {
        order: true,
      },
      skip,
      take: limit,
    });

    return NextResponse.json({
      data: deliveryTrackings,
      meta: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching deliveryTrackings:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve deliveryTrackings.' },
      { status: 500 }
    );
  }
}