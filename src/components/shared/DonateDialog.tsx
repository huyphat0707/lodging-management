"use client";

import Image from "next/image";
import { Coffee } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/components/providers/LanguageProvider";

export function DonateDialog() {
  const { t } = useI18n();

  const bankId = process.env.NEXT_PUBLIC_DONATE_BANK_ID || "MB";
  const accountNo = process.env.NEXT_PUBLIC_DONATE_ACCOUNT_NUMBER || "";
  const accountName = process.env.NEXT_PUBLIC_DONATE_ACCOUNT_NAME || "";
  
  // Using compact2 template for a clean look
  const qrUrl = `https://img.vietqr.io/image/${bankId}-${accountNo}-compact2.png?addInfo=HypStay%20Donate&accountName=${encodeURIComponent(accountName)}`;

  // Don't show if account number is not configured
  if (!accountNo || accountNo === "YOUR_ACCOUNT_NUMBER") {
    return null;
  }

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button variant="outline" className="gap-2 border-orange-200 text-orange-600 hover:bg-orange-50 hover:text-orange-700 rounded-xl">
            <Coffee className="h-4 w-4" />
            {t("app.donate")}
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg">
            <div className="bg-orange-100 p-2 rounded-lg">
              <Coffee className="h-5 w-5 text-orange-600" />
            </div>
            {t("app.donateTitle")}
          </DialogTitle>
          <DialogDescription>
            {t("app.donateDesc")}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center p-6 bg-slate-50 rounded-2xl border border-slate-100 mt-4">
          <div className="bg-white p-3 rounded-2xl shadow-sm mb-4 border border-slate-200">
            <Image
              src={qrUrl}
              width={240}
              height={240}
              alt="VietQR Donate"
              className="rounded-lg"
              unoptimized // Allow external image from VietQR
            />
          </div>
          <div className="text-center space-y-1">
            <p className="font-bold text-slate-900 uppercase tracking-wide">{accountName}</p>
            <p className="text-sm text-slate-500 font-semibold">{bankId} • {accountNo}</p>
          </div>
        </div>
        <DialogFooter>
          <div className="w-full text-center text-xs text-slate-400 font-medium italic">
            {t("landing.noSetup")}
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
