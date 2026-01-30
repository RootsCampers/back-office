"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Mail, Lock, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useTranslation } from "react-i18next";
import { createAuthService } from "@/modules/auth/services";
import { ApiError } from "@/lib/api/errors";
import { useAuth } from "@/modules/auth/hooks";
import { stripLocalePrefix } from "@/lib/path";

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
import { FcGoogle } from "react-icons/fc";
import { FormCardHeader } from "./FormCardHeader";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const authService = createAuthService();
  const { setSession } = useAuth();
  const { t, i18n } = useTranslation(["auth-and-terms", "errors"]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorCode(null);

    try {
      // Sign in using auth service
      const session = await authService.signInWithPassword({
        email,
        password,
      });

      // Store session in auth provider
      setSession(session);

      // Redirect
      handleSuccess();
    } catch (error) {
      console.error("Login error:", error);

      // Handle ApiError with translations
      if (error instanceof ApiError) {
        setErrorCode(error.tag);
      } else {
        setErrorCode("unknown_error");
      }
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorCode(null);

    const redirectTo = searchParams.get("redirect") || "/dashboard";
    const lng = i18n.language;

    // Normalize redirect path: remove locale prefix if present
    // This prevents duplication when the callback reconstructs the path
    const normalizedRedirect = stripLocalePrefix(redirectTo);

    try {
      // Encode redirect info in state parameter (OAuth providers preserve this)
      const state = btoa(
        JSON.stringify({
          next: normalizedRedirect,
          lng: lng,
        }),
      );

      // Build callback URL with state parameter
      const callbackUrl = `${
        window.location.origin
      }/${lng}/auth/callback?state=${encodeURIComponent(state)}`;

      // Initiate OAuth flow with callback URL
      await authService.signInWithOAuth({
        provider: "google",
        redirectTo: callbackUrl,
      });
    } catch (error) {
      console.error("Error signing in with Google:", error);
      if (error instanceof ApiError) {
        setErrorCode(error.tag);
      } else {
        setErrorCode("unknown_error");
      }
      setIsLoading(false);
    }
  };

  const handleSuccess = () => {
    const redirectTo = searchParams.get("redirect");
    if (redirectTo) {
      router.push(redirectTo);
    } else {
      router.refresh();
      router.push(`/${i18n.language}/`);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="space-y-1">
        <FormCardHeader />
        <CardTitle className="text-2xl font-bold text-center cursor-default">
          {t("auth.welcome_back", "Welcome back to RootsCampers")}
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
              {errorCode.startsWith("auth.")
                ? t(errorCode, { ns: "auth" })
                : t(errorCode, { ns: "errors" })}
            </AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleEmailLogin} className="space-y-4">
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
                placeholder={t("auth.enter_password", "Enter your password")}
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
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading
              ? t("auth.logging_in", "Logging in...")
              : t("auth.login", "Login")}
          </Button>
        </form>
        {/* Separator */}
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground cursor-default">
              {t("auth.continue_with", "OR")}
            </span>
          </div>
        </div>

        {/* Google Login */}
        <Button
          variant="outline"
          type="button"
          className="w-full"
          onClick={handleGoogleLogin}
          disabled={isLoading}
        >
          <FcGoogle className="mr-2 h-5 w-5" />
          {t("auth.continue_google", "Continue with Google")}
        </Button>
      </CardContent>
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-center text-muted-foreground cursor-default">
          {t("auth.dont_have_account", "Don't have an account?")}{" "}
          <Link
            href={`/${i18n.language}/sign-up`}
            className="underline text-primary"
          >
            {t("auth.sign_up", "Sign up")}
          </Link>
        </div>
        <div className="text-sm text-center">
          <Link
            href={`/${i18n.language}/forgot-password`}
            className="underline text-primary"
          >
            {t("auth.forgot_password", "Forgot your password?")}
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
};
