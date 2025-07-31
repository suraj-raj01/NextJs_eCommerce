import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * @swagger
* /api/vendor/filterProduct:
 *   post:
 *     summary: Filter and paginate products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number for pagination
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Product name (partial match)
 *               category:
 *                 type: string
 *                 description: Product category (partial match)
 *               userId:
 *                 type: string
 *                 description: User ID who created the product
 *               minPrice:
 *                 type: number
 *                 description: Minimum product price
 *               maxPrice:
 *                 type: number
 *                 description: Maximum product price
 *     responses:
 *       200:
 *         description: Filtered products with pagination
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
 *                       name: { type: string }
 *                       price: { type: number }
 *                       category: { type: string }
 *                       createdAt: { type: string, format: date-time }
 *                       updatedAt: { type: string, format: date-time }
 *                       user:
 *                         type: object
 *                         description: Associated user details
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 totalItems:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *       500:
 *         description: Failed to filter products
 */


// Filter products via POST
export async function POST(req: NextRequest) {
  try {
    // Parse query params
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    // Parse body for filters
    const body = await req.json();
    const { name = '', category = '', userId = '', minPrice = '', maxPrice = '' } = body;

    const filters: any = {};

    if (name) {
      filters.name = { contains: name, mode: 'insensitive' };
    }
    if (category) {
      filters.category = { contains: category, mode: 'insensitive' };
    }
    if (userId) {
      filters.userId = userId;
    }
    if (minPrice || maxPrice) {
      filters.price = {};
      if (minPrice) filters.price.gte = parseFloat(minPrice);
      if (maxPrice) filters.price.lte = parseFloat(maxPrice);
    }

    // Query database
    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where: filters,
        include: {
          user: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      prisma.product.count({
        where: filters,
      }),
    ]);

    return NextResponse.json({
      data: products,
      page,
      limit,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
    }, { status: 200 });

  } catch (error) {
    console.error('Error filtering products:', error);
    return NextResponse.json({ error: 'Failed to filter products.' }, { status: 500 });
  }
}
