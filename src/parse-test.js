const test = require("tape")
const parse = require("./parse")
const { actions } = require("./schema")

function parseToken (program) {
    return parse(program).payload[0]
}

test.skip("parse error ", (t) => {
    const ast = parseToken(`foo 12.e`)
    t.equals(ast.type, actions.parseError)
    t.end()
})

test("parse a number", (t) => {
    const ast = parseToken(`-123.45`)
    t.equals(ast.type, actions.number)
    t.equals(ast.payload, -123.45)
    t.end()
})

test("parse a quoted string", (t) => {
    const ast = parseToken(`"foo"`)
    t.equals(ast.type, actions.string)
    t.equals(ast.payload, "foo")
    t.end()
})

test("parse a word", (t) => {
    const ast = parseToken(`foo`)
    t.equals(ast.type, actions.word)
    t.equals(ast.payload, "foo")
    t.end()
})

test("parse a program", (t) => {
    const ast = parse(`1   2 +
        [ "foo" "bar" ] eval ++
        `)
    t.deepEquals(ast, {
        type: "program",
        payload: [
            { type: "number", payload: 1 },
            { type: "number", payload: 2 },
            { type: "word",   payload: "+" },
            { type: "word",   payload: "[" },
            { type: "string", payload: "foo" },
            { type: "string", payload: "bar" },
            { type: "word",   payload: "]" },
            { type: "word",   payload: "eval" },
            { type: "word",   payload: "++" },
        ]
    })
    t.end()
})