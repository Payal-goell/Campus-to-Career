import { NextRequest, NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { REFERENCE_BOOKS } from '@/data/reference-books';
import { FREE_COURSES } from '@/data/free-courses';
import { isDatabaseError } from '@/lib/demo-accounts';

/** Old catalog and seed URLs that 404, block, or land on a paywall. Live pages rewrite these so an existing database stays usable. */
const LINK_FIXES: Record<string, { url: string; title?: string; provider?: string; isPaid?: boolean; description?: string; type?: string }> = {
  'https://freecodecamp.org/learn/react': {
    url: 'https://react.dev/learn',
    title: 'React — Quick Start',
    provider: 'React',
    isPaid: false,
    type: 'course',
    description: 'Official free React tutorial. Build tic-tac-toe, then reuse the same steps on a college project.',
  },
  'https://www.freecodecamp.org/learn/react': {
    url: 'https://react.dev/learn',
    title: 'React — Quick Start',
    provider: 'React',
    isPaid: false,
    type: 'course',
    description: 'Official free React tutorial. Build tic-tac-toe, then reuse the same steps on a college project.',
  },
  'https://mitpress.mit.edu/9780262046305/introduction-to-algorithms': {
    url: 'https://ocw.mit.edu/courses/6-006-introduction-to-algorithms-spring-2020/',
    title: 'MIT OCW 6.006 Introduction to Algorithms',
    provider: 'MIT OpenCourseWare',
    isPaid: false,
    type: 'course',
    description: 'Free lectures and problem sets for Year 2 DSA. Printed CLRS stays the library copy.',
  },
  'https://frontendmasters.com/courses/typescript-v4': {
    url: 'https://www.typescriptlang.org/docs/handbook/intro.html',
    title: 'TypeScript Handbook',
    provider: 'Microsoft',
    isPaid: false,
    type: 'doc',
    description: 'Official free handbook. Read Everyday Types and Narrowing, then type one college React component.',
  },
  'https://leetcode.com/subscribe': {
    url: 'https://neetcode.io/practice',
    title: 'NeetCode Practice (Blind 75)',
    provider: 'NeetCode',
    isPaid: false,
    type: 'practice',
    description: 'Free curated problem list with video solutions. Two problems a day is enough for campus OAs.',
  },
  'https://academind.com/courses/docker-kubernetes': {
    url: 'https://docs.docker.com/get-started/',
    title: 'Docker — Get started',
    provider: 'Docker',
    isPaid: false,
    type: 'doc',
    description: 'Official free guide. Containerise one college project and run it locally.',
  },
  'https://youtube.com/c/neetcode': { url: 'https://www.youtube.com/c/neetcode' },
  'https://postgresql.org/docs/16/index.html': { url: 'https://www.postgresql.org/docs/current/' },
  'https://www.internetingishard.com': {
    url: 'https://www.freecodecamp.org/learn/front-end-development-libraries/',
    title: 'freeCodeCamp — Front End Development Libraries',
    provider: 'freeCodeCamp',
    isPaid: false,
  },
  'https://linuxjourney.com': {
    url: 'https://www.digitalocean.com/community/tutorials/an-introduction-to-the-linux-terminal',
    title: 'Introduction to the Linux Terminal',
    provider: 'DigitalOcean',
    isPaid: false,
  },
  'https://academy.postman.com/path/postman-student-expert': {
    url: 'https://learning.postman.com/docs/getting-started/overview/',
    title: 'Postman — Getting started',
    provider: 'Postman',
    isPaid: false,
  },
  'https://www.coursera.org/learn/python-crash-course': {
    url: 'https://www.kaggle.com/learn/python',
    title: 'Kaggle Learn Python',
    provider: 'Kaggle',
    isPaid: false,
  },
  'https://www.pearson.com/en-us/subject-catalog/p/computer-networks/P200000003361.html': {
    url: 'https://book.systemsapproach.org/',
    title: 'Computer Networks: A Systems Approach (free)',
    provider: 'Peterson, Davie, et al.',
    isPaid: false,
    type: 'book',
  },
  'https://www.pearson.com/en-us/subject-catalog/p/clean-code/P200000009163.html': {
    url: 'https://refactoring.guru/refactoring',
    title: 'Refactoring (free guide)',
    provider: 'Refactoring.Guru',
    isPaid: false,
    type: 'doc',
  },
  'https://www.oreilly.com/library/view/hands-on-machine-learning/9781098125967': {
    url: 'https://github.com/ageron/handson-ml3',
    title: 'Hands-On Machine Learning — official notebooks',
    provider: 'Aurélien Géron',
    isPaid: false,
    type: 'practice',
  },
  'https://www.khannapublishers.in': {
    url: 'https://nptel.ac.in/courses/111105121',
    title: 'NPTEL Engineering Mathematics I',
    provider: 'IIT Kharagpur / NPTEL',
    isPaid: false,
    type: 'course',
  },
};

function withWorkingLink<T extends { url: string }>(item: T): T {
  const key = item.url.trim().replace(/\/$/, '');
  const fix = LINK_FIXES[key] ?? LINK_FIXES[item.url];
  return fix ? { ...item, ...fix } : item;
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSessionUser(req);
    const { searchParams } = new URL(req.url);
    const type = searchParams.get('type');
    const isPaidParam = searchParams.get('isPaid');
    const category = searchParams.get('category');
    const search = searchParams.get('q');

    const where: Record<string, unknown> = {};

    // Type and paid filters run after link rewrites so a stored paid/404 row can become a free working link.

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

    const formatted = resources.map((r) =>
      withWorkingLink({
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
      })
    );

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
