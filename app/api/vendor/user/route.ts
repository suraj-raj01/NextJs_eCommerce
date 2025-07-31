import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


/**
 * @swagger
 * tags:
 *   name: Users
 *   description: API for managing users
 */
/**
 * @swagger
* /api/vendor/user:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               roleId:
 *                 type: string
 *                 description: Optional role ID to associate with the user
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Failed to create user
 */


// Create a new user
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, roleId } = body;
    await prisma.user.create({
      data: {
        name,
        email,
        password,
        roles: roleId ? { connect: { id: roleId } } : undefined,
      },
    });
    return NextResponse.json({ "message": "User created successfully" }, { status: 201 });
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
* /api/vendor/user:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: A list of users
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
 *                   email:
 *                     type: string
 *                   password:
 *                     type: string
 *                   roles:
 *                     type: object
 *                     description: Associated role object
 *       500:
 *         description: Failed to fetch users
 */


// Get all users
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const skip = (page - 1) * limit;
    // const users = await prisma.user.findMany({
    //   include: {
    //     roles: true,
    //   },
    // });
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        include: { roles: true },
        skip,
        take: limit
      }),
      prisma.user.count(),
    ]);

    return NextResponse.json({data:users,  page,
      limit,
      totalItems: total,
      totalPages: Math.ceil(total / limit)}, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}