const test = require("tape")
const parse = require("./parse")
const run = require("./run")

function programIs (t, str, output, env = {}) {
    return t.deepEquals(run(parse(str), env), output)
}

test("put values on the stack", (t) => {
    programIs(t, `1 3 "foo"`, [1, 3, "foo"])
    t.end()
})

test("drop comments", (t) => {
    programIs(t, `1 2 (comment) 3`, [1, 2, 3])
    t.end()
})

test("basic math", (t) => {
    programIs(t, `1 2 +`, [3])
    programIs(t, `5 3 -`, [2])
    programIs(t, `5 1 2 + -`, [2])
    programIs(t, `10 3 /`, [10 / 3])
    programIs(t, `10 3 div`, [3])
    programIs(t, `5 2 mod`, [1])
    programIs(t, `5 2 divmod`, [2, 1])
    t.end()
})

test("logic", (t) => {
    programIs(t, "true", [true])
    programIs(t, "true false or", [true])
    programIs(t, "true false and", [false])
    programIs(t, "true false xor", [true])
    programIs(t, "true not", [false])
    t.end()
})

test("stack operators", (t) => {
    programIs(t, `1 dup`, [1, 1])
    programIs(t, `1 drop`, [])
    programIs(t, `1 2 swap`, [2, 1])
    programIs(t, `1 2 over`, [1, 2, 1])
    programIs(t, `1 2 3 rot`, [2, 3, 1])
    programIs(t, `1 2 3 -rot`, [3, 1, 2])
    programIs(t, `1 2 3 clear 1`, [1])
    t.end()
})

test("return stack", (t) => {
    programIs(t, `1 2 rpush 3 + rpop -`, [2])
    t.end()
})

test("comparison", (t) => {
    programIs(t, `1 1 =`, [true])
    programIs(t, `"foo" "foo" =`, [true])
    programIs(t, `1 2 >`, [false])
    programIs(t, `1 2 <=`, [true])
    programIs(t, `1 0 > 3 5 ?`, [3])
    t.end()
})

test("define words", (t) => {
    programIs(t, `: add2 2 + ; 5 add2`, [7])
    t.end()
})

test("substack basics", (t) => {
    programIs(t, `1 quote 2 push 3 push apply`, [1, 2, 3])
    t.end()
})

test("substack literals", (t) => {
    programIs(t, `[1 2 3] apply`, [1, 2, 3])
    programIs(t, `[1 2 3] pop swap apply`, [3, 1, 2])
    programIs(t, `[1 2 3] 1 split swap concat apply`, [2, 3, 1])
    t.end()
})

test("substack ins", (t) => {
    programIs(t, `[ 1 2 3 ] [ 2 * ] ins apply`, [2, 4, 6])
    programIs(t, `[ 1 2 3 ] [ 10 swap - ] ins apply`, [9, 8, 7])
    programIs(t, `[ 1 2 3 ] [ dup ] ins apply`, [1, 1, 2, 2, 3, 3])
    programIs(t, `[ 1 2 3 ] [ ] ins apply`, [1, 2, 3])
    programIs(t, `
        : drop-if-even  dup even? [ drop ] if ;
        [ 1 2 3 ] [ drop-if-even ] ins apply`, [1, 3])
    t.end()
})

test("nested substacks", (t) => {
    programIs(t, `[ 1 2 3 [ + + ] apply ] apply`, [6])
    t.end()
})

test("eval", (t) => {
    programIs(t, `1 2 '+ eval`, [3])
    programIs(t, `"1 2" eval`, [1, 2])
    programIs(t, `"[ 1 2 ]" eval apply`, [1, 2])
    t.end()
})

test("immutability", (t) => {
    programIs(t, `[1 2] dup 3 push drop apply`, [1, 2])
    programIs(t, `[1 2] dup 3 push swap drop apply`, [1, 2, 3])
    t.end()
})
