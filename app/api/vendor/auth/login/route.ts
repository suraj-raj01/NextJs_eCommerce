import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret'; // keep safe


/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: API for Login
 */

/**
 * @swagger
* /api/vendor/auth/login:
 *   post:
 *     summary: Login as a user or customer
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: yourpassword
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Login successful
 *                 token:
 *                   type: string
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     role:
 *                       type: string
 *                       enum: [user, customer]
 *       400:
 *         description: Missing email or password
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Email and password are required.
 *       401:
 *         description: Invalid credentials
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Invalid credentials.
 *       500:
 *         description: Internal server error
 */

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password } = body;
    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required.' }, { status: 400 });
    }

    // Try User table first
    const user = await prisma.user.findUnique({ 
      where: { 
        email:email},
        include:{
          
        }
      });
    const customer = !user ? await prisma.customer.findUnique({ where: { email:email } }) : null;
    console.log(user,customer,"User and customer")
    const account = user || customer;
    // get role by email
    console.log(user,"user details")
    const role = user ? 'user' : 'customer';

    if (!account || !account.password) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    // Compare plain text passwords 
    if (account.password !== password) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    const token = jwt.sign(
      {
        id: account.id,
        email: account.email,
        role,
      },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      message: 'Login successful',
      token,
      user: {
        id: account.id,
        email: account.email,
        role,
      },
    });
  } catch (error) {
    console.error('[LOGIN_ERROR]', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}
