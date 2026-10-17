import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CLUB_PHOTOS, SISTEC_CLUBS, photoForEvent } from '@/data/sistec-campus';
import { isDatabaseError } from '@/lib/demo-accounts';

export async function GET() {
  try {
    const clubs = await prisma.clubCommittee.findMany({
      include: {
        events: {
          orderBy: { date: 'asc' },
        },
      },
      orderBy: { name: 'asc' },
    });

    const dbClubs = clubs.map((c) => ({
      id: c.id,
      name: c.name,
      category: c.category,
      description: c.description,
      purpose: c.purpose,
      responsibilities: c.responsibilities,
      skillsGained: c.skillsGained,
      leadCoordinator: c.leadCoordinator,
      joinUrl: c.joinUrl,
      recentEventRecap: c.recentEventRecap,
      imageUrl: c.imageUrl || CLUB_PHOTOS[c.id] || null,
      events: c.events.map((e) => ({
        id: e.id,
        title: e.title,
        category: e.category,
        date: e.date.toISOString().split('T')[0],
        location: e.location,
        description: e.description,
        recap: e.recap,
        registrationUrl: e.registrationUrl,
        imageUrl: photoForEvent(e.id, e.category),
      })),
    }));

    const names = new Set(dbClubs.map((c) => c.name.toLowerCase()));
    const sistec = SISTEC_CLUBS.filter((c) => !names.has(c.name.toLowerCase())).map((c) => ({
      ...c,
      imageUrl: c.imageUrl || CLUB_PHOTOS[c.id] || null,
      events: c.events.map((e) => ({ ...e, imageUrl: photoForEvent(e.id, e.category) })),
    }));

    return NextResponse.json({
      success: true,
      source: 'SISTec official events + campus clubs',
      clubs: [...sistec, ...dbClubs],
    });
  } catch (error) {
    console.error('Clubs fetch error:', error);
    if (isDatabaseError(error)) {
      const clubs = SISTEC_CLUBS.map((club) => ({
        ...club,
        imageUrl: club.imageUrl || CLUB_PHOTOS[club.id] || null,
        events: club.events.map((event) => ({ ...event, imageUrl: photoForEvent(event.id, event.category) })),
      }));
      return NextResponse.json({
        success: true,
        source: 'SISTec official events + campus clubs',
        clubs,
      });
    }
    return NextResponse.json(
      { success: false, error: 'Failed to fetch clubs and events' },
      { status: 500 }
    );
  }
}
