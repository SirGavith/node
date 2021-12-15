import { Word, Execute } from './Emulator'
const instructions = [
    'LDA',
    'STO',
    'ADD',
    'SUB',
    'JMP',
    'JGE',
    'JNE',
    'STP'
]

class CompilerError extends Error {constructor(message: string) { super(message); this.name = this.constructor.name}}
class AssemblerError extends Error {constructor(message: string) { super(message); this.name = this.constructor.name}}

function Compile(c: string) {
    const code = c.SplitLines().filter(l => l.RegexTest(/\s*/)).map(l => l.trim())

    //generate assembly for assembly lines
    


    const assembly = code.filter(line => line.split(' ').some(s => instructions.includes(s))),
        allocs = code.filter(line => line.startsWith('alloc'))
    //allocate memory words for all allocs
    //set those memory vals to initializer values
    //replace all assembly refrences of alloc with the mem location
    allocs.forEach(a => {
        const [identifier, initializer, initialValue] = a.split(' ').slice(1)
        if (!identifier) throw new CompilerError('An identifier must be present')

        const memAddress = assembly.push(initialValue ?? 0x0000) - 1
        assembly.forEach((line, i) => {
            if (line.includes(identifier)) {
                assembly[i] = line.replaceAll(identifier, memAddress.toString(16))
            }
        })
    })

    //replace all assembly refrences of locations with the mem location
    assembly.forEach((line, memAddress) => {
        if (line.startsWith('@')) {
            const identifier = line.split(' ')[0].substr(1)
            if (!identifier) throw new CompilerError('An identifier must be present')

            assembly.forEach((line, i) => {
                if (i === memAddress) return
                if (line.includes(identifier)) {
                    assembly[i] = line.replaceAll(identifier, memAddress.toString(16))
                }
            })
            assembly[memAddress] = line.replace('@'+identifier, '').trim()
        }
    })

    assembly.Log()
    return assembly
}

function Assemble(assembly: string[]) { 
    //to bytecode
    const bytecode: Word[] = assembly.map(line => {
        const spl = line.split(' ')
        if ((spl.length === 2 || spl.length === 1) && instructions.includes(spl[0])) {
            //instruction statement
            const instr = (instructions.indexOf(spl[0]) << 12) | (spl[1]?.toInt() ?? 0)

            return new Word(16, instr)
        }
        else if (spl.length === 1) {
            //literal
            return new Word(16, spl[0].toInt())
        }
        else throw new AssemblerError(`Could not understand line '${line}'`)
    })
    bytecode.map(w => w.toString()).Log()
    return bytecode
}

const assembly = Compile(`
    alloc var1 := 0x4
    alloc var2 := 0x1
    
    @start LDA var1
    SUB var2
    STO var1
    LDA var1
    JNE start
    STP
`),
    bytecode = Assemble(assembly)

Execute(bytecode);

`
var v1 := 4
var v2 := 1

@start {
    @start var1 = var1 - var2
    

}

`