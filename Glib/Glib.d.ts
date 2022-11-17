interface BigInt {
    /** @returns The number of digits of a bigint */
    DigitCount(): number;
    /** @returns An array of the digits of the bigint */
    IntDigits(): number[];
    SumDigits(): number;
    /** Takes the square root of a bigint to a certain presicion
     * @param precision The number of digits of precision
     * @returns The square root digits as a bigint -- no decimal
     */
    SqrtDigits(precision: number): bigint;
    Sq(): bigint;
    Exp(pow: bigint): bigint;
    Factorial(): bigint;
    RotateDigits(): bigint;
    IsPrime(): boolean;
}
interface Boolean {
    IsTrue(action: () => void): void;
    IsFalse(action: () => void): void;
    Log(): boolean;
}
interface Generator<T, TReturn, TNext> {
    Map<U>(mapper: (value: T) => U): Generator<U>;
    Reduce(callbackfn: (prevValue: T, value: T, index: number) => T): T;
    Reduce(callbackfn: (prevValue: T, value: T, index: number) => T, initialValue: T): T;
    Reduce<U>(callbackfn: (prevValue: U, value: T, index: number) => U, initialValue: U): U;
}
declare const GeneratorPrototype: any;
interface Number {
    IsInteger(): boolean;
    /** @returns An array of the digits of the number */
    IntDigits(): number[];
    InRangeEq(v1: number, v2: number): boolean;
    IsEven(): boolean;
    IsOdd(): boolean;
    SumOfLess(): number;
    Floor(): number;
    Ceil(): number;
    Log(): number;
}
interface Object {
    RemoveUndefinedVals(): {};
    Values(): any[];
    Keys(): string[];
    Entries(): [string, any][];
    filter(filter: (key: string, val: any) => boolean): {};
    forEach(lambda: (key: string, val: any) => void): void;
    Copy(): {};
    IncrementOrCreate(key: string, value?: number | bigint): void;
    Log(): {};
}
declare type FreqDict = {
    [key: string]: number;
};
declare type BigFreqDict = {
    [key: string]: bigint;
};
interface String {
    toIntList(radix?: number, delim?: string): number[];
    toFloatList(delim?: string): number[];
    toInt(radix?: number): number;
    toFloat(radix?: number): number;
    toArray(includeNewlines?: boolean): string[];
    in(str: string): boolean;
    SplitLines(): string[];
    RegexTest(regex: RegExp): boolean;
    ReplaceMap(map: {
        [key: string]: string;
    }): string;
    RemoveChars(chars: string[]): string;
    IsAllCapital(): boolean;
    forEach(lambda: (val: string, index: number) => void): void;
    Log(): string;
}
