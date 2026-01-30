import { cookies } from "next/headers";
import "../styles/globals.css";
import { Inter } from "next/font/google";
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { fallbackLng, languages } from "@/app/i18n/settings";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "404 - Page Not Found | RootsCampers",
  description: "The page you are looking for does not exist.",
};

// Translations for global 404 (no i18n context available)
const globalNotFoundTranslations = {
  en: {
    error_code: "404 - Page Not Found",
    title: "Oops! The road ends here",
    description:
      "The page you're looking for doesn't exist. But don't worry, there are plenty of adventures waiting for you!",
    home_button: "Go Home",
  },
  es: {
    error_code: "404 - Página No Encontrada",
    title: "¡Ups! El camino termina aquí",
    description:
      "La página que buscas no existe. ¡Pero no te preocupes, hay muchas aventuras esperándote!",
    home_button: "Ir al Inicio",
  },
  pt: {
    error_code: "404 - Página Não Encontrada",
    title: "Ops! O caminho termina aqui",
    description:
      "A página que você procura não existe. Mas não se preocupe, há muitas aventuras esperando por você!",
    home_button: "Ir para Início",
  },
};

export default async function GlobalNotFound() {
  // Get language from cookie (set by middleware)
  const cookieStore = await cookies();
  const cookieLng = cookieStore.get("i18next")?.value;
  const lng = (
    cookieLng && languages.includes(cookieLng) ? cookieLng : fallbackLng
  ) as "en" | "es" | "pt";

  const t = globalNotFoundTranslations[lng];

  return (
    <html lang={lng} className={inter.className}>
      <head>
        <title>{`404 - ${t.error_code} | RootsCampers`}</title>
        <meta name="description" content={t.description} />
        <meta name="robots" content="noindex" />
      </head>
      <body className="bg-gradient-to-br from-amber-50 via-white to-orange-50">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="max-w-2xl w-full text-center">
            {/* Logo */}
            <div className="flex justify-center mb-8">
              <Image
                src="/logo.png"
                alt="RootsCampers"
                width={80}
                height={80}
                className="rounded-full"
                priority
              />
            </div>

            {/* Error Badge */}
            <div className="inline-flex items-center gap-2 bg-amber-100 rounded-full px-4 py-2 mb-6">
              <span className="text-amber-700 font-medium">{t.error_code}</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-gray-900 tracking-tight">
              {t.title}
            </h1>

            {/* Description */}
            <p className="text-xl text-gray-600 mb-8 max-w-xl mx-auto">
              {t.description}
            </p>

            {/* Action Button */}
            <div className="flex justify-center mb-12">
              <Link
                href={`/${lng}`}
                className="inline-flex items-center justify-center bg-amber-800 hover:bg-amber-900 text-white px-8 py-3 rounded-lg font-medium transition-all shadow-lg hover:shadow-xl"
              >
                <svg
                  className="mr-2 h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                {t.home_button}
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
