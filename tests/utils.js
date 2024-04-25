
export class Test {
    constructor(name, test, expected){
        this.test = test;
        this.name = name;
        this.expected = expected;
    }
    run(){
        const value = this.test.call({});
        const actual = JSON.stringify(value);
        const expected = JSON.stringify(this.expected)
        return {
            passed: JSON.stringify(this.expected) === JSON.stringify(value),
            actual,
            expected
        }
    }
}

export class Tests {
    constructor(tests){
        this.tests = tests;
    }   
    run(){
        for (const test of this.tests){
            const {passed, actual, expected} = test.run();
            if (passed) 
                console.log(`${test.name} passed:\n  Actual: ${actual}\n  Expected: ${expected}\n`)
            else 
                throw new Error(`${test.name} failed:\n  Actual: ${actual}\n  Expected: ${expected}`)
        }
    }
}
