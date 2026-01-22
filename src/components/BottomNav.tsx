"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, PlusCircle, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale, type TranslationKey } from "@/contexts/LocaleContext";

interface NavItem {
  href: string;
  labelKey: TranslationKey;
  icon: typeof Home;
}

const navItems: NavItem[] = [
  {
    href: "/",
    labelKey: "appTitle",
    icon: Home,
  },
  {
    href: "/new-quote",
    labelKey: "newQuote",
    icon: PlusCircle,
  },
  {
    href: "/saved-jobs",
    labelKey: "savedJobs",
    icon: FolderOpen,
  },
];

export function BottomNav() {
  const pathname = usePathname();
  const { t } = useLocale();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-slate-900/90 backdrop-blur-xl border-t border-slate-800/50 safe-area-inset-bottom">
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
                  ? "text-amber-500"
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              <div className={cn(
                "p-2 rounded-xl transition-all",
                isActive && "bg-gradient-to-br from-amber-500/20 to-orange-500/20"
              )}>
                <Icon
                  className={cn(
                    "h-6 w-6 transition-transform",
                    isActive && "scale-110"
                  )}
                  strokeWidth={isActive ? 2.5 : 2}
                />
              </div>
              <span
                className={cn(
                  "text-xs font-medium transition-all",
                  isActive && "font-semibold text-amber-500"
                )}
              >
                {t(item.labelKey)}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
