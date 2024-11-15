export const Cyan = "\x1b[36m"
export const Reset = "\x1b[0m"

export class Vertex {
    Adjacents = new Map<Vertex, number>()

    constructor(public Name: string) {}
}

export class Graph {
    Vertices: Set<Vertex>

    constructor(verticies: Vertex[] = []) {
        this.Vertices = new Set(verticies)
    }

    getVertex() {
        return this.Vertices.values().next().value
    }

    get Size(): number {
        return this.Vertices.size
    }
}

//Returns min cut of graph
export function StoerWagnerMinCut(G: Graph) {
    let minCut = Number.MAX_VALUE

    while (G.Size > 1) {
        const cut = MinCutPhase(G)
        if (cut < minCut) minCut = cut
    }
    return minCut
}

function MinCutPhase(G: Graph): number {
    const supernode = new Set([G.getVertex()!])
    const supernodeNeighbors: Map<Vertex, number> = new Map(G.getVertex()!.Adjacents)

    let mostConnectedVertex: Vertex = supernodeNeighbors.entries().next().value![0]

    while (supernodeNeighbors.size > 1) {
        //add most-connected vertex to A
        mostConnectedVertex = GetMostConnectedVertex(supernodeNeighbors)

        supernodeNeighbors.delete(mostConnectedVertex)
        supernode.add(mostConnectedVertex)

        for (const [v, w] of mostConnectedVertex.Adjacents) {
            if (supernode.has(v)) continue

            supernodeNeighbors.set(v,
                (supernodeNeighbors.get(v) ?? 0) + w)
        }
    }

    // merge s and t 
    const s = mostConnectedVertex!
    const [t, cutWeight] = supernodeNeighbors.entries().next().value!

    console.log(`Found s-t mincut with weight`, cutWeight)

    for (const [v, w] of t.Adjacents) {
        if (v === s) continue
        v.Adjacents.set(s, (v.Adjacents.get(s) ?? 0) + w)
        v.Adjacents.delete(t)
        s.Adjacents.set(v, (s.Adjacents.get(v) ?? 0) + w)
    }
    s.Adjacents.delete(t)
    G.Vertices.delete(t)

    const sName = s.Name
    
    s.Name += t.Name
    if (G.Size > 1) 
        console.log(`Merging ${Cyan + sName + Reset} with ${Cyan + t.Name + Reset} =>`, Cyan, [...G.Vertices.values()].map(v => v.Name).join(' '), Reset)

    return cutWeight
}

function GetMostConnectedVertex(supernodeNeighbors: Map<Vertex, number>): Vertex {
    let mostConnectedVertex: [Vertex | null, number] = [null, 0]
    for (const n of supernodeNeighbors) {
        if (n[1] > mostConnectedVertex[1])
            mostConnectedVertex = n
    }
    return mostConnectedVertex[0]!
}

export function Main() {
    const a = new Vertex('a')
    const b = new Vertex('b')
    const c = new Vertex('c')
    const d = new Vertex('d')
    const e = new Vertex('e')
    const f = new Vertex('f')

    a.Adjacents = new Map([[f, 4], [e, 1], [b, 5]])
    b.Adjacents = new Map([[a, 5], [c, 2]])
    c.Adjacents = new Map([[b, 2], [f, 1], [d, 6], [e, 1]])
    d.Adjacents = new Map([[c, 6], [e, 3]])
    e.Adjacents = new Map([[d, 3], [c, 1], [a, 1]])
    f.Adjacents = new Map([[c, 1], [a, 4]])

    const g = new Graph([a, b, c, d, e, f])

    console.log(`Global Min-Cut:`, StoerWagnerMinCut(g))
}