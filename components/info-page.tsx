"use client";

import { CollapsibleSection } from "@/components/ui/collapsible-section";
import { Clock, CreditCard, ShieldCheck, AlertTriangle, Phone } from "lucide-react";

export function InfoPage() {
  return (
    <div className="overflow-y-auto h-dvh pb-20 px-4 pt-6">
      <h1 className="text-2xl font-bold mb-6">Parking Information</h1>

      <div className="space-y-3">
        <CollapsibleSection title="Parking Hours" icon={Clock}>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>Monday – Thursday: 7:30 AM – 10:00 PM</li>
            <li>Friday: 7:30 AM – 5:00 PM</li>
            <li>Saturday & Sunday: Free parking (no permit required)</li>
          </ul>
        </CollapsibleSection>

        <CollapsibleSection title="Permit Types" icon={CreditCard}>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <span className="font-medium text-foreground">Commuter</span> —
              For students commuting to campus daily
            </li>
            <li>
              <span className="font-medium text-foreground">Resident</span> —
              For students living on campus housing
            </li>
            <li>
              <span className="font-medium text-foreground">Faculty/Staff</span> —
              Reserved areas for employees
            </li>
          </ul>
        </CollapsibleSection>

        <CollapsibleSection title="Parking Rules" icon={ShieldCheck}>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>A valid permit is required Mon–Fri during enforcement hours</li>
            <li>Park only in designated spaces</li>
            <li>Do not block fire lanes or handicap zones</li>
            <li>Motorcycles must park in designated motorcycle areas</li>
            <li>Overnight parking requires prior approval</li>
          </ul>
        </CollapsibleSection>

        <CollapsibleSection title="Fines & Appeals" icon={AlertTriangle}>
          <div className="text-sm text-muted-foreground space-y-2">
            <p>Fines range from $25 to $200 depending on the violation.</p>
            <ul className="list-disc list-inside space-y-1">
              <li>No valid permit: $50</li>
              <li>Fire lane violation: $200</li>
              <li>Handicap violation: $200</li>
              <li>Expired meter: $25</li>
            </ul>
            <p>
              Appeals can be submitted online within 10 business days of the
              citation through the GGC parking portal.
            </p>
          </div>
        </CollapsibleSection>

        <CollapsibleSection title="Contact" icon={Phone}>
          <div className="text-sm text-muted-foreground space-y-1">
            <p className="font-medium text-foreground">GGC Parking Services</p>
            <p>Phone: (678) 407-5000</p>
            <p>Location: Building A, Suite 1200</p>
          </div>
        </CollapsibleSection>
      </div>
    </div>
  );
}
