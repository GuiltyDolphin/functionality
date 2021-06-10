/** A type proposition, takes the values `false` or `true`. */
export type TyProp = false | true;

/** Negation of a type proposition. */
export type Not<P extends TyProp> = P extends true ? false : true;

/** Conjunction of two type propositions. */
export type And<P1 extends TyProp, P2 extends TyProp> = P1 extends true ? P2 : false;

/** Disjunction of two type propositions. */
export type Or<P1 extends TyProp, P2 extends TyProp> = P1 extends false ? P2 : true;

/** If the proposition is `true` then this is the first branch, otherwise the second. */
export type ITE<I extends TyProp, T, E> = I extends true ? T : E;

/** If the proposition is `true` then this is the type, otherwise `Empty`. */
export type When<P extends TyProp, R> = ITE<P, R, never>;

/** If the proposition is `false` then this is the type, otherwise `Empty`. */
export type Unless<P extends TyProp, R> = ITE<P, never, R>;

/** Type predicate: `true` if the first type extends the second. */
export type Extends<T1, T2> = [T1] extends [T2] ? true : false;

/** Type predicate: `true` if the two types extend each other. */
export type Is<T1, T2> = And<Extends<[T1], [T2]>, Extends<[T2], [T1]>>;

/** From `Type` extract all keys whose corresponding values are assignable to `Union`. */
export type KeysOfType<Type, Union> = {
    [k in keyof Type]: Type[k] extends Union ? k : never
}[keyof Type];

/** From `Type` extract all keys whose corresponding values are not assignable to `ExcludedUnion`. */
export type ExceptKeysOfType<Type, ExcludedUnion> = keyof OmitWithType<Type, ExcludedUnion>;

/** Construct a type by picking the set of properties from `Type` whose values are assignable to `Union`. */
export type PickWithType<Type, Union> = Pick<Type, KeysOfType<Type, Union>>;

/** Construct a type by omitting the set of properties from `Type` whose values are assignable to `ExcludedUnion`. */
export type OmitWithType<Type, ExcludedUnion> = Omit<Type, KeysOfType<Type, ExcludedUnion>>;
