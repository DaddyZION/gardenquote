"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusCircle, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/",
    label: "Home",
    icon: Home,
  },
  {
    href: "/new-quote",
    label: "New Quote",
    icon: PlusCircle,
  },
  {
    href: "/saved-jobs",
    label: "Saved Jobs",
    icon: FolderOpen,
  },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-800/95 backdrop-blur-lg border-t border-slate-700 safe-area-inset-bottom">
      <div className="flex items-center justify-around h-20 max-w-lg mx-auto px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center gap-1 w-full h-full py-2 px-3 rounded-2xl transition-all duration-200 touch-manipulation active:scale-95",
                isActive
                  ? "text-amber-500 bg-amber-500/10"
                  : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/50"
              )}
            >
              <Icon
                className={cn(
                  "h-7 w-7 transition-transform",
                  isActive && "scale-110"
                )}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <span
                className={cn(
                  "text-xs font-medium transition-all",
                  isActive && "font-semibold"
                )}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
