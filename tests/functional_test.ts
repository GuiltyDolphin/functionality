import {
    assert,
    assertEquals,
    assertThrows,
    Test,
    testGroup,
} from './deps.ts';

import { Either, Maybe } from '../src/functional.ts';

testGroup('Either',
    testGroup('isLeft',
        new Test('left is left', () => assert(Either.left(1).isLeft())),
        new Test('right is not left', () => assert(!(Either.right(1).isLeft()))),
    ),

    testGroup('isRight',
        new Test('right is right', () => assert(Either.right(1).isRight())),
        new Test('left is not right', () => assert(!(Either.left(1).isRight()))),
    ),

    new Test('fail is left', () => assertEquals(Either.fail(7), Either.left(7))),

    new Test('pure is right', () => assertEquals(Either.pure(7), Either.right(7))),

    testGroup('map',
        new Test('over left is left', () => assertEquals(Either.left<number, number>(1).map(x => x + 1), Either.left(1))),
        new Test('over right is right', () => assertEquals(Either.right<number, number>(2).map(x => x + 1), Either.right(3))),
    ),

    testGroup('mapBoth',
        new Test('over left is left', () => assertEquals(Either.left<number, number>(1).mapBoth(l => l + 1, r => r + 2), Either.left(2))),
        new Test('over right is right', () => assertEquals(Either.right<number, number>(2).mapBoth(l => l + 1, r => r + 2), Either.right(4))),
    ),

    testGroup('either',
        new Test('left is left branch', () => assertEquals(Either.left<number, number>(1).either(l => l + 1, r => r + 2), 2)),
        new Test('right is right branch', () => assertEquals(Either.right<number, number>(1).either(l => l + 1, r => r + 2), 3)),
    ),

    testGroup('joinLeft',
        new Test('join of left is left', () => assertEquals(Either.joinLeft(Either.left(1)), Either.left(1))),
        new Test('join of right(left) is left', () => assertEquals(Either.joinLeft(Either.right(Either.left(true))), Either.left(true))),
        new Test('join of right(right) is right', () => assertEquals(Either.joinLeft(Either.right(Either.right(2))), Either.right(2))),
    ),

    testGroup('mapCollecting',
        new Test('left is left', () => assertEquals(Either.left<number, number>(1).mapCollecting(x => Either.pure(x + 1)), Either.left(1))),
        new Test('right is right', () => assertEquals(Either.right(1).mapCollecting(x => Either.pure(x + 1)), Either.right(2))),
    ),

    testGroup('bind',
        new Test('bind left is left', () => assertEquals(Either.left<number, number>(1).bind(x => Either.pure(x + 1)), Either.left(1))),
        new Test('bind right is right', () => assertEquals(Either.right(1).bind(x => Either.pure(x + 1)), Either.right(2))),
    ),

    testGroup('unwrap',
        new Test('from pure', () => assertEquals(Either.pure(1).unwrap(), 1)),
        new Test('from fail', () => assertEquals(Either.fail(2).unwrap(), 2)),
    ),

    testGroup('unwrapLeft',
        new Test('cannot left-unwrap a right', () => assert(!('unwrapLeft' in Either.right(1)))),
        new Test('unwrapping left is value', () => assertEquals(Either.left(2).unwrapLeft(), 2)),
    ),

    testGroup('unwrapRight',
        new Test('cannot right-unwrap a left', () => assert(!('unwrapRight' in Either.left(1)))),
        new Test('unwrapping right is value', () => assertEquals(Either.right(2).unwrapRight(), 2)),
    ),

    testGroup('propLeft',
        new Test('propagating left is left', () => assertEquals(Either.left(1).propLeft(), Either.left(1))),
        new Test('cannot left-propagate a right', () => assert(!('propLeft' in Either.right(2)))),
    ),

    testGroup('propRight',
        new Test('propagating right is right', () => assertEquals(Either.right(1).propRight(), Either.right(1))),
        new Test('cannot right-propagate a left', () => assert(!('propRight' in Either.left(2)))),
    ),

    testGroup('orThrow',
        new Test('right is value', () => assertEquals(Either.right(1).orThrow(), 1)),
        new Test('left is throw', () => assertThrows(() => Either.left(new Error('throw me')).orThrow(), Error, 'throw me')),
    ),

    testGroup('unEither',
        new Test('left is value', () => assertEquals(Either.unEither(Either.left(1)), 1)),
        new Test('right is value', () => assertEquals(Either.unEither(Either.right(2)), 2)),
    ),

    testGroup('catEithers',
        new Test('empty is empty right', () => assertEquals(Either.catEithers([]), Either.right([]))),
        new Test('there is a left gives first left', () => assertEquals(Either.catEithers([Either.right(1), Either.left(2), Either.right(3), Either.left(4)]), Either.left(2))),
        new Test('there are no lefts gives all rights', () => assertEquals(Either.catEithers([Either.right(1), Either.right(3)]), Either.right([1, 3]))),
    ),
).runAsMain();

testGroup('Maybe',
    testGroup('isNone',
        new Test('none is none', () => assert(Maybe.none().isNone())),
        new Test('some is not none', () => assert(!(Maybe.some(1).isNone()))),
    ),

    testGroup('isSome',
        new Test('some is some', () => assert(Maybe.some(1).isSome())),
        new Test('none is not some', () => assert(!(Maybe.none().isSome()))),
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
