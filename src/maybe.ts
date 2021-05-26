import * as Monad from './monad.ts';
import { Bind } from './monad.ts';
import { Unwrap } from './unwrap.ts';

import { Generic1 } from './generic.ts';
declare module './generic.ts' {
    interface Generic1<T> {
        Maybe: Maybe<T>
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
        return this.maybe<Maybe<R>>(none(), x => some(f(x)));
    }

    bind<R>(f: (x: T) => Maybe<R>): Maybe<R> {
        return this.maybe(none(), f);
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

export function isMaybe(x: unknown): x is Maybe<unknown> {
    return x instanceof _None || x instanceof _Some;
}

export function none<T>(): None<T> {
    return new _None();
}

export function some<T>(x: T): Some<T> {
    return new _Some(x);
}

export function fail<T>(): Maybe<T> {
    return none();
}

export function pure<T>(x: T): Maybe<T> {
    return some(x);
}

export function join<T>(x: Maybe<Maybe<T>>): Maybe<T> {
    return Monad.join<'Maybe', T>(x);
}
