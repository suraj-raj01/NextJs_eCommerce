import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  const plans = await prisma.plans.findMany();
  return NextResponse.json(plans);
}


export async function POST(req: Request) {
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


  const requiredBooleanFields = [
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

  const requiredArrayFields = [
    { value: features, name: 'Features' }
  ];

  const validationErrors: string[] = [];

  // ✅ Validate booleans
  requiredBooleanFields.forEach(({ value, name }) => {
    if (typeof value !== 'boolean') {
      validationErrors.push(`${name} must be a boolean`);
    }
  });

  // ✅ Validate array fields
  requiredArrayFields.forEach(({ value, name }) => {
    if (!Array.isArray(value)) {
      validationErrors.push(`${name} must be an array`);
    } else if (value.length === 0) {
      validationErrors.push(`${name} array cannot be empty`);
    } else {
      value.forEach((item: any, index: number) => {
        if (typeof item !== 'string' || item.trim() === '') {
          validationErrors.push(`${name} at index ${index} must be a non-empty string`);
        }
      });
    }
  });

  // ✅ Validate numbers
  if (price !== undefined && isNaN(Number(price))) {
    validationErrors.push('Price must be a valid number');
  }
  if (plantype !== undefined && isNaN(parseInt(plantype))) {
    validationErrors.push('Plantype must be a valid integer');
  }

  // ✅ Validate strings (optional strings allowed to be empty or undefined)
  const optionalStringFields = [
    { value: logo, name: 'Logo' },
    { value: title, name: 'Title' },
    { value: subtitle, name: 'Subtitle' },
    { value: description, name: 'Description' },
    { value: button, name: 'Button' },
    { value: bilingcycle, name: 'Bilingcycle' },
  ];

  optionalStringFields.forEach(({ value, name }) => {
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
    const newPlan = await prisma.plans.create({
      data: {
        logo: logo ?? null,
        checklogo,
        title: title ?? null,
        checktitle,
        subtitle: subtitle ?? null,
        checksubtitle,
        price: Number(price),
        checkprice,
        plantype: Number(plantype),
        bilingcycle: bilingcycle ?? null,
        checkduration,
        description: description ?? null,
        checkdescription,
        features,
        checkfeatures,
        visibility,
        button: button ?? null,
        checkbutton
      }
    });

    return NextResponse.json({
      data: newPlan,
      message: 'Plan created successfully',
    });
  } catch (error) {
    console.error('Error creating plan:', error);
    return NextResponse.json({ error: 'Failed to create plan' }, { status: 500 });
  }
}

