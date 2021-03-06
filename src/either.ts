import { IsFunctor } from './functor.ts';
import { AMonad, IsMonad } from './monad.ts';
import { Unwrap } from './unwrap.ts';

import { Generic1 } from './generic.ts';
declare module './generic.ts' {
    interface Generic1<T> {
        Either: Either<any, T>
    }
}

abstract class EitherComponent<L, R> extends AMonad<'Either', R> implements Unwrap<L | R> {
    isMonad() {
        return isMonad;
    }

    isLeft(): this is Left<L, R> {
        return this instanceof _Left;
    }

    isRight(): this is Right<L, R> {
        return this instanceof _Right;
    }

    abstract either<T>(onLeft: (l: L) => T, onRight: (r: R) => T): T

    abstract unwrap(): L | R;

    mapBoth<L2, R2>(onLeft: (l: L) => L2, onRight: (r: R) => R2): Either<L2, R2> {
        return this.either<Either<L2, R2>>(l => left(onLeft(l)), r => right(onRight(r)));
    }

    mapCollecting<L2, R2>(f: (x: R) => Either<L2, R2>): Either<L | L2, R2> {
        return this.map(f).joinLeft();
    }

    /** Like {@link join}, but allows the left types to differ. */
    joinLeft<L1, L2, R>(this: Either<L1, Either<L2, R>>): Either<L1 | L2, R> {
        return this.either(l => left(l), r => r.either<Either<L1 | L2, R>>(l => left(l), r => right(r)));
    }

    // defined here for extra type safety, as `Gen1T` does not capture the `L` type parameter
    join<L, R>(this: Either<L, Either<L, R>>): Either<L, R> {
        return AMonad.prototype.join.apply(this);
    }

    /**
     * Throw a left branch, return a right branch.
     */
    orThrow(): R | never {
        return this.either(l => { throw l }, r => r);
    }

    unEither<L>(this: Either<L, L>): L {
        return this.unwrap();
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
        return left(this.value);
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
        return right(this.value);
    }

    either<T>(_onLeft: (l: L) => T, onRight: (r: R) => T): T {
        return onRight(this.value);
    }
}

type Right<L, R> = _Right<L, R>

export type Either<L, R> = Left<L, R> | Right<L, R>

export const isFunctor: IsFunctor<'Either'> = {
    map: (f, x) => x.mapBoth(l => l, r => f(r)),
};

export const isMonad: IsMonad<'Either'> = {
    ...isFunctor,
    pure: (x) => right(x),
    bind: (x, f) => x.either(l => left(l), r => f(r))
};

export function isEither(x: any): x is Either<unknown, unknown> {
    return x instanceof _Left || x instanceof _Right;
}

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
    return isMonad.pure(r);
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
    return right(res);
}
