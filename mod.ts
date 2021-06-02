export * as array from './src/array.ts';

import * as functional from './src/functional.ts';

export const Either = functional.Either;
export type Either<L, R> = functional.Either<L, R>

export const Maybe = functional.Maybe;
export type Maybe<T> = functional.Maybe<T>;
