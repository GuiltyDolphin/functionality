interface Functor<K extends Generic1Key, T> {
    map<R>(f: (t: T) => R): Functor<K, R>
}
