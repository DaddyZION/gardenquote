"use client";

// Animated background with subtle floating shapes
export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Gradient base */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800" />
      
      {/* Animated orbs */}
      <div className="absolute top-1/4 -left-20 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl animate-float-slow" />
      <div className="absolute top-3/4 -right-20 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl animate-float-medium" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/3 rounded-full blur-3xl animate-pulse-slow" />
      
      {/* Subtle grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(245, 158, 11, 0.5) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245, 158, 11, 0.5) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px',
        }}
      />
      
      {/* Floating particles */}
      <div className="absolute top-20 left-10 w-2 h-2 bg-amber-500/20 rounded-full animate-float-particle-1" />
      <div className="absolute top-40 right-20 w-1.5 h-1.5 bg-amber-500/15 rounded-full animate-float-particle-2" />
      <div className="absolute top-60 left-1/3 w-1 h-1 bg-emerald-500/20 rounded-full animate-float-particle-3" />
      <div className="absolute bottom-40 right-1/4 w-2 h-2 bg-amber-500/10 rounded-full animate-float-particle-1" />
      <div className="absolute bottom-60 left-20 w-1.5 h-1.5 bg-emerald-500/15 rounded-full animate-float-particle-2" />
    </div>
  );
}
