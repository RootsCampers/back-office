"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

export function BecomeHostSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 pt-24">
        <Card className="max-w-2xl mx-auto">
          <CardHeader>
            {/* Title Skeleton */}
            <Skeleton className="h-8 w-48 mb-4" />

            {/* Progress Steps Skeleton */}
            <div className="flex items-center justify-between mt-4 overflow-x-auto">
              {[1, 2, 3].map((step) => (
                <div
                  key={step}
                  className="flex items-center min-w-0 flex-shrink-0"
                >
                  {/* Step Circle */}
                  <Skeleton className="w-8 h-8 rounded-full flex-shrink-0" />
                  {/* Step Label */}
                  <Skeleton className="h-4 w-20 ml-2" />
                  {/* Connector Line */}
                  {step < 3 && (
                    <Skeleton className="w-8 h-0.5 mx-4 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Content Section Skeleton */}
            <div className="space-y-4">
              {/* Title/Subtitle */}
              <div className="text-center mb-6 space-y-2">
                <Skeleton className="h-6 w-48 mx-auto" />
                <Skeleton className="h-4 w-32 mx-auto" />
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            {/* Back Button Skeleton */}
            <Skeleton className="h-10 w-24" />
            {/* Next/Confirm Button Skeleton */}
            <Skeleton className="h-10 w-32" />
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
