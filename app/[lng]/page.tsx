"use client";

import { Suspense } from "react";
import { PageLoader } from "@/components/ui/page-loader";
import { LoginForm } from "@/components/auth/LoginForm";

function LoginPageContent() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <LoginForm />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <LoginPageContent />
    </Suspense>
  );
}
