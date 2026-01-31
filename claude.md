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

## Module Structure (Service/Repository Pattern)

For new features, follow the layered architecture:

```
modules/{domain}/
├── domain/
│   ├── index.ts          # Re-exports
│   └── types.ts          # TypeScript types/interfaces
├── repositories/
│   ├── index.ts          # Re-exports
│   ├── I{Domain}Repository.ts  # Interface
│   ├── {Domain}Repository.ts   # API implementation
│   └── Mock{Domain}Repository.ts  # Mock for development
├── services/
│   ├── index.ts          # Re-exports
│   ├── I{Domain}Service.ts     # Interface
│   └── {Domain}Service.ts      # Implementation
├── hooks/
│   └── use{Domain}.ts    # React hooks
└── components/           # Domain-specific components
```

### Mock Data Pattern

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

### UI Components

Located in `components/ui/` - Radix UI based:
- Button, Input, Label, Card, Dialog
- Select, Checkbox, Tabs, Dropdown
- Alert, Badge, Tooltip, Popover

### Layout Components

- `components/layout/Sidebar.tsx` - Main navigation
- `components/layout/DashboardLayout.tsx` - Authenticated layout wrapper

### Domain Components

Located in `modules/{domain}/components/`:
- Keep domain-specific components close to their module
- Import shared UI from `components/ui/`

---

## Styling Guidelines

- Use TailwindCSS utilities
- Follow existing color scheme (HSL CSS variables)
- Sidebar: dark background (`bg-slate-900`)
- Content area: light background (`bg-background`)
- Consistent spacing: `p-4`, `p-6` for containers

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
| `modules/auth/hooks/useAuth.ts` | Auth state hook |
| `modules/crm/` | CRM module (leads, funnels) |
| `lib/api/client.ts` | API client for rootend |

---

## Development

```bash
# Start development server
npm run dev

# Type check
npx tsc --noEmit

# Lint
npx next lint
```

---

## Related Documentation

- `docs/MARKET_ANALYSIS.md` - Industry research and feature recommendations
- `rootend/CLAUDE.md` - Backend API documentation
