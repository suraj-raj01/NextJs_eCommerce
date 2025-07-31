import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * @swagger
* /api/vendor/taxrules/{id}:
 *   delete:
 *     summary: Delete a tax rule by ID
 *     tags: [TaxRules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tax rule ID
 *     responses:
 *       200:
 *         description: Tax rule deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Failed to delete tax rule
 */


// Delete a permission by ID
export async function DELETE(req: NextRequest,context: any) {
  try {
    const id = (context.params.id);
    const updatedtaxRule = await prisma.taxRule.delete({
      where: { id },
    });

    return NextResponse.json({"message": "taxRule deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error('Error deleting  taxRule:', error);
    return NextResponse.json(
      { error: 'Failed to delete taxRule.' },
      { status: 500 }
    );
  }
}


/**
 * @swagger
* /api/vendor/taxrules/{id}:
 *   get:
 *     summary: Search tax rule by ID, country, state, or type
 *     tags: [TaxRules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Search keyword or ID
 *     responses:
 *       200:
 *         description: Matching tax rules
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   country:
 *                     type: string
 *                   state:
 *                     type: string
 *                   type:
 *                     type: string
 *                   rate:
 *                     type: number
 *       404:
 *         description: Tax rule not found
 *       500:
 *         description: Failed to search tax rule
 */


//search taxRule
export async function GET(req: NextRequest,context: any) {
  try {
    const name =(context.params.id);

    const taxRules = await prisma.taxRule.findMany({
      where: {
        OR: [
          { country: { contains: name } },
          { state: { contains: name } },
          { type: { contains: name } },
          { id: name },
        ],
      }
    });

    if (!taxRules || taxRules.length === 0) {
      return NextResponse.json(
        { error: 'taxRule not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json(taxRules, { status: 200 });
  } catch (error) {
    console.error('Error searching taxRule:', error);
    return NextResponse.json(
      { error: 'Failed to search taxRule.' },
      { status: 500 }
    );
  }
}


/**
 * @swagger
* /api/vendor/taxrule/{id}:
 *   patch:
 *     summary: Update a tax rule by ID
 *     tags: [TaxRules]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Tax rule ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               country:
 *                 type: string
 *               state:
 *                 type: string
 *               type:
 *                 type: string
 *               rate:
 *                 type: number
 *     responses:
 *       200:
 *         description: Tax rule updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 country:
 *                   type: string
 *                 state:
 *                   type: string
 *                 type:
 *                   type: string
 *                 rate:
 *                   type: number
 *       500:
 *         description: Failed to update tax rule
 */


// Edit a taxRule

export async function PATCH(
  req: NextRequest,
 context: any
) {
  try {
    const taxRuleId = (context.params.id);
    const body = await req.json();
    const { country, state, type, rate } = body;
    const updatedtaxRule = await prisma.taxRule.update({
      where: { id: taxRuleId },
      data: {
      country, state, type, rate:rate ? parseFloat(rate) : 0
      }
    });

    return NextResponse.json(updatedtaxRule, { status: 200 });
  } catch (error) {
    console.error("Error updating taxRule:", error);
    return NextResponse.json(
      { error: "Failed to update taxRule." },
      { status: 500 }
    );
  }
}