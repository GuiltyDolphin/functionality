// see https://stackoverflow.com/a/55694876 for more on using
// interfaces as type stores
interface Generic1<T> { }

type Generic1Key = keyof Generic1<any>

type Gen1T<K extends Generic1Key, T> = Generic1<T>[K]

interface Generic1<T> {
    Maybe: Maybe<T>
    Either: Either<unknown, T>
}

interface Functor<K extends Generic1Key, T> {
    map<R>(f: (t: T) => R): Functor<K, R>
}

interface Bind<K extends Generic1Key, T> extends Functor<K, T> {
    bind<T2>(f: (t: T) => Gen1T<K, T2>): Gen1T<K, T2>
}

/** Represents a type that contains a value of type 'T'. */
export interface Unwrap<T> {
    unwrap(): T
}

namespace Monad {
    export function join<K extends Generic1Key, T>(x: Bind<K, Gen1T<K, T>>): Gen1T<K, T> {
        return x.bind<T>(y => y);
    }
}

abstract class MaybeComponent<T> implements Bind<'Maybe', T> {
    isSome<T>(): this is Some<T> {
        return this instanceof _Some;
    }

    isNone(): this is None<T> {
        return this instanceof _None;
    }

    abstract maybef<R>(ifNone: () => R, ifSome: (t1: T) => R): R

    maybe<R>(ifNone: R, ifSome: (t1: T) => R): R {
        return this.maybef(() => ifNone, ifSome);
    }

    map<R>(f: (x: T) => R): Maybe<R> {
        return this.maybe<Maybe<R>>(Maybe.none(), x => Maybe.some(f(x)));
    }

    bind<R>(f: (x: T) => Maybe<R>): Maybe<R> {
        return this.maybe(Maybe.none(), f);
    }
}

class _None<T> extends MaybeComponent<T> {
    maybef<R>(ifNone: () => R, _ifSome: (t1: T) => R): R {
        return ifNone();
    }
}

export type None<T> = _None<T>

class _Some<T> extends MaybeComponent<T> implements Unwrap<T> {
    private readonly value: T;

    constructor(value: T) {
        super();
        this.value = value;
    }

    unwrap(): T {
        return this.value;
    }

    maybef<R>(_ifNone: () => R, ifSome: (t1: T) => R): R {
        return ifSome(this.value);
    }
}

export type Some<T> = _Some<T>

export type Maybe<T> = None<T> | Some<T>

export namespace Maybe {
    export function none<T>(): None<T> {
        return new _None();
    }

    export function some<T>(x: T): Some<T> {
        return new _Some(x);
    }

    export function fail<T>(): Maybe<T> {
        return Maybe.none();
    }

    export function pure<T>(x: T): Maybe<T> {
        return Maybe.some(x);
    }

    export function join<T>(x: Maybe<Maybe<T>>): Maybe<T> {
        return Monad.join<'Maybe', T>(x);
    }
}

abstract class EitherComponent<L, R> implements Bind<'Either', R>, Unwrap<L | R> {
    isLeft(): this is Left<L, R> {
        return this instanceof _Left;
    }

    isRight(): this is Right<L, R> {
        return this instanceof _Right;
    }

    abstract either<T>(onLeft: (l: L) => T, onRight: (r: R) => T): T

    abstract unwrap(): L | R;

    map<R2>(f: (x: R) => R2): Either<L, R2> {
        return this.mapBoth(l => l, r => f(r));
    }

    bind<R2>(f: (r: R) => Either<L, R2>): Either<L, R2> {
        return this.either(l => Either.left(l), r => f(r));
    }

    mapBoth<L2, R2>(onLeft: (l: L) => L2, onRight: (r: R) => R2): Either<L2, R2> {
        return this.either<Either<L2, R2>>(l => Either.left(onLeft(l)), r => Either.right(onRight(r)));
    }

    mapCollecting<L2, R2>(f: (x: R) => Either<L2, R2>): Either<L | L2, R2> {
        return Either.joinLeft(this.map(f));
    }

    /**
     * Throw a left branch, return a right branch.
     */
    orThrow(): R | never {
        return this.either(l => { throw l }, r => r);
    }
}

class _Left<L, R> extends EitherComponent<L, R> implements Unwrap<L> {
    private readonly value: L;

    constructor(value: L) {
        super();
        this.value = value;
    }

    /**
     * Propagate a left value.
     */
    propLeft<R2>(): Left<L, R2> {
        return Either.left(this.value);
    }

    unwrapLeft(): L {
        return this.unwrap();
    }

    unwrap(): L {
        return this.value;
    }

    either<T>(onLeft: (l: L) => T, _onRight: (r: R) => T): T {
        return onLeft(this.value);
    }
}

type Left<L, R> = _Left<L, R>

class _Right<L, R> extends EitherComponent<L, R> implements Unwrap<R> {
    private readonly value: R;

    constructor(value: R) {
        super();
        this.value = value;
    }

    unwrapRight(): R {
        return this.unwrap();
    }

    unwrap(): R {
        return this.value;
    }

    /**
     * Propagate a right value.
     */
    propRight<L2>(): Right<L2, R> {
        return Either.right(this.value);
    }

    either<T>(_onLeft: (l: L) => T, onRight: (r: R) => T): T {
        return onRight(this.value);
    }
}

type Right<L, R> = _Right<L, R>

export type Either<L, R> = Left<L, R> | Right<L, R>

export namespace Either {
    export function left<L, R>(l: L): Left<L, R> {
        return new _Left(l);
    }

    export function right<L, R>(r: R): Right<L, R> {
        return new _Right(r);
    }

    export function fail<L, R>(l: L): Either<L, R> {
        return left(l);
    }

    export function pure<L, R>(r: R): Either<L, R> {
        return right(r);
    }

    export function joinLeft<L1, L2, R>(v: Either<L1, Either<L2, R>>): Either<L1 | L2, R> {
        return v.either(l => Either.left(l), r => r.either<Either<L1 | L2, R>>(l => Either.left(l), r => Either.right(r)));
    }

    export function unEither<L>(v: Either<L, L>): L {
        return v.unwrap();
    }

    export function catEithers<L, R>(es: Either<L, R>[]): Either<L, R[]> {
        const res: R[] = [];
        for (let i = 0; i < es.length; i++) {
            const esi = es[i];
            if (esi.isLeft()) {
                return esi.propLeft();
            } else {
                res[i] = esi.unwrap();
            }
        }
        return Either.right(res);
    }
}
