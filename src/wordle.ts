import { Files, Range, Sorts } from "./main"

function clearLastLine() {
    process.stdout.moveCursor(0, -1) // up one line
    process.stdout.clearLine(1) // from cursor to end
}

class WordleGame {
    Word: string
    Guesses: string[] = []

    constructor() {
        this.Word = Files.ReadAllLines('../possibleWords.txt').filter(w => w.length === 5).Random()
    }

    Guess(guess: string, log = true): boolean {
        if (log) this.LogGuess(guess)
        this.Guesses.push(guess)
        guess.toArray().map((c, i) => {
            if (c === this.Word.at(i)) {
                //green
            } else if (this.Word.toArray().includes(c)) {
                //yellow
            } else {} //black
        })
        return guess === this.Word
    }

    LogGuess(guess: string) {
        console.log(
            ...guess.toArray().flatMap((c, i) => {
                if (c === this.Word.at(i)) {
                    return ['\x1b[32m', '\b\b', c ,'\x1b[0m', '\b\b']
                } else if (this.Word.toArray().includes(c)) {
                    return ['\x1b[93m', '\b\b', c ,'\x1b[0m', '\b\b']
                } else {
                    return ['\b', c]
                }
            }))
    }

    Log() {
        this.Guesses.forEach(g => this.LogGuess(g))
    }
}

// const words = Files.ReadAllLines('../validGuesses.txt')
// words.flatMap(w => w.toArray()).Frequencies(true).Log()
// Range(0, 4).forEach(i => {
//     console.log('Place', i)
//     words.map(w => w.charAt(i)).Frequencies(true).Log()
// })




const w = new WordleGame





//make a guess





const prompt = require('prompt-sync')({sigint: true});

console.log(`I'm thinking of a word...`)

while (true) {
    const guess = prompt(`What's your guess? > `);
    clearLastLine()

    if (w.Guess(guess)) {
        console.log(`That's right!`)
        break
    }
}