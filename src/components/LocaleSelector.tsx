"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Globe,
  ChevronDown,
  X,
  Search,
  Check,
  MapPin,
  RefreshCw,
} from "lucide-react";
import {
  useLocale,
  CURRENCIES,
  LANGUAGES,
} from "@/contexts/LocaleContext";

interface SelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "currency" | "language";
}

function SelectorModal({ isOpen, onClose, type }: SelectorModalProps) {
  const {
    currency,
    language,
    setCurrency,
    setLanguage,
    t,
    autoDetectLocale,
    isDetecting,
    detectedCountry,
  } = useLocale();
  const [search, setSearch] = useState("");

  if (!isOpen) return null;

  const isCurrency = type === "currency";
  const items = isCurrency
    ? Object.values(CURRENCIES)
    : Object.values(LANGUAGES);
  const currentValue = isCurrency ? currency : language;

  const filteredItems = items.filter((item) => {
    const searchLower = search.toLowerCase();
    if (isCurrency) {
      const curr = item as (typeof CURRENCIES)[keyof typeof CURRENCIES];
      return (
        curr.code.toLowerCase().includes(searchLower) ||
        curr.name.toLowerCase().includes(searchLower) ||
        curr.symbol.toLowerCase().includes(searchLower)
      );
    } else {
      const lang = item as (typeof LANGUAGES)[keyof typeof LANGUAGES];
      return (
        lang.code.toLowerCase().includes(searchLower) ||
        lang.name.toLowerCase().includes(searchLower) ||
        lang.nativeName.toLowerCase().includes(searchLower)
      );
    }
  });

  const handleSelect = (code: string) => {
    if (isCurrency) {
      setCurrency(code);
    } else {
      setLanguage(code);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 bg-black/60 backdrop-blur-sm">
      <Card className="w-full max-w-lg max-h-[80vh] animate-in slide-in-from-bottom duration-300 flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between pb-2 flex-shrink-0">
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-amber-500" />
            {isCurrency ? t("selectCurrency") : t("selectLanguage")}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8"
          >
            <X className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4 flex-1 overflow-hidden flex flex-col">
          {/* Auto-detect button */}
          <Button
            variant="outline"
            onClick={autoDetectLocale}
            disabled={isDetecting}
            className="w-full justify-start gap-2"
          >
            {isDetecting ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <MapPin className="h-4 w-4 text-amber-500" />
            )}
            {isDetecting ? t("detecting") : t("autoDetect")}
            {detectedCountry && !isDetecting && (
              <span className="ml-auto text-xs text-slate-500">
                ({detectedCountry})
              </span>
            )}
          </Button>

          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder={`Search ${isCurrency ? "currencies" : "languages"}...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
            />
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto space-y-1 -mx-2 px-2">
            {filteredItems.map((item) => {
              const code = item.code;
              const isSelected = code === currentValue;

              return (
                <button
                  key={code}
                  onClick={() => handleSelect(code)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all touch-manipulation ${
                    isSelected
                      ? "bg-amber-500/20 border border-amber-500/50"
                      : "bg-slate-800/50 hover:bg-slate-700/50 border border-transparent"
                  }`}
                >
                  {isCurrency ? (
                    <>
                      <span className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-lg font-bold text-amber-500">
                        {(item as (typeof CURRENCIES)[keyof typeof CURRENCIES]).symbol}
                      </span>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-slate-100">
                          {(item as (typeof CURRENCIES)[keyof typeof CURRENCIES]).code}
                        </p>
                        <p className="text-sm text-slate-400">
                          {(item as (typeof CURRENCIES)[keyof typeof CURRENCIES]).name}
                        </p>
                      </div>
                    </>
                  ) : (
                    <>
                      <span className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-sm font-bold text-amber-500 uppercase">
                        {code}
                      </span>
                      <div className="flex-1 text-left">
                        <p className="font-medium text-slate-100">
                          {(item as (typeof LANGUAGES)[keyof typeof LANGUAGES]).nativeName}
                        </p>
                        <p className="text-sm text-slate-400">
                          {(item as (typeof LANGUAGES)[keyof typeof LANGUAGES]).name}
                        </p>
                      </div>
                    </>
                  )}
                  {isSelected && (
                    <Check className="h-5 w-5 text-amber-500 flex-shrink-0" />
                  )}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function LocaleSelector() {
  const { currency, language, currencySymbol, t } = useLocale();
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const currentLanguage = LANGUAGES[language];

  return (
    <>
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-base">
            <Globe className="h-4 w-4 text-amber-500" />
            {t("settings")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Currency Selector */}
          <button
            onClick={() => setShowCurrencyModal(true)}
            className="w-full flex items-center justify-between px-4 py-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl transition-colors touch-manipulation"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 bg-gradient-to-br from-amber-500 to-orange-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {currencySymbol}
              </span>
              <div className="text-left">
                <p className="text-xs text-slate-500">{t("currency")}</p>
                <p className="font-medium text-slate-100">
                  {currency} - {CURRENCIES[currency]?.name}
                </p>
              </div>
            </div>
            <ChevronDown className="h-5 w-5 text-slate-500" />
          </button>

          {/* Language Selector */}
          <button
            onClick={() => setShowLanguageModal(true)}
            className="w-full flex items-center justify-between px-4 py-3 bg-slate-800/50 hover:bg-slate-700/50 rounded-xl transition-colors touch-manipulation"
          >
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs uppercase">
                {language}
              </span>
              <div className="text-left">
                <p className="text-xs text-slate-500">{t("language")}</p>
                <p className="font-medium text-slate-100">
                  {currentLanguage?.nativeName} ({currentLanguage?.name})
                </p>
              </div>
            </div>
            <ChevronDown className="h-5 w-5 text-slate-500" />
          </button>
        </CardContent>
      </Card>

      <SelectorModal
        isOpen={showCurrencyModal}
        onClose={() => setShowCurrencyModal(false)}
        type="currency"
      />
      <SelectorModal
        isOpen={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
        type="language"
      />
    </>
  );
}
