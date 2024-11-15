import { Cx } from "./Glib/Complex"
import { XY } from "./Glib/XY"

// Euler's method
export function Euler() {
    for (let j = 0; j < 100; j++) {
        const dydx = (xy: XY) => xy.X + xy.Y
        const xy = new XY(1, 2)
        const dx = 1 / j

        for (let i = 0; i < j; i++) {
            xy.plusEQ(dx, dydx(xy) * dx)
        }
        xy.Y.Log()
    }
}

const unity: {[unity: number]: Cx[]} = {}

// P has a length of a power of 2
export function FFT(P: Cx[]): Cx[] {
    if (P.length === 1) return P

    const n = P.length
    // Calculate nth roots of unity
    // only even need n/2 roots

    if (!unity[n]) {
        unity[n] = []
        for (let i = 0; i < n / 2; i++) {
            const a = 2 * Math.PI * i / n
            unity[n][i] = Cx.fromAngle(a)
        }
    }
    
    // Seperate odd and even terms
    const Pe: Cx[] = [],
        Po: Cx[] = []

    for (let i = 0; i < n; i++) {
        if ((i & 1) === 0) 
            Pe.push(P[i])
        else 
            Po.push(P[i])
    }

    // Recurse on each
    const y: Cx[] = [], 
        ye = FFT(Pe),
        yo = FFT(Po)
    // Interpolate
    for (let j = 0; j < n / 2; j++) {
        y[j] = unity[n][j].times(yo[j]).plus(ye[j])
        y[j + n/2] = ye[j].minus(unity[n][j].times(yo[j]))
    }
    return y
}






/* 
 * Free FFT and convolution (TypeScript)
 * 
 * Copyright (c) 2022 Project Nayuki. (MIT License)
 * https://www.nayuki.io/page/free-small-fft-in-multiple-languages
 */



/* 
 * Computes the inverse discrete Fourier transform (IDFT) of the given complex vector, storing the result back into the vector.
 * The vector can have any length. This is a wrapper function. This transform does not perform scaling, so the inverse is not a true inverse.
 */
function inverseTransformRadix2(real: Array<number> | Float64Array, imag: Array<number> | Float64Array): void {
    transformRadix2(imag, real);
}


/* 
 * Computes the discrete Fourier transform (DFT) of the given complex vector, storing the result back into the vector.
 * The vector's length must be a power of 2. Uses the Cooley-Tukey decimation-in-time radix-2 algorithm.
 */
export function transformRadix2(real: Array<number> | Float64Array, imag: Array<number> | Float64Array) {
    // Length variables
    const n: number = real.length;
    if (n != imag.length)
        throw new RangeError("Mismatched lengths");
    if (n == 1)  // Trivial transform
        return;
    let levels: number = -1;
    for (let i = 0; i < 32; i++) {
        if (1 << i == n)
            levels = i;  // Equal to log2(n)
    }
    if (levels == -1)
        throw new RangeError("Length is not a power of 2");

    // Trigonometric tables
    let cosTable = new Array<number>(n / 2);
    let sinTable = new Array<number>(n / 2);
    for (let i = 0; i < n / 2; i++) {
        cosTable[i] = Math.cos(2 * Math.PI * i / n);
        sinTable[i] = Math.sin(2 * Math.PI * i / n);
    }

    // Bit-reversed addressing permutation
    for (let i = 0; i < n; i++) {
        const j: number = reverseBits(i, levels);
        if (j > i) {
            let temp: number = real[i];
            real[i] = real[j];
            real[j] = temp;
            temp = imag[i];
            imag[i] = imag[j];
            imag[j] = temp;
        }
    }

    // Cooley-Tukey decimation-in-time radix-2 FFT
    for (let size = 2; size <= n; size *= 2) {
        const halfsize: number = size / 2;
        const tablestep: number = n / size;
        for (let i = 0; i < n; i += size) {
            for (let j = i, k = 0; j < i + halfsize; j++, k += tablestep) {
                const l: number = j + halfsize;
                const tpre: number = real[l] * cosTable[k] + imag[l] * sinTable[k];
                const tpim: number = -real[l] * sinTable[k] + imag[l] * cosTable[k];
                real[l] = real[j] - tpre;
                imag[l] = imag[j] - tpim;
                real[j] += tpre;
                imag[j] += tpim;
            }
        }
    }

    // Returns the integer whose value is the reverse of the lowest 'width' bits of the integer 'val'.
    function reverseBits(val: number, width: number): number {
        let result: number = 0;
        for (let i = 0; i < width; i++) {
            result = (result << 1) | (val & 1);
            val >>>= 1;
        }
        return result;
    }

}

export  function isSquare(n: bigint): boolean {
    if (n < 0n) return false;
    if (n < 2n) return true;

    let x = n / 2n;
    let y = (x + n / x) / 2n;

    while (y < x) {
        x = y;
        y = (x + n / x) / 2n;
    }

    return x * x === n;
}