export {
    assert,
    assertEquals,
    assertExists,
    assertThrows,
    Test,
    testGroup,
    TestGroup,
} from 'https://deno.land/x/dentest@v0.1.0/mod.ts';

import {
    assertExists,
    Test,
} from './deps.ts';

/** Test that a name exists on the given namespace. */
export function testExportDef(ns: any, name: string): Test {
    return new Test(`exports ${name}`, () => {
        assertExists(ns[name], `exports definition ${name}`);
    });
}

/** Test that each name exists on the given namespace. */
export function testExports(ns: any, names: string[]): Test[] {
    return names.map(n => testExportDef(ns, n));
}
