export interface Point {
    n: number
    y: number
}

export interface Model {
    name: string,
    fnLog: (n: number) => number
}

export interface EvaluatedModel {
    name: string,
    r2log: number
}

export const models: Model[] = [
    {name: 'O(1)', fnLog: () => 0},
    {name: 'O(log n)', fnLog: (n) => Math.log(Math.log(n))},
    {name: 'O(n)', fnLog: (n) => Math.log(n)},
    {name: 'O(n log n)', fnLog: (n) => Math.log(n) + Math.log(Math.log(n))},
    {name: 'O(n^2)', fnLog: (n) => 2 * Math.log(n)},
    {name: 'O(n^2 log n)', fnLog: (n) => 2 * Math.log(n) + Math.log(Math.log(n))},
    {name: 'O(n^3)', fnLog: (n) => 3 * Math.log(n)},
    {name: 'O(2^n)', fnLog: (n) => n * Math.log(2)}
];

export function getModelByName(name: string): Model {
    const res = models.find((m) => m.name === name);
    if (!res) throw new Error(`No model with name ${name}`);
    return res;
}

export function sum(series: Point[], expression: (p: Point) => number): number {
    let res = 0
    for (let p of series) {
        res += expression(p);
    }
    return res;
}

export function evaluateR2({fnLog, name}: Model, series: Point[]): EvaluatedModel {
    const c = 1 / series.length * sum(series, (p) => Math.log(Number(p.y)) - fnLog(p.n));
    const r2log = sum(series, (p) => Math.pow(Math.log(Number(p.y)) - fnLog(p.n) - c, 2));
    return {name, r2log}
}

// O(1), O(log n), O(n), O(n log n), O(n^2), O(n^2 log n), O(n^3), O(2^n)
export function selectModel(series: Point[]): string {
    return models.map(model => evaluateR2(model, series))
        .reduce((p, n) => p.r2log < n.r2log ? p : n).name;
}

export function readSeries(input: string): Point[] {
    const lines = input.split('\n');
    const series: Point[] = [];
    const N: number = parseInt(lines.shift() ?? '');
    for (let i = 0; i < N; i++) {
        const inputs: string[] = (lines.shift() ?? '').split(' ');
        series.push({n: +inputs[0], y: +inputs[1]})
    }
    return series;
}

export function run(input: string): string {
    return selectModel(readSeries(input));
}
