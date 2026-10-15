import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const coordinators = await prisma.coordinatorContact.findMany({
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({
      success: true,
      coordinators: coordinators.map((c) => ({
        id: c.id,
        name: c.name,
        department: c.department,
        role: c.role,
        email: c.email,
        phone: c.phone,
        availableHours: c.availableHours,
      })),
    });
  } catch (error) {
    console.error('Coordinators get error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch coordinators' },
      { status: 500 }
    );
  }
}
