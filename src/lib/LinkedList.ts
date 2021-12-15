export class LinkedList<T> {
    public Head: LinkedNode<T> | undefined
    public Final: LinkedNode<T> | undefined = undefined

    constructor() {
        this.Head = undefined
    }

    Push(node: LinkedNode<T>) {
        if (this.Final) {
            this.Final.Next = node
        }
        else {
            this.Head = node
        }
        this.Final = node
    }

    toArray() {
        const arr: T[] = []
        const pushRecursive = (node: LinkedNode<T>) => {
            arr.push(node.Value)
            if (node.Next)
                pushRecursive(node.Next)
        }
        if (this.Head) pushRecursive(this.Head)
        return arr
    }

    Count() {
        let count = 0
        let node = this.Head
        while (node) {
            count++
            node = node.Next
        }
        return count
    }

    BigCount() {
        let count = 0n
        let node = this.Head
        while (node) {
            count++
            node = node.Next
        }
        return count
    }

    toString() {
        return this.toArray().join()
    }
}

export class LinkedNode<T> {
    public Value: T
    public Next: LinkedNode<T> | undefined
    constructor(Value: T) {
        this.Value = Value
    }

    InsertAfter(node: LinkedNode<T>) {
        node.Next = this.Next
        this.Next = node;
    }
}