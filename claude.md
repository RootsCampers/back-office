# RootsCampers Back-Office - Internal Admin Tool

> **Document for AI Assistants**
> Last updated: January 2025

## Project Overview

This is the **internal back-office admin tool** for the RootsCampers team. It is NOT a public-facing application.

**Purpose**: Help the RootsCampers team manage hosts, travelers, bookings, fleet operations, and sales.

**Access**: Restricted to `@rootscampers.com` email addresses only.

**Language**: English only (no i18n complexity for internal tool).

## Technology Stack

- **Framework**: Next.js 15+ with App Router
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **UI Components**: Radix UI + shadcn patterns
- **State Management**: React hooks + Context
- **Backend**: rootend (Go) via Caddy reverse proxy + Supabase (Auth only)
- **Auth**: Supabase Auth with GoTrue (restricted to @rootscampers.com)
- **Drag & Drop**: @hello-pangea/dnd (for Kanban boards)

---

## Application Structure

### Menu Navigation

```
Sales
├── CRM                    # Traveler booking funnel (Kanban)
└── (future: Reports, Quotations)

Operations
├── Host Acquisition       # Host onboarding funnel (Kanban)
├── Bookings              # Booking management
├── Trips                 # Trip operations
└── Incidents             # Incident tracking

Support
├── Tickets               # Support ticket management
├── Travelers             # Traveler support
└── Hosts                 # Host support

Fleet
├── Vehicles              # Vehicle management
├── Maintenance           # Maintenance scheduling
└── Documents             # Document management

Finance
├── Payments              # Payment tracking
├── Invoices              # Invoice management
└── Reports               # Financial reports
```

### CRM Sales Funnel Stages (Traveler Bookings)

| Stage | Description |
|-------|-------------|
| New Inquiry | Traveler reached out interested in a trip |
| Contacted | Team responded, conversation started |
| Quote Sent | Sent pricing/availability |
| Negotiating | Discussing dates, extras, terms |
| Booked | Payment received, trip confirmed |
| Lost | Didn't convert (track reason) |

### Host Acquisition Funnel Stages

| Stage | Description |
|-------|-------------|
| Lead | Potential host identified |
| Contacted | Initial outreach made |
| Qualified | Has vehicle, interested, fits criteria |
| Onboarding | Helping them list |
| Listed | Vehicle live on platform |
| Active | First rental completed |

---

## Pre-Commit Hooks (Automated)

This project uses **Husky + lint-staged** to automatically run checks before commits.

### What Runs Automatically on `git commit`

1. **ESLint** (via lint-staged) - Lints only staged `.ts/.tsx` files with auto-fix
2. **TypeScript type-check** - Currently disabled due to pre-existing errors (see below)

If the lint check fails, the commit is blocked. Fix the issues and try again.

### Known Issues (Pre-existing TypeScript Errors)

The following files have TypeScript errors that need to be fixed before enabling full type-checking in pre-commit:

- `components/SuspenseProviders.tsx` - Missing `@/hooks/usePageTracking`
- `components/VehicleSelector.tsx` - Missing `@/types/vehicles`, implicit any
- `modules/locations/components/LocationsSelector.tsx` - Missing `@/types/locations`, implicit any
- `modules/vehicles/components/VehicleCard.tsx` - Missing `@/utils/vehicle-translations`
- `modules/vehicles/components/VehicleFleetCard.tsx` - Multiple missing modules

Once these are fixed, uncomment `npm run typecheck` in `.husky/pre-commit`.

### Bypass (Emergency Only)

```bash
git commit --no-verify -m "message"
```

Use sparingly. CI will still catch errors on push.

### Setup (After Clone)

```bash
npm install  # Husky auto-installs via "prepare" script
```

---

## Pre-Push Checklist (MANDATORY)

Before pushing, verify these checks pass:

```bash
# 1. TypeScript - must pass with 0 errors
npm run typecheck

# 2. Lint - check for errors (warnings are acceptable)
npm run lint:staged
```

**Both checks must pass before pushing.** If any check fails:
1. Fix the issues
2. Re-run all checks from the beginning
3. Only push when all checks pass

---

## Authentication

### Email Domain Restriction

Login is **restricted to `@rootscampers.com` emails only**. This is enforced at:
1. **Frontend validation** - Before API call in LoginForm
2. **Service layer** - Double-check before auth attempt

### Auth Flow

```
LoginForm (validates @rootscampers.com)
    ↓
AuthService.signInWithPassword()
    ↓
AuthRepository (calls GoTrue)
    ↓
/api/auth/session (sets HttpOnly cookies)
    ↓
AuthProvider (stores session in Context)
```

### Key Hooks

```typescript
import { useAuth } from "@/modules/auth/hooks";

const { user, isAuthenticated, isLoading, signOut } = useAuth();
```

---

## Module Structure (STANDARD)

Every feature module MUST follow this exact structure:

```
modules/{domain}/
├── components/                    # Domain-specific UI components
│   ├── index.ts                   # Named exports only
│   ├── {Feature}Card.tsx          # Presentational component
│   └── {Feature}Board.tsx         # Container component
├── domain/
│   ├── index.ts                   # export * from "./types"
│   └── types.ts                   # TypeScript types/interfaces
├── hooks/
│   ├── index.ts                   # export { use{Feature} } from "./use{Feature}"
│   └── use{Feature}.ts            # React hooks for data fetching/state
├── repositories/
│   ├── index.ts                   # Factory function + re-exports
│   ├── I{Domain}Repository.ts     # Interface definition
│   ├── {Domain}Repository.ts      # API implementation (for rootend)
│   └── Mock{Domain}Repository.ts  # Mock implementation (for development)
├── services/
│   ├── index.ts                   # Factory function + re-exports
│   ├── I{Domain}Service.ts        # Interface definition
│   └── {Domain}Service.ts         # Business logic implementation
├── validators/                    # Optional: if validating API responses
│   ├── index.ts                   # export * from "./{Domain}Schema"
│   └── {Domain}Schema.ts          # Zod schemas
└── index.ts                       # Module barrel export
```

### Module Index File Pattern

Every module's root `index.ts` MUST export all subdirectories:

```typescript
// modules/{domain}/index.ts
export * from "./components";
export * from "./domain";
export * from "./hooks";
export * from "./repositories";
export * from "./services";
// export * from "./validators"; // if exists
```

---

## Naming Conventions (STRICT)

### File Naming

| Purpose | Pattern | Example |
|---------|---------|---------|
| Types file | `types.ts` | `domain/types.ts` |
| Service interface | `I{Domain}Service.ts` | `ILeadService.ts` |
| Service implementation | `{Domain}Service.ts` | `LeadService.ts` |
| Repository interface | `I{Domain}Repository.ts` | `ILeadRepository.ts` |
| Repository implementation | `{Domain}Repository.ts` | `LeadRepository.ts` |
| Mock repository | `Mock{Domain}Repository.ts` | `MockLeadRepository.ts` |
| React hook | `use{Feature}.ts` | `useLeads.ts` |
| Zod schema | `{Domain}Schema.ts` | `LeadSchema.ts` |
| Presentational component | `{Feature}Card.tsx` | `LeadCard.tsx` |
| Container component | `{Feature}Board.tsx` | `KanbanBoard.tsx` |

### Interface Naming

- Service interfaces: `I{Domain}Service` (singular) - e.g., `ILeadService`
- Repository interfaces: `I{Domain}Repository` (singular) - e.g., `ILeadRepository`

### Export Patterns

**Services index.ts:**
```typescript
export type { ILeadService } from "./ILeadService";
export { LeadService, createLeadService } from "./LeadService";
```

**Repositories index.ts:**
```typescript
export type { ILeadRepository } from "./ILeadRepository";
export { createLeadRepository } from "./MockLeadRepository";
// Future: export { createLeadRepository } from "./LeadRepository";
```

**Components index.ts:**
```typescript
// Use NAMED exports, not export *
export { LeadCard } from "./LeadCard";
export { KanbanBoard } from "./KanbanBoard";
```

---

## Import Order (STRICT)

All files MUST follow this import order:

```typescript
// 1. Type imports from own module
import type { ILeadService } from "./ILeadService";
import type { ILeadRepository } from "../repositories/ILeadRepository";
import type { Lead, LeadStage } from "../domain/types";

// 2. Implementation imports from own module
import { createLeadRepository } from "../repositories";
import { validateLeadData } from "../validators";

// 3. Imports from other modules
import { useAuth } from "@/modules/auth/hooks";

// 4. Shared library imports
import { cn } from "@/lib/utils";
import { ApiError } from "@/lib/api/errors";

// 5. UI component imports
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// 6. External library imports
import { useState, useCallback } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
```

---

## Mock Data Pattern

For features not yet connected to rootend, use mock repositories:

```typescript
// modules/crm/repositories/ILeadRepository.ts
export interface ILeadRepository {
  getAll(): Promise<Lead[]>;
  getById(id: string): Promise<Lead | null>;
  create(data: CreateLeadData): Promise<Lead>;
  update(id: string, data: UpdateLeadData): Promise<Lead>;
  updateStage(id: string, stage: LeadStage): Promise<Lead>;
}

// modules/crm/repositories/MockLeadRepository.ts
export class MockLeadRepository implements ILeadRepository {
  private leads: Lead[] = MOCK_LEADS;
  // ... implementation with in-memory data
}

// modules/crm/repositories/LeadRepository.ts (future)
export class LeadRepository implements ILeadRepository {
  // ... implementation with apiFetchData calls to rootend
}

// modules/crm/repositories/index.ts
import { MockLeadRepository } from "./MockLeadRepository";
// import { LeadRepository } from "./LeadRepository";

export type { ILeadRepository } from "./ILeadRepository";

// Swap implementation when rootend endpoints are ready
export function createLeadRepository(): ILeadRepository {
  return new MockLeadRepository();
  // return new LeadRepository();
}
```

---

## API Client

For rootend communication (when ready):

```typescript
import { apiFetchData } from "@/lib/api/client";

const data = await apiFetchData<MyType>("/api/endpoint", {
  method: "GET",
  token: accessToken,
  cache: "no-store",
});
```

---

## Component Patterns

### UI Components (Shared)

Located in `components/ui/` - Radix UI based:
- Button, Input, Label, Card, Dialog
- Select, Checkbox, Tabs, Dropdown
- Alert, Badge, Tooltip, Popover

### Layout Components

Located in `components/layout/`:
- `Sidebar.tsx` - Main navigation
- `DashboardLayout.tsx` - Authenticated layout wrapper

### Domain Components

Located in `modules/{domain}/components/`:
- Keep domain-specific components close to their module
- Import shared UI from `components/ui/`
- Use named exports in index.ts

### Page Components

Located in `app/[lng]/(dashboard)/`:
- Use "use client" directive only when needed
- Prefer server components when possible
- Use hooks for client-side data fetching

---

## Styling Guidelines

- Use TailwindCSS utilities
- Follow existing color scheme (HSL CSS variables)
- Sidebar: dark background (`bg-slate-900`)
- Content area: light background (`bg-slate-50` or `bg-background`)
- Cards: white background (`bg-white`) with border
- Consistent spacing: `p-4`, `p-6` for containers
- Use `cn()` from `@/lib/utils` for conditional classes

---

## Error Handling

```typescript
import { ApiError } from "@/lib/api/errors";

try {
  const data = await service.getSomething();
} catch (error) {
  if (error instanceof ApiError) {
    // Handle based on error.tag
    console.error(`Error [${error.tag}]: ${error.message}`);
  }
}
```

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `app/[lng]/layout.tsx` | Root layout |
| `app/[lng]/(dashboard)/layout.tsx` | Dashboard layout with sidebar |
| `components/layout/Sidebar.tsx` | Navigation sidebar |
| `components/layout/DashboardLayout.tsx` | Auth-protected wrapper |
| `modules/auth/hooks/useAuth.ts` | Auth state hook |
| `modules/crm/` | CRM module (leads, funnels) |
| `lib/api/client.ts` | API client for rootend |
| `lib/utils.ts` | Utility functions (cn, etc.) |

---

## Development

```bash
# Start development server
npm run dev

# Type check
npm run typecheck

# Lint all directories
npm run lint

# Lint staged files only (used by pre-commit)
npm run lint:staged
```

---

## Related Documentation

- `docs/MARKET_ANALYSIS.md` - Industry research and feature recommendations
- `rootend/CLAUDE.md` - Backend API documentation
