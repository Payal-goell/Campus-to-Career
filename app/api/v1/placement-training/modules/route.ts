import { NextResponse } from 'next/server';
import { TRAINING_MODULES } from '@/data/training-modules';

export async function GET() {
  return NextResponse.json({
    success: true,
    categories: TRAINING_MODULES.map((m) => ({
      category: m.category,
      description: m.description,
      duration: m.duration,
      mockQuestionsCount: m.mockQuestionsCount,
      topics: m.topics.map((t) => t.title),
      topicDetails: m.topics,
      weeklyPlan: m.weeklyPlan,
    })),
  });
}
