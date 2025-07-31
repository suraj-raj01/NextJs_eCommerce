import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


/**
 * @swagger
* /api/vendor/review/{id}:
 *   patch:
 *     summary: Update a review by ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Review ID to update
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rating:
 *                 type: number
 *                 minimum: 1
 *                 maximum: 5
 *               comment:
 *                 type: string
 *     responses:
 *       200:
 *         description: Review updated successfully
 *       500:
 *         description: Failed to update review
 */

// UPDATE review by ID
export async function PATCH(req: NextRequest,context: any) {
  try {
    const reviewId = (context.params.id);
    const body = await req.json();
    const { rating, comment } = body;

    const updatedReview = await prisma.reviews.update({
      where: { id: reviewId },
      data: { rating:Number(rating), comment },
    });

    return NextResponse.json({ message: 'Review updated'});
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}


/**
 * @swagger
* /api/vendor/review/{id}:
 *   delete:
 *     summary: Delete a review by ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Review ID to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Review deleted successfully
 *       500:
 *         description: Failed to delete review
 */

// DELETE review by ID
export async function DELETE(_req: NextRequest,context: any) {
  try {
    const reviewId = (context.params.id);

    await prisma.reviews.delete({
      where: { id: reviewId },
    });

    return NextResponse.json({ message: 'Review deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}


/**
 * @swagger
* /api/vendor/review/{id}:
 *   get:
 *     summary: Get reviews by review ID, product ID, or customer ID
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Review ID, Product ID, or Customer ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Reviews fetched successfully
 *       404:
 *         description: Review not found
 *       500:
 *         description: Failed to fetch review
 */


// Search reviwes 
export async function GET(req: NextRequest,context: any) {
  try {
    const name = (context.params.id);

    const reviews = await prisma.reviews.findMany({
      where: {
        OR: [
          { productId: name },
          { customerId: name },
          { id: name },
        ]
      },
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
      }
    });

    if (!reviews || reviews.length === 0) {
      return NextResponse.json(
        { error: 'Review not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    console.error('Error searching review:', error);
    return NextResponse.json(
      { error: 'Failed to search review.' },
      { status: 500}
);
}
}