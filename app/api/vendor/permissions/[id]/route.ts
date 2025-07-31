
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface RouteContext {
  params: {
    id: string;
  };
}



/**
 * @swagger
* /api/vendor/permissions/{id}:
 *   patch:
 *     summary: Update a permission by ID
 *     tags: [Permissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Permission ID to update
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
 *                 example: manage_products
 *     responses:
 *       200:
 *         description: Permission updated successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Failed to update permission
 */



// ✏️ Edit a permission by ID
export async function PATCH(req: NextRequest, context: any) {
  try {
     const id =(context.params.id);
    const body = await req.json();
    const { name,description } = body;

    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return NextResponse.json(
        { error: 'Permission name is required and must be a non-empty string.' },
        { status: 400 }
      );
    }

    await prisma.permission.update({
      where: { id },
      data: { name,description},
    });

    return NextResponse.json({ message: 'Permission updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error updating permission:', error);
    return NextResponse.json(
      { error: 'Failed to update permission.' },
      { status: 500 }
    );
  }
}



/**
 * @swagger
* /api/vendor/permissions/{id}:
 *   delete:
 *     summary: Delete a permission by ID
 *     tags: [Permissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Permission ID to delete
 *     responses:
 *       200:
 *         description: Permission deleted successfully
 *       500:
 *         description: Failed to delete permission
 */

// ❌ Delete a permission by ID
export async function DELETE(req: NextRequest, context: any) {
  try {
      const id =(context.params.id);

    await prisma.permission.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Permission deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting permission:', error);
    return NextResponse.json(
      { error: 'Failed to delete permission.' },
      { status: 500 }
    );
  }
}



/**
 * @swagger
* /api/vendor/permissions/{id}:
 *   get:
 *     summary: Search permissions by ID or name
 *     tags: [Permissions]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Permission ID or name (partial match)
 *     responses:
 *       200:
 *         description: Matching permissions found
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
 *       404:
 *         description: Permission not found
 *       500:
 *         description: Failed to search permission
 */
//  Search permissions by name (ID in path used as search term)
export async function GET(req: NextRequest, context: any) {
  try {
      const name =(context.params.id);

    const permissions = await prisma.permission.findMany({
      where: {
        OR: [
          { name: { contains: name, mode: 'insensitive' } },
          { id: name },
        ],
      },
    });

    if (!permissions || permissions.length === 0) {
      return NextResponse.json(
        { error: 'Permission not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json(permissions, { status: 200 });
  } catch (error) {
    console.error('Error searching permission:', error);
    return NextResponse.json(
      { error: 'Failed to search permission.' },
      { status: 500 }
    );
  }
}
