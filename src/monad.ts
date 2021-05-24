import * as Functor from './functor.ts';
import { Gen1T, Generic1Key } from './generic.ts';

export interface Bind<K extends Generic1Key, T> extends Functor<K, T> {
    bind<T2>(f: (t: T) => Gen1T<K, T2>): Gen1T<K, T2>
}

export function join<K extends Generic1Key, T>(x: Bind<K, Gen1T<K, T>>): Gen1T<K, T> {
    return x.bind<T>(y => y);
}
