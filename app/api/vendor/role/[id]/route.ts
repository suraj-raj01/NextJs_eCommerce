import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * @swagger
* /api/vendor/role/{id}:
 *   delete:
 *     summary: Delete a role by ID
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Role ID to delete
 *     responses:
 *       200:
 *         description: Role deleted successfully
 *       500:
 *         description: Failed to delete role
 */




// Delete a permission by ID
export async function DELETE(req: NextRequest,context: any) {
  try {
    const id = (context.params.id);
    const updatedRole = await prisma.role.delete({
      where: { id },
    });

    return NextResponse.json({"message": "role deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error('Error deleting  role:', error);
    return NextResponse.json(
      { error: 'Failed to delete role.' },
      { status: 500 }
    );
  }
}




/**
 * @swagger
* /api/vendor/role/{id}:
 *   get:
 *     summary: Search a role by ID or name
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Role ID or name to search
 *     responses:
 *       200:
 *         description: Role(s) found
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
 *                   permissions:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         name:
 *                           type: string
 *       404:
 *         description: Role not found
 *       500:
 *         description: Failed to search role
 */




//search role
export async function GET(req: NextRequest,context: any) {
  try {
    const name = (context.params.id);

    const roles = await prisma.role.findMany({
      where: {
        OR: [
          { name: { contains: name } },
          { id: name },
        ],
      },
      include: {
        permissions: true,
      },
    });

    if (!roles || roles.length === 0) {
      return NextResponse.json(
        { error: 'role not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json(roles, { status: 200 });
  } catch (error) {
    console.error('Error searching role:', error);
    return NextResponse.json(
      { error: 'Failed to search role.' },
      { status: 500 }
    );
  }
}


/**
 * @swagger
* /api/vendor/role/{id}:
 *   patch:
 *     summary: Update a role's name and permissions
 *     tags: [Roles]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Role ID to update
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
 *       200:
 *         description: Role updated successfully
 *       400:
 *         description: Invalid input
 *       500:
 *         description: Failed to update role
 */


// Edit a role

export async function PATCH(
  req: NextRequest,
 context: any
) {
  try {
    const roleId =(context.params.id);
    const body = await req.json();
    const { name, permissionIds } = body;


    // Validate permissionIds
    if (!Array.isArray(permissionIds)) {
      return NextResponse.json(
        { error: "permissionIds must be an array of strings." },
        { status: 400 }
      );
    }

    const invalidId = permissionIds.find(
      (id: unknown) => typeof id !== "string" || id.trim().length === 0
    );
    if (invalidId !== undefined) {
      return NextResponse.json(
        {
          error:
            "All permissionIds must be non-empty strings. Invalid entry: " +
            JSON.stringify(invalidId),
        },
        { status: 400 }
      );
    }

    // Update role and replace permissions using `set`
    const updatedRole = await prisma.role.update({
      where: { id: roleId },
      data: {
        name: name.trim(),
        permissions: {
          set: permissionIds.map((pid: string) => ({ id: pid.trim() })),
        },
      },
      include: {
        permissions: true,
      },
    });

    return NextResponse.json(updatedRole, { status: 200 });
  } catch (error) {
    console.error("Error updating role:", error);
    return NextResponse.json(
      { error: "Failed to update role." },
      { status: 500 }
    );
  }
}