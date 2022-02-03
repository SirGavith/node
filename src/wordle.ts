import { Files } from "./main"

const Word = Files.ReadAllLines('../input.txt').filter(w => w.length === 5).Random()
Word.Log()

function clearLastLine() {
  process.stdout.moveCursor(0, -1) // up one line
  process.stdout.clearLine(1) // from cursor to end
}

function validateGuess(guess: string) {
    console.log(
        ...guess.toArray().flatMap((c, i) => {
            if (c === Word.at(i)) {
                return ['\x1b[32m', '\b\b', c ,'\x1b[0m', '\b\b']
            } else if (Word.toArray().includes(c)) {
                return ['\x1b[93m', '\b\b', c ,'\x1b[0m', '\b\b']
            } else {
                return ['\b', c]
            }
        }))

    if (guess === Word) {
        console.log(`That's right!`)
        return true
    }
    return false
}

const prompt = require('prompt-sync')({sigint: true});

console.log(`I'm thinking of a word...`)

while (true) {
    const guess = prompt(`What's your guess? > `);
    clearLastLine()
    if (validateGuess(guess)) break
}