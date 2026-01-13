"use client";

import { ReactNode } from "react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
}

export function Header({ title, subtitle, icon }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/80 backdrop-blur-xl border-b border-slate-800/50 px-4 py-4">
      <div className="max-w-lg mx-auto flex items-center gap-3">
        {icon && (
          <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-amber-500/25">
            {icon}
          </div>
        )}
        <div>
          <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">{title}</h1>
          {subtitle && (
            <p className="text-sm text-slate-400">{subtitle}</p>
          )}
        </div>
      </div>
    </header>
  );
}
