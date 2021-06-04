type LastIsRest<Xs extends any[]>
    = [...any[]] extends Xs
    ? true
    : Xs extends [any, ...infer Tl]
    ? LastIsRest<Tl>
    : false

/** Predicate type: `true` if the function has a rest parameter, `false` otherwise. */
export type HasRestParam<F extends (...args: any[]) => any> = LastIsRest<Parameters<F>>
