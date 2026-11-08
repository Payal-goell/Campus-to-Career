import { PROJECT_TEAM } from '@/data/project-team';
import { CoverImage } from '@/components/ui/CoverImage';
import { Badge } from '@/components/ui/Badge';

export function ProjectTeam({ compact = false, showIntro = true }: { compact?: boolean; showIntro?: boolean }) {
  return (
    <section className="space-y-5">
      {showIntro && (
        <div className="space-y-2">
          <Badge variant="primary" size="sm">
            The builders
          </Badge>
          <h2 className={compact ? 'text-xl font-black' : 'text-2xl sm:text-3xl font-black tracking-tight'}>
            Look after the team
          </h2>
        </div>
      )}
      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        {PROJECT_TEAM.map((person) => (
          <article key={person.id} className="min-w-0 flex flex-col items-center">
            <CoverImage
              src={person.photo}
              alt={`Portrait of ${person.name}`}
              position="50% 18%"
              priority
              className="aspect-square w-full rounded-2xl border border-[var(--border)] bg-white"
            />
            <h3 className="mt-2 h-10 w-full flex items-center justify-center text-center text-[11px] sm:text-sm font-bold leading-tight text-[var(--text-primary)] px-0.5">
              {person.name}
            </h3>
          </article>
        ))}
      </div>
    </section>
  );
}
