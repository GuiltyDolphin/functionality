import * as either from './either.ts';
export const Either = either;
export type Either<L, R> = either.Either<L, R>;

import * as maybe from './maybe.ts';
export const Maybe = maybe;
export type Maybe<T> = maybe.Maybe<T>;
