class Node {
  key: number;
  value: number;
  prev!: Node;
  next!: Node;

  constructor(key: number, value: number) {
    this.key = key;
    this.value = value;
  }
}

export class LRUCache {
  private capacity: number;
  private map = new Map<number, Node>();
  private head = new Node(0, 0);
  private tail = new Node(0, 0);

  constructor(capacity: number) {
    this.capacity = capacity;
    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  get(key: number): number {
    const node = this.map.get(key);
    if (node === undefined) return -1;
    this.detach(node);
    this.prepend(node);
    return node.value;
  }

  put(key: number, value: number): void {
    const existing = this.map.get(key);

    if (existing !== undefined) {
      existing.value = value;
      this.detach(existing);
      this.prepend(existing);
      return;
    }

    const node = new Node(key, value);
    this.map.set(key, node);
    this.prepend(node);

    if (this.map.size > this.capacity) {
      const victim = this.tail.prev;
      this.detach(victim);
      this.map.delete(victim.key);
    }
  }

  private detach(node: Node): void {
    node.prev.next = node.next;
    node.next.prev = node.prev;
  }

  private prepend(node: Node): void {
    node.next = this.head.next;
    node.prev = this.head;
    this.head.next.prev = node;
    this.head.next = node;
  }
}
