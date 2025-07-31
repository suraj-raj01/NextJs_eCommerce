import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


/**
 * @swagger
 * tags:
 *   name: Roles
 *   description: API for managing roles
 */

/**
 * @swagger
* /api/vendor/role:
 *   post:
 *     summary: Create a new role and assign permissions
 *     tags: [Roles]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - permissionIds
 *             properties:
 *               name:
 *                 type: string
 *               permissionIds:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       201:
 *         description: Role created successfully
 *       500:
 *         description: Failed to create role
 */

// Create a new permission
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, permissionIds } = body;

    const role = await prisma.role.create({
      data: {
        name,
        permissions: {
          connect: permissionIds.map((id: string) => ({ id }))||"",
        },
      },
      include: {
        permissions: true,
      },
    });

    return NextResponse.json({ message: "role created successfully" }, { status: 201 });
  } catch (error) {
    console.error('Error creating role:', error);
    return NextResponse.json(
      { error: 'Failed to create role.' },
      { status: 500 }
    );
  }
}



/**
 * @swagger
* /api/vendor/role:
 *   get:
 *     summary: Get all roles with their permissions
 *     tags: [Roles]
 *     responses:
 *       200:
 *         description: List of roles
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 roles:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       permissions:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             id:
 *                               type: string
 *                             name:
 *                               type: string
 *       500:
 *         description: Failed to retrieve roles
 */


// Get all roles
export async function GET(_req: NextRequest) {
  try {
    const roles = await prisma.role.findMany({
      include: {
        permissions: true,
      },
    });
    return NextResponse.json({ roles }, { status: 200 });
  } catch (error) {
    console.error('Error fetching roles:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve roles.' },
      { status: 500 }
    );
  }
}