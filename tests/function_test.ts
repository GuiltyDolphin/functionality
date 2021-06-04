import * as fun from '../src/function.ts';

// testing existence of types
type _TestTypes = {
    t1: fun.HasRestParam<any>
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
