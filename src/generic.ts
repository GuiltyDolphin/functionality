// see https://stackoverflow.com/a/55694876 for more on using
// interfaces as type stores
export interface Generic1<T> { }

export type Generic1Key = keyof Generic1<any>

export type Gen1T<K extends Generic1Key, T> = Generic1<T>[K]
