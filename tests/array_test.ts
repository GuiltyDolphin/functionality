import { array } from '../mod.ts';

import {
    assert,
    assertEquals,
    assertExists,
    Test,
    testGroup,
    TestGroup,
} from './deps.ts';

function testExportDef(name: string): Test {
    return new Test(`exports ${name}`, () => {
        assertExists((array as any)[name], `exports definition ${name}`);
    });
}

testGroup('array exports',
    ...[
        'flatten',
        'head',
        'headDeep',
        'isNonEmpty',
        'replace',
        'replacing',
        'splitAt',
        'tail',
    ].map(testExportDef),
).runAsMain();

// testing existence of types
type _TestTypes = {
    t1: array.IndexRange,
    t2: array.NonEmpty<number>,
    t3: array.Nested<number>,
    t4: array.NotArray<number>,
    t5: array.SafeNested<number>,
    t6: array.NonEmptyNested<number>,
    t7: array.SafeNonEmptyNested<number>,
}

function testNoMutation<T>(description: string, arr: T[], body: (xs: T[]) => void): Test {
    return new Test(description, () => {
        const orig = arr.slice();
        body(arr);
        // and check that the original array was not modified
        assertEquals(arr, orig);
    });
}

function testFlatten<T>(description: string, unflattened: array.SafeNested<T>, expected: T[]): Test {
    return testNoMutation(description, unflattened, arr => assertEquals(array.flatten(arr), expected));
}

function testReplace<T>(description: string, orig: T[], range: array.IndexRange, val: T, expectedSegment: T[], expected: T[]): TestGroup {
    const arr = orig.slice();
    return testGroup(description,
        testNoMutation('inplace unspecified', arr, arr => assertEquals(array.replace(arr, range, val), expected)),
        testGroup('inplace',
            new Test('segment returned', () => {
                assertEquals(array.replace(arr, range, val, true), expectedSegment);
            }),
            new Test('array modified in place', () => {
                assertEquals(arr, expected);
            }),
        ),
    );
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
        testGroup('the returned list is not the same array object',
            new Test('inplace = false', () => {
                const arr = [1, 2, 3];
                assert(arr !== array.replace(arr, -1, 0));
            }),
            new Test('inplace = true', () => {
                const arr = [1, 2, 3];
                assert(arr !== array.replace(arr, -1, 0, true));
            }),
        ),
        testReplace('empty array', [], 0, 0, [], []),
        testReplace('i >= length', [1, 2, 3], 3, 0, [], [1, 2, 3]),
        testReplace('i < 0', [1, 2, 3], -1, 0, [], [1, 2, 3]),
        testReplace('element at start of array', [1, 2, 3], 0, 0, [1], [0, 2, 3]),
        testReplace('element in middle of array', [1, 2, 3], 1, 0, [2], [1, 0, 3]),
        testReplace('element at end of array', [1, 2, 3], 2, 0, [3], [1, 2, 0]),
        testGroup('range',
            testReplace('whole array', [1, 2, 3], [0, 2], 0, [1, 2, 3], [0]),
            testReplace('min < 0, max > size of array', [1, 2, 3], [-1, 3], 0, [1, 2, 3], [0]),
            testReplace('part of array', [1, 2, 3, 4], [1, 2], 0, [2, 3], [1, 0, 4]),
            testReplace('max < min', [1, 2, 3, 4], [2, 1], 0, [], [1, 2, 3, 4]),
        ),
    ),
).runAsMain();
