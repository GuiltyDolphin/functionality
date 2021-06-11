import {
    And,
    Constructor,
    ExceptKeysOfType,
    Extends,
    Is,
    ITE,
    KeysOfType,
    Not,
    OmitWithType,
    Or,
    PickWithType,
    Unless,
    When,
} from '../src/types.ts';

class NotTest {
    notTrue: Not<true> = false;
    notFalse: Not<false> = true;
}

class AndTest {
    andFalseFalse: And<false, false> = false;
    andFalseTrue: And<false, true> = false;
    andTrueFalse: And<true, false> = false;
    andTrueTrue: And<true, true> = true;
}

class OrTest {
    orFalseFalse: Or<false, false> = false;
    orFalseTrue: Or<false, true> = true;
    orTrueFalse: Or<true, false> = true;
    orTrueTrue: Or<true, true> = true;
}

class ITETest {
    iteFalse: ITE<false, number, string> = 'test';
    iteTrue: ITE<true, number, string> = 1;
}

class WhenTest {
    whenFalse1: Is<never, When<false, number>> = true;
    whenFalse2: Is<number, When<false, number>> = false;
    whenTrue1: Is<number, When<true, number>> = true;
    whenTrue2: Is<never, When<true, number>> = false;
}

class UnlessTest {
    unlessFalse1: Is<never, Unless<false, number>> = false;
    unlessFalse2: Is<number, Unless<false, number>> = true;
    unlessTrue1: Is<number, Unless<true, number>> = false;
    unlessTrue2: Is<never, Unless<true, number>> = true;
}

class ExtendsTest<P, Q, R> {
    xExtendsX: Extends<[P], [P]> = true;
    notNumberExtendsString: Extends<number, string> = false;
    numberExtendsNumber: Extends<number, number> = true;
    num7ExtendsNumber: Extends<7, number> = true;
    notNumberExtendsNum7: Extends<number, 7> = false;
    restArgsExtendsFn: Extends<(x: Q) => P, (x: Q, ...xs: R[]) => P> = true;
    fnExtendsRestArgs: Extends<(x: Q, ...xs: R[]) => P, (x: Q) => P> = true;
    neverExtendsNever: Extends<never, never> = true;
    notNumberExtendsNever: Extends<number, never> = false;
}

class IsTest<P, Q, R> {
    xIsX: Is<P, P> = true;
    numberIsNumber: Is<number, number> = true;
    numberIsNotString: Is<number, string> = false;
    restArgsIsFn: Is<(x: Q) => P, (x: Q, ...xs: R[]) => P> = true;
    neverIsNever: Is<never, never> = true;
    numberIsNotNever: Is<number, never> = false;
}

class KeysOfTypeTest {
    canPickNever: Is<KeysOfType<{ x: never }, never>, "x"> = true;
    pickingWhenThereIsNoMatchIsNever: Is<KeysOfType<{ x: number, y: string }, boolean>, never> = true;
    pickingWithPartialMatchIsJustTheMatchingKeys: Is<KeysOfType<{ x: number, y: string, z: string }, string>, "y" | "z"> = true;
    pickingWithUnion: Is<KeysOfType<{ x: number, y: string, z: boolean }, number | string>, "x" | "y"> = true;
}

class ExceptKeysOfTypeTest {
    canExcludeNever: Is<ExceptKeysOfType<{ x: never }, never>, never> = true;
    excludingWhenThereIsNoMatchIsAllKeys: Is<ExceptKeysOfType<{ x: number, y: string }, boolean>, "x" | "y"> = true;
    excludingWithPartialMatchIsJustTheNonMatchingKeys: Is<ExceptKeysOfType<{ x: number, y: string, z: string }, string>, "x"> = true;
    excludingWithUnion: Is<ExceptKeysOfType<{ x: number, y: string, z: boolean }, number | string>, "z"> = true;
}

class OmitWithTypeTest {
    canOmitNever: Is<OmitWithType<{ x: never }, never>, {}> = true;
    omittingWhenThereIsNoMatchIsOriginalType: Is<OmitWithType<{ x: number, y: string }, boolean>, { x: number, y: string }> = true;
    omittingWithPartialMatchIsJustTheNonMatchingKeys: Is<OmitWithType<{ x: number, y: string, z: string }, string>, { x: number }> = true;
    omittingWithUnion: Is<OmitWithType<{ x: number, y: string, z: boolean }, number | string>, { z: boolean }> = true;
}

class PickWithTypeTest {
    canPickNever: Is<PickWithType<{ x: never }, never>, { x: never }> = true;
    pickingWhenThereIsNoMatchIsEmptyObjectType: Is<PickWithType<{ x: number, y: string }, boolean>, {}> = true;
    pickingWithPartialMatchIsJustTheMatchingKeys: Is<PickWithType<{ x: number, y: string, z: string }, string>, { y: string, z: string }> = true;
    pickingWithUnion: Is<PickWithType<{ x: number, y: string, z: boolean }, number | string>, { x: number, y: string }> = true;
}

class SimpleClass {
    x: number;
    y: boolean;

    constructor(x: number, y: boolean) {
        this.x = x;
        this.y = y;
    }
}

type SimpleClassConstructor = typeof SimpleClass;

class C1 {
    x: number;
    constructor(x: number) {
        this.x = x;
    }
}

class C2 extends C1 {
    y: boolean

    constructor(x: number) {
        super(x)
        this.y = true;
    }
}

type C1Constructor = typeof C1;
type C2Constructor = typeof C2;

class ConstructorTest {
    constructorNoArgs: Extends<SimpleClassConstructor, Constructor> = true;
    constructorWithTypeArg: Is<SimpleClassConstructor, Constructor<SimpleClass>> = true;
    constructorWithTypeArgBad: Extends<SimpleClassConstructor, Constructor<Boolean>> = false;
    constructorWithTypeAndParamArg: Is<SimpleClassConstructor, Constructor<SimpleClass, [number, boolean]>> = true;
    constructorWithTypeAndParamArgIncorrect: Is<SimpleClassConstructor, Constructor<SimpleClass, [boolean, boolean]>> = false;

    constructorsWithExtends = class {
        refl1: Is<C1Constructor, Constructor<C1>> = true;
        refl2: Is<C2Constructor, Constructor<C2>> = true;
        notConstructorOfChild: Is<C1Constructor, Constructor<C2>> = false;
        notExtendsConstructorOfChild: Extends<C1Constructor, Constructor<C2>> = false;
        notConstructorOfParent: Is<C2Constructor, Constructor<C1>> = false;
        extendsConstructorOfParent: Extends<C2Constructor, Constructor<C1>> = true;
    }
}
