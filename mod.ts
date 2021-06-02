export * as Arrays from './src/array.ts';

import * as Functional from './src/functional.ts';

export const Either = Functional.Either;
export type Either<L, R> = Functional.Either<L, R>

export const Maybe = Functional.Maybe;
export type Maybe<T> = Functional.Maybe<T>;
