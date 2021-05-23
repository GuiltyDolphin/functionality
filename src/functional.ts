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

namespace Monad {
    export function join<K extends Generic1Key, T>(x: Bind<K, Gen1T<K, T>>): Gen1T<K, T> {
        return x.bind<T>(y => y);
    }
}

export class Maybe<T> implements Bind<'Maybe', T> {
    private readonly value: [] | [T];

    private constructor(...args: T[]) {
        this.value = args.length == 1 ? [args[0]] : [];
        if (args.length > 1) {
            throw new TypeError('too many arguments to Maybe constructor');
        }
    }

    isSome(): boolean {
        return this.value.length == 1;
    }

    isNone(): boolean {
        return this.value.length == 0;
    }

    /**
     * Only use this if you know you have some.
     */
    unwrap(): T | never {
        if (this.value.length == 1) {
            return this.value[0];
        } else {
            throw new TypeError('tried to unwrap a nothing value');
        }
    }

    maybef<R>(ifNone: () => R, ifSome: (t1: T) => R): R {
        if (this.isSome()) {
            return ifSome(this.unwrap());
        }
        return ifNone();
    }

    maybe<R>(ifNone: R, ifSome: (t1: T) => R): R {
        return this.maybef(() => ifNone, ifSome);
    }

    map<R>(f: (x: T) => R): Maybe<R> {
        return this.maybe(Maybe.none(), x => Maybe.some(f(x)));
    }

    bind<R>(f: (x: T) => Maybe<R>): Maybe<R> {
        return this.maybe(Maybe.none(), f);
    }

    static none<T>(): Maybe<T> {
        return new Maybe();
    }

    static some<T>(x: T): Maybe<T> {
        return new Maybe(x);
    }

    static pure<T>(x: T): Maybe<T> {
        return Maybe.some(x);
    }

    static fail<T>(): Maybe<T> {
        return Maybe.none();
    }

    static join<T>(x: Maybe<Maybe<T>>): Maybe<T> {
        return Monad.join<'Maybe', T>(x);
    }
}

export class Either<L, R> implements Bind<'Either', R> {
    private readonly leftValue: Maybe<L>;
    private readonly rightValue: Maybe<R>;

    private constructor(left: Maybe<L>, right: Maybe<R>) {
        if (left.isSome() && right.isNone() || left.isNone() && right.isSome()) {
            this.leftValue = left;
            this.rightValue = right;
        } else {
            throw new TypeError('exactly one of left and right must be some');
        }
    }

    isLeft(): boolean {
        return this.leftValue.isSome();
    }

    isRight(): boolean {
        return this.rightValue.isSome();
    }

    mapBoth<L2, R2>(onLeft: (l: L) => L2, onRight: (r: R) => R2): Either<L2, R2> {
        return this.either(l => Either.left(onLeft(l)), r => Either.right(onRight(r)));
    }

    map<R2>(f: (x: R) => R2): Either<L, R2> {
        return this.mapBoth(x => x, r => f(r));
    }

    static joinLeft<L1, L2, R>(v: Either<L1, Either<L2, R>>): Either<L1 | L2, R> {
        return v.either(l => Either.left<L1 | L2, R>(l), r => r.either(l => Either.left(l), r => Either.right(r)));
    }

    mapCollecting<L2, R2>(f: (x: R) => Either<L2, R2>): Either<L | L2, R2> {
        return Either.joinLeft(this.map(f));
    }

    either<T>(onLeft: (l: L) => T, onRight: (r: R) => T): T {
        if (this.isLeft()) {
            return onLeft(this.unwrapLeft());
        } else {
            return onRight(this.unwrapRight());
        }
    }

    bind<R2>(f: (r: R) => Either<L, R2>): Either<L, R2> {
        return this.either(l => Either.left(l), r => f(r));
    }

    /**
     * Only use if you know you have a left value.
     */
    unwrapLeft(): L | never {
        return this.leftValue.unwrap();
    }

    /**
     * Only use if you know you have a right value.
     */
    unwrapRight(): R | never {
        return this.rightValue.unwrap();
    }

    /**
     * Propagate a left value. Only use this if you know the value is a left.
     */
    propLeft<R2>(): Either<L, R2> | never {
        return Either.left(this.unwrapLeft());
    }

    /**
     * Propagate a right value. Only use this if you know the value is a right.
     */
    propRight<L2>(): Either<L2, R> | never {
        return Either.right(this.unwrapRight());
    }

    /**
     * Throw a left branch, return a right branch.
     */
    orThrow(): R | never {
        return this.either(l => { throw l }, r => r);
    }

    static pure<L, R>(x: R): Either<L, R> {
        return Either.right(x);
    }

    static fail<L, R>(e: L): Either<L, R> {
        return Either.left(e);
    }

    static left<L, R>(value: L): Either<L, R> {
        return new Either(Maybe.some(value), Maybe.none());
    }

    static right<L, R>(value: R): Either<L, R> {
        return new Either(Maybe.none(), Maybe.some(value));
    }

    static unEither<L>(v: Either<L, L>): L {
        return v.either(x => x, x => x);
    }

    static catEithers<L, R>(es: Either<L, R>[]): Either<L, R[]> {
        const res: R[] = [];
        for (let i = 0; i < es.length; i++) {
            if (es[i].isLeft()) {
                return es[i].propLeft();
            } else {
                res[i] = es[i].unwrapRight();
            }
        }
        return Either.right(res);
    }
}
