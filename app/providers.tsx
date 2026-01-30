"use client";

import type { PropsWithChildren } from "react";
import { LazyMotion, domAnimation } from "framer-motion";
import { AuthProvider } from "@/modules/auth/providers/AuthProvider";

export function Providers({ children }: PropsWithChildren) {
  return (
    <LazyMotion features={domAnimation}>
      <AuthProvider>{children}</AuthProvider>
    </LazyMotion>
  );
}
