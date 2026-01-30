import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import { I18nProvider } from "@/components/I18nProvider";
import { JsonLd } from "@/components/JsonLd";
import { languages } from "@/app/i18n/settings";
import { Providers } from "../providers";
import { PageTracker } from "@/components/PageTracker";
import { FloatingWhatsAppButtonWrapper } from "@/components/FloatingWhatsAppButtonWrapper";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://rootscampers.com",
  ),
  title: {
    default: "RootsCampers | Find Your Perfect Camper Adventure",
    template: "%s | RootsCampers",
  },
  description:
    "Discover and book the perfect campervan for your next adventure, or share your RV with travelers worldwide.",
  openGraph: {
    title: "RootsCampers | Your Next Adventure Awaits",
    description:
      "Discover and book the perfect campervan for your next adventure, or share your RV with travelers worldwide.",
    url: "https://rootscampers.com",
    siteName: "RootsCampers",
    images: [
      {
        url: "/rootscampersv2.png",
        width: 400,
        height: 400,
        alt: "RootsCampers Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RootsCampers | Your Next Adventure Awaits",
    description:
      "Discover and book the perfect campervan for your next adventure, or share your RV with travelers worldwide.",
    images: ["/rootscampersv2.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icorootscampers.ico", sizes: "any", type: "image/x-icon" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
};

export async function generateStaticParams() {
  return languages.map((lng) => ({ lng }));
}

interface RootLayoutProps {
  children: React.ReactNode;
  params: Promise<{ lng: string }>;
}

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({
  children,
  params,
}: RootLayoutProps) {
  const { lng } = await params;

  const organizationData = {
    name: "RootsCampers",
    url: "https://rootscampers.com",
    logo: "https://rootscampers.com/rootscampersv2.png",
    sameAs: [
      "https://facebook.com/rootscampers",
      "https://instagram.com/rootscampers",
    ],
  };

  return (
    <html lang={lng} className="scroll-smooth" suppressHydrationWarning>
      <head suppressHydrationWarning>
        <link
          rel="preconnect"
          href="https://www.googletagmanager.com"
          crossOrigin="anonymous"
        />
        <link rel="dns-prefetch" href="https://www.google-analytics.com" />
        <link
          rel="preconnect"
          href="https://atmaucjbgvnyduoexsuj.supabase.co"
          crossOrigin="anonymous"
        />
        <JsonLd organizationData={organizationData} />
      </head>
      <body
        className={`min-h-screen bg-background font-sans antialiased overflow-x-hidden ${inter.className}`}
        suppressHydrationWarning
      >
        <Providers>
          <I18nProvider>
            <PageTracker />
            <div className="relative flex min-h-screen flex-col">
              {children}
            </div>
            <Footer />
            <FloatingWhatsAppButtonWrapper />
          </I18nProvider>
        </Providers>
      </body>
    </html>
  );
}
