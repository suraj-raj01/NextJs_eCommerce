
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: API for managing orders
 */

/**
 * @swagger
* /api/vendor/vendor/order:
 *   get:
 *     summary: Get paginated list of orders
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: List of orders
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
 *                       createdAt:
 *                         type: string
 *                       customer:
 *                         type: object
 *                         properties:
 *                           id:
 *                             type: string
 *                           name:
 *                             type: string
 *                           email:
 *                             type: string
 *                           phone:
 *                             type: string
 *                           address:
 *                             type: string
 *                           state:
 *                             type: string
 *                           city:
 *                             type: string
 *                       complaint:
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
 *         description: Internal server error
 */



// GET all orders
export async function GET(req: NextRequest) {
  try {
    // Extract page and limit from URL query parameters
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    // Fetch paginated orders
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
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
          complaint: true,
        },
        orderBy: {
          createdAt: 'desc', // optional sorting by latest
        },
      }),
      prisma.order.count(),
    ]);
    console.log(orders)
    return NextResponse.json({
      data: orders,
      page,
      limit,
      totalItems: total,
      totalPages: Math.ceil(total / limit),
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
  }
}




/**
 * @swagger
* /api/vendor/vendor/order:
 *   post:
 *     summary: Create a new order with invoice
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - customerId
 *               - items
 *             properties:
 *               customerId:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - productId
 *                     - quantity
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Order created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Missing required fields
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Internal server error
 */

// Create a new order and its invoice
export async function POST(req: NextRequest) {
  try {
    const { customerId, items } = await req.json();

    if (!customerId || !items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Fetch customer
    const customer = await prisma.customer.findUnique({
      where: { id: customerId },
    });

    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // Fetch products
    const productIds = items.map(item => item.productId);
    const products = await prisma.product.findMany({
      where: { id: { in: productIds } },
    });

    const productMap = Object.fromEntries(products.map(p => [p.id, p]));

    // Calculate subTotal
    let subTotal = 0;
    const orderItemsData = items.map(item => {
      const product = productMap[item.productId];
      if (!product) throw new Error(`Invalid product ID: ${item.productId}`);
      const itemTotal = product.price * item.quantity;
      subTotal += itemTotal;

      return {
        productId: product.id,
        quantity: item.quantity,
        price: product.price,
      };
    });

    // Tax calculation
    const taxRule = await prisma.taxRule.findFirst({
      where: { state: customer.state },
    });

    const taxRate = taxRule?.rate || 0;
    const tax = (subTotal * taxRate) / 100;
    const netTotal = subTotal + tax;

    // Create Order with Items
    const order = await prisma.order.create({
      data: {
        customerId,
        status: "pending",
        subTotal,
        tax,
        netTotal,
        orderItems: { create: orderItemsData },
      },
      include: {
        orderItems: true,
      },
    });

    // ⬇️ Update product stock
    const stockUpdates = items.map(item =>
      prisma.product.update({
        where: { id: item.productId },
        data: {
          stock: {
            decrement: item.quantity, // Decrease stock
          },
        },
      })
    );
    await Promise.all(stockUpdates);

    // Prepare invoice product summary
    const invoiceProductDetails = orderItemsData.map(item => {
      const product = productMap[item.productId];
      return `${product.name} x${item.quantity} @ ₹${product.price}`;
    });

    // Create Invoice
    const invoice = await prisma.invoice.create({
      data: {
        products: invoiceProductDetails,
        amount: netTotal,
        currency: "INR",
        isPaid: false,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        customer: { connect: { id: customer.id } },
        order: { connect: { id: order.id } },
        orderId: order.id,
      },
    });

  // create delivery Tracking
    await prisma.deliveryTracking.create({
      data: {
        orderId: order.id,
        status: 'pending',
      },
    })

    return NextResponse.json(
      { message: 'Order created successfully' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create order error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
