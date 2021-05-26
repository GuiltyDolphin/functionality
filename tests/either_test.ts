import {
    assert,
    assertEquals,
    assertThrows,
    Test,
    testGroup,
} from './deps.ts';

import { Either } from '../mod.ts';

testGroup('Either',
    testGroup('isLeft',
        new Test('left is left', () => assert(Either.left(1).isLeft())),
        new Test('right is not left', () => assert(!(Either.right(1).isLeft()))),
    ),

    testGroup('isRight',
        new Test('right is right', () => assert(Either.right(1).isRight())),
        new Test('left is not right', () => assert(!(Either.left(1).isRight()))),
    ),

    testGroup('isEither',
        new Test('left is Either', () => assert(Either.isEither(Either.left(1)))),
        new Test('right is either', () => assert(Either.isEither(Either.right(true)))),
        new Test('number is not Either', () => assert(!(Either.isEither(1)))),
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
