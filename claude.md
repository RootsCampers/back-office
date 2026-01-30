# RootsCampers Frontend - Architecture & Patterns

> **Document for AI Assistants**  
> Last updated: January 2025

## Project Overview

This is the Next.js frontend for RootsCampers, a campervan rental marketplace. The application is migrating from a Supabase-only backend to a hybrid architecture with a Go backend (rootend) for business logic while retaining Supabase Auth.

## Technology Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **State Management**: React hooks + Context
- **Internationalization**: i18next
- **Backend**: rootend (Go) via Caddy reverse proxy + Supabase (Auth only)
- **Auth**: Supabase Auth with GoTrue

---

## Pre-Push Checklist (MANDATORY)

Before every commit/push, the agent MUST run these checks in order:

```bash
# 1. TypeScript - must pass with 0 errors
npx tsc --noEmit

# 2. Lint - check for errors (warnings are acceptable)
npx next lint --dir app --dir components --dir hooks --dir modules
```

**Both checks must pass before pushing.** If any check fails:
1. Fix the issues
2. Re-run all checks from the beginning
3. Only push when all checks pass

> **Note:** `npm run build` requires production environment variables that may not be available locally. TypeScript and lint checks are sufficient for verifying code correctness.

---

## Client/Service/Repository Pattern

The recommended pattern for new features follows a layered architecture that separates concerns:

```
┌──────────────────────────────────────────────────────────────┐
│                    React Component                            │
│  - Uses hooks for data fetching                               │
│  - Handles UI state and user interactions                     │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                     Service Layer                             │
│  modules/{domain}/services/{Domain}Service.ts                │
│  - Orchestrates Repository + Validator                        │
│  - Contains business logic                                    │
│  - Type-safe with Zod validation                              │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                   Repository Layer                            │
│  modules/{domain}/repositories/{Domain}Repository.ts         │
│  - HTTP communication with rootend via lib/api/client.ts     │
│  - Endpoint configuration                                     │
│  - Error handling with ApiError                               │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                    API Client                                 │
│  lib/api/client.ts                                           │
│  - apiFetch() / apiFetchData() functions                     │
│  - Handles retries, timeouts, caching                         │
│  - Automatic Authorization header injection                   │
└──────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────┐
│                    rootend (Go Backend)                       │
│  Accessed via Caddy at NEXT_PUBLIC_API_URL                    │
└──────────────────────────────────────────────────────────────┘
```

### Layer Responsibilities

#### 1. Repository (`modules/{domain}/repositories/`)

Handles HTTP communication with the backend:

```typescript
// modules/vehicles/repositories/VehicleRepository.ts
import { apiFetchData } from "@/lib/api/client";
import { ERROR_CODES } from "@/lib/constants/errorCodes";

export class VehicleRepository {
  private readonly baseEndpoint = "/api/vehicles";
  
  async fetchVehicleById(id: string): Promise<unknown> {
    return apiFetchData<unknown>(`${this.baseEndpoint}/${id}`, {
      method: "GET",
      cache: "no-store",
      retries: 2,
      errorCode: ERROR_CODES.FETCH_FAILED,
      next: { tags: ["vehicle"] },
    });
  }
}

export function createVehicleRepository(): VehicleRepository {
  return new VehicleRepository();
}
```

**Key Principles:**
- Returns `unknown` type - validation happens in service layer
- Uses `apiFetchData` from `lib/api/client.ts`
- Configures caching, retries, and error codes
- Does NOT transform data

#### 2. Service (`modules/{domain}/services/`)

Orchestrates repository calls and applies Zod validation:

```typescript
// modules/vehicles/services/VehiclesService.ts
import { createVehicleRepository } from "../repositories";
import { validateVehicleDataHandled } from "../validators";
import type { VehicleData } from "../domain/types";

export function createVehiclesService(): IVehiclesService {
  const repository = createVehicleRepository();

  return {
    async getVehicleById(id: string): Promise<VehicleData> {
      const rawData = await repository.fetchVehicleById(id);
      const validatedData = validateVehicleDataHandled(rawData);
      return validatedData;
    },
  };
}
```

**Key Principles:**
- Calls repository for raw data
- Validates with Zod schemas
- Returns typed, validated data
- Contains business logic

#### 3. Validators (`modules/{domain}/validators/`)

Zod schemas that validate and type-cast data:

```typescript
// modules/vehicles/validators/vehicleValidators.ts
import { z } from "zod";
import { ApiError } from "@/lib/api/errors";
import { ERROR_CODES } from "@/lib/constants/errorCodes";

const VehicleSchema = z.object({
  id: z.string(),
  name: z.string(),
  // ... fields
});

export function validateVehicleDataHandled(data: unknown): VehicleData {
  const result = VehicleSchema.safeParse(data);
  if (!result.success) {
    throw new ApiError(ERROR_CODES.VALIDATION_ERROR, "Invalid vehicle data");
  }
  return result.data;
}
```

#### 4. Domain Types (`modules/{domain}/domain/`)

TypeScript types and interfaces:

```typescript
// modules/vehicles/domain/types.ts
export interface Vehicle {
  id: string;
  name: string;
  // ... 
}
```

---

## API Client (`lib/api/client.ts`)

The central HTTP client for rootend communication:

```typescript
import { apiFetch, apiFetchData } from "@/lib/api/client";

// Basic fetch
const data = await apiFetch<MyType>("/api/endpoint", {
  method: "GET",
  headers: { Authorization: `Bearer ${token}` },
  cache: "no-store",
});

// With error handling and defaults
const data = await apiFetchData<MyType>("/api/endpoint", {
  method: "POST",
  data: { key: "value" },
  defaultValue: [],
  errorCode: "custom_error",
});
```

### Options

| Option | Description |
|--------|-------------|
| `method` | HTTP method (GET, POST, PUT, DELETE, PATCH) |
| `data` | Request body (JSON, FormData, URLSearchParams) |
| `params` | URL query parameters |
| `headers` | Additional headers |
| `token` | Bearer token for Authorization header |
| `timeout` | Request timeout in ms (default: 30000) |
| `retries` | Number of retries for transient errors |
| `cache` | Next.js cache strategy |
| `next.tags` | Revalidation tags for ISR |
| `defaultValue` | Default for empty responses |
| `errorCode` | Error code for i18n |

---

## Date Utilities (`lib/date.ts`)

Rootend API expects RFC 3339 datetime format for date fields. Use these utilities for conversion:

```typescript
import { toRFC3339, fromRFC3339 } from "@/lib/date";

// Convert date input (YYYY-MM-DD) to RFC 3339 for API requests
const apiDate = toRFC3339("2026-03-04"); // → "2026-03-04T00:00:00Z"

// Extract date from RFC 3339 response for display
const displayDate = fromRFC3339("2026-03-04T00:00:00Z"); // → "2026-03-04"
```

**When to use**: Any API endpoint that expects datetime fields (offers valid_from/valid_until, blocked days start/end dates, etc.)

---

## Hooks Pattern

For client components that need data fetching:

```typescript
// hooks/useVehicle.ts
export function useVehicle(id: string) {
  const [data, setData] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);
      const service = createVehiclesService();
      const vehicle = await service.getVehicleById(id);
      setData(vehicle);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch");
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error, refetch: fetchData };
}
```

---

## Auth Integration

Authentication uses **HttpOnly cookies** for XSS protection with a custom auth module that wraps GoTrue (Supabase Auth). This is a significant departure from the standard Supabase client-side token storage.

### Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         Client Component                                 │
│   useAuth() → { user, session, isAuthenticated, signOut, ... }          │
│   useAccessToken() → string | null                                       │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    AuthProvider (Context)                                │
│   modules/auth/providers/AuthProvider.tsx                               │
│   - Fetches session from /api/auth/session on mount                     │
│   - Cross-tab sync via BroadcastChannel                                 │
│   - Auto-refresh timer as backup (middleware is primary)                │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    API Route: /api/auth/session                          │
│   app/api/auth/session/route.ts                                         │
│   - GET: Read tokens from HttpOnly cookies                              │
│   - POST: Set tokens in HttpOnly cookies (after login)                  │
│   - DELETE: Clear cookies (logout)                                      │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    Next.js Middleware                                    │
│   middleware.ts                                                          │
│   - Automatic token refresh 5 min before expiry (grace period)          │
│   - Calls GoTrue /token?grant_type=refresh_token                        │
│   - Updates HttpOnly cookies with new tokens                            │
└─────────────────────────────────────────────────────────────────────────┘
```

### Key Hooks

#### `useAuth()` - Authentication state and methods
```typescript
import { useAuth } from "@/modules/auth/hooks";

function MyComponent() {
  const {
    user,              // AuthUser | null
    session,           // AuthSession | null (includes access_token)
    isAuthenticated,   // boolean
    isLoading,         // boolean - true during initial load
    signOut,           // () => Promise<void>
    refreshSession,    // () => Promise<void>
    setSession,        // (session: AuthSession) => void - for login flows
  } = useAuth();

  if (isLoading) return <Spinner />;
  if (!isAuthenticated) return <Redirect to="/login" />;

  return <div>Welcome, {user?.email}</div>;
}
```

#### `useAccessToken()` - Get token for API calls
```typescript
import { useAccessToken } from "@/modules/auth/hooks";

function MyComponent() {
  const accessToken = useAccessToken(); // string | null

  const fetchData = async () => {
    const response = await fetch(`${API_URL}/api/protected`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      },
    });
  };
}
```

### Auth Module Structure

```
modules/auth/
├── domain/
│   └── types.ts              # AuthUser, AuthSession, UserRole types
├── hooks/
│   ├── useAuth.ts            # Main auth hook (context consumer)
│   ├── useAccessToken.ts     # Token extraction hook
│   └── useRequireOwner.ts    # Role-based route protection hook
├── providers/
│   ├── AuthContext.tsx       # React Context definition
│   └── AuthProvider.tsx      # Provider with session management
├── services/
│   ├── IAuthService.ts       # Interface
│   └── AuthService.ts        # Login/signup/logout methods
├── utils/
│   ├── decode-jwt.ts         # JWT decoding utility
│   └── cookies.ts            # Cookie helpers
└── server/
    └── getAuthToken.ts       # Server-side token access
```

### Making Authenticated API Calls

```typescript
// In a client component
import { useAccessToken } from "@/modules/auth/hooks";

function MyComponent() {
  const accessToken = useAccessToken();

  const fetchProtectedData = async () => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_GO_API_URL}/api/protected-endpoint`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.json();
  };
}
```

### Login/Signup Flow

The AuthService handles login/signup and automatically sets HttpOnly cookies:

```typescript
import { createAuthService } from "@/modules/auth/services";

// In login component
const authService = createAuthService();
const session = await authService.loginWithPassword(email, password);

// AuthService internally calls POST /api/auth/session to set cookies
// Then call setSession to update React state:
const { setSession } = useAuth();
setSession(session);
```

### Why HttpOnly Cookies?

- **XSS Protection**: JavaScript cannot access HttpOnly cookies, preventing token theft via XSS attacks
- **Automatic Refresh**: Middleware refreshes tokens transparently before expiration
- **Cross-Tab Sync**: BroadcastChannel keeps auth state consistent across tabs
- **Server-Side Access**: Tokens available in middleware and API routes without client-side exposure

### User Roles

The system supports 3 roles defined in `modules/auth/domain/types.ts`:

```typescript
export type UserRole = "admin" | "owner" | "traveler";
```

| Role | Description | Admin Access |
|------|-------------|--------------|
| `admin` | System administrator | ✅ |
| `owner` | Camper owner | ✅ |
| `traveler` | User renting campers (default) | ❌ |

Role is extracted from JWT in AuthProvider:
```typescript
role: payload.app_metadata?.role || payload.role || "traveler"
```

Users without an explicit role are treated as `"traveler"`.

### Admin Route Protection

All `/admin/*` routes are protected by a layout that verifies both authentication and role:

```typescript
// app/[lng]/admin/layout.tsx
const { user, isAuthenticated, isLoading } = useAuth();
const isOwnerOrAdmin = user?.role === "owner" || user?.role === "admin";

// Redirects:
// - Not authenticated → /login
// - Traveler role → / (home)
```

Individual admin pages only need `useAuth()` to get `user.id` for data fetching - the layout handles access control.

### Optional: `useRequireOwner` Hook

For protecting routes outside `/admin/`:

```typescript
import { useRequireOwner } from "@/modules/auth/hooks";

function ProtectedPage() {
  const { user, isAuthorized, isLoading } = useRequireOwner();
  
  if (isLoading || !isAuthorized) return <Loader />;
  return <Content />;
}
```

---

## Module Structure

```
modules/
├── {domain}/
│   ├── components/              # Domain-specific components
│   ├── domain/
│   │   ├── index.ts             # Re-exports
│   │   └── types.ts             # TypeScript types
│   ├── repositories/
│   │   ├── index.ts             # Re-exports
│   │   └── {Domain}Repository.ts
│   ├── services/
│   │   ├── index.ts             # Re-exports
│   │   ├── I{Domain}Service.ts  # Interface
│   │   └── {Domain}Service.ts   # Implementation
│   └── validators/
│       ├── index.ts             # Re-exports
│       └── {domain}Validators.ts
```

---

## Error Handling

Errors flow naturally through the layers:

1. **Repository** throws `ApiError` from HTTP failures
2. **Validator** throws `ApiError` from validation failures  
3. **Service** lets errors bubble up naturally
4. **Component/Hook** catches and displays user-friendly messages

```typescript
import { ApiError } from "@/lib/api/errors";
import { ERROR_CODES } from "@/lib/constants/errorCodes";

try {
  const data = await service.getSomething();
} catch (error) {
  if (error instanceof ApiError) {
    // Handle based on error.tag (error code)
    console.error(`Error [${error.tag}]: ${error.message}`);
  }
}
```

---

## Migration Status

### Migrated to rootend:
- ✅ Vehicles/Listings (search, details)
- ✅ Locations (countries, regions, cities, owner locations CRUD)
- ✅ Camper-hire page
- ✅ Profile page (personal info, KYC)
- ✅ **Authentication** - HttpOnly cookies, middleware refresh, useAuth/useAccessToken hooks
- ✅ **Booking/Payment flow** - Uses `/api/quotes` for pricing, `/api/bookings` for creation
- ✅ **Admin pages auth** - All `/admin/*` routes now use `useAuth()` hook with layout-based role protection
- ✅ **Cancellation Policies** - Full CRUD via `modules/cancellation-policies/`, uses `/api/cancellation-policies` and `/api/cancellation-policy-templates` endpoints
- ✅ **Storage** - GCS uploads via `modules/storage/`, uses `/api/storage/images` (recommended for all image uploads) and `/api/storage/vehicles/{id}/documents/{type}` for vehicle documents
- ✅ **Vehicle Documents** - CRUD via `modules/vehicles/`, uses `/api/vehicles/documents/*` endpoints
- ✅ **Vehicle Videos** - CRUD via `modules/vehicles/`, uses `/api/vehicles/videos/*` endpoints
- ✅ **CamperForm** - Create/edit vehicles via `createVehiclesService()`, uses `/api/vehicles` endpoints
- ✅ **My Campers page** - Uses owner-dashboard endpoint for advertising data, shows pricing button
- ✅ **Locations CRUD** - `modules/locations/` now has full CRUD support via rootend endpoints

### Rootend endpoints ready (frontend migration pending):
- ✅ **Advertising CRUD** - `/api/advertising/*` endpoints for pricing rules, extras management
- ✅ **Owner Locations CRUD** - `/api/locations` and `/api/owners/{id}/locations` endpoints
- ✅ **Advertising With Pricing** - `POST /api/vehicles/{vehicle_id}/advertising-with-pricing` (transactional, implements immutability)
- ✅ **Admin Pricing Page** - Full migration to rootend using `advertising-with-pricing` endpoint. Includes security deposit setting (immutable versioning ensures deposit amount is frozen per booking).
- ✅ **Admin Blocked Days Page** - Uses `modules/blocked-days/` with `/api/vehicles/blocked-days/*` endpoints
- ✅ **Admin Extras Page** - Uses `modules/extras/` with `/api/advertising-extras/*` endpoints
- ✅ **Booking Confirmation/Rejection** - Owner actions via `/api/bookings/{id}/confirm` and `/api/bookings/{id}/reject` endpoints

### Still using Supabase (data operations to migrate):
- ⏳ **Trips management** - Trip status updates (`update_trip_status`, `update_trip_status_with_km`), inspections
- ⏳ **Post-trip flow** - Owner reviews, security deposit deductions (`/admin/post-trip`)
- ⏳ **Services module** - Emergency service providers CRUD (temporarily disabled, pages show "Coming Soon")

---

## Advertising Immutability (CRITICAL)

**Advertisings are immutable once bookings reference them.** This is critical for financial integrity.

### Why Immutability?

```
Trip → Booking → Advertising (snapshot) → Pricing Rules → Payment Amount
```

Once a booking exists, its `advertising_id` is a frozen reference. The pricing rules for that advertising MUST NEVER change because they're the legal basis for the payment.

### The Versioning Pattern

When changing pricing/cancellation policy/extras:
1. **DO NOT** update the existing advertising
2. **CREATE** a new advertising version
3. **DEACTIVATE** the old one (`is_active = false`)
4. Old bookings keep old advertising_id → prices preserved
5. New bookings use new advertising_id → new prices

### Frontend Pattern

Use the transactional endpoint for all pricing changes:

```typescript
// ✅ CORRECT: Use transactional endpoint
POST /api/vehicles/{vehicle_id}/advertising-with-pricing
{
  minimum_days: 3,
  cancellation_policy_id: "uuid",
  pricing_rules: [...],
  extras: [...],
  offers: [...]
}

// ❌ WRONG: Never directly update advertising/pricing rules
PUT /api/advertisings/{id}
PUT /api/advertising-pricing-rules/{id}
```

### What This Means for Migration

The admin pricing page currently uses Supabase's `update_advertising_with_pricing` RPC which:
1. Creates NEW advertising version (immutable)
2. Deactivates old advertising
3. Inserts all pricing rules atomically
4. All in one transaction

The rootend endpoint `POST /api/vehicles/{vehicle_id}/advertising-with-pricing` replicates this behavior exactly.

### Pending Refactoring:
- ⏳ **Auth role extraction consolidation** - Role extraction logic is duplicated in `mapSupabaseToAuthSession.ts` and `AuthProvider.tsx`. Should create `extractUserRole.ts` utility to centralize. See `docs/AUTH_IMPLEMENTATION.md` for details.

---

## Pricing Calculations (CRITICAL)

**All pricing calculations MUST be performed by the backend (rootend).** The frontend should NEVER calculate final prices.

### Why Backend-Only Pricing?

1. **Single Source of Truth**: The backend has access to all pricing rules, tier discounts, seasonal pricing, offers, and extras
2. **Tier Pricing Complexity**: Volume discounts (e.g., 7+ days gets lower rate) are applied based on booking duration and stored in JSONB format in the database
3. **Financial Integrity**: Frontend calculations can drift from backend logic, leading to price discrepancies
4. **Security**: Users cannot manipulate prices if calculations happen server-side

### The Quote Endpoint

Use `POST /api/quotes` to get pricing for any booking:

```typescript
// Request
const quoteRequest = {
  advertising_id: 12,
  start_date: "2026-03-18T00:00:00Z",
  end_date: "2026-03-24T00:00:00Z",
  extras: [
    { advertising_extra_id: "uuid", quantity: 1 }
  ]
};

// Response includes full breakdown
const quote = await bookingService.calculateQuote(quoteRequest);
// quote.total_price      → Final price to display
// quote.tier_savings     → Savings from volume discounts
// quote.extras_total     → Total for extras
// quote.offer_savings    → Savings from promotional offers
```

### Frontend Display Rules

```typescript
// ✅ CORRECT: Display prices from backend quote
<PriceDisplay
  rentalPrice={quoteTotalPrice}  // From backend
  validSecurityDeposit={securityDeposit}
/>

// ❌ WRONG: Calculate prices in frontend
const price = days * pricePerDay;  // Don't do this for final display
```

### What Frontend CAN Do

- **Preview calculations** for UI responsiveness (e.g., showing estimated price while loading)
- **Display** backend prices exactly as received
- **Format** prices for display (currency formatting)

### What Frontend MUST NOT Do

- **Determine final prices** shown to users at checkout
- **Calculate tier discounts** (complex logic with min_days thresholds)
- **Apply offers** (backend validates eligibility and stacking rules)

---

## Deployment Environments

The frontend uses three distinct environments with different configurations:

| Environment | Frontend URL | Backend URL | Purpose |
|-------------|--------------|-------------|---------|
| **Local** | `localhost:3000` | `localhost:54325` | Local development |
| **Preview** | `*.vercel.app` | `api-stg.rootscampers.com` | Staging/QA (Vercel preview deploys) |
| **Production** | `rootscampers.com` | `api.rootscampers.com` | Live site |

### Environment Variables

Environment variables are managed in **Vercel dashboard** for Preview and Production. Local uses `.env.development`.

Key variables per environment:
- `NEXT_PUBLIC_GO_API_URL` - rootend API base URL
- `NEXT_PUBLIC_AUTH_URL` - GoTrue auth endpoint (rootend routes `/auth/v1/*` to GoTrue)

### Vercel Project

- **Project**: `roots-campers/home`
- **CLI**: Use `vercel link` to connect local repo, `vercel env ls` to list env vars

### CORS Configuration

CORS is handled by **Caddy** on the rootend side (`rootend/infra/Caddyfile`). Allowed origins:
- `localhost:3000` / `127.0.0.1:3000` (local dev)
- `rootscampers.com` (production)
- `home-*-roots-campers.vercel.app` (team's Vercel preview deploys only)

**If CORS errors occur on preview deploys**, check the Caddy config in rootend. The regex pattern must use capture groups for dynamic origins:
```caddyfile
# ✅ CORRECT: Scoped to team's preview deploys with capture group
~^(https://home-.*-roots-campers\.vercel\.app)$ ${1}

# ❌ WRONG: Too permissive - allows ANY vercel.app origin
~^(https://.*\.vercel\.app)$ ${1}

# ❌ WRONG: Placeholder in quotes becomes literal string
"~^https://.*\.vercel\.app$" "{header.Origin}"
```

**Important:** After Caddyfile changes are deployed via CI/CD, Caddy must be restarted manually. The `docker compose up -d` command doesn't restart containers when only mounted volume files change.

```bash
# SSH into staging VM
gcloud compute ssh rootend-staging-vm --zone=us-central1-a

# Restart Caddy to pick up config changes
cd /opt/rootend && sudo docker compose -f docker-compose.deploy.yml restart caddy
```

For production, use `rootend-prod-vm` instead.

---

## rootend Endpoint Patterns

rootend uses Huma framework with consistent patterns:

```
GET    /api/{domain}/{id}           # Get by ID
GET    /api/{domain}                # List (with query params)
POST   /api/{domain}                # Create
PUT    /api/{domain}/{id}           # Update
DELETE /api/{domain}/{id}           # Delete
```

All responses are JSON. Errors follow the format:
```json
{
  "tag": "error_code",
  "message": "Human readable message"
}
```
