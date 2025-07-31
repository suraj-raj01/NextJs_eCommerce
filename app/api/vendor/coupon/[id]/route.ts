
import { PrismaClient } from '@prisma/client';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();

/**
 * @swagger
* /api/vendor/coupon/{id}:
 *   get:
 *     summary: Get a coupon by ID or code (partial match on code)
 *     tags: [Coupons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Coupon ID or partial code to search
 *     responses:
 *       200:
 *         description: Found matching coupons
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
 *       404:
 *         description: No matching coupons found
 *       500:
 *         description: Server error
 */




//search coupon by id
export async function GET(req: NextRequest,context: any) {
  try {
      const name =(context.params.id);
    const coupon = await prisma.coupon.findMany({
      where: {
        OR: [
          { id: name},
          { code: { contains: name } },
        ],
      },
    });

    if (!coupon) {
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
    }

    return NextResponse.json(coupon);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch coupon' }, { status: 500 });
  }
}



/**
 * @swagger
* /api/vendor/coupon/{id}:
 *   patch:
 *     summary: Update a coupon by ID
 *     tags: [Coupons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Coupon ID
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
 *                 example: "DISCOUNT50"
 *               description:
 *                 type: string
 *                 example: "50% off"
 *               discount:
 *                 type: number
 *                 example: 50
 *               expiryDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-12-31"
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Coupon updated successfully
 *       404:
 *         description: Coupon not found
 *       500:
 *         description: Internal server error
 */

//update coupon
export async function PATCH(req: NextRequest, context: any) {
  try {
    const id =(context.params.id);
    const { code, description, discount, isActive, expiryDate } = await req.json();

    const existing = await prisma.coupon.findUnique({ where: { id: id } });
    if (!existing) {
      return NextResponse.json({ error: 'Coupon not found' }, { status: 404 });
    }

    const expiryDateISO = new Date(expiryDate).toISOString();

    await prisma.coupon.update({
      where: { id: id },
      data: {
        code,
        description,
        discount,
        isActive,
        expiryDate: expiryDateISO,
      },
    });

    return NextResponse.json({ message: 'Coupon updated successfully' });
  } catch (error) {
    console.error('Update coupon error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


/**
 * @swagger
* /api/vendor/coupon/{id}:
 *   delete:
 *     summary: Delete a coupon by ID
 *     tags: [Coupons]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Coupon ID
 *     responses:
 *       200:
 *         description: Coupon deleted successfully
 *       500:
 *         description: Failed to delete coupon
 */

//delete coupon
export async function DELETE(req: NextRequest,context: any) {
  try {
      const name =(context.params.id);
    await prisma.coupon.delete({
      where: { id: name },
    });

    return NextResponse.json({ message: 'Coupon deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete coupon' }, { status: 500 });
  }
}
