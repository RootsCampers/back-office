// Type imports from own module
import type { I{Domain}Repository } from "./I{Domain}Repository";

// Implementation imports from own module
import { Mock{Domain}Repository } from "./Mock{Domain}Repository";
// import { {Domain}Repository } from "./{Domain}Repository"; // Future: API implementation

export type { I{Domain}Repository } from "./I{Domain}Repository";

/**
 * Factory function to create a {domain} repository.
 * Swap implementation here when rootend endpoints are ready.
 */
export function create{Domain}Repository(): I{Domain}Repository {
  // TODO: When rootend endpoints are ready, swap to:
  // return new {Domain}Repository();
  return new Mock{Domain}Repository();
}
