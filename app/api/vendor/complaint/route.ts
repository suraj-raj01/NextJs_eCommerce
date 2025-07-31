import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


/**
 * @swagger
 * tags:
 *   name: Complaints
 *   description: API for managing Complaints
 */


/**
 * @swagger
* /api/vendor/complaint:
 *   get:
 *     summary: Get all complaints (paginated)
 *     tags: [Complaints]
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
 *         description: Number of complaints per page
 *     responses:
 *       200:
 *         description: List of complaints
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 complaints:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: { type: string }
 *                       complaint: { type: string }
 *                       status: { type: string }
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
 *                         properties:
 *                           id: { type: string }
 *                           createdAt: { type: string, format: date-time }
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     totalItems: { type: integer }
 *                     totalPages: { type: integer }
 *                     currentPage: { type: integer }
 *                     pageSize: { type: integer }
 *       500:
 *         description: Failed to fetch complaints
 */


// GET all complaints
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);

    const skip = (page - 1) * limit;

    const [complaints, total] = await Promise.all([
      prisma.complaint.findMany({
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
      }),
      prisma.complaint.count(),
    ]);

    return NextResponse.json({
      complaints,
      pagination: {
        totalItems: total,
        totalPages: Math.ceil(total / limit),
        currentPage: page,
        pageSize: limit,
      },
    });
  } catch (error) {
    console.error('Error fetching complaints:', error);
    return NextResponse.json({ error: 'Failed to fetch complaints' }, { status: 500 });
  }
}



/**
 * @swagger
* /api/vendor/complaint:
 *   post:
 *     summary: Register a new complaint
 *     tags: [Complaints]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - orderId
 *               - customerId
 *               - complaint
 *             properties:
 *               orderId:
 *                 type: string
 *                 example: "order_123"
 *               customerId:
 *                 type: string
 *                 example: "customer_456"
 *               complaint:
 *                 type: string
 *                 example: "The product arrived damaged."
 *     responses:
 *       201:
 *         description: Complaint registered
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Complaint registered
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Failed to create complaint
 */




// CREATE a new complaint
export async function POST(req: NextRequest) {
  try {
    const { orderId, customerId, complaint } = await req.json();

    if (!orderId || !customerId || !complaint ) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newComplaint = await prisma.complaint.create({
      data: {
        orderId,
        customerId,
        complaint,
        status: 'pending', 
      },
    });

    return NextResponse.json({ message: 'Complaint registered'}, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create complaint' }, { status: 500 });
  }
}
