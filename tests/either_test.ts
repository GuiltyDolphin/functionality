import {
    assert,
    assertEquals,
    assertThrows,
    Test,
    testGroup,
} from './deps.ts';

import { either } from '../mod.ts';

testGroup('Either',
    testGroup('isLeft',
        new Test('left is left', () => assert(either.left(1).isLeft())),
        new Test('right is not left', () => assert(!(either.right(1).isLeft()))),
    ),

    testGroup('isRight',
        new Test('right is right', () => assert(either.right(1).isRight())),
        new Test('left is not right', () => assert(!(either.left(1).isRight()))),
    ),

    testGroup('isEither',
        new Test('left is Either', () => assert(either.isEither(either.left(1)))),
        new Test('right is either', () => assert(either.isEither(either.right(true)))),
        new Test('number is not Either', () => assert(!(either.isEither(1)))),
    ),

    new Test('fail is left', () => assertEquals(either.fail(7), either.left(7))),

    new Test('pure is right', () => assertEquals(either.pure(7), either.right(7))),

    testGroup('map',
        new Test('over left is left', () => assertEquals(either.left<number, number>(1).map(x => x + 1), either.left(1))),
        new Test('over right is right', () => assertEquals(either.right<number, number>(2).map(x => x + 1), either.right(3))),
    ),

    testGroup('mapBoth',
        new Test('over left is left', () => assertEquals(either.left<number, number>(1).mapBoth(l => l + 1, r => r + 2), either.left(2))),
        new Test('over right is right', () => assertEquals(either.right<number, number>(2).mapBoth(l => l + 1, r => r + 2), either.right(4))),
    ),

    testGroup('either',
        new Test('left is left branch', () => assertEquals(either.left<number, number>(1).either(l => l + 1, r => r + 2), 2)),
        new Test('right is right branch', () => assertEquals(either.right<number, number>(1).either(l => l + 1, r => r + 2), 3)),
    ),

    testGroup('joinLeft',
        new Test('join of left is left', () => assertEquals(either.joinLeft(either.left(1)), either.left(1))),
        new Test('join of right(left) is left', () => assertEquals(either.joinLeft(either.right(either.left(true))), either.left(true))),
        new Test('join of right(right) is right', () => assertEquals(either.joinLeft(either.right(either.right(2))), either.right(2))),
    ),

    testGroup('mapCollecting',
        new Test('left is left', () => assertEquals(either.left<number, number>(1).mapCollecting(x => either.pure(x + 1)), either.left(1))),
        new Test('right is right', () => assertEquals(either.right(1).mapCollecting(x => either.pure(x + 1)), either.right(2))),
    ),

    testGroup('bind',
        new Test('bind left is left', () => assertEquals(either.left<number, number>(1).bind(x => either.pure(x + 1)), either.left(1))),
        new Test('bind right is right', () => assertEquals(either.right(1).bind(x => either.pure(x + 1)), either.right(2))),
    ),

    testGroup('unwrap',
        new Test('from pure', () => assertEquals(either.pure(1).unwrap(), 1)),
        new Test('from fail', () => assertEquals(either.fail(2).unwrap(), 2)),
    ),

    testGroup('unwrapLeft',
        new Test('cannot left-unwrap a right', () => assert(!('unwrapLeft' in either.right(1)))),
        new Test('unwrapping left is value', () => assertEquals(either.left(2).unwrapLeft(), 2)),
    ),

    testGroup('unwrapRight',
        new Test('cannot right-unwrap a left', () => assert(!('unwrapRight' in either.left(1)))),
        new Test('unwrapping right is value', () => assertEquals(either.right(2).unwrapRight(), 2)),
    ),

    testGroup('propLeft',
        new Test('propagating left is left', () => assertEquals(either.left(1).propLeft(), either.left(1))),
        new Test('cannot left-propagate a right', () => assert(!('propLeft' in either.right(2)))),
    ),

    testGroup('propRight',
        new Test('propagating right is right', () => assertEquals(either.right(1).propRight(), either.right(1))),
        new Test('cannot right-propagate a left', () => assert(!('propRight' in either.left(2)))),
    ),

    testGroup('orThrow',
        new Test('right is value', () => assertEquals(either.right(1).orThrow(), 1)),
        new Test('left is throw', () => assertThrows(() => either.left(new Error('throw me')).orThrow(), Error, 'throw me')),
    ),

    testGroup('unEither',
        new Test('left is value', () => assertEquals(either.unEither(either.left(1)), 1)),
        new Test('right is value', () => assertEquals(either.unEither(either.right(2)), 2)),
    ),

    testGroup('catEithers',
        new Test('empty is empty right', () => assertEquals(either.catEithers([]), either.right([]))),
        new Test('there is a left gives first left', () => assertEquals(either.catEithers([either.right(1), either.left(2), either.right(3), either.left(4)]), either.left(2))),
        new Test('there are no lefts gives all rights', () => assertEquals(either.catEithers([either.right(1), either.right(3)]), either.right([1, 3]))),
    ),
).runAsMain();
