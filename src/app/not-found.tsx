"use client";

import Link from "next/link";
import { Building2, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

import { useI18n } from "@/components/providers/LanguageProvider";

export default function NotFound() {
  const { t } = useI18n();

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Simple Header */}
      <header className="px-4 lg:px-6 h-20 flex items-center border-b">
        <Link className="flex items-center justify-center" href="/">
          <div className="bg-blue-600 p-2 rounded-lg mr-2">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tighter text-slate-900">HypStay</span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-8">
          <div className="relative">
            <h1 className="text-9xl font-black text-blue-50 opacity-50">404</h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-blue-600 p-4 rounded-3xl shadow-2xl shadow-blue-200 animate-bounce">
                <Building2 className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-slate-900">{t("app.notFoundTitle")}</h2>
            <p className="text-slate-500 text-lg">
              {t("app.notFoundDesc")}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white w-full sm:w-auto rounded-xl shadow-lg shadow-blue-100">
                <Home className="mr-2 h-5 w-5" />
                {t("app.backToHome")}
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="rounded-xl w-full sm:w-auto" onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-5 w-5" />
              {t("app.goBack")}
            </Button>
          </div>
        </div>
      </main>

      {/* Simple Footer */}
      <footer className="w-full py-8 border-t text-center text-slate-400 text-sm">
        <p>© 2025 HypStay. {t("app.allRightsReserved")}</p>
      </footer>
    </div>
  );
}
