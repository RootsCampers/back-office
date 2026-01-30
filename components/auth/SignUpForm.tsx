"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { createAuthService } from "@/modules/auth/services";
import { ApiError } from "@/lib/api/errors";
import { useAuth } from "@/modules/auth/hooks";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Checkbox } from "@/components/ui/checkbox";
import { TermsAndConditions } from "@/components/ui/terms-and-conditions";
import { Separator } from "@/components/ui/separator";
import { FcGoogle } from "react-icons/fc";
import { FormCardHeader } from "./FormCardHeader";

export const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const authService = createAuthService();
  const { setSession } = useAuth();
  const { t, i18n } = useTranslation(["auth-and-terms", "errors"]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorCode(null);

    // Client-side validations
    if (password !== confirmPassword) {
      setErrorCode("passwords_dont_match");
      setIsLoading(false);
      return;
    }

    if (!acceptedTerms) {
      setErrorCode("terms.must_accept");
      setIsLoading(false);
      return;
    }

    try {
      // Prepare signup request
      const signupRequest = {
        email,
        password,
      };

      // Sign up using auth service
      const session = await authService.signUp(signupRequest);

      // Store session in auth provider
      setSession(session);

      // Redirect to home
      router.push(`/${i18n.language}/dashboard`);
    } catch (error) {
      console.error("Sign up error:", error);

      // Handle ApiError with translations
      if (error instanceof ApiError) {
        setErrorCode(error.tag);
      } else {
        setErrorCode("unknown_error");
      }
      setIsLoading(false);
    }
  };

  // Google OAuth signup
  const handleGoogleSignUp = async () => {
    if (!acceptedTerms) {
      setErrorCode("terms.must_accept");
      return;
    }

    setIsLoading(true);
    setErrorCode(null);

    try {
      // Encode redirect info in state parameter (OAuth providers preserve this)
      const state = btoa(
        JSON.stringify({
          next: "/",
          lng: i18n.language,
        }),
      );

      // Build callback URL with state parameter
      const callbackUrl = `${window.location.origin}/${
        i18n.language
      }/auth/callback?state=${encodeURIComponent(state)}`;

      // Initiate OAuth flow with callback URL
      await authService.signInWithOAuth({
        provider: "google",
        redirectTo: callbackUrl,
      });
    } catch (error) {
      console.error("Error signing up with Google:", error);
      if (error instanceof ApiError) {
        setErrorCode(error.tag);
      } else {
        setErrorCode("unknown_error");
      }
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <FormCardHeader />
        <CardTitle className="text-2xl font-bold text-center cursor-default">
          {t("auth.create_account", "Create an account")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {errorCode && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle className="cursor-default">
              {t("auth.error", "Error")}
            </AlertTitle>
            <AlertDescription className="cursor-default">
              {errorCode.startsWith("auth.") || errorCode.startsWith("terms.")
                ? t(errorCode, { ns: errorCode.split(".")[0] })
                : t(errorCode, { ns: "errors" })}
            </AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t("auth.email", "Email")}</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                placeholder={t("auth.enter_email", "Enter your email")}
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">{t("auth.password", "Password")}</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                placeholder={t("auth.create_password", "Create a password")}
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={
                  showPassword
                    ? t("auth.hide_password", "Hide password")
                    : t("auth.show_password", "Show password")
                }
              >
                {showPassword ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">
              {t("auth.confirm_password", "Confirm password")}
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                placeholder={t(
                  "auth.confirm_your_password",
                  "Confirm your password",
                )}
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="pl-10 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-3 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={
                  showConfirmPassword
                    ? t("auth.hide_password", "Hide password")
                    : t("auth.show_password", "Show password")
                }
              >
                {showConfirmPassword ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Terms and Conditions Acceptance */}
          <div className="space-y-3 pt-2">
            <div className="flex items-start space-x-2">
              <Checkbox
                id="terms"
                checked={acceptedTerms}
                onCheckedChange={(checked) =>
                  setAcceptedTerms(checked as boolean)
                }
                className="mt-0.5"
              />
              <div className="space-y-1 leading-none">
                <Label
                  htmlFor="terms"
                  className="text-sm text-gray-700 cursor-pointer leading-relaxed"
                >
                  {t(
                    "terms.accept_terms",
                    "I accept the Terms and Conditions and Privacy Policy",
                  )}
                </Label>
                <div className="text-xs text-gray-500">
                  <TermsAndConditions>
                    <span className="text-amber-700 hover:text-amber-800 hover:underline font-medium cursor-pointer">
                      {t("terms.read_terms", "Read the Terms and Conditions")}
                    </span>
                  </TermsAndConditions>
                </div>
              </div>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading || !acceptedTerms}
          >
            {isLoading
              ? t("auth.creating_account", "Creating account...")
              : t("auth.sign_up", "Sign up")}
          </Button>
        </form>

        {/* Separator */}
        <div className="flex items-center gap-2">
          <Separator className="flex-1" />
          <span className="text-sm text-muted-foreground cursor-default">
            {t("auth.continue_with", "OR")}
          </span>
          <Separator className="flex-1" />
        </div>

        {/* Google Sign Up */}
        <Button
          variant="outline"
          className="w-full"
          onClick={handleGoogleSignUp}
          disabled={isLoading || !acceptedTerms}
        >
          <FcGoogle className="mr-2 h-5 w-5" />
          {t("auth.continue_with_google", "Continue with Google")}
        </Button>
      </CardContent>
      <CardFooter>
        <div className="text-sm text-center w-full text-muted-foreground cursor-default">
          {t("auth.already_have_account", "Already have an account?")}{" "}
          <Link href={`/${i18n.language}/`} className="underline">
            {t("auth.login", "Login")}
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};
