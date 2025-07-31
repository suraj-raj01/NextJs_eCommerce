import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


/**
 * @swagger
 * tags:
 *   name: Permissions
 *   description: API for managing permissions
 */

/**
 * @swagger
* /api/vendor/permissions:
 *   get:
 *     summary: Retrieve all permissions
 *     tags: [Permissions]
 *     responses:
 *       200:
 *         description: A list of permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 permissions:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *       500:
 *         description: Failed to retrieve permissions
 */




// Create a new permission
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, description } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Permission name is required and must be a non-empty string.' },
        { status: 400 }
      );
    }

    const permission = await prisma.permission.create({
      data: { 
        name: name, 
        description:description 
      }
    });

    return NextResponse.json(
      { message: 'Permission created successfully', permission },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating permission:', error);
    return NextResponse.json(
      { error: 'Failed to create permission.' },
      { status: 500 }
    );
  }
}



/**
 * @swagger
* /api/vendor/permissions:
 *   post:
 *     summary: Create a new permission
 *     tags: [Permissions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: manage_users
 *     responses:
 *       201:
 *         description: Permission created successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Failed to create permission
 */

// Get all permissions
export async function GET(_req: NextRequest) {
  try {
    const permissions = await prisma.permission.findMany();
    return NextResponse.json({ permissions }, { status: 200 });
  } catch (error) {
    console.error('Error fetching permissions:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve permissions.' },
      { status: 500 }
    );
  }
}
