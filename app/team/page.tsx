import { PageHeader } from '@/components/ui/PageHeader';
import { ProjectTeam } from '@/components/ProjectTeam';

export default function TeamPage() {
  return (
    <div className="space-y-8 py-6">
      <PageHeader
        badge="Public"
        title="Team"
        description="The SISTec students who built Campus to Career."
      />
      <ProjectTeam showIntro={false} />
    </div>
  );
}
