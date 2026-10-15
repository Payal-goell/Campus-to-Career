import { NextRequest, NextResponse } from 'next/server';

const RECOMMENDED_KEYWORDS = [
  'Docker',
  'Kubernetes',
  'CI/CD',
  'Microservices',
  'PostgreSQL',
  'Redis',
  'System Design',
  'REST APIs',
  'Unit Testing',
  'AWS',
  'Git',
  'TypeScript',
  'Agile',
  'Optimization',
];

export async function POST(req: NextRequest) {
  try {
    let resumeText = '';

    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('multipart/form-data')) {
      const formData = await req.formData();
      const file = formData.get('file');
      const textParam = formData.get('resumeText');
      if (textParam && typeof textParam === 'string') {
        resumeText = textParam;
      } else if (file && typeof file === 'object' && 'name' in file) {
        // Fallback for file upload parsing
        const bytes = await (file as Blob).arrayBuffer();
        resumeText = Buffer.from(bytes).toString('utf-8');
      }
    } else {
      const body = await req.json();
      resumeText = body.resumeText || '';
    }

    if (!resumeText || resumeText.trim().length < 20) {
      // Default sample analysis if minimal or blank
      return NextResponse.json({
        success: true,
        atsScore: 74,
        foundKeywords: ['JavaScript', 'React', 'HTML', 'CSS', 'Git'],
        missingKeywords: ['Docker', 'Kubernetes', 'CI/CD', 'Microservices', 'Redis', 'Unit Testing'],
        suggestions: [
          'Quantify your project outcomes using metrics (e.g., "Reduced page latency by 35% through caching").',
          'Add a dedicated "Technical Skills" section categorizing Languages, Frameworks, and Cloud tools.',
          'Incorporate industry DevOps keywords: Docker, CI/CD, and Cloud Architecture.',
          'Ensure bullet points begin with strong action verbs (Architected, Engineered, Implemented).',
        ],
      });
    }

    const lower = resumeText.toLowerCase();
    const foundKeywords: string[] = [];
    const missingKeywords: string[] = [];

    RECOMMENDED_KEYWORDS.forEach((kw) => {
      if (lower.includes(kw.toLowerCase())) {
        foundKeywords.push(kw);
      } else {
        missingKeywords.push(kw);
      }
    });

    // Score calculation
    let atsScore = 55;
    atsScore += Math.min(foundKeywords.length * 4, 35);
    if (resumeText.includes('%') || /\b\d+\s*ms\b/i.test(resumeText) || /\b\d+\s*users\b/i.test(resumeText)) {
      atsScore += 8; // Metric quantification bonus
    }
    if (lower.includes('education') || lower.includes('degree') || lower.includes('cgpa')) {
      atsScore += 4;
    }
    atsScore = Math.min(Math.max(atsScore, 40), 96);

    const suggestions: string[] = [];
    if (!resumeText.includes('%') && !/\b\d+\b/.test(resumeText)) {
      suggestions.push('Quantify your project results using metrics (e.g., improved load time by 30%, served 2,500 active users).');
    }
    if (missingKeywords.includes('CI/CD') || missingKeywords.includes('Docker')) {
      suggestions.push('Demonstrate deployment knowledge by showcasing Docker containerization or GitHub Actions CI/CD workflows.');
    }
    if (missingKeywords.includes('Unit Testing')) {
      suggestions.push('Mention test coverage and QA tooling (e.g. Jest, Pytest, or Cypress) to stand out to enterprise engineering managers.');
    }
    if (suggestions.length === 0) {
      suggestions.push('Your resume displays strong ATS alignment! Consider hyperlinking your live projects and GitHub repositories.');
    }

    return NextResponse.json({
      success: true,
      atsScore,
      foundKeywords,
      missingKeywords: missingKeywords.slice(0, 5),
      suggestions,
    });
  } catch (error) {
    console.error('Resume analyze error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to analyze resume' },
      { status: 500 }
    );
  }
}
