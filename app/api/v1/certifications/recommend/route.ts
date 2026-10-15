import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { recommendCerts } from '@/data/cert-recommendations';

export async function GET(req: NextRequest) {
  const session = await getSessionUser(req);
  let year = Number(new URL(req.url).searchParams.get('year') || 2);
  let domains: string[] = [];
  let skills: string[] = [];
  let targetRole = '';

  if (session) {
    const profile = await prisma.studentProfile.findUnique({ where: { userId: session.id } });
    if (profile) {
      year = profile.currentYear;
      domains = profile.preferredDomains;
      skills = profile.skills;
      targetRole = profile.targetRole || '';
    }
  }

  const recommended = recommendCerts({ year, domains, skills, targetRole });
  return NextResponse.json({
    success: true,
    context: { year, targetRole, domains },
    recommended,
  });
}
