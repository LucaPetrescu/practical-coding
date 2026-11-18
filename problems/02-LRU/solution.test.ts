import test from "node:test";
import assert from "node:assert/strict";
import { LRUCache } from "./solution.ts";

test("misses return -1 on an empty cache", () => {
  const cache = new LRUCache(2);
  assert.equal(cache.get(1), -1);
});

test("hits return the stored value", () => {
  const cache = new LRUCache(2);
  cache.put(1, 100);
  assert.equal(cache.get(1), 100);
});

test("follows the README sequence", () => {
  const cache = new LRUCache(2);

  cache.put(1, 1);
  cache.put(2, 2);
  assert.equal(cache.get(1), 1);
  cache.put(3, 3);
  assert.equal(cache.get(2), -1);
  cache.put(4, 4);
  assert.equal(cache.get(1), -1);
  assert.equal(cache.get(3), 3);
  assert.equal(cache.get(4), 4);
});

test("evicts the least recently used key when full", () => {
  const cache = new LRUCache(2);
  cache.put(1, 1);
  cache.put(2, 2);
  cache.put(3, 3);

  assert.equal(cache.get(1), -1);
  assert.equal(cache.get(2), 2);
  assert.equal(cache.get(3), 3);
});

test("get makes a key the most recently used", () => {
  const cache = new LRUCache(2);
  cache.put(1, 1);
  cache.put(2, 2);
  cache.get(1);
  cache.put(3, 3);

  assert.equal(cache.get(2), -1);
  assert.equal(cache.get(1), 1);
  assert.equal(cache.get(3), 3);
});

test("put on an existing key updates the value", () => {
  const cache = new LRUCache(2);
  cache.put(1, 1);
  cache.put(1, 9);

  assert.equal(cache.get(1), 9);
});

test("put on an existing key is a use", () => {
  const cache = new LRUCache(2);
  cache.put(1, 1);
  cache.put(2, 2);
  cache.put(1, 9);
  cache.put(3, 3);

  assert.equal(cache.get(2), -1);
  assert.equal(cache.get(1), 9);
});

test("put on an existing key never evicts", () => {
  const cache = new LRUCache(1);
  cache.put(1, 1);
  cache.put(1, 2);

  assert.equal(cache.get(1), 2);
});

test("a miss does not change recency", () => {
  const cache = new LRUCache(2);
  cache.put(1, 1);
  cache.put(2, 2);
  assert.equal(cache.get(99), -1);
  cache.put(3, 3);

  assert.equal(cache.get(1), -1);
  assert.equal(cache.get(2), 2);
});

test("a stored zero is not a miss", () => {
  const cache = new LRUCache(2);
  cache.put(7, 0);

  assert.equal(cache.get(7), 0);
});

test("never holds more than capacity", () => {
  const cache = new LRUCache(3);
  for (let i = 1; i <= 10; i++) cache.put(i, i);

  assert.equal(cache.get(7), -1);
  assert.equal(cache.get(8), 8);
  assert.equal(cache.get(9), 9);
  assert.equal(cache.get(10), 10);
});

test("survives repeated eviction", () => {
  const cache = new LRUCache(2);
  for (let i = 1; i <= 5; i++) cache.put(i, i);

  assert.equal(cache.get(1), -1);
  assert.equal(cache.get(2), -1);
  assert.equal(cache.get(3), -1);
  assert.equal(cache.get(4), 4);
  assert.equal(cache.get(5), 5);
});

test("capacity 1 keeps only the last write", () => {
  const cache = new LRUCache(1);
  cache.put(1, 1);
  cache.put(2, 2);

  assert.equal(cache.get(1), -1);
  assert.equal(cache.get(2), 2);
});

test("re-putting the least recently used key keeps it alive", () => {
  const cache = new LRUCache(2);
  cache.put(1, 1);
  cache.put(2, 2);
  cache.put(1, 3);
  cache.put(3, 3);

  assert.equal(cache.get(2), -1);
  assert.equal(cache.get(1), 3);
  assert.equal(cache.get(3), 3);
});

test("interleaved gets drive eviction order", () => {
  const cache = new LRUCache(3);
  cache.put(1, 1);
  cache.put(2, 2);
  cache.put(3, 3);
  cache.get(1);
  cache.get(2);
  cache.put(4, 4);

  assert.equal(cache.get(3), -1);
  assert.equal(cache.get(1), 1);
  assert.equal(cache.get(2), 2);
  assert.equal(cache.get(4), 4);
});
