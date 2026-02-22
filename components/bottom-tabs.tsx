"use client";

import { ParkingSquare, LayoutDashboard, Info } from "lucide-react";

const tabs = [
  { id: "lots", label: "Lots", icon: ParkingSquare },
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "info", label: "Info", icon: Info },
] as const;

export type TabId = (typeof tabs)[number]["id"];

interface BottomTabsProps {
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
}

export function BottomTabs({ activeTab, onTabChange }: BottomTabsProps) {
  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[1000] w-[calc(100%-2rem)] max-w-sm bg-gray-900 rounded-full shadow-lg mb-[env(safe-area-inset-bottom)]">
      <nav className="flex items-center justify-evenly h-12 px-4 gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center justify-center w-12 h-10 rounded-full transition-colors ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-gray-400 hover:text-gray-200"
              }`}
              aria-label={tab.label}
            >
              <Icon className="h-5 w-5" />
            </button>
          );
        })}
      </nav>
    </div>
  );
}
