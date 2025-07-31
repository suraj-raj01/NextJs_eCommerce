import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();


/**
 * @swagger
* /api/vendor/invoice/{id}:
 *   get:
 *     summary: Get a single invoice by ID, orderId, customerId, or customer name
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Invoice ID, Order ID, Customer ID, or partial Customer Name
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Invoice data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id: { type: string }
 *                 isPaid: { type: boolean }
 *                 createdAt: { type: string, format: date-time }
 *                 updatedAt: { type: string, format: date-time }
 *                 customer:
 *                   type: object
 *                   properties:
 *                     id: { type: string }
 *                     name: { type: string }
 *                     email: { type: string }
 *                     phone: { type: string }
 *                     address: { type: string }
 *                     state: { type: string }
 *                     city: { type: string }
 *                 order:
 *                   type: object
 *                   description: Associated order data
 *       404:
 *         description: Invoice not found
 *       500:
 *         description: Internal server error
 */



// GET One invoice by ID/orderId/name
export async function GET(req: NextRequest,context: any) {
  try {
      const name =(context.params.id);
    const invoiceId = name;

    const invoice = await prisma.invoice.findFirst({
      where: {
        OR: [
          { id: invoiceId },
          { orderId: invoiceId },
          { customerId: invoiceId },
          {
            customer: {
              OR:[
                {name:{
                contains: invoiceId,
                mode: 'insensitive' }
              }
              ]

            },
          },
        ],
      },
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
        order: true,
      },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    }

    return NextResponse.json(invoice);
  } catch (error) {
    console.error('Get invoice by ID error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}


/**
 * @swagger
* /api/vendor/invoice/{id}:
 *   patch:
 *     summary: Update invoice payment status
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Invoice ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               isPaid:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Invoice updated
 *       500:
 *         description: Internal server error
 */

// DELETE invoice
export async function DELETE(req: NextRequest,context: any) {
  try {
      const name =(context.params.id);
    const invoiceId = name;

    const updatedInvoice = await prisma.invoice.delete({
        where: { id: invoiceId },
        });
    return NextResponse.json({ message: 'invoice deleted successfully' });
  } catch (error) {
    console.error('Delete invoice error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}



/**
 * @swagger
* /api/vendor/invoice/{id}:
 *   delete:
 *     summary: Delete an invoice by ID
 *     tags: [Invoices]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Invoice ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Invoice deleted successfully
 *       500:
 *         description: Internal server error
 */


// UPDATE invoice
export async function PATCH(req: NextRequest,context: any) {
  try {
      const name =(context.params.id);
    const invoiceId = name;
    const { isPaid } = await req.json();

    const updatedInvoice = await prisma.invoice.update({
      where: { id: invoiceId },
      data: { isPaid:Boolean(isPaid) || false },
    });

    return NextResponse.json({ message: 'Invoice updated' });
  } catch (error) {
    console.error('Update invoice error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}       