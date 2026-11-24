'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Github, Linkedin, Sparkles } from 'lucide-react';
import { PROJECT_TEAM, type ProjectBuilder } from '@/data/project-team';
import { Badge } from '@/components/ui/Badge';
import { CoverImage } from '@/components/ui/CoverImage';

/* ─── Individual card ─────────────────────────────────────────── */
function TeamCard({ person }: { person: ProjectBuilder }) {
  const [hovered, setHovered] = useState(false);

  return (
    <article
      className="relative rounded-2xl overflow-hidden border border-[var(--border)] cursor-pointer group"
      style={{ aspectRatio: '3/4' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      tabIndex={0}
      aria-label={`${person.name}, ${person.role}`}
    >
      {/* ── Photo ── */}
      <motion.div
        className="absolute inset-0"
        animate={{ scale: hovered ? 1.06 : 1 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <CoverImage
          src={person.photo}
          alt={`Portrait of ${person.name}`}
          position="50% 18%"
          priority
          className="w-full h-full"
        />
      </motion.div>

      {/* ── Persistent bottom gradient + name/role ── */}
      <div
        className="absolute inset-x-0 bottom-0 h-2/5 pointer-events-none"
        style={{
          background:
            'linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
        }}
      />
      <div className="absolute inset-x-0 bottom-0 p-4 pb-5 pointer-events-none">
        <AnimatePresence>
          {!hovered && (
            <motion.div
              key="default-label"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 4 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-xs font-semibold tracking-wide uppercase text-white/60 mb-0.5">
                {person.year}
              </p>
              <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                {person.name}
              </h3>
              <p className="text-xs sm:text-sm text-white/75 mt-0.5">{person.role}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Hover overlay panel ── */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            key="overlay"
            className="absolute inset-x-0 bottom-0 rounded-b-2xl p-4 sm:p-5 flex flex-col gap-3"
            style={{
              background:
                'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.88) 70%, rgba(0,0,0,0.0) 100%)',
              backdropFilter: 'blur(2px)',
            }}
            initial={{ y: '100%', opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ duration: 0.38, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Name + role */}
            <div>
              <h3 className="text-base sm:text-lg font-black text-white leading-tight">
                {person.name}
              </h3>
              <p className="text-xs sm:text-sm text-white/70 mt-0.5">{person.role}</p>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-1.5">
              {person.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-[10px] sm:text-xs font-semibold px-2 py-0.5 rounded-full border"
                  style={{
                    color: 'var(--primary-foreground)',
                    background: 'var(--primary)',
                    borderColor: 'var(--primary-border)',
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>

            {/* Quote */}
            <p className="text-xs sm:text-sm text-white/80 italic leading-snug line-clamp-2">
              &ldquo;{person.quote}&rdquo;
            </p>

            {/* Links */}
            <div className="flex items-center gap-2 mt-0.5">
              {person.github && (
                <a
                  href={person.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${person.name} on GitHub`}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Github className="w-3.5 h-3.5 text-white" />
                </a>
              )}
              {person.linkedin && (
                <a
                  href={person.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${person.name} on LinkedIn`}
                  className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 border border-white/20 transition-colors"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Linkedin className="w-3.5 h-3.5 text-white" />
                </a>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Top accent dot ── */}
      <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-[var(--primary)] opacity-80" />
    </article>
  );
}

/* ─── Public component ────────────────────────────────────────── */
export function ProjectTeam({
  compact = false,
  showIntro = true,
}: {
  compact?: boolean;
  showIntro?: boolean;
}) {
  return (
    <section className="space-y-6">
      {showIntro && (
        <div className="space-y-2">
          <Badge variant="primary" size="sm">
            <Sparkles className="w-3 h-3" />
            The builders
          </Badge>
          <h2
            className={
              compact
                ? 'text-xl font-black tracking-tight'
                : 'text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)]'
            }
          >
            Meet the team
          </h2>
          <p className="text-sm text-[var(--text-secondary)] max-w-lg leading-relaxed">
            Four SISTec students who turned a campus problem into a full-stack product.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {PROJECT_TEAM.map((person, i) => (
          <motion.div
            key={person.id}
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
          >
            <TeamCard person={person} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
