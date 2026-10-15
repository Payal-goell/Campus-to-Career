import { NextResponse } from 'next/server';
import { FEASIBLE_PROJECTS } from '@/data/feasible-projects';

export async function GET() {
  return NextResponse.json({ success: true, projects: FEASIBLE_PROJECTS });
}
