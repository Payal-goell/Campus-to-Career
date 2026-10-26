"use client";

import React, { useMemo, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { UserCheck, Send, MessageSquare, Search, CheckCircle2, Building } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { toast } from "@/components/ui/Toast";
import { SAC_BADGES, type SacGroup, type SacPerson } from "@/data/sac-badges";
import { CAMPUS_DESKS } from "@/data/campus-contacts";
import { ReachButtons } from "@/components/ReachButtons";

const SECTIONS: { id: SacGroup; title: string; detail: string }[] = [
  {
    id: "faculty",
    title: "Faculty coordinators",
    detail: "SAC faculty and the faculty coordinator named for each committee.",
  },
  {
    id: "student",
    title: "Main student coordinators",
    detail: "Office bearers and the student coordinator or team lead for each committee.",
  },
  {
    id: "member",
    title: "Committee members",
    detail: "Student members on the 2026–27 badge list, with the committee they sit on.",
  },
];

function initials(name: string) {
  return name
    .replace(/^(Prof\.|Dr\.|Mr\.|Ms\.)\s+/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function CoordinatorsPage() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCoord, setSelectedCoord] = useState<SacPerson | null>(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successTicket, setSuccessTicket] = useState<{ ticketId: string; coordName: string } | null>(null);

  const filteredDesks = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return CAMPUS_DESKS;
    return CAMPUS_DESKS.map((desk) => ({
      ...desk,
      people: desk.people.filter((person) =>
        `${person.name} ${person.role} ${person.unit} ${desk.title}`.toLowerCase().includes(q)
      ),
    })).filter((desk) => desk.people.length > 0 || (desk.note && `${desk.title} ${desk.detail} ${desk.note}`.toLowerCase().includes(q)));
  }, [searchQuery]);

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return SAC_BADGES;
    return SAC_BADGES.filter((person) =>
      `${person.name} ${person.designation} ${person.committee}`.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const handleSendInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCoord || !subject || !message) return;
    if (!user) {
      toast.error("Sign in to send a query", "The desk keeps the ticket with your account.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/v1/coordinators/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          coordinatorId: selectedCoord.id,
          subject,
          message,
        }),
      });

      const data = await res.json();
      if (data.success) {
        const ticketId = data.ticketId || "tkt_9921";
        setSuccessTicket({ ticketId, coordName: selectedCoord.name });
        toast.success("Inquiry transmitted", `Ticket #${ticketId} created successfully.`);
        setSelectedCoord(null);
        setSubject("");
        setMessage("");
      } else {
        toast.error("Failed to send inquiry", data.error || "Please try again later.");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to send inquiry", "Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  const showEmpty = filteredDesks.length === 0 && filtered.length === 0;

  return (
    <div className="space-y-8 py-6">
      <Card variant="raised" className="p-6 sm:p-8 border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/90 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <Badge variant="primary" size="sm">SISTec desks</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--color-text-primary)] tracking-tight">
            Coordinators
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1.5 max-w-2xl leading-relaxed">
            Call a published number, or open WhatsApp with a query already written to that person. The SAC badge list for 2026–27 is below the phone directory.
          </p>
        </div>
        <div className="w-full md:w-72 shrink-0">
          <Input
            placeholder="Search by name, club, or committee..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
      </Card>

      {successTicket && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-600 dark:text-emerald-400 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <div>
              <p className="font-bold">Inquiry submitted to {successTicket.coordName}</p>
              <p className="text-[var(--color-text-secondary)] text-[11px]">
                Tracking ticket <strong className="font-mono text-emerald-500">#{successTicket.ticketId}</strong>
              </p>
            </div>
          </div>
          <Button size="xs" variant="ghost" onClick={() => setSuccessTicket(null)}>Dismiss</Button>
        </div>
      )}

      {filteredDesks.length > 0 && (
        <section className="space-y-6">
          <div>
            <h2 className="text-sm font-bold text-[var(--color-text-primary)] flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-[var(--color-brand-primary)]" />
              Call or WhatsApp
            </h2>
            <p className="text-xs text-[var(--color-text-muted)] mt-1">
              Branch clubs, E-Cell, developer groups, first-year clubs, and the placement cell.
            </p>
          </div>
          {filteredDesks.map((desk) => (
            <div key={desk.id} className="space-y-3">
              <div>
                <h3 className="text-sm font-bold text-[var(--color-text-primary)]">{desk.title}</h3>
                <p className="text-xs text-[var(--color-text-muted)] mt-1">{desk.detail}</p>
              </div>
              {desk.people.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {desk.people.map((person) => (
                    <Card key={person.id} className="p-5 flex flex-col justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-11 h-11 rounded-2xl bg-[var(--primary-subtle)] text-[var(--primary)] flex items-center justify-center font-bold text-xs shrink-0">
                          {initials(person.name)}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-bold text-sm text-[var(--color-text-primary)]">{person.name}</h3>
                          <p className="text-xs text-[var(--color-brand-primary)] font-semibold">{person.role}</p>
                          <p className="text-[11px] text-[var(--color-text-secondary)] mt-1 flex items-center gap-1.5">
                            <Building className="w-3.5 h-3.5 shrink-0" />
                            {person.unit}
                          </p>
                        </div>
                      </div>
                      {person.phone ? (
                        <ReachButtons phone={person.phone} name={person.name} unit={person.unit} />
                      ) : (
                        <p className="text-[11px] text-[var(--color-text-muted)]">A phone number is not on this list yet.</p>
                      )}
                    </Card>
                  ))}
                </div>
              ) : (
                desk.note && (
                  <p className="text-xs text-[var(--color-text-secondary)] rounded-2xl border border-[var(--color-border-subtle)] px-4 py-3">
                    {desk.note}
                  </p>
                )
              )}
            </div>
          ))}
        </section>
      )}

      {showEmpty ? (
        <EmptyState
          title="No one matches that search"
          description="Try a name, a club, or a committee."
          action={{ label: "Clear Search", onClick: () => setSearchQuery("") }}
        />
      ) : filtered.length > 0 ? (
        SECTIONS.map((section) => {
          const people = filtered.filter((person) => person.group === section.id);
          if (people.length === 0) return null;
          return (
            <section key={section.id} className="space-y-3">
              <div>
                <h2 className="text-sm font-bold text-[var(--text-primary)] flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-[var(--primary)]" />
                  {section.title}
                </h2>
                <p className="text-xs text-[var(--text-muted)] mt-1">{section.detail}</p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {people.map((person) => (
                  <Card key={person.id} className="p-5 flex flex-col justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-[var(--primary-subtle)] text-[var(--primary)] flex items-center justify-center font-bold text-xs shrink-0">
                        {initials(person.name)}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm text-[var(--text-primary)]">{person.name}</h3>
                        <p className="text-xs text-[var(--primary)] font-semibold">{person.designation}</p>
                        <p className="text-[11px] text-[var(--text-secondary)] mt-1 flex items-center gap-1.5">
                          <Building className="w-3.5 h-3.5 shrink-0" />
                          {person.committee}
                        </p>
                      </div>
                    </div>
                    {person.group !== "member" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedCoord(person)}
                        leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
                      >
                        Send query
                      </Button>
                    )}
                  </Card>
                ))}
              </div>
            </section>
          );
        })
      ) : null}

      <Modal open={!!selectedCoord} onOpenChange={(open) => !open && setSelectedCoord(null)}>
        {selectedCoord && (
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Submit inquiry to {selectedCoord.name}</ModalTitle>
              <ModalDescription>
                {selectedCoord.designation} · {selectedCoord.committee}
              </ModalDescription>
            </ModalHeader>
            <form onSubmit={handleSendInquiry}>
              <ModalBody className="space-y-4">
                <Input
                  label="Subject *"
                  required
                  placeholder="Badge duty, committee join, or a campus question"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] block">
                    Inquiry details *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Say which committee this is about and what you need."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3.5 py-2.5 text-xs text-[var(--color-text-primary)] focus:border-[var(--color-border-focus)] outline-none"
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button type="button" variant="ghost" onClick={() => setSelectedCoord(null)}>Cancel</Button>
                <Button type="submit" variant="gradient" loading={submitting} leftIcon={<Send className="w-3.5 h-3.5" />}>
                  Send message
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        )}
      </Modal>
    </div>
  );
}
