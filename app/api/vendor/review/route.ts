// app/api/reviews/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();



/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: API for managing reviews
 */

/**
 * @swagger
* /api/vendor/review:
 *   get:
 *     summary: Get all product reviews with pagination
 *     tags: [Reviews]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: A list of reviews
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
 *                       rating:
 *                         type: number
 *                       comment:
 *                         type: string
 *                       product:
 *                         type: object
 *                       customer:
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
 *         description: Failed to fetch reviews
 */



// GET all reviews
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Parse pagination params with defaults
    const page = parseInt(searchParams.get('page') ?? '1', 10);
    const limit = parseInt(searchParams.get('limit') ?? '10', 10);
    const skip = (page - 1) * limit;

    // Total count for metadata
    const totalCount = await prisma.reviews.count();

    // Fetch paginated reviews with related product and customer info
    const reviews = await prisma.reviews.findMany({
      include: {
        product: {
          select: {
            id: true,
            name: true,
            description: true,
            price: true,
          },
        },
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
      },
      skip,
      take: limit,
    });

    return NextResponse.json({
      data: reviews,
      meta: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    }, { status: 200 });

  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { error: 'Failed to fetch reviews' },
      { status: 500 }
    );
  }
}



/**
 * @swagger
* /api/vendor/review:
 *   post:
 *     summary: Create a new review for a product
 *     tags: [Reviews]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - customerId
 *               - rating
 *               - comment
 *             properties:
 *               productId:
 *                 type: string
 *               customerId:
 *                 type: string
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       201:
 *         description: Review created
 *       400:
 *         description: Missing or invalid fields
 *       500:
 *         description: Failed to create review
 */

// POST new review
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { productId, customerId, rating, comment } = body;

    if (!productId || !customerId || !rating || !comment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
if( typeof rating !== 'number' || rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be a number between 1 and 5' }, { status: 400 });
    }
    const newReview = await prisma.reviews.create({
      data: {
        productId,
        customerId,
        rating,
        comment,
      },
    });

    return NextResponse.json({ message: 'Review created' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create review' }, { status:500});
}
}