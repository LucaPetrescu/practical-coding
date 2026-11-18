export class LRUCache {
    private capacity: number;
    private map: Map<number, number> = new Map()
    private head: Node | null;
    private tail: Node | null;

    constructor(capacity: number) {
        this.capacity = capacity
        this.head = this.tail = null
    }

    get(key: number): number {
        const node = this.map.get(key)

        if(node === undefined || node === null) {
            return -1
        }

        return node
    }

    put(key: number, val: number): void {
        this.map.set(key, val)
    }
    
}

export class Node {
    value: number
    next: Node | null
    prev: Node | null

    constructor(value: number) {
        this.value = value
        this.next = null
        this.prev = null
    }
}

// Testing part

let cache = new LRUCache(2)

console.log(cache)