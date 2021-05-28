import {
    Functor,
    FunctorI,
    IsFunctor,
} from './functor.ts';
import { Gen1T, Generic1Key } from './generic.ts';

export function join<K extends Generic1Key, T>(x: Monad<K, Gen1T<K, T>>): Gen1T<K, T> {
    return x.bind<T>(y => y);
}

export type IsMonad<M extends Generic1Key> = IsFunctor<M> & {
    pure<T>(x: T): Gen1T<M, T>
    bind<T, R>(x: Gen1T<M, T>, f: (x: T) => Gen1T<M, R>): Gen1T<M, R>
}

export interface Monad<M extends Generic1Key, T> extends FunctorI<M, T> {
    isMonad(): IsMonad<M>;
    bind<R>(f: (x: T) => Gen1T<M, R>): Gen1T<M, R>;
}

export abstract class AMonad<M extends Generic1Key, T> extends Functor<M, T> implements Monad<M, T> {
    abstract isMonad(): IsMonad<M>;

    isFunctor() {
        return this.isMonad();
    }

    bind<R>(f: (x: T) => Gen1T<M, R>): Gen1T<M, R> {
        return this.isMonad().bind(this as unknown as Gen1T<M, T>, f);
    }
}
