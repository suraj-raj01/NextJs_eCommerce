import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


/**
 * @swagger
 * tags:
 *   name: Coupons
 *   description: API for managing coupons
 */

/**
 * @swagger
* /api/vendor/coupon:
 *   get:
 *     summary: Get all coupons
 *     tags: [Coupons]
 *     responses:
 *       200:
 *         description: List of coupons
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id: { type: string }
 *                   code: { type: string }
 *                   description: { type: string }
 *                   discount: { type: number }
 *                   expiryDate: { type: string, format: date-time }
 *                   isActive: { type: boolean }
 *       500:
 *         description: Failed to fetch coupons
 */




// Get all coupons
export async function GET() {
  try {
    const coupons = await prisma.coupon.findMany();
    return NextResponse.json(coupons);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch coupons' }, { status: 500 });
  }
}


/**
 * @swagger
* /api/vendor/coupon:
 *   post:
 *     summary: Create a new coupon
 *     tags: [Coupons]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - code
 *               - discount
 *             properties:
 *               code:
 *                 type: string
 *                 example: "SAVE20"
 *               description:
 *                 type: string
 *                 example: "20% off on all orders"
 *               discount:
 *                 type: number
 *                 example: 20
 *               expiryDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-12-31"
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       201:
 *         description: Coupon created successfully
 *       400:
 *         description: Coupon already exists
 *       500:
 *         description: Failed to create coupon
 */

// Create a new coupon
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, description, discount, expiryDate, isActive } = body;

    const existing = await prisma.coupon.findUnique({ where: { code } });
    if (existing) {
      return NextResponse.json({ error: 'Coupon already exists' }, { status: 400 });
    }

    const coupon = await prisma.coupon.create({
      data: {
        code,
        description,
        discount,
        expiryDate: expiryDate ? new Date(expiryDate) : undefined,
        isActive: isActive ?? true,
      },
    });

    return NextResponse.json({ message: 'Coupon created successfully' }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create coupon' }, { status: 500 });
  }
}
