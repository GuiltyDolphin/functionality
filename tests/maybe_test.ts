import {
    assert,
    assertEquals,
    Test,
    testGroup,
} from './deps.ts';

import { maybe } from '../mod.ts';

testGroup('Maybe',
    testGroup('isNone',
        new Test('none is none', () => assert(maybe.none().isNone())),
        new Test('some is not none', () => assert(!(maybe.some(1).isNone()))),
    ),

    testGroup('isSome',
        new Test('some is some', () => assert(maybe.some(1).isSome())),
        new Test('none is not some', () => assert(!(maybe.none().isSome()))),
    ),

    testGroup('isMaybe',
        new Test('none is Maybe', () => assert(maybe.isMaybe(maybe.none()))),
        new Test('some is Maybe', () => assert(maybe.isMaybe(maybe.some(true)))),
        new Test('number is not Maybe', () => assert(!(maybe.isMaybe(1)))),
    ),

    new Test('fail is none', () => assertEquals(maybe.fail(), maybe.none())),

    new Test('pure is some', () => assertEquals(maybe.pure(7), maybe.some(7))),

    testGroup('map',
        new Test('map over none is none', () => assertEquals(maybe.none<number>().map(x => x + 1), maybe.none())),
        new Test('map over some is some', () => assertEquals(maybe.some(1).map(x => x + 1), maybe.some(2))),
    ),

    testGroup('maybe',
        new Test('maybe none is none branch', () => assertEquals(maybe.none<number>().maybe(1, x => x + 1), 1)),
        new Test('maybe some is some branch', () => assertEquals(maybe.some(2).maybe(1, x => x + 1), 3)),
    ),

    testGroup('maybef',
        new Test('maybef none is none branch', () => assertEquals(maybe.none<number>().maybef(() => 1, x => x + 1), 1)),
        new Test('maybef some is some branch', () => assertEquals(maybe.some(2).maybef(() => 1, x => x + 1), 3)),
    ),

    testGroup('join',
        new Test('join of none is none', () => assertEquals(maybe.join(maybe.none()), maybe.none())),
        new Test('join of some(none) is none', () => assertEquals(maybe.join(maybe.some(maybe.none())), maybe.none())),
        new Test('join of some(some) is some', () => assertEquals(maybe.join(maybe.some(maybe.some(3))), maybe.some(3))),
    ),

    testGroup('bind',
        new Test('bind none is none', () => assertEquals(maybe.none<number>().bind(x => maybe.pure(x + 1)), maybe.none())),
        new Test('bind some is some', () => assertEquals(maybe.some(2).bind(x => maybe.pure(x + 1)), maybe.some(3))),
    ),

    testGroup('unwrap',
        new Test('cannot unwrap a none', () => assert(!('unwrap' in maybe.none()))),
        new Test('unwrapping some is value', () => assertEquals(maybe.some(2).unwrap(), 2)),
    ),
).runAsMain();
