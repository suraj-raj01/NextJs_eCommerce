import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * @swagger
* /api/vendor/user/{id}:
 *   delete:
 *     summary: Delete user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Failed to delete user
 */


// Delete a permission by ID
export async function DELETE(req: NextRequest,context: any) {
  try {
    const id = (context.params.id);
    const updateduser = await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({"message": "user deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json(
      { error: 'Failed to delete user.' },
      { status: 500 }
    );
  }
}


/**
 * @swagger
* /api/vendor/user/{id}:
 *   get:
 *     summary: Search user by ID or name
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID or name (partial match supported)
 *     responses:
 *       200:
 *         description: Matching users
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
 *                   roles:
 *                     type: object
 *       404:
 *         description: User not found
 *       500:
 *         description: Failed to search user
 */

// Search User
export async function GET(req: NextRequest,context: any) {
  try {
    const name = (context.params.id);

    const user = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: name } },
          {email: { contains: name } },
          { id: name },
        ],
      },
      include: {
        roles: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'user not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Error searching user:', error);
    return NextResponse.json(
      { error: 'Failed to search user.' },
      { status: 500 }
    );
  }
}



/**
 * @swagger
* /api/vendor/user/{id}:
 *   patch:
 *     summary: Update user by ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               roleId:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Failed to update user
 */

// Update a user
export async function PATCH(req: NextRequest,context: any) {
  try {
    const id = (context.params.id);
    const body = await req.json();
    console.log(body);
    const { name, email, password, roleId } = body;
    const updateduser = await prisma.user.update({
      where: { id },
      data: { 
        name ,
        email,
        password,
        roles: {
          connect: { id: roleId },
        },
      },
    });

    return NextResponse.json({"message": "user updated successfully" }, { status: 200 });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Failed to update user.' },
      { status: 500 }
    );
  }
} 
  