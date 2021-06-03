import { array } from '../mod.ts';

import {
    assert,
    assertEquals,
    Test,
    testGroup,
} from './deps.ts';

function testFlatten<T>(description: string, unflattened: array.SafeNested<T>, expected: T[]): Test {
    return new Test(description, () => {
        const orig = unflattened.slice();
        assertEquals(array.flatten(unflattened), expected);
        // and check that the original array was not modified
        assertEquals(unflattened, orig);
    });
}

testGroup('array',
    testGroup('splitAt',
        testGroup('array = [1, 2, 3]',
            new Test('n = 0', () => assertEquals(array.splitAt(0, [1, 2, 3]), [[], [1, 2, 3]])),
            new Test('n=1', () => assertEquals(array.splitAt(1, [1, 2, 3]), [[1], [2, 3]])),
            new Test('n=2 (last index of array)', () => assertEquals(array.splitAt(2, [1, 2, 3]), [[1, 2], [3]])),
            new Test('n=3 (size of array)', () => assertEquals(array.splitAt(3, [1, 2, 3]), [[1, 2, 3], []])),
        ),
    ),
    testGroup('isNonEmpty',
        new Test('empty array is not non-empty', () => assert(!array.isNonEmpty([]))),
        new Test('non-empty array is non-empty', () => assert(array.isNonEmpty([1]))),
    ),
    testGroup('head',
        new Test('singleton array', () => assertEquals(array.head([1]), 1)),
        new Test('multi-element array', () => assertEquals(array.head([[2, 3], [4]]), [2, 3])),
    ),
    testGroup('tail',
        new Test('singleton array', () => assertEquals(array.tail([1]), [])),
        new Test('multi-element array', () => assertEquals(array.tail([1, 2, 3]), [2, 3])),
    ),
    testGroup('headDeep',
        new Test('flat array', () => assertEquals(array.headDeep([1, 2, 3]), 1)),
        new Test('nested array (1 level)', () => assertEquals(array.headDeep([[2, 3], 4]), 2)),
        new Test('nested array (3 levels)', () => assertEquals(array.headDeep([[[[2], [3]]], 4]), 2)),
    ),
    testGroup('flatten',
        testFlatten("[]", [], []),
        testFlatten("[1234]", [1, 2, 3, 4], [1, 2, 3, 4]),
        testFlatten("[1,[2,[3,[4]]]]", [1, [2, [3, [4]]]], [1, 2, 3, 4]),
        testFlatten("[[[[1],2],3,],4]", [[[[1], 2], 3], 4], [1, 2, 3, 4]),
        testFlatten("[[1], [[[[2], [3]]]], 4]", [[1], [[[[2], [3]]]], 4], [1, 2, 3, 4]),
        testFlatten("[[undefined], [[[[undefined], [undefined]]]], undefined]", [[undefined], [[[[undefined], [undefined]]]], undefined], [undefined, undefined, undefined, undefined]),
    ),
    testGroup('replace',
        new Test('the returned list is not the same array object', () => {
            const arr = [1, 2, 3];
            assert(arr !== array.replace(arr, -1, 0));
        }),
        new Test('empty array', () => assertEquals(array.replace([], 0, 0), [])),
        new Test('i >= length', () => assertEquals(array.replace([1, 2, 3], 3, 0), [1, 2, 3])),
        new Test('i < 0', () => assertEquals(array.replace([1, 2, 3], -1, 0), [1, 2, 3])),
        new Test('element at start of array', () => assertEquals(array.replace([1, 2, 3], 0, 0), [0, 2, 3])),
        new Test('element in middle of array', () => assertEquals(array.replace([1, 2, 3], 1, 0), [1, 0, 3])),
        new Test('element at end of array', () => assertEquals(array.replace([1, 2, 3], 2, 0), [1, 2, 0])),
        testGroup('range',
            new Test('whole array', () => assertEquals(array.replace([1, 2, 3], [0, 2], 0), [0])),
            new Test('min < 0, max > size of array', () => assertEquals(array.replace([1, 2, 3], [-1, 3], 0), [0])),
            new Test('part of array', () => assertEquals(array.replace([1, 2, 3, 4], [1, 2], 0), [1, 0, 4])),
            new Test('max < min', () => assertEquals(array.replace([1, 2, 3, 4], [2, 1], 0), [1, 2, 3, 4])),
        ),
    ),
).runAsMain();
