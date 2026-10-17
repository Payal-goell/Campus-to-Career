import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { REFERENCE_BOOKS } from '@/data/reference-books';
import { FREE_COURSES } from '@/data/free-courses';
import { isDatabaseError } from '@/lib/demo-accounts';

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const isPaidParam = searchParams.get('isPaid');
    const category = searchParams.get('category');
    const search = searchParams.get('q');

    const where: Record<string, unknown> = {};

    if (type && type !== 'all') {
      where.type = type;
    }

    if (isPaidParam !== null && isPaidParam !== undefined && isPaidParam !== 'all') {
      where.isPaid = isPaidParam === 'true';
    }

    if (category && category !== 'all') {
      where.category = { contains: category, mode: 'insensitive' };
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { provider: { contains: search, mode: 'insensitive' } },
      ];
    }

    let resources: Awaited<ReturnType<typeof prisma.resource.findMany>> = [];
    try {
      resources = await prisma.resource.findMany({
        where,
        orderBy: [{ rating: 'desc' }, { createdAt: 'desc' }],
      });
    } catch (error) {
      if (!isDatabaseError(error)) throw error;
      console.error('Resources database unavailable:', error);
    }

    let savedMap = new Map<string, string>();
    if (session && !session.id.startsWith('demo-')) {
      try {
        const userSaves = await prisma.userSavedResource.findMany({
          where: { userId: session.id },
        });
        savedMap = new Map(userSaves.map((s) => [s.resourceId, s.status]));
      } catch (error) {
        if (!isDatabaseError(error)) throw error;
      }
    }

    const formatted = resources.map((r) => ({
      id: r.id,
      title: r.title,
      type: r.type,
      category: r.category,
      provider: r.provider,
      url: r.url,
      isPaid: r.isPaid,
      level: r.level,
      rating: r.rating,
      description: r.description,
      academicYear: r.academicYear,
      isSaved: savedMap.has(r.id),
      userStatus: savedMap.get(r.id) || null,
    }));

    const titles = new Set(formatted.map((r) => r.title.toLowerCase()));
    const books = REFERENCE_BOOKS.filter((b) => !titles.has(b.title.toLowerCase())).map((b) => ({
      ...b,
      isSaved: savedMap.has(b.id),
      userStatus: savedMap.get(b.id) || null,
    }));
    formatted.push(...books);
    books.forEach((b) => titles.add(b.title.toLowerCase()));

    const extras = FREE_COURSES.filter((c) => !titles.has(c.title.toLowerCase())).map((c) => ({
      ...c,
      isSaved: savedMap.has(c.id),
      userStatus: savedMap.get(c.id) || null,
    }));
    extras.forEach((c) => titles.add(c.title.toLowerCase()));
    formatted.push(...extras);

    const typed = type && type !== 'all' ? formatted.filter((r) => r.type === type) : formatted;
    const paidFiltered =
      isPaidParam !== null && isPaidParam !== undefined && isPaidParam !== 'all'
        ? typed.filter((r) => r.isPaid === (isPaidParam === 'true'))
        : typed;

    paidFiltered.sort((a, b) => b.rating - a.rating);

    return NextResponse.json({
      success: true,
      total: paidFiltered.length,
      resources: paidFiltered,
    });
  } catch (error) {
    console.error('Resources list error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch resources' },
      { status: 500 }
    );
  }
}
