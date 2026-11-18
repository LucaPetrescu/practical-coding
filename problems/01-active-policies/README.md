# Problem 1 — Active policies at time t

`Amazon screen · Stripe variant · warm-up`

## The ask

Each policy has an `id` and a half-open effective window `[start, end)`. `start`, `end` and the query time `t` are **ISO 8601 timestamps** — UTC (`Z`) or with an offset (`+02:00`). Return the ids of every policy active at `t`, where a policy is active when `start <= t < end`.

Timestamps may arrive with different offsets, so compare **instants**, not strings: `"2026-11-13T10:00:00+02:00"` and `"2026-11-13T08:00:00Z"` are the same moment.

A policy that appears more than once (or with overlapping windows) is reported **once**.

```js
activePolicyIds(
  [
    { id: 1, start: "2026-11-13T09:00:00Z", end: "2026-11-13T10:00:00Z" },
    { id: 2, start: "2026-11-13T09:30:00Z", end: "2026-11-13T11:00:00Z" },
    { id: 1, start: "2026-11-13T09:45:00Z", end: "2026-11-13T12:00:00Z" },
  ],
  "2026-11-13T09:50:00Z",
); // -> [1, 2]
```

## Deliverable

```js
export function activePolicyIds(policies, t) { ... }
```

- `policies`: `Array<{ id: number, start: string, end: string }>` — ISO 8601
- `t`: ISO 8601 string
- returns: `number[]` — unique ids, order not important

## Watch out

- A policy whose `start` equals `t` is **active**; one whose `end` equals `t` is **not**.
- `Date.parse` gives epoch milliseconds — compare those, not the raw strings, unless you normalise every value to UTC first.
- The input is not sorted, and the same id may appear in several windows.
- `start === end` is an empty window and is never active; `start > end` is invalid — decide what you do with it and write it down.
- An unparseable timestamp is bad input, not a silent `NaN` comparison.

## Follow-ups (say them out loud, don't code them yet)

1. **A million queries** on a static set: what changes? (Sort by start, binary search on parsed instants, or sweep with per-policy counters.)
2. **Policies added and removed at runtime:** which structure still gives you `O(log n)`?
3. **Precedence:** when two policies overlap, return only the more specific one. What does "specific" mean, and where does it live in the data model?

## Done when

- All tests in `solution.test.js` pass.
- You can state the time and space complexity.
- You can answer follow-up 1 out loud in under a minute.
