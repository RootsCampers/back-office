# Module Template

This is a reference template for creating new modules in the back-office application.
Copy this structure when creating a new module and replace `{domain}` with your domain name.

## Directory Structure

```
modules/{domain}/
├── index.ts                    # Main re-export file
├── domain/
│   ├── index.ts               # Re-exports types
│   └── types.ts               # TypeScript types/interfaces
├── validators/
│   ├── index.ts               # Re-exports validators
│   └── {Domain}Schema.ts      # Zod validation schemas
├── repositories/
│   ├── index.ts               # Factory function + re-exports
│   ├── I{Domain}Repository.ts # Repository interface
│   ├── {Domain}Repository.ts  # API implementation (future)
│   └── Mock{Domain}Repository.ts # Mock for development
├── services/
│   ├── index.ts               # Re-exports
│   ├── I{Domain}Service.ts    # Service interface
│   └── {Domain}Service.ts     # Service implementation
├── hooks/
│   ├── index.ts               # Re-exports
│   └── use{Domain}.ts         # React hooks
└── components/
    ├── index.ts               # Re-exports
    └── {Component}.tsx        # Domain-specific components
```

## Import Order Convention

All files must follow this strict import order:

```typescript
// 1. Type imports from own module (alphabetical)
import type { I{Domain}Service } from "./I{Domain}Service";
import type { {Entity}, Create{Entity}Data } from "../domain/types";

// 2. Implementation imports from own module
import { create{Domain}Repository } from "../repositories";

// 3. Imports from other modules
import { useAuth } from "@/modules/auth/hooks";

// 4. Shared library imports
import { cn } from "@/lib/utils";

// 5. UI component imports
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// 6. External library imports
import { useState, useCallback } from "react";
import { z } from "zod";
```

## File Templates

See the individual template files in this directory for copy-paste starting points.
