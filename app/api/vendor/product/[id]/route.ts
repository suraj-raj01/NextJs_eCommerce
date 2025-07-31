import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();





/**
 * @swagger
* /api/vendor/products/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       500:
 *         description: Failed to delete product
 */


// Delete a permission by ID
export async function DELETE(req: NextRequest, context: any) {
  try {
    const id = context.params.id;

    // Step 1: Get all OrderItem IDs for this product
    const orderItems = await prisma.orderItem.findMany({
      where: { productId: id },
      select: { id: true },
    });

    const orderItemIds = orderItems.map(item => item.id);

    // Step 2: Delete related ReturnRequests
    await prisma.returnRequest.deleteMany({
      where: { orderItemId: { in: orderItemIds } },
    });

    // Step 3: Delete related OrderItems
    await prisma.orderItem.deleteMany({
      where: { productId: id },
    });

    // Step 4: Delete related Reviews
    await prisma.reviews.deleteMany({
      where: { productId: id },
    });

    // Step 5: Finally, delete the Product
    await prisma.product.delete({
      where: { id },
    });

    return NextResponse.json(
      { message: 'Product and all related data deleted successfully.' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product and its related data.' },
      { status: 500 }
    );
  }
}


/**
 * @swagger
* /api/vendor/products/{id}:
 *   get:
 *     summary: Search product by ID, name, or category
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID or search term
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Matching products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   category:
 *                     type: string
 *       404:
 *         description: Product not found
 *       500:
 *         description: Failed to search product
 */

//search product
export async function GET(req: NextRequest,context: any) {
  try {
     const name =(context.params.id);

    const products = await prisma.product.findMany({
      where: {
        OR: [
          { name: { contains: name } },
          { category: { contains: name } },
          { id: name },
        ],
      }
    });

    if (!products || products.length === 0) {
      return NextResponse.json(
        { error: 'product not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error('Error searching product:', error);
    return NextResponse.json(
      { error: 'Failed to search product.' },
      { status: 500 }
    );
  }
}


/**
 * @swagger
* /api/vendor/products/{id}:
 *   patch:
 *     summary: Update a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Product ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
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
 *                 type: number
 *               colors:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       500:
 *         description: Failed to update product
 */

// Edit a product

export async function PATCH(
  req: NextRequest,
 context: any
) {
  try {
      const productId =(context.params.id);
    const body = await req.json();
    const { name,category,description,price,stock,colors} = body;

    const existingProduct = await prisma.product.findUnique({
      where: { id: productId },
    });
    const updatedproduct = await prisma.product.update({
      where: { id: productId },
      data: {
          name,
        category,
        description,  
        price: Number(price) || 0, 
        stock: Number(stock) || 0,
        userId: existingProduct?.userId,
        images: existingProduct?.images,
        defaultImage: existingProduct?.defaultImage,
        colors
      }
    });

    return NextResponse.json({"message": "product updated successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product." },
      { status: 500 }
    );
  }
}