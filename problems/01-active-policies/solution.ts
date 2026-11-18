/**
 * Problem 1 — Active policies at time t
 *
 * start, end and t are ISO 8601 timestamps (UTC "Z" or with an offset).
 * A policy is active when: start <= t < end   (half-open interval)
 *
 * Timestamps can carry different offsets, so compare instants
 * (Date.parse gives epoch milliseconds) rather than raw strings.
 *
 * Return every active policy id once, in any order.
 *
 * @param {Array<{ id: number, start: string, end: string }>} policies
 * @param {string} t
 * @returns {Set<number>}
 */

interface Policy {
  id: number;
  start: string;
  end: string;
}

export function activePolicyIds(policies: Policy[], t: string): Set<number> {
  const activePoliciesIds: Set<number> = new Set();
  for (let i = 0; i < policies.length; i++) {

    const startTime = Date.parse(policies[i].start);
    const endTime = Date.parse(policies[i].end)
    const tTime = Date.parse(t)
    if ((startTime <= tTime && tTime < endTime)) {
      activePoliciesIds.add(policies[i].id);
    }
  }
  return activePoliciesIds;
}
