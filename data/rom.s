alloc a

LDA #1
STA a
LDA #0

@fib

ADC a
TAX
ADC a
STA a

CMP #$FF
BMI end

TXA
JMP fib

@end BRK