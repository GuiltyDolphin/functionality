type LastIsRest<Xs extends any[]>
    = [...any[]] extends Xs
    ? true
    : Xs extends [any, ...infer Tl]
    ? LastIsRest<Tl>
    : false

/** Predicate type: `true` if the function has a rest parameter, `false` otherwise. */
export type HasRestParam<F extends (...args: any[]) => any> = LastIsRest<Parameters<F>>

/** Remove the last type from the list if it is a rest type. */
type RemoveLastIfRest<Xs extends any[]>
    = [...any[]] extends Xs
    ? []
    : Xs extends [infer H, ...infer Tl]
    ? [H, ...RemoveLastIfRest<Tl>]
    : Xs

/** The function type without its rest parameter, if any. */
export type WithoutRestParam<F extends (...args: any[]) => any> = (...args: RemoveLastIfRest<Parameters<F>>) => ReturnType<F>;

/**
 * Given a function that accepts a rest parameter, return a new
 * function that does not accept a rest parameter.
 */
export function withoutRestParam<F extends (...args: any[]) => any>(f: HasRestParam<F> extends true ? F : never): WithoutRestParam<F> {
    return f;
}

/**
 * Perform `f` for `n` counts.
 *
 * `f` must be able to accept either no arguments, or a single
 * argument that is the current count (starting from 1).
 */
export function ntimes(f: (count: number) => void, n: number): void {
    for (let i = 1; i <= n; i++) {
        f(i);
    }
}
