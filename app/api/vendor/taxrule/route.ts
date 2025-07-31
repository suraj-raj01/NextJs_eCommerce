import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();


/**
 * @swagger
 * tags:
 *   name: TaxRules
 *   description: API for managing tax rules
 */

/**
 * @swagger
* /api/vendor/taxrules:
 *   post:
 *     summary: Create a new tax rule
 *     tags: [TaxRules]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - country
 *               - state
 *               - type
 *               - rate
 *             properties:
 *               country:
 *                 type: string
 *               state:
 *                 type: string
 *               type:
 *                 type: string
 *                 description: Type of tax (e.g., VAT, GST, etc.)
 *               rate:
 *                 type: number
 *                 format: float
 *     responses:
 *       201:
 *         description: Tax rule created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Failed to create tax rule
 */


// Create a tax rule
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { country, state, type, rate } = body;
    console.log(body);
  await prisma.taxRule.create({
      data: {
    country , state , type , rate:rate ? parseFloat(rate) : 0      
      }
    });

    return NextResponse.json({"message": "taxRule created successfully" }, { status: 201 });
  } catch (error) {
    console.error('Error creating taxRule:', error);
    return NextResponse.json(
      { error: 'Failed to create taxRule.' },
      { status: 500 }
    );
  }
}



/**
 * @swagger
* /api/vendor/taxrules:
 *   get:
 *     summary: Get all tax rules with pagination
 *     tags: [TaxRules]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: A list of tax rules
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
 *                       id:
 *                         type: string
 *                       country:
 *                         type: string
 *                       state:
 *                         type: string
 *                       type:
 *                         type: string
 *                       rate:
 *                         type: number
 *                 meta:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     totalPages:
 *                       type: integer
 *       500:
 *         description: Failed to retrieve tax rules
 */



// Get all taxrules

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const page = parseInt(searchParams.get('page') ?? '1', 10);
    const limit = parseInt(searchParams.get('limit') ?? '10', 10);
    const skip = (page - 1) * limit;

    const totalCount = await prisma.taxRule.count();

    const taxrules = await prisma.taxRule.findMany({
      skip,
      take: limit,
    });

    return NextResponse.json({
      data: taxrules,
      meta: {
        total: totalCount,
        page,
        limit,
        totalPages: Math.ceil(totalCount / limit),
      },
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching taxrules:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve taxrules.' },
      { status: 500 }
    );
  }
}