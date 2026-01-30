"use client";

import { Suspense } from "react";
import { PageLoader } from "@/components/ui/page-loader";
import { LoginForm } from "@/components/auth/LoginForm";
import Image from "next/image";

function LandingPageContent() {
  return (
    <div className="min-h-screen relative">
      {/* Background Image - extends to very top */}
      <div className="absolute inset-0 z-0 bg-emerald-900">
        <Image
          src="/images/parquepata-04-2025.webp"
          alt="Beautiful landscape background"
          fill
          className="object-cover transition-opacity duration-700 ease-in-out"
          priority
          style={{
            opacity: 1,
          }}
          onLoad={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
          onLoadStart={(e) => {
            e.currentTarget.style.opacity = "0";
          }}
        />
        {/* Dark overlay for better readability */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4 py-10 md:py-0">
        <LoginForm />
      </div>
    </div>
  );
}

export default function LandingPageClient() {
  return (
    <Suspense fallback={<PageLoader />}>
      <LandingPageContent />
    </Suspense>
  );
}
