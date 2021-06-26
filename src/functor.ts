import { Generic1Key, Gen1T } from './generic.ts';

export interface Functor<K extends Generic1Key, T> {
    isFunctor(): IsFunctor<K>;
    map<R>(f: (t: T) => R): Gen1T<K, R>
}

export type IsFunctor<F extends Generic1Key> = {
    map<T, R>(f: (x: T) => R, x: Gen1T<F, T>): Gen1T<F, R>
}

export abstract class AFunctor<K extends Generic1Key, T> implements Functor<K, T> {
    abstract isFunctor(): IsFunctor<K>;

    map<R>(f: (x: T) => R): Gen1T<K, R> {
        return this.isFunctor().map(f, this as unknown as Gen1T<K, T>);
    }
}
