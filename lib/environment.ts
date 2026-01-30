if (!process.env.NEXT_PUBLIC_GO_API_URL) {
  throw new Error("NEXT_PUBLIC_GO_API_URL is not set");
}

if (!process.env.NEXT_PUBLIC_AUTH_URL) {
  throw new Error("NEXT_PUBLIC_AUTH_URL is not set");
}

const ENVIRONMENT = {
  API_BASE_URL: process.env.NEXT_PUBLIC_GO_API_URL,
  AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL,
} as const;

export default ENVIRONMENT;
