import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function PATCH(req: NextRequest, context: any) {
  const id = context.params.id;

  const body = await req.json();

  let {
    logo,
    checklogo,
    title,
    checktitle,
    subtitle,
    checksubtitle,
    price,
    checkprice,
    checkduration,
    description,
    checkdescription,
    features,
    checkfeatures,
    visibility,
    button,
    checkbutton,
    plantype,
    bilingcycle
  } = body;

  const validationErrors: string[] = [];

  // ✅ Validate boolean fields
  const booleanFields = [
    { value: checklogo, name: 'Check Logo' },
    { value: checktitle, name: 'Check Title' },
    { value: checksubtitle, name: 'Check Subtitle' },
    { value: checkprice, name: 'Check Price' },
    { value: checkduration, name: 'Check Duration' },
    { value: checkdescription, name: 'Check Description' },
    { value: checkfeatures, name: 'Check Features' },
    { value: visibility, name: 'Visibility' },
    { value: checkbutton, name: 'Check Button' },
  ];

  booleanFields.forEach(({ value, name }) => {
    if (value !== undefined && typeof value !== 'boolean') {
      validationErrors.push(`${name} must be a boolean`);
    }
  });

  // ✅ Validate features array
  if (features !== undefined) {
    if (!Array.isArray(features)) {
      validationErrors.push('Features must be an array');
    } else if (features.length === 0) {
      validationErrors.push('Features array cannot be empty');
    } else {
      features.forEach((item: any, index: number) => {
        if (typeof item !== 'string' || item.trim() === '') {
          validationErrors.push(`Feature at index ${index} must be a non-empty string`);
        }
      });
    }
  }

  // ✅ Validate number fields
  if (price !== undefined && isNaN(Number(price))) {
    validationErrors.push('Price must be a valid number');
  }

  if (plantype !== undefined && isNaN(parseInt(plantype))) {
    validationErrors.push('Plantype must be a valid integer');
  }

  // ✅ Validate optional strings
  const optionalStrings = [
    { value: logo, name: 'Logo' },
    { value: title, name: 'Title' },
    { value: subtitle, name: 'Subtitle' },
    { value: description, name: 'Description' },
    { value: button, name: 'Button' },
    { value: bilingcycle, name: 'Bilingcycle' },
  ];

  optionalStrings.forEach(({ value, name }) => {
    if (value !== undefined && typeof value !== 'string') {
      validationErrors.push(`${name} must be a string`);
    }
  });

  if (validationErrors.length > 0) {
    return NextResponse.json({
      error: 'Validation failed',
      validationErrors
    }, { status: 400 });
  }

  try {
    const updatedPlan = await prisma.plans.update({
      where: { id },
      data: {
        ...(logo !== undefined && { logo }),
        ...(checklogo !== undefined && { checklogo }),
        ...(title !== undefined && { title }),
        ...(checktitle !== undefined && { checktitle }),
        ...(subtitle !== undefined && { subtitle }),
        ...(checksubtitle !== undefined && { checksubtitle }),
        ...(price !== undefined && { price: Number(price) }),
        ...(checkprice !== undefined && { checkprice }),
        ...(plantype !== undefined && { plantype: parseInt(plantype) }),
        ...(bilingcycle !== undefined && { bilingcycle }),
        ...(checkduration !== undefined && { checkduration }),
        ...(description !== undefined && { description }),
        ...(checkdescription !== undefined && { checkdescription }),
        ...(features !== undefined && { features }),
        ...(checkfeatures !== undefined && { checkfeatures }),
        ...(visibility !== undefined && { visibility }),
        ...(button !== undefined && { button }),
        ...(checkbutton !== undefined && { checkbutton }),
      }
    });

    return NextResponse.json({
      data: updatedPlan,
      message: 'Plan updated successfully',
    });
  } catch (error) {
    console.error('Error updating plan:', error);
    return NextResponse.json({ error: 'Failed to update plan' }, { status: 500 });
  }
}



// delete plans
export async function DELETE(req: NextRequest, context: any) {
  const id = context.params.id;

  if (!id) {
    return NextResponse.json({ error: "Plan ID is required" }, { status: 400 });
  }

  try {
    await prisma.plans.delete({ where: { id } });

    return NextResponse.json({ message: "Plan deleted successfully" });
  } catch (error) {
    console.error("Error deleting plan:", error);
    return NextResponse.json({ error: "Failed to delete plan" }, { status: 500 });
  }
}


// search plans

export async function POST(req: NextRequest, context: any) {
  const id = context.params.id;

  if (!id) {
    return NextResponse.json({ error: "Plan ID is required" }, { status: 400 });
  }

  try {
    const data = await prisma.plans.findMany({
      where: {
        OR: [
          { title: { contains: id } },
          { subtitle: { contains: id } },
          { id: { contains: id } }
        ]
      }
    });

    return NextResponse.json({ data: data });
  } catch (error) {
    console.error("Error deleting plan:", error);
    return NextResponse.json({ error: "Failed to delete plan" }, { status: 500 });
  }
}