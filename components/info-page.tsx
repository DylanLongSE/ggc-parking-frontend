"use client";

import { CollapsibleSection } from "@/components/ui/collapsible-section";
import {
  Clock,
  CreditCard,
  ShieldCheck,
  AlertTriangle,
  Phone,
} from "lucide-react";

function FineCard({ amount, label }: { amount: string; label: string }) {
  return (
    <div className="rounded-xl bg-muted px-3 py-3 text-center">
      <p className="text-2xl font-bold text-foreground">{amount}</p>
      <p className="text-xs text-muted-foreground leading-tight mt-0.5">
        {label}
      </p>
    </div>
  );
}

function RuleRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-3 py-2.5 border-b border-border last:border-0">
      <div className="mt-1.5 h-2 w-2 rounded-full bg-primary shrink-0" />
      <p className="text-sm font-medium text-foreground leading-snug">
        {children}
      </p>
    </div>
  );
}

function PermitRow({ name, desc }: { name: string; desc: string }) {
  return (
    <div className="flex items-center gap-3 py-2.5 border-b border-border last:border-0">
      <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
        <span className="text-sm font-bold text-primary">{name[0]}</span>
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground">{name}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}

export function InfoPage() {
  return (
    <div className="overflow-y-auto h-dvh pb-20 px-4 pt-6">
      <h1 className="text-2xl font-bold mb-0.5">Parking Info</h1>
      <p className="text-sm text-muted-foreground mb-5">
        GGC Campus · Regulations enforced 24/7
      </p>

      <div className="space-y-3">
        <CollapsibleSection
          title="Fines & Appeals"
          icon={AlertTriangle}
          defaultOpen
        >
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <FineCard amount="$35" label="Reserved space" />
              <FineCard amount="$40" label="Curb / lawn / blocked" />
              <FineCard amount="$100" label="Fire lane" />
              <FineCard amount="$200" label="Handicap zone" />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              5+ unpaid fines → boot or tow at owner&apos;s expense. Appeal
              within{" "}
              <span className="font-semibold text-foreground">7 days</span> via
              the GGC parking portal.
            </p>
          </div>
        </CollapsibleSection>

        <CollapsibleSection
          title="Parking Rules"
          icon={ShieldCheck}
          defaultOpen
        >
          <div>
            <RuleRow>
              Valid permit required at all times — enforced 24/7
            </RuleRow>
            <RuleRow>Decal on lower-left area of rear window</RuleRow>
            <RuleRow>Park only in designated spaces</RuleRow>
            <RuleRow>Do not block fire lanes or handicap zones</RuleRow>
            <RuleRow>Move vehicle once EV charging is complete</RuleRow>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Permit Types" icon={CreditCard}>
          <div>
            <PermitRow name="Student" desc="For students commuting to campus" />
            <PermitRow
              name="Temporary"
              desc="Special classes, seminars, or short-term hardship"
            />
            <PermitRow
              name="Faculty/Staff"
              desc="Reserved areas for employees"
            />
            <PermitRow
              name="Guest"
              desc="Available through the GGC parking portal"
            />
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Parking Hours" icon={Clock}>
          <div className="space-y-2">
            <div className="rounded-xl bg-primary/10 px-4 py-3">
              <p className="text-sm font-bold text-primary">
                Enforced 24 hrs · 7 days a week
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              [Unsure: specific lot operational hours — verify with Parking
              Services]
            </p>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Contact" icon={Phone}>
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">
                GGC Parking Services
              </p>
              <p className="text-xl font-bold text-foreground">678.407.5015</p>
              <p className="text-sm text-muted-foreground">
                ParkingServices@ggc.edu
              </p>
            </div>
            <div className="text-xs text-muted-foreground border-t border-border pt-2 space-y-0.5">
              <p>Building D, Room 1346</p>
              <p>Mon – Fri · 8:00 AM – 5:00 PM</p>
            </div>
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
}
