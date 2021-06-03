import {
    assertExists,
    Test,
    testGroup,
} from '../deps.ts';

import {
    either,
    Either,
    maybe,
    Maybe,
} from '../../src/functional.ts';

testGroup('src/functional.ts',
    new Test('exports Either type', () => assertExists(true as unknown as Either<Number, Boolean>)),
    new Test('exports either namespace', () => assertExists(either)),

    new Test('exports Maybe type', () => assertExists(true as unknown as Maybe<Number>)),
    new Test('exports maybe namespace', () => assertExists(maybe)),
).runAsMain();
