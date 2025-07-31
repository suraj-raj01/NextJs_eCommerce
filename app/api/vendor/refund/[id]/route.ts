import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();



/**
 * @swagger
* /api/vendor/refund/{id}:
 *   patch:
 *     summary: Update a refund request status
 *     tags: [Refund Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Refund request ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, APPROVED, REJECTED]
 *     responses:
 *       200:
 *         description: Refund request updated successfully
 *       500:
 *         description: Failed to update refund request
 */


//Edit a refundRequest by ID

export async function PATCH(
  req: NextRequest,
 context: any
) {
  try {
    const productId =(context.params.id);
    const body = await req.json();
    const { status } = body;

    const existingProduct = await prisma.refundRequest.findUnique({
      where: { id: productId },
    });
    const updatedproduct = await prisma.refundRequest.update({
      where: { id: productId },
      data: {
         status
      }
    });

    return NextResponse.json({"message": "refund Request updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating refund Request:", error);
    return NextResponse.json(
      { error: "Failed to update refund Request." },
      { status: 500 }
    );
  }
}



/**
 * @swagger
* /api/vendor/refund/{id}:
 *   delete:
 *     summary: Delete a refund request
 *     tags: [Refund Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Refund request ID
 *     responses:
 *       200:
 *         description: Refund request deleted successfully
 *       500:
 *         description: Failed to delete refund request
 */


//Delete a refundRequest by ID
export async function DELETE(req: NextRequest,context: any) {
  try {
    const id =(context.params.id);
    const updatedrefundRequest = await prisma.refundRequest.delete({
      where: { id },
    });

    return NextResponse.json({"message": "refundRequest deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error('Error deleting refund Request:', error);
    return NextResponse.json(
      { error: 'Failed to delete refund Request.' },
      { status: 500 }
    );
  }
}



/**
 * @swagger
* /api/vendor/refund/{id}:
 *   get:
 *     summary: Get refund request by ID or Order ID
 *     tags: [Refund Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Refund request ID or orderId
 *     responses:
 *       200:
 *         description: Refund request details
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Failed to retrieve refund request
 */

//Get a refund Request by ID
export async function GET(req: NextRequest,context: any) {
  try {
    const id =(context.params.id);
    const refundRequest = await prisma.refundRequest.findMany({
      where: { OR: [{ id }, { orderId: id }] },
      include: {
        order: true
      }
    });  

    return NextResponse.json(refundRequest);    
  } catch (error) {
    console.error('Error fetching refundRequest:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve refundRequest.' },
      { status: 500 }
    );
  }
}