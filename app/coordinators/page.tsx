"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  UserCheck,
  Mail,
  Phone,
  Clock,
  Send,
  MessageSquare,
  Search,
  CheckCircle2,
  Building,
  Shield,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Modal, ModalContent, ModalHeader, ModalTitle, ModalDescription, ModalBody, ModalFooter } from "@/components/ui/Modal";
import { EmptyState } from "@/components/ui/EmptyState";
import { toast } from "@/components/ui/Toast";
import { CoordinatorItem } from "@/lib/types";

export default function CoordinatorsPage() {
  const { user } = useAuth();
  const [coordinators, setCoordinators] = useState<CoordinatorItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Contact query modal state
  const [selectedCoord, setSelectedCoord] = useState<CoordinatorItem | null>(null);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [successTicket, setSuccessTicket] = useState<{ ticketId: string; coordName: string } | null>(null);

  useEffect(() => {
    fetchCoordinators();
  }, []);

  const fetchCoordinators = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/v1/coordinators");
      if (res.ok) {
        const json = await res.json();
        if (json.success) {
          setCoordinators(json.coordinators || []);
        }
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleSendInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCoord || !subject || !message) return;

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
        setSuccessTicket({
          ticketId,
          coordName: selectedCoord.name,
        });
        toast.success("Inquiry transmitted", `Ticket #${ticketId} created successfully.`);
        setSelectedCoord(null);
        setSubject("");
        setMessage("");
      }
    } catch (e) {
      console.error(e);
      toast.error("Failed to send inquiry", "Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  const filteredCoordinators = coordinators.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 py-6">
      {/* Header */}
      <Card variant="raised" className="p-6 sm:p-8 border border-[var(--color-border-subtle)] bg-[var(--color-surface)]/90 backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <Badge variant="primary" size="sm">
              Official University Contact Desk
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[var(--color-text-primary)] tracking-tight">
            Student & Faculty Coordinator Directory
          </h1>
          <p className="text-xs sm:text-sm text-[var(--color-text-secondary)] mt-1.5 max-w-2xl leading-relaxed">
            Need guidance regarding campus recruitment drives, committee join requests, or lab project clearances? Reach designated coordinators directly through verified channels.
          </p>
        </div>

        {/* Search */}
        <div className="w-full md:w-72 shrink-0">
          <Input
            placeholder="Search by name or department..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
          />
        </div>
      </Card>

      {/* Ticket Success Banner */}
      {successTicket && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-600 dark:text-emerald-400 flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
            <div>
              <p className="font-bold">
                Inquiry Submitted Successfully to {successTicket.coordName}!
              </p>
              <p className="text-[var(--color-text-secondary)] text-[11px]">
                Tracking Ticket ID: <strong className="font-mono text-emerald-500">#{successTicket.ticketId}</strong>. You will receive an alert when a reply is posted.
              </p>
            </div>
          </div>
          <Button
            size="xs"
            variant="ghost"
            onClick={() => setSuccessTicket(null)}
          >
            Dismiss
          </Button>
        </div>
      )}

      {/* Coordinators Grid */}
      {loading ? (
        <div className="text-center py-20 text-[var(--color-text-muted)]">Loading coordinator contacts...</div>
      ) : filteredCoordinators.length === 0 ? (
        <EmptyState
          title="No Coordinators Found"
          description="Try refining your search keyword or clearing the filter."
          action={{
            label: "Clear Search",
            onClick: () => setSearchQuery(""),
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCoordinators.map((c) => (
            <Card
              key={c.id}
              variant="interactive"
              animate
              className="p-6 border border-[var(--color-border-subtle)] flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[var(--color-brand-primary)] to-[var(--color-accent)] p-0.5 flex items-center justify-center text-white font-bold text-sm shadow-md">
                      {c.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <h3 className="font-bold text-[var(--color-text-primary)] text-base leading-tight">{c.name}</h3>
                      <p className="text-xs text-[var(--color-brand-primary)] font-medium">{c.role}</p>
                    </div>
                  </div>
                  <Badge variant="outline" size="sm">
                    Verified
                  </Badge>
                </div>

                <div className="space-y-2 text-xs text-[var(--color-text-secondary)] pt-2 border-t border-[var(--color-border-subtle)]">
                  <div className="flex items-center gap-2">
                    <Building className="w-3.5 h-3.5 text-[var(--color-text-muted)] shrink-0" />
                    <span>{c.department}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-[var(--color-text-muted)] shrink-0" />
                    <a href={`mailto:${c.email}`} className="text-[var(--color-brand-primary)] hover:underline">
                      {c.email}
                    </a>
                  </div>
                  {c.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-[var(--color-text-muted)] shrink-0" />
                      <span>{c.phone}</span>
                    </div>
                  )}
                  <div className="flex items-start gap-2 bg-[var(--color-surface-raised)] p-2.5 rounded-xl border border-[var(--color-border-subtle)]">
                    <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                    <span className="text-[11px] text-[var(--color-text-secondary)]">{c.availableHours}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-[var(--color-border-subtle)] flex items-center justify-between">
                <span className="text-[11px] text-[var(--color-text-muted)]">Response within 24-48 hrs</span>
                <Button
                  size="sm"
                  variant="gradient"
                  onClick={() => setSelectedCoord(c)}
                  leftIcon={<MessageSquare className="w-3.5 h-3.5" />}
                >
                  Send Query
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Query Form Modal */}
      <Modal open={!!selectedCoord} onOpenChange={(open) => !open && setSelectedCoord(null)}>
        {selectedCoord && (
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Submit Inquiry to {selectedCoord.name}</ModalTitle>
              <ModalDescription>
                {selectedCoord.role} • {selectedCoord.department}
              </ModalDescription>
            </ModalHeader>

            <form onSubmit={handleSendInquiry}>
              <ModalBody className="space-y-4">
                <Input
                  label="Subject *"
                  required
                  placeholder="e.g. Eligibility criteria for upcoming recruitment drive"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                />

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[var(--color-text-secondary)] block">
                    Inquiry Details *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Describe your inquiry clearly so the coordinator can respond accurately..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface)] px-3.5 py-2.5 text-xs text-[var(--color-text-primary)] focus:border-[var(--color-border-focus)] outline-none"
                  />
                </div>
              </ModalBody>

              <ModalFooter>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setSelectedCoord(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="gradient"
                  loading={submitting}
                  leftIcon={<Send className="w-3.5 h-3.5" />}
                >
                  Send Message
                </Button>
              </ModalFooter>
            </form>
          </ModalContent>
        )}
      </Modal>
    </div>
  );
}
