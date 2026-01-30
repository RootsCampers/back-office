"use client";

import dynamic from "next/dynamic";

const FloatingWhatsAppButton = dynamic(
  () =>
    import("./FloatingWhatsAppButton").then(
      (mod) => mod.FloatingWhatsAppButton,
    ),
  {
    ssr: false,
  },
);

export function FloatingWhatsAppButtonWrapper() {
  return <FloatingWhatsAppButton />;
}
