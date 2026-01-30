"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Users, MapPin, Calendar, Car } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { WhatsAppIcon } from "@/components/icons/WhatsAppIcon";

interface FloatingWhatsAppButtonProps {
  className?: string;
}

export function FloatingWhatsAppButton({
  className = "",
}: FloatingWhatsAppButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipDismissed, setTooltipDismissed] = useState(false);
  const pathname = usePathname();
  const { t } = useTranslation("whatsapp");

  // Check if we're on admin or inspection pages
  const isAdminPage = pathname.includes("/admin");
  const isInspectionPage = pathname.includes("/inspection");

  useEffect(() => {
    // Hide button temporarily when scrolling, but keep tooltip visible
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      setIsVisible(false);
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => setIsVisible(true), 150);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, []);

  useEffect(() => {
    // Check if tooltip was dismissed in this session only (resets when browser tab is closed)
    const dismissedThisSession = sessionStorage.getItem(
      "whatsapp-tooltip-dismissed",
    );

    if (!dismissedThisSession && !isAdminPage && !isInspectionPage) {
      // Show tooltip immediately when page loads
      setShowTooltip(true);
    } else {
      setTooltipDismissed(true);
    }
  }, [isAdminPage, isInspectionPage]);

  useEffect(() => {
    // Hide tooltip when expanded
    if (isExpanded) {
      setShowTooltip(false);
    }
  }, [isExpanded]);

  const dismissTooltip = () => {
    setShowTooltip(false);
    setTooltipDismissed(true);
    // Remember dismissal across pages within this browser session only
    sessionStorage.setItem("whatsapp-tooltip-dismissed", "true");
  };

  // Optional: Add this to window for debugging/testing
  // window.resetWhatsAppTooltip = () => {
  //   sessionStorage.removeItem('whatsapp-tooltip-dismissed')
  //   setTooltipDismissed(false)
  //   setShowTooltip(true)
  // }

  const openWhatsApp = (
    messageType:
      | "general"
      | "route"
      | "vehicle"
      | "admin"
      | "guided" = "general",
  ) => {
    const phoneNumber = "+12029884022";

    // Get translated messages
    const message = encodeURIComponent(
      t(`whatsapp_help.messages.${messageType}`),
    );

    // Check if user is on mobile device
    const isMobile =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent,
      );

    if (isMobile) {
      // Open WhatsApp app on mobile devices
      window.open(
        `whatsapp://send?phone=${phoneNumber}&text=${message}`,
        "_blank",
      );
    } else {
      // On desktop: Try to open the WhatsApp desktop app first, with fallback to web
      const openTime = Date.now();
      const appUrl = `whatsapp://send?phone=${phoneNumber}&text=${message}`;
      const webUrl = `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${message}`;

      // Try to open the desktop app
      const appWindow = window.open(appUrl, "_blank");

      // Set fallback to web version after a short timeout if app doesn't open
      setTimeout(() => {
        // If the window was closed immediately or focus hasn't changed,
        // it likely means the app protocol wasn't handled
        if (!appWindow || Date.now() - openTime < 1000) {
          window.open(webUrl, "_blank");
        }
      }, 500);
    }

    // Close the expanded menu after clicking
    setIsExpanded(false);
  };

  // Don't render on inspection pages at all
  if (isInspectionPage) {
    return null;
  }

  // Render different content for admin pages
  if (isAdminPage) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: isVisible ? 1 : 0.7,
          scale: isVisible ? 1 : 0.9,
        }}
        className={`fixed bottom-6 right-6 z-50 ${className}`}
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => openWhatsApp("admin")}
          className="bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2 group"
        >
          <WhatsAppIcon size={26} className="text-white" />
          <motion.span
            initial={{ width: 0, opacity: 0 }}
            whileHover={{ width: "auto", opacity: 1 }}
            className="overflow-hidden whitespace-nowrap text-sm font-medium group-hover:pl-1"
          >
            {t("admin_support", "Owner Support")}
          </motion.span>
        </motion.button>
      </motion.div>
    );
  }

  // Regular user pages
  return (
    <>
      {/* Pretty tooltip positioned relative to viewport */}
      <AnimatePresence>
        {showTooltip && !isExpanded && !isAdminPage && !isInspectionPage && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8, rotateX: -20 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              rotateX: 0,
            }}
            exit={{ opacity: 0, y: 10, scale: 0.8, rotateX: -20 }}
            transition={{
              duration: 0.4,
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
            className="fixed bottom-32 right-4 left-4 md:left-auto z-50 pointer-events-none"
          >
            <div className="relative">
              {/* Main tooltip bubble */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-medium rounded-2xl px-4 md:px-6 py-3 pr-10 md:pr-12 shadow-2xl backdrop-blur-sm border border-green-400/20 max-w-xs md:max-w-none">
                <div className="flex items-center gap-2">
                  <motion.span
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                    }}
                    className="flex-shrink-0"
                  >
                    🚐
                  </motion.span>
                  <span className="whitespace-normal md:whitespace-nowrap">
                    {t(
                      "floating_text",
                      "Your guide is online—avg response: 3 min",
                    )}
                  </span>
                </div>

                {/* Close button */}
                <motion.button
                  onClick={dismissTooltip}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="absolute top-1.5 md:top-2 right-1.5 md:right-2 w-7 h-7 md:w-6 md:h-6 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors pointer-events-auto"
                  aria-label="Close tooltip"
                >
                  <X size={14} className="text-white md:w-3 md:h-3" />
                </motion.button>
              </div>

              {/* Arrow pointing to button */}
              <div className="absolute top-full right-8 md:left-1/2 md:transform md:-translate-x-1/2 -mt-1">
                <div className="w-0 h-0 border-l-8 border-r-8 border-t-8 border-transparent border-t-green-500"></div>
              </div>

              {/* Subtle glow effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-600 rounded-2xl blur-xl opacity-30 -z-10"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: isVisible ? 1 : 0.7,
          scale: isVisible ? 1 : 0.9,
        }}
        className={`fixed bottom-6 right-6 z-50 ${className}`}
      >
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mb-4 bg-white rounded-2xl shadow-xl border border-gray-200 p-4 w-72"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2 cursor-default">
                  <Users size={20} className="text-green-500" />
                  {t("title", "Your Travel Guide is Online Now 🟢")}
                </h3>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <p className="text-sm text-gray-600 mb-4 cursor-default">
                {t(
                  "subtitle",
                  "Chat with your dedicated guide—real human, real-time support",
                )}
              </p>

              <div className="space-y-2">
                {/* Guided Experience - Primary Option */}
                <button
                  onClick={() => openWhatsApp("guided")}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 transition-colors text-left border-2 border-amber-200"
                >
                  <div className="flex-shrink-0 bg-gradient-to-br from-amber-500 to-amber-600 rounded-full p-2">
                    <Users size={16} className="text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-sm text-amber-900 flex items-center gap-1">
                      {t("options.guided_title", "Get a Personal Guide")}
                      <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full cursor-default">
                        Popular
                      </span>
                    </div>
                    <div className="text-xs text-amber-700 cursor-default">
                      {t(
                        "options.guided_description",
                        "Full trip planning & 24/7 support",
                      )}
                    </div>
                  </div>
                </button>

                <div className="relative py-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-2 text-xs text-gray-400 bg-white cursor-default">
                      {t("or_ask_about", "Or ask about")}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => openWhatsApp("route")}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <MapPin size={18} className="text-blue-500" />
                  <div>
                    <div className="font-medium text-sm text-gray-800 cursor-default">
                      {t("options.route_title", "Plan Your Route")}
                    </div>
                    <div className="text-xs text-gray-500 cursor-default">
                      {t(
                        "options.route_description",
                        "Custom itinerary & hidden gems",
                      )}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => openWhatsApp("vehicle")}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <Car size={18} className="text-orange-500" />
                  <div>
                    <div className="font-medium text-sm text-gray-800 cursor-default">
                      {t("options.vehicle_title", "Find Your Perfect Camper")}
                    </div>
                    <div className="text-xs text-gray-500 cursor-default">
                      {t(
                        "options.vehicle_description",
                        "Expert matching to your needs",
                      )}
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => openWhatsApp("general")}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                >
                  <Calendar size={18} className="text-purple-500" />
                  <div>
                    <div className="font-medium text-sm text-gray-800 cursor-default">
                      {t("options.dates_title", "Best Travel Times")}
                    </div>
                    <div className="text-xs text-gray-500 cursor-default">
                      {t(
                        "options.dates_description",
                        "Weather & seasonal advice",
                      )}
                    </div>
                  </div>
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            setIsExpanded(!isExpanded);
            setShowTooltip(false); // Hide tooltip when button is clicked
          }}
          className={`bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200 ${
            isExpanded ? "bg-green-600" : ""
          }`}
        >
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isExpanded ? (
              <X size={24} />
            ) : (
              <WhatsAppIcon size={26} className="text-white" />
            )}
          </motion.div>
        </motion.button>

        {!isExpanded && (
          <div className="absolute -top-2 -left-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-badge-pulse">
            !
          </div>
        )}
      </motion.div>
    </>
  );
}
