"use client";

import { useState } from "react";
import { ParkingSquare, LayoutDashboard, Info } from "lucide-react";

const tabs = [
  { id: "lots", label: "Lots", icon: ParkingSquare },
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "info", label: "Info", icon: Info },
] as const;

export function BottomTabs() {
  const [activeTab, setActiveTab] = useState<string>("lots");

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[1000] bg-background border-t border-border rounded-t-2xl shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
      <nav className="flex items-center justify-around h-14">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center gap-0.5 flex-1 h-full transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
