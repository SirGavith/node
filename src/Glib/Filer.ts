import fs from 'fs'
import path from 'path'

export class Filer {
    static ReadFile(localpath: string): string {
        return Filer.ReadAllLines(localpath).join('\n')
    }
    static ReadAllLines(localpath: string): string[] {
        return (fs.readFileSync(path.join(__dirname, localpath), 'utf8') as string)
            .replaceAll('\r', '')
            .SplitLines()
            .filter(l => !l.startsWith('//'))
            .map(l => l.trim())
    }
    static WriteFile(localpath: string, data: string) {
        fs.writeFile(localpath, data, err => { if (err) console.log(err) })
    }
}