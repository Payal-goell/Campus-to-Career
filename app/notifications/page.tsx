'use client';

import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';

interface Note {
  id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const [items, setItems] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/v1/notifications')
      .then((r) => r.json())
      .then((j) => {
        if (j.success) setItems(j.notifications || []);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6 py-6">
      <div>
        <Badge variant="primary" size="sm">Notifications</Badge>
        <h1 className="text-2xl font-black mt-2 text-[var(--text-primary)]">Inbox</h1>
      </div>
      {loading ? (
        <p className="text-xs text-[var(--text-muted)]">Loading…</p>
      ) : items.length === 0 ? (
        <EmptyState title="No notifications" description="Roadmap reminders and placement updates will land here." />
      ) : (
        <div className="space-y-2">
          {items.map((n) => (
            <Card key={n.id} className="p-4 flex gap-3">
              <Bell className="w-4 h-4 text-[var(--primary)] mt-0.5" />
              <div>
                <p className="text-sm font-bold">{n.title}</p>
                <p className="text-xs text-[var(--text-secondary)]">{n.message}</p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
