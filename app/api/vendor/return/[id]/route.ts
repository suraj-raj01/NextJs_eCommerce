import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();



/**
 * @swagger
* /api/vendor/return/{id}:
 *   delete:
 *     summary: Delete a return request by ID
 *     tags: [Return Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Return request deleted successfully
 *       500:
 *         description: Failed to delete return request
 */


//Edit a returnRequest by ID

export async function PATCH(
  req: NextRequest,
 context: any
) {
  try {
    const productId = (context.params.id);
    const body = await req.json();
    const { status } = body;

    const existingProduct = await prisma.returnRequest.findUnique({
      where: { id: productId },
    });
    const updatedproduct = await prisma.returnRequest.update({
      where: { id: productId },
      data: {
         status
      }
    });

    return NextResponse.json({"message": "returnRequest updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating returnRequest:", error);
    return NextResponse.json(
      { error: "Failed to update returnRequest." },
      { status: 500 }
    );
  }
}

/**
 * @swagger
* /api/vendor/return/{id}:
 *   patch:
 *     summary: Update a return request's status by ID
 *     tags: [Return Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the return request
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, APPROVED, REJECTED]
 *     responses:
 *       200:
 *         description: Return request updated successfully
 *       500:
 *         description: Failed to update return request
 */


//Delete a returnRequest by ID
export async function DELETE(req: NextRequest,context: any) {
  try {
    const id = (context.params.id);
    const updatedreturnRequest = await prisma.returnRequest.delete({
      where: { id },
    });

    return NextResponse.json({"message": "returnRequest deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error('Error deleting returnRequest:', error);
    return NextResponse.json(
      { error: 'Failed to delete returnRequest.' },
      { status: 500 }
    );
  }
}



/**
 * @swagger
* /api/vendor/return/{id}:
 *   get:
 *     summary: Get return request(s) by ID or Order ID
 *     tags: [Return Requests]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ReturnRequest ID or Order ID
 *     responses:
 *       200:
 *         description: Return request(s) retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   orderId:
 *                     type: string
 *                   orderItemId:
 *                     type: string
 *                   reason:
 *                     type: string
 *                   status:
 *                     type: string
 *                   order:
 *                     type: object
 *                   orderItem:
 *                     type: object
 *       500:
 *         description: Failed to retrieve return request
 */



//Get a returnRequest by ID
export async function GET(req: NextRequest,context: any) {
  try {
    const id = (context.params.id);
    const returnRequest = await prisma.returnRequest.findMany({
      where: {
        OR: [
          { id },
          { orderId: id },
        ],
      },
      include: {
        orderItem: true,
        order: true
      }
    });  

    return NextResponse.json(returnRequest);    
  } catch (error) {
    console.error('Error fetching returnRequest:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve returnRequest.' },
      { status: 500 }
    );
  }
}