import {
    assert,
    assertEquals,
    Test,
    testGroup,
} from './deps.ts';

import { Maybe } from '../mod.ts';

testGroup('Maybe',
    testGroup('isNone',
        new Test('none is none', () => assert(Maybe.none().isNone())),
        new Test('some is not none', () => assert(!(Maybe.some(1).isNone()))),
    ),

    testGroup('isSome',
        new Test('some is some', () => assert(Maybe.some(1).isSome())),
        new Test('none is not some', () => assert(!(Maybe.none().isSome()))),
    ),

    testGroup('isMaybe',
        new Test('none is Maybe', () => assert(Maybe.isMaybe(Maybe.none()))),
        new Test('some is Maybe', () => assert(Maybe.isMaybe(Maybe.some(true)))),
        new Test('number is not Maybe', () => assert(!(Maybe.isMaybe(1)))),
    ),

    new Test('fail is none', () => assertEquals(Maybe.fail(), Maybe.none())),

    new Test('pure is some', () => assertEquals(Maybe.pure(7), Maybe.some(7))),

    testGroup('map',
        new Test('map over none is none', () => assertEquals(Maybe.none<number>().map(x => x + 1), Maybe.none())),
        new Test('map over some is some', () => assertEquals(Maybe.some(1).map(x => x + 1), Maybe.some(2))),
    ),

    testGroup('maybe',
        new Test('maybe none is none branch', () => assertEquals(Maybe.none<number>().maybe(1, x => x + 1), 1)),
        new Test('maybe some is some branch', () => assertEquals(Maybe.some(2).maybe(1, x => x + 1), 3)),
    ),

    testGroup('maybef',
        new Test('maybef none is none branch', () => assertEquals(Maybe.none<number>().maybef(() => 1, x => x + 1), 1)),
        new Test('maybef some is some branch', () => assertEquals(Maybe.some(2).maybef(() => 1, x => x + 1), 3)),
    ),

    testGroup('join',
        new Test('join of none is none', () => assertEquals(Maybe.join(Maybe.none()), Maybe.none())),
        new Test('join of some(none) is none', () => assertEquals(Maybe.join(Maybe.some(Maybe.none())), Maybe.none())),
        new Test('join of some(some) is some', () => assertEquals(Maybe.join(Maybe.some(Maybe.some(3))), Maybe.some(3))),
    ),

    testGroup('bind',
        new Test('bind none is none', () => assertEquals(Maybe.none<number>().bind(x => Maybe.pure(x + 1)), Maybe.none())),
        new Test('bind some is some', () => assertEquals(Maybe.some(2).bind(x => Maybe.pure(x + 1)), Maybe.some(3))),
    ),

    testGroup('unwrap',
        new Test('cannot unwrap a none', () => assert(!('unwrap' in Maybe.none()))),
        new Test('unwrapping some is value', () => assertEquals(Maybe.some(2).unwrap(), 2)),
    ),
).runAsMain();
