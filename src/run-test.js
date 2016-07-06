const test = require("tape")
const parse = require("./parse")
const run = require("./run")

function runProgram (str, env = {}) {
    return run(parse(str), env)
}

test("put values on the stack", (t) => {
    const res = runProgram(`1 3 "foo"`)
    t.deepEquals(res, [1, 3, "foo"])
    t.end()
})

test("basic math", (t) => {
    t.deepEquals(runProgram(`1 2 +`), [3])
    t.deepEquals(runProgram(`5 3 -`), [2])
    t.deepEquals(runProgram(`5 1 2 + -`), [2])
    t.deepEquals(runProgram(`10 3 /`), [10 / 3])
    t.deepEquals(runProgram(`10 3 div`), [3])
    t.deepEquals(runProgram(`5 2 mod`), [1])
    t.deepEquals(runProgram(`5 2 divmod`), [2, 1])
    t.end()
})

test("logic", (t) => {
    t.deepEquals(runProgram("true"), [true])
    t.deepEquals(runProgram("true false or"), [true])
    t.deepEquals(runProgram("true false and"), [false])
    t.deepEquals(runProgram("true false xor"), [true])
    t.deepEquals(runProgram("true not"), [false])
    t.end()
})

test("stack operators", (t) => {
    t.deepEquals(runProgram("1 dup"), [1, 1])
    t.deepEquals(runProgram("1 drop"), [])
    t.deepEquals(runProgram("1 2 swap"), [2, 1])
    t.deepEquals(runProgram("1 2 over"), [1, 2, 1])
    t.deepEquals(runProgram("1 2 3 rot"), [2, 3, 1])
    t.deepEquals(runProgram("1 2 3 -rot"), [3, 1, 2])
    t.end()
})

test("comparison", (t) => {
    t.deepEquals(runProgram("1 1 ="), [true])
    t.deepEquals(runProgram(`"foo" "foo" =`), [true])
    t.deepEquals(runProgram("1 2 >"), [false])
    t.deepEquals(runProgram("1 2 <="), [true])
    t.deepEquals(runProgram("1 0 > 3 5 ?"), [3])
    t.end()
})

test("define words", (t) => {
    t.deepEquals(runProgram(`: add2 2 + ; 5 add2`), [7])
    t.end()
})
