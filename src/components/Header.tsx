"use client";

import { ReactNode } from "react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
}

export function Header({ title, subtitle, icon }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-lg border-b border-slate-800 px-4 py-4">
      <div className="max-w-lg mx-auto flex items-center gap-3">
        {icon && (
          <div className="flex-shrink-0 text-amber-500">{icon}</div>
        )}
        <div>
          <h1 className="text-xl font-bold text-slate-100">{title}</h1>
          {subtitle && (
            <p className="text-sm text-slate-400">{subtitle}</p>
          )}
        </div>
      </div>
    </header>
  );
}
