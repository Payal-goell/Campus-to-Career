import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const resourceSchema = z.object({
  title: z.string().min(2, 'Title is required'),
  type: z.string().min(2, 'Type is required'),
  isPaid: z.boolean().default(false),
  provider: z.string().min(2, 'Provider is required'),
  url: z.string().url('Valid URL is required'),
  category: z.string().default('General Computer Science'),
  description: z.string().default('High quality learning material.'),
  level: z.string().default('Beginner'),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session || (session.role !== 'ADMIN' && session.role !== 'COORDINATOR')) {
      return NextResponse.json({ success: false, error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const body = await req.json();
    const parsed = resourceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0].message },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const resource = await prisma.resource.create({
      data: {
        title: data.title,
        type: data.type,
        isPaid: data.isPaid,
        provider: data.provider,
        url: data.url,
        category: data.category,
        description: data.description,
        level: data.level,
        rating: 4.8,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Resource successfully added.',
        resourceId: resource.id,
        resource,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Admin create resource error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create resource' },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    if (!session || (session.role !== 'ADMIN' && session.role !== 'COORDINATOR')) {
      return NextResponse.json({ success: false, error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Resource ID is required' }, { status: 400 });
    }

    await prisma.resource.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Resource successfully removed' });
  } catch (error) {
    console.error('Admin delete resource error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete resource' },
      { status: 500 }
    );
  }
}
