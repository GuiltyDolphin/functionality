import {
    Functor,
    FunctorI,
    IsFunctor,
} from './functor.ts';
import { Gen1T, Generic1Key } from './generic.ts';

export type IsMonad<M extends Generic1Key> = IsFunctor<M> & {
    pure<T>(x: T): Gen1T<M, T>
} & ({
    bind<T, R>(x: Gen1T<M, T>, f: (x: T) => Gen1T<M, R>): Gen1T<M, R>
} | {
    join<T>(x: Gen1T<M, Gen1T<M, T>>): Gen1T<M, T>
});

export interface Monad<M extends Generic1Key, T> extends FunctorI<M, T> {
    isMonad(): IsMonad<M>;
    bind<R>(f: (x: T) => Gen1T<M, R>): Gen1T<M, R>;
    join<T>(this: Monad<M, Gen1T<M, T>>): Gen1T<M, T>;
}

export abstract class AMonad<M extends Generic1Key, T> extends Functor<M, T> implements Monad<M, T> {
    abstract isMonad(): IsMonad<M>;

    isFunctor() {
        return this.isMonad();
    }

    bind<R>(f: (x: T) => Gen1T<M, R>): Gen1T<M, R> {
        const isMonad = this.isMonad();
        if ('bind' in isMonad) {
            return isMonad.bind(this as unknown as Gen1T<M, T>, f);
        } else {
            return (this.map(f) as unknown as AMonad<M, Gen1T<M, R>>).join();
        }
    }

    join<T>(this: AMonad<M, Gen1T<M, T>>): Gen1T<M, T> {
        const isMonad = this.isMonad();
        if ('join' in isMonad) {
            return isMonad.join(this as unknown as Gen1T<M, Gen1T<M, T>>);
        } else {
            return this.bind(x => x);
        }
    }
}
