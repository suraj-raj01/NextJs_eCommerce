import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


/**
 * @swagger
 * tags:
 *   name: Return Requests
 *   description: API for managing return requests
 */

/**
 * @swagger
* /api/vendor/return:
 *   post:
 *     summary: Submit return requests for an order
 *     tags: [Return Requests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - items
 *             properties:
 *               orderId:
 *                 type: string
 *                 description: The ID of the order
 *               items:
 *                 type: array
 *                 description: List of items being returned
 *                 items:
 *                   type: object
 *                   required:
 *                     - orderItemId
 *                     - reason
 *                   properties:
 *                     orderItemId:
 *                       type: string
 *                     reason:
 *                       type: string
 *     responses:
 *       201:
 *         description: Return requests added successfully
 *       400:
 *         description: Missing or invalid orderId or items array
 *       500:
 *         description: Failed to add return requests
 */

// POST new returnRequest
export async function POST(req: NextRequest) {
  try {
    const { orderId, items } = await req.json();

    if (!orderId || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Missing or invalid orderId or items array" },
        { status: 400 }
      );
    }

    // Optional: validate orderId exists here

    const createPromises = items.map(async (item) => {
      const { orderItemId, reason } = item;
      if (!orderItemId || !reason) {
        throw new Error("Missing orderItemId or reason in one of the items");
      }

      // Optional: validate orderItem belongs to orderId here

      return prisma.returnRequest.create({
        data: {
          orderItemId,
          orderId,
          reason,
          status: "PENDING",
        },
      });
    });

    const results = await Promise.all(createPromises);

    return NextResponse.json(
      { message: "Return requests added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding returnRequests:", error);
    return NextResponse.json(
      { error: "Failed to add returnRequests." },
      { status: 500 }
    );
  }
}




/**
 * @swagger
* /api/vendor/return:
 *   get:
 *     summary: Get all return requests (paginated)
 *     tags: [Return Requests]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number (default is 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page (default is 10)
 *     responses:
 *       200:
 *         description: List of return requests with pagination
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
 *                       orderId:
 *                         type: string
 *                       orderItemId:
 *                         type: string
 *                       reason:
 *                         type: string
 *                       status:
 *                         type: string
 *                         enum: [PENDING, APPROVED, REJECTED]
 *                       order:
 *                         type: object
 *                       orderItem:
 *                         type: object
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       500:
 *         description: Failed to retrieve return requests
 */



// Get all returnRequests
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get('page') ?? '1', 10);
    const limit = parseInt(searchParams.get('limit') ?? '10', 10);

    const skip = (page - 1) * limit;

    // Get total count for pagination metadata
    const totalCount = await prisma.returnRequest.count();

    // Fetch paginated returnRequests with related orderItem and order
    const returnRequests = await prisma.returnRequest.findMany({
      include: {
        orderItem: true,
        order: true,
      },
      skip,
      take: limit,
    });

    return NextResponse.json({
      data: returnRequests,
      meta: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching returnRequests:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve returnRequests.' },
      { status: 500 }
    );
  }
}