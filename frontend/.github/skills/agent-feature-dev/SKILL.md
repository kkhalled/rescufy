---
name: agent-feature-dev
description: >
  Use this skill whenever an AI coding agent (Codex, Copilot, Cursor, GPT-4, etc.) is being
  asked to implement a feature, add a component, refactor code, or scaffold anything in a
  React + TypeScript project. Triggers on: "add feature", "implement", "create component",
  "build X", "scaffold", "refactor", "add page", or any task that produces new code files.
  This skill enforces zero over-engineering, feature-based folder structure, clean separation
  of concerns, and minimum token output. Use it even if the user doesn't say "skill" — if
  they're asking an agent to write React/TS code, this applies.
---

# Agent Feature Dev — React + TypeScript

You are an AI coding agent implementing a feature in a React + TypeScript codebase.
Follow this skill exactly. Do not deviate. Do not add unrequested abstractions.

---

## Core Laws (never break these)

1. **No over-engineering.** If it can be done in 20 lines, do not write 80.
2. **No invented requirements.** Build exactly what was asked. Nothing more.
3. **No reinventing.** Check what already exists before creating anything new.
4. **One concern per file.** Components render. Hooks fetch/manage state. Schemas validate. Utils compute.
5. **Minimum tokens.** No JSDoc unless asked. No comments explaining obvious code.

---

## Step 1 — Understand Before Writing

Before touching a file, answer these internally:

- [ ] What is the exact feature being asked for? (one sentence)
- [ ] What files already exist that are relevant?
- [ ] What is the smallest possible implementation?
- [ ] Does a hook, util, schema, or component for this already exist?

If you cannot answer all four → ask **one** clarifying question. Not four.

---

## Step 2 — Locate or Create the Feature Folder

```
src/
├── features/
│   └── <feature-name>/
│       ├── components/     ← JSX + props only. No fetch. No server state.
│       ├── hooks/          ← Data fetching, async state, side effects
│       ├── pages/          ← Routed page views (compose components + hooks)
│       ├── schemas/        ← Zod validation schemas only
│       ├── types/          ← TS types and interfaces for this feature
│       └── utils/          ← Pure functions, formatters, validators
│
├── shared/
│   ├── common/             ← Constants, helpers used by 2+ features
│   ├── hooks/              ← Hooks used by 2+ features
│   └── ui/                 ← UI primitives used by 2+ features (Button, Modal...)
│
├── services/               ← API layer — axios calls only
├── store/                  ← Global state (Redux / Zustand)
├── config/                 ← Env config, axios instance, constants
├── app/
│   ├── layouts/            ← Layout wrappers
│   ├── provider/           ← App-level providers (QueryClient, Theme...)
│   └── routes/             ← Route definitions only
└── locales/                ← i18n translation files
```

**File rules — no exceptions:**

| Folder | What goes in | What never goes in |
|---|---|---|
| `components/` | JSX + props | Server state, fetch, business logic |
| `hooks/` | `use<n>.ts`, one hook per file | JSX, pure utils |
| `pages/` | Routed views only | Raw API calls |
| `schemas/` | Zod schemas (`<n>.schema.ts`) | Types, logic |
| `types/` | `type` and `interface` only | Logic, Zod |
| `utils/` | Pure functions, no React imports | State, JSX |
| `services/` | API functions only | UI, state, business logic |
| `shared/ui/` | Only if used by 2+ features | Feature-specific UI |

Do not create a shared file unless it is actually shared. Premature abstraction is a bug.

---

## Step 3 — Decision Tree

```
Is it a full routed view?
  YES → pages/

Is it UI only (no data fetching)?
  YES → components/

Does it fetch or manage async state?
  YES → hooks/use<n>.ts

Is it form / input validation?
  YES → schemas/<n>.schema.ts  (Zod)

Is it a TS shape / interface?
  YES → types/<n>.types.ts

Does it compute / transform / format?
  YES → utils/<n>.utils.ts

Is it an API call?
  YES → services/<n>.service.ts
```

When in doubt: **fewer files, not more.**

---

## Step 4 — Write the Code

### Component (lean)
```tsx
// features/<n>/components/<Component>.tsx
type Props = { /* only what's needed */ }

export function <Component>({ ... }: Props) {
  return ( /* JSX only */ )
}
```

### Hook (lean)
```ts
// features/<n>/hooks/use<n>.ts
import { useState, useEffect } from 'react'

export function use<n>() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  useEffect(() => { /* fetch */ }, [])
  return { data, loading, error }
}
```

### Zod Schema (lean)
```ts
// features/<n>/schemas/<n>.schema.ts
import { z } from 'zod'

export const <n>Schema = z.object({
  field: z.string().min(1, 'Required'),
})
export type <n>Input = z.infer<typeof <n>Schema>
```

### Type (lean)
```ts
// features/<n>/types/<n>.types.ts
export type <n> = {
  id: string
  // fields only, no logic
}
```

### Util (lean)
```ts
// features/<n>/utils/<n>.utils.ts
export function <n>(input: InputType): OutputType {
  // pure logic, no React
}
```

### Service (lean)
```ts
// services/<n>.service.ts
import api from '@/config/axios'
export const get<n> = (id: string) => api.get(`/route/${id}`)
export const create<n> = (data: <n>Input) => api.post('/route', data)
```

---

## Step 5 — Output Format

Output **only**:
1. File path as a comment on line 1
2. The code

**BAD:**
```
Sure! I'll create a reusable abstraction layer with a factory pattern...
// 200 lines with comments explaining every obvious line
```

**GOOD:**
```tsx
// src/features/ambulances_management/components/AmbulanceCard.tsx
export function AmbulanceCard({ name, status }: Props) {
  return <div>{name} — {status}</div>
}
```

Multiple files → list them one after another, path + code. No narration between them.

---

## Step 6 — Self-Check Before Sending

- [ ] Does any file do more than one thing?
- [ ] Did I add anything that wasn't asked for?
- [ ] Is there a simpler way to do this?
- [ ] Did I create an abstraction used only once?
- [ ] Are there more than 3 levels of nesting in any component?

Any YES → simplify first, then output.

---

## Anti-Patterns (instant fail)

| Anti-pattern | Fix |
|---|---|
| `Context` for data used in 1–2 components | Pass as props |
| Custom hook wrapping 3 lines | Inline it |
| `index.ts` barrel files everywhere | Only when explicitly needed |
| `<n>Manager`, `<n>Service`, `<n>Controller` naming | Name by what it does |
| `interface IUser` with `I` prefix | `type User` |
| Exporting everything | Export only what consumers need |
| `any` type | Proper type or `unknown` |
| `// TODO` left in output | Finish it or omit it |
| Asking 4 clarifying questions | Ask 1 max |
| Putting logic in `pages/` | Move to hook or util |
| Putting Zod in `types/` | Move to `schemas/` |
| Calling API in component | Move to `services/` |

---

## Token Budget Mindset

Every line you write costs the user attention and review time.
Ask: **"Would a junior dev understand this in 10 seconds?"**
- YES → ship it
- NO → it's too complex, simplify
