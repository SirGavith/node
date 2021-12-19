import { ExecOptions } from 'child_process';
import { parse } from 'path/posix';
import { threadId } from 'worker_threads';
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

function PreAssemble(c: string) {
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

// const assembly = PreAssemble(`
//     alloc var1 := 0x4
//     alloc var2 := 0x1
    
//     @start LDA var1
//     SUB var2
//     STO var1
//     LDA var1
//     JNE start
//     STP
// `),
//     bytecode = Assemble(assembly)

// Execute(bytecode);

// var v1 := 4
// var v2 := 1

// @start {
//     @start var1 = var1 - var2
// }


// let a = 4,
//     b = 1
// if (a > b) {
//     a++
// }
// else {
//     a--
// }
// b += a

enum ExpressionTypes {
    Compound,
    Declaration,
    If,
    Literal,
    Operation,
    Unknown,
    While,
}
enum Operators {
    Plus,
    Minus,
    Times,
    Div,
    Mod,
    Increment,
    Decrement,
    IncrementBy,
    DecrementBy,
    SetEquals,
    IsEqual,
    IsNotEqual,
    Not
}

abstract class Expression {
    Type: ExpressionTypes = ExpressionTypes.Unknown
}
class CompoundExpression extends Expression {
    override Type: ExpressionTypes.Compound = ExpressionTypes.Compound
    Expressions: Expression[] = []
}
class DeclarationExpression extends Expression {
    override Type: ExpressionTypes.Declaration = ExpressionTypes.Declaration
    Identifiers: string[] = []
    Initializers: {[key: string]: Expression} = {}
}
class IfExpression extends Expression {
    override Type: ExpressionTypes.If = ExpressionTypes.If
    Condition?: Expression
    Body?: Expression
    ElseExpression?: Expression
}
class LiteralExpression extends Expression {
    override Type: ExpressionTypes.Literal = ExpressionTypes.Literal
    Value?: number
}
class OperationExpression extends Expression {
    override Type: ExpressionTypes.Operation = ExpressionTypes.Operation
    Operand
    Operator
}
class WhileExpression extends Expression {
    override Type: ExpressionTypes.While = ExpressionTypes.While
    Condition?: Expression
    Body?: Expression
}


function Lexer(c: string) {
    const keywords = [
        'let',
        'if',
        'while'
    ]

    const code = c.replaceAll(/\s+/g, '').Log(),
        identifiers: string[] = []

    const parseExpr: ((code: string) => Expression) = (code: string) => {
        const compound = new CompoundExpression
        let lastsemi = 0,
            exprLevel = 0
        code.forEach((char, i) => {
            if (char === '{') exprLevel++
            else if (char === '}') exprLevel--
            else if (char === ';' && exprLevel === 0) {
                const expr = code.substring(lastsemi, i)

                let word,
                    rest
                for (const [char, i] of expr.toArray().map((c, i) => [c, i] as [string, number])) {
                    if (char.RegexTest(/\W/g)) {
                        word = expr.slice(0, i)
                        rest = expr.slice(i)
                        break
                    }
                }
                if (!word || !rest) {
                    word = expr
                    rest = ''
                }

                if (keywords.includes(word)) {
                    if (word === 'let') {
                        console.log('let', word, rest)

                        const exp = new DeclarationExpression
                        expr.slice(4).split(',').map(p => p.split('=')).forEach(decl => {
                            const id = decl[0]
                            if (decl.length === 1) {
                                identifiers.push(id)
                                exp.Identifiers.push(id)
                            }
                            else if (decl.length === 2) {
                                identifiers.push(id)
                                exp.Identifiers.push(id)
                                exp.Initializers[id] = parseExpr(decl[1])
                            }
                        })
                        compound.Expressions.push(exp)
                    }
                    else if (word === 'if') {
                        const exp = new IfExpression
                        //find parens for condition
                        let parenDepth = 0
                        for (const [char, i] of rest.toArray().WithIndices()) {
                            if (char === '(') parenDepth++
                            else if (char === ')' && parenDepth > 0) parenDepth--
                            else if (char !== ')') continue
                            exp.Condition = parseExpr(rest.substring(1, i))
                            const elsePos = rest.indexOf('else', i)
                            if (elsePos !== -1) {
                                exp.Body = parseExpr(rest.substring(i, elsePos))
                                exp.ElseExpression = parseExpr(rest.substring(elsePos + 4))
                            }
                            else {
                                exp.Body = parseExpr(rest.substring(i))
                            }
                            break
                        }
                        if (!exp.Condition) throw new Error('Could not find while condition ' + rest)
                        if (!exp.Body) throw new Error('Could not find while body ' + rest)
                        return exp
                    }
                    else if (word === 'while') {
                        const exp = new WhileExpression
                        //find parens for condition
                        //find expression
                        let parenDepth = 0
                        for (const [char, i] of rest.toArray().WithIndices()) {
                            if (char === '(') parenDepth++
                            else if (char === ')' && parenDepth > 0) parenDepth--
                            else if (char !== ')') continue
                            exp.Condition = parseExpr(rest.substring(1, i))
                            exp.Body = parseExpr(rest.substring(i))
                            break
                        }
                        if (!exp.Condition) throw new Error('Could not find while condition ' + rest)
                        if (!exp.Body) throw new Error('Could not find while body ' + rest)
                        return exp
                    }
                }
                else if (identifiers.includes(word)) {

                }
                else if (word.RegexTest(/\d+/g)) {
                    const exp = new LiteralExpression
                    exp.Value = word.toInt()
                    return exp
                }
                else throw new Error(`Unknown identifier ${word}`)


                lastsemi = i + 1
            }
        })
        return compound
    }

    return parseExpr(code).Log()
}

Lexer(`
let: a = 4,
    b = 1;
if(a > b){
    a++;
} else{
    a--;
};
b += a;

while (b > 0) {
    b--;
};
`)