import "@/styles/globals.css";
import { Inter } from "next/font/google";
import { Metadata } from "next";
import { I18nProvider } from "@/components/I18nProvider";
import { languages } from "@/app/i18n/settings";
import { Providers } from "../providers";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://rootscampers.com",
  ),
  title: {
    default: "RootsCampers Back-Office",
    template: "%s | RootsCampers Back-Office",
  },
  description: "Internal admin tool for the RootsCampers team",
  robots: {
    index: false,
    follow: false,
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

  return (
    <html lang={lng} className="scroll-smooth" suppressHydrationWarning>
      <body
        className={`min-h-screen bg-background font-sans antialiased overflow-x-hidden ${inter.className}`}
        suppressHydrationWarning
      >
        <Providers>
          <I18nProvider>
            <div className="relative flex min-h-screen flex-col">
              {children}
            </div>
          </I18nProvider>
        </Providers>
      </body>
    </html>
  );
}
