import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    // Add server-side env variables here
  },
  client: {
    NEXT_PUBLIC_GO_BACKEND_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
    NEXT_PUBLIC_AUTH_URL: z.string().url(),
  },
  runtimeEnv: {
    NEXT_PUBLIC_GO_BACKEND_URL: process.env.NEXT_PUBLIC_GO_BACKEND_URL,
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
