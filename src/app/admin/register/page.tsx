"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/components/providers/LanguageProvider";
import { useAuth } from "@/components/providers/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function RegisterPage() {
  const { t } = useI18n();
  const router = useRouter();
  const { register, isLoading } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (password !== confirmPassword) {
      setError(t("auth.passwordsMismatch"));
      return;
    }

    try {
      await register(email, password, name);
      router.push("/admin/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
      <div className="w-full max-w-md">
        <div className="bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 rounded-lg p-8 space-y-6">
          {/* Logo / Title */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-white">HypStay</h1>
            <p className="text-zinc-400">{t("auth.registerTitle")}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name Field */}
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-zinc-200">
                {t("auth.fullName")}
              </label>
              <Input
                id="name"
                type="text"
                placeholder={t("auth.namePlaceholder")}
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={isLoading}
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              />
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-zinc-200">
                {t("auth.email")}
              </label>
              <Input
                id="email"
                type="email"
                placeholder={t("auth.emailPlaceholder")}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              />
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-medium text-zinc-200">
                {t("auth.password")}
              </label>
              <Input
                id="password"
                type="password"
                placeholder={t("auth.passwordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              />
              <p className="text-xs text-zinc-400">{t("auth.passwordHint")}</p>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-zinc-200">
                {t("auth.confirmPassword")}
              </label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder={t("auth.passwordPlaceholder")}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                disabled={isLoading}
                className="bg-zinc-800 border-zinc-700 text-white placeholder:text-zinc-500"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-900/30 border border-red-700/50 text-red-200 rounded-md text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || !name || !email || !password || !confirmPassword}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isLoading ? t("auth.registering") : t("auth.register")}
            </Button>
          </form>

          {/* Terms Info */}
          <div className="text-center text-xs text-zinc-500">
            {t("auth.byRegistering")}{" "}
            <Link href="#" className="text-zinc-400 hover:text-zinc-300">
              {t("auth.terms")}
            </Link>
          </div>

          {/* Login Link */}
          <div className="text-center text-sm">
            <span className="text-zinc-400">
              {t("auth.haveAccount")}{" "}
              <Link href="/admin/login" className="text-blue-500 hover:text-blue-400">
                {t("auth.login")}
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
