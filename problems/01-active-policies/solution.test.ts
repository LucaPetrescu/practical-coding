import test from "node:test";
import assert from "node:assert/strict";
import { activePolicyIds } from "./solution.ts";

const sorted = (xs) => [...xs].sort((a, b) => a - b);

/**
 * Order is not part of the contract, so compare sorted copies.
 * deepEqual on arrays also catches duplicates (a repeated id changes the length).
 */
function assertIds(actual: Set<number>, expected: Set<number>) {
  assert.ok(actual instanceof Set, "activePolicyIds must return a Set");
  assert.deepEqual([...actual], [...expected]);
}

test("returns every active policy id for the worked example", () => {
  const policies = [
    { id: 1, start: "2026-11-13T09:00:00Z", end: "2026-11-13T10:00:00Z" },
    { id: 2, start: "2026-11-13T09:30:00Z", end: "2026-11-13T11:00:00Z" },
    { id: 1, start: "2026-11-13T09:45:00Z", end: "2026-11-13T12:00:00Z" },
  ];
  assertIds(activePolicyIds(policies, "2026-11-13T09:50:00Z"), new Set([1, 2]));
});

test("start is inclusive, end is exclusive", () => {
  const policies = [{ id: 7, start: "2026-11-13T10:00:00Z", end: "2026-11-13T11:00:00Z" }];
  assertIds(activePolicyIds(policies, "2026-11-13T10:00:00Z"), new Set([7]));
  assertIds(activePolicyIds(policies, "2026-11-13T10:59:59.999Z"), new Set([7]));
  assertIds(activePolicyIds(policies, "2026-11-13T11:00:00Z"), new Set([]));
});

test("timestamps with offsets are compared as instants, not strings", () => {
  // 10:00+02:00 === 08:00Z
  const policies = [
    { id: 3, start: "2026-11-13T10:00:00+02:00", end: "2026-11-13T12:00:00+02:00" },
  ];
  assertIds(activePolicyIds(policies, "2026-11-13T08:00:00Z"), new Set([3]));
  assertIds(activePolicyIds(policies, "2026-11-13T08:30:00Z"), new Set([3]));
  assertIds(activePolicyIds(policies, "2026-11-13T07:59:59Z"), new Set([]));
  assertIds(activePolicyIds(policies, "2026-11-13T10:00:00Z"), new Set([]));
});

test("a repeated id with overlapping windows is reported once", () => {
  const policies = [
    { id: 1, start: "2026-11-13T00:00:00Z", end: "2026-11-14T00:00:00Z" },
    { id: 1, start: "2026-11-13T09:00:00Z", end: "2026-11-13T10:00:00Z" },
    { id: 2, start: "2026-11-13T09:30:00Z", end: "2026-11-13T09:31:00Z" },
  ];
  assertIds(activePolicyIds(policies, "2026-11-13T09:45:00Z"), new Set([1]));
  assertIds(activePolicyIds(policies, "2026-11-13T09:30:00Z"), new Set([1, 2]));
});

test("returns an empty set when nothing is active", () => {
  assertIds(activePolicyIds([], "2026-11-13T00:00:00Z"), new Set([]));
  const policies = [{ id: 1, start: "2026-11-13T10:00:00Z", end: "2026-11-13T11:00:00Z" }];
  assertIds(activePolicyIds(policies, "2026-11-13T05:00:00Z"), new Set([]));
  assertIds(activePolicyIds(policies, "2026-11-14T05:00:00Z"), new Set([]));
});

test("an empty window (start === end) is never active", () => {
  const policies = [{ id: 1, start: "2026-11-13T10:00:00Z", end: "2026-11-13T10:00:00Z" }];
  assertIds(activePolicyIds(policies, "2026-11-13T10:00:00Z"), new Set([]));
});
