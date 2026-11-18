# Problem 2 — LRU cache

`Amazon · Google · Meta · O(1) design`

## The ask

A fixed-capacity cache. `get(key)` returns the value or `-1` and marks the key as **most
recently used**. `put(key, value)` inserts or updates and marks the key as used; when the
cache is full, the **least recently used** entry is evicted. Both operations must be
`O(1)` average.

Capacity 2:

```ts
const cache = new LRUCache(2);

cache.put(1, 1); // cache: 1
cache.put(2, 2); // cache: 2, 1
cache.get(1); // -> 1      cache: 1, 2
cache.put(3, 3); // evicts 2  cache: 3, 1
cache.get(2); // -> -1     cache: 3, 1
cache.put(4, 4); // evicts 1  cache: 4, 3
cache.get(1); // -> -1     cache: 4, 3
cache.get(3); // -> 3      cache: 3, 4
cache.get(4); // -> 4      cache: 4, 3
```

The line that decides it is `put(3, 3)`: key `2` is evicted, not key `1`, because `get(1)`
refreshed it one call earlier.

## Deliverable

```ts
export class LRUCache {
  constructor(capacity: number);
  get(key: number): number;
  put(key: number, value: number): void;
}
```

- `capacity`: positive integer; the cache never holds more entries than this
- `get`: the stored value, or `-1` when the key is absent
- `put`: inserts or updates; returns nothing

## Watch out

- **Updating an existing key is a use.** `put(k, v2)` moves `k` to the front even when the
  value did not change. This is the most common lost point.
- **Evict only when a new key is inserted at capacity.** `get` never evicts, and a miss
  never changes recency order.
- A `Map` alone cannot move a key to the front in `O(1)`; a list alone cannot look a key up
  in `O(1)`. Use both — a hash map of nodes plus a doubly linked list.
- Use sentinel `head` and `tail` nodes so inserting and removing at either end needs no null
  checks. Keep the invariant: `head ⇄ MRU ⇄ … ⇄ LRU ⇄ tail`.
- Delete the evicted key from the map as well as unlinking the node, or the evicted entry
  stays reachable and the cache quietly grows.
- Unlink before re-inserting a node that is already at the front, or the list self-links
  and the next traversal loops.
- `-1` is the miss sentinel, so values must be non-negative numbers. If arbitrary values
  are wanted, say so and change the miss result; do not overload `-1`.

## Follow-ups (say them out loud, don't code them yet)

1. **TTL per entry:** add an expiry. Does it happen lazily on `get` or in a sweep, and is
   an expired entry the same as an evicted one?
2. **`peek(key)`, `delete(key)`, `size`:** which of these may touch recency, and which must
   not?
3. **Weighted capacity:** evict by total weight instead of entry count. How many entries
   can one `put` evict?
4. **LFU:** evict the least *frequently* used entry. Why is true `O(1)` harder here?

## Done when

- All tests in `solution.test.ts` pass.
- You can state the invariant and the time and space complexity of each operation.
- You can answer follow-up 1 out loud in under a minute.
