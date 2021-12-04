import { Files, PushorCreate } from './main'

const UseExample = false,
    Data = Files.ReadAllLines(UseExample ? '../example.txt' : '../input.txt'),
    DataFull = Files.ReadFile(UseExample ? '../example.txt' : '../input.txt')

class Advent2021 {
    static Day1() {
        Data.toIntArray()
            .reduce((p, _, i, a) => {
                const c = a.slice(i, i+3).Sum()
                return [p[0] + (c > p[1] ? 1 : 0), c]
            }, [0, Number.MAX_VALUE])[0].Log()
    }
    static Day2() {
        Data.map(s => s.split(' '))
            .reduce((p: number[], v) => {
                const val = v[1].toInt()
                return [
                    p[0] + (v[0] === 'forward' ? val : 0),
                    p[1] + (v[0] === 'forward' ? p[2] * val : 0),
                    p[2] + (v[0] !== 'forward' ? (v[0] === 'down' ? 1 : -1) * val : 0)
                ]
            }, [0, 0, 0]).Log().slice(0, 2).Product().Log()
    }
    static Day3() {
        let oxygen = Data.copy(),
            co2 = Data.copy()

        Data.ReduceFilter(
            (n, i) => n[i] === Data.map(x => x[i])
                .sort((a,b) => a.toInt() - b.toInt())
                .MostCommon()
        ).Log()

        // for (let i = 0; oxygen.length > 1; i++) {
            
        // }
        for (let i = 0; co2.length > 1; i++) {
            const mc = co2.map(x => x[i])
                .sort((a,b) => a.toInt() - b.toInt())
                .LeastCommon()
            co2 = co2.filter(n => n[i] === mc)
        }

        (oxygen[0].toInt(2) * co2[0].toInt(2)).Log()
    }
    static Day4() {
        const d = DataFull.split('\n\n'),

            randoms = d[0].split(',').toIntArray(),

            boards = d.slice(1).map(b => { return {
                bingo: false,
                board: b.SplitLines().map(l => 
                    l.replaceAll('  ', ' ').trim().split(' ')
                    .toIntArray()
                    .map(i => { return { value: i, marked: false }})
                ) } }
            )

        for (let i = 0; true; i++) {
            //draw random
            const rand = randoms[i]
            //mark tiles
            boards.forEach(board => {
                board.board.forEach(row => {
                    row.forEach(tile =>{
                        if (tile.value === rand)
                            tile.marked = true
                    })
                })
            })
            //check bingos
            for (const board of boards) { 
                for (let ii = 0; ii < 5; ii++) {
                    const row = board.board[ii],
                        col = board.board.map(row => row[ii])

                    //rows
                    if (!board.bingo && row.every(tile => tile.marked))
                        board.bingo = true

                    //cols
                    if (!board.bingo && col.every(tile => tile.marked))
                        board.bingo = true
                }
                
                if (boards.every(b => b.bingo))
                    return (board.board.flat()
                            .filter(t => !t.marked)
                            .reduce((s, c) => s + c.value, 0)
                        * rand).Log()
            }
        }
    }
}
Advent2021.Day4();