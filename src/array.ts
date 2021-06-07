import {
    And,
    Extends,
    Not,
    When,
} from './types.ts';


///////////////////////////////////
///// General Array Operations /////
///////////////////////////////////


export type IndexRange = number | [number, number]

function startOfRange(x: IndexRange): number {
    return x instanceof Array ? x[0] : x;
}

function endOfRange(x: IndexRange): number {
    return x instanceof Array ? x[1] : x;
}

/** Split an array into the elements before and after the given index. */
export function splitAt<T>(n: number, xs: T[]) {
    return [xs.slice(0, n), xs.slice(n)];
}

/**
 * Return a new array with the specified segment of the array replaced
 * with the result of applying the function to that part of the array.
 *
 * By default, the original array is left unmodified. If the fourth
 * (optional) argument is `true` (default is `false`), then the array
 * will be modified in-place, and the segment that has been replaced
 * is returned instead.
 */
export function replacing<T>(f: (xs: T[]) => T[], xs: T[], range: IndexRange, inplace = false): T[] {
    const start = Math.max(startOfRange(range), 0);
    const end = endOfRange(range);
    if (end < start || end < 0 || start >= xs.length) {
        return inplace ? [] : xs.slice();
    }
    if (inplace) {
        return xs.splice(start, end - start + 1, ...f(xs.slice(start, end)));
    } else {
        return xs.slice(0, start).concat(f(xs.slice(start, end))).concat(xs.slice(end + 1));
    }
}

/**
 * Return a new array with the element at the given index replaced
 * with the given element.
 *
 * If the index is a range `[start, stop]`, the elements from index
 * `start` to index `stop` are replaced in their entirety by the
 * element provided.
 *
 * By default, the original array is left unmodified. If the fourth
 * (optional) argument is `true` (default is `false`), then the array
 * will be modified in-place, and the segment that has been replaced
 * is returned instead.
 */
export function replace<T>(xs: T[], i: IndexRange, elt: T, inplace = false): T[] {
    return replacing(_ => [elt], xs, i, inplace);
}


///////////////////////////
///// Non-Empty Arrays /////
///////////////////////////


/**
 * A non-empty array.
 *
 * The first type parameter is the type of elements of the array.
 *
 * The second (optional) parameter is the type of the first element of
 * the array, which defaults to the same as the first parameter.
 */
export type NonEmpty<T, T0 = T> = [T0, ...T[]]

/** Determine whether an array is non-empty. Can be used as a type predicate. */
export function isNonEmpty<T, T0>(xs: [T0, ...T[]]): xs is NonEmpty<T, T0>
export function isNonEmpty<T>(xs: T[]): xs is NonEmpty<T>
export function isNonEmpty<T, T0 = T>(xs: [T0, ...T[]] | T[]) {
    return xs.length > 0;
}

/** Return the first element of an array. */
export function head<T0>(xs: NonEmpty<any, T0>): T0 {
    return xs[0];
}

/** Return all but the first element of a non-empty array. */
export function tail<T>(xs: NonEmpty<T, any>): T[] {
    return splitAt(1, xs)[1];
}


////////////////////////
///// Nested Arrays /////
////////////////////////


/** An array which may have arbitrary depth. */
export type Nested<T> = (T | Nested<T>)[];

/** Anything other than an array. */
export type NotArray<T> = Not<Extends<T, Array<any>>>;

/** Stands as the second type if the first is not array-like. */
export type WhenNotArray<T, L> = When<NotArray<T>, L>;

type WhenBothNotArray<T, T0, L> = When<And<NotArray<T>, NotArray<T0>>, L>;

/**
 * An array whose elements may be arbitrarily nested.
 *
 * The type of elements cannot itself be an array.
 */
export type SafeNested<T> = WhenNotArray<T, Nested<T>>;

/** A non-empty array whose elements may themselves be nested, non-empty arrays.
 *
 * The first type parameter is the type of elements of the array.
 *
 * The second (optional) parameter is the type of the first element of
 * the array, which defaults to the same as the first parameter.
 */
export type NonEmptyNested<T, T0 = T> = [T0 | NonEmptyNested<T, T0>, ...(T | NonEmptyNested<T, T0>)[]]

/** Like {@link NonEmptyNested}, but where elements may not be arrays. */
export type SafeNonEmptyNested<T, T0 = T> = WhenBothNotArray<T, T0, NonEmptyNested<T, T0>>;

/**
 * Flatten an array of nested arrays into a single flat array.
 *
 * This does not modify the original array.
 *
 * Algorithm inspired by this Stack Overflow answer: https://stackoverflow.com/a/27282907
 */
export function flatten<T, T0>(arr: SafeNonEmptyNested<T, T0>): NonEmpty<T0 | T, T0>
export function flatten<T>(arr: SafeNested<T>): T[]
export function flatten<T>(arr: SafeNested<T>) {
    const result: T[] = [];
    arr = arr.slice() as SafeNested<T>;
    let elt: T | Nested<T> | undefined;

    while (arr.length) {
        elt = arr.pop();
        if (Array.isArray(elt)) {
            arr.push.apply(arr, elt);
        } else {
            // array was non-empty, so we know we have a T (avoiding
            // the use of isNonEmpty for the sake of speed)
            result.push(elt as T);
        }
    }
    return result.reverse();
}

/** Return the first non-array element of a nested array. */
export function headDeep<T>(xs: SafeNonEmptyNested<T>): T
export function headDeep<T, T0>(xs: SafeNonEmptyNested<T, T0>): T0
export function headDeep<T, T0 = T>(xs: SafeNonEmptyNested<T, T0>) {
    let h = head(xs);
    while (h instanceof Array) {
        h = head(h);
    }
    return h;
}
