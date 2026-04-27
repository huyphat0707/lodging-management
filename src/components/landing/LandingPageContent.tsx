"use client";

import Link from "next/link";
import Image from "next/image";
import {
  CheckCircle2,
  Building2,
  FileText,
  CreditCard,
  BarChart3,
  ArrowRight,
  ShieldCheck,
  Zap,
  Clock,
  Users,
  LayoutDashboard,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { DonateDialog } from "@/components/shared/DonateDialog";
import { useI18n } from "@/components/providers/LanguageProvider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function LandingPageContent() {
  const { language, setLanguage, t } = useI18n();

  const features = [
    {
      title: t("landing.feature1Title"),
      desc: t("landing.feature1Desc"),
      icon: Users,
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: t("landing.feature2Title"),
      desc: t("landing.feature2Desc"),
      icon: FileText,
      color: "bg-purple-100 text-purple-600"
    },
    {
      title: t("landing.feature3Title"),
      desc: t("landing.feature3Desc"),
      icon: CreditCard,
      color: "bg-green-100 text-green-600"
    },
    {
      title: t("landing.feature4Title"),
      desc: t("landing.feature4Desc"),
      icon: BarChart3,
      color: "bg-orange-100 text-orange-600"
    },
    {
      title: t("landing.feature5Title"),
      desc: t("landing.feature5Desc"),
      icon: LayoutDashboard,
      color: "bg-indigo-100 text-indigo-600"
    },
    {
      title: t("landing.feature6Title"),
      desc: t("landing.feature6Desc"),
      icon: ShieldCheck,
      color: "bg-red-100 text-red-600"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white" suppressHydrationWarning>
      {/* Navigation */}
      <header className="px-4 lg:px-6 h-20 flex items-center border-b sticky top-0 bg-white/80 backdrop-blur-md z-50">
        <Link className="flex items-center justify-center" href="/">
          <div className="bg-blue-600 p-2 rounded-lg mr-2 shadow-lg shadow-blue-200">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold tracking-tighter text-slate-900">HypStay</span>
        </Link>
        <nav className="ml-auto flex gap-2 sm:gap-4 items-center">
          <Link className="text-sm font-medium hover:text-blue-600 transition-colors hidden lg:block" href="#features">
            {t("landing.viewFeatures")}
          </Link>

          {/* Language Switcher */}
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium hover:bg-slate-100 rounded-lg cursor-pointer transition-colors outline-none border-none bg-transparent">
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

          <DonateDialog />

          <Link href="/admin/login">
            <Button variant="ghost" className="text-slate-600 hidden sm:inline-flex">
              {t("landing.login")}
            </Button>
          </Link>
          <Link href="/admin/register">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 rounded-lg">
              {t("landing.getStarted")}
            </Button>
          </Link>
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-blue-50 to-white overflow-hidden">
          {/* Background decoration */}
          <div className="absolute top-20 right-0 -translate-y-1/2 translate-x-1/4 w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl opacity-30 -z-10 animate-pulse"></div>

          <div className="container px-4 md:px-6 mx-auto">
            <div className="grid gap-6 lg:grid-cols-[1fr_500px] lg:gap-12 xl:grid-cols-[1fr_600px] items-center">
              <div className="flex flex-col justify-center space-y-4 text-center lg:text-left">
                <div className="inline-block rounded-full bg-blue-100 px-4 py-1.5 text-sm font-semibold text-blue-700 w-fit mx-auto lg:mx-0">
                  {t("landing.noSetup")}
                </div>
                <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl xl:text-7xl/none text-slate-900">
                  {t("landing.heroTitle")} <br />
                  <span className="text-blue-600 drop-shadow-sm">{t("landing.heroSubtitle")}</span>
                </h1>
                <p className="max-w-[600px] text-slate-500 md:text-xl lg:text-2xl mx-auto lg:mx-0 leading-relaxed">
                  {t("landing.heroDesc")}
                </p>
                <div className="flex flex-col gap-3 min-[400px]:flex-row justify-center lg:justify-start pt-4">
                  <Link href="/admin/register">
                    <Button size="lg" className="h-16 px-10 bg-blue-600 hover:bg-blue-700 text-white text-xl rounded-xl shadow-2xl shadow-blue-300 group">
                      {t("landing.getStarted")}
                      <ArrowRight className="ml-2 h-6 w-6 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                  <Link href="#features">
                    <Button size="lg" variant="outline" className="h-16 px-10 text-xl rounded-xl border-slate-200 bg-white hover:bg-slate-50">
                      {t("landing.viewFeatures")}
                    </Button>
                  </Link>
                </div>
                <div className="flex items-center justify-center lg:justify-start gap-6 text-sm font-medium text-slate-500 pt-6">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    {t("landing.freeTrial")}
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    {t("landing.noSetup")}
                  </div>
                </div>
              </div>
              <div className="relative group perspective-1000">
                <div className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur-xl opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-100 transform transition-all duration-500 group-hover:scale-[1.02] group-hover:rotate-1">
                  <Image
                    src="/hero_property_management_1777278500733.png"
                    width={800}
                    height={800}
                    alt="Dashboard Preview"
                    className="object-cover w-full h-auto"
                    priority
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-24 bg-white relative">
          <div className="container px-4 md:px-6 mx-auto">
            <div className="text-center space-y-4 mb-20">
              <h2 className="text-3xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl text-slate-900">
                {t("landing.featureTitle")}
              </h2>
              <p className="max-w-[800px] text-slate-500 md:text-xl lg:text-2xl mx-auto leading-relaxed">
                {t("landing.featureSubtitle")}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {features.map((feature, idx) => (
                <div key={idx} className="group p-10 rounded-3xl border border-slate-100 bg-slate-50/30 hover:bg-white hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-100/50 transition-all duration-500 transform hover:-translate-y-2">
                  <div className={`w-16 h-16 rounded-2xl ${feature.color} flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-lg">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Social Proof Section */}
        <section className="w-full py-24 bg-slate-950 text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
            <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-500 to-transparent"></div>
            <div className="absolute top-0 left-2/4 w-px h-full bg-gradient-to-b from-transparent via-blue-500 to-transparent"></div>
            <div className="absolute top-0 left-3/4 w-px h-full bg-gradient-to-b from-transparent via-blue-500 to-transparent"></div>
          </div>

          <div className="container px-4 md:px-6 mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl mb-8 leading-tight">
                  {t("landing.socialProofTitle")}
                </h2>
                <div className="space-y-8">
                  {[
                    { title: t("landing.statRooms"), val: "20,000+", icon: Building2 },
                    { title: t("landing.statOwners"), val: "5,000+", icon: Users },
                    { title: t("landing.statSatisfaction"), val: "99.9%", icon: Zap }
                  ].map((item, idx) => (
                    <div key={idx} className="flex gap-6 items-center p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors">
                      <div className="bg-blue-600 p-3 rounded-xl shadow-lg shadow-blue-900/20">
                        <item.icon className="h-6 w-6" />
                      </div>
                      <div>
                        <div className="text-3xl font-bold text-white mb-1">{item.val}</div>
                        <div className="text-slate-400 text-lg">{item.title}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-blue-600/20 blur-[100px] rounded-full"></div>
                <div className="grid grid-cols-2 gap-6 relative">
                  {[
                    { label: t("landing.statRooms"), val: "20k+" },
                    { label: t("landing.statOwners"), val: "5k+" },
                    { label: t("landing.statSatisfaction"), val: "99%" },
                    { label: t("landing.statSupport"), val: "24/7" }
                  ].map((stat, i) => (
                    <div key={i} className="aspect-square flex flex-col items-center justify-center bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 p-6 text-center hover:scale-105 transition-transform duration-500">
                      <div className="text-4xl md:text-5xl font-black text-blue-400 mb-3">{stat.val}</div>
                      <div className="text-slate-300 font-medium">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-24 bg-blue-600 relative overflow-hidden shadow-inner">
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[800px] h-[800px] bg-blue-400 rounded-full blur-[120px] opacity-40"></div>
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-500 rounded-full blur-[120px] opacity-40"></div>

          <div className="container px-4 md:px-6 mx-auto relative z-10 text-center">
            <div className="max-w-4xl mx-auto space-y-8">
              <h2 className="text-4xl font-extrabold tracking-tighter sm:text-6xl text-white">
                {t("landing.ctaTitle")}
              </h2>
              <p className="text-blue-100 text-xl md:text-2xl opacity-90 leading-relaxed">
                {t("landing.ctaDesc")}
              </p>
              <div className="flex flex-col gap-4 sm:flex-row justify-center pt-8">
                <Link href="/admin/register">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 h-18 px-12 text-2xl rounded-2xl font-black shadow-2xl transition-all hover:scale-105 active:scale-95">
                    {t("landing.getStarted")}
                  </Button>
                </Link>
                <Link href="/admin/login">
                  <Button size="lg" variant="outline" className="border-2 border-white text-blue-600 h-18 px-12 text-2xl rounded-2xl font-bold backdrop-blur-sm">
                    {t("landing.login")}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full py-16 bg-slate-50 border-t border-slate-200">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center">
                <div className="bg-blue-600 p-2 rounded-xl mr-3 shadow-lg shadow-blue-100">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <span className="text-2xl font-bold tracking-tighter text-slate-900">HypStay</span>
              </div>
              <p className="text-slate-500 text-lg leading-relaxed">
                {t("landing.footerDesc")}
              </p>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6 text-lg">{t("landing.footerProduct")}</h4>
              <ul className="space-y-4 text-slate-500">
                <li><Link href="#features" className="hover:text-blue-600 transition-colors font-medium">{t("landing.viewFeatures")}</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors font-medium">{t("landing.footerPricing")}</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors font-medium">{t("landing.footerMobile")}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6 text-lg">{t("landing.footerSupport")}</h4>
              <ul className="space-y-4 text-slate-500">
                <li><Link href="#" className="hover:text-blue-600 transition-colors font-medium">{t("landing.footerManual")}</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors font-medium">{t("landing.footerHelp")}</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors font-medium">{t("landing.footerContact")}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-slate-900 mb-6 text-lg">{t("landing.footerCompany")}</h4>
              <ul className="space-y-4 text-slate-500">
                <li><Link href="#" className="hover:text-blue-600 transition-colors font-medium">{t("landing.footerAbout")}</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors font-medium">{t("landing.footerTerms")}</Link></li>
                <li><Link href="#" className="hover:text-blue-600 transition-colors font-medium">{t("landing.footerPrivacy")}</Link></li>
              </ul>
            </div>
          </div>
          <div className="pt-10 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center gap-6 text-slate-500 font-medium">
            <p>© 2025 HypStay. {t("app.allRightsReserved") ?? "Tất cả quyền được bảo lưu."}</p>
            <div className="flex gap-8">
              <Link href="#" className="hover:text-blue-600 transition-colors">Facebook</Link>
              <Link href="#" className="hover:text-blue-600 transition-colors">Zalo</Link>
              <Link href="#" className="hover:text-blue-600 transition-colors">Youtube</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
