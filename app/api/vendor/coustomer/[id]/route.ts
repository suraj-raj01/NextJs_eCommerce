import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * @swagger
* /api/vendor/customer/{id}:
 *   get:
 *     summary: Search customer by ID or name
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Customer ID or name to search
 *     responses:
 *       200:
 *         description: Customer(s) found
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id: { type: string }
 *                   name: { type: string }
 *                   email: { type: string }
 *                   phone: { type: string }
 *                   address: { type: string }
 *                   state: { type: string }
 *                   city: { type: string }
 *       404:
 *         description: Customer not found
 *       500:
 *         description: Server error
 */


//Edit a customer by ID
export async function PATCH(req: NextRequest,context: any) {
  try {
      const id =(context.params.id);
    const body = await req.json();
    const { name, email, phone, address, state, city } = body;

   const existingCustomer = await prisma.customer.findUnique({
      where: { id },
    });

    const updatedcustomer = await prisma.customer.update({
      where: { id },
      data: { name, email, phone, address, state, city,password: existingCustomer?.password },
    });

    return NextResponse.json({"message": "customer updated successfully" }, { status: 200 });
  } catch (error) {
    console.error('Error updating customer:', error);
    return NextResponse.json(
      { error: 'Failed to update customer.' },
      { status: 500 }
    );
  }
}


/**
 * @swagger
* /api/vendor/customer/{id}:
 *   patch:
 *     summary: Update a customer by ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Customer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: { type: string }
 *               email: { type: string }
 *               phone: { type: string }
 *               address: { type: string }
 *               state: { type: string }
 *               city: { type: string }
 *     responses:
 *       200:
 *         description: Customer updated successfully
 *       500:
 *         description: Failed to update customer
 */


// Delete a customer by ID
export async function DELETE(req: NextRequest,context: any) {
  try {
      const id =(context.params.id);
    const updatedcustomer = await prisma.customer.delete({
      where: { id },
    });

    return NextResponse.json({"message": "customer deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error('Error deleting customer:', error);
    return NextResponse.json(
      { error: 'Failed to delete customer.' },
      { status: 500 }
    );
  }
}


/**
 * @swagger
* /api/vendor/customer/{id}:
 *   delete:
 *     summary: Delete a customer by ID
 *     tags: [Customers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Customer deleted successfully
 *       500:
 *         description: Failed to delete customer
 */



//search customers by name
export async function GET(req: NextRequest,context: any) {
  try {
    const name =(context.params.id);

    const customer = await prisma.customer.findMany({
      where: {
             OR: [
          { name: { contains: name } },
          { id: name },
        ],
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        state: true,
        city: true,
      },
    });

    if (!customer) {
      return NextResponse.json(
        { error: 'customer not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json(customer, { status: 200 });
  } catch (error) {
    console.error('Error searching customer:', error);
    return NextResponse.json(
      { error: 'Failed to  search customer.' },
      { status: 500 }
    );
  }
}
