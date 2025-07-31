import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API for managing products
 */

/**
 * @swagger
* /api/vendor/product:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - category
 *               - price
 *               - stock
 *               - userId
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               userId:
 *                 type: string
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *               defaultImage:
 *                 type: string
 *               colors:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Product added successfully
 *       400:
 *         description: Stock must be positive
 *       500:
 *         description: Failed to add product
 */





// Create a product
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, category, description, price, stock, userId,images, defaultImage, colors } = body;
    if(stock<=0){
      return NextResponse.json(
        { error: 'Stock cannot be negative or zero.' },
        { status: 400 }
      );
    }
    await prisma.product.create({
      data: {
        name,
        category,
        description,
        price: Number(price) || 0,
        stock: Number(stock) || 0,
        userId,
        images,
        defaultImage,
        colors
        
      }
    });

    return NextResponse.json({ "message": "product added successfully" }, { status: 201 });
  } catch (error) {
    console.error('Error adding product:', error);
    return NextResponse.json(
      { error: 'Failed to add product.' },
      { status: 500 }
    );
  }
}



/**
 * @swagger
* /api/vendor/product:
 *   get:
 *     summary: Get all products (paginated)
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: A list of products with pagination
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
 *                       name:
 *                         type: string
 *                       category:
 *                         type: string
 *                       price:
 *                         type: number
 *                       stock:
 *                         type: integer
 *                       user:
 *                         type: object
 *                 page:
 *                   type: integer
 *                 limit:
 *                   type: integer
 *                 totalItems:
 *                   type: integer
 *                 totalPages:
 *                   type: integer
 *       500:
 *         description: Failed to retrieve products
 */

// Get all products

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        include: { user: true },
        skip,
        take: limit
      }),
      prisma.product.count(),
    ]);

    return NextResponse.json({
      data: products,
      page,
      limit,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve products.' },
      { status: 500 }
    );
  }
}