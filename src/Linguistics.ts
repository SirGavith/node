abstract class Linguistics {
    static WordFrequency(s: string) {
        const sanitized = [...s.matchAll(/\w+/g)]

        const frequencies: { [word:string]: number } = {}

        sanitized.forEach(word => {
            const w = word[0].toLowerCase()
            if (w in frequencies) frequencies[w]++
            else frequencies[w] = 1
        })

        console.log(frequencies)

        Object.keys(frequencies).sort((a, b) => frequencies[b] - frequencies[a]).Log()
    }
}