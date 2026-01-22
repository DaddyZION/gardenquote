"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

// Comprehensive list of world currencies
export const CURRENCIES: Record<string, { code: string; symbol: string; name: string; locale: string }> = {
  USD: { code: "USD", symbol: "$", name: "US Dollar", locale: "en-US" },
  EUR: { code: "EUR", symbol: "€", name: "Euro", locale: "de-DE" },
  GBP: { code: "GBP", symbol: "£", name: "British Pound", locale: "en-GB" },
  JPY: { code: "JPY", symbol: "¥", name: "Japanese Yen", locale: "ja-JP" },
  AUD: { code: "AUD", symbol: "A$", name: "Australian Dollar", locale: "en-AU" },
  CAD: { code: "CAD", symbol: "C$", name: "Canadian Dollar", locale: "en-CA" },
  CHF: { code: "CHF", symbol: "Fr", name: "Swiss Franc", locale: "de-CH" },
  CNY: { code: "CNY", symbol: "¥", name: "Chinese Yuan", locale: "zh-CN" },
  INR: { code: "INR", symbol: "₹", name: "Indian Rupee", locale: "hi-IN" },
  MXN: { code: "MXN", symbol: "$", name: "Mexican Peso", locale: "es-MX" },
  BRL: { code: "BRL", symbol: "R$", name: "Brazilian Real", locale: "pt-BR" },
  KRW: { code: "KRW", symbol: "₩", name: "South Korean Won", locale: "ko-KR" },
  RUB: { code: "RUB", symbol: "₽", name: "Russian Ruble", locale: "ru-RU" },
  ZAR: { code: "ZAR", symbol: "R", name: "South African Rand", locale: "en-ZA" },
  SGD: { code: "SGD", symbol: "S$", name: "Singapore Dollar", locale: "en-SG" },
  HKD: { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar", locale: "zh-HK" },
  NOK: { code: "NOK", symbol: "kr", name: "Norwegian Krone", locale: "nb-NO" },
  SEK: { code: "SEK", symbol: "kr", name: "Swedish Krona", locale: "sv-SE" },
  DKK: { code: "DKK", symbol: "kr", name: "Danish Krone", locale: "da-DK" },
  NZD: { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar", locale: "en-NZ" },
  PLN: { code: "PLN", symbol: "zł", name: "Polish Zloty", locale: "pl-PL" },
  TRY: { code: "TRY", symbol: "₺", name: "Turkish Lira", locale: "tr-TR" },
  THB: { code: "THB", symbol: "฿", name: "Thai Baht", locale: "th-TH" },
  IDR: { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah", locale: "id-ID" },
  MYR: { code: "MYR", symbol: "RM", name: "Malaysian Ringgit", locale: "ms-MY" },
  PHP: { code: "PHP", symbol: "₱", name: "Philippine Peso", locale: "fil-PH" },
  VND: { code: "VND", symbol: "₫", name: "Vietnamese Dong", locale: "vi-VN" },
  AED: { code: "AED", symbol: "د.إ", name: "UAE Dirham", locale: "ar-AE" },
  SAR: { code: "SAR", symbol: "﷼", name: "Saudi Riyal", locale: "ar-SA" },
  ILS: { code: "ILS", symbol: "₪", name: "Israeli Shekel", locale: "he-IL" },
  EGP: { code: "EGP", symbol: "£", name: "Egyptian Pound", locale: "ar-EG" },
  NGN: { code: "NGN", symbol: "₦", name: "Nigerian Naira", locale: "en-NG" },
  KES: { code: "KES", symbol: "KSh", name: "Kenyan Shilling", locale: "sw-KE" },
  CLP: { code: "CLP", symbol: "$", name: "Chilean Peso", locale: "es-CL" },
  COP: { code: "COP", symbol: "$", name: "Colombian Peso", locale: "es-CO" },
  ARS: { code: "ARS", symbol: "$", name: "Argentine Peso", locale: "es-AR" },
  PEN: { code: "PEN", symbol: "S/", name: "Peruvian Sol", locale: "es-PE" },
  PKR: { code: "PKR", symbol: "₨", name: "Pakistani Rupee", locale: "ur-PK" },
  BDT: { code: "BDT", symbol: "৳", name: "Bangladeshi Taka", locale: "bn-BD" },
  UAH: { code: "UAH", symbol: "₴", name: "Ukrainian Hryvnia", locale: "uk-UA" },
  CZK: { code: "CZK", symbol: "Kč", name: "Czech Koruna", locale: "cs-CZ" },
  HUF: { code: "HUF", symbol: "Ft", name: "Hungarian Forint", locale: "hu-HU" },
  RON: { code: "RON", symbol: "lei", name: "Romanian Leu", locale: "ro-RO" },
};

// Supported languages
export const LANGUAGES: Record<string, { code: string; name: string; nativeName: string }> = {
  en: { code: "en", name: "English", nativeName: "English" },
  es: { code: "es", name: "Spanish", nativeName: "Español" },
  fr: { code: "fr", name: "French", nativeName: "Français" },
  de: { code: "de", name: "German", nativeName: "Deutsch" },
  it: { code: "it", name: "Italian", nativeName: "Italiano" },
  pt: { code: "pt", name: "Portuguese", nativeName: "Português" },
  nl: { code: "nl", name: "Dutch", nativeName: "Nederlands" },
  pl: { code: "pl", name: "Polish", nativeName: "Polski" },
  ru: { code: "ru", name: "Russian", nativeName: "Русский" },
  ja: { code: "ja", name: "Japanese", nativeName: "日本語" },
  ko: { code: "ko", name: "Korean", nativeName: "한국어" },
  zh: { code: "zh", name: "Chinese", nativeName: "中文" },
  ar: { code: "ar", name: "Arabic", nativeName: "العربية" },
  hi: { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  tr: { code: "tr", name: "Turkish", nativeName: "Türkçe" },
  th: { code: "th", name: "Thai", nativeName: "ไทย" },
  vi: { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt" },
  id: { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia" },
  ms: { code: "ms", name: "Malay", nativeName: "Bahasa Melayu" },
  sv: { code: "sv", name: "Swedish", nativeName: "Svenska" },
  no: { code: "no", name: "Norwegian", nativeName: "Norsk" },
  da: { code: "da", name: "Danish", nativeName: "Dansk" },
  fi: { code: "fi", name: "Finnish", nativeName: "Suomi" },
  cs: { code: "cs", name: "Czech", nativeName: "Čeština" },
  uk: { code: "uk", name: "Ukrainian", nativeName: "Українська" },
  he: { code: "he", name: "Hebrew", nativeName: "עברית" },
  el: { code: "el", name: "Greek", nativeName: "Ελληνικά" },
  ro: { code: "ro", name: "Romanian", nativeName: "Română" },
  hu: { code: "hu", name: "Hungarian", nativeName: "Magyar" },
  bg: { code: "bg", name: "Bulgarian", nativeName: "Български" },
};

// Country to currency mapping
const COUNTRY_TO_CURRENCY: Record<string, string> = {
  US: "USD", GB: "GBP", DE: "EUR", FR: "EUR", IT: "EUR", ES: "EUR", NL: "EUR",
  BE: "EUR", AT: "EUR", IE: "EUR", PT: "EUR", GR: "EUR", FI: "EUR", SK: "EUR",
  SI: "EUR", EE: "EUR", LV: "EUR", LT: "EUR", CY: "EUR", MT: "EUR", LU: "EUR",
  JP: "JPY", AU: "AUD", CA: "CAD", CH: "CHF", CN: "CNY", IN: "INR", MX: "MXN",
  BR: "BRL", KR: "KRW", RU: "RUB", ZA: "ZAR", SG: "SGD", HK: "HKD", NO: "NOK",
  SE: "SEK", DK: "DKK", NZ: "NZD", PL: "PLN", TR: "TRY", TH: "THB", ID: "IDR",
  MY: "MYR", PH: "PHP", VN: "VND", AE: "AED", SA: "SAR", IL: "ILS", EG: "EGP",
  NG: "NGN", KE: "KES", CL: "CLP", CO: "COP", AR: "ARS", PE: "PEN", PK: "PKR",
  BD: "BDT", UA: "UAH", CZ: "CZK", HU: "HUF", RO: "RON",
};

// Country to language mapping
const COUNTRY_TO_LANGUAGE: Record<string, string> = {
  US: "en", GB: "en", AU: "en", CA: "en", NZ: "en", IE: "en", ZA: "en", SG: "en",
  DE: "de", AT: "de", CH: "de", FR: "fr", BE: "fr", IT: "it", ES: "es", MX: "es",
  AR: "es", CL: "es", CO: "es", PE: "es", PT: "pt", BR: "pt", NL: "nl", PL: "pl",
  RU: "ru", JP: "ja", KR: "ko", CN: "zh", HK: "zh", TW: "zh", IN: "hi", SA: "ar",
  AE: "ar", EG: "ar", TR: "tr", TH: "th", VN: "vi", ID: "id", MY: "ms", SE: "sv",
  NO: "no", DK: "da", FI: "fi", CZ: "cs", UA: "uk", IL: "he", GR: "el", RO: "ro",
  HU: "hu", BG: "bg",
};

// Translation strings
export type TranslationKey = 
  | "appTitle" | "appSubtitle" | "newQuote" | "savedJobs" | "startEstimate"
  | "quickQuotes" | "features" | "instant" | "offline" | "share"
  | "realTimeCalc" | "worksAnywhere" | "whatsappReady" | "settings"
  | "currency" | "language" | "autoDetect" | "detecting" | "dimensions"
  | "length" | "width" | "depth" | "diggingOut" | "fencing" | "materials"
  | "quote" | "dayRate" | "days" | "labourCost" | "totalCost" | "clientPrice"
  | "send" | "save" | "reset" | "copy" | "copied" | "selectCurrency" | "selectLanguage"
  | "startFreshEstimate" | "viewPastEstimates" | "fenceCalculator" | "fenceLength"
  | "fenceHeight" | "gravelBoards" | "panels" | "posts" | "postcrete" | "postCaps"
  | "results" | "area" | "volume" | "slabs" | "subBase" | "sand" | "skips"
  | "materialsRequired" | "quoteSummary" | "validFor14Days" | "feedback"
  | "sendFeedback" | "bug" | "idea" | "general" | "whatAbout" | "rateExperience"
  | "message" | "cancel" | "install" | "installApp" | "installDescription";

const TRANSLATIONS: Record<string, Record<TranslationKey, string>> = {
  en: {
    appTitle: "InstaQuote",
    appSubtitle: "Your pocket estimator",
    newQuote: "New Quote",
    savedJobs: "Saved Jobs",
    startEstimate: "Start Estimating",
    quickQuotes: "Quick Quotes, On Site",
    features: "Features",
    instant: "Instant",
    offline: "Offline",
    share: "Share",
    realTimeCalc: "Real-time calculations",
    worksAnywhere: "Works anywhere",
    whatsappReady: "WhatsApp ready",
    settings: "Settings",
    currency: "Currency",
    language: "Language",
    autoDetect: "Auto-detect location",
    detecting: "Detecting...",
    dimensions: "Dimensions",
    length: "Length",
    width: "Width",
    depth: "Depth",
    diggingOut: "Digging Out?",
    fencing: "Fencing?",
    materials: "Materials",
    quote: "Quote",
    dayRate: "Day Rate",
    days: "days",
    labourCost: "Labour",
    totalCost: "Cost to You",
    clientPrice: "Price to Client",
    send: "Send",
    save: "Save",
    reset: "Reset",
    copy: "Copy",
    copied: "Copied!",
    selectCurrency: "Select Currency",
    selectLanguage: "Select Language",
    startFreshEstimate: "Start a fresh estimate",
    viewPastEstimates: "View past estimates",
    fenceCalculator: "Fence Calculator",
    fenceLength: "Fence Line Length",
    fenceHeight: "Fence Height",
    gravelBoards: "Gravel Boards",
    panels: "Panels",
    posts: "Posts",
    postcrete: "Postcrete",
    postCaps: "Post Caps",
    results: "Results",
    area: "Area",
    volume: "Volume",
    slabs: "Slabs (600x600)",
    subBase: "Sub-base",
    sand: "Sand",
    skips: "Skips needed",
    materialsRequired: "Materials Required",
    quoteSummary: "Quote Summary",
    validFor14Days: "This quote is valid for 14 days.",
    feedback: "Feedback",
    sendFeedback: "Send Feedback",
    bug: "Bug",
    idea: "Idea",
    general: "General",
    whatAbout: "What's this about?",
    rateExperience: "Rate your experience",
    message: "Message",
    cancel: "Cancel",
    install: "Install",
    installApp: "Install App",
    installDescription: "Add to home screen for quick access",
  },
  es: {
    appTitle: "InstaQuote",
    appSubtitle: "Tu estimador de bolsillo",
    newQuote: "Nueva Cotización",
    savedJobs: "Trabajos Guardados",
    startEstimate: "Comenzar a Estimar",
    quickQuotes: "Cotizaciones Rápidas, En Sitio",
    features: "Características",
    instant: "Instantáneo",
    offline: "Sin Conexión",
    share: "Compartir",
    realTimeCalc: "Cálculos en tiempo real",
    worksAnywhere: "Funciona en cualquier lugar",
    whatsappReady: "Listo para WhatsApp",
    settings: "Configuración",
    currency: "Moneda",
    language: "Idioma",
    autoDetect: "Detectar ubicación automáticamente",
    detecting: "Detectando...",
    dimensions: "Dimensiones",
    length: "Largo",
    width: "Ancho",
    depth: "Profundidad",
    diggingOut: "¿Excavando?",
    fencing: "¿Cercado?",
    materials: "Materiales",
    quote: "Cotización",
    dayRate: "Tarifa Diaria",
    days: "días",
    labourCost: "Mano de Obra",
    totalCost: "Costo para Ti",
    clientPrice: "Precio al Cliente",
    send: "Enviar",
    save: "Guardar",
    reset: "Reiniciar",
    copy: "Copiar",
    copied: "¡Copiado!",
    selectCurrency: "Seleccionar Moneda",
    selectLanguage: "Seleccionar Idioma",
    startFreshEstimate: "Iniciar una nueva estimación",
    viewPastEstimates: "Ver estimaciones anteriores",
    fenceCalculator: "Calculadora de Cercas",
    fenceLength: "Longitud de Cerca",
    fenceHeight: "Altura de Cerca",
    gravelBoards: "Tablas de Grava",
    panels: "Paneles",
    posts: "Postes",
    postcrete: "Postcrete",
    postCaps: "Tapas de Postes",
    results: "Resultados",
    area: "Área",
    volume: "Volumen",
    slabs: "Losas (600x600)",
    subBase: "Sub-base",
    sand: "Arena",
    skips: "Contenedores necesarios",
    materialsRequired: "Materiales Requeridos",
    quoteSummary: "Resumen de Cotización",
    validFor14Days: "Esta cotización es válida por 14 días.",
    feedback: "Comentarios",
    sendFeedback: "Enviar Comentarios",
    bug: "Error",
    idea: "Idea",
    general: "General",
    whatAbout: "¿De qué se trata?",
    rateExperience: "Califica tu experiencia",
    message: "Mensaje",
    cancel: "Cancelar",
    install: "Instalar",
    installApp: "Instalar App",
    installDescription: "Añadir a la pantalla de inicio para acceso rápido",
  },
  fr: {
    appTitle: "InstaQuote",
    appSubtitle: "Votre estimateur de poche",
    newQuote: "Nouveau Devis",
    savedJobs: "Travaux Sauvegardés",
    startEstimate: "Commencer l'Estimation",
    quickQuotes: "Devis Rapides, Sur Site",
    features: "Fonctionnalités",
    instant: "Instantané",
    offline: "Hors Ligne",
    share: "Partager",
    realTimeCalc: "Calculs en temps réel",
    worksAnywhere: "Fonctionne partout",
    whatsappReady: "Prêt pour WhatsApp",
    settings: "Paramètres",
    currency: "Devise",
    language: "Langue",
    autoDetect: "Détection automatique",
    detecting: "Détection...",
    dimensions: "Dimensions",
    length: "Longueur",
    width: "Largeur",
    depth: "Profondeur",
    diggingOut: "Creuser?",
    fencing: "Clôture?",
    materials: "Matériaux",
    quote: "Devis",
    dayRate: "Tarif Journalier",
    days: "jours",
    labourCost: "Main d'œuvre",
    totalCost: "Coût pour Vous",
    clientPrice: "Prix Client",
    send: "Envoyer",
    save: "Sauvegarder",
    reset: "Réinitialiser",
    copy: "Copier",
    copied: "Copié!",
    selectCurrency: "Sélectionner Devise",
    selectLanguage: "Sélectionner Langue",
    startFreshEstimate: "Démarrer une nouvelle estimation",
    viewPastEstimates: "Voir les estimations passées",
    fenceCalculator: "Calculateur de Clôture",
    fenceLength: "Longueur de Clôture",
    fenceHeight: "Hauteur de Clôture",
    gravelBoards: "Planches de Gravier",
    panels: "Panneaux",
    posts: "Poteaux",
    postcrete: "Postcrete",
    postCaps: "Capuchons",
    results: "Résultats",
    area: "Surface",
    volume: "Volume",
    slabs: "Dalles (600x600)",
    subBase: "Sous-couche",
    sand: "Sable",
    skips: "Bennes nécessaires",
    materialsRequired: "Matériaux Requis",
    quoteSummary: "Résumé du Devis",
    validFor14Days: "Ce devis est valable 14 jours.",
    feedback: "Commentaires",
    sendFeedback: "Envoyer Commentaires",
    bug: "Bug",
    idea: "Idée",
    general: "Général",
    whatAbout: "De quoi s'agit-il?",
    rateExperience: "Évaluez votre expérience",
    message: "Message",
    cancel: "Annuler",
    install: "Installer",
    installApp: "Installer l'App",
    installDescription: "Ajouter à l'écran d'accueil pour un accès rapide",
  },
  de: {
    appTitle: "InstaQuote",
    appSubtitle: "Ihr Taschenrechner",
    newQuote: "Neues Angebot",
    savedJobs: "Gespeicherte Jobs",
    startEstimate: "Schätzung Starten",
    quickQuotes: "Schnelle Angebote, Vor Ort",
    features: "Funktionen",
    instant: "Sofort",
    offline: "Offline",
    share: "Teilen",
    realTimeCalc: "Echtzeit-Berechnungen",
    worksAnywhere: "Funktioniert überall",
    whatsappReady: "WhatsApp-fähig",
    settings: "Einstellungen",
    currency: "Währung",
    language: "Sprache",
    autoDetect: "Standort automatisch erkennen",
    detecting: "Erkennung...",
    dimensions: "Abmessungen",
    length: "Länge",
    width: "Breite",
    depth: "Tiefe",
    diggingOut: "Ausheben?",
    fencing: "Zaun?",
    materials: "Materialien",
    quote: "Angebot",
    dayRate: "Tagessatz",
    days: "Tage",
    labourCost: "Arbeitskosten",
    totalCost: "Ihre Kosten",
    clientPrice: "Kundenpreis",
    send: "Senden",
    save: "Speichern",
    reset: "Zurücksetzen",
    copy: "Kopieren",
    copied: "Kopiert!",
    selectCurrency: "Währung Auswählen",
    selectLanguage: "Sprache Auswählen",
    startFreshEstimate: "Neue Schätzung starten",
    viewPastEstimates: "Vergangene Schätzungen ansehen",
    fenceCalculator: "Zaun-Rechner",
    fenceLength: "Zaunlänge",
    fenceHeight: "Zaunhöhe",
    gravelBoards: "Kiesbretter",
    panels: "Paneele",
    posts: "Pfosten",
    postcrete: "Pfostenbeton",
    postCaps: "Pfostenkappen",
    results: "Ergebnisse",
    area: "Fläche",
    volume: "Volumen",
    slabs: "Platten (600x600)",
    subBase: "Unterbau",
    sand: "Sand",
    skips: "Container benötigt",
    materialsRequired: "Benötigte Materialien",
    quoteSummary: "Angebotszusammenfassung",
    validFor14Days: "Dieses Angebot ist 14 Tage gültig.",
    feedback: "Feedback",
    sendFeedback: "Feedback Senden",
    bug: "Fehler",
    idea: "Idee",
    general: "Allgemein",
    whatAbout: "Worum geht es?",
    rateExperience: "Bewerten Sie Ihre Erfahrung",
    message: "Nachricht",
    cancel: "Abbrechen",
    install: "Installieren",
    installApp: "App Installieren",
    installDescription: "Zum Startbildschirm hinzufügen für schnellen Zugriff",
  },
  pt: {
    appTitle: "InstaQuote",
    appSubtitle: "Seu estimador de bolso",
    newQuote: "Novo Orçamento",
    savedJobs: "Trabalhos Salvos",
    startEstimate: "Iniciar Estimativa",
    quickQuotes: "Orçamentos Rápidos, No Local",
    features: "Recursos",
    instant: "Instantâneo",
    offline: "Offline",
    share: "Compartilhar",
    realTimeCalc: "Cálculos em tempo real",
    worksAnywhere: "Funciona em qualquer lugar",
    whatsappReady: "Pronto para WhatsApp",
    settings: "Configurações",
    currency: "Moeda",
    language: "Idioma",
    autoDetect: "Detectar localização automaticamente",
    detecting: "Detectando...",
    dimensions: "Dimensões",
    length: "Comprimento",
    width: "Largura",
    depth: "Profundidade",
    diggingOut: "Escavando?",
    fencing: "Cerca?",
    materials: "Materiais",
    quote: "Orçamento",
    dayRate: "Diária",
    days: "dias",
    labourCost: "Mão de Obra",
    totalCost: "Custo para Você",
    clientPrice: "Preço ao Cliente",
    send: "Enviar",
    save: "Salvar",
    reset: "Reiniciar",
    copy: "Copiar",
    copied: "Copiado!",
    selectCurrency: "Selecionar Moeda",
    selectLanguage: "Selecionar Idioma",
    startFreshEstimate: "Iniciar nova estimativa",
    viewPastEstimates: "Ver estimativas anteriores",
    fenceCalculator: "Calculadora de Cercas",
    fenceLength: "Comprimento da Cerca",
    fenceHeight: "Altura da Cerca",
    gravelBoards: "Tábuas de Cascalho",
    panels: "Painéis",
    posts: "Postes",
    postcrete: "Postcrete",
    postCaps: "Tampas de Postes",
    results: "Resultados",
    area: "Área",
    volume: "Volume",
    slabs: "Lajes (600x600)",
    subBase: "Sub-base",
    sand: "Areia",
    skips: "Caçambas necessárias",
    materialsRequired: "Materiais Necessários",
    quoteSummary: "Resumo do Orçamento",
    validFor14Days: "Este orçamento é válido por 14 dias.",
    feedback: "Feedback",
    sendFeedback: "Enviar Feedback",
    bug: "Bug",
    idea: "Ideia",
    general: "Geral",
    whatAbout: "Sobre o quê?",
    rateExperience: "Avalie sua experiência",
    message: "Mensagem",
    cancel: "Cancelar",
    install: "Instalar",
    installApp: "Instalar App",
    installDescription: "Adicionar à tela inicial para acesso rápido",
  },
};

interface LocaleContextType {
  currency: string;
  language: string;
  currencySymbol: string;
  setCurrency: (code: string) => void;
  setLanguage: (code: string) => void;
  formatCurrency: (amount: number) => string;
  t: (key: TranslationKey) => string;
  autoDetectLocale: () => Promise<void>;
  isDetecting: boolean;
  detectedCountry: string | null;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

const LOCALE_STORAGE_KEY = "instaquote_locale";

interface LocaleProviderProps {
  children: ReactNode;
}

export function LocaleProvider({ children }: LocaleProviderProps) {
  const [currency, setCurrencyState] = useState<string>("GBP");
  const [language, setLanguageState] = useState<string>("en");
  const [isDetecting, setIsDetecting] = useState(false);
  const [detectedCountry, setDetectedCountry] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load saved locale from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (saved) {
      try {
        const data = JSON.parse(saved);
        if (data.currency && CURRENCIES[data.currency]) {
          setCurrencyState(data.currency);
        }
        if (data.language && LANGUAGES[data.language]) {
          setLanguageState(data.language);
        }
        if (data.detectedCountry) {
          setDetectedCountry(data.detectedCountry);
        }
        setIsInitialized(true);
      } catch {
        setIsInitialized(true);
      }
    } else {
      // Auto-detect on first visit
      autoDetectLocale().then(() => setIsInitialized(true));
    }
  }, []);

  // Save locale to localStorage whenever it changes
  useEffect(() => {
    if (isInitialized) {
      localStorage.setItem(
        LOCALE_STORAGE_KEY,
        JSON.stringify({ currency, language, detectedCountry })
      );
    }
  }, [currency, language, detectedCountry, isInitialized]);

  const setCurrency = useCallback((code: string) => {
    if (CURRENCIES[code]) {
      setCurrencyState(code);
    }
  }, []);

  const setLanguage = useCallback((code: string) => {
    if (LANGUAGES[code]) {
      setLanguageState(code);
    }
  }, []);

  const currencySymbol = CURRENCIES[currency]?.symbol || "£";

  const formatCurrency = useCallback(
    (amount: number): string => {
      const currencyInfo = CURRENCIES[currency];
      if (!currencyInfo) return `${amount.toFixed(2)}`;

      try {
        return new Intl.NumberFormat(currencyInfo.locale, {
          style: "currency",
          currency: currencyInfo.code,
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(amount);
      } catch {
        return `${currencyInfo.symbol}${amount.toFixed(2)}`;
      }
    },
    [currency]
  );

  const t = useCallback(
    (key: TranslationKey): string => {
      const translations = TRANSLATIONS[language] || TRANSLATIONS.en;
      return translations[key] || TRANSLATIONS.en[key] || key;
    },
    [language]
  );

  const autoDetectLocale = useCallback(async () => {
    setIsDetecting(true);
    try {
      // Try to get country from IP geolocation
      const response = await fetch("https://ipapi.co/json/", {
        signal: AbortSignal.timeout(5000),
      });
      
      if (response.ok) {
        const data = await response.json();
        const countryCode = data.country_code;
        
        if (countryCode) {
          setDetectedCountry(countryCode);
          
          // Set currency based on country
          const detectedCurrency = COUNTRY_TO_CURRENCY[countryCode];
          if (detectedCurrency && CURRENCIES[detectedCurrency]) {
            setCurrencyState(detectedCurrency);
          }
          
          // Set language based on country
          const detectedLanguage = COUNTRY_TO_LANGUAGE[countryCode];
          if (detectedLanguage && LANGUAGES[detectedLanguage]) {
            setLanguageState(detectedLanguage);
          }
        }
      }
    } catch {
      // Fallback: try to detect from browser settings
      try {
        const browserLang = navigator.language.split("-")[0];
        if (LANGUAGES[browserLang]) {
          setLanguageState(browserLang);
        }
        
        // Try to get timezone to guess country
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const timezoneCountry = getCountryFromTimezone(timezone);
        if (timezoneCountry) {
          setDetectedCountry(timezoneCountry);
          const detectedCurrency = COUNTRY_TO_CURRENCY[timezoneCountry];
          if (detectedCurrency && CURRENCIES[detectedCurrency]) {
            setCurrencyState(detectedCurrency);
          }
        }
      } catch {
        // Use defaults
      }
    } finally {
      setIsDetecting(false);
    }
  }, []);

  return (
    <LocaleContext.Provider
      value={{
        currency,
        language,
        currencySymbol,
        setCurrency,
        setLanguage,
        formatCurrency,
        t,
        autoDetectLocale,
        isDetecting,
        detectedCountry,
      }}
    >
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error("useLocale must be used within a LocaleProvider");
  }
  return context;
}

// Helper function to guess country from timezone
function getCountryFromTimezone(timezone: string): string | null {
  const timezoneCountryMap: Record<string, string> = {
    "America/New_York": "US", "America/Chicago": "US", "America/Los_Angeles": "US",
    "America/Denver": "US", "America/Phoenix": "US", "Pacific/Honolulu": "US",
    "Europe/London": "GB", "Europe/Paris": "FR", "Europe/Berlin": "DE",
    "Europe/Rome": "IT", "Europe/Madrid": "ES", "Europe/Amsterdam": "NL",
    "Europe/Brussels": "BE", "Europe/Vienna": "AT", "Europe/Dublin": "IE",
    "Europe/Lisbon": "PT", "Europe/Athens": "GR", "Europe/Helsinki": "FI",
    "Europe/Stockholm": "SE", "Europe/Oslo": "NO", "Europe/Copenhagen": "DK",
    "Europe/Warsaw": "PL", "Europe/Prague": "CZ", "Europe/Budapest": "HU",
    "Europe/Bucharest": "RO", "Europe/Sofia": "BG", "Europe/Kiev": "UA",
    "Europe/Moscow": "RU", "Europe/Istanbul": "TR", "Europe/Zurich": "CH",
    "Asia/Tokyo": "JP", "Asia/Seoul": "KR", "Asia/Shanghai": "CN",
    "Asia/Hong_Kong": "HK", "Asia/Singapore": "SG", "Asia/Bangkok": "TH",
    "Asia/Jakarta": "ID", "Asia/Kuala_Lumpur": "MY", "Asia/Manila": "PH",
    "Asia/Ho_Chi_Minh": "VN", "Asia/Kolkata": "IN", "Asia/Dubai": "AE",
    "Asia/Riyadh": "SA", "Asia/Jerusalem": "IL", "Asia/Karachi": "PK",
    "Asia/Dhaka": "BD", "Africa/Cairo": "EG", "Africa/Lagos": "NG",
    "Africa/Nairobi": "KE", "Africa/Johannesburg": "ZA",
    "Australia/Sydney": "AU", "Australia/Melbourne": "AU", "Australia/Brisbane": "AU",
    "Australia/Perth": "AU", "Pacific/Auckland": "NZ",
    "America/Toronto": "CA", "America/Vancouver": "CA", "America/Montreal": "CA",
    "America/Mexico_City": "MX", "America/Sao_Paulo": "BR", "America/Buenos_Aires": "AR",
    "America/Santiago": "CL", "America/Bogota": "CO", "America/Lima": "PE",
  };
  
  return timezoneCountryMap[timezone] || null;
}
