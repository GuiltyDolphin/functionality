import {
    assertExists,
    Test,
    testGroup,
} from '../deps.ts';

import {
    array,
    either,
    Either,
    maybe,
    Maybe,
    types,
} from '../../mod.ts';

testGroup('mod.ts',
    new Test('exports array namespace', () => assertExists(array)),

    new Test('exports Either type', () => assertExists(true as unknown as Either<Number, Boolean>)),
    new Test('exports either namespace', () => assertExists(either)),

    new Test('exports Maybe type', () => assertExists(true as unknown as Maybe<Number>)),
    new Test('exports maybe namespace', () => assertExists(maybe)),

    new Test('exports types namespace', () => assertExists(types)),
).runAsMain();
