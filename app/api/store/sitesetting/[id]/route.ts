import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * @swagger
 * /api/store/sitesetting/{id}:
 *   delete:
 *     summary: Delete sitesetting by ID
 *     tags: [Sitesetting]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sitesetting ID
 *     responses:
 *       200:
 *         description: Sitesetting deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Failed to delete sitesetting
 */
export async function DELETE(req: NextRequest, context: any) {
  try {
    const id = context.params.id;
    await prisma.sitesetting.delete({ where: { id } });

    return NextResponse.json({ message: "Sitesetting deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting sitesetting:", error);
    return NextResponse.json(
      { error: "Failed to delete sitesetting." },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/store/sitesetting/{id}:
 *   get:
 *     summary: Search sitesetting by ID or title
 *     tags: [Sitesetting]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sitesetting ID or partial title
 *     responses:
 *       200:
 *         description: Matching sitesettings
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   logo:
 *                     type: string
 *                   title:
 *                     type: string
 *                   subtitle:
 *                     type: string
 *                   heroimg:
 *                     type: string
 *                   herotitle:
 *                     type: string
 *                   visibility:
 *                     type: string
 *       404:
 *         description: Sitesetting not found
 *       500:
 *         description: Failed to search sitesetting
 */


/**
 * @swagger
 * /api/store/sitesetting/{id}:
 *   patch:
 *     summary: Update sitesetting by ID
 *     tags: [Sitesetting]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Sitesetting ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               logo:
 *                 type: string
 *               title:
 *                 type: string
 *               subtitle:
 *                 type: string
 *               heroimg:
 *                 type: string
 *               herotitle:
 *                 type: string
 *               visibility:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sitesetting updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Failed to update sitesetting
 */


export async function PATCH(req: NextRequest, context: any) {
  try {
    const id = context.params.id; // Assuming route is like /api/sitesetting/[id]
    const body = await req.json();

    const requiredFields = [
      'companylogo',
      'menutitles',
      'checkmenutitle',
      'addtocarticon',
      'checkaddtocart',
      'favouriteicon',
      'checkfavourite',
      'loginicon',
      'checkloginicon',
      'checkmenu',
      'heroimg',
      'checkheroimg',
      'herotitle',
      'checkherotitle',
      'herodescription',
      'checkherodesc',
      'heroimages',
      'checkheroimages',
      'explorebtn',
      'explorebtnlink',
      'checkexplorebtn',
      'checkherosection',
      'companypartnertitle',
      'checkcompanypartnertitle',
      'companypartners',
      'checkcompanypartner',
      'featuretitle',
      'checkfeaturetitle',
      'featuredescription',
      'checkfeaturedesc',
      'checkcompanyfeature',
      'quicklinktitle',
      'quicklinks',
      'addresstitle',
      'address',
      'contact',
      'email',
      'checkaddress',
      'sociallinks',
      'checksociallink',
      'copyright',
      'maintenance'
    ];

    const validationErrors: { field: string; message: string }[] = [];

    for (const field of requiredFields) {
      const value = body[field];

      const isJsonType = ['menutitles', 'heroimages', 'companypartners', 'quicklinks', 'sociallinks'].includes(field);

      if (
        value === undefined ||
        value === null ||
        (typeof value === 'string' && value.trim() === '') ||
        (isJsonType && (Array.isArray(value) ? value.length === 0 : Object.keys(value || {}).length === 0))
      ) {
        validationErrors.push({ field, message: `${field} is required and cannot be empty` });
      }
    }

    if (validationErrors.length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', issues: validationErrors },
        { status: 400 }
      );
    }

    const updatedSetting = await prisma.sitesetting.update({
      where: { id },
      data: {
        ...body,
        menutitles: body.menutitles,
        heroimages: body.heroimages,
        companypartners: body.companypartners,
        quicklinks: body.quicklinks,
        sociallinks: body.sociallinks,
      },
    });

    return NextResponse.json(
      { message: "Site setting updated successfully", data: updatedSetting },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error updating site setting:', error);
    return NextResponse.json({ error: 'Failed to update setting' }, { status: 500 });
  }
}




// search sitesetting
export async function POST(req: NextRequest, context: any) {
  const id = context.params.id;

  if (!id) {
    return NextResponse.json({ error: "sitesetting ID is required" }, { status: 400 });
  }

  try {
    const data = await prisma.sitesetting.findMany({
      where: {
        id: id,
        OR: [
          { id: { contains: id } }
        ]
      }
    });

    return NextResponse.json({ data: data });
  } catch (error) {
    console.error("Error deleting sitesetting:", error);
    return NextResponse.json({ error: "Failed to delete sitesetting" }, { status: 500 });
  }
}