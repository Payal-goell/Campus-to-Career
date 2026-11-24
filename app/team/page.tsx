import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { ProjectTeam } from '@/components/ProjectTeam';
import { Code2, Sparkles, Users } from 'lucide-react';

/* ─── Static data ─────────────────────────────────────────────── */
const STATS = [
  { icon: Users, label: '4 builders' },
  { icon: Sparkles, label: '1 vision' },
  { icon: Code2, label: 'Built at SISTec, RGPV' },
];

const TECH_STACK: { name: string; variant: 'primary' | 'accent' | 'default' | 'info' | 'success' | 'warning' }[] = [
  { name: 'Next.js',       variant: 'default'  },
  { name: 'TypeScript',    variant: 'info'     },
  { name: 'Prisma',        variant: 'primary'  },
  { name: 'PostgreSQL',    variant: 'info'     },
  { name: 'Python',        variant: 'warning'  },
  { name: 'FastAPI',       variant: 'success'  },
  { name: 'Tailwind CSS',  variant: 'accent'   },
  { name: 'Framer Motion', variant: 'primary'  },
];

/* ─── Page ────────────────────────────────────────────────────── */
export default function TeamPage() {
  return (
    <div className="space-y-14 py-8 pb-16 max-w-4xl mx-auto">

      {/* ── Hero ── */}
      <section className="space-y-5">
        <Badge variant="primary" size="sm">
          <Sparkles className="w-3 h-3" />
          Public
        </Badge>

        <div className="space-y-3">
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-[var(--text-primary)] leading-none">
            The people behind
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
              }}
            >
              Campus to Career
            </span>
          </h1>
          <p className="text-base sm:text-lg text-[var(--text-secondary)] max-w-xl leading-relaxed">
            We&apos;re four CSE students from SISTec who got tired of watching classmates
            miss placements because no one told them what to do. So we built the guide
            we wish we&apos;d had.
          </p>
        </div>

        {/* Stats strip */}
        <div className="flex flex-wrap gap-3 pt-1">
          {STATS.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] bg-[var(--surface-raised)] text-sm font-semibold text-[var(--text-secondary)]"
            >
              <Icon className="w-4 h-4 text-[var(--primary)]" />
              {label}
            </div>
          ))}
        </div>
      </section>

      {/* ── Team cards ── */}
      <ProjectTeam showIntro={false} />

      {/* ── Built with ── */}
      <section className="space-y-5">
        <div className="space-y-1">
          <Badge variant="default" size="sm">
            <Code2 className="w-3 h-3" />
            Stack
          </Badge>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-[var(--text-primary)]">
            Built with
          </h2>
          <p className="text-sm text-[var(--text-secondary)] max-w-lg leading-relaxed">
            Every tool chosen for a reason — fast iteration, type safety, and a UI
            students actually enjoy using.
          </p>
        </div>

        <Card variant="inset" padding="lg">
          <div className="flex flex-wrap gap-2.5">
            {TECH_STACK.map(({ name, variant }) => (
              <Badge key={name} variant={variant} size="lg">
                {name}
              </Badge>
            ))}
          </div>
        </Card>
      </section>

    </div>
  );
}
