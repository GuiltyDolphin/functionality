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
 * Return a new array with the element at the given index replaced
 * with the given element.
 *
 * If the index is a range `[start, stop]`, the elements from index
 * `start` to index `stop` are replaced in their entirety by the
 * element provided.
 *
 * This does not modify the original array.
 */
export function replace<T>(xs: T[], i: IndexRange, elt: T): T[] {
    const start = startOfRange(i);
    const end = endOfRange(i);
    if (end < start || end < 0 || start >= xs.length) {
        return [...xs];
    }
    return xs.slice(0, Math.max(start, 0)).concat(elt, xs.slice(end + 1));
}


///////////////////////////
///// Non-Empty Arrays /////
///////////////////////////


/** A non-empty array. */
export type NonEmpty<T> = [T, ...T[]]

/** Determine whether an array is non-empty. Can be used as a type predicate. */
export function isNonEmpty<T>(xs: T[]): xs is NonEmpty<T> {
    return xs.length > 0;
}

/** Return the first element of an array. */
export function head<T>(xs: NonEmpty<T>): T {
    return xs[0];
}

/** Return all but the first element of a non-empty array. */
export function tail<T>(xs: NonEmpty<T>): T[] {
    return splitAt(1, xs)[1];
}


////////////////////////
///// Nested Arrays /////
////////////////////////


/** An array which may have arbitrary depth. */
export type Nested<T> = (T | Nested<T>)[];

/** Anything other than an array. */
type NotArray<T> = Exclude<T, Array<any>>

/**
 * An array whose elements may be arbitrarily nested.
 *
 * The type of elements cannot itself be an array.
 */
export type SafeNested<T> = Nested<NotArray<T>>

/**
 * A non-empty array whose elements may themselves be nested, non-empty arrays.
 *
 * The first element of each nested array must either itself be a nested array, or an element matching `F`.
 */
export type NonEmptyNestedFirstCanDiffer<F, T> = [F | NonEmptyNestedFirstCanDiffer<F, T>, ...(T | NonEmptyNestedFirstCanDiffer<F, T>)[]]

/** A non-empty array whose elements may themselves be nested, non-empty arrays. */
export type NonEmptyNested<T> = NonEmptyNestedFirstCanDiffer<T, T>

/** Like {@link NonEmptyNestedFirstCanDiffer}, but where elements may not be arrays. */
export type SafeNonEmptyNestedFirstCanDiffer<F extends NotArray<any>, T extends NotArray<any>> = NonEmptyNestedFirstCanDiffer<F, T>

/** Like {@link NonEmptyNested}, but where elements may not be arrays. */
export type SafeNonEmptyNested<T> = SafeNonEmptyNestedFirstCanDiffer<T, T>

function _flatten<T>(arr: SafeNested<T>, result: T[]): void {
    for (let i = 0; i < arr.length; i++) {
        const value = arr[i];
        Array.isArray(value) ? _flatten(value, result) : result.push(value);
    }
};

/** Flatten an array of nested arrays into a single flat array. */
export function flatten<T>(arr: SafeNonEmptyNested<T>): NonEmpty<T>
export function flatten<T>(arr: SafeNested<T>): T[]
export function flatten<T>(arr: SafeNested<T>) {
    const res: T[] = [];
    _flatten(arr, res);
    return res as unknown;
};

/** Return the first non-array element of a nested array. */
export function headDeep<T>(xs: SafeNonEmptyNested<T>): T {
    let h = head(xs);
    while (h instanceof Array) {
        h = head(h);
    }
    return h;
}
