import { Header } from "@/components/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Leaf, Calculator, FolderOpen, Zap } from "lucide-react";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <Header
        title="GardenQuote"
        subtitle="Your pocket estimator"
        icon={<Leaf className="h-7 w-7" />}
      />

      <main className="px-4 py-6 max-w-lg mx-auto">
        {/* Hero Section */}
        <div className="text-center py-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-500/20 rounded-full mb-4">
            <Leaf className="h-10 w-10 text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-100 mb-2">
            Quick Quotes, On Site
          </h2>
          <p className="text-slate-400 max-w-xs mx-auto">
            Calculate materials, labour costs, and send professional quotes — 
            all from your phone.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-4">
          <Link href="/new-quote" className="block">
            <Card className="hover:border-amber-500/50 transition-all cursor-pointer active:scale-[0.98] touch-manipulation">
              <CardContent className="flex items-center gap-4 py-5">
                <div className="flex-shrink-0 w-14 h-14 bg-amber-500/20 rounded-2xl flex items-center justify-center">
                  <Calculator className="h-7 w-7 text-amber-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-100">New Quote</h3>
                  <p className="text-sm text-slate-400">Start a fresh estimate</p>
                </div>
                <div className="text-slate-500">→</div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/saved-jobs" className="block">
            <Card className="hover:border-amber-500/50 transition-all cursor-pointer active:scale-[0.98] touch-manipulation">
              <CardContent className="flex items-center gap-4 py-5">
                <div className="flex-shrink-0 w-14 h-14 bg-emerald-500/20 rounded-2xl flex items-center justify-center">
                  <FolderOpen className="h-7 w-7 text-emerald-500" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-100">Saved Jobs</h3>
                  <p className="text-sm text-slate-400">View past estimates</p>
                </div>
                <div className="text-slate-500">→</div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Features */}
        <div className="mt-8 pt-8 border-t border-slate-800">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wide mb-4">
            Features
          </h3>
          <div className="space-y-3">
            <FeatureItem
              icon={<Zap className="h-5 w-5 text-amber-500" />}
              title="Instant Calculations"
              description="Area, volume, materials — calculated as you type"
            />
            <FeatureItem
              icon={<span className="text-xl">📱</span>}
              title="Works Offline"
              description="Your data is saved locally on your device"
            />
            <FeatureItem
              icon={<span className="text-xl">💬</span>}
              title="WhatsApp Quotes"
              description="Send professional quotes directly to clients"
            />
          </div>
        </div>

        {/* CTA */}
        <div className="mt-8">
          <Link href="/new-quote">
            <Button size="lg" className="w-full">
              <Calculator className="h-5 w-5 mr-2" />
              Start Estimating
            </Button>
          </Link>
        </div>
      </main>
    </>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-shrink-0 mt-0.5">{icon}</div>
      <div>
        <p className="text-sm font-medium text-slate-200">{title}</p>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
    </div>
  );
}
