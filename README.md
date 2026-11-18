# Practical coding

A workspace for the 33 problems in the problem book, solved in **JavaScript** with Node's built-in test runner. No dependencies, no framework — `node --test` is the whole harness.

```
practical-coding/
  problems/
    01-active-policies/     # one folder per problem
      README.md             # the statement, examples, and the trap
      solution.js           # your implementation lives here
      solution.test.js      # read-only-ish: the tests that define done
```

## Running

```sh
node --version                    # 20 or newer (24 recommended: type stripping)
npm test                          # runs every *.test.* under problems/
npm run test:folder -- 02-LRU     # only one problem folder
npm run test:watch                # re-runs on save
```

`test:folder` accepts a folder name under `problems/` or a full path. Extra Node flags are
forwarded, so `npm run test:folder -- 02-LRU --watch` watches only that folder. The
no-wrapper equivalent is `npm test -- "problems/02-LRU/**/*.test.ts"`.

The suite is **red on purpose**. `solution.js` currently throws `Not implemented`, and your job is to make the tests pass without editing them. If you think a test is wrong, say so out loud, write down why, then change it — but notice that impulse first.

## Type checking

Nothing is compiled — `tsc` only reports problems, and Node still runs the files directly.

```sh
npm run typecheck   # checks every solution.js and solution.ts under problems/
```

Tests are excluded on purpose: their untyped callbacks would bury the real errors.

Two ways to write types, both checked:

```js
// In .js — JSDoc. This is what the solutions already use.
/** @param {Array<{ id: number, start: number, end: number }>} policies
 *  @param {number} t
 *  @returns {number[]} */
export function activePolicyIds(policies, t) {}
```

```ts
// In .ts — rename solution.js to solution.ts and annotate as usual.
type Policy = { id: number; start: number; end: number };
export function activePolicyIds(policies: Policy[], t: number): number[] {}
```

If you switch a problem to `.ts`, change that test's import to `./solution.ts`. Node strips types per file and will **not** rewrite `./solution.js` into `./solution.ts`, so the import path is the one line a test may need — the rest of it stays untouched.

### Syntax worth drilling

```ts
const n: number = 1; // primitives: number, string, boolean
const ids: number[] = []; // array
const window: [number, number] = [0, 10]; // tuple — fixed length and order
type Policy = { id: number; start: number; end: number };

function pick(p: Policy, t: number): number | undefined; // union with undefined
function first<T>(xs: T[]): T | undefined; // generic
const cache = new Map<number, string>(); // generic in a call

if (typeof value === "number") {
  /* value is number here: narrowing */
}
```

`strict` is on, which is where most of the learning is: no implicit `any`, and `undefined` must be handled rather than ignored.

## The 45-minute protocol

1. **5 min — restate and pin boundaries.** Half-open `[start, end)` or closed? Ties? Empty? Duplicates? Write it in the problem folder's `README.md` before coding.
2. **25 min — implement** the exported function.
3. **10 min — edge cases and complexity.** Add tests for anything the guard tests miss; write the Big-O for time and space.
4. **5 min — name the pattern**, then add one line to that problem's README: the pattern, the complexity, and what fooled you.

A problem is done when a **cold re-solve takes under 10 minutes**, not when it passes once. That cold re-solve happens in the last 10 minutes of Sunday's Java block, so keep these folders runnable.

## Adding the next problem

Copy the shape, not the code:

```sh
mkdir problems/02-....
```

Each folder needs a `README.md` (statement, deliverable, example, trap), a `solution.js` exporting the named function, and a `solution.test.js` that fails before you start. Run `npm test` from the root; discovery is recursive.

## Where this sits in the plan

The wall timetable opens week 1 with problems **1, 2 and 29** (Active policies, LRU cache, Merge intervals). This first folder is **problem 1, "Active policies at time t"** — the book's warm-up, about 20 minutes, and a clean way to prove the toolchain works before Monday. Add the next folder when you reach it; the numbering follows the problem book.

Boundary checklist, from the book: half-open vs closed · ends before starts at equal timestamps · empty windows · adjacency · recurring time normalised to UTC · duplicate entities count once · answers in the caller's order.
