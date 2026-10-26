import { Phone } from 'lucide-react';
import { callHref, phoneLabel, whatsAppHref } from '@/data/campus-contacts';

export function ReachButtons({
  phone,
  name,
  unit,
}: {
  phone: string;
  name: string;
  unit: string;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      <a
        href={callHref(phone)}
        className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl text-xs font-bold border border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--primary)]"
      >
        <Phone className="w-3.5 h-3.5" />
        Call {phoneLabel(phone)}
      </a>
      <a
        href={whatsAppHref(phone, name, unit)}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1.5 h-9 px-3 rounded-xl text-xs font-bold bg-[#128C7E] text-white"
      >
        WhatsApp query
      </a>
    </div>
  );
}
