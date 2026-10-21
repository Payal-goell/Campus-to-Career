import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isDatabaseError } from '@/lib/demo-accounts';

const FALLBACK_COORDINATORS = [
  {
    id: 'demo-coordinator',
    name: 'Prof. Meera Joshi',
    department: 'Training and Placement Cell, RGPV',
    role: 'Lead TPO & Technical Training Coordinator',
    email: 'sarah.c@college.edu',
    phone: '+91 755 267 8891',
    availableHours: 'Mon - Fri, 2:00 PM - 5:00 PM (TPO Office, Academic Block C)',
  },
];

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
    if (isDatabaseError(error)) {
      return NextResponse.json({ success: true, coordinators: FALLBACK_COORDINATORS });
    }
    return NextResponse.json(
      { success: false, error: 'Failed to fetch coordinators' },
      { status: 500 }
    );
  }
}
