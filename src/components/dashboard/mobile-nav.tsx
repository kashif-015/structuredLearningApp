"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Library, PlusCircle, Layers, BarChart3 } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { label: "Home", icon: Home, href: "/dashboard" },
  { label: "Courses", icon: Library, href: "/dashboard/courses" },
  { label: "Import", icon: PlusCircle, href: "/dashboard/import" },
  { label: "Cards", icon: Layers, href: "/dashboard/flashcards" },
  { label: "Progress", icon: BarChart3, href: "/dashboard/progress" },
];

export default function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16 px-2">
        {tabs.map((tab) => {
          const isActive =
            pathname === tab.href ||
            (tab.href !== "/dashboard" && pathname.startsWith(tab.href));

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center gap-1 py-1 px-3 rounded-xl transition-colors min-w-[56px]",
                isActive ? "text-primary" : "text-gray-400"
              )}
            >
              <div className="relative">
                <tab.icon className="w-5 h-5" />
                {isActive && (
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
              </div>
              <span className="text-[10px] font-medium">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
