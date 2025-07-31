
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const requiredFields = [
      'companylogo', 'menutitles', 'checkmenutitle', 'addtocarticon', 'checkaddtocart',
      'favouriteicon', 'checkfavourite', 'loginicon', 'checkloginicon', 'checkmenu',
      'heroimg', 'checkheroimg', 'herotitle', 'checkherotitle', 'herodescription', 'checkherodesc',
      'heroimages', 'checkheroimages', 'explorebtn', 'explorebtnlink', 'checkexplorebtn',
      'checkherosection', 'companypartnertitle', 'checkcompanypartnertitle', 'companypartners',
      'checkcompanypartner', 'featuretitle', 'checkfeaturetitle', 'featuredescription',
      'checkfeaturedesc', 'checkcompanyfeature', 'quicklinktitle', 'quicklinks',
      'addresstitle', 'address', 'contact', 'email', 'checkaddress', 'sociallinks',
      'checksociallink', 'copyright', 'maintenance'
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
      return NextResponse.json({ error: 'Validation failed', issues: validationErrors }, { status: 400 });
    }

    const existing = await prisma.sitesetting.findMany();
    if (existing.length > 0) {
      return NextResponse.json({ error: "Only one sitesetting can be created!" }, { status: 400 });
    }

    const setting = await prisma.sitesetting.create({
      data: {
        ...body,
      },
    });

    return NextResponse.json({ message: "Site created successfully", data: setting }, { status: 201 });

  } catch (error) {
    console.error("Error creating SiteSetting:", error);
    return NextResponse.json({ error: 'Failed to create setting' }, { status: 500 });
  }
}



export async function GET(req: NextRequest) {
  try {
    const sitesettings = await prisma.sitesetting.findMany();
    if (sitesettings.length == 0) {
      return NextResponse.json({ message: "Empty Data" })
    }
    return NextResponse.json(sitesettings, { status: 200 });
  } catch (error) {
    console.error("Error fetching sitesettings:", error);
    return NextResponse.json(
      { error: "Failed to fetch sitesettings" },
      { status: 500 }
    );
  }
}
