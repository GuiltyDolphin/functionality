import * as fun from '../src/function.ts';

import {
    assertStrictEquals,
    testExports,
    testGroup,
    Test,
} from './deps.ts';

import { Is } from '../src/types.ts';

testGroup('fun exports',
    ...testExports(fun, [
        'withoutRestParam',
    ]),
).runAsMain();

// testing existence of types
type _TestTypes = {
    t1: fun.HasRestParam<any>
    t2: fun.WithoutRestParam<any>
}

class HasRestParamTests {
    noArgs: fun.HasRestParam<() => number> = false;
    oneArgNoRest: fun.HasRestParam<(x: number) => number> = false;
    oneArgIsRest: fun.HasRestParam<(...x: number[]) => number> = true;
    oneArgIsArray: fun.HasRestParam<(x: number[]) => number> = false;
    twoArgsNoRest: fun.HasRestParam<(x: number, y: boolean) => number> = false;
    twoArgsLastIsRest: fun.HasRestParam<(x: number, ...y: boolean[]) => number> = true;
    // you can have a parameter like (...x: [number, boolean]), which looks like a rest parameter, but isn't really.
    oneArgRestTrick: fun.HasRestParam<(...y: [number, boolean]) => number> = false;
    twoArgsRestTrick: fun.HasRestParam<(x: boolean[], ...y: [number, boolean]) => number> = false;
    oneArgRestTrickButIsRest: fun.HasRestParam<(...xs: [number, ...number[]]) => number> = true;
    oneArgRestTrickLastIsArray: fun.HasRestParam<(x: number, ...xs: [number, number[]]) => number> = false;
}

class WithoutRestParamTests {
    oneRestArg = () => {
        const f = (...x: number[]) => 7;
        const wout = fun.withoutRestParam(f);
        const isRemoved: fun.HasRestParam<typeof wout> = false;
        const res: Is<typeof wout, () => number> = true;
    }

    oneMixedArg = () => {
        const f = (...x: [boolean, ...number[]]) => 7;
        const wout = fun.withoutRestParam(f);
        const isRemoved: fun.HasRestParam<typeof wout> = false;
        const res: Is<typeof wout, (x: boolean) => number> = true;
    }

    threeArgsAndAMixedRest = () => {
        const f = (x: number, y: boolean, ...z: [string, ...boolean[]]) => 7;
        const wout = fun.withoutRestParam(f);
        const isRemoved: fun.HasRestParam<typeof wout> = false;
        const res: Is<typeof wout, (x: number, y: boolean, z: string) => number> = true;
    }
}

testGroup('fun',
    testGroup('withoutRestParam',
        new Test('the function returned is the exact same function', () => {
            const f = (...args: number[]) => 1;
            assertStrictEquals(fun.withoutRestParam(f), f);
        }),
    ),
).runAsMain();
