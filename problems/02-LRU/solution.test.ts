import test from "node:test";
import assert from "node:assert/strict";
import { LRUCache } from "./solution.ts";

test("get return 1 for key 1",  () => {
    const lru = new LRUCahce(2)
    lru.put(1, 1)
    assert.equal(lru.get(1), 1)
})

test("get return -1 for key 2", () => {
    const lru = new LRUCahce(2)
    lru.put(1, 1)
    lru.put(3, 2)
    assert.equal(lru.get(2), -1)
})