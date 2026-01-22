"use client";

import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, FolderOpen, Zap, Sparkles, Clock, Send, ArrowRight } from "lucide-react";
import { InstallButton } from "@/components/InstallButton";
import { LocaleSelector } from "@/components/LocaleSelector";
import { useLocale } from "@/contexts/LocaleContext";
import Link from "next/link";

export default function HomePage() {
  const { t } = useLocale();
  
  return (
    <>
      <Header
        title={t("appTitle")}
        subtitle={t("appSubtitle")}
        icon={<Zap className="h-7 w-7" />}
      />

      <main className="px-4 py-6 max-w-lg mx-auto">
        {/* Locale Settings */}
        <div className="mb-6">
          <LocaleSelector />
        </div>
        
        {/* Hero Section */}
        <div className="text-center py-8">
          <div className="relative inline-flex items-center justify-center w-24 h-24 mb-6">
            {/* Animated gradient ring */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 animate-spin-slow opacity-75 blur-sm" />
            <div className="relative w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center border-2 border-amber-500/50">
              <Zap className="h-10 w-10 text-amber-500" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500 mb-3">
            {t("quickQuotes")}
          </h2>
          <p className="text-slate-400 max-w-xs mx-auto leading-relaxed">
            {t("realTimeCalc")} — {t("worksAnywhere")}
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4">
          <Link href="/new-quote" className="block">
            <Card className="group hover:border-amber-500/50 transition-all cursor-pointer active:scale-[0.98] touch-manipulation overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="flex items-center gap-4 py-5 relative">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg shadow-amber-500/25">
                  <Calculator className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-100">{t("newQuote")}</h3>
                  <p className="text-sm text-slate-400">{t("startFreshEstimate")}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-amber-500 group-hover:translate-x-1 transition-transform" />
              </CardContent>
            </Card>
          </Link>

          <Link href="/saved-jobs" className="block">
            <Card className="group hover:border-emerald-500/50 transition-all cursor-pointer active:scale-[0.98] touch-manipulation overflow-hidden relative">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
              <CardContent className="flex items-center gap-4 py-5 relative">
                <div className="flex-shrink-0 w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <FolderOpen className="h-7 w-7 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-slate-100">{t("savedJobs")}</h3>
                  <p className="text-sm text-slate-400">{t("viewPastEstimates")}</p>
                </div>
                <ArrowRight className="h-5 w-5 text-emerald-500 group-hover:translate-x-1 transition-transform" />
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Features */}
        <div className="mt-10 pt-8 border-t border-slate-800/50">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">
              {t("features")}
            </h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <FeatureCard
              icon={<Zap className="h-6 w-6" />}
              title={t("instant")}
              description={t("realTimeCalc")}
              color="amber"
            />
            <FeatureCard
              icon={<Clock className="h-6 w-6" />}
              title={t("offline")}
              description={t("worksAnywhere")}
              color="blue"
            />
            <FeatureCard
              icon={<Send className="h-6 w-6" />}
              title={t("share")}
              description={t("whatsappReady")}
              color="emerald"
            />
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8">
          <Link href="/new-quote">
            <Button size="lg" className="w-full group bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-lg shadow-amber-500/25">
              <Calculator className="h-5 w-5 mr-2" />
              {t("startEstimate")}
              <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Install App */}
        <div className="mt-6 mb-8">
          <InstallButton />
        </div>
      </main>
    </>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  color,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: "amber" | "blue" | "emerald";
}) {
  const colors = {
    amber: "from-amber-500/20 to-orange-500/20 text-amber-500 border-amber-500/20",
    blue: "from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/20",
    emerald: "from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/20",
  };

  return (
    <div className={`p-4 rounded-2xl bg-gradient-to-br ${colors[color]} border text-center`}>
      <div className="flex justify-center mb-2">{icon}</div>
      <p className="text-sm font-semibold text-slate-200">{title}</p>
      <p className="text-xs text-slate-500 mt-1">{description}</p>
    </div>
  );
}
