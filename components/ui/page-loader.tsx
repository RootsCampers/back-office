"use client";

import { Loader } from "./loader";

export function PageLoader() {
  return (
    <div className="flex justify-center items-center min-h-[50vh]">
      <Loader className="w-8 h-8" />
    </div>
  );
}
