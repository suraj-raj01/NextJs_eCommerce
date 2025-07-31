import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { stat } from 'fs';

const prisma = new PrismaClient();


/**
 * @swagger
 * tags:
 *   name: Customers
 *   description: API for managing customers
 */

/**
 * @swagger
* /api/vendor/customer:
 *   post:
 *     summary: Register a new customer
 *     tags: [Customers]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *               - address
 *               - state
 *               - city
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john@example.com"
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               address:
 *                 type: string
 *                 example: "123 Street"
 *               state:
 *                 type: string
 *                 example: "Madhya Pradesh"
 *               city:
 *                 type: string
 *                 example: "Bhopal"
 *               password:
 *                 type: string
 *                 example: "securepass123"
 *     responses:
 *       201:
 *         description: Customer created successfully
 *       400:
 *         description: Validation error or email already exists
 *       500:
 *         description: Server error
 */


// Create a new customer
export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        //check all fields are present 
        if (!body.name || !body.email || !body.phone || !body.address || !body.state || !body.city || !body.password) {
            return NextResponse.json(
                { error: 'All fields are required' },
                { status: 400 }
            );
        }
        const { name, email, phone, address, state, city, password } = body;
        // Check if the email already exists
        const existingCustomer = await prisma.customer.findUnique({
            where: { email: email },
        });
        if (existingCustomer) {
            return NextResponse.json(
                { error: 'Email already exists' }, { status: 400 })
        }
        //check phone of customers
        if (phone && phone.length < 10) {
            return NextResponse.json(
                { error: 'Phone number must be at least 10 digits' },
                { status: 400 }
            )
        }

       //check password of customers
        if (body.password && body.password.length < 6) {
            return NextResponse.json(
                { error: 'Password must be at least 6 characters' },
                { status: 400 }
            );
        }

        // Create the customer
        await prisma.customer.create({
            data: {
                name, email, phone, address, state, city, password
            },
        });
        return NextResponse.json({ "message": "User register successfully" }, { status: 201 });
    } catch (error) {
        console.error('Error creating user:', error);
        return NextResponse.json(
            { error: 'Failed to create user' },
            { status: 500 }
        );
    }
}



/**
 * @swagger
* /api/vendor/customer:
 *   get:
 *     summary: Get a paginated list of customers
 *     tags: [Customers]
 *     parameters:
 *       - in: query
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of customers with pagination
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
 *                       id: { type: string }
 *                       name: { type: string }
 *                       email: { type: string }
 *                       phone: { type: string }
 *                       address: { type: string }
 *                       state: { type: string }
 *                       city: { type: string }
 *                 page: { type: integer }
 *                 limit: { type: integer }
 *                 totalPages: { type: integer }
 *                 totalItems: { type: integer }
 *       500:
 *         description: Failed to fetch customers
 */


// Get all customers
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;

    const customers = await prisma.customer.findMany({
      skip,
      take: limit,
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

    const total = await prisma.customer.count();

    return NextResponse.json({
      data: customers,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching customer:', error);
    return NextResponse.json(
      { error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}