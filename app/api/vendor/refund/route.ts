import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


/**
 * @swagger
 * tags:
 *   name: Refund Requests
 *   description: API for managing refund requests
 */

/**
 * @swagger
* /api/vendor/refund:
 *   post:
 *     summary: Submit a refund request
 *     tags: [Refund Requests]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - reason
 *             properties:
 *               orderId:
 *                 type: string
 *                 description: ID of the order to refund
 *               reason:
 *                 type: string
 *                 description: Reason for the refund
 *     responses:
 *       201:
 *         description: Refund request added successfully
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Failed to add refund request
 */


// POST new refundRequest
export async function POST(req: NextRequest) {
  try {
    const { orderId, reason } = await req.json();
    
    if (!orderId || !reason ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const refundRequest = await prisma.refundRequest.create({
      data: {
        orderId,
        reason,
        status: "PENDING",
      },
    });

    return NextResponse.json(
      { message: "Refund request added successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error adding refund Requests:", error);
    return NextResponse.json(
      { error: "Failed to add refund Requests." },
      { status: 500 }
    );
  }
}



/**
 * @swagger
* /api/vendor/refund:
 *   get:
 *     summary: Get all refund requests (paginated)
 *     tags: [Refund Requests]
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
 *         description: Items per page (default is 10)
 *     responses:
 *       200:
 *         description: List of refund requests
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
 *                       reason:
 *                         type: string
 *                       status:
 *                         type: string
 *                         enum: [PENDING, APPROVED, REJECTED]
 *                       order:
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
 *         description: Failed to fetch refund requests
 */

// GET all refundRequests
export async function GET(req: NextRequest) {
  try {
    // Get URL search params
    const { searchParams } = new URL(req.url);
    
    // Parse page and limit with defaults
    const page = parseInt(searchParams.get('page') ?? '1', 10);
    const limit = parseInt(searchParams.get('limit') ?? '10', 10);

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Fetch total count for metadata
    const totalCount = await prisma.refundRequest.count();

    // Fetch paginated refund requests with order included
    const refundRequests = await prisma.refundRequest.findMany({
      include: {
        order: true,
      },
      skip,
      take: limit,
    });

    // Return data with pagination metadata
    return NextResponse.json({
      data: refundRequests,
      meta: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching refundRequests:", error);
    return NextResponse.json(
      { error: "Failed to fetch refundRequests." },
      { status: 500 }
    );
  }
}