"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  ChevronDown,
  FileText,
  Headphones,
  Home,
  PlayCircle,
  ReceiptText,
  Users,
  Building,
  Globe,
  LayoutDashboard,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DonateDialog } from "@/components/shared/DonateDialog";
import { useI18n } from "@/components/providers/LanguageProvider";
import { useAuth } from "@/components/providers/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BrandLogo, DashboardMockup, PhoneMockup } from "./DashboardMockup";

const primaryBtn =
  "rounded-full bg-green-700 text-white shadow-lg shadow-green-700/20 hover:bg-green-800";
const outlineBtn =
  "rounded-full border-2 border-green-700 bg-white text-green-700 hover:bg-green-50 hover:text-green-800";

export function LandingPageContent() {
  const { language, setLanguage, t } = useI18n();
  const { isAuthenticated } = useAuth();

  const navLinks = [
    { href: "#how-it-works", label: t("home.nav.howItWorks") },
    { href: "#pricing", label: t("home.nav.pricing") },
    { href: "#faq", label: t("home.nav.faq") },
  ];

  const featureStrip = [
    { icon: Home, label: t("home.strip.rooms") },
    { icon: Users, label: t("home.strip.tenants") },
    { icon: FileText, label: t("home.strip.contracts") },
    { icon: ReceiptText, label: t("home.strip.invoices") },
    { icon: BarChart3, label: t("home.strip.reports") },
  ];

  const values = [
    { icon: Home, title: t("home.value.item1Title"), desc: t("home.value.item1Desc") },
    { icon: Users, title: t("home.value.item2Title"), desc: t("home.value.item2Desc") },
    { icon: ReceiptText, title: t("home.value.item3Title"), desc: t("home.value.item3Desc") },
  ];

  const steps = [
    { icon: Home, title: t("home.steps.step1Title"), desc: t("home.steps.step1Desc") },
    { icon: Users, title: t("home.steps.step2Title"), desc: t("home.steps.step2Desc") },
    { icon: FileText, title: t("home.steps.step3Title"), desc: t("home.steps.step3Desc") },
  ];

  const faqs = [1, 2, 3].map((n) => ({ q: t(`home.faq.q${n}`), a: t(`home.faq.a${n}`) }));

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-white text-slate-900" suppressHydrationWarning>
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-100/70 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-8 px-4 sm:px-6 lg:h-20">
          <Link href="/" aria-label="HypStay">
            <BrandLogo className="text-xl" />
          </Link>

          <nav className="hidden items-center gap-7 text-sm font-medium text-slate-700 lg:flex">
            <DropdownMenu>
              <DropdownMenuTrigger
                nativeButton
                render={
                  <button className="flex cursor-pointer items-center gap-1 border-none bg-transparent outline-none transition-colors hover:text-green-700">
                    {t("home.nav.features")}
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                }
              />
              <DropdownMenuContent align="start">
                {featureStrip.map((f) => (
                  <DropdownMenuItem key={f.label} className="gap-2" onClick={() => (window.location.hash = "features")}>
                    <f.icon className="h-4 w-4 text-green-700" />
                    {f.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="transition-colors hover:text-green-700">
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-2 sm:gap-3">
            <DropdownMenu>
              <DropdownMenuTrigger
                nativeButton
                render={
                  <button className="flex cursor-pointer items-center gap-1.5 rounded-full border-none bg-transparent px-2.5 py-2 text-sm font-medium outline-none transition-colors hover:bg-slate-100">
                    <Globe className="h-4 w-4" />
                    <span className="uppercase">{language}</span>
                  </button>
                }
              />
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setLanguage("vi")} className="gap-2">
                  <span className="text-lg">🇻🇳</span> Tiếng Việt
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setLanguage("en")} className="gap-2">
                  <span className="text-lg">🇬🇧</span> English
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {isAuthenticated ? (
              <Link href="/admin/dashboard">
                <Button className={`${primaryBtn} h-10 gap-2 px-5`}>
                  <LayoutDashboard className="h-4 w-4" />
                  {t("home.nav.dashboard")}
                </Button>
              </Link>
            ) : (
              <>
                <Link href="/admin/login" className="hidden sm:block">
                  <Button variant="outline" className="h-10 rounded-full border-green-700/40 px-5 text-slate-800 hover:bg-green-50">
                    {t("home.nav.login")}
                  </Button>
                </Link>
                <Link href="/admin/register">
                  <Button className={`${primaryBtn} h-10 gap-1.5 px-5`}>
                    {t("home.nav.getStarted")}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero */}
        <section className="relative overflow-hidden bg-gradient-to-b from-green-50/80 via-white to-white pb-24 pt-12 lg:pb-32 lg:pt-16">
          <div className="pointer-events-none absolute -right-32 -top-24 h-[480px] w-[480px] rounded-full bg-green-200/40 blur-3xl" />
          <div className="pointer-events-none absolute -left-40 bottom-0 h-[360px] w-[360px] rounded-full bg-emerald-100/60 blur-3xl" />
          <svg className="pointer-events-none absolute inset-x-0 bottom-0 h-24 w-full text-green-50" viewBox="0 0 1440 96" preserveAspectRatio="none" aria-hidden>
            <path fill="currentColor" d="M0 64 C240 16 480 96 720 56 C960 16 1200 80 1440 40 V96 H0 Z" />
          </svg>

          <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-[1.05fr_1fr]">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl lg:text-[2.5rem] xl:text-[2.75rem]">
                <span className="text-green-800">{t("home.hero.title1")}</span>
                <br />
                <span className="text-slate-900">{t("home.hero.title2")}</span>
              </h1>
              <p className="mx-auto mt-5 max-w-lg text-lg leading-relaxed text-slate-600 lg:mx-0">
                {t("home.hero.desc")}
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start">
                <Link href="/admin/register">
                  <Button size="lg" className={`${primaryBtn} h-12 w-full gap-2 px-7 text-base sm:w-auto`}>
                    {t("home.hero.ctaPrimary")}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="#features">
                  <Button size="lg" variant="outline" className={`${outlineBtn} h-12 w-full gap-2 px-7 text-base sm:w-auto`}>
                    <PlayCircle className="h-5 w-5" />
                    {t("home.hero.ctaSecondary")}
                  </Button>
                </Link>
              </div>
            </div>

            <div className="relative">
              <Building className="pointer-events-none absolute -right-10 -top-10 hidden h-64 w-64 text-green-100 xl:block" strokeWidth={1} />
              <DashboardMockup className="relative text-[11px] sm:text-[15px] lg:text-[16px]" />
            </div>
          </div>
        </section>

        {/* Feature strip */}
        <section id="features" className="relative z-10 -mt-14 scroll-mt-24 px-4 sm:px-6">
          <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-4 rounded-2xl border border-slate-100 bg-white p-4 shadow-xl shadow-slate-900/5 sm:grid-cols-3 lg:grid-cols-5 lg:divide-x lg:divide-slate-100 lg:p-5">
            {featureStrip.map((f) => (
              <div key={f.label} className="flex items-center justify-center gap-3 text-sm font-semibold text-slate-800">
                <f.icon className="h-6 w-6 text-green-700" />
                {f.label}
              </div>
            ))}
          </div>
        </section>

        {/* Value */}
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("home.value.title")}</h2>
            <p className="mt-3 text-slate-600">{t("home.value.subtitle")}</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {values.map((v) => (
              <div key={v.title} className="flex items-start gap-5 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-lg hover:shadow-green-900/5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-green-50">
                  <v.icon className="h-8 w-8 text-green-700" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{v.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-500">{v.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Operations overview */}
        <section className="relative overflow-hidden bg-gradient-to-r from-white via-green-50/60 to-green-50 py-20">
          <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div className="text-center lg:text-left">
              <h2 className="text-3xl font-bold leading-tight tracking-tight sm:text-4xl">{t("home.ops.title")}</h2>
              <p className="mx-auto mt-5 max-w-md text-lg leading-relaxed text-slate-600 lg:mx-0">{t("home.ops.desc")}</p>
              <Link href="/admin/register">
                <Button size="lg" className={`${primaryBtn} mt-8 h-12 gap-2 px-7 text-base`}>
                  {t("home.ops.cta")}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="relative flex items-end justify-center">
              {/* Laptop */}
              <div className="w-full max-w-xl">
                <div className="rounded-t-2xl border-[10px] border-b-0 border-slate-800 bg-slate-800">
                  <DashboardMockup className="rounded-lg text-[9px] shadow-none sm:text-[12px]" />
                </div>
                <div className="mx-auto h-3 w-[110%] -translate-x-[4.5%] rounded-b-2xl bg-gradient-to-b from-slate-300 to-slate-400" />
              </div>
              {/* Phone */}
              <PhoneMockup className="absolute -bottom-6 left-0 w-[34%] -rotate-6 text-[8px] sm:text-[11px] lg:-left-10" />
            </div>
          </div>
        </section>

        {/* Steps */}
        <section id="how-it-works" className="mx-auto max-w-6xl scroll-mt-24 px-4 py-20 sm:px-6">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">{t("home.steps.title")}</h2>
            <p className="mt-3 text-slate-600">{t("home.steps.subtitle")}</p>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {steps.map((s, i) => (
              <div key={s.title} className="flex flex-col items-center rounded-2xl border border-slate-100 bg-white p-6 text-center shadow-sm">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-700 text-xs font-bold text-white">
                  {i + 1}
                </span>
                <div className="mt-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-50">
                  <s.icon className="h-6 w-6 text-green-700" />
                </div>
                <h3 className="mt-3 font-semibold">{s.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Choose */}
        <section id="pricing" className="mx-auto max-w-6xl scroll-mt-24 px-4 pb-20 sm:px-6">
          <h2 className="text-center text-3xl font-bold tracking-tight sm:text-4xl">{t("home.choose.title")}</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <ChoiceCard
              icon={Home}
              title={t("home.choose.exploreTitle")}
              desc={t("home.choose.exploreDesc")}
              cta={
                <Link href="/admin/register">
                  <Button className={`${primaryBtn} h-11 w-full gap-2`}>
                    {t("home.choose.exploreCta")}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              }
            />
            <ChoiceCard
              icon={Headphones}
              title={t("home.choose.contactTitle")}
              desc={t("home.choose.contactDesc")}
              cta={
                <Link href="/community">
                  <Button variant="outline" className={`${outlineBtn} h-11 w-full gap-2`}>
                    {t("home.choose.contactCta")}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              }
            />
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto grid max-w-6xl scroll-mt-24 gap-8 px-4 pb-20 sm:px-6 lg:grid-cols-[0.6fr_1.4fr]">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">{t("home.faq.title")}</h2>
            <p className="mt-3 max-w-xs text-slate-500">{t("home.faq.desc")}</p>
          </div>
          <div className="space-y-3">
            {faqs.map((f) => (
              <details key={f.q} className="group rounded-xl border border-slate-200 bg-white px-5 py-4 open:shadow-sm">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <ChevronDown className="h-4 w-4 shrink-0 text-slate-500 transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA banner */}
        <section className="px-4 pb-16 sm:px-6">
          <div className="relative mx-auto flex max-w-6xl flex-col items-center gap-6 overflow-hidden rounded-3xl bg-gradient-to-r from-green-800 via-green-700 to-green-600 px-8 py-10 text-center sm:flex-row sm:justify-between sm:text-left lg:px-24">
            <Home className="pointer-events-none absolute -bottom-8 right-6 h-40 w-40 text-white/10" strokeWidth={1.5} />
            <div className="relative">
              <h2 className="text-2xl font-bold text-white sm:text-3xl">{t("home.cta.title")}</h2>
              <p className="mt-2 text-green-50/90">{t("home.cta.desc")}</p>
            </div>
            <Link href="/admin/register" className="relative">
              <Button size="lg" className="h-12 gap-2 rounded-full bg-white px-7 text-base font-semibold text-slate-900 hover:bg-green-50">
                {t("home.cta.button")}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-100">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-4 py-8 sm:px-6 md:flex-row">
          <Link href="/" aria-label="HypStay">
            <BrandLogo className="text-xl" />
          </Link>
          <nav className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm text-slate-700 md:ml-12">
            <Link href="#features" className="hover:text-green-700">{t("home.nav.features")}</Link>
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-green-700">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3 md:ml-auto">
            <DonateDialog />
            <a href="#" aria-label="Facebook" className="text-slate-900 transition-colors hover:text-green-700">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
                <path d="M12 2C6.48 2 2 6.48 2 12c0 4.99 3.66 9.13 8.44 9.88v-6.99H7.9V12h2.54V9.8c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99C18.34 21.13 22 16.99 22 12c0-5.52-4.48-10-10-10z" />
              </svg>
            </a>
            <a href="#" aria-label="YouTube" className="text-slate-900 transition-colors hover:text-green-700">
              <svg viewBox="0 0 24 24" className="h-6 w-6" fill="currentColor" aria-hidden>
                <path d="M21.58 7.19a2.5 2.5 0 0 0-1.76-1.77C18.25 5 12 5 12 5s-6.25 0-7.82.42A2.5 2.5 0 0 0 2.42 7.2C2 8.76 2 12 2 12s0 3.24.42 4.81a2.5 2.5 0 0 0 1.76 1.77C5.75 19 12 19 12 19s6.25 0 7.82-.42a2.5 2.5 0 0 0 1.76-1.77C22 15.24 22 12 22 12s0-3.24-.42-4.81zM10 15V9l5.2 3L10 15z" />
              </svg>
            </a>
          </div>
        </div>
        <p className="border-t border-slate-100 py-5 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} HypStay. {t("home.footer.rights")}
        </p>
      </footer>
    </div>
  );
}

function ChoiceCard({
  icon: Icon,
  title,
  desc,
  cta,
}: {
  icon: typeof Home;
  title: string;
  desc: string;
  cta: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center gap-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:flex-row">
      <div className="flex h-32 w-32 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-green-50 to-green-100">
        <Icon className="h-16 w-16 text-green-700" strokeWidth={1.5} />
      </div>
      <div className="w-full text-center sm:text-left">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="mt-1 text-sm text-slate-500">{desc}</p>
        <div className="mt-4">{cta}</div>
      </div>
    </div>
  );
}
