import { Generic1Key } from './generic.ts';

export interface Functor<K extends Generic1Key, T> {
    map<R>(f: (t: T) => R): Functor<K, R>
}
