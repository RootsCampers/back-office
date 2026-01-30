"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "framer-motion";
import { User, Building, Check } from "lucide-react";
import { useAuth, useAccessToken } from "@/modules/auth/hooks";
import { createProfileService } from "@/modules/profiles/services/ProfileServices";
import { BecomeOwnerRequest } from "@/modules/profiles/domain";
import { createAuthService } from "@/modules/auth/services";
import { BecomeHostSkeleton } from "@/components/become-host/BecomeHostSkeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ConsentStep } from "@/components/become-host/ConsentStep";
import { PersonalInfoStep } from "@/components/become-host/PersonalInfoStep";
import { BusinessInfoStep } from "@/components/become-host/BusinessInfoStep";

export default function BecomeHostPage() {
  const { t, i18n } = useTranslation("become-host");
  const router = useRouter();
  const {
    user,
    isAuthenticated,
    isLoading,
    session,
    refreshSession,
    setSession,
  } = useAuth();
  const accessToken = useAccessToken();

  const [currentStep, setCurrentStep] = useState(0);
  const [accepted, setAccepted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messageAlert, setMessageAlert] = useState<{
    title: string;
    description: string;
  } | null>(null);

  // Form data
  const [personalInfo, setPersonalInfo] = useState<
    BecomeOwnerRequest["personal_info"]
  >({
    full_name: "",
    birth_date: "",
    personal_tax_id: "",
    nationality: "Chile",
    languages: [{ language: "", level: "" }],
  });

  const [businessInfo, setBusinessInfo] = useState<
    BecomeOwnerRequest["business_info"]
  >({
    type: "individual",
    name: "",
    tax_id: "",
  });

  // Protected route check - redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/${i18n.language}`);
    }
  }, [isAuthenticated, isLoading, router, i18n.language]);

  // Redirect to dashboard if user already has owner or admin role
  useEffect(() => {
    if (!isLoading && isAuthenticated && user) {
      const isOwnerOrAdmin = user.role === "owner" || user.role === "admin";
      if (isOwnerOrAdmin) {
        router.push(`/${i18n.language}/dashboard`);
      }
    }
  }, [isLoading, isAuthenticated, user, router, i18n.language]);

  const steps = [
    { id: "terms", title: t("steps.terms", "Terms"), icon: Check },
    {
      id: "personal",
      title: t("steps.personal", "Personal Info"),
      icon: User,
    },
    {
      id: "business",
      title: t("steps.business", "Business Info"),
      icon: Building,
    },
  ];

  const isPersonalInfoValid =
    personalInfo.full_name.trim() !== "" &&
    personalInfo.personal_tax_id.trim() !== "" &&
    personalInfo.nationality.trim() !== "";

  const isBusinessInfoValid =
    businessInfo.type === "individual" ||
    ((businessInfo.name ?? "").trim() !== "" &&
      (businessInfo.tax_id ?? "").trim() !== "");

  const handleNext = () => {
    if (currentStep === 0 && !accepted) {
      setMessageAlert({
        title: t("auth.error", { ns: "auth-and-terms" }),
        description: t("terms.host_terms.must_accept", {
          ns: "auth-and-terms",
        }),
      });
      return;
    }

    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    // Set submitting state immediately and force a re-render
    setIsSubmitting(true);

    // Use setTimeout to ensure React has time to re-render before async operations
    await new Promise((resolve) => setTimeout(resolve, 0));

    try {
      if (!accessToken) throw new Error("No access token");

      // Prepare languages data
      const validLanguages = personalInfo.languages.filter(
        (lang) => lang.language && lang.level,
      );

      // Call the backend become-owner API via profile service
      const profileService = createProfileService();
      await profileService.becomeOwner(accessToken, {
        personal_info: {
          full_name: personalInfo.full_name,
          birth_date: personalInfo.birth_date || null,
          personal_tax_id: personalInfo.personal_tax_id,
          nationality: personalInfo.nationality,
          languages: validLanguages,
        },
        business_info: {
          type: businessInfo.type === "individual" ? "individual" : "business",
          name: businessInfo.type === "business" ? businessInfo.name : null,
          tax_id: businessInfo.type === "business" ? businessInfo.tax_id : null,
        },
      });

      // Refresh the session to get the updated JWT with owner role
      // Use AuthService to refresh token and update HTTP-Only cookies
      if (!session?.refresh_token) {
        throw new Error("No refresh token available");
      }

      const authService = createAuthService();
      const newSession = await authService.refreshToken(session.refresh_token);
      setSession(newSession);

      // Update AuthProvider state to reflect the new session
      await refreshSession();

      // Refresh router to ensure server components get updated cookies
      router.refresh();

      // Use router.push to navigate without full page reload
      // Cookies are already updated, and refreshSession() updated AuthProvider state
      router.push(`/${i18n.language}/dashboard`);
    } catch (error) {
      console.error("Error becoming a host:", error);
      setMessageAlert({
        title: t("error", "Error becoming a host"),
        description: t(
          "error_message",
          "An error occurred while becoming a host. Please try again.",
        ),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return <ConsentStep accepted={accepted} setAccepted={setAccepted} />;

      case 1:
        return (
          <PersonalInfoStep
            personalInfo={personalInfo}
            setPersonalInfo={setPersonalInfo}
            messageAlert={messageAlert}
            setMessageAlert={setMessageAlert}
          />
        );

      case 2:
        return (
          <BusinessInfoStep
            businessInfo={businessInfo}
            setBusinessInfo={setBusinessInfo}
            personalTaxId={personalInfo.personal_tax_id}
            messageAlert={messageAlert}
            setMessageAlert={setMessageAlert}
          />
        );

      default:
        return null;
    }
  };

  // Show skeleton while loading authentication state or if user is already owner/admin (redirecting)
  if (isLoading) {
    return <BecomeHostSkeleton />;
  }

  // Show skeleton while redirecting if user already has owner/admin role
  if (
    isAuthenticated &&
    user &&
    (user.role === "owner" || user.role === "admin")
  ) {
    return <BecomeHostSkeleton />;
  }

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("language", lng);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 mt-8 md:mt-24">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="cursor-default mb-4 flex justify-between items-center">
              {t("title", "Become a Host")}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="text-gray-700 hover:text-gray-900"
                  >
                    {i18n.language.toUpperCase()}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => changeLanguage("en")}>
                    English
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changeLanguage("es")}>
                    Español
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => changeLanguage("pt")}>
                    Português
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardTitle>

            {/* Progress Steps */}
            <div className="flex flex-col md:flex-row items-start md:items-center md:justify-between mt-4 overflow-x-auto">
              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = index === currentStep;
                const isCompleted = index < currentStep;

                return (
                  <div
                    key={step.id}
                    className="flex items-center min-w-0 flex-shrink-0 mb-4 md:mb-0"
                  >
                    <div
                      className={`
                      flex items-center justify-center w-8 h-8 rounded-full border-2 flex-shrink-0
                      ${
                        isCompleted
                          ? "bg-green-500 border-green-500 text-white"
                          : isActive
                          ? "bg-primary border-primary text-white"
                          : "bg-gray-200 border-gray-300 text-gray-500"
                      }
                    `}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span
                      className={`ml-2 text-sm whitespace-nowrap cursor-default ${
                        isActive ? "font-medium" : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </span>
                    {index < steps.length - 1 && (
                      <div
                        className={`w-8 h-0.5 mx-4 flex-shrink-0 ${
                          isCompleted ? "bg-green-500" : "bg-gray-300"
                        }`}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </CardHeader>

          <CardContent className="relative overflow-hidden">
            <AnimatePresence mode="wait" custom={currentStep}>
              <motion.div
                key={currentStep}
                custom={currentStep}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="space-y-6"
              >
                {renderStepContent()}
              </motion.div>
            </AnimatePresence>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
              className="flex items-center gap-2 rounded-full"
            >
              {t("common.back")}
            </Button>

            <Button
              onClick={handleNext}
              disabled={
                isSubmitting ||
                (currentStep === 0 && !accepted) ||
                (currentStep === 1 && !isPersonalInfoValid) ||
                (currentStep === 2 && !isBusinessInfoValid)
              }
              className="flex items-center gap-2 rounded-full"
              variant="secondary"
            >
              {isSubmitting ? (
                t("submitting", "Submitting...")
              ) : currentStep === steps.length - 1 ? (
                t("confirm", "Confirm")
              ) : (
                <>{t("common.next", "Next")}</>
              )}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
