import { NextResponse } from 'next/server';
import { SAC_BADGES } from '@/data/sac-badges';

export async function GET() {
  return NextResponse.json({
    success: true,
    coordinators: SAC_BADGES.map((person) => ({
      id: person.id,
      name: person.name,
      department: person.committee,
      role: person.designation,
      group: person.group,
      email: '',
      phone: null,
      availableHours: 'SAC desk, 2026–27 badge list',
    })),
  });
}
