export interface Point {
    n: bigint
    y: bigint
}

export interface Model {
    name: string,
    fn: (n: bigint) => bigint
}

export interface EvaluatedModel {
    name: string,
    r2: bigint
}

// https://stackoverflow.com/a/72404120/6398044
export function log(n: bigint): bigint {
    return BigInt(
        Math.round(
            n.toString().length / Math.log10(Math.E)
            + Math.log(Number.parseFloat("0." + n.toString()))
        )
    );
}

export function pow(base: bigint, exponent: bigint): bigint {
    return base ** exponent
}

export const models: Model[] = [{
    name: 'O(1)', fn: () => 1n
}, {
    name: 'O(log n)',
    fn: (n) => log(n),
}, {
    name: 'O(n)',
    fn: (n) => n
}, {
    name: 'O(n log n)',
    fn: (n) => log(n) * n
}, {
    name: 'O(n^2)',
    fn: (n) => pow(n, 2n)
}, {
    name: 'O(n^2 log n)',
    fn: (n) => pow(n, 2n) * log(n)
}, {
    name: 'O(n^3)',
    fn: (n) => pow(n, 3n)
}, {
    name: 'O(2^n)',
    fn: (n) => pow(2n, n)
}];

export function getModelByName(name: string): Model {
    const res = models.find((m) => m.name === name);
    if (!res) throw new Error(`No model with name ${name}`);
    return res;
}

export function sum(series: Point[], expression: (p: Point) => bigint): bigint {
    let res = 0n;
    for (let p of series) {
        res += expression(p)
    }
    return res;
}

// sum ( f(n)^2)
export function evaluateFn2({fn}: { fn: (n: bigint) => bigint }, series: Point[]): bigint {
    return sum(series, (p) => pow(fn(p.n), 2n));
}

// sum (y f(n) )
export function evaluateYfn({fn}: { fn: (n: bigint) => bigint }, series: Point[]): bigint {
    return sum(series, (p) => p.y * fn(p.n));
}

export function abs(n: bigint): bigint {
    return n >= 0 ? n : -n;
}

export function div(a: bigint, b: bigint): number {
    const as = a.toString();
    const bs = b.toString();
    const minLen = Math.min(as.length, bs.length);
    const asd = (as.substring(0, as.length - minLen) + '.' + as.substring(as.length - minLen, as.length));
    const bsd = (bs.substring(0, bs.length - minLen) + '.' + bs.substring(bs.length - minLen, bs.length));
    return Number(asd) / Number(bsd);
}

export function multiply(a: number, b: bigint): bigint {
    if (a === 0 || b === 0n) return 0n;
    return BigInt(Math.round(a * Number(b)));
}

export function evaluateR2({fn, name}: Model, series: Point[]): EvaluatedModel {
    const fn2 = evaluateFn2({fn}, series);
    const yfn = evaluateYfn({fn}, series);
    // sum ( [ y - [ sum (y f(n) ) / sum ( f(n)^2) ] f(n) ] ^2 )
    const a: number = div(yfn, fn2);

    const r2 = sum(series, (p) => abs(p.y - multiply(a, fn(p.n))));

    return {name, r2}
}

// O(1), O(log n), O(n), O(n log n), O(n^2), O(n^2 log n), O(n^3), O(2^n)
export function selectModel(series: Point[]): string {
    return models.map(model => evaluateR2(model, series))
        .reduce((p, n) => p.r2 < n.r2 ? p : n).name;
}

export function readSeries(input: string): Point[] {
    const lines = input.split('\n');
    const series: Point[] = [];
    const N: number = parseInt(lines.shift() ?? '');
    for (let i = 0; i < N; i++) {
        const inputs: string[] = (lines.shift() ?? '').split(' ');
        series.push({
            n: BigInt(inputs[0]),
            y: BigInt(inputs[1])
        })
    }
    return series;
}

export function run(input: string): string {
    return selectModel(readSeries(input));
}
