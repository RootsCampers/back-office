"use client";

import React from "react";
import Link from "next/link";
import { Heart, Instagram, YoutubeIcon } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";

export const Footer = () => {
  const { t, i18n } = useTranslation("footer");

  return (
    <footer className="bg-secondary text-secondary-foreground pt-12 md:pt-20 pb-16 md:pb-24 lg:pb-12 md:px-12">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 items-start">
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-xl md:text-2xl font-semibold mb-4 cursor-default">
              {t("company_name", "RootsCampers")}
            </h3>
            <p className="leading-relaxed max-w-md text-base md:text-lg cursor-default">
              {t(
                "description",
                "Connecting nature lovers with unique camping experiences. Discover the perfect outdoor getaway with RootsCampers.",
              )}
            </p>
          </div>

          <div className="flex flex-col md:col-span-1">
            <h3 className="text-xl md:text-2xl font-semibold mb-4 cursor-default">
              {t("find_us_on", "Find us on")}
            </h3>
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <Instagram className="h-5 w-5" />
                <a
                  href="https://www.instagram.com/rootscampers/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base md:text-lg underline leading-none"
                >
                  {t("instagram", "Instagram")}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <YoutubeIcon className="h-5 w-5" />
                <a
                  href="https://www.youtube.com/@rootscampers"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base md:text-lg underline leading-none"
                >
                  {t("youtube", "YouTube")}
                </a>
              </div>
            </section>
          </div>

          <div className="flex flex-col md:col-span-1">
            <h3 className="text-xl md:text-2xl font-semibold mb-4 cursor-default">
              {t("quick_links", "Quick Links")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href={`/${i18n.language}`}
                  className="text-base md:text-lg underline"
                >
                  {t("home", "Home")}
                </Link>
              </li>
              <li>
                <Link
                  href={`/${i18n.language}/about`}
                  className="text-base md:text-lg underline"
                >
                  {t("about_us", "About Us")}
                </Link>
              </li>
              <li>
                <a
                  href="https://atmaucjbgvnyduoexsuj.supabase.co/storage/v1/object/public/terms-and-conditions/platform/TYC%20PLATFORM%20ESP.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-base md:text-lg flex items-center underline"
                >
                  {t("platform_terms", "Platform Terms")}
                </a>
              </li>
              <li>
                <Link
                  href={`/${i18n.language}/privacy`}
                  className="text-base md:text-lg underline"
                >
                  {t("privacy_policy", "Privacy Policy")}
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-secondary-foreground flex flex-col md:flex-row items-start md:justify-between">
          <div className="text-sm cursor-default">
            {t("copyright", { year: new Date().getFullYear() })}
          </div>
          <div className="flex items-center mt-4 md:mt-0 text-sm cursor-default">
            <Trans
              i18nKey="made_with_love"
              ns="footer"
              components={{
                heart: (
                  <Heart
                    className="h-4 w-4 mx-1 text-destructive inline"
                    fill="currentColor"
                  />
                ),
              }}
            />
          </div>
        </div>
      </div>
    </footer>
  );
};
