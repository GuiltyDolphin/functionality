// see https://stackoverflow.com/a/55694876 for more on using
// interfaces as type stores
interface Generic1<T> { }

type Generic1Key = keyof Generic1<any>

type Gen1T<K extends Generic1Key, T> = Generic1<T>[K]
