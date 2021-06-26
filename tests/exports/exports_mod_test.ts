import {
    assertExists,
    Test,
    testGroup,
} from '../deps.ts';

import {
    array,
    either,
    Either,
    fun,
    functor,
    generic,
    maybe,
    Maybe,
    monad,
    types,
    unwrap,
} from '../../mod.ts';

testGroup('mod.ts',
    new Test('exports array namespace', () => assertExists(array)),

    new Test('exports Either type', () => assertExists(true as unknown as Either<Number, Boolean>)),
    new Test('exports either namespace', () => assertExists(either)),

    new Test('exports fun namespace', () => assertExists(fun)),

    new Test('exports functor namespace', () => assertExists(functor)),

    new Test('exports generic namespace', () => assertExists(generic)),

    new Test('exports Maybe type', () => assertExists(true as unknown as Maybe<Number>)),
    new Test('exports maybe namespace', () => assertExists(maybe)),

    new Test('exports monad namespace', () => assertExists(monad)),

    new Test('exports types namespace', () => assertExists(types)),

    new Test('exports unwrap namespace', () => assertExists(unwrap)),
).runAsMain();
